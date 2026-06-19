"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, ShoppingBag } from "lucide-react";
import type { StainTip } from "@/data/stains";
import type { Product } from "@/data/products";
import { ProductImage } from "@/components/ui/product-image";
import { OrderButtons } from "@/components/ui/order-buttons";
import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/utils";

export function StainGuide({
  stains,
  products,
}: {
  stains: StainTip[];
  products: Product[];
}) {
  const [activeId, setActiveId] = useState<string>(stains[0].id);
  const [splashKey, setSplashKey] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  const [query, setQuery] = useState("");
  // cursor bubble: ref + DOM mutation, NOT React state.
  // Previously every mousemove triggered a re-render of the entire panel
  // (~300 LOC tree) — measurable jank on lower-spec phones.
  const cursorBubbleRef = useRef<HTMLDivElement>(null);

  const panelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query) return stains;
    const q = query.toLowerCase();
    return stains.filter(
      (s) =>
        s.stain.toLowerCase().includes(q) ||
        s.techniqueShort.toLowerCase().includes(q)
    );
  }, [stains, query]);

  const active =
    stains.find((s) => s.id === activeId) ?? filtered[0] ?? stains[0];
  const product = products.find((p) => p.id === active.productId);

  function pickStain(id: string) {
    if (id === activeId) return;
    setSplashKey((k) => k + 1);
    setShowSplash(true);
    // start swap mid-splash so the new panel is rising as the emoji blooms
    window.setTimeout(() => setActiveId(id), 120);
  }

  // Auto-clear splash after animation
  useEffect(() => {
    if (!showSplash) return;
    const t = window.setTimeout(() => setShowSplash(false), 950);
    return () => window.clearTimeout(t);
  }, [showSplash, splashKey]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = panelRef.current?.getBoundingClientRect();
    const bubble = cursorBubbleRef.current;
    if (!rect || !bubble) return;
    // Direct DOM mutation — bypass React's re-render. The bubble is purely
    // visual and doesn't need to participate in reconciliation.
    bubble.style.opacity = "1";
    bubble.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) translate(-50%, -50%)`;
  }

  function handleMouseLeave() {
    const bubble = cursorBubbleRef.current;
    if (bubble) bubble.style.opacity = "0";
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
      {/* SIDEBAR */}
      <aside>
        <div className="relative mb-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-wasro-slate"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stains..."
            className="h-11 w-full rounded-pill bg-wasro-cream px-10 text-sm text-wasro-charcoal placeholder:text-wasro-slate focus:bg-white focus:outline-none focus:ring-2 focus:ring-wasro-blue"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {filtered.map((s) => {
            const isActive = active.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => pickStain(s.id)}
                style={
                  isActive
                    ? ({
                        background: s.theme.primary,
                        borderColor: s.theme.primary,
                        boxShadow: `0 8px 28px -10px ${s.theme.primary}`,
                        ["--stain-accent" as string]: s.theme.accent,
                      } as React.CSSProperties)
                    : undefined
                }
                className={cn(
                  "relative flex items-center gap-3 overflow-hidden rounded-card border px-4 py-3 text-left transition-all duration-300",
                  isActive
                    ? "wasro-stain-tile-active text-white shadow-lg"
                    : "border-wasro-border bg-white text-wasro-charcoal hover:-translate-y-0.5 hover:border-wasro-blue/40 hover:shadow-md"
                )}
              >
                {/* Soft color glow on hover for inactive tiles */}
                {!isActive && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 30% 50%, ${s.theme.bg} 0%, transparent 70%)`,
                    }}
                  />
                )}
                <span className="relative z-10 text-xl">{s.emoji}</span>
                <span className="relative z-10 text-sm font-semibold">
                  {s.stain}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* DETAIL PANEL */}
      <div
        ref={panelRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative"
        style={
          {
            ["--stain-primary" as string]: active.theme.primary,
            ["--stain-bg" as string]: active.theme.bg,
            ["--stain-accent" as string]: active.theme.accent,
          } as React.CSSProperties
        }
      >
        {/* CURSOR BUBBLE — always mounted; we toggle opacity + transform
            via direct DOM mutation in handleMouseMove. Avoids the per-pixel
            React re-render of the previous version. */}
        <div
          ref={cursorBubbleRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 rounded-full opacity-0 transition-opacity duration-200 ease-out"
          style={{
            width: 320,
            height: 320,
            background: `radial-gradient(circle at center, ${active.theme.accent}33 0%, transparent 70%)`,
            mixBlendMode: "multiply",
            willChange: "transform, opacity",
          }}
        />

        {/* SPLASH OVERLAY — color ring shockwave only, no emoji */}
        {showSplash && (
          <div
            key={splashKey}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
          >
            <span
              className="wasro-splash-ring absolute left-1/2 top-1/2 h-48 w-48 rounded-full"
              style={{
                background: `radial-gradient(circle at center, ${active.theme.accent}55 0%, transparent 70%)`,
              }}
            />
          </div>
        )}

        {/* PANEL CONTENT */}
        <div
          key={active.id}
          className="wasro-stain-panel relative overflow-hidden rounded-card border border-wasro-border p-6 shadow-xl md:p-10"
          style={{
            background: `linear-gradient(135deg, ${active.theme.bg} 0%, #ffffff 60%)`,
          }}
        >
          {/* Soft floating brand swirl background */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-50 wasro-mesh-blob"
            style={{
              background: `radial-gradient(circle at center, ${active.theme.accent}40 0%, transparent 70%)`,
            }}
          />

          <div className="relative flex items-center gap-4">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-lg ring-4 ring-white"
              style={{ background: `${active.theme.accent}26` }}
            >
              {active.emoji}
            </span>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: active.theme.primary }}
              >
                Stain
              </p>
              <h2 className="text-2xl font-bold text-wasro-charcoal md:text-4xl">
                {active.stain}
              </h2>
            </div>
          </div>

          <p className="relative mt-5 max-w-2xl text-wasro-charcoal/85">
            <strong style={{ color: active.theme.primary }}>Quick fix:</strong>{" "}
            {active.techniqueShort}
          </p>

          <div className="relative mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px]">
            <div>
              <h3
                className="mb-5 text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: active.theme.primary }}
              >
                Step-by-step
              </h3>
              <ol className="space-y-4">
                {active.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                      style={{ background: active.theme.primary }}
                    >
                      {i + 1}
                    </span>
                    <span className="pt-1.5 text-sm leading-relaxed text-wasro-charcoal/90 md:text-base">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {product && (
              <TiltCard intensity={8}>
                <div
                  className="rounded-card border bg-white p-5 shadow-xl"
                  style={{
                    borderColor: `${active.theme.accent}40`,
                  }}
                >
                  <p
                    className="mb-3 text-xs font-semibold uppercase tracking-[0.22em]"
                    style={{ color: active.theme.primary }}
                  >
                    Recommended pack
                  </p>
                  <ProductImage
                    product={product}
                    className="aspect-[4/5] w-full"
                  />
                  <h4 className="mt-4 text-base font-semibold text-wasro-charcoal">
                    {product.name}
                  </h4>
                  <p className="text-sm text-wasro-slate">{product.size}</p>
                  {product.mrp != null ? (
                    <p
                      className="mt-1 text-xl font-bold"
                      style={{ color: active.theme.primary }}
                    >
                      ₹{product.mrp}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-wasro-slate">
                      Price coming soon
                    </p>
                  )}
                  {product.offer && (
                    <p className="mt-1 text-xs font-semibold text-wasro-coral">
                      {product.offer}
                    </p>
                  )}
                  <div className="mt-4">
                    <OrderButtons variant="compact" />
                  </div>
                  <Link
                    href={`/products#${product.category}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold transition hover:gap-2"
                    style={{ color: active.theme.primary }}
                  >
                    View all sizes <ArrowRight size={12} />
                  </Link>
                </div>
              </TiltCard>
            )}
          </div>

          <div className="relative mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-wasro-border pt-6">
            <p className="text-sm text-wasro-slate">
              Don&apos;t see your stain? WhatsApp us — we&apos;ll suggest the
              right Wasro product.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-pill bg-wasro-charcoal px-4 py-2 text-sm font-semibold text-white transition hover:bg-wasro-blue hover:-translate-y-0.5"
            >
              <ShoppingBag size={14} /> Browse all products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
