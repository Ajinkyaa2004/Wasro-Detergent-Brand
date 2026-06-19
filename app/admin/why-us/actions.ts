"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";
import {
  ALLOWED_ICONS,
  ALLOWED_THEMES,
  DEFAULT_WHY_WASRO,
  MAX_CARDS,
  setWhyWasro,
  type IconName,
  type ThemeName,
  type WhyWasro,
} from "@/lib/why-wasro";

export type SaveState =
  | { ok: true; savedAt: number }
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

export async function saveWhyWasroAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  // Cards come in as a JSON-encoded array from the client.
  let parsedCards: unknown;
  try {
    parsedCards = JSON.parse(String(formData.get("cards") ?? "[]"));
  } catch {
    return { ok: false, error: "Invalid cards payload." };
  }
  if (!Array.isArray(parsedCards)) {
    return { ok: false, error: "Expected an array of cards." };
  }

  const cards = parsedCards.slice(0, MAX_CARDS).map((raw, i) => {
    const fallback = DEFAULT_WHY_WASRO.cards[i] ?? DEFAULT_WHY_WASRO.cards[0];
    if (!raw || typeof raw !== "object") return fallback;
    const r = raw as Record<string, unknown>;
    const icon = (ALLOWED_ICONS as readonly string[]).includes(String(r.icon))
      ? (r.icon as IconName)
      : fallback.icon;
    const theme = (ALLOWED_THEMES as readonly string[]).includes(String(r.theme))
      ? (r.theme as ThemeName)
      : fallback.theme;
    return {
      icon,
      theme,
      title: clean(r.title, 80) || fallback.title,
      body: clean(r.body, 280) || fallback.body,
      stat: clean(r.stat, 12) || fallback.stat,
      statLabel: clean(r.statLabel, 40) || fallback.statLabel,
    };
  });

  const data: WhyWasro = {
    eyebrow:
      clean(formData.get("eyebrow"), 40) || DEFAULT_WHY_WASRO.eyebrow,
    title: clean(formData.get("title"), 80) || DEFAULT_WHY_WASRO.title,
    subtitle:
      clean(formData.get("subtitle"), 280) || DEFAULT_WHY_WASRO.subtitle,
    cards,
  };

  try {
    await setWhyWasro(data);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Could not save: ${err.message}`
          : "Could not save why-us cards.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/why-us");
  revalidatePath("/admin");
  return { ok: true, savedAt: Date.now() };
}
