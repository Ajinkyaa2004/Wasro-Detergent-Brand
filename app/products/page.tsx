import type { Metadata } from "next";
import { CATEGORIES } from "@/data/products";
import { getResolvedProducts } from "@/lib/server/products-resolved";
import { PageHero } from "@/components/ui/page-hero";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { CategoryShowcaseHero } from "@/components/products/category-showcase-hero";
// Removed: the sticky CategoryPillNav. Visitors flagged it as interruptive
// during scroll. The CategoryShowcaseHero on top of the page already lets
// people jump to a category, and the in-page section headings make
// orientation obvious. The component file is kept on disk in case we
// want to revive it as a non-sticky/condensed variant later.
// import { CategoryPillNav } from "@/components/products/category-pill-nav";
import { CategorySection } from "@/components/products/category-section";
import { OffersSection } from "@/components/products/offers-section";
import { SectionWave } from "@/components/ui/section-wave";
import {
  JsonLd,
  buildMetadata,
  productsItemListLd,
  breadcrumbLd,
  collectionPageLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Wasro Products — Detergent, Dishwash & Clothwash",
  description:
    "Browse all 14 Wasro SKUs — detergent powder, dishwash bars, dishwash tubs & clothwash bars. MRP, pack sizes & free-gift details, from ₹5 to 4kg jumbo packs.",
  path: "/products",
  keywords: [
    "Wasro products",
    "Wasro detergent price list",
    "Wasro dishwash bar",
    "Wasro 1kg detergent",
    "Wasro 2kg detergent with bucket",
    "detergent powder 1kg price",
    "dishwash bar Rs 5",
  ],
});

// Per-transition wave colors that match each section's tint
const WAVE_COLORS: Record<string, { from: string; to: string }> = {
  "detergent-powder->dishwash-bar": { from: "#EFF6FF", to: "#F7FEE7" },
  "dishwash-bar->dishwash-tub": { from: "#F7FEE7", to: "#FFFBEB" },
  "dishwash-tub->clothwash-bar": { from: "#FFFBEB", to: "#FFF1F2" },
};

// Force-dynamic so admin price edits are reflected immediately.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // Resolved = data file defaults + admin price overrides + image URLs
  const allProducts = await getResolvedProducts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          collectionPageLd({
            name: "Wasro Product Catalogue",
            description:
              "All 14 Wasro SKUs across detergent powder, dishwash bar, dishwash tub, and clothwash bar.",
            path: "/products",
            itemList: productsItemListLd(allProducts),
          }),
        ]}
      />
      <PageHero
        eyebrow="Our Range"
        title={
          <>
            <AnimatedCounter value={14} className="text-wasro-blue" /> products.{" "}
            <AnimatedCounter value={4} className="text-wasro-blue" /> categories.
            <br className="hidden md:block" />
            One trusted brand.
          </>
        }
        subtitle="From a ₹10 sachet to a 4kg mega pack with a free drum, Wasro covers every Indian household need — with a free gift in every family pack."
      />

      {/* Visual category doorways */}
      <CategoryShowcaseHero />

      {/* Free-gift / offers band — gift-with-pack ladder + wholesale bag */}
      <OffersSection products={allProducts} />

      {/* Sticky CategoryPillNav removed — felt interruptive on scroll.
          The CategoryShowcaseHero above already provides category jumps. */}

      {/* Themed category sections with wave dividers between */}
      {CATEGORIES.map((category, idx) => {
        const items = allProducts.filter((p) => p.category === category.id);
        const isLast = idx === CATEGORIES.length - 1;
        const nextCat = CATEGORIES[idx + 1];
        const waveKey = nextCat ? `${category.id}->${nextCat.id}` : null;
        const waveColors = waveKey ? WAVE_COLORS[waveKey] : null;

        return (
          <div key={category.id}>
            <CategorySection category={category} products={items} />
            {!isLast && waveColors && (
              <SectionWave from={waveColors.from} to={waveColors.to} />
            )}
          </div>
        );
      })}
    </>
  );
}
