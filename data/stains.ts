import { PRODUCTS, type Product } from "./products";

export type StainTheme = {
  primary: string; // strong color for accents
  bg: string;      // soft tint for the panel background gradient
  accent: string;  // bright accent for highlights / cursor bubble
};

export type StainTip = {
  id: string;
  stain: string;
  emoji: string;
  productId: string;
  techniqueShort: string;
  steps: string[];
  theme: StainTheme;
};

export const STAINS: StainTip[] = [
  {
    id: "curry",
    stain: "Curry & turmeric",
    emoji: "🍛",
    productId: "powder-1kg",
    techniqueShort: "Pre-soak in cold water, then rub with Wasro powder paste.",
    steps: [
      "Rinse the stained area immediately with cold water — do NOT use hot water (it sets the turmeric).",
      "Mix 1 tbsp Wasro 1kg detergent powder with cold water to make a thick paste.",
      "Apply the paste, leave for 15 minutes, then hand-rub or machine-wash as usual.",
      "If a yellow shadow remains, dry the cloth in direct sunlight — turmeric breaks down with UV.",
    ],
    theme: {
      primary: "#D97706",
      bg: "#FEF3C7",
      accent: "#F59E0B",
    },
  },
  {
    id: "tea-coffee",
    stain: "Tea & coffee",
    emoji: "☕",
    productId: "powder-1kg",
    techniqueShort: "Blot, then wash with Wasro detergent powder.",
    steps: [
      "Blot the spill with tissue or a clean cloth — don’t rub.",
      "Soak the cloth in cold water with 1 tbsp Wasro 1kg detergent powder for 10 minutes.",
      "Hand-rub the stain or machine-wash on the regular cycle.",
    ],
    theme: {
      primary: "#92400E",
      bg: "#FEF3C7",
      accent: "#B45309",
    },
  },
  {
    id: "grease",
    stain: "Grease & oil",
    emoji: "🛢️",
    productId: "dishtub-350g",
    techniqueShort: "Apply Wasro Dishwash Tub directly to the stain.",
    steps: [
      "Scoop a small amount of Wasro 350g Dishwash Tub onto the grease stain.",
      "Rub gently with the free scrubber for 1 minute.",
      "Wash with detergent powder as normal — the dishwash cuts the oil first.",
    ],
    theme: {
      primary: "#4D7C0F",
      bg: "#ECFCCB",
      accent: "#84CC16",
    },
  },
  {
    id: "mud-grass",
    stain: "Mud & grass",
    emoji: "🌱",
    productId: "powder-2kg",
    techniqueShort: "Brush off dry mud, then pre-soak with Wasro powder.",
    steps: [
      "Wait until the mud dries fully — wet mud spreads into fibres.",
      "Brush off the dry mud with a stiff brush or shake the cloth outdoors.",
      "Soak in warm water with 2 tbsp Wasro 2kg detergent powder for 30 minutes.",
      "Wash on a heavy-cycle or hand-rub firmly. For grass stains, use the clothwash bar on the spot before soaking.",
    ],
    theme: {
      primary: "#166534",
      bg: "#DCFCE7",
      accent: "#22C55E",
    },
  },
  {
    id: "ink",
    stain: "Ink",
    emoji: "🖊️",
    productId: "clothbar-10",
    techniqueShort: "Rub with Wasro Clothwash Bar before washing.",
    steps: [
      "Place a clean white cloth under the stain to absorb excess ink.",
      "Rub the area firmly with the Wasro ₹10 Clothwash Bar.",
      "Wash in cold water with detergent powder. Repeat if any shadow remains.",
    ],
    theme: {
      primary: "#6B21A8",
      bg: "#F3E8FF",
      accent: "#A855F7",
    },
  },
  {
    id: "blood",
    stain: "Blood",
    emoji: "🩸",
    productId: "clothbar-10",
    techniqueShort: "Always cold water — never hot. Wash with clothwash bar.",
    steps: [
      "Rinse immediately with cold running water — hot water cooks blood proteins into the fibre.",
      "Rub the area with the Wasro Clothwash Bar.",
      "Soak in cold salt water (1 tsp salt per litre) for 15 minutes if the stain is old.",
      "Hand-wash or machine-wash as normal.",
    ],
    theme: {
      primary: "#B91C1C",
      bg: "#FEE2E2",
      accent: "#EF4444",
    },
  },
  {
    id: "sweat",
    stain: "Sweat & deodorant",
    emoji: "💦",
    productId: "powder-1kg",
    techniqueShort: "Pre-treat collar/underarm area with Wasro powder paste.",
    steps: [
      "Make a paste with Wasro 1kg powder + a little water.",
      "Apply directly to collars, underarms, and other yellow patches.",
      "Leave 20 minutes, then wash in warm water on a regular cycle.",
    ],
    theme: {
      primary: "#A16207",
      bg: "#FEF9C3",
      accent: "#EAB308",
    },
  },
  {
    id: "school-uniform",
    stain: "Kid’s school uniform",
    emoji: "🎒",
    productId: "powder-2kg",
    techniqueShort: "Soak overnight, then heavy-cycle wash.",
    steps: [
      "Empty pockets and brush off dry dirt.",
      "Soak the uniform overnight in warm water with 2 tbsp Wasro 2kg detergent powder.",
      "Treat any visible stains (curry, ink, mud) with the Wasro Clothwash Bar before washing.",
      "Run on a heavy cycle or hand-rub thoroughly. Sun-dry to keep whites bright.",
    ],
    theme: {
      primary: "#1D4ED8",
      bg: "#DBEAFE",
      accent: "#3B82F6",
    },
  },
];

export function getStainProduct(stainId: string): Product | undefined {
  const stain = STAINS.find((s) => s.id === stainId);
  if (!stain) return undefined;
  return PRODUCTS.find((p) => p.id === stain.productId);
}
