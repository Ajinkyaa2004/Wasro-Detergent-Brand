import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Gift } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/utils";

/**
 * PackSizes — replaces the old VariantShowcase (which advertised
 * Classic / Multi-Enzymes / Premium+ formulas; only Multi-Enzymes now
 * exists in the catalogue). Reframes the section as "Three pack sizes
 * for every Indian home", tying directly to the gift-with-pack ladder
 * shown in the hero offer slideshow.
 */

type PackSize = {
  id: string;
  name: string;
  tagline: string;
  pitch: string;
  image: string;
  startsAt: string;
  giftLabel?: string;
  anchor: string; // /products#anchor
  accent: { from: string; to: string; ring: string; chip: string; text: string };
};

const SIZES: PackSize[] = [
  {
    id: "sachets",
    name: "Sachet",
    tagline: "Pocket-priced single-wash",
    pitch:
      "The ₹10 sachet — the easiest way to try Wasro, perfect for kirana shoppers, travel, hostels, and one-off heavy stains.",
    image: "/products/powder-10.webp",
    startsAt: "₹10",
    anchor: "/products#detergent-powder",
    accent: {
      from: "from-wasro-yellow",
      to: "to-amber-500",
      ring: "ring-amber-400/25",
      chip: "bg-amber-500 text-white",
      text: "text-amber-700",
    },
  },
  {
    id: "family",
    name: "Family Packs",
    tagline: "Weekly laundry sorted",
    pitch:
      "400g, 500g & 1kg packs for the everyday household wash. The reliable Multi-Enzymes formula at family-friendly prices.",
    image: "/products/powder-1kg.webp",
    startsAt: "₹40",
    anchor: "/products#detergent-powder",
    accent: {
      from: "from-wasro-blue",
      to: "to-wasro-blue-dark",
      ring: "ring-wasro-blue/20",
      chip: "bg-wasro-blue text-white",
      text: "text-wasro-blue",
    },
  },
  {
    id: "jumbo",
    name: "Jumbo Packs",
    tagline: "Best price-per-wash",
    pitch:
      "2kg, 3kg & 4kg mega packs — built for big families, joint households, and small businesses. The 4kg ships with a FREE 40-litre drum.",
    image: "/products/powder-4kg.webp",
    startsAt: "₹280",
    giftLabel: "Free drum with 4kg",
    anchor: "/products#detergent-powder",
    accent: {
      from: "from-rose-500",
      to: "to-fuchsia-700",
      ring: "ring-rose-400/25",
      chip: "bg-rose-500 text-white",
      text: "text-rose-600",
    },
  },
];

export function PackSizes() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <Reveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-yellow/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-wasro-yellow-dark">
                <Sparkles size={12} /> Three pack sizes
              </span>
              <h2 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight text-wasro-charcoal md:text-5xl">
                Built for every Indian home.
              </h2>
              <p className="mt-3 max-w-xl text-wasro-slate">
                From a ₹10 sachet for the next-door kirana to a 4kg jumbo pack
                with a free drum — Wasro Multi-Enzymes covers every household
                wash habit.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {SIZES.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.1}>
              <TiltCard intensity={5}>
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] ring-1 transition-shadow duration-500 hover:shadow-2xl",
                    v.accent.ring
                  )}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-wasro-cream">
                    <Image
                      src={v.image}
                      alt={`Wasro ${v.name}`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Subtle accent glow */}
                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-gradient-to-tr opacity-0 mix-blend-overlay transition-opacity duration-700 ease-out group-hover:opacity-25",
                        v.accent.from,
                        v.accent.to
                      )}
                    />
                    {/* Bottom-fade for text legibility */}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-wasro-charcoal/85 via-wasro-charcoal/40 to-transparent"
                    />
                    {/* Floating chip — top-left: size name */}
                    <span
                      className={cn(
                        "absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg",
                        v.accent.chip
                      )}
                    >
                      <Sparkles size={12} /> {v.name}
                    </span>
                    {/* Starting-at badge — top-right */}
                    <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-pill bg-white/95 px-3 py-1.5 text-xs font-bold text-wasro-charcoal shadow-lg backdrop-blur">
                      Starts at <span className="text-wasro-blue">{v.startsAt}</span>
                    </span>
                    {/* Tagline overlaid on image */}
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                        Wasro {v.name}
                      </p>
                      <h3 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">
                        {v.tagline}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-4 bg-white p-6">
                    <p className="text-sm leading-relaxed text-wasro-slate">
                      {v.pitch}
                    </p>
                    {v.giftLabel && (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-wasro-yellow/20 px-3 py-1.5 text-xs font-bold text-wasro-yellow-dark">
                        <Gift size={12} /> {v.giftLabel}
                      </span>
                    )}
                    <Link
                      href={v.anchor}
                      className={cn(
                        "mt-auto inline-flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3",
                        v.accent.text
                      )}
                    >
                      Browse {v.name} <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
