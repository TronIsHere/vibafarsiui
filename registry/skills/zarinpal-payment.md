# Zarinpal payment gateway (Next.js / Node.js)

Hand this document to an AI or developer to implement Zarinpal in any
Next.js or Node.js project from scratch.

## Table of contents

1. Overview
2. Environment variables
3. Zarinpal API reference
4. Payment flow
5. Database model
6. API route: create payment request
7. API route: verify payment callback
8. Frontend integration
9. Error handling
10. Security checklist
11. Testing and sandbox

---

## Overview

Zarinpal is an Iranian payment gateway. The integration has **two steps**:

```
User clicks "Pay"
      │
      ▼
[Your Server] ──POST──▶ Zarinpal /request  ──▶ returns authority token
      │
      ▼
Redirect user to Zarinpal payment page (StartPay URL)
      │
      ▼
User completes payment on Zarinpal
      │
      ▼
Zarinpal redirects back to your callback URL with ?Authority=...&Status=OK
      │
      ▼
[Your Server] ──POST──▶ Zarinpal /verify  ──▶ returns ref_id (success)
      │
      ▼
Grant product/service to user, save transaction record
```

---

## Environment variables

```env
# Required
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Optional: set to true for sandbox/test mode (default: production)
ZARINPAL_SANDBOX=true

# Required: your app's public base URL (used to build the callback URL)
NEXTAUTH_URL=https://yourdomain.com
# or
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

**Important:** `ZARINPAL_MERCHANT_ID` must **never** be exposed to the client.
Keep it server-side only.

---

## Zarinpal API reference

### Base URLs

| Mode | Base URL |
|---|---|
| Sandbox | `https://sandbox.zarinpal.com` |
| Production | `https://payment.zarinpal.com` |

### Endpoints

| Action | Full URL |
|---|---|
| Create request | `{BASE}/pg/v4/payment/request.json` |
| Verify payment | `{BASE}/pg/v4/payment/verify.json` |
| StartPay (sandbox) | `https://sandbox.zarinpal.com/pg/StartPay/{authority}` |
| StartPay (production) | `https://www.zarinpal.com/pg/StartPay/{authority}` |

### Step 1: create payment request

**POST** `{BASE}/pg/v4/payment/request.json`

Request body:

```json
{
  "merchant_id": "your-merchant-id",
  "amount": 490000,
  "callback_url": "https://yourdomain.com/api/payment/zarinpal/verify",
  "description": "Purchase description",
  "metadata": {
    "mobile": "09120000000",
    "email": "user@example.com"
  }
}
```

> **Currency:** Zarinpal API expects **Rial**. If your app stores prices in
> **Toman**, multiply by 10 before sending.
> Example: 49,000 Toman × 10 = 490,000 Rial.

Successful response:

```json
{
  "data": {
    "code": 100,
    "message": "Success",
    "authority": "A000000000000000000000000000000000",
    "fee_type": "Merchant",
    "fee": 0
  },
  "errors": []
}
```

Check `data.code === 100` and `data.authority` is present.

### Step 2: verify payment

**POST** `{BASE}/pg/v4/payment/verify.json`

Request body:

```json
{
  "merchant_id": "your-merchant-id",
  "amount": 490000,
  "authority": "A000000000000000000000000000000000"
}
```

> Send the **same amount (in Rial)** used in the request step.

Successful response:

```json
{
  "data": {
    "code": 100,
    "ref_id": 12345678,
    "message": "Paid",
    "card_hash": "...",
    "card_pan": "...",
    "fee_type": "Merchant",
    "fee": 0
  },
  "errors": []
}
```

**Verification codes:**

| Code | Meaning |
|---|---|
| 100 | Payment verified successfully (first time) |
| 101 | Payment already verified (duplicate callback) |
| Other | Failure: do not grant the product |

---

## Payment flow

