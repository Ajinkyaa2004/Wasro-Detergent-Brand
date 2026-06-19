"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";
import {
  DEFAULT_HERO_CONTENT,
  setHeroContent,
  type HeroContent,
} from "@/lib/hero-content";

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

function clean(v: FormDataEntryValue | null, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function num(v: FormDataEntryValue | null, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function validateHref(href: string, fieldName: string): string | null {
  if (!href) return `${fieldName} is required.`;
  const isPath = href.startsWith("/") && !href.startsWith("//");
  const isHttp = /^https?:\/\//i.test(href);
  if (!isPath && !isHttp) {
    return `${fieldName} must be a site path (/...) or a https:// URL.`;
  }
  return null;
}

export async function saveHeroContentAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  const content: HeroContent = {
    chipText:
      clean(formData.get("chipText"), 80) || DEFAULT_HERO_CONTENT.chipText,
    secondLine:
      clean(formData.get("secondLine"), 80) || DEFAULT_HERO_CONTENT.secondLine,
    subtitle:
      clean(formData.get("subtitle"), 400) || DEFAULT_HERO_CONTENT.subtitle,
    primaryCta: {
      label:
        clean(formData.get("primaryCta_label"), 40) ||
        DEFAULT_HERO_CONTENT.primaryCta.label,
      href:
        clean(formData.get("primaryCta_href"), 500) ||
        DEFAULT_HERO_CONTENT.primaryCta.href,
    },
    secondaryCta: {
      label:
        clean(formData.get("secondaryCta_label"), 40) ||
        DEFAULT_HERO_CONTENT.secondaryCta.label,
      href:
        clean(formData.get("secondaryCta_href"), 500) ||
        DEFAULT_HERO_CONTENT.secondaryCta.href,
    },
    stats: [0, 1, 2].map((i) => ({
      value: num(
        formData.get(`stat${i}_value`),
        DEFAULT_HERO_CONTENT.stats[i].value
      ),
      prefix: clean(formData.get(`stat${i}_prefix`), 4) || undefined,
      suffix: clean(formData.get(`stat${i}_suffix`), 4) || undefined,
      label:
        clean(formData.get(`stat${i}_label`), 60) ||
        DEFAULT_HERO_CONTENT.stats[i].label,
    })),
    madeInAssamChip:
      clean(formData.get("madeInAssamChip"), 40) ||
      DEFAULT_HERO_CONTENT.madeInAssamChip,
  };

  // Validate CTA links
  const e1 = validateHref(content.primaryCta.href, "Primary CTA link");
  if (e1) return { ok: false, error: e1 };
  const e2 = validateHref(content.secondaryCta.href, "Secondary CTA link");
  if (e2) return { ok: false, error: e2 };

  try {
    await setHeroContent(content);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Could not save: ${err.message}`
          : "Could not save hero content.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/hero-content");
  revalidatePath("/admin");

  return { ok: true, savedAt: Date.now() };
}
