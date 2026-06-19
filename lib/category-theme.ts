import type { ProductCategory } from "@/data/products";

export type CategoryTheme = {
  emoji: string;
  iconGradient: string; // tailwind classes for gradient bg
  cardGradient: string;
  tintBg: string;       // subtle section tint
  accentText: string;
  accentRing: string;
  shadowColor: string;  // for box-shadow
};

export const CATEGORY_THEMES: Record<ProductCategory, CategoryTheme> = {
  "detergent-powder": {
    emoji: "🧺",
    iconGradient: "bg-gradient-to-br from-wasro-blue to-wasro-blue-dark",
    cardGradient: "from-wasro-blue-light/70 via-white to-white",
    tintBg: "bg-gradient-to-b from-wasro-blue-light/25 via-white to-white",
    accentText: "text-wasro-blue",
    accentRing: "ring-wasro-blue/25",
    shadowColor: "shadow-wasro-blue/15",
  },
  "dishwash-bar": {
    emoji: "🍽️",
    iconGradient: "bg-gradient-to-br from-lime-500 to-emerald-700",
    cardGradient: "from-lime-100 via-white to-white",
    tintBg: "bg-gradient-to-b from-lime-50 via-white to-white",
    accentText: "text-lime-700",
    accentRing: "ring-lime-500/25",
    shadowColor: "shadow-lime-500/15",
  },
  "dishwash-tub": {
    emoji: "🫧",
    iconGradient: "bg-gradient-to-br from-amber-400 to-amber-600",
    cardGradient: "from-amber-100 via-white to-white",
    tintBg: "bg-gradient-to-b from-amber-50 via-white to-white",
    accentText: "text-amber-700",
    accentRing: "ring-amber-500/25",
    shadowColor: "shadow-amber-500/15",
  },
  "clothwash-bar": {
    emoji: "👕",
    iconGradient: "bg-gradient-to-br from-rose-500 to-fuchsia-700",
    cardGradient: "from-rose-100 via-white to-white",
    tintBg: "bg-gradient-to-b from-rose-50 via-white to-white",
    accentText: "text-rose-700",
    accentRing: "ring-rose-500/25",
    shadowColor: "shadow-rose-500/15",
  },
};
