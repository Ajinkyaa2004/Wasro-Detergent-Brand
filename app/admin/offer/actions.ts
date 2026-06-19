"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";
import {
  MAX_SLIDES,
  MIN_CYCLE,
  MAX_CYCLE,
  DEFAULT_CYCLE,
  type Offer,
  type Slide,
  setOffer,
} from "@/lib/offer";
import { PRODUCTS } from "@/data/products";

export type SaveState =
  | { ok: true; savedAt: number; slideCount: number }
  | { ok: false; error: string }
  | undefined;

async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const ok = await verifySession(token);
  if (!ok) throw new Error("Unauthorised");
}

function clean(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

const productIds = new Set(PRODUCTS.map((p) => p.id));

export async function saveOfferAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  // The editor posts `slides` as a JSON-encoded ordered array. Validating
  // server-side keeps a tampered client from poisoning the data.
  let parsedSlides: unknown;
  try {
    parsedSlides = JSON.parse(String(formData.get("slides") ?? "[]"));
  } catch {
    return { ok: false, error: "Invalid slides payload." };
  }
  if (!Array.isArray(parsedSlides)) {
    return { ok: false, error: "Expected an array of slides." };
  }

  const active = formData.get("active") === "on";
  const cycleSecondsRaw = Number(formData.get("cycleSeconds") ?? DEFAULT_CYCLE);
  const cycleSeconds = Number.isFinite(cycleSecondsRaw)
    ? Math.max(MIN_CYCLE, Math.min(MAX_CYCLE, Math.round(cycleSecondsRaw)))
    : DEFAULT_CYCLE;

  const slides: Slide[] = [];
  for (const raw of parsedSlides.slice(0, MAX_SLIDES)) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;

    const title = clean(asFormValue(r.title), 140);
    const badge = clean(asFormValue(r.badge), 30);
    const subtitle = clean(asFormValue(r.subtitle), 200);
    const ctaLabel = clean(asFormValue(r.ctaLabel), 30);
    const ctaHref = clean(asFormValue(r.ctaHref), 500);
    const validUntil = clean(asFormValue(r.validUntil), 30);
    const productId = clean(asFormValue(r.productId), 80);

    if (!title) continue; // empty slide → drop

    // CTA link must be a path or absolute URL — reject `javascript:` etc.
    if (ctaHref) {
      const isPath = ctaHref.startsWith("/") && !ctaHref.startsWith("//");
      const isHttp = /^https?:\/\//i.test(ctaHref);
      if (!isPath && !isHttp) {
        return {
          ok: false,
          error: `Slide ${slides.length + 1}: link must be a site path (/...) or https:// URL.`,
        };
      }
    }

    // productId, if given, must reference a real product.
    if (productId && !productIds.has(productId)) {
      return {
        ok: false,
        error: `Slide ${slides.length + 1}: unknown product "${productId}".`,
      };
    }

    slides.push({
      badge: badge || "OFFER",
      title,
      subtitle: subtitle || undefined,
      ctaLabel: ctaLabel || undefined,
      ctaHref: ctaHref || undefined,
      validUntil: validUntil || undefined,
      productId: productId || undefined,
    });
  }

  if (active && slides.length === 0) {
    return {
      ok: false,
      error: "Add at least one slide (title is required) before going live.",
    };
  }

  const offer: Offer = { active, cycleSeconds, slides };

  try {
    await setOffer(offer);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Could not save: ${err.message}`
          : "Could not save the slides.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/offer");
  revalidatePath("/admin");

  return { ok: true, savedAt: Date.now(), slideCount: slides.length };
}

// Coerce a JSON-parsed value to a string for `clean()`. Numbers etc.
// become empty strings — admin shouldn't be sending non-string types.
function asFormValue(v: unknown): FormDataEntryValue | null {
  if (typeof v === "string") return v;
  return null;
}