1. User initiates payment on your frontend.
2. Frontend sends `POST /api/payment/zarinpal/request` with purchase details.
3. Your server validates the user and purchase details.
4. Your server calls Zarinpal `/request.json` and gets `authority`.
5. Your server saves a `pending` billing/transaction record with the `authority`.
6. Your server returns `{ paymentUrl }` to the frontend.
7. Frontend redirects user to `paymentUrl` (Zarinpal's payment page).
8. User completes (or cancels) payment on Zarinpal.
9. Zarinpal calls your `callback_url` with `?Authority=xxx&Status=OK` (or `Status=NOK`).
10. Your server reads `Authority` and `Status` from query params.
11. If `Status !== "OK"`, mark billing as `failed`, redirect user to failure page.
12. Your server finds the pending billing record by `authority`.
13. Your server calls Zarinpal `/verify.json` with `merchant_id`, `amount`, `authority`.
14. If `code === 100`: mark billing `paid`, save `ref_id`, grant product to user.
15. If `code === 101`: already verified; redirect to success page (idempotent).
16. Otherwise: mark billing `failed`, redirect to failure page.

---

## Database model

Store one record per payment attempt. Minimum required fields:

```typescript
interface BillingRecord {
  id: string;                     // unique invoice ID
  userId: string;                 // reference to user
  amount: number;                 // amount in Toman (your currency)
  status: "pending" | "paid" | "failed";
  authority: string;              // Zarinpal authority token
  refId?: string;                 // Zarinpal ref_id after successful verification
  createdAt: Date;
  updatedAt: Date;

  // Optional: depends on your product
  type?: string;                  // e.g. "plan" | "credits"
  period?: string;                // e.g. "monthly" | "yearly"
  description?: string;

  // Optional: discount support
  originalAmount?: number;
  discountAmount?: number;
  discountCode?: string;
}
```

**Key rule:** Always look up the billing record by `authority` in the verify
step. Never trust the amount from the callback query params; use the amount
stored in your database.

---

## API route: request

`POST /api/payment/zarinpal/request`

```typescript
// app/api/payment/zarinpal/request/route.ts
import { NextRequest, NextResponse } from "next/server";

const ZARINPAL_SANDBOX = process.env.ZARINPAL_SANDBOX === "true";
const ZARINPAL_BASE = ZARINPAL_SANDBOX
  ? "https://sandbox.zarinpal.com"
  : "https://payment.zarinpal.com";
const REQUEST_URL = `${ZARINPAL_BASE}/pg/v4/payment/request.json`;

function getBaseUrl(): string {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export async function POST(request: NextRequest) {
  // 1. Authenticate the user (use your auth system)
  const session = await getYourSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate merchant ID
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId) {
    console.error("ZARINPAL_MERCHANT_ID is not set");
    return NextResponse.json(
      { error: "Payment gateway not configured" },
      { status: 500 }
    );
  }

  // 3. Parse and validate request body
  const body = await request.json();
  // Example: body = { type: "plan", period: "monthly", discountCode: "SAVE10" }
  // Validate body here based on your product logic...

  // 4. Compute amount in Toman (server-side: NEVER trust client amount)
  const amountInToman = computeAmount(body); // your pricing logic
  const amountInRial = amountInToman * 10;

  // 5. Handle zero-amount / fully-discounted flow
  if (amountInToman <= 0) {
    const billing = await saveBillingRecord({
      userId: session.user.id,
      amount: 0,
      status: "paid",
      ...body,
    });
    await grantProductToUser(session.user.id, body); // your business logic
    return NextResponse.json({
      success: true,
      free: true,
      billingId: billing.id,
      message: "Purchase activated for free",
    });
  }

  // 6. Call Zarinpal
  const callbackUrl = `${getBaseUrl()}/api/payment/zarinpal/verify`;
  const zarinpalRes = await fetch(REQUEST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: merchantId,
      amount: amountInRial,
      callback_url: callbackUrl,
      description: `Purchase for user ${session.user.id}`,
      metadata: {
        mobile: session.user.phone || "",
        email: session.user.email || "",
      },
    }),
  });

  const zarinpalData = await zarinpalRes.json();

  if (zarinpalData.data?.code !== 100 || !zarinpalData.data?.authority) {
    console.error("Zarinpal request failed:", zarinpalData);
    return NextResponse.json(
      { error: "Payment gateway error. Try again." },
      { status: 500 }
    );
  }

  const authority = zarinpalData.data.authority;
  const paymentUrl = ZARINPAL_SANDBOX
    ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
    : `https://www.zarinpal.com/pg/StartPay/${authority}`;

  // 7. Save pending billing record
  const billing = await saveBillingRecord({
    userId: session.user.id,
    amount: amountInToman,
    status: "pending",
    authority,
    ...body,
  });

  return NextResponse.json({
    success: true,
    authority,
    paymentUrl,
    billingId: billing.id,
  });
}
```

---

## API route: verify

`GET /api/payment/zarinpal/verify`

```typescript
// app/api/payment/zarinpal/verify/route.ts
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

const ZARINPAL_SANDBOX = process.env.ZARINPAL_SANDBOX === "true";
const ZARINPAL_BASE = ZARINPAL_SANDBOX
  ? "https://sandbox.zarinpal.com"
  : "https://payment.zarinpal.com";
const VERIFY_URL = `${ZARINPAL_BASE}/pg/v4/payment/verify.json`;

const RESULT_PAGE = "/payment/result"; // adapt to your routing

