/**
 * Admin auth — single-user, password-based, HttpOnly cookie session.
 *
 * Wasro only has one admin (Harshit). No user database needed.
 *
 *   - `ADMIN_PASSWORD` env var holds the literal password.
 *   - `ADMIN_SECRET`   env var (32+ chars) signs the session JWT.
 *
 * On successful login we set `wasro_admin` — an HttpOnly, Secure,
 * SameSite=Lax cookie containing a signed JWT. The middleware checks
 * for it before rendering anything under /admin (except /admin/login).
 *
 * If either env var is missing the API fails CLOSED — admin endpoints
 * return 503 and login is impossible. This is intentional: a
 * misconfigured deploy should not silently allow access.
 */

import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "wasro_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8h — re-login after a workday

function getSecretKey(): Uint8Array | null {
  const raw = process.env.ADMIN_SECRET;
  if (!raw || raw.length < 32) return null;
  return new TextEncoder().encode(raw);
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getSecretKey());
}

/** Constant-time-ish password compare. Don't allow an early-return leak. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function checkPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(submitted, expected);
}

export async function signSession(): Promise<string> {
  const key = getSecretKey();
  if (!key) throw new Error("ADMIN_SECRET not configured");
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("wasro")
    .setAudience("wasro-admin")
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key);
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const key = getSecretKey();
  if (!key) return false;
  try {
    await jwtVerify(token, key, {
      issuer: "wasro",
      audience: "wasro-admin",
    });
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
