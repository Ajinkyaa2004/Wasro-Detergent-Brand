import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
import { BubbleField } from "@/components/ui/bubble-field";
import { Reveal } from "@/components/ui/reveal";

const POPULAR_STAINS = [
  "Curry & turmeric",
  "Tea & coffee",
  "Grease & oil",
  "Mud & grass",
  "Ink",
  "Blood",
  "Sweat & deodorant",
  "Kid's school uniform",
];

export function StainGuideTeaser() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-wasro-blue text-wasro-cream">
          <Image
            src="/lifestyle/water-bubbles.webp"
            alt=""
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="absolute inset-0 z-0 object-cover opacity-30 mix-blend-screen"
            aria-hidden
          />
          <div
            aria-hidden
            className="absolute inset-0 z-0 bg-gradient-to-br from-wasro-blue via-wasro-blue/95 to-wasro-blue-dark/90"
          />

          <BubbleField count={9} seed={3} tone="light" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 p-8 md:grid-cols-2 md:p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-wasro-cream backdrop-blur">
                <Search size={14} /> Stain Guide
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                What stain are you fighting today?
              </h2>
              <p className="mt-3 max-w-lg text-wasro-cream/80">
                Pick the stain, get the right Wasro product, plus a quick
                hand-wash technique that actually works in Indian households.
              </p>
              <Link
                href="/stain-guide"
                className="mt-6 inline-flex items-center gap-2 rounded-pill bg-wasro-yellow px-6 py-3 text-sm font-bold text-wasro-charcoal shadow-lg transition hover:bg-wasro-yellow-dark hover:-translate-y-0.5"
              >
                Open the Stain Guide <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_STAINS.map((stain) => (
                <Link
                  key={stain}
                  href="/stain-guide"
                  className="rounded-pill bg-white/10 px-4 py-2 text-sm text-wasro-cream backdrop-blur transition hover:bg-white/20 hover:-translate-y-0.5"
                >
                  {stain}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
      </div>
    </section>
  );
}
