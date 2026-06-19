"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";
import {
  MAX_ANSWER_LEN,
  MAX_FAQS,
  MAX_QUESTION_LEN,
  setFaqs,
  type FaqEntry,
} from "@/lib/faqs";

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

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export async function saveFaqsAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("faqs") ?? "[]"));
  } catch {
    return { ok: false, error: "Invalid FAQ payload." };
  }
  if (!Array.isArray(parsed)) {
    return { ok: false, error: "Expected an array of Q/A pairs." };
  }

  const faqs: FaqEntry[] = [];
  for (const raw of parsed.slice(0, MAX_FAQS)) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const q = clean(r.q, MAX_QUESTION_LEN);
    const a = clean(r.a, MAX_ANSWER_LEN);
    // Silently drop empty pairs — admin can leave half-filled rows for
    // later editing, but they won't show up on the site.
    if (!q || !a) continue;
    faqs.push({ q, a });
  }

  if (faqs.length === 0) {
    return {
      ok: false,
      error:
        "Add at least one FAQ with both a question and an answer before saving.",
    };
  }

  try {
    await setFaqs(faqs);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Could not save: ${err.message}`
          : "Could not save FAQs.",
    };
  }

  revalidatePath("/about");
  revalidatePath("/admin/faqs");
  revalidatePath("/admin");
  return { ok: true, savedAt: Date.now(), count: faqs.length };
}
