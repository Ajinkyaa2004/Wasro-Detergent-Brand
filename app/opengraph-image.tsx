import { ImageResponse } from "next/og";
import { SITE } from "@/lib/utils";

/**
 * Site-wide Open Graph image for social sharing (Facebook, WhatsApp,
 * LinkedIn, X/Twitter, Slack, etc.). Auto-served by Next at:
 *   https://wasro.in/opengraph-image
 *
 * Rendered programmatically with @vercel/og so we get a guaranteed
 * 1200x630 PNG without shipping a static asset.
 */

export const runtime = "nodejs";
export const alt = "Wasro — Trusted Clean for Every Indian Home";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundImage:
            "linear-gradient(135deg, #1B5FA8 0%, #0F4275 60%, #0A2D52 100%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blob — top right */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 540,
            height: 540,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at center, rgba(244,196,48,0.32), transparent 70%)",
            display: "flex",
          }}
        />
        {/* Decorative blob — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -160,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at center, rgba(135,189,233,0.30), transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top row — wordmark + tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            {SITE.brand}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              padding: "10px 20px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.25)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Made in Assam
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 880,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "flex" }}>Trusted clean</span>
            <span style={{ display: "flex", color: "#F4C430" }}>
              &nbsp;for every Indian home.
            </span>
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.4,
              display: "flex",
              maxWidth: 820,
            }}
          >
            Detergent powders, dishwash bars & clothwash bars by Madhav
            Industries. Free gift in every family pack.
          </div>
        </div>

        {/* Bottom row — stats + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 40 }}>
            <Stat value="150+" label="Stores across India" />
            <Stat value="14" label="SKUs · 4 categories" />
            <Stat value="₹5" label="Starting price" />
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#F4C430",
              letterSpacing: "0.03em",
              display: "flex",
            }}
          >
            wasro.in
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          display: "flex",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.72)",
          display: "flex",
        }}
      >
        {label}
      </div>
    </div>
  );
}
