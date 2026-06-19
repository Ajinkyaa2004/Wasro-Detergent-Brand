import { PRODUCTS } from "@/data/products";
import { getFeaturedIds } from "@/lib/featured";
import { FeaturedEditor } from "./featured-editor";

export const dynamic = "force-dynamic";

export default async function FeaturedAdminPage() {
  const current = await getFeaturedIds();
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-wasro-blue">
          Family Favourites
        </span>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-wasro-charcoal">
          Choose featured products
        </h1>
        <p className="mt-2 text-sm text-wasro-slate">
          Pick up to 4 products to highlight in the &quot;Family
          favourites&quot; section on the home page. Drag to reorder, tap a
          card to toggle it on or off.
        </p>
      </div>
      <FeaturedEditor products={PRODUCTS} initial={current} />
    </div>
  );
}
