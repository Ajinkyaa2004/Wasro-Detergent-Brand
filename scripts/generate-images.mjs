#!/usr/bin/env node
/**
 * Generate Wasro product images for every SKU in one shot.
 *
 *   node --env-file=.env.local scripts/generate-images.mjs               # pollinations (free)
 *   node --env-file=.env.local scripts/generate-images.mjs --provider=fal # fal.ai (FLUX, paid)
 *
 * Flags:
 *   --provider=pollinations | fal   (default: pollinations)
 *   --force                          regenerate even if file already exists
 *   --only=powder-1kg,dishtub-350g   regenerate just a comma-separated subset
 *
 * Output: public/products/{product-id}.png
 * The website auto-detects images dropped here (see lib/server/product-images.ts).
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "products");

// ------- args -------
const args = process.argv.slice(2);
const providerArg = args.find((a) => a.startsWith("--provider="));
const provider = providerArg ? providerArg.split("=")[1] : "pollinations";
const force = args.includes("--force");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.split("=")[1].split(",") : null;

// ------- product data (mirrors data/products.ts, minimum fields the script needs) -------
const PRODUCTS = [
  { id: "powder-5",     category: "detergent-powder", size: "₹5 Pack",  shortName: "Single-wash Sachet" },
  { id: "powder-10",    category: "detergent-powder", size: "₹10 Pack", shortName: "Sachet" },
  { id: "powder-400g",  category: "detergent-powder", size: "400g",     shortName: "Pouch 400g" },
  { id: "powder-500g",  category: "detergent-powder", size: "500g",     shortName: "Pouch 500g" },
  { id: "powder-1kg",   category: "detergent-powder", size: "1kg",      shortName: "Pouch 1kg" },
  { id: "powder-2kg",   category: "detergent-powder", size: "2kg",      shortName: "Family Pack 2kg" },
  { id: "powder-3kg",   category: "detergent-powder", size: "3kg",      shortName: "Mega Pack 3kg" },
  { id: "dishbar-5",    category: "dishwash-bar",     size: "₹5 Bar",   shortName: "Dishwash Bar" },
  { id: "dishbar-10",   category: "dishwash-bar",     size: "₹10 Bar",  shortName: "Dishwash Bar" },
  { id: "dishtub-200g", category: "dishwash-tub",     size: "200g",     shortName: "Dishwash Tub" },
  { id: "dishtub-350g", category: "dishwash-tub",     size: "350g",     shortName: "Dishwash Tub" },
  { id: "dishtub-600g", category: "dishwash-tub",     size: "600g",     shortName: "Dishwash Tub" },
  { id: "clothbar-5",   category: "clothwash-bar",    size: "₹5 Bar",   shortName: "Clothwash Bar" },
  { id: "clothbar-10",  category: "clothwash-bar",    size: "₹10 Bar",  shortName: "Clothwash Bar" },
];

// ------- prompt builders -------
const CATEGORY_LOOK = {
  "detergent-powder": {
    pack: "stand-up pouch with a sealed crimped top, shown at a slight 3/4 angle",
    colors:
      "vibrant royal blue (#1B5FA8) body with a bright white wordmark area in the upper third",
    accent: "subtle white wave swoosh graphics suggesting freshness",
  },
  "dishwash-bar": {
    pack: "rectangular plastic-wrapped soap bar with a sealed crimped end, lying flat at a slight 3/4 angle",
    colors:
      "bright lime green wrapper with a yellow horizontal band, lemon graphics in the lower corner",
    accent: "small registered trademark mark",
  },
  "dishwash-tub": {
    pack: "round plastic tub with a bright green snap-on lid, slightly opened, shown at 3/4 angle",
    colors:
      "bright sunshine yellow tub body with a green lid",
    accent: "a small scrubber sponge resting beside the tub",
  },
  "clothwash-bar": {
    pack: "rectangular plastic-wrapped soap bar with a sealed crimped end, lying flat at a slight 3/4 angle",
    colors:
      "bright pink and royal blue gradient wrapper with white wave graphic",
    accent: "small registered trademark mark",
  },
};

function buildPrompt(p) {
  const look = CATEGORY_LOOK[p.category];
  const sizeLabel = p.size.replace("₹", "Rs ").toUpperCase();
  return [
    `Photorealistic 3D product photography of a Wasro brand detergent ${look.pack}.`,
    look.colors,
    `Printed prominently in the center of the pack: the "Wasro" wordmark in bold italic white inside a horizontal white oval frame with a small registered trademark symbol.`,
    `A yellow ribbon banner on the lower third clearly displays "${sizeLabel}" in bold white type.`,
    look.accent,
    `Cream background (#FAF7F2), soft diffused studio lighting from upper left, gentle drop shadow on the surface beneath the pack, sharp focus on the product, shallow depth of field on the background.`,
    `Packaging design language inspired by Tide and Surf Excel commercial product photography.`,
    `Square 1:1 aspect ratio. The PACK is the hero, no additional text, badges, or graphics beyond what is described, no human, no hand, no logo of any other brand.`,
  ].join(" ");
}

// ------- providers -------
async function genPollinations(prompt, seed) {
  const params = new URLSearchParams({
    width: "1024",
    height: "1024",
    seed: String(seed),
    nologo: "true",
    model: "flux",
  });
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;

  // Pollinations' free tier is queue-limited; retry with backoff on 5xx
  const maxAttempts = 4;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: "image/png" } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        // Sanity check: PNGs are large, JSON errors are small
        if (buf.length < 2000) {
          throw new Error(
            `pollinations returned non-image (${buf.length}B)`
          );
        }
        return buf;
      }
      lastErr = new Error(`pollinations HTTP ${res.status}`);
    } catch (err) {
      lastErr = err;
    }
    if (attempt < maxAttempts) {
      const wait = 8000 * attempt;
      process.stdout.write(`(retry ${attempt}/${maxAttempts - 1} in ${wait / 1000}s) `);
      await sleep(wait);
    }
  }
  throw lastErr;
}

async function genFal(prompt) {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY env var not set (add to .env.local)");

  // Submit job
  const submit = await fetch("https://queue.fal.run/fal-ai/flux/dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${key}`,
    },
    body: JSON.stringify({
      prompt,
      image_size: "square_hd",
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
    }),
  });
  if (!submit.ok) {
    throw new Error(`fal submit HTTP ${submit.status}: ${await submit.text()}`);
  }
  const { request_id, status_url, response_url } = await submit.json();
  if (!request_id) throw new Error("fal submit returned no request_id");

  // Poll until ready
  const start = Date.now();
  while (Date.now() - start < 120_000) {
    await sleep(1500);
    const statusRes = await fetch(status_url, {
      headers: { Authorization: `Key ${key}` },
    });
    if (!statusRes.ok) continue;
    const status = await statusRes.json();
    if (status.status === "COMPLETED") break;
    if (status.status === "FAILED")
      throw new Error(`fal job failed: ${JSON.stringify(status)}`);
  }

  // Fetch result
  const resultRes = await fetch(response_url, {
    headers: { Authorization: `Key ${key}` },
  });
  if (!resultRes.ok)
    throw new Error(`fal result HTTP ${resultRes.status}: ${await resultRes.text()}`);
  const result = await resultRes.json();
  const imageUrl = result?.images?.[0]?.url;
  if (!imageUrl) throw new Error("fal result has no image URL");
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`image download HTTP ${imgRes.status}`);
  return Buffer.from(await imgRes.arrayBuffer());
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ------- main -------
async function main() {
  console.log(`Wasro image generator`);
  console.log(`  provider : ${provider}`);
  console.log(`  out dir  : ${path.relative(ROOT, OUT_DIR)}/`);
  console.log(`  force    : ${force}`);
  if (only) console.log(`  only     : ${only.join(", ")}`);
  console.log();

  if (provider !== "pollinations" && provider !== "fal") {
    console.error(`Unknown provider "${provider}". Use pollinations or fal.`);
    process.exit(1);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  const targets = only ? PRODUCTS.filter((p) => only.includes(p.id)) : PRODUCTS;
  if (only && targets.length !== only.length) {
    const unknown = only.filter((id) => !PRODUCTS.find((p) => p.id === id));
    if (unknown.length)
      console.warn(`! Unknown product IDs ignored: ${unknown.join(", ")}\n`);
  }

  let ok = 0;
  let skip = 0;
  let fail = 0;
  let seed = 11;

  for (const p of targets) {
    const dest = path.join(OUT_DIR, `${p.id}.png`);
    const exists = await fs
      .access(dest)
      .then(() => true)
      .catch(() => false);

    if (exists && !force) {
      console.log(`[${p.id}] skip (exists, use --force to overwrite)`);
      skip++;
      continue;
    }

    const prompt = buildPrompt(p);
    process.stdout.write(`[${p.id}] generating... `);
    try {
      const buffer =
        provider === "fal"
          ? await genFal(prompt)
          : await genPollinations(prompt, seed++);
      await fs.writeFile(dest, buffer);
      const kb = (buffer.length / 1024).toFixed(0);
      console.log(`✓ ${kb}KB -> ${path.relative(ROOT, dest)}`);
      ok++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone. ${ok} generated, ${skip} skipped, ${fail} failed.`);
  if (fail) process.exit(2);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
