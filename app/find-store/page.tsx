import type { Metadata } from "next";
import { DISTRIBUTORS } from "@/data/distributors";
import { PageHero } from "@/components/ui/page-hero";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { FindStoreClient } from "@/components/find-store/find-store-client";
import {
  JsonLd,
  buildMetadata,
  breadcrumbLd,
  collectionPageLd,
  absoluteUrl,
  plantLocalBusinessLd,
} from "@/lib/seo";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Find a Wasro Store Near You — 121+ Distributors Across India",
  description:
    "Locate your nearest Wasro distributor across 121+ stores in Assam, Meghalaya, Manipur, Tripura, Mizoram, Nagaland, Arunachal Pradesh, West Bengal, Bihar, and Odisha. Filter by state, browse cities, call or WhatsApp the store directly.",
  path: "/find-store",
  keywords: [
    "Wasro store near me",
    "Wasro distributor",
    "Wasro detergent Guwahati",
    "Wasro Assam dealers",
    "buy Wasro in Shillong",
    "Wasro Northeast India retailers",
  ],
});

// Convert a 10-digit Indian phone to E.164 format for schema telephone field.
function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}

// Cap the LocalBusiness ItemList at the top 30 stores to keep page weight
// reasonable. The full list is still searchable on-page; this is only for
// search-engine consumption.
const SAMPLE_DISTRIBUTORS = DISTRIBUTORS.slice(0, 30);

const distributorItemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  numberOfItems: DISTRIBUTORS.length,
  itemListElement: SAMPLE_DISTRIBUTORS.map((d, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Store",
      "@id": absoluteUrl(`/find-store#${d.id}`),
      name: d.name,
      telephone: toE164(d.phone),
      address: {
        "@type": "PostalAddress",
        streetAddress: d.address,
        addressLocality: d.city,
        addressRegion: d.state,
        addressCountry: "IN",
      },
      areaServed: { "@type": "City", name: d.city },
      brand: { "@type": "Brand", name: SITE.brand },
    },
  })),
};

export default function FindStorePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Find a Store", path: "/find-store" },
          ]),
          collectionPageLd({
            name: "Find a Wasro Store",
            description:
              "All Wasro distributors across India, grouped by state and city.",
            path: "/find-store",
            itemList: distributorItemList,
          }),
          plantLocalBusinessLd(),
        ]}
      />
      <PageHero
        eyebrow="Find Wasro Near You"
        title={
          <>
            <AnimatedCounter value={DISTRIBUTORS.length} className="text-wasro-blue" />
            + stores
            <br className="hidden md:block" /> across Northeast India
          </>
        }
        subtitle="Tap a state on the map, browse by city, or use 'Find stores near me' to locate the closest Wasro distributor. Every contact is a real person you can call or WhatsApp directly."
      />

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <FindStoreClient distributors={DISTRIBUTORS} />
      </section>
    </>
  );
}
