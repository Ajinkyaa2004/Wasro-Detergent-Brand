import "server-only";
import fs from "fs";
import path from "path";
import type { Product } from "@/data/products";

const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");
const EXTENSIONS = ["png", "webp", "jpg", "jpeg"] as const;

let cache: Set<string> | null = null;

function listAvailableImages(): Set<string> {
  if (cache && process.env.NODE_ENV === "production") return cache;
  try {
    const files = fs.readdirSync(PRODUCTS_DIR);
    cache = new Set(files);
  } catch {
    cache = new Set();
  }
  return cache;
}

export function getProductImageUrl(productId: string): string | undefined {
  const set = listAvailableImages();
  for (const ext of EXTENSIONS) {
    const filename = `${productId}.${ext}`;
    if (set.has(filename)) return `/products/${filename}`;
  }
  return undefined;
}

export function withImage(product: Product): Product {
  return { ...product, imageUrl: getProductImageUrl(product.id) };
}

export function withImages(products: Product[]): Product[] {
  return products.map(withImage);
}
