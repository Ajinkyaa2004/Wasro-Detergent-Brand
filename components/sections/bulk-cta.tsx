import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/utils";
import { BubbleField } from "@/components/ui/bubble-field";
import { Reveal } from "@/components/ui/reveal";

export function BulkCta() {
  return (
    <section className="relative overflow-hidden bg-wasro-cream-dark">
      <BubbleField count={5} seed={5} tone="dark" className="opacity-50" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-8">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-card shadow-xl">
            <Image
              src="/lifestyle/bulk-retail-v2.jpg"
              alt="Wasro shop owner with the full product range on the counter"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-wasro-blue">
              For Retailers & Bulk Buyers
            </span>
            <h2 className="mt-2 text-3xl font-bold text-wasro-charcoal md:text-4xl">
              Stocking a shop, hostel, hotel, or NGO?
            </h2>
            <p className="mt-3 max-w-lg text-wasro-slate">
              We work directly with kirana stores, distributors, and
              institutions across Northeast India. Send us your requirement and
              our team will reach out within one working day with pricing and
              dispatch timelines.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/bulk-orders"
                className="inline-flex items-center gap-2 rounded-pill bg-wasro-blue px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-wasro-blue-dark hover:-translate-y-0.5"
              >
                Send a bulk enquiry <ArrowRight size={14} />
              </Link>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.bulkMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-pill bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 hover:-translate-y-0.5"
              >
                <Phone size={14} /> WhatsApp us
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
