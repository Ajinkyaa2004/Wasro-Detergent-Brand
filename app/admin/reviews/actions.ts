"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";
import {
  MAX_BODY_LEN,
  MAX_LOCATION_LEN,
  MAX_NAME_LEN,
  MAX_PRODUCT_LABEL_LEN,
  MAX_REVIEWS,
  MAX_TITLE_LEN,
  setReviews,
  type Review,
} from "@/lib/reviews";

export type SaveState =
  | { ok: true; savedAt: number; count: number }
  | { ok: false; error: string }
  | undefined;

async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const ok = await verifySession(token);
  if (!ok) throw new Error("Unauthorised");
}

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function normRating(v: unknown): 1 | 2 | 3 | 4 | 5 {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, Math.round(n))) as 1 | 2 | 3 | 4 | 5;
}

function normDate(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined;
  return trimmed;
}

export async function saveReviewsAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("reviews") ?? "[]"));
  } catch {
    return { ok: false, error: "Invalid reviews payload." };
  }
  if (!Array.isArray(parsed)) {
    return { ok: false, error: "Expected an array of reviews." };
  }

  const reviews: Review[] = [];
  for (const raw of parsed.slice(0, MAX_REVIEWS)) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const name = clean(r.name, MAX_NAME_LEN);
    const body = clean(r.body, MAX_BODY_LEN);
    // A review with no name or no body is not usable as social proof —
    // silently drop it so admins can leave half-filled drafts.
    if (!name || !body) continue;

    const location = clean(r.location, MAX_LOCATION_LEN);
    const id =
      typeof r.id === "string" && r.id.trim()
        ? r.id.trim().slice(0, 80)
        : `r-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}-${
            location.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 12)
          }`;

    const review: Review = {
      id,
      name,
      location: location || "—",
      rating: normRating(r.rating),
      body,
    };
    const title = clean(r.title, MAX_TITLE_LEN);
    if (title) review.title = title;
    const product = clean(r.productLabel, MAX_PRODUCT_LABEL_LEN);
    if (product) review.productLabel = product;
    const date = normDate(r.date);
    if (date) review.date = date;
    if (r.hidden === true) review.hidden = true;

    reviews.push(review);
  }

  // We allow saving an empty list — equivalent to "hide the section".
  try {
    await setReviews(reviews);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Could not save: ${err.message}`
          : "Could not save reviews.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
  return { ok: true, savedAt: Date.now(), count: reviews.length };
}
