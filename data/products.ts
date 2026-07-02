export type ProductCategory =
  | "detergent-powder"
  | "dishwash-bar"
  | "dishwash-tub"
  | "clothwash-bar";

export type Product = {
  id: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  size: string;
  /** MRP in INR. `null` means the price isn't published yet — the UI
   *  shows "Coming soon" and SEO Product schema omits the offer node.
   *  Admin can set/override per-product prices from /admin/pricing. */
  mrp: number | null;
  offer: string | null;
  description: string;
  image: string;
  imageUrl?: string;
  featured?: boolean;
};

export const CATEGORIES: {
  id: ProductCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "detergent-powder",
    label: "Detergent Powder",
    description:
      "Powerful clean for clothes — from quick-wash sachets to family packs with free buckets.",
  },
  {
    id: "dishwash-bar",
    label: "Dishwash Bar",
    description:
      "Cuts grease in seconds. Long-lasting bars in handy ₹5 and ₹10 packs.",
  },
  {
    id: "dishwash-tub",
    label: "Dishwash Tub",
    description:
      "Smooth, scoop-and-clean dishwash tubs with a free scrubber in every pack.",
  },
  {
    id: "clothwash-bar",
    label: "Clothwash Bar",
    description:
      "Tough on collars and cuffs. Trusted hand-wash bars at value pricing.",
  },
];

export const PRODUCTS: Product[] = [
  // Detergent Powder
  //
  // The ₹5 single-wash sachet (powder-5) was retired from the catalogue
  // — the ₹10 pack is now the entry-price SKU for detergent powder.
  {
    id: "powder-10",
    name: "Wasro Detergent Powder Pack",
    shortName: "Powder ₹10",
    category: "detergent-powder",
    size: "₹10 Pack",
    mrp: 10,
    offer: null,
    description:
      "Pocket-friendly ₹10 pack. Two-wash convenience with the same Wasro clean.",
    image: "/products/powder-10.webp",
  },
  {
    id: "powder-400g",
    name: "Wasro Detergent Powder",
    shortName: "Powder 400g",
    category: "detergent-powder",
    size: "400g",
    mrp: 45,
    offer: null,
    description:
      "400g Multi-Enzymes detergent. Family-pack convenience at a value-tier price.",
    image: "/products/powder-400g.webp",
  },
  {
    id: "powder-500g",
    name: "Wasro Detergent Powder",
    shortName: "Powder 500g",
    category: "detergent-powder",
    size: "500g",
    mrp: 40,
    offer: "FREE Mug",
    description:
      "500g Multi-Enzymes detergent — comes with a free mug. Great value for weekly family loads.",
    image: "/products/powder-500g.webp",
  },
  {
    id: "powder-1kg",
    name: "Wasro Detergent Powder",
    shortName: "Powder 1kg",
    category: "detergent-powder",
    size: "1kg",
    mrp: 80,
    // Free 1L mug offer removed at client's request — 1kg is now sold
    // standalone without the bundled gift.
    offer: null,
    description:
      "1kg Multi-Enzymes detergent — the everyday family pack for weekly household washes.",
    image: "/products/powder-1kg.webp",
    featured: true,
  },
  {
    id: "powder-2kg",
    name: "Wasro Detergent Powder",
    shortName: "Powder 2kg",
    category: "detergent-powder",
    size: "2kg",
    mrp: 280,
    offer: "FREE Bucket or Tub",
    description:
      "2kg Value Pack — Multi-Enzymes detergent with a free bucket or tub inside. Bigger value, every wash.",
    image: "/products/powder-2kg.webp",
    featured: true,
  },
  {
    id: "powder-3kg",
    name: "Wasro Detergent Powder",
    shortName: "Powder 3kg",
    category: "detergent-powder",
    size: "3kg",
    mrp: 430,
    offer: "FREE Drum or Big Tub",
    description:
      "3kg mega pack with a free drum or big tub. Stock up for the season — ideal for large families.",
    image: "/products/powder-3kg.webp",
  },
  {
    id: "powder-4kg",
    name: "Wasro Detergent Powder",
    shortName: "Powder 4kg",
    category: "detergent-powder",
    size: "4kg",
    mrp: 600,
    offer: "FREE 40L Drum",
    description:
      "4kg jumbo pack ships with a free 40-litre drum. Wash, store, save — the biggest Wasro pack.",
    image: "/products/powder-4kg.webp",
    featured: true,
  },

  // Dishwash Bar
  {
    id: "dishbar-5",
    name: "Wasro Dishwash Bar",
    shortName: "Dish Bar ₹5",
    category: "dishwash-bar",
    size: "₹5 Bar",
    mrp: 5,
    offer: null,
    description:
      "Cuts grease in seconds. Long-lasting ₹5 dishwash bar for everyday utensils.",
    image: "/products/dishbar-5.webp",
  },
  {
    id: "dishbar-10",
    name: "Wasro Dishwash Bar",
    shortName: "Dish Bar ₹10",
    category: "dishwash-bar",
    size: "₹10 Bar",
    mrp: 10,
    offer: null,
    description:
      "Larger ₹10 dishwash bar. Lasts longer, cleans tougher.",
    image: "/products/dishbar-10.webp",
  },

  // Dishwash Tub
  {
    id: "dishtub-200g",
    name: "Wasro Dishwash Tub",
    shortName: "Dish Tub 200g",
    category: "dishwash-tub",
    size: "200g",
    mrp: 25,
    offer: "FREE Scrubber",
    description:
      "200g scoop-style dishwash with a free scrubber. Easy on hands, tough on grease.",
    image: "/products/dishtub-200g.webp",
  },
  {
    id: "dishtub-350g",
    name: "Wasro Dishwash Tub",
    shortName: "Dish Tub 350g",
    category: "dishwash-tub",
    size: "350g",
    mrp: 40,
    offer: "FREE Scrubber",
    description:
      "350g dishwash tub with a free scrubber. Mid-sized pack for everyday kitchens.",
    image: "/products/dishtub-350g.webp",
    featured: true,
  },
  {
    id: "dishtub-600g",
    name: "Wasro Dishwash Tub",
    shortName: "Dish Tub 600g",
    category: "dishwash-tub",
    size: "600g",
    mrp: 60,
    offer: "FREE Scrubber",
    description:
      "600g family-size dishwash with a free scrubber. Long-lasting value.",
    image: "/products/dishtub-600g.webp",
  },

  // Clothwash Bar
  {
    id: "clothbar-5",
    name: "Wasro Clothwash Bar",
    shortName: "Cloth Bar ₹5",
    category: "clothwash-bar",
    size: "₹5 Bar",
    mrp: 5,
    offer: null,
    description:
      "Tough on collars and cuffs. ₹5 hand-wash bar for everyday clothes.",
    image: "/products/clothbar-5.webp",
  },
  {
    id: "clothbar-10",
    name: "Wasro Clothwash Bar",
    shortName: "Cloth Bar ₹10",
    category: "clothwash-bar",
    size: "₹10 Bar",
    mrp: 10,
    offer: null,
    description:
      "Larger ₹10 clothwash bar. Trusted hand-wash for tough stains.",
    image: "/products/clothbar-10.webp",
  },
];

export const ORDER_LINKS = {
  swiggy: "https://www.swiggy.com/instamart/search?query=wasro",
  zomato: "https://blinkit.com/s/?q=wasro",
  bigbasket: "https://www.bigbasket.com/ps/?q=wasro",
  jiomart: "https://www.jiomart.com/search/wasro",
  flipkart: "https://www.flipkart.com/search?q=wasro",
};

export function getProductsByCategory(category: ProductCategory) {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((p) => p.featured);
}
