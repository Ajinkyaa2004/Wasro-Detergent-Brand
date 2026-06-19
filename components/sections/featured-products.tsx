import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { getFeaturedProductsResolved } from "@/lib/server/featured-resolved";
import { Reveal } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { WaveDivider } from "@/components/ui/wave-divider";

// Async server component — reads the admin-editable Featured list at
// request time so changes appear without a redeploy.
export async function FeaturedProducts() {
  // Resolved products already include image URLs (handled inside the
  // server resolver), so no extra withImages() call is needed.
  const featured = await getFeaturedProductsResolved();

  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <Reveal>
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-wasro-blue">
              Most Loved
            </span>
            <h2 className="mt-2 text-3xl font-bold text-wasro-charcoal md:text-4xl">
              Family favourites
            </h2>
            <p className="mt-2 max-w-lg text-wasro-slate">
              The packs households across Assam, Meghalaya, and beyond reach for
              week after week — every one ships with a useful free gift.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-pill bg-wasro-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-wasro-blue hover:-translate-y-0.5"
          >
            View all products <ArrowRight size={14} />
          </Link>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product, i) => (
          <Reveal key={product.id} delay={i * 0.08}>
            <TiltCard intensity={6}>
              <ProductCard product={product} priority={i < 2} />
            </TiltCard>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}
