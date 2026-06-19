import Link from "next/link";
import { MapPin, Gift } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductImage } from "./product-image";
// import { OrderButtons } from "./order-buttons";
// ^^ Hidden until client is live on Swiggy / Blinkit / BigBasket / JioMart.
//    Un-comment the import + the <OrderButtons /> render below when ready.

export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-wasro-border bg-white shadow-[0_2px_8px_-3px_rgba(15,66,117,0.08)] transition hover:shadow-[0_8px_28px_-8px_rgba(15,66,117,0.18)]">
      <div className="relative">
        <ProductImage
          product={product}
          priority={priority}
          className="aspect-[4/5] w-full"
        />

        {product.offer && (
          <div className="wasro-gift-pulse absolute left-3 top-3 flex items-center gap-1.5 rounded-pill bg-wasro-yellow px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-wasro-charcoal shadow-sm">
            <Gift size={12} className="shrink-0" />
            <span className="line-clamp-1">{product.offer}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-tight text-wasro-charcoal">
            {product.name}
          </h3>
          <p className="text-sm text-wasro-slate">{product.size}</p>
        </div>

        <div className="flex items-baseline gap-2">
          {product.mrp != null ? (
            <>
              <span className="text-2xl font-bold text-wasro-blue">
                ₹{product.mrp}
              </span>
              <span className="text-xs text-wasro-slate">MRP</span>
            </>
          ) : (
            // No published price yet — admin can set it from /admin/pricing.
            <span className="rounded-pill bg-wasro-cream px-3 py-1 text-xs font-semibold text-wasro-slate">
              Price coming soon
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-sm text-wasro-slate">
          {product.description}
        </p>

        <div className="mt-auto space-y-3 pt-2">
          {/* TEMP: platform-pills hidden until client is listed on
              Swiggy / Blinkit / BigBasket / JioMart. The OrderButtons
              component + ORDER_LINKS in data/products.ts are kept so
              we can re-enable with a single uncomment + import.
          <OrderButtons variant="compact" />
          */}
          <Link
            href="/find-store"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-wasro-blue hover:text-wasro-blue-dark"
          >
            <MapPin size={12} />
            Find in store near you
          </Link>
        </div>
      </div>
    </article>
  );
}
