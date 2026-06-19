/**
 * Admin-editable hero "static" content — everything in the hero that
 * isn't the slideshow or the cycling headline words.
 *
 * Storage key: `wasro:hero-content`
 */

import { kvGet, kvSet } from "./storage";

export type HeroCta = {
  label: string;
  href: string;
};

export type HeroStat = {
  /** Numeric value. AnimatedCounter ramps from 0 → this. */
  value: number;
  /** Suffix appended after the number (e.g. "+"). Optional. */
  suffix?: string;
  /** Prefix shown before the number (e.g. "₹"). Optional. */
  prefix?: string;
  /** Caption underneath. */
  label: string;
};

export type HeroContent = {
  /** Small chip at the top — "Trusted across Northeast India" by default. */
  chipText: string;
  /** Static second line under the cycling headline. */
  secondLine: string;
  /** Paragraph below the headline. */
  subtitle: string;
  /** Big blue CTA (left button). */
  primaryCta: HeroCta;
  /** Outline CTA (right button). */
  secondaryCta: HeroCta;
  /** 3 stats shown above the offer banner. */
  stats: HeroStat[];
  /** Yellow sticker chip in the top-right of the product image. */
  madeInAssamChip: string;
};

export const DEFAULT_HERO_CONTENT: HeroContent = {
  chipText: "Trusted across Northeast India",
  secondLine: "For every Indian home.",
  subtitle:
    "Wasro detergent powders, dishwash bars, and clothwash bars — crafted in Assam by Madhav Industries. Every jumbo pack ships with a free gift, from a printed bucket to a 40-litre drum.",
  primaryCta: { label: "Shop the range", href: "/products" },
  secondaryCta: { label: "Find a store", href: "/find-store" },
  stats: [
    { value: 121, suffix: "+", label: "Stores across NE India" },
    { value: 15, label: "SKUs across 4 categories" },
    { value: 5, prefix: "₹", label: "Starting price" },
  ],
  madeInAssamChip: "Made in Assam",
};

const KEY = "wasro:hero-content";

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function normStat(raw: unknown, fallback: HeroStat): HeroStat {
  if (typeof raw !== "object" || raw === null) return fallback;
  const r = raw as Record<string, unknown>;
  const value = Number(r.value);
  return {
    value: Number.isFinite(value) ? value : fallback.value,
    suffix: typeof r.suffix === "string" ? r.suffix.slice(0, 4) : undefined,
    prefix: typeof r.prefix === "string" ? r.prefix.slice(0, 4) : undefined,
    label: clean(r.label, 60) || fallback.label,
  };
}

export async function getHeroContent(): Promise<HeroContent> {
  const stored = await kvGet<unknown>(KEY);
  if (!stored || typeof stored !== "object") return DEFAULT_HERO_CONTENT;
  const s = stored as Record<string, unknown>;
  const pc = (s.primaryCta as Record<string, unknown>) ?? {};
  const sc = (s.secondaryCta as Record<string, unknown>) ?? {};
  const stats = Array.isArray(s.stats) ? s.stats : DEFAULT_HERO_CONTENT.stats;
  return {
    chipText: clean(s.chipText, 80) || DEFAULT_HERO_CONTENT.chipText,
    secondLine: clean(s.secondLine, 80) || DEFAULT_HERO_CONTENT.secondLine,
    subtitle: clean(s.subtitle, 400) || DEFAULT_HERO_CONTENT.subtitle,
    primaryCta: {
      label: clean(pc.label, 40) || DEFAULT_HERO_CONTENT.primaryCta.label,
      href: clean(pc.href, 500) || DEFAULT_HERO_CONTENT.primaryCta.href,
    },
    secondaryCta: {
      label: clean(sc.label, 40) || DEFAULT_HERO_CONTENT.secondaryCta.label,
      href: clean(sc.href, 500) || DEFAULT_HERO_CONTENT.secondaryCta.href,
    },
    stats: [0, 1, 2].map((i) =>
      normStat(stats[i], DEFAULT_HERO_CONTENT.stats[i])
    ),
    madeInAssamChip:
      clean(s.madeInAssamChip, 40) || DEFAULT_HERO_CONTENT.madeInAssamChip,
  };
}

export async function setHeroContent(c: HeroContent): Promise<void> {
  // Already normalised by the editor + server action — store as-is.
  await kvSet<HeroContent>(KEY, c);
}
