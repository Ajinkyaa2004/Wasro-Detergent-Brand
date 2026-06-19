/**
 * Admin-editable list of "Featured products" shown on the home page.
 *
 * Data shape is a plain array of Product IDs. The home-page component
 * resolves each ID to the full Product at render time, so the admin
 * never sees stale product fields here.
 */

import { kvGet, kvSet } from "./storage";
import { PRODUCTS } from "@/data/products";

const KEY = "wasro:featured-ids";

/** Source-of-truth default — the products tagged `featured: true` in data. */
export const DEFAULT_FEATURED_IDS: string[] = PRODUCTS.filter(
  (p) => p.featured
).map((p) => p.id);

/** Hard cap so the home-page grid stays balanced (4 cols on lg). */
export const MAX_FEATURED = 4;

export async function getFeaturedIds(): Promise<string[]> {
  const stored = await kvGet<string[]>(KEY);
  if (!Array.isArray(stored) || stored.length === 0) {
    return DEFAULT_FEATURED_IDS;
  }
  // Drop IDs that no longer exist in the product catalogue (defensive in
  // case a product is removed from data/products after admin saved a list).
  const known = new Set(PRODUCTS.map((p) => p.id));
  const cleaned = stored.filter((id) => known.has(id));
  return cleaned.length ? cleaned.slice(0, MAX_FEATURED) : DEFAULT_FEATURED_IDS;
}

export async function setFeaturedIds(ids: string[]): Promise<void> {
  const known = new Set(PRODUCTS.map((p) => p.id));
  const cleaned = ids
    .filter((id) => known.has(id))
    .slice(0, MAX_FEATURED);
  await kvSet<string[]>(KEY, cleaned);
}

/** NOTE: `getFeaturedProductsResolved()` was moved to
 *  `lib/server/featured-resolved.ts` because it depends on the
 *  server-only price-overrides resolver. This module stays
 *  client-safe so the admin editor can import MAX_FEATURED etc. */
