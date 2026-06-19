import { PRODUCTS } from "@/data/products";
import { getProductPrices } from "@/lib/product-prices";
import { PricingEditor } from "./pricing-editor";

export const dynamic = "force-dynamic";

export default async function PricingAdminPage() {
  const overrides = await getProductPrices();
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-wasro-blue">
          Product Pricing
        </span>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-wasro-charcoal">
          Edit per-product MRP
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-wasro-slate">
          Set or update the printed MRP for any SKU. Leave a row blank to
          fall back to the data-file default (or to show &quot;Price coming
          soon&quot; if no default exists). Saves apply across the home,
          /products, /stain-guide and SEO Product schema immediately.
        </p>
      </div>
      <PricingEditor products={PRODUCTS} initialOverrides={overrides} />
    </div>
  );
}
