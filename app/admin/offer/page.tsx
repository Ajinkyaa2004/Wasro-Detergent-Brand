import { PRODUCTS } from "@/data/products";
import { withImages } from "@/lib/server/product-images";
import { getOffer } from "@/lib/offer";
import { OfferEditor } from "./offer-editor";

export const dynamic = "force-dynamic";

export default async function OfferAdminPage() {
  const offer = await getOffer();
  // Resolve product images server-side so the live preview shows the
  // exact image visitors will see, with the optimized URL baked in.
  const productsWithImages = withImages(PRODUCTS);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-wasro-blue">
          Hero Offer Slideshow
        </span>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-wasro-charcoal">
          Edit the homepage slideshow
        </h1>
        <p className="mt-2 text-sm text-wasro-slate">
          Up to 3 slides rotate on the home hero. Each slide picks its own
          product image — the right side of the hero swaps in sync as the
          slide changes. Changes save instantly.
        </p>
      </div>

      <OfferEditor initial={offer} products={productsWithImages} />
    </div>
  );
}
