import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Ripple } from "@/components/ui/ripple";

export function LifestyleBanner() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative h-[520px] w-full md:h-[600px]">
        <Image
          src="/lifestyle/hero-family.jpg"
          alt="A family doing laundry together with Wasro"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlay for text contrast */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-wasro-charcoal/85 via-wasro-charcoal/55 to-wasro-charcoal/10"
        />
        {/* Bottom soft fade */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-wasro-charcoal/40 to-transparent"
        />
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="max-w-xl text-wasro-cream">
              <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-yellow/95 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-wasro-charcoal shadow-lg">
                <Heart size={12} /> In real homes
              </span>
              <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                Trusted in homes <br className="hidden md:block" />
                across Northeast India.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-wasro-cream/85">
                One free gift, one family pack, one fresh start to the day.
                Wasro shows up where laundry actually happens — in the kitchen
                corner, the balcony, the utility area.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <MagneticButton strength={0.22}>
                  <Ripple>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 rounded-pill bg-wasro-yellow px-6 py-3 text-sm font-bold text-wasro-charcoal shadow-xl transition hover:bg-wasro-yellow-dark"
                    >
                      Explore the range <ArrowRight size={14} />
                    </Link>
                  </Ripple>
                </MagneticButton>
                <Link
                  href="/products"
                  className="rounded-pill bg-white/10 px-6 py-3 text-sm font-semibold text-wasro-cream ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
                >
                  Browse the range
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
