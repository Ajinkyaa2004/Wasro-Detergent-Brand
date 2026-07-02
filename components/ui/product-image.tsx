import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";
import Image from "next/image";

const CATEGORY_STYLES: Record<Product["category"], string> = {
  "detergent-powder":
    "bg-gradient-to-br from-wasro-blue via-wasro-blue to-wasro-blue-dark text-white",
  "dishwash-bar":
    "bg-gradient-to-br from-wasro-yellow-dark via-wasro-yellow to-amber-300 text-wasro-charcoal",
  "dishwash-tub":
    "bg-gradient-to-br from-wasro-blue-light via-white to-wasro-cream text-wasro-blue-dark",
  "clothwash-bar":
    "bg-gradient-to-br from-wasro-coral via-orange-400 to-wasro-yellow text-white",
};

const CATEGORY_LABEL: Record<Product["category"], string> = {
  "detergent-powder": "DETERGENT",
  "dishwash-bar": "DISHWASH",
  "dishwash-tub": "DISHWASH",
  "clothwash-bar": "CLOTHWASH",
};

export function ProductImage({
  product,
  className,
  priority,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  if (product.imageUrl) {
    // Keyword-rich alt: pack name + size + free gift (when present).
    // "FREE 40L Drum with this pack" → "with free 40l drum".
    const gift = product.offer
      ? ` with free ${product.offer
          .replace(/^(VALUE PACK\s*·\s*)?FREE\s*/i, "")
          .replace(/\s*with this pack$/i, "")
          .trim()
          .toLowerCase()}`
      : "";
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-card bg-gradient-to-br from-wasro-cream-dark via-white to-wasro-cream",
          className
        )}
      >
        <Image
          src={product.imageUrl}
          alt={`${product.name} ${product.size}${gift}`}
          fill
          priority={priority}
          // 30vw at desktop covers both the 4-col product grid (~25vw)
          // and the hero's max-w-md (448px ≈ 31vw of a 1440 viewport)
          // without under-requesting on the LCP hero image.
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-between overflow-hidden rounded-card p-6",
        CATEGORY_STYLES[product.category],
        className
      )}
      aria-label={`${product.name} ${product.size}`}
    >
      <div className="flex w-full items-start justify-between text-[10px] font-semibold tracking-[0.18em] opacity-90">
        <span>{CATEGORY_LABEL[product.category]}</span>
        <span>WASRO®</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="text-[clamp(2.25rem,7vw,3.5rem)] font-bold leading-none tracking-tight">
          {product.size}
        </span>
        <span className="mt-2 text-xs font-medium uppercase tracking-wider opacity-80">
          {product.shortName}
        </span>
      </div>

      <div className="w-full text-[10px] font-medium uppercase tracking-wider opacity-70">
        Made in Assam · India
      </div>
    </div>
  );
}
