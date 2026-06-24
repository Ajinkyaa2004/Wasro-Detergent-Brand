import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/utils";
import { JsonLd, buildMetadata, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shipping & Delivery Policy",
  description:
    "How Wasro detergent packs reach you — through 121+ kirana partner stores, quick-commerce platforms, and direct bulk dispatch from our Amingaon (Assam) plant.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Shipping & Delivery Policy", path: "/shipping" },
        ])}
      />
      <h1 className="text-4xl font-bold text-wasro-charcoal">
        Shipping &amp; Delivery
      </h1>
      <p className="mt-2 text-sm text-wasro-slate">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="mt-8 space-y-5 text-wasro-charcoal/90">
        <p>
          Wasro is manufactured at our plant in Amingaon, Assam, by{" "}
          {SITE.manufacturer}. We do not run a direct-to-consumer warehouse —
          shipping is handled by our retail partners and quick-commerce
          platforms, so the experience matches whatever you already use.
        </p>

        <h2 className="mt-8 text-xl font-bold">Where can I buy Wasro?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>121+ partner kirana stores</strong> across Assam,
            Meghalaya, Manipur, Tripura, Mizoram, Nagaland, Arunachal Pradesh,
            West Bengal, Bihar, and Odisha. Ask your local grocer for Wasro.
          </li>
          <li>
            <strong>Quick-commerce apps</strong> (rolling out): Swiggy
            Instamart, Blinkit, BigBasket, JioMart, Flipkart Minutes.
            10–30 minute delivery in serviceable pin codes.
          </li>
          <li>
            <strong>Bulk / wholesale dispatch</strong> directly from our
            Amingaon plant — see{" "}
            <Link
              href="/bulk-orders"
              className="font-semibold text-wasro-blue underline"
            >
              wasro.in/bulk-orders
            </Link>{" "}
            for MOQ, pricing, and dispatch timelines.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-bold">Delivery timelines</h2>
        <p>
          <strong>Kirana stores:</strong> walk-in purchase, no delivery
          required.
        </p>
        <p>
          <strong>Quick-commerce:</strong> typically 10–30 minutes from the
          dark store nearest to you. The exact window is shown by the
          platform at checkout.
        </p>
        <p>
          <strong>Bulk orders:</strong> dispatch within 3–5 working days of
          order confirmation. Transit time depends on destination:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Within Assam &amp; nearby Northeast — 2–4 days</li>
          <li>Rest of India — 5–9 days</li>
          <li>
            For larger lots, we use trusted FTL / part-truck partners and
            share the LR number on dispatch.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-bold">Shipping charges</h2>
        <p>
          Retail purchases on kirana / quick-commerce follow the platform&apos;s
          delivery-fee structure. Wasro does not add any extra shipping
          surcharge on top.
        </p>
        <p>
          For bulk orders, freight cost is confirmed in your individual
          quotation. Larger volumes (typically &gt; 500 kg) often qualify for
          freight-included pricing — please mention the destination pin code
          on the enquiry form.
        </p>

        <h2 className="mt-8 text-xl font-bold">Tracking your order</h2>
        <p>
          For quick-commerce orders, tracking is provided inside the app you
          ordered from. For bulk dispatches, the LR / docket number and the
          courier&apos;s tracking URL are shared via WhatsApp at the email /
          phone you submitted with the enquiry.
        </p>

        <h2 className="mt-8 text-xl font-bold">Pin code serviceability</h2>
        <p>
          If your nearest kirana doesn&apos;t stock Wasro yet and no
          quick-commerce platform delivers Wasro in your area, you can write
          to us at{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="font-semibold text-wasro-blue underline"
          >
            {SITE.email}
          </a>{" "}
          — we&apos;ll either route you to a nearby distributor or arrange a
          one-off dispatch from the plant (minimum quantity applies).
        </p>

        <h2 className="mt-8 text-xl font-bold">Issues with delivery</h2>
        <p>
          For damaged or missing packs, please see our{" "}
          <Link
            href="/returns"
            className="font-semibold text-wasro-blue underline"
          >
            Returns &amp; Refund Policy
          </Link>
          . For anything the delivery platform cannot resolve, reach us at{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="font-semibold text-wasro-blue underline"
          >
            {SITE.email}
          </a>{" "}
          or WhatsApp {SITE.whatsappDisplay}.
        </p>
      </div>
    </section>
  );
}
