/**
 * Admin-editable "Why Wasro" value-prop cards on the home page.
 *
 * Icons are stored as string IDs (not React components — they can't be
 * serialised). The consumer maps the ID back to a Lucide icon via the
 * registry below. To allow a new icon, add it to ALLOWED_ICONS and import
 * it in components/sections/why-wasro.tsx.
 *
 * Storage key: `wasro:why-us`
 */

import { kvGet, kvSet } from "./storage";

/** The set of icon names admins can pick from. Each maps to a Lucide
 *  icon in components/sections/why-wasro.tsx. Extend both files in
 *  lockstep when adding new icons. */
export const ALLOWED_ICONS = [
  "Gift",
  "Wallet",
  "ShieldCheck",
  "MapPin",
  "Factory",
  "Truck",
  "Sparkles",
  "Award",
  "Heart",
  "Leaf",
] as const;

export type IconName = (typeof ALLOWED_ICONS)[number];

/** Colour theme tokens for each card. Constrained to a set of brand
 *  palettes so the admin can't pick unbranded colours. */
export const ALLOWED_THEMES = [
  "yellow",
  "blue",
  "emerald",
  "coral",
] as const;

export type ThemeName = (typeof ALLOWED_THEMES)[number];

export type WhyCard = {
  icon: IconName;
  theme: ThemeName;
  title: string;
  body: string;
  stat: string;
  statLabel: string;
};

export type WhyWasro = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: WhyCard[];
};

export const MAX_CARDS = 4;

export const DEFAULT_WHY_WASRO: WhyWasro = {
  eyebrow: "Why Wasro",
  title: "More than just a wash.",
  subtitle:
    "Built for the Indian household — strong on cleaning, generous on value, honest about where it comes from.",
  cards: [
    {
      icon: "Gift",
      theme: "yellow",
      title: "Free gifts in every family pack",
      body: "Free mug with the 500g, bucket or tub with the 2kg, drum or big tub with the 3kg, 40L drum with the 4kg. Real value, every time.",
      stat: "4",
      statLabel: "gift tiers",
    },
    {
      icon: "Wallet",
      theme: "emerald",
      title: "Honest, value-tier pricing",
      body: "From a ₹10 sachet to a 4kg jumbo pack with a free drum — quality detergent at prices Indian households actually budget for.",
      stat: "₹5",
      statLabel: "starting at",
    },
    {
      icon: "ShieldCheck",
      theme: "blue",
      title: "Manufactured in Assam",
      body: "Made by Madhav Industries at Brahmaputra Industrial Park, Amingaon. Quality you can trace to a single, accountable plant.",
      stat: "100%",
      statLabel: "made in Assam",
    },
    {
      icon: "MapPin",
      theme: "coral",
      title: "Available at 121+ stores",
      body: "Distributed across Assam, Meghalaya, Manipur, Tripura, Mizoram, Nagaland, Arunachal Pradesh, West Bengal, Bihar & Odisha.",
      stat: "10",
      statLabel: "states",
    },
  ],
};

const KEY = "wasro:why-us";

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function normIcon(v: unknown, fallback: IconName): IconName {
  if (typeof v === "string" && (ALLOWED_ICONS as readonly string[]).includes(v)) {
    return v as IconName;
  }
  return fallback;
}

function normTheme(v: unknown, fallback: ThemeName): ThemeName {
  if (typeof v === "string" && (ALLOWED_THEMES as readonly string[]).includes(v)) {
    return v as ThemeName;
  }
  return fallback;
}

function normCard(raw: unknown, fallback: WhyCard): WhyCard {
  if (typeof raw !== "object" || raw === null) return fallback;
  const r = raw as Record<string, unknown>;
  return {
    icon: normIcon(r.icon, fallback.icon),
    theme: normTheme(r.theme, fallback.theme),
    title: clean(r.title, 80) || fallback.title,
    body: clean(r.body, 280) || fallback.body,
    stat: clean(r.stat, 12) || fallback.stat,
    statLabel: clean(r.statLabel, 40) || fallback.statLabel,
  };
}

export async function getWhyWasro(): Promise<WhyWasro> {
  const stored = await kvGet<unknown>(KEY);
  if (!stored || typeof stored !== "object") return DEFAULT_WHY_WASRO;
  const s = stored as Record<string, unknown>;
  const cards = Array.isArray(s.cards) ? s.cards : [];
  return {
    eyebrow: clean(s.eyebrow, 40) || DEFAULT_WHY_WASRO.eyebrow,
    title: clean(s.title, 80) || DEFAULT_WHY_WASRO.title,
    subtitle: clean(s.subtitle, 280) || DEFAULT_WHY_WASRO.subtitle,
    cards: Array.from({ length: MAX_CARDS }, (_, i) =>
      normCard(cards[i], DEFAULT_WHY_WASRO.cards[i])
    ),
  };
}

export async function setWhyWasro(value: WhyWasro): Promise<void> {
  await kvSet<WhyWasro>(KEY, value);
}
