"use server";

import { addEmail, type AddResult } from "@/lib/newsletter";

/**
 * Public-facing server action used by the footer newsletter form.
 *
 * Deliberately unauthenticated — anyone visiting the site can subscribe.
 * Validation + dedup happen inside `addEmail`. We do not return the
 * underlying error message for unknown failures because that would leak
 * Upstash error text to anonymous visitors; instead we return a generic
 * "try again" message.
 *
 * Spam mitigation: we rely on a hidden honeypot field (`_company`) in
 * the form. If the field is non-empty, we accept the request and
 * silently no-op. This catches the vast majority of dumb crawler bots
 * without bothering real humans with a CAPTCHA.
 */

export type SubscribeState =
  | { ok: true; isNew: boolean }
  | { ok: false; error: string }
  | undefined;

export async function subscribeAction(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  // Honeypot — silently accept bot submissions so they don't retry.
  const honeypot = String(formData.get("_company") ?? "").trim();
  if (honeypot) {
    return { ok: true, isNew: false };
  }

  const email = String(formData.get("email") ?? "");
  const result: AddResult = await addEmail(email, Date.now());

  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  return { ok: true, isNew: result.isNew };
}
