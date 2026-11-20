import { createHash, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Surrogate-Control": "no-store",
  "Pragma": "no-cache",
  "Expires": "0",
  "Vary": "Authorization",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function unavailable() {
  return new Response(null, { status: 404, headers: responseHeaders });
}

export function GET(request: Request) {
  const secret = process.env.PROXY_DIAGNOSTIC_SECRET;
  // Require 32 random bytes encoded as 64 hex characters. Generate with a CSPRNG;
  // format validation cannot establish whether an operator chose random input.
  if (
    process.env.ENABLE_PROXY_DIAGNOSTIC !== "true" ||
    !secret ||
    !/^[a-f0-9]{64}$/.test(secret)
  ) {
    return unavailable();
  }

  const authorization = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(digest(authorization), digest(expected))) {
    return unavailable();
  }

  return Response.json(
    {
      Host: request.headers.get("host"),
      "X-Forwarded-Host": request.headers.get("x-forwarded-host"),
    },
    { headers: responseHeaders },
  );
}

// Explicit handlers keep unsupported methods private and uncacheable too.
export const HEAD = unavailable;
export const OPTIONS = unavailable;
export const POST = unavailable;
export const PUT = unavailable;
export const PATCH = unavailable;
export const DELETE = unavailable;
