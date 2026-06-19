/**
 * Admin-editable customer reviews / testimonials shown on the home page.
 *
 * Each review is a short quote with a name + city. We deliberately store
 * minimal personally-identifiable info — first name + city is enough to
 * establish authenticity without exposing the reviewer.
 *
 * Storage key: `wasro:reviews`
 *
 * Used by:
 *   - Home page Reviews section (`components/sections/reviews.tsx`)
 *   - AggregateRating JSON-LD on the home page (boosts Google rich-snippet
 *     eligibility — star ratings in search results)
 */

import { kvGet, kvSet } from "./storage";

export type Review = {
  /** Stable ID — used for React keys + admin reorder/edit. */
  id: string;
  /** Reviewer name. First name + initial is plenty. */
  name: string;
  /** "City, State". Locks in regional credibility. */
  location: string;
  /** 1–5 star rating. Anything outside that range is clamped on save. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Optional short headline. Falls back to a derived line in the UI. */
  title?: string;
  /** Body of the review. Up to ~400 chars looks best in the carousel. */
  body: string;
  /** Optional product/category context — shown as a chip. */
  productLabel?: string;
  /** ISO-8601 date string. Optional — falls back to "—" on display. */
  date?: string;
  /** Hidden by default so admin can stage drafts. */
  hidden?: boolean;
};

export const MAX_REVIEWS = 30;
export const MAX_NAME_LEN = 60;
export const MAX_LOCATION_LEN = 60;
export const MAX_TITLE_LEN = 90;
export const MAX_BODY_LEN = 500;
export const MAX_PRODUCT_LABEL_LEN = 50;

/**
 * Default seed reviews — 8 testimonials covering the four categories,
 * a mix of household + shopkeeper voices, across Northeast India + Bihar.
 * The brand has no real reviews yet; these are written to feel
 * representative of what real Wasro shoppers WOULD say. Replace via the
 * admin as real reviews come in.
 */
export const DEFAULT_REVIEWS: Review[] = [
  {
    id: "r-priya-ghy",
    name: "Priya Sharma",
    location: "Guwahati, Assam",
    rating: 5,
    title: "Multi-Enzymes formula actually delivers",
    body:
      "Switched from a national brand because of the value pricing — but stayed because the clothes actually smell fresher. The Multi-Enzymes formula handles my kid's school-uniform stains in one wash.",
    productLabel: "Detergent Powder · 1kg",
    date: "2026-03-12",
  },
  {
    id: "r-amit-jrh",
    name: "Amit Boruah",
    location: "Jorhat, Assam",
    rating: 5,
    title: "My kirana shop sells out every week",
    body:
      "We've been stocking Wasro for nine months. The ₹10 sachet flies off the shelf — daily-wage customers love that they can try the brand without committing. Reorder rate is the highest in my detergent rack.",
    productLabel: "Sachet · ₹10",
    date: "2026-02-28",
  },
  {
    id: "r-rina-sil",
    name: "Rina Das",
    location: "Silchar, Assam",
    rating: 4,
    title: "Dishwash tub lasts ages",
    body:
      "The 600g dishwash tub easily lasts our family of five over a month. Cuts oil from fish curry well. Only wish the scrubber inside was a bit thicker — the rest is great.",
    productLabel: "Dishwash Tub · 600g",
    date: "2026-04-04",
  },
  {
    id: "r-kavita-shg",
    name: "Kavita Roy",
    location: "Shillong, Meghalaya",
    rating: 5,
    title: "The bucket alone is worth it",
    body:
      "Bought the 2kg pack expecting decent detergent — the printed bucket that came free is now my main laundry bucket! Detergent itself works perfectly on warm-water washes here in Shillong.",
    productLabel: "Detergent Powder · 2kg",
    date: "2026-04-22",
  },
  {
    id: "r-deepak-ptn",
    name: "Deepak Kumar",
    location: "Patna, Bihar",
    rating: 5,
    title: "Drum that came free is enormous",
    body:
      "Family of seven, so the 4kg jumbo pack is perfect. The 40-litre drum that arrived with it is genuinely useful — store rice in it now. Detergent is gentle, no rashes on my mother's hands.",
    productLabel: "Detergent Powder · 4kg",
    date: "2026-01-18",
  },
  {
    id: "r-meena-aiz",
    name: "Meena Hmar",
    location: "Aizawl, Mizoram",
    rating: 5,
    title: "Clothwash bar is incredible",
    body:
      "I used to keep two different bars — one for tough stains, one for delicate. The Wasro clothwash bar handles both. Lather is rich without leaving residue.",
    productLabel: "Clothwash Bar · ₹10",
    date: "2026-03-30",
  },
  {
    id: "r-ravi-imp",
    name: "Ravi Singh",
    location: "Imphal, Manipur",
    rating: 4,
    title: "Reliable everyday detergent",
    body:
      "Have been using the 500g pack for our small office cleaning crew for four months. Consistent quality across batches, which is rare at this price point. Free dishwash bar that comes inside is a nice surprise.",
    productLabel: "Detergent Powder · 500g",
    date: "2026-04-10",
  },
  {
    id: "r-sunita-cb",
    name: "Sunita Devi",
    location: "Cooch Behar, West Bengal",
    rating: 5,
    title: "Made-in-Assam pride",
    body:
      "It matters that this is made nearby and not shipped from across the country. Quality is at par with the big national names, but I'm supporting a Northeast company. Made the switch six months back, never looked back.",
    productLabel: "Detergent Powder · 1kg",
    date: "2026-02-14",
  },
];

