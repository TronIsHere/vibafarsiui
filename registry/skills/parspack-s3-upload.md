# ParsPack S3 image upload (Next.js App Router)

Implementation guide for uploading images to **ParsPack** (S3-compatible
object storage) from a Next.js App Router project. Hand this to an AI or
developer to replicate the setup from scratch.

## Overview

Upload images **server-side** through a Next.js API route. The browser sends
`multipart/form-data` to `/api/upload`; the server validates the file, uploads
it to ParsPack via the AWS SDK, and returns a public URL.

**Flow:**

```
Browser (FormData) → POST /api/upload → uploadImage() → ParsPack S3 (PutObject) → { url, key }
```

ParsPack is treated as a generic S3-compatible provider. The critical
ParsPack-specific detail is **path-style URLs** and how public object URLs are
constructed.

---

## 1. Dependencies

Install the AWS SDK v3 S3 packages (ParsPack speaks the S3 API):

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

---

## 2. Environment variables

Add these to `.env.local` (values come from the ParsPack dashboard):

```env
S3_ENDPOINT=https://YOUR_ACCOUNT.parspack.net
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
```

| Variable | Required | Notes |
|---|---|---|
| `S3_ENDPOINT` | Yes | ParsPack endpoint URL (no trailing slash) |
| `S3_BUCKET` | Yes | Bucket name |
| `S3_ACCESS_KEY_ID` | Yes | ParsPack access key |
| `S3_SECRET_ACCESS_KEY` | Yes | ParsPack secret key |
| `S3_REGION` | No | Defaults to `us-east-1` (ParsPack often ignores region) |
| `S3_FORCE_PATH_STYLE` | No | Defaults to `true`. Set to `"false"` only if using virtual-host style |

**Bucket setup:** The bucket must allow public read on uploaded objects if you
use direct public URLs (this guide does). Configure that in the ParsPack panel.

---

## 3. File structure

Create these files under `lib/s3/` plus one API route:

```
lib/s3/
  client.ts      # Singleton S3Client configured for ParsPack
  urls.ts        # Public URL builder + optional presigned URLs
  upload.ts      # Upload logic (validation + PutObject)
app/api/upload/
  route.ts       # Authenticated POST endpoint
```

---

## 4. S3 client (`lib/s3/client.ts`)

ParsPack requires a custom endpoint and **path-style** addressing:

```typescript
import { S3Client } from "@aws-sdk/client-s3";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

let client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (client) return client;

  client = new S3Client({
    endpoint: requireEnv("S3_ENDPOINT"),
    region: process.env.S3_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
    },
    // ParsPack uses path-style: https://endpoint/bucket/key
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
  });

  return client;
}

export function getS3Bucket(): string {
  return requireEnv("S3_BUCKET");
}
```

**Key ParsPack detail:** `forcePathStyle: true` is required. Without it, the
SDK may use virtual-host style (`bucket.endpoint/key`), which ParsPack may not
support.

---

## 5. URL helpers (`lib/s3/urls.ts`)

Public URLs for ParsPack path-style buckets:

```typescript
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Bucket, getS3Client } from "./client";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

/** Public object URL for ParsPack path-style buckets. */
export function getPublicObjectUrl(key: string): string {
  const endpoint = trimTrailingSlash(process.env.S3_ENDPOINT ?? "");
  const bucket = getS3Bucket();
  const normalizedKey = key.replace(/^\/+/, "");
  return `${endpoint}/${bucket}/${normalizedKey}`;
}

/** Optional - for private buckets. */
export async function getPresignedObjectUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getS3Bucket(),
    Key: key.replace(/^\/+/, ""),
  });
  return getSignedUrl(getS3Client(), command, { expiresIn });
}
```

**Example URL shape:**

```
https://YOUR_ACCOUNT.parspack.net/my-bucket/uploads/<ownerId>/<uuid>.jpg
```

---

## 6. Upload logic (`lib/s3/upload.ts`)

```typescript
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getPublicObjectUrl } from "./urls";
import { getS3Bucket, getS3Client } from "./client";

const ALLOWED_CONTENT_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadImage(
  ownerId: string,
  file: File
): Promise<{ url: string; key: string }> {
  if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
    throw new Error("Invalid file type");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  const extension = ALLOWED_CONTENT_TYPES.get(file.type)!;
  const key = `uploads/${ownerId}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return { key, url: getPublicObjectUrl(key) };
}
```

**Design choices:**

- Validate MIME type and size on the server (do not rely on client-only checks).
- Key pattern: `uploads/{ownerId}/{uuid}.{ext}` - scoped per owner, collision-safe.
- Store and return the **public URL** in the DB, not the S3 key.
- Also return `key` if you need deletion or presigned access later.

---

## 7. API route (`app/api/upload/route.ts`)

Authenticated endpoint. Adapt the session helpers to your auth system:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { uploadImage } from "@/lib/s3/upload";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const result = await uploadImage(session.user.id, file);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status =
      message === "Invalid file type" || message === "File too large" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
```

