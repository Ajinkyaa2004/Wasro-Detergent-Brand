import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/ui/social-icons";
import { NewsletterSignup } from "@/components/layout/newsletter-signup";
import { SITE } from "@/lib/utils";

const COL_SHOP = [
  { label: "Detergent Powder", href: "/products#detergent-powder" },
  { label: "Dishwash Bar", href: "/products#dishwash-bar" },
  { label: "Dishwash Tub", href: "/products#dishwash-tub" },
  { label: "Clothwash Bar", href: "/products#clothwash-bar" },
];

const COL_HELP = [
  { label: "Find a Store", href: "/find-store" },
  { label: "Bulk Orders", href: "/bulk-orders" },
  { label: "Stain Guide", href: "/stain-guide" },
  { label: "FAQs", href: "/about#faqs" },
];

const COL_ABOUT = [
  { label: "Our Story", href: "/about" },
  { label: "Madhav Industries", href: "/about#madhav" },
  { label: "Quality Promise", href: "/about#quality" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-wasro-border bg-wasro-blue text-wasro-cream">
      {/* Top half of the footer: brand block (wider so the newsletter signup
          breathes) + three nav columns. On lg+ the brand column spans 2
          tracks of a 5-col grid; nav columns each take 1 track. On md the
          brand sits on top with the nav columns underneath in 3 tracks. */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-14 md:grid-cols-3 md:px-8 lg:grid-cols-5">
        <div className="space-y-5 md:col-span-3 lg:col-span-2">
          <div className="inline-flex items-center rounded-xl bg-white px-3 py-2">
            <Image
              src="/logo1-cropped.png"
              alt="Wasro"
              width={408}
              height={250}
              className="h-10 w-auto"
            />
          </div>
          <p className="text-sm leading-relaxed text-wasro-cream/80">
            {SITE.tagline}. Detergent powders, dishwash & clothwash bars from
            Northeast India.
          </p>

          {/* Newsletter signup — server-action backed, writes to Upstash */}
          <div className="max-w-md space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Stay in the loop
            </h3>
            <NewsletterSignup />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="rounded-pill bg-white/10 p-2 transition hover:bg-white/20"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="rounded-pill bg-white/10 p-2 transition hover:bg-white/20"
            >
              <FacebookIcon />
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              aria-label="WhatsApp"
              className="rounded-pill bg-white/10 p-2 transition hover:bg-white/20"
            >
              <Phone size={18} />
            </a>
          </div>
        </div>

        <FooterColumn title="Shop" links={COL_SHOP} />
        <FooterColumn title="Help" links={COL_HELP} />
        <FooterColumn title="About" links={COL_ABOUT} />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 py-6 text-xs text-wasro-cream/70 md:grid-cols-2 md:px-8">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <span>
              Manufactured by {SITE.manufacturer},{" "}
              {SITE.manufacturerAddress}
            </span>
          </div>
          <div className="flex flex-col gap-1 md:items-end">
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <a
                href={`mailto:${SITE.email}`}
                className="hover:text-white"
              >
                {SITE.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                className="hover:text-white"
              >
                {SITE.whatsappDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-4 text-xs text-wasro-cream/60 md:flex-row md:px-8">
          <span>© {new Date().getFullYear()} Wasro. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="/shipping" className="hover:text-white">
              Shipping
            </Link>
            <Link href="/returns" className="hover:text-white">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-wasro-cream/80 transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
