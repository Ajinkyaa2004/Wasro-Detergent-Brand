import "server-only";
import { PRODUCTS, type Product } from "@/data/products";
import { getProductPrices } from "@/lib/product-prices";
import { withImages } from "./product-images";

/**
 * Resolve products with admin price overrides + image URLs applied.
 *
 * - If the admin has saved an MRP for a product via /admin/pricing,
 *   that overrides the value in `data/products.ts`.
 * - Otherwise the file default wins (which may itself be `null`).
 * - Image URLs are added from the file-system scan.
 *
 * This is the canonical "live product list" — any consumer that
 * renders a price should call this, not import PRODUCTS directly.
 */
export async function getResolvedProducts(): Promise<Product[]> {
  const overrides = await getProductPrices();
  const merged = PRODUCTS.map((p) => ({
    ...p,
    // Admin override > data file default. Keep `null` if neither set.
    mrp: overrides[p.id] ?? p.mrp,
  }));
  return withImages(merged);
}

/** Convenience: filter resolved products by category. */
export async function getResolvedProductsByCategory(
  category: Product["category"]
): Promise<Product[]> {
  const all = await getResolvedProducts();
  return all.filter((p) => p.category === category);
}

/** Convenience: resolve a single product by id. */
export async function getResolvedProduct(
  id: string
): Promise<Product | undefined> {
  const all = await getResolvedProducts();
  return all.find((p) => p.id === id);
}
