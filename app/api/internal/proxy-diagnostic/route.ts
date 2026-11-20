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

// TEMPORARY: remove this block and its call after the investigation.
// Fixed UTC deadline cannot be extended by a process restart. No env opt-in:
// environment injection is precisely what this diagnostic is investigating.
const LOG_DEADLINE = Date.UTC(2026, 10, 27, 22, 0, 0);
const LOG_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOG_EVENTS = 20;
let firstLogAt: number | undefined;
let logEvents = 0;

type AuthState = "absent" | "invalid_scheme" | "mismatch" | "match";

function recordPrivateStatus(
  flag: "missing" | "invalid" | "enabled",
  secret: "missing" | "invalid" | "valid",
  authorization: AuthState | undefined,
) {
  if (Date.now() >= LOG_DEADLINE || logEvents >= MAX_LOG_EVENTS) return;
  const now = performance.now();
  firstLogAt ??= now;
  if (now - firstLogAt >= LOG_WINDOW_MS) return;
  logEvents += 1;
  // Only enumerated states; never pass request objects, values or errors.
  // Omit authorization when a valid Bearer cannot be compared to a valid secret.
  try {
    console.info(JSON.stringify({ flag, secret, ...(authorization ? { authorization } : {}) }));
  } catch {
    // Logging must never change the public response.
  }
}

export function GET(request: Request) {
  const flag = process.env.ENABLE_PROXY_DIAGNOSTIC;
  const secret = process.env.PROXY_DIAGNOSTIC_SECRET;
  const flagState = flag === undefined ? "missing" : flag === "true" ? "enabled" : "invalid";
  // Require 32 random bytes encoded as 64 lowercase hex characters.
  const secretState = !secret ? "missing" : /^[a-f0-9]{64}$/.test(secret) ? "valid" : "invalid";
  const authorization = request.headers.get("authorization");
  let authState: AuthState | undefined;
  if (authorization === null) {
    authState = "absent";
  } else if (!/^Bearer [^\s]+$/.test(authorization)) {
    authState = "invalid_scheme";
  } else if (secretState === "valid") {
    const digest = (value: string) => createHash("sha256").update(value).digest();
    authState = timingSafeEqual(digest(authorization), digest(`Bearer ${secret}`))
      ? "match"
      : "mismatch";
  }

  recordPrivateStatus(flagState, secretState, authState);
  if (flagState !== "enabled" || secretState !== "valid" || authState !== "match") {
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
