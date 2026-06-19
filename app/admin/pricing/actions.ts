"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";
import { setProductPrices, type PriceOverrides } from "@/lib/product-prices";
import { PRODUCTS } from "@/data/products";

export type SaveState =
  | { ok: true; savedAt: number; setCount: number; clearedCount: number }
  | { ok: false; error: string }
  | undefined;

async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const ok = await verifySession(token);
  if (!ok) throw new Error("Unauthorised");
}

const productIds = new Set(PRODUCTS.map((p) => p.id));

export async function savePricesAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  // Editor posts a JSON object { [productId]: numberOrEmptyString }.
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("prices") ?? "{}"));
  } catch {
    return { ok: false, error: "Invalid prices payload." };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "Expected an object of product prices." };
  }

  const overrides: PriceOverrides = {};
  let setCount = 0;
  let clearedCount = 0;

  for (const [id, raw] of Object.entries(parsed as Record<string, unknown>)) {
    if (!productIds.has(id)) continue;
    // Empty / null → clear the override (revert to data file default).
    if (raw === "" || raw == null) {
      clearedCount += 1;
      continue;
    }
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0 || n > 100_000) {
      return {
        ok: false,
        error: `Invalid price for ${id}: must be a positive number under ₹1,00,000.`,
      };
    }
    overrides[id] = Math.round(n);
    setCount += 1;
  }

  try {
    await setProductPrices(overrides);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Could not save: ${err.message}`
          : "Could not save prices.",
    };
  }

  // Bust caches for every page that displays a price
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/stain-guide");
  revalidatePath("/admin/pricing");
  revalidatePath("/admin");

  return {
    ok: true,
    savedAt: Date.now(),
    setCount,
    clearedCount,
  };
}
