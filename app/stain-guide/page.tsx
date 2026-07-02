import type { Metadata } from "next";
import Image from "next/image";
import { StainGuide } from "@/components/stain-guide";
import { STAINS } from "@/data/stains";
import { PRODUCTS } from "@/data/products";
import { getResolvedProducts } from "@/lib/server/products-resolved";
import { PageHero } from "@/components/ui/page-hero";

// Force-dynamic so admin price overrides flow through to the
// product card shown for each stain recommendation.
export const dynamic = "force-dynamic";
import {
  JsonLd,
  buildMetadata,
  breadcrumbLd,
  howToLd,
  collectionPageLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Wasro Stain Guide — Curry, Tea, Grease, Ink & More",
  description:
    "Indian-household stain removal guide. Curry, turmeric, tea, coffee, grease, ink, blood, school-uniform mud — pick the stain you're fighting and get the right Wasro detergent plus a step-by-step technique that actually works.",
  path: "/stain-guide",
  keywords: [
    "stain removal guide India",
    "how to remove curry stain",
    "how to remove turmeric stain",
    "how to remove tea stain from clothes",
    "how to remove grease stain",
    "best detergent for tough stains",
    "Wasro stain guide",
  ],
});

// Build a HowTo blob per stain — Google can surface these as rich results.
const stainHowTos = STAINS.map((s) => {
  const product = PRODUCTS.find((p) => p.id === s.productId);
  return howToLd({
    name: `How to remove ${s.stain.toLowerCase()} stains with ${product?.name ?? "Wasro"}`,
    description: s.techniqueShort,
    image: product?.image,
    totalTimeMinutes: 20,
    supplies: product ? [`${product.name} ${product.size}`, "Cold water"] : ["Cold water"],
    steps: s.steps,
  });
});

export default async function StainGuidePage() {
  // Resolved products = data file defaults + admin price overrides
  const products = await getResolvedProducts();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Stain Guide", path: "/stain-guide" },
          ]),
          collectionPageLd({
            name: "Wasro Stain Guide",
            description:
              "Eight common Indian-household stains, each matched with the right Wasro product and a step-by-step removal technique.",
            path: "/stain-guide",
            itemList: {
              "@context": "https://schema.org",
              "@type": "ItemList",
              numberOfItems: STAINS.length,
              itemListElement: STAINS.map((s, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: s.stain,
              })),
            },
          }),
          ...stainHowTos,
        ]}
      />
      <div className="relative">
        <PageHero
          eyebrow="Wasro Stain Guide"
          title={
            <>
              Tell us the stain.<br />
              We&apos;ll tell you the technique.
            </>
          }
          subtitle="Eight of the most common Indian-household stains, with the right Wasro product and a step-by-step routine that actually works."
          variant="blue"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 hidden h-[280px] w-[280px] -translate-y-1/2 overflow-hidden rounded-full opacity-25 mix-blend-screen md:block lg:right-12 lg:h-[340px] lg:w-[340px]"
        >
          <Image
            src="/lifestyle/stain-hero.webp"
            alt=""
            fill
            sizes="340px"
            className="object-cover"
          />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <StainGuide stains={STAINS} products={products} />
      </section>
    </>
  );
}
