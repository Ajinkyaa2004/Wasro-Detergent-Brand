import "server-only";
import type { Product } from "@/data/products";
import { getFeaturedIds } from "@/lib/featured";
import { getResolvedProducts } from "./products-resolved";

/**
 * Resolve the admin-saved featured-product IDs to live Product objects
 * — applying price overrides + image URLs along the way.
 *
 * Server-only. The client-safe `lib/featured.ts` exposes just the
 * stored IDs (the admin editor doesn't need full resolved products).
 */
export async function getFeaturedProductsResolved(): Promise<Product[]> {
  const ids = await getFeaturedIds();
  const all = await getResolvedProducts();
  const byId = new Map(all.map((p) => [p.id, p]));
  return ids
    .map((id) => byId.get(id))
    .filter((p): p is Product => Boolean(p));
}
