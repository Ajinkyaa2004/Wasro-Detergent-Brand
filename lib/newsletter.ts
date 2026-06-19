/**
 * Newsletter subscriber list.
 *
 * Storage shape: a JSON array of `{ email, joinedAt }` records under
 * `wasro:newsletter:emails`. Array (not Set) because:
 *   1. Upstash REST set-ops are doable but raise per-op cost; for the
 *      foreseeable signup volume (a few hundred/year) a plain array
 *      stored as one JSON blob is far simpler.
 *   2. We need `joinedAt` per record, which sets don't model.
 *
 * Dedup is handled in `addEmail` — case-insensitive, trimmed.
 *
 * When the list grows large (>5K entries), migrate to either:
 *   - Upstash sorted set keyed by timestamp, or
 *   - Push to a real ESP (Brevo, Mailchimp) and stop storing locally.
 */

import { kvGet, kvSet } from "./storage";

const KEY = "wasro:newsletter:emails";
const MAX_EMAIL_LEN = 254; // RFC-5321
const EMAIL_RE =
  // Deliberately loose — we'd rather accept a slightly malformed address
  // than reject a valid one. ESP-side hard validation happens on send.
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Subscriber = {
  email: string;
  /** Epoch ms when the email was first added. */
  joinedAt: number;
};

export function isValidEmail(raw: unknown): raw is string {
  if (typeof raw !== "string") return false;
  const v = raw.trim();
  if (!v || v.length > MAX_EMAIL_LEN) return false;
  return EMAIL_RE.test(v);
}

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const stored = await kvGet<unknown>(KEY);
  if (!Array.isArray(stored)) return [];
  return stored
    .filter(
      (s): s is Subscriber =>
        typeof s === "object" &&
        s !== null &&
        typeof (s as Subscriber).email === "string" &&
        typeof (s as Subscriber).joinedAt === "number"
    )
    .map((s) => ({ email: normalize(s.email), joinedAt: s.joinedAt }));
}

export async function subscriberCount(): Promise<number> {
  const list = await listSubscribers();
  return list.length;
}

export type AddResult =
  | { ok: true; isNew: boolean; count: number }
  | { ok: false; error: string };

/**
 * Add an email to the subscribers list. Idempotent — re-adding an existing
 * email returns `{ ok: true, isNew: false }` so the UI can show the same
 * "you're in" message either way.
 */
export async function addEmail(rawEmail: string, joinedAt: number): Promise<AddResult> {
  if (!isValidEmail(rawEmail)) {
    return { ok: false, error: "That doesn't look like a valid email." };
  }
  const email = normalize(rawEmail);
  try {
    const list = await listSubscribers();
    const exists = list.some((s) => s.email === email);
    if (exists) {
      return { ok: true, isNew: false, count: list.length };
    }
    const next = [...list, { email, joinedAt }];
    await kvSet<Subscriber[]>(KEY, next);
    return { ok: true, isNew: true, count: next.length };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Couldn't save your signup: ${err.message}`
          : "Couldn't save your signup right now. Please try again later.",
    };
  }
}
