import Link from "next/link";
import { Handshake, ArrowRight, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { BubbleField } from "@/components/ui/bubble-field";

export function BecomeDistributor() {
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hi Wasro team! I'm interested in becoming a Wasro distributor in my area. Could you share the partnership details?"
  )}`;

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-wasro-blue text-wasro-cream shadow-2xl">
      <BubbleField count={6} seed={47} tone="light" className="opacity-50" />

      {/* Decorative blob */}
      <div
        aria-hidden
        className="wasro-mesh-blob pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(244,196,48,0.32), transparent 70%)",
        }}
      />

      <div className="relative grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-[1fr_auto] md:gap-12 md:p-14">
        <Reveal>
          <div>
            <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-yellow px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-wasro-charcoal shadow-lg">
              <Handshake size={12} /> Partnership opportunity
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-[1.05] md:text-5xl">
              Want to stock Wasro <br className="hidden md:block" />
              in your area?
            </h2>
            <p className="mt-4 max-w-xl text-wasro-cream/85">
              We&apos;re actively expanding our distributor network across
              India. If you run a retail shop, wholesale operation, or
              regional distribution business, we&apos;d love to talk about
              becoming a Wasro partner.
            </p>
            <p className="mt-2 max-w-xl text-sm text-wasro-cream/70">
              Quick onboarding · Margin-friendly pricing · Marketing support · Free promotional gifts for your customers
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-pill bg-emerald-500 px-7 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/30 transition hover:bg-emerald-600 hover:-translate-y-0.5"
            >
              <MessageCircle size={16} /> WhatsApp partnership team
            </a>
            <Link
              href="/bulk-orders"
              className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-7 py-4 text-base font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
            >
              Or send an enquiry <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
