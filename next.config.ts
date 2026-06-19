import type { NextConfig } from "next";

/**
 * Security headers applied to every route.
 *
 * Addresses the Screaming Frog warnings:
 *   - Missing X-Frame-Options          → clickjacking protection
 *   - Missing X-Content-Type-Options   → MIME-sniff protection
 *   - Missing Referrer-Policy          → referrer leak protection
 *   - Missing Content-Security-Policy  → XSS / injection mitigation
 *
 * CSP notes — kept deliberately permissive where the app genuinely needs it
 * so nothing breaks, while still locking down the dangerous vectors:
 *   - script-src allows 'unsafe-inline'/'unsafe-eval' because Next.js's
 *     hydration + framer-motion need them (a nonce-based CSP is possible
 *     but brittle; revisit post-launch if a stricter policy is required).
 *   - style-src allows 'unsafe-inline' (Tailwind + framer-motion inline
 *     styles) and the Fontshare stylesheet host.
 *   - font-src allows the Fontshare CDN + data: (for any inlined fonts).
 *   - img-src allows https: + data: + blob: so Next/Image, product images,
 *     and blur placeholders all load.
 *   - connect-src allows https: for server-action round-trips and any
 *     future analytics endpoint.
 *   - frame-ancestors 'none' is the modern equivalent of
 *     X-Frame-Options: DENY (kept both for crawler/legacy coverage).
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
  "font-src 'self' https://api.fontshare.com https://cdn.fontshare.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to every route.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
