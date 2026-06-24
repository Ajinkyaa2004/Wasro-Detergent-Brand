import Image from "next/image";
import Link from "next/link";
import { Gift, ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/data/products";
import { Reveal } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";

/**
 * Offers / free-gift section for the Products page.
 *
 * Premium FMCG presentation of the gift-with-pack ladder confirmed by
 * the client:
 *   - 2kg  (₹280, 10 pc/bag)  → free Bucket or Tub
 *   - 3kg  (₹430,  8 pc/bag)  → free Drum or Big Tub
 *   - 4kg  (₹600,  6 pc/bag)  → free 40L Drum
 *
 * Plus the ₹10 wholesale canvas-bag offer (1 free bucket per bag) as a
 * wide hero banner that routes retailers to the bulk-orders page.
 *
 * Anchored at #offers — linked from the footer and the hero offer
 * slideshow.
 */

type GiftDeal = {
  id: string;
  size: string;
  gift: string;
  perBag: string;
};

const GIFT_LADDER: GiftDeal[] = [
  { id: "powder-2kg", size: "2 kg", gift: "Bucket or Tub", perBag: "10 packs / bag" },
  { id: "powder-3kg", size: "3 kg", gift: "Drum or Big Tub", perBag: "8 packs / bag" },
  { id: "powder-4kg", size: "4 kg", gift: "40 L Drum", perBag: "6 packs / bag" },
];

export function OffersSection({ products }: { products: Product[] }) {
  const byId = new Map(products.map((p) => [p.id, p]));

  return (
    <section
      id="offers"
      className="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-white to-wasro-cream"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        {/* Header */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-yellow/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-wasro-yellow-dark">
              <Gift size={12} /> Free gift in every pack
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight text-wasro-charcoal md:text-5xl">
              More in every family pack.
            </h2>
            <p className="mt-4 text-wasro-slate">
              Every Wasro family pack comes with a genuinely useful free gift —
              no coupons, no stickers, no fine print. Just real value, packed
              right in.
            </p>
          </div>
        </Reveal>

        {/* Gift ladder — 3 cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GIFT_LADDER.map((deal, i) => {
            const product = byId.get(deal.id);
            return (
              <Reveal key={deal.id} delay={i * 0.08}>
                <TiltCard intensity={5}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_2px_16px_-6px_rgba(15,66,117,0.12)] ring-1 ring-wasro-border transition-shadow duration-500 hover:shadow-[0_20px_50px_-18px_rgba(15,66,117,0.28)]">
                    {/* Image */}
                    <div className="relative aspect-[5/4] w-full overflow-hidden bg-wasro-cream">
                      {product?.imageUrl && (
                        <Image
                          src={product.imageUrl}
                          alt={`Wasro ${deal.size} detergent pack with free ${deal.gift}`}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      {/* Free-gift ribbon */}
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-pill bg-wasro-yellow px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-wasro-charcoal shadow-md">
                        <Gift size={12} /> Free {deal.gift}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-xl font-bold text-wasro-charcoal">
                          Wasro {deal.size}
                        </h3>
                        {product?.mrp != null && (
                          <span className="text-lg font-bold text-wasro-blue">
                            ₹{product.mrp}
                            <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-wasro-slate">
                              MRP
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-wasro-slate">
                        <Sparkles size={14} className="text-wasro-yellow-dark" />
                        Comes with a free{" "}
                        <span className="font-semibold text-wasro-charcoal">
                          {deal.gift.toLowerCase()}
                        </span>
                      </div>

                      <div className="mt-auto border-t border-wasro-border pt-3 text-xs font-medium uppercase tracking-wider text-wasro-slate">
                        Retail packing · {deal.perBag}
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        {/* Wholesale bag banner */}
        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-[1.75rem] bg-wasro-blue text-white shadow-xl ring-1 ring-wasro-blue-dark/20">
            <div className="grid grid-cols-1 items-center gap-0 md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-[16/10] w-full md:aspect-auto md:h-full md:min-h-[300px]">
                <Image
                  src="/lifestyle/offers-bag.webp"
                  alt="Wasro ₹10 wholesale canvas bag with a free bucket inside"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {/* Copy */}
              <div className="p-8 md:p-12">
                <span className="inline-flex items-center gap-2 rounded-pill bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                  <Sparkles size={12} /> Wholesale offer
                </span>
                <h3 className="mt-4 text-2xl font-bold leading-tight md:text-3xl">
                  The ₹10 pack, packed in a premium canvas bag.
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                  Each canvas bag holds 80 of our ₹10 Multi-Enzymes packets —
                  and ships with <span className="font-semibold text-white">one
                  free bucket</span>. Built for kirana stores, retailers, and
                  wholesalers.
                </p>
                <Link
                  href="/bulk-orders"
                  className="mt-6 inline-flex items-center gap-2 rounded-pill bg-wasro-yellow px-6 py-3 text-sm font-bold text-wasro-charcoal shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-400"
                >
                  Enquire for wholesale <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Honest fine print — keeps it premium, not shady */}
        <p className="mt-6 text-center text-xs text-wasro-slate/80">
          Free gifts (bucket / tub / drum) are subject to availability and may
          vary by region and stock. MRP inclusive of all taxes.
        </p>
      </div>
    </section>
  );
}
