"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";
import { MAX_FEATURED, setFeaturedIds } from "@/lib/featured";
import { PRODUCTS } from "@/data/products";

export type SaveState =
  | { ok: true; savedAt: number; count: number }
  | { ok: false; error: string }
  | undefined;

async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const ok = await verifySession(token);
  if (!ok) throw new Error("Unauthorised");
}

export async function saveFeaturedAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  // `ids` is a JSON-encoded ordered array of product IDs from the client.
  // We do all validation server-side so a tampered client payload can't
  // poison the catalogue.
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("ids") ?? "[]"));
  } catch {
    return { ok: false, error: "Invalid payload." };
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, error: "Expected an array of product IDs." };
  }

  const known = new Set(PRODUCTS.map((p) => p.id));
  const ids = parsed
    .filter((id): id is string => typeof id === "string")
    .filter((id) => known.has(id));

  if (ids.length === 0) {
    return { ok: false, error: "Pick at least one product to feature." };
  }

  if (ids.length > MAX_FEATURED) {
    return {
      ok: false,
      error: `You can feature at most ${MAX_FEATURED} products.`,
    };
  }

  try {
    await setFeaturedIds(ids);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Could not save: ${err.message}`
          : "Could not save the featured list.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/featured");
  revalidatePath("/admin");
  return { ok: true, savedAt: Date.now(), count: ids.length };
}
