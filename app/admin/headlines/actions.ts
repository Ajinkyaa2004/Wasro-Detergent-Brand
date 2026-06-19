"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";
import { MAX_HEADLINES, setHeadlines } from "@/lib/headlines";

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

export async function saveHeadlinesAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  // The form posts `headlines` as a JSON-encoded ordered string array.
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("headlines") ?? "[]"));
  } catch {
    return { ok: false, error: "Invalid payload." };
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, error: "Expected an array of headline strings." };
  }

  const clean = parsed
    .filter((s): s is string => typeof s === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (clean.length === 0) {
    return { ok: false, error: "Add at least one headline word." };
  }
  if (clean.length > MAX_HEADLINES) {
    return {
      ok: false,
      error: `You can have at most ${MAX_HEADLINES} headline words.`,
    };
  }

  try {
    await setHeadlines(clean);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Could not save: ${err.message}`
          : "Could not save the headlines.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/headlines");
  revalidatePath("/admin");
  return { ok: true, savedAt: Date.now(), count: clean.length };
}
