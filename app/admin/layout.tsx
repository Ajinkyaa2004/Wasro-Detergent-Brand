import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Megaphone,
  Star,
  Type,
  Wrench,
  LayoutGrid,
  HelpCircle,
  Tag,
  LogOut,
  ExternalLink,
  Quote,
} from "lucide-react";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/offer", label: "Hero offer", icon: Megaphone },
  { href: "/admin/hero-content", label: "Hero content", icon: Wrench },
  { href: "/admin/featured", label: "Featured products", icon: Star },
  { href: "/admin/pricing", label: "Product pricing", icon: Tag },
  { href: "/admin/headlines", label: "Hero headlines", icon: Type },
  { href: "/admin/why-us", label: "Why Wasro cards", icon: LayoutGrid },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/reviews", label: "Reviews", icon: Quote },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-wasro-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-wasro-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            aria-label="Wasro admin"
          >
            <Image
              src="/logo1-cropped.png"
              alt="Wasro"
              width={408}
              height={250}
              className="h-9 w-auto"
            />
            <span className="rounded-pill bg-wasro-blue-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-wasro-blue-dark">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-pill bg-white px-3 py-2 text-xs font-semibold text-wasro-charcoal ring-1 ring-wasro-border transition hover:ring-wasro-blue sm:px-4 sm:text-sm"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-pill bg-wasro-charcoal px-3 py-2 text-xs font-semibold text-white transition hover:bg-wasro-charcoal/90 sm:px-4 sm:text-sm"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 md:flex-row md:px-8 md:py-10">
        {/* Sidebar nav (collapses to horizontal scroll on mobile) */}
        <nav
          aria-label="Admin sections"
          className="md:w-56 md:shrink-0"
        >
          <ul className="flex gap-2 overflow-x-auto md:flex-col md:gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className="group inline-flex w-full items-center gap-3 rounded-xl border border-wasro-border bg-white px-4 py-3 text-sm font-semibold text-wasro-charcoal shadow-sm transition hover:border-wasro-blue/40 hover:text-wasro-blue md:bg-transparent md:shadow-none md:hover:bg-white"
                  >
                    <Icon
                      size={16}
                      className="text-wasro-slate transition-colors group-hover:text-wasro-blue"
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
