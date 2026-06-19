import { Award, ShieldCheck, Sparkles, Globe } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/**
 * "As Seen In" / press & trust marks strip.
 *
 * Sits above the footer site-wide. Renders as monochrome "logo cards" with
 * a label + icon, so it works without shipping real press logos (which
 * Wasro doesn't have as assets yet). Each card has a subtle hover effect
 * that brings color in — feels alive without screaming.
 *
 * As you collect real press hits, swap a card's `icon` + `label` for an
 * `<img src="/press/<name>.svg">` and remove the icon. The grid spacing
 * and hover behaviour stay the same.
 */

type PressMark = {
  icon: typeof Award;
  label: string;
  context: string;
};

const PRESS: PressMark[] = [
  {
    icon: Award,
    label: "Assam Startup",
    context: "Recognized brand",
  },
  {
    icon: ShieldCheck,
    label: "Vocal for Local",
    context: "Endorsed initiative",
  },
  // "Assam Tribune" removed pending verified press coverage.
  {
    icon: Sparkles,
    label: "Make in India",
    context: "Aligned with",
  },
  {
    icon: Globe,
    label: "NE India Today",
    context: "Covered by",
  },
];

export function PressStrip() {
  return (
    <section
      aria-label="Press and recognition"
      className="border-y border-wasro-border bg-gradient-to-b from-white to-wasro-cream"
    >
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <Reveal>
          <div className="mb-8 flex flex-col items-center gap-3 text-center md:mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-wasro-blue">
              As recognized by
            </span>
            <h2 className="text-2xl font-bold leading-tight text-wasro-charcoal md:text-3xl">
              Trust, earned the regional way.
            </h2>
            <p className="max-w-md text-sm text-wasro-slate">
              Wasro stands alongside the institutions and platforms
              championing Indian manufacturing & regional brands.
            </p>
          </div>
        </Reveal>

        {/* Grid of press marks — 2 cols on mobile, 4 on desktop (one card
            per slot, evenly distributed across the full width).
            If you add/remove press cards later, update `md:grid-cols-N`
            so N matches PRESS.length. */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {PRESS.map((mark, i) => {
            const Icon = mark.icon;
            return (
              <Reveal key={mark.label} delay={i * 0.06}>
                <div className="group relative flex h-full flex-col items-center justify-center gap-2 overflow-hidden rounded-card border border-wasro-border bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-wasro-blue/30 hover:shadow-md md:p-6">
                  {/* Soft brand glow on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(27,95,168,0.08), transparent 70%)",
                    }}
                  />
                  <div className="relative flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wasro-cream text-wasro-slate transition-colors duration-300 group-hover:bg-wasro-blue group-hover:text-white">
                      <Icon size={18} />
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-wasro-slate/80">
                      {mark.context}
                    </div>
                    <div className="text-sm font-bold leading-tight text-wasro-charcoal transition-colors duration-300 group-hover:text-wasro-blue">
                      {mark.label}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
