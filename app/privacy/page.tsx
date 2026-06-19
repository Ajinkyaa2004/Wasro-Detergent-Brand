import type { Metadata } from "next";
import { SITE } from "@/lib/utils";
import { JsonLd, buildMetadata, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Wasro & Madhav Industries collect, use, and protect the information you submit through wasro.in. No data sold, no third-party advertising trackers.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <h1 className="text-4xl font-bold text-wasro-charcoal">Privacy Policy</h1>
      <p className="mt-2 text-sm text-wasro-slate">
        Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="prose mt-8 space-y-5 text-wasro-charcoal/90">
        <p>
          Wasro is a brand of {SITE.manufacturer}. This Privacy Policy explains
          what information we collect through this website and how we use it.
        </p>

        <h2 className="mt-8 text-xl font-bold">What we collect</h2>
        <p>
          When you submit a bulk-enquiry form, we collect the name, business
          name, phone number, email, city, quantity, and message you provide.
          We do not collect or store payment information on this website.
        </p>

        <h2 className="mt-8 text-xl font-bold">How we use it</h2>
        <p>
          We use the information you submit only to respond to your enquiry —
          via WhatsApp, phone, or email. We do not sell or share your data
          with third parties for marketing purposes.
        </p>

        <h2 className="mt-8 text-xl font-bold">Cookies</h2>
        <p>
          This website uses minimal cookies — only what is required for the
          site to function. We do not use third-party advertising trackers.
        </p>

        <h2 className="mt-8 text-xl font-bold">Contact</h2>
        <p>
          For any privacy-related questions, write to us at{" "}
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
