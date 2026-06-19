#!/usr/bin/env python3
"""
Regenerate every favicon from the bg-removed Wasro logo.

Run from the project root:

    python3 tools/generate-favicons.py

Inputs:
    public/logo1-cropped.png   (bg-removed, transparent corners)

Outputs:
    app/favicon.ico            (multi-res: 16/32/48/64/128/256)
    app/icon.png               (512×512, Next App-Router file convention)
    app/apple-icon.png         (180×180, iOS touch icon)
    public/icon-192.png        (PWA manifest, "any" purpose)
    public/icon-512.png        (PWA manifest, "any" purpose)
    public/icon-maskable-512.png (PWA manifest, "maskable" purpose)
"""
from PIL import Image
import os

SOURCE = "public/logo1-cropped.png"

if not os.path.exists(SOURCE):
    raise SystemExit(f"Source missing: {SOURCE}")

src = Image.open(SOURCE).convert("RGBA")
sw, sh = src.size


def square_logo(out_size: int, pad_ratio: float = 0.08) -> Image.Image:
    """Center the source logo on a transparent square with `pad_ratio` margins."""
    canvas = Image.new("RGBA", (out_size, out_size), (0, 0, 0, 0))
    inner = int(out_size * (1 - 2 * pad_ratio))
    scale = min(inner / sw, inner / sh)
    new_w, new_h = int(sw * scale), int(sh * scale)
    resized = src.resize((new_w, new_h), Image.LANCZOS)
    canvas.paste(resized, ((out_size - new_w) // 2, (out_size - new_h) // 2), resized)
    return canvas


def maskable(out_size: int) -> Image.Image:
    """Maskable icon: white background, logo inset more so Android's
    adaptive-icon crop (~10%) doesn't shave the Wasro mark."""
    canvas = Image.new("RGBA", (out_size, out_size), (255, 255, 255, 255))
    logo = square_logo(out_size, pad_ratio=0.18)
    canvas.paste(logo, (0, 0), logo)
    return canvas


square_logo(512, 0.12).save("app/icon.png", "PNG", optimize=True)
square_logo(180, 0.08).save("app/apple-icon.png", "PNG", optimize=True)
square_logo(192, 0.10).save("public/icon-192.png", "PNG", optimize=True)
square_logo(512, 0.12).save("public/icon-512.png", "PNG", optimize=True)
maskable(512).save("public/icon-maskable-512.png", "PNG", optimize=True)

# Multi-resolution favicon.ico
square_logo(256, 0.06).save(
    "app/favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
)

print("[ok] favicons regenerated")
