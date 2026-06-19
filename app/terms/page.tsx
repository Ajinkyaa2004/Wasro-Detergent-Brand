import type { Metadata } from "next";
import { SITE } from "@/lib/utils";
import { JsonLd, buildMetadata, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "Terms of use for wasro.in — covering product information accuracy, bulk-order enquiries, external links to quick-commerce platforms, and contact details for Madhav Industries.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms" },
        ])}
      />
      <h1 className="text-4xl font-bold text-wasro-charcoal">
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-sm text-wasro-slate">
        Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-8 space-y-5 text-wasro-charcoal/90">
        <p>
          By using this website you agree to these Terms. The Wasro brand and
          all product information here are the property of {SITE.manufacturer}.
        </p>

        <h2 className="mt-8 text-xl font-bold">Product information</h2>
        <p>
          We make every effort to keep prices and pack details up to date.
          Final pricing is subject to your retailer or quick-commerce platform
          (Swiggy, Blinkit, BigBasket, JioMart, Flipkart Minutes). Free-gift
          offers are subject to stock availability.
        </p>

        <h2 className="mt-8 text-xl font-bold">Bulk orders</h2>
        <p>
          Bulk-order pricing, MOQs, and dispatch timelines are confirmed in
          writing by our team after you submit an enquiry. Submitting an
          enquiry through this site does not create a binding order — orders
          are confirmed only after we respond and you confirm.
        </p>

        <h2 className="mt-8 text-xl font-bold">External links</h2>
        <p>
          Links to Swiggy, Blinkit, BigBasket, JioMart, Flipkart, and other
          third-party platforms are provided for convenience. We are not
          responsible for the content, pricing, or terms of those platforms.
        </p>

        <h2 className="mt-8 text-xl font-bold">Contact</h2>
        <p>
          Questions? Reach us at{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="font-semibold text-wasro-blue underline"
          >
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