export async function GET(request: NextRequest) {
  const authority = request.nextUrl.searchParams.get("Authority");
  const status = request.nextUrl.searchParams.get("Status");

  // 1. Validate callback params
  if (!authority || status !== "OK") {
    redirect(`${RESULT_PAGE}?payment=failed`);
  }

  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId) {
    redirect(`${RESULT_PAGE}?payment=error`);
  }

  // 2. Find pending billing record
  const billing = await findBillingByAuthority(authority, "pending");

  if (!billing) {
    // Check if already verified (idempotent)
    const existing = await findBillingByAuthority(authority, "paid");
    if (existing) {
      redirect(`${RESULT_PAGE}?payment=success`);
    }
    redirect(`${RESULT_PAGE}?payment=notfound`);
  }

  // 3. Call Zarinpal verify: use amount from DB, not from callback
  const amountInRial = billing.amount * 10;
  const verifyRes = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: merchantId,
      amount: amountInRial,
      authority,
    }),
  });

  const verifyData = await verifyRes.json();
  const code = verifyData.data?.code;

  // 4. Handle already-verified (idempotent)
  if (code === 101) {
    redirect(`${RESULT_PAGE}?payment=success`);
  }

  // 5. Handle failure
  if (code !== 100) {
    console.error("Zarinpal verify failed:", verifyData);
    await updateBillingStatus(billing.id, "failed");
    redirect(`${RESULT_PAGE}?payment=verify_failed`);
  }

  // 6. Success: save ref_id, grant product
  const refId = verifyData.data?.ref_id;
  await updateBillingRecord(billing.id, {
    status: "paid",
    refId: refId?.toString(),
  });
  await grantProductToUser(billing.userId, billing); // your business logic

  redirect(`${RESULT_PAGE}?payment=success`);
}
```

---

## Frontend integration

### Minimal client-side flow

```typescript
async function handlePayment(purchaseDetails: object) {
  const res = await fetch("/api/payment/zarinpal/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(purchaseDetails),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    showError(data.error || "Payment failed. Try again.");
    return;
  }

  if (data.free) {
    showSuccess(data.message);
    return;
  }

  window.location.href = data.paymentUrl;
}
```

### Reading payment result on return

```typescript
const searchParams = new URLSearchParams(window.location.search);
const paymentStatus = searchParams.get("payment");

// paymentStatus values:
// "success"       - payment verified and product granted
// "failed"        - user cancelled or Status !== OK
// "verify_failed" - verification failed at Zarinpal
// "notfound"      - authority not found in DB
// "error"         - server configuration error
```

---

## Error handling

| Scenario | Cause | What to do |
|---|---|---|
| `data.code !== 100` on request | Invalid merchant ID, gateway issue | Return error to user, log details |
| `Status=NOK` on callback | User cancelled payment | Redirect to `?payment=failed` |
| `code === 101` on verify | Duplicate callback (already verified) | Treat as success (idempotent) |
| Billing record not found on verify | Invalid or expired authority | Redirect to `?payment=notfound` |
| `ZARINPAL_MERCHANT_ID` not set | Missing env var | Redirect to `?payment=error`, log server-side |
| Network timeout calling Zarinpal | Intermittent issue | Return 500 to user, do NOT grant product |

### Zero-amount / fully-discounted purchases

If a discount brings the total to `0` or below, skip the Zarinpal gateway entirely:

- Save billing as `paid` immediately.
- Grant the product to the user.
- Return `{ success: true, free: true }` with no `paymentUrl`.

---

## Security checklist

- [ ] `ZARINPAL_MERCHANT_ID` is server-side only, never sent to client.
- [ ] Amount is always computed server-side from your own pricing logic, never from client input.
- [ ] In verify step, amount comes from the stored billing record, never from callback query params.
- [ ] Product is only granted after `code === 100` (or the free flow).
- [ ] Duplicate callbacks (`code === 101`) are handled idempotently without double-granting.
- [ ] Billing record is looked up by `authority` before verifying (prevents forged callbacks).
- [ ] Use HTTPS in production for the callback URL.
- [ ] Never log `ZARINPAL_MERCHANT_ID` or full user payment details.

---

## Testing and sandbox

1. Set `ZARINPAL_SANDBOX=true` in your `.env.local`.
2. Register at [Zarinpal Sandbox](https://sandbox.zarinpal.com) to get a sandbox merchant ID.
3. Use test card numbers provided by Zarinpal in the sandbox environment.
4. After a successful sandbox payment, confirm:
   - Billing record status changes to `paid`.
   - `refId` is saved.
   - Product/subscription is granted to the user.
5. Cancel a payment and confirm `status=failed` and no product is granted.
6. Test duplicate callback by calling the verify URL twice with the same
   authority; the second call should be handled gracefully (idempotent,
   `code === 101`).

---

## Key constants summary

```typescript
// Sandbox
const REQUEST_URL = "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
const VERIFY_URL = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";
const START_PAY = "https://sandbox.zarinpal.com/pg/StartPay/";

// Production
const REQUEST_URL = "https://payment.zarinpal.com/pg/v4/payment/request.json";
const VERIFY_URL = "https://payment.zarinpal.com/pg/v4/payment/verify.json";
const START_PAY = "https://www.zarinpal.com/pg/StartPay/";

// Currency conversion
const amountInRial = amountInToman * 10;

// Response codes
// request: code 100 = authority created successfully
// verify:  code 100 = first successful verification
//          code 101 = already verified (idempotent)
//          other    = failure
```

---

## Official resources

- [Zarinpal Developer Docs](https://www.zarinpal.com/docs/)
- [Zarinpal Sandbox](https://sandbox.zarinpal.com)
- [Zarinpal Merchant Panel](https://www.zarinpal.com/panel/)
