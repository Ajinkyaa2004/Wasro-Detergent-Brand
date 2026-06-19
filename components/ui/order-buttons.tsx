import { ORDER_LINKS } from "@/data/products";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

const PLATFORMS: { label: string; href: string; tone: string }[] = [
  { label: "Swiggy", href: ORDER_LINKS.swiggy, tone: "bg-orange-500 hover:bg-orange-600" },
  { label: "Blinkit", href: ORDER_LINKS.zomato, tone: "bg-yellow-400 hover:bg-yellow-500 text-wasro-charcoal" },
  { label: "BigBasket", href: ORDER_LINKS.bigbasket, tone: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "JioMart", href: ORDER_LINKS.jiomart, tone: "bg-blue-600 hover:bg-blue-700" },
];

export function OrderButtons({
  variant = "compact",
  className,
}: {
  variant?: "compact" | "full";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap gap-1.5", className)}>
        {PLATFORMS.map((p) => (
          <a
            key={p.label}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-semibold text-white transition",
              p.tone
            )}
          >
            {p.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}>
      {PLATFORMS.map((p) => (
        <a
          key={p.label}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-pill px-4 py-3 text-sm font-semibold text-white shadow-sm transition",
            p.tone
          )}
        >
          <ShoppingBag size={14} />
          {p.label}
        </a>
      ))}
    </div>
  );
}
