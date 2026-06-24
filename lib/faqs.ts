/**
 * Admin-editable FAQ list shown on the About page.
 *
 * Stored as an ordered array of Q/A pairs.
 * Used by both the visible <details>/<summary> render AND the FAQPage
 * JSON-LD that powers Google's rich-result snippets.
 *
 * Storage key: `wasro:faqs`
 */

import { kvGet, kvSet } from "./storage";

export type FaqEntry = { q: string; a: string };

export const MAX_FAQS = 20;
export const MAX_QUESTION_LEN = 200;
export const MAX_ANSWER_LEN = 1500;

export const DEFAULT_FAQS: FaqEntry[] = [
  {
    q: "Where can I buy Wasro?",
    a: "Across 121+ retail stores in Assam, Meghalaya, Manipur, Tripura, Mizoram, Nagaland, Arunachal Pradesh, West Bengal, Bihar, and Odisha. Ask your local grocer for Wasro, or send us a bulk enquiry to stock it.",
  },
  {
    q: "Are the free gifts really included?",
    a: "Yes — every family-pack of Wasro detergent powder ships with a real, useful gift. The 400g pack includes a 1L mug; the 500g pack a free ₹5 dishwash bar; the 2kg pack a printed bucket with lid (or a printed tub); the 3kg pack a drum or big tub. Dishwash tubs include a free scrubber.",
  },
  {
    q: "Do you offer bulk discounts for shops and institutions?",
    a: "Yes. Send your requirement through the Bulk Orders page or WhatsApp us, and our team will respond within one working day with pricing, MOQs, and dispatch timelines.",
  },
  {
    q: "Where is Wasro made?",
    a: "Wasro is manufactured by Madhav Industries at Plot No. 81, Brahmaputra Industrial Park, Amingaon-781031, Assam. We work directly with the plant — no middlemen, no overheads.",
  },
];

const KEY = "wasro:faqs";

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function normFaq(raw: unknown): FaqEntry | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const q = clean(r.q, MAX_QUESTION_LEN);
  const a = clean(r.a, MAX_ANSWER_LEN);
  if (!q || !a) return null;
  return { q, a };
}

export async function getFaqs(): Promise<FaqEntry[]> {
  const stored = await kvGet<unknown>(KEY);
  if (!Array.isArray(stored)) return DEFAULT_FAQS;
  const cleaned = stored
    .map(normFaq)
    .filter((f): f is FaqEntry => f !== null)
    .slice(0, MAX_FAQS);
  return cleaned.length ? cleaned : DEFAULT_FAQS;
}

export async function setFaqs(faqs: FaqEntry[]): Promise<void> {
  const cleaned = faqs
    .map(normFaq)
    .filter((f): f is FaqEntry => f !== null)
    .slice(0, MAX_FAQS);
  await kvSet<FaqEntry[]>(KEY, cleaned);
}
