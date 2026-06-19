/**
 * Admin-editable rotating headline words used by the hero's
 * <CyclingHeadline /> component.
 *
 * Stored as a small ordered array. Empty strings are stripped on read so
 * a half-filled form doesn't render gaps.
 */

import { kvGet, kvSet } from "./storage";

const KEY = "wasro:headlines";

export const DEFAULT_HEADLINES: string[] = [
  "Trusted clean.",
  "Honest pricing.",
  "Free gifts inside.",
  "Made in Assam.",
];

/** Hard cap — CyclingHeadline reserves width for the longest word; too
 *  many words just means viewers see them less often. 6 is a sensible
 *  upper bound for the design. */
export const MAX_HEADLINES = 6;
export const MAX_HEADLINE_LENGTH = 28;

export async function getHeadlines(): Promise<string[]> {
  const stored = await kvGet<string[]>(KEY);
  if (!Array.isArray(stored)) return DEFAULT_HEADLINES;
  const cleaned = stored
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter((s) => s.length > 0)
    .slice(0, MAX_HEADLINES);
  return cleaned.length ? cleaned : DEFAULT_HEADLINES;
}

export async function setHeadlines(headlines: string[]): Promise<void> {
  const cleaned = headlines
    .map((s) => (typeof s === "string" ? s.trim().slice(0, MAX_HEADLINE_LENGTH) : ""))
    .filter((s) => s.length > 0)
    .slice(0, MAX_HEADLINES);
  await kvSet<string[]>(KEY, cleaned);
}
