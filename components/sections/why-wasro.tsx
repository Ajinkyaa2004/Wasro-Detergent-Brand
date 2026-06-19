import {
  Gift,
  ShieldCheck,
  Wallet,
  MapPin,
  Sparkles,
  Factory,
  Truck,
  Award,
  Heart,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { getWhyWasro, type IconName, type ThemeName } from "@/lib/why-wasro";

/**
 * Icon registry — the admin picks an icon by string ID; this maps back
 * to a real Lucide component. Add new icons here in lockstep with
 * ALLOWED_ICONS in lib/why-wasro.ts.
 */
const ICONS: Record<IconName, LucideIcon> = {
  Gift,
  Wallet,
  ShieldCheck,
  MapPin,
  Factory,
  Truck,
  Sparkles,
  Award,
  Heart,
  Leaf,
};

/**
 * Theme registry — the admin picks a theme by string ID. Each maps to a
 * coordinated set of Tailwind class fragments for ring, gradient icon
 * background, etc. Constraining to these palettes prevents off-brand
 * colours from sneaking onto the home page.
 */
const THEMES: Record<
  ThemeName,
  { ring: string; iconBg: string; iconRing: string }
> = {
  yellow: {
    ring: "hover:ring-wasro-yellow/40",
    iconBg: "bg-gradient-to-br from-wasro-yellow to-amber-600",
    iconRing: "ring-wasro-yellow/30",
  },
  blue: {
    ring: "hover:ring-wasro-blue/40",
    iconBg: "bg-gradient-to-br from-wasro-blue to-wasro-blue-dark",
    iconRing: "ring-wasro-blue/30",
  },
  emerald: {
    ring: "hover:ring-emerald-400/40",
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    iconRing: "ring-emerald-500/30",
  },
  coral: {
    ring: "hover:ring-wasro-coral/40",
    iconBg: "bg-gradient-to-br from-wasro-coral to-rose-700",
    iconRing: "ring-wasro-coral/30",
  },
};

export async function WhyWasro() {
  // Admin-editable copy + cards. Falls back to defaults if nothing saved.
  const data = await getWhyWasro();

  return (
    <section className="relative overflow-hidden bg-white wasro-cv-auto">
      {/* CSS dot pattern (cheap, zero-KB) — used to be a 1.79MB PNG at
          4% opacity, which was wasted bandwidth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(27,95,168,0.5) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
              <Sparkles size={12} /> {data.eyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight text-wasro-charcoal md:text-5xl">
              {data.title}
            </h2>
            <p className="mt-3 text-wasro-slate">{data.subtitle}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {data.cards.map((card, i) => {
            const Icon = ICONS[card.icon] ?? Gift;
            const theme = THEMES[card.theme] ?? THEMES.blue;
            return (
              <Reveal key={`${card.title}-${i}`} delay={i * 0.08}>
                <article
                  className={cn(
                    "group relative isolate flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white p-7 ring-1 ring-wasro-border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
                    theme.ring
                  )}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-18deg] opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -right-10 -top-10 z-0 h-32 w-32 rounded-full opacity-25 blur-2xl",
                      theme.iconBg
                    )}
                  />

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="mb-5 flex items-start justify-between">
                      <div
                        className={cn(
                          "inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl ring-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                          theme.iconBg,
                          theme.iconRing
                        )}
                      >
                        <Icon size={22} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold leading-none text-wasro-charcoal">
                          {card.stat}
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-wasro-slate">
                          {card.statLabel}
                        </div>
                      </div>
                    </div>

                    <h3 className="mb-2 text-lg font-bold leading-tight text-wasro-charcoal">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-wasro-slate">
                      {card.body}
                    </p>

                    <span
                      aria-hidden
                      className={cn(
                        "mt-5 block h-1 w-12 rounded-full transition-all duration-500 group-hover:w-full",
                        theme.iconBg
                      )}
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
