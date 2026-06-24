import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { CategoryStrip } from "@/components/sections/category-strip";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { PackSizes } from "@/components/sections/pack-sizes";
import { LifestyleBanner } from "@/components/sections/lifestyle-banner";
import { WhyWasro } from "@/components/sections/why-wasro";
import { StainGuideTeaser } from "@/components/sections/stain-guide-teaser";
import { BulkCta } from "@/components/sections/bulk-cta";
import { PressStrip } from "@/components/sections/press-strip";
import { Reviews } from "@/components/sections/reviews";
import { SectionWave } from "@/components/ui/section-wave";
import { SplashScreen } from "@/components/splash/splash-screen";
import { getFeaturedProducts } from "@/data/products";
import { getVisibleReviews, aggregate } from "@/lib/reviews";
import {
  JsonLd,
  buildMetadata,
  productsItemListLd,
  plantLocalBusinessLd,
  brandAggregateRatingLd,
} from "@/lib/seo";
import { SITE } from "@/lib/utils";

const COLORS = {
  cream: "#FAF7F2",
  creamDark: "#F0EBE0",
  blue: "#1B5FA8",
  white: "#FFFFFF",
};

// Hero reads the admin-editable offer at request time — force-dynamic so
// the latest offer always appears without a redeploy. Cost is ~20-50ms
// server render vs. static; well worth instant admin updates.
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: `${SITE.brand} — ${SITE.tagline}`,
  description:
    "Wasro is an Indian detergent brand by Madhav Industries — manufactured in Assam, trusted at 121+ stores across Northeast India. Detergent powders, dishwash bars, dishwash tubs & clothwash bars, starting at ₹5. Free gift in every family pack.",
  path: "/",
  keywords: [
    "detergent powder online India",
    "best detergent for hand wash",
    "Assam detergent brand",
    "FMCG Northeast India",
    "Wasro Madhav Industries",
  ],
});

export default async function Home() {
  const featured = getFeaturedProducts();
  // Load reviews here too so we can emit AggregateRating JSON-LD in
  // parallel with rendering the section. The actual Reviews component
  // calls getVisibleReviews() again — same cache hit, ~no extra cost.
  const reviews = await getVisibleReviews();
  const agg = aggregate(reviews);
  const ratingLd = agg
    ? brandAggregateRatingLd({
        average: agg.average,
        count: agg.count,
        featured: reviews.slice(0, 3).map((r) => ({
          author: r.name,
          body: r.body,
          rating: r.rating,
          date: r.date,
        })),
      })
    : null;
  return (
    <>
      {/* First-visit branded splash. Imported here (not in the root
          layout) so it tree-shakes from every other route — visitors
          landing on /products, /find-store, /admin etc never see it. */}
      <SplashScreen />

      {/* Home-page JSON-LD: featured-product ItemList + the manufacturing
          plant as a LocalBusiness + (when reviews exist) brand-level
          AggregateRating. The root layout already emits
          Organization + WebSite, so we don't repeat those here. */}
      <JsonLd
        data={[
          productsItemListLd(featured),
          plantLocalBusinessLd(),
          ...(ratingLd ? [ratingLd] : []),
        ]}
      />
      {/* Above the fold: Hero + first-look sections, render eagerly. */}
      <Hero />
      <CategoryStrip />
      {/* Below the fold: each section opts into `content-visibility:auto`
          so the browser skips layout/paint until it scrolls near. Halves
          the home page's initial paint budget on mobile. */}
      <div className="wasro-cv-auto">
        <FeaturedProducts />
      </div>
      <div className="wasro-cv-auto">
        <PackSizes />
      </div>
      <div className="wasro-cv-auto">
        <LifestyleBanner />
      </div>
      <div className="wasro-cv-auto">
        <WhyWasro />
      </div>
      <div className="wasro-cv-auto">
        <StainGuideTeaser />
      </div>
      <div className="wasro-cv-auto">
        <BulkCta />
      </div>
      {/* Customer reviews — user-level social proof, sits right before
          the institutional Press Strip so the page closes with two
          consecutive trust signals (real households + recognition). */}
      <div className="wasro-cv-auto">
        <Reviews />
      </div>
      <SectionWave from={COLORS.creamDark} to={COLORS.blue} />
      {/* Press / 'As Seen In' — last section before the footer. Frames
          Wasro as an established regional brand to first-time visitors. */}
      <div className="wasro-cv-auto">
        <PressStrip />
      </div>
    </>
  );
}