**Contract:**

| Method | Path | Auth | Body | Success response |
|---|---|---|---|---|
| `POST` | `/api/upload` | Session cookie | `FormData` field `file` | `{ url: string, key: string }` |

**Error responses:** `401`, `400` (validation), `500` (S3 failure).

---

## 8. Client-side usage

```typescript
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function handleImageUpload(file: File) {
  // Client-side validation (mirrors server - UX only)
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return;
  if (file.size > MAX_IMAGE_SIZE) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Upload failed");
  }

  const { url } = await res.json();
  // Save url into form state, then persist with your record
  setForm((f) => ({ ...f, imageUrl: url }));
}
```

**Important:**

- Field name must be `"file"` (matches `formData.get("file")` on the server).
- Do **not** set `Content-Type` manually on `fetch` - the browser sets the
  multipart boundary.
- Block form submit while upload is in progress.
- File input: `accept="image/jpeg,image/png,image/webp,image/gif"`.

---

## 9. Next.js image config (`next.config.ts`)

If you use `next/image` with ParsPack URLs, allow the ParsPack hostname:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "YOUR_ACCOUNT.parspack.net", // your ParsPack endpoint host
        pathname: "/**",
      },
    ],
  },
};
```

Replace the hostname with your actual ParsPack endpoint host.

---

## 10. Auth / middleware notes

Keep `/api/upload` reachable from the browser. Auth belongs inside the route
(session cookies or tokens), not only in middleware redirects. If your
middleware protects all routes, exclude `/api/upload` from unauthenticated
redirects so the route can return JSON `401` itself.

---

## 11. ParsPack-specific checklist

When implementing or debugging:

1. **`forcePathStyle: true`** on `S3Client`.
2. **Public URL format:** `{S3_ENDPOINT}/{S3_BUCKET}/{key}` - not
   `https://bucket.endpoint/key`.
3. **Bucket ACL / policy:** Objects must be publicly readable if you store
   direct URLs.
4. **Endpoint host:** Use the exact endpoint from ParsPack
   (e.g. `https://YOUR_ACCOUNT.parspack.net`).
5. **Region:** `us-east-1` is fine as a placeholder; ParsPack is
   endpoint-driven.
6. **CORS:** Not needed for server-side upload. Only needed if you switch to
   direct browser → S3 uploads.

---

## 12. Common failure modes

| Symptom | Likely cause |
|---|---|
| `Missing required environment variable` | Env vars not set in `.env.local` / deployment |
| `403` / `AccessDenied` from S3 | Wrong credentials or bucket permissions |
| Upload succeeds but image 403 in browser | Bucket/object not public |
| Wrong URL shape | `forcePathStyle` is `false` or URL builder uses virtual-host style |
| `next/image` broken | ParsPack hostname missing from `remotePatterns` |
| `401` on upload | No session cookie; user not logged in |
| `File too large` / `Invalid file type` | Server validation - check MIME and 5 MB limit |

---

## 13. Optional extensions

- **Delete on record removal:** `DeleteObjectCommand` using stored `key`.
- **Private bucket:** Skip `getPublicObjectUrl`, use `getPresignedObjectUrl`
  when serving.
- **Direct browser upload:** Presigned `PutObject` URL to reduce server memory
  use for large files.
- **Image processing:** Resize/compress with `sharp` before `PutObject`.

---

## 14. Minimal test plan

1. Set all `S3_*` env vars from ParsPack.
2. Log in as an authenticated user.
3. `POST /api/upload` with a small JPEG via curl or the UI.
4. Confirm response:
   `{ "url": "https://...parspack.net/bucket/uploads/...", "key": "uploads/..." }`.
5. Open `url` in a browser - image should load.
6. Save a record with that `imageUrl` and confirm it renders.

---

## Nginx note (self-hosted)

If uploads work locally but fail with HTTP **413** behind nginx, raise
`client_max_body_size` above your app limit (e.g. `10M`) and reload nginx.
Default nginx body size is 1 MB and rejects before the request reaches Node.
