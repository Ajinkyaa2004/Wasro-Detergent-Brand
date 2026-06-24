import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Home as HomeIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you're looking for doesn't exist. Browse the Wasro product range or find your nearest store.",
  robots: { index: false, follow: false },
};

/**
 * Branded 404 page. Replaces the Next.js default.
 *
 * The page intentionally avoids a "404" heading — most visitors don't care
 * what the number is, they care about what to do next. Hence the soap-bubble
 * lockup + four exit ramps (home / products / find store / WhatsApp).
 */
export default function NotFound() {
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hi Wasro team! I landed on a page that doesn't exist on wasro.in — could you help me find what I'm looking for?`
  )}`;

  return (
    <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-wasro-cream px-5 py-16 md:px-8">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-wasro-blue/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-wasro-yellow/25 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Visual side */}
        <div className="relative order-2 md:order-1">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <Image
              src="/lifestyle/hero-bubble-pack.png"
              alt="Wasro detergent pack with bubbles"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain drop-shadow-2xl"
            />
            {/* Floating 404 chip */}
            <div className="absolute right-2 top-2 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-wasro-border">
              <div className="text-3xl font-extrabold leading-none text-wasro-blue">
                404
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-wasro-slate">
                page lost
              </div>
            </div>
          </div>
        </div>

        {/* Text side */}
        <div className="order-1 md:order-2">
          <span className="inline-flex items-center gap-2 rounded-pill bg-wasro-yellow/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-wasro-yellow-dark">
            Looks like a soap slip
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-wasro-charcoal md:text-5xl">
            This page got washed away.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-wasro-slate md:text-lg">
            The link you followed doesn&apos;t exist — maybe it&apos;s been
            renamed, or the URL has a typo. No worries. Here&apos;s where most
            visitors head next:
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="group inline-flex items-center justify-between gap-3 rounded-2xl bg-wasro-charcoal px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-wasro-blue"
            >
              <span className="inline-flex items-center gap-2">
                <HomeIcon size={16} /> Home page
              </span>
              <ArrowRight
                size={14}
                className="transition group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/products"
              className="group inline-flex items-center justify-between gap-3 rounded-2xl bg-wasro-blue px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-wasro-blue-dark"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingBag size={16} /> Browse products
              </span>
              <ArrowRight
                size={14}
                className="transition group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/bulk-orders"
              className="group inline-flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-wasro-charcoal ring-1 ring-wasro-border transition hover:-translate-y-0.5 hover:ring-wasro-blue"
            >
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-wasro-blue" /> Bulk orders
              </span>
              <ArrowRight
                size={14}
                className="text-wasro-slate transition group-hover:translate-x-1"
              />
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle size={16} /> Ask on WhatsApp
              </span>
              <ArrowRight
                size={14}
                className="transition group-hover:translate-x-1"
              />
            </a>
          </div>

          <p className="mt-8 text-xs text-wasro-slate">
            If you typed the URL by hand, double-check the spelling. Otherwise,
            we&apos;d love to know which link sent you here — write to{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-semibold text-wasro-blue underline"
            >
              {SITE.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
