import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/utils";
import { JsonLd, buildMetadata, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Returns & Refund Policy",
  description:
    "How Wasro handles damaged, defective or wrong detergent packs — the 48-hour report window and how to claim a refund or replacement via your retailer or platform.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Returns & Refund Policy", path: "/returns" },
        ])}
      />
      <h1 className="text-4xl font-bold text-wasro-charcoal">
        Returns &amp; Refund Policy
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
          Wasro is sold through kirana stores, supermarkets, and quick-commerce
          platforms (Swiggy Instamart, Blinkit, BigBasket, JioMart, Flipkart
          Minutes). Returns are handled by the seller you bought from — the
          guidance below explains how to claim a refund or replacement in each
          case.
        </p>

        <h2 className="mt-8 text-xl font-bold">
          Damaged or leaking pack on arrival
        </h2>
        <p>
          If your Wasro pack arrives damaged, torn, or leaking, please:
        </p>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            Take a clear photo of the pack <strong>without opening it</strong>.
          </li>
          <li>
            Raise a refund / replacement request with the platform you ordered
            from, within <strong>48 hours of delivery</strong>. Quick-commerce
            apps usually have a "Report an issue" option in the order details.
          </li>
          <li>
            If the platform does not resolve it within 7 days, email a copy of
            your invoice + photo to{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-semibold text-wasro-blue underline"
            >
              {SITE.email}
            </a>{" "}
            and we will assist directly.
          </li>
        </ol>

        <h2 className="mt-8 text-xl font-bold">Wrong product received</h2>
        <p>
          If the pack delivered does not match what you ordered (wrong size,
          wrong category), the platform / kirana you bought from will replace
          it free of charge. The same 48-hour reporting window applies for
          quick-commerce.
        </p>

        <h2 className="mt-8 text-xl font-bold">Quality concerns</h2>
        <p>
          If you believe a Wasro pack is defective (clumping, unusual smell,
          discolouration), write to us at{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="font-semibold text-wasro-blue underline"
          >
            {SITE.email}
          </a>{" "}
          with photos of the pack and the batch code printed on the back.
          We will investigate at the manufacturing end and arrange a full
          refund or replacement if the complaint is verified.
        </p>

        <h2 className="mt-8 text-xl font-bold">Free-gift items</h2>
        <p>
          Free gifts that ship with Wasro packs (mug, bucket, tub, or 40L
          drum) are not sold separately and cannot be exchanged for cash.
          If the gift is missing or damaged, it is replaced free of charge
          along with the pack under the rules above.
        </p>

        <h2 className="mt-8 text-xl font-bold">Bulk orders</h2>
        <p>
          For bulk / wholesale orders placed directly through{" "}
          <Link href="/bulk-orders" className="font-semibold text-wasro-blue underline">
            wasro.in/bulk-orders
          </Link>
          , return terms are confirmed in your individual order acknowledgement.
          Damaged-on-arrival units are replaced from the same dispatch lot;
          please retain the original invoice and dispatch challan.
        </p>

        <h2 className="mt-8 text-xl font-bold">
          What we cannot accept returns for
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Opened or partially used packs (for hygiene reasons).</li>
          <li>
            Packs returned more than 30 days after the original purchase date.
          </li>
          <li>
            Items damaged after delivery due to mishandling, exposure to
            water, or improper storage.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-bold">Contact</h2>
        <p>
          For anything return-related that the platform you bought from cannot
          resolve, reach our customer-care team at{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="font-semibold text-wasro-blue underline"
          >
            {SITE.email}
          </a>{" "}
          or WhatsApp us at {SITE.whatsappDisplay}.
        </p>
      </div>
    </section>
  );
}
