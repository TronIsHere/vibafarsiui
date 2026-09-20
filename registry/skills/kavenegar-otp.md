# Kavenegar SMS / OTP (implementation guide)

Kavenegar is an Iranian SMS gateway. The Verify Lookup endpoint sends a
pre-approved template SMS containing one or more dynamic tokens (for example
OTP codes). All calls are plain GET requests authenticated via an API key
embedded in the URL path.

Hand this document to an AI or developer to wire OTP / verify SMS into any
Node.js or Next.js project.

---

## Environment variables

Add these to your `.env` / `.env.local`:

```env
KAVENEGAR_API_KEY=<your-api-key-from-kavenegar-panel>
KAVENEGAR_VERIFY_TEMPLATE=<template-name-approved-in-kavenegar-panel>
```

- `KAVENEGAR_API_KEY`: found in your Kavenegar dashboard under API Keys.
- `KAVENEGAR_VERIFY_TEMPLATE`: the exact name of the template you created and
  got approved in the Kavenegar panel (e.g. `verify`).

Keep the API key server-side only. Never expose it to the browser.

---

## API endpoint

```
GET https://api.kavenegar.com/v1/{API_KEY}/verify/lookup.json
```

All parameters are passed as query string parameters.

### Required query params

| Param | Type | Description |
|---|---|---|
| `receptor` | string | Recipient phone number (see Phone format) |
| `token` | string | The primary dynamic value (e.g. the OTP code) |
| `template` | string | Name of the approved template in your Kavenegar account |

### Optional query params

| Param | Type | Description |
|---|---|---|
| `token2` | string | Second dynamic value in the template |
| `token3` | string | Third dynamic value |
| `token10` | string | Slot 10 dynamic value |
| `token20` | string | Slot 20 dynamic value |
| `type` | `'sms' \| 'call'` | Delivery channel; defaults to SMS |
| `tag` | string | Custom tag for tracking |

---

## Response shape

```json
{
  "return": {
    "status": 200,
    "message": "تایید شد"
  },
  "entries": [
    {
      "messageid": 123456789,
      "message": "your otp is 45123",
      "status": 5,
      "statustext": "ارسال به مخابرات",
      "sender": "10004346",
      "receptor": "09123456789",
      "date": 1715000000,
      "cost": 1
    }
  ]
}
```

- `return.status === 200` means the request was accepted.
- Any other `return.status` value is an error; `return.message` describes it.
- HTTP-level errors (non-2xx) also indicate failure.

---

## Phone number format

Kavenegar accepts these formats for `receptor`:

| Input format | Expected by Kavenegar | Notes |
|---|---|---|
| `989123456789` (E.164 without `+`) | `09123456789` | Strip `98`, prepend `0` |
| `+989123456789` | `09123456789` | Strip `+98`, prepend `0` |
| `09123456789` | `09123456789` | Already correct |
| International non-IR | `00[country][number]` | Prepend `00` if not already present |

---

## TypeScript implementation

```typescript
// lib/kavenegar.ts

export interface SendOTPParams {
  receptor: string;
  token: string;
  template?: string; // overrides KAVENEGAR_VERIFY_TEMPLATE env var
  token2?: string;
  token3?: string;
  token10?: string;
  token20?: string;
  type?: "sms" | "call";
  tag?: string;
}

export interface KavenegarResponse {
  return: {
    status: number;
    message: string;
  };
  entries?: Array<{
    messageid: number;
    message: string;
    status: number;
    statustext: string;
    sender: string;
    receptor: string;
    date: number;
    cost: number;
  }>;
}

export async function sendOTPWithKavenegar(
  params: SendOTPParams
): Promise<KavenegarResponse> {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  const defaultTemplate = process.env.KAVENEGAR_VERIFY_TEMPLATE;

  if (!apiKey) throw new Error("KAVENEGAR_API_KEY is not set");
  if (!defaultTemplate) throw new Error("KAVENEGAR_VERIFY_TEMPLATE is not set");

  const baseUrl = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`;
  const searchParams = new URLSearchParams({
    receptor: params.receptor.replace(/\s/g, ""),
    token: params.token,
    template: params.template ?? defaultTemplate,
  });

  if (params.token2) searchParams.set("token2", params.token2);
  if (params.token3) searchParams.set("token3", params.token3);
  if (params.token10) searchParams.set("token10", params.token10);
  if (params.token20) searchParams.set("token20", params.token20);
  if (params.type) searchParams.set("type", params.type);
  if (params.tag) searchParams.set("tag", params.tag);

  const response = await fetch(`${baseUrl}?${searchParams.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Kavenegar HTTP error: ${response.status} ${response.statusText}`
    );
  }

  const data: KavenegarResponse = await response.json();

  if (data.return?.status !== 200) {
    throw new Error(
      `Kavenegar rejected request: ${data.return?.message ?? "Unknown error"}`
    );
  }

  return data;
}

/** Normalises a phone number to the format Kavenegar expects. */
export function toKavenegarReceptor(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  // Iranian mobile: 989xxxxxxxxx → 09xxxxxxxxx
  if (cleaned.startsWith("98") && cleaned.length === 12) {
    return `0${cleaned.slice(2)}`;
  }

  // Already local Iranian format
  if (cleaned.startsWith("09") && cleaned.length === 11) {
    return cleaned;
  }

  // International: ensure 00 prefix
  if (cleaned.startsWith("00")) return cleaned;
  return `00${cleaned}`;
}
```

---

## Usage example

```typescript
import { sendOTPWithKavenegar, toKavenegarReceptor } from "@/lib/kavenegar";

const otp = "45123";
const phone = "989123456789";

await sendOTPWithKavenegar({
  receptor: toKavenegarReceptor(phone),
  token: otp,
  // template: "custom-template", // optional override
});
```

---

## Error handling notes

- Always check `data.return.status === 200` after a successful HTTP response.
  Kavenegar returns HTTP 200 even for logical errors, putting the real status
  in `return.status`.
- Common non-200 Kavenegar status codes:
  - `401`: invalid API key
  - `404`: receptor invalid
  - `411`: template not found
  - `417`: template tokens mismatch

---

## Security checklist

- [ ] `KAVENEGAR_API_KEY` is server-side only.
- [ ] OTP is generated and stored server-side; never accept a client-supplied code as truth.
- [ ] Rate-limit send attempts per phone and per IP.
- [ ] Expire OTPs (e.g. 2–5 minutes) and limit verification attempts.
- [ ] Prefer the approved Verify Lookup template over raw SMS for OTP flows.
- [ ] Do not log full OTP codes or API keys.

---

## Official resources

- [Kavenegar docs](https://kavenegar.com/rest.html)
- [Verify Lookup](https://kavenegar.com/rest.html#verify)
