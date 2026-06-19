/**
 * Admin-editable hero offer SLIDESHOW.
 *
 * The Wasro hero displays a rotating set of up to 3 offers. Each slide
 * has its own copy + a chosen product whose image swaps into the right
 * column of the hero in sync with the offer text.
 *
 * Storage key: `wasro:offer`
 *
 * Backward compat: an older single-offer flat shape (pre-slideshow) is
 * automatically migrated to a single-slide array on read, so existing
 * Upstash data keeps working.
 */

import { kvGet, kvSet } from "./storage";

export type Slide = {
  /** Short status chip text (e.g. "LIMITED TIME"). */
  badge: string;
  /** Headline of this slide. */
  title: string;
  /** Optional second line / supporting detail. */
  subtitle?: string;
  /** Optional CTA button label (e.g. "Shop now"). */
  ctaLabel?: string;
  /** CTA destination — site path or absolute https URL. */
  ctaHref?: string;
  /** ISO date string. UI may show "ends DD MMM". */
  validUntil?: string;
  /** Product ID whose image is displayed in the hero's right column
   *  while this slide is active. Must match an `id` in data/products.ts. */
  productId?: string;
};

export type Offer = {
  /** Master toggle. When false, the banner is hidden and the static
   *  fallback product image renders in the hero right column. */
  active: boolean;
  /** 1-3 slides. Cycled in order. */
  slides: Slide[];
  /** Seconds per slide. Default 4. Min 2, max 10. */
  cycleSeconds: number;
};

export const MAX_SLIDES = 3;
export const MIN_CYCLE = 2;
export const MAX_CYCLE = 10;
export const DEFAULT_CYCLE = 4;

/** Default product whose image is the hero fallback (no offer active or
 *  the slide doesn't specify a productId). */
export const FALLBACK_PRODUCT_ID = "powder-2kg";

export const DEFAULT_OFFER: Offer = {
  active: true,
  cycleSeconds: DEFAULT_CYCLE,
  slides: [
    {
      badge: "FAMILY PACK",
      title: "1kg Wasro Multi-Enzymes — the everyday family pack.",
      subtitle: "Reliable wash, week after week. Stocked at 121+ Wasro stores.",
      ctaLabel: "Browse the range",
      ctaHref: "/products",
      productId: "powder-1kg",
    },
    {
      badge: "VALUE PACK",
      title: "Buy a 2kg Wasro pack — get a free red bucket.",
      subtitle: "Valid across all 121+ stores in Northeast India this month.",
      ctaLabel: "Find a store",
      ctaHref: "/find-store",
      productId: "powder-2kg",
    },
    {
      badge: "JUMBO PACK",
      title: "4kg mega pack ships with a free 40-litre drum.",
      subtitle: "Stock the whole season. Wash, store, save.",
      ctaLabel: "See all packs",
      ctaHref: "/products",
      productId: "powder-4kg",
    },
  ],
};

const KEY = "wasro:offer";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function clampCycle(n: unknown): number {
  const num = Number(n);
  if (!Number.isFinite(num)) return DEFAULT_CYCLE;
  return Math.max(MIN_CYCLE, Math.min(MAX_CYCLE, Math.round(num)));
}

function normalizeSlide(raw: unknown): Slide | null {
  if (!isRecord(raw)) return null;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return null;
  return {
    badge:
      typeof raw.badge === "string" && raw.badge.trim() ? raw.badge.trim() : "OFFER",
    title,
    subtitle:
      typeof raw.subtitle === "string" && raw.subtitle.trim()
        ? raw.subtitle.trim()
        : undefined,
    ctaLabel:
      typeof raw.ctaLabel === "string" && raw.ctaLabel.trim()
        ? raw.ctaLabel.trim()
        : undefined,
    ctaHref:
      typeof raw.ctaHref === "string" && raw.ctaHref.trim()
        ? raw.ctaHref.trim()
        : undefined,
    validUntil:
      typeof raw.validUntil === "string" && raw.validUntil.trim()
        ? raw.validUntil.trim()
        : undefined,
    productId:
      typeof raw.productId === "string" && raw.productId.trim()
        ? raw.productId.trim()
        : undefined,
  };
}

export async function getOffer(): Promise<Offer> {
  const stored = await kvGet<unknown>(KEY);
  if (!stored) return DEFAULT_OFFER;

  // New multi-slide shape
  if (isRecord(stored) && Array.isArray(stored.slides)) {
    const slides = stored.slides
      .map(normalizeSlide)
      .filter((s): s is Slide => s !== null)
      .slice(0, MAX_SLIDES);
    if (slides.length === 0) return DEFAULT_OFFER;
    return {
      active: Boolean(stored.active),
      cycleSeconds: clampCycle(stored.cycleSeconds),
      slides,
    };
  }

  // Backward compat: legacy single-offer flat shape — wrap as one slide
  if (isRecord(stored) && typeof stored.title === "string") {
    const slide = normalizeSlide(stored);
    if (!slide) return DEFAULT_OFFER;
    return {
      active: Boolean(stored.active),
      cycleSeconds: DEFAULT_CYCLE,
      slides: [{ ...slide, productId: slide.productId ?? FALLBACK_PRODUCT_ID }],
    };
  }

  return DEFAULT_OFFER;
}

export async function setOffer(offer: Offer): Promise<void> {
  const clean: Offer = {
    active: Boolean(offer.active),
    cycleSeconds: clampCycle(offer.cycleSeconds),
    slides: (Array.isArray(offer.slides) ? offer.slides : [])
      .map(normalizeSlide)
      .filter((s): s is Slide => s !== null)
      .slice(0, MAX_SLIDES),
  };
  await kvSet<Offer>(KEY, clean);
}
