/**
 * Admin-editable per-product MRP overrides.
 *
 * Stored as `{ [productId]: number }`. Only products that the admin has
 * explicitly set appear here — everything else falls back to the
 * `mrp` value in `data/products.ts` (which may be `null` for SKUs
 * whose price isn't published yet).
 *
 * Storage key: `wasro:product-prices`
 */

import { kvGet, kvSet } from "./storage";
import { PRODUCTS } from "@/data/products";

const KEY = "wasro:product-prices";

export type PriceOverrides = Record<string, number>;

const productIds = new Set(PRODUCTS.map((p) => p.id));

function normalize(raw: unknown): PriceOverrides {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: PriceOverrides = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!productIds.has(id)) continue;
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) continue;
    out[id] = Math.round(n);
  }
  return out;
}

export async function getProductPrices(): Promise<PriceOverrides> {
  const stored = await kvGet<unknown>(KEY);
  return normalize(stored);
}

export async function setProductPrices(prices: PriceOverrides): Promise<void> {
  await kvSet<PriceOverrides>(KEY, normalize(prices));
}
