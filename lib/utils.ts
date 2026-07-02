import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  brand: "Wasro",
  legalName: "Madhav Industries",
  manufacturer: "Madhav Industries",
  manufacturerAddress:
    "Brahmaputra Industrial Park, Plot No. 81, Amingaon-781031, Assam",
  // Used by JSON-LD PostalAddress
  address: {
    streetAddress: "Brahmaputra Industrial Park, Plot No. 81",
    addressLocality: "Amingaon",
    addressRegion: "Assam",
    postalCode: "781031",
    addressCountry: "IN",
  },
  // Approximate plant coordinates (Amingaon, Kamrup, Assam)
  geo: { latitude: 26.2031, longitude: 91.6753 },
  whatsapp: "917896778004",
  whatsappDisplay: "+91 78967 78004",
  email: "madhav.ghy@gmail.com",
  bulkMessage:
    "Hi Wasro team, I'd like to place a bulk order. Could you share pricing and dispatch details?",
  generalMessage:
    "Hi Wasro team! I came across your website and would like to know more about your products. Could you help me?",
  tagline: "Trusted Clean for Every Home",
  // SEO / structured-data fields (added — not used by existing components)
  url: "https://wasro.in",
  logo: "/logo1-cropped.png",
  foundingDate: "2022",
  sameAs: [
    "https://www.instagram.com/wasro.india",
    "https://www.facebook.com/wasro.india",
  ] as string[],
};
