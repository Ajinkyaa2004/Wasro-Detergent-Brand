"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Home,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Truck,
  Phone,
  Mail,
} from "lucide-react";
import { cn, SITE } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Ripple } from "@/components/ui/ripple";

type NavLink = {
  label: string;
  href: string;
  // Icon shown only in the mobile overlay
  icon: typeof ShoppingBag;
  // Helper line shown only in the mobile overlay
  description: string;
};

const NAV_LINKS: NavLink[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    description: "Trusted clean for every Indian home",
  },
  {
    label: "Products",
    href: "/products",
    icon: ShoppingBag,
    description: "14 SKUs · 4 categories",
  },
  {
    label: "Stain Guide",
    href: "/stain-guide",
    icon: Sparkles,
    description: "Curry, tea, grease & more",
  },
  {
    label: "About",
    href: "/about",
    icon: Truck,
    description: "Made in Assam by Madhav",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Visibility: starts hidden, drops in after 2s, then scroll-direction aware
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollListenerArmedRef = useRef(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Initial drop-in
    const dropTimer = window.setTimeout(
      () => setVisible(true),
      reduceMotion ? 0 : 2000
    );

    // Arm the scroll listener after the drop-in finishes
    const armTimer = window.setTimeout(
      () => {
        scrollListenerArmedRef.current = true;
        lastScrollYRef.current = window.scrollY;
      },
      reduceMotion ? 100 : 3400
    );

    // rAF-throttled scroll handler so we only do work once per frame
    // and don't flicker on fast/Lenis-smoothed scrolls.
    let rafId: number | null = null;
    let accumulatedDown = 0;
    let accumulatedUp = 0;

    function process() {
      rafId = null;
      const y = window.scrollY;

      setScrolled(y > 40);

      if (!scrollListenerArmedRef.current) {
        lastScrollYRef.current = y;
        return;
      }

      const delta = y - lastScrollYRef.current;

      if (y < 80) {
        setVisible(true);
        accumulatedDown = 0;
        accumulatedUp = 0;
      } else if (delta > 0) {
        accumulatedDown += delta;
        accumulatedUp = 0;
        // Hide only after the user has clearly committed to scrolling down
        if (accumulatedDown > 32) {
          setVisible(false);
          if (open) setOpen(false);
        }
      } else if (delta < 0) {
        accumulatedUp += -delta;
        accumulatedDown = 0;
        // Show as soon as the user nudges up
        if (accumulatedUp > 10) {
          setVisible(true);
        }
      }

      lastScrollYRef.current = y;
    }

    function onScroll() {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(process);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(dropTimer);
      window.clearTimeout(armTimer);
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [open]);

  // Lock body scroll while the full-screen mobile overlay is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close the overlay on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        style={{
          transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, -100%, 0)",
          opacity: visible ? 1 : 0,
          transition: visible
            ? "transform 720ms cubic-bezier(0.16, 1, 0.3, 1), opacity 480ms ease-out"
            : "transform 420ms cubic-bezier(0.7, 0, 0.84, 0), opacity 220ms ease-in",
          willChange: "transform, opacity",
        }}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transform-gpu",
          "transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
          !visible && "pointer-events-none",
          scrolled
            ? "border-b border-white/40 bg-white/90 shadow-[0_8px_30px_-12px_rgba(15,66,117,0.12)] md:bg-white/55 md:backdrop-blur-xl md:backdrop-saturate-150"
            : "border-b border-white/20 bg-white/80 md:bg-white/35 md:backdrop-blur-md md:backdrop-saturate-150"
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo1-cropped.png"
              alt="Wasro"
              width={408}
              height={250}
              priority
              className="h-14 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative text-sm font-medium transition-colors duration-300",
                    isActive
                      ? "text-wasro-blue"
                      : "text-wasro-charcoal/80 hover:text-wasro-blue"
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -bottom-1.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-wasro-blue transition-all duration-300 ease-out",
                      isActive
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-60"
                    )}
                  />
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute -top-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-wasro-blue"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <MagneticButton strength={0.25}>
              <Ripple>
                <Link
                  href="/bulk-orders"
                  className={cn(
                    "wasro-shine wasro-shine-cta inline-flex items-center justify-center rounded-pill bg-wasro-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-wasro-blue-dark",
                    pathname === "/bulk-orders" &&
                      "ring-2 ring-wasro-blue/30 ring-offset-2"
                  )}
                >
                  Bulk Orders
                </Link>
              </Ripple>
            </MagneticButton>
          </div>

          {/* Hamburger — animated CSS-only morph between hamburger and X.
              Three lines rotate / fade / translate to form the close icon.
              No layout shift, fully composited. */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="wasro-mobile-menu"
            className={cn(
              "relative h-11 w-11 rounded-full p-0 md:hidden",
              "ring-1 transition-all duration-300",
              open
                ? "z-[60] bg-wasro-blue text-white ring-wasro-blue-dark shadow-lg shadow-wasro-blue/30"
                : "bg-white/70 text-wasro-charcoal ring-wasro-border/60 backdrop-blur"
            )}
          >
            <span className="sr-only">Toggle menu</span>
            <span
              aria-hidden
              className={cn(
                "absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]",
                open ? "translate-y-0 rotate-45" : "-translate-y-[6px] rotate-0"
              )}
            />
            <span
              aria-hidden
              className={cn(
                "absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-200",
                open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
              )}
            />
            <span
              aria-hidden
              className={cn(
                "absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]",
                open ? "translate-y-0 -rotate-45" : "translate-y-[6px] rotate-0"
              )}
            />
          </button>
        </div>
      </header>

      {/* ─── Mobile overlay menu ──────────────────────────────────────────
          Full-screen premium drawer:
            - circular reveal from the hamburger's position (clip-path)
            - staggered link entrance with translate+opacity
            - gradient mesh + bubble accents (brand-consistent)
            - quick-action footer with phone / WhatsApp / email
            - tap-anywhere-outside to dismiss (background captures clicks)
      ────────────────────────────────────────────────────────────────────*/}
      <div
        id="wasro-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[55] md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Background — white glassmorphism with brand-coloured mesh blobs
            visible through the frosted glass.
            Layer order (back → front):
              1. Solid white base
              2. Radial brand-tinted blobs (visible as colour through the glass)
              3. Frosted white glass with backdrop-blur (the "glass" itself)
            All three are wrapped in the same clip-path circle so they reveal
            together. */}
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          style={{
            clipPath: open
              ? "circle(150% at calc(100% - 38px) 40px)"
              : "circle(0% at calc(100% - 38px) 40px)",
            transition:
              "clip-path 600ms cubic-bezier(0.83, 0, 0.17, 1), opacity 200ms ease-out",
          }}
          className="absolute inset-0 bg-white"
        >
          {/* Coloured mesh blobs sitting just behind the glass */}
          <span
            aria-hidden
            className="pointer-events-none absolute h-72 w-72 rounded-full"
            style={{
              top: "-8%",
              right: "-12%",
              background:
                "radial-gradient(circle at center, rgba(244,196,48,0.45) 0%, rgba(244,196,48,0.20) 35%, transparent 70%)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute h-80 w-80 rounded-full"
            style={{
              top: "30%",
              left: "-20%",
              background:
                "radial-gradient(circle at center, rgba(135,189,233,0.55) 0%, rgba(135,189,233,0.25) 35%, transparent 70%)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute h-72 w-72 rounded-full"
            style={{
              bottom: "-6%",
              right: "-10%",
              background:
                "radial-gradient(circle at center, rgba(59,130,246,0.32) 0%, rgba(59,130,246,0.15) 40%, transparent 75%)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute h-56 w-56 rounded-full"
            style={{
              bottom: "32%",
              left: "12%",
              background:
                "radial-gradient(circle at center, rgba(232,90,79,0.22) 0%, rgba(232,90,79,0.10) 40%, transparent 75%)",
            }}
          />

          {/* Frosted glass overlay — sits on top of the blobs, blurs them
              into the soft colour wash that defines glassmorphism. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-white/55 backdrop-blur-2xl backdrop-saturate-150"
          />
        </div>

        {/* Foreground content */}
        <div
          className={cn(
            "relative flex h-full w-full flex-col text-wasro-charcoal",
            "transition-opacity duration-300",
            open ? "opacity-100 delay-150" : "opacity-0"
          )}
        >
          {/* Header strip inside overlay — same height as the navbar so
              the logo doesn't visually jump when the sheet opens. */}
          <div className="flex h-20 shrink-0 items-center justify-between px-5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-pill bg-white/70 px-3 py-1.5 ring-1 ring-wasro-border backdrop-blur"
            >
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-wasro-blue">
                Wasro
              </span>
              <span className="h-1 w-1 rounded-full bg-wasro-yellow" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-wasro-slate">
                Menu
              </span>
            </Link>
            {/* Empty spacer to balance — actual close lives in the fixed
                hamburger button at the top right (which is now an X). */}
            <span className="h-11 w-11" aria-hidden />
          </div>

          {/* Nav list — staggered entrance */}
          <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 pb-6 pt-2">
            {NAV_LINKS.map((link, i) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    transitionDelay: open ? `${180 + i * 70}ms` : "0ms",
                    transform: open ? "translateY(0)" : "translateY(16px)",
                    opacity: open ? 1 : 0,
                  }}
                  className={cn(
                    "group relative flex items-center gap-4 overflow-hidden rounded-2xl px-4 py-4",
                    "transition-[transform,opacity,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "ring-1 backdrop-blur active:scale-[0.98]",
                    isActive
                      ? "bg-wasro-blue text-white ring-wasro-blue-dark shadow-xl shadow-wasro-blue/30"
                      : "bg-white/70 text-wasro-charcoal ring-wasro-border hover:bg-white/85"
                  )}
                >
                  {/* Icon bubble */}
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-wasro-blue-light text-wasro-blue"
                    )}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-lg font-bold leading-tight tracking-tight">
                      {link.label}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isActive
                          ? "text-white/80"
                          : "text-wasro-slate"
                      )}
                    >
                      {link.description}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className={cn(
                      "shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                      isActive ? "text-white" : "text-wasro-blue"
                    )}
                  />
                </Link>
              );
            })}

            {/* Primary CTA — Bulk Orders */}
            <Link
              href="/bulk-orders"
              onClick={() => setOpen(false)}
              style={{
                transitionDelay: open
                  ? `${180 + NAV_LINKS.length * 70}ms`
                  : "0ms",
                transform: open ? "translateY(0)" : "translateY(16px)",
                opacity: open ? 1 : 0,
              }}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-pill bg-wasro-yellow px-6 py-4 text-base font-bold text-wasro-charcoal shadow-2xl shadow-wasro-yellow/30 transition-[transform,opacity,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
            >
              <ShoppingBag size={16} /> Bulk Orders
            </Link>
          </nav>

          {/* Explicit "Back to website" affordance.
              The morphed hamburger X at the top-right is the primary close
              control, but it lives outside the visual frame of the menu —
              first-time visitors might not realise tapping it dismisses
              the sheet. This labelled in-frame button removes any
              ambiguity. Same staggered entrance as the rest. */}
          <div
            style={{
              transitionDelay: open
                ? `${180 + (NAV_LINKS.length + 1) * 70}ms`
                : "0ms",
              transform: open ? "translateY(0)" : "translateY(16px)",
              opacity: open ? 1 : 0,
            }}
            className="px-5 pb-3 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="group flex w-full items-center justify-center gap-2 rounded-pill bg-white/70 px-5 py-3 text-sm font-semibold text-wasro-charcoal ring-1 ring-wasro-border backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-wasro-blue hover:shadow-md active:scale-[0.98]"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
              <span>Back to website</span>
            </button>
          </div>

          {/* Quick-action footer */}
          <div
            style={{
              transitionDelay: open
                ? `${180 + (NAV_LINKS.length + 2) * 70}ms`
                : "0ms",
              transform: open ? "translateY(0)" : "translateY(16px)",
              opacity: open ? 1 : 0,
            }}
            className="grid shrink-0 grid-cols-3 gap-2 border-t border-wasro-border/60 bg-white/40 p-5 backdrop-blur transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.generalMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/80 px-3 py-3 ring-1 ring-wasro-border backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <MessageCircle size={18} className="text-emerald-600" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-wasro-charcoal">
                WhatsApp
              </span>
            </a>
            <a
              href={`tel:+${SITE.whatsapp}`}
              onClick={() => setOpen(false)}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/80 px-3 py-3 ring-1 ring-wasro-border backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <Phone size={18} className="text-wasro-blue" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-wasro-charcoal">
                Call
              </span>
            </a>
            <a
              href={`mailto:${SITE.email}`}
              onClick={() => setOpen(false)}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/80 px-3 py-3 ring-1 ring-wasro-border backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <Mail size={18} className="text-wasro-coral" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-wasro-charcoal">
                Email
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
