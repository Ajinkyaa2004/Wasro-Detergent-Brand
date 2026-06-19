import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/admin";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-wasro-cream via-white to-wasro-blue-light/40 px-5 py-12">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute h-[420px] w-[420px] rounded-full"
          style={{
            top: "-12%",
            left: "-8%",
            background:
              "radial-gradient(circle at center, rgba(135,189,233,0.42), transparent 70%)",
          }}
        />
        <div
          className="absolute h-[380px] w-[380px] rounded-full"
          style={{
            bottom: "-15%",
            right: "-8%",
            background:
              "radial-gradient(circle at center, rgba(244,196,48,0.32), transparent 70%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2"
          aria-label="Back to Wasro home"
        >
          <Image
            src="/logo1-cropped.png"
            alt="Wasro"
            width={408}
            height={250}
            priority
            className="h-12 w-auto"
          />
        </Link>

        <div className="rounded-[1.5rem] border border-wasro-border bg-white/85 p-7 shadow-xl shadow-wasro-blue/[0.08] backdrop-blur sm:p-8">
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-wasro-blue">
              Wasro Admin
            </span>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-wasro-charcoal">
              Sign in to manage content
            </h1>
            <p className="mt-2 text-sm text-wasro-slate">
              Enter the admin password to update offers and on-site copy.
            </p>
          </div>

          <LoginForm next={safeNext} />
        </div>

        <p className="mt-6 text-center text-xs text-wasro-slate">
          Trouble signing in? WhatsApp the developer.
        </p>
      </div>
    </main>
  );
}