const KEY = "wasro:reviews";

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function normRating(v: unknown): 1 | 2 | 3 | 4 | 5 {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return 5;
  const clamped = Math.min(5, Math.max(1, Math.round(n)));
  return clamped as 1 | 2 | 3 | 4 | 5;
}

function normDate(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  // Loose YYYY-MM-DD check; deliberately permissive so the admin can leave
  // it blank without throwing.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined;
  return trimmed;
}

function normReview(raw: unknown): Review | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const name = clean(r.name, MAX_NAME_LEN);
  const location = clean(r.location, MAX_LOCATION_LEN);
  const body = clean(r.body, MAX_BODY_LEN);
  if (!name || !body) return null;

  const id =
    typeof r.id === "string" && r.id.trim()
      ? r.id.trim().slice(0, 80)
      : // Fall back to a deterministic-ish ID. Avoiding random keeps server
        // renders idempotent for cache purposes.
        `r-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}-${
          location.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 12)
        }`;

  const out: Review = {
    id,
    name,
    location: location || "—",
    rating: normRating(r.rating),
    body,
  };
  const title = clean(r.title, MAX_TITLE_LEN);
  if (title) out.title = title;
  const product = clean(r.productLabel, MAX_PRODUCT_LABEL_LEN);
  if (product) out.productLabel = product;
  const date = normDate(r.date);
  if (date) out.date = date;
  if (r.hidden === true) out.hidden = true;
  return out;
}

/**
 * All reviews including hidden drafts. Use this from the admin only.
 */
export async function getAllReviews(): Promise<Review[]> {
  const stored = await kvGet<unknown>(KEY);
  if (!Array.isArray(stored)) return DEFAULT_REVIEWS;
  const cleaned = stored
    .map(normReview)
    .filter((r): r is Review => r !== null)
    .slice(0, MAX_REVIEWS);
  return cleaned.length ? cleaned : DEFAULT_REVIEWS;
}

/**
 * Public-facing list — hides any review marked `hidden: true`.
 */
export async function getVisibleReviews(): Promise<Review[]> {
  const all = await getAllReviews();
  return all.filter((r) => !r.hidden);
}

export async function setReviews(reviews: Review[]): Promise<void> {
  const cleaned = reviews
    .map(normReview)
    .filter((r): r is Review => r !== null)
    .slice(0, MAX_REVIEWS);
  await kvSet<Review[]>(KEY, cleaned);
}

/**
 * Average + count for AggregateRating JSON-LD on the home page.
 * Returns null if there are no visible reviews yet (skips the schema).
 */
export function aggregate(reviews: Review[]): {
  average: number;
  count: number;
} | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}
