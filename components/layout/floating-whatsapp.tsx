"use client";

import { usePathname } from "next/navigation";
import { SITE } from "@/lib/utils";

/**
 * Picks a context-aware WhatsApp pre-fill message based on the page the
 * visitor is currently on. Generic for the home page, but more specific
 * everywhere else so the shopkeeper / household opens a chat that's
 * already framed around what they were looking at.
 *
 * Why client-side: usePathname() only resolves on the client. Reading it
 * during SSR returns the static `/` and would defeat the purpose.
 */
function pickMessage(pathname: string | null): string {
  if (!pathname) return SITE.generalMessage;

  // Order matters — most-specific match wins.
  if (pathname.startsWith("/bulk-orders")) return SITE.bulkMessage;

  if (pathname.startsWith("/find-store")) {
    return "Hi Wasro team! I'm trying to find a nearby store stocking Wasro detergent. Could you help me locate the closest one?";
  }

  if (pathname.startsWith("/stain-guide")) {
    return "Hi Wasro team! I came across your stain guide and need a recommendation for a specific stain. Could you help me?";
  }

  if (pathname.startsWith("/products")) {
    return "Hi Wasro team! I was browsing your product range on wasro.in and wanted to know more / place an order. Could you help me?";
  }

  if (pathname.startsWith("/about")) {
    return "Hi Wasro team! I just read about Madhav Industries on your website and would like to connect with your team.";
  }

  return SITE.generalMessage;
}

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const message = pickMessage(pathname);
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_8px_28px_-6px_rgba(16,185,129,0.55)] transition hover:scale-110 hover:bg-emerald-600 md:bottom-7 md:right-7 md:h-16 md:w-16"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 wasro-pulse-ring"
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 wasro-pulse-ring"
        style={{ animationDelay: "1.2s" }}
      />
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="relative h-7 w-7 md:h-8 md:w-8"
        aria-hidden
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.872 2.722.872.687 0 2.15-.42 2.434-1.247.073-.214.117-.428.117-.642 0-.29-.36-.45-.555-.564-.27-.157-1.418-.665-1.605-.665zm-2.713 7.063c-1.42 0-2.812-.385-4.04-1.07l-.302-.18-3.157.83.842-3.07-.2-.317a8.07 8.07 0 0 1-1.244-4.31c0-4.453 3.65-8.075 8.117-8.075 2.163 0 4.198.844 5.726 2.367a8.013 8.013 0 0 1 2.378 5.71c0 4.454-3.65 8.115-8.12 8.115zm6.93-15.068C21.452 7.347 19.05 6.4 16.502 6.4c-5.39 0-9.78 4.376-9.78 9.756 0 1.713.45 3.39 1.305 4.87L6.4 26.4l5.546-1.453a9.768 9.768 0 0 0 4.555 1.157c5.388 0 9.78-4.376 9.78-9.755-.002-2.61-1.026-5.06-2.93-6.95z" />
      </svg>
    </a>
  );
}
