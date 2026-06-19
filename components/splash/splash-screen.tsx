"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/**
 * First-visit branded splash for the Wasro home page.
 *
 * Behaviour contract:
 *
 *   - Shows ONCE per browser tab session. `sessionStorage` gate; the
 *     first navigation to '/' shows it, every subsequent navigation in
 *     the same tab — to '/' OR any sub-page — skips it.
 *   - Only mounted on '/' (this component is imported only by
 *     `app/page.tsx`). Deep links to /products /find-store etc never
 *     trigger it.
 *   - Auto-dismisses at 2.6s + ~1.25s staggered exit. User can also
 *     tap anywhere or hit Esc/Space/Enter to dismiss early.
 *   - Honours `prefers-reduced-motion`: skips the bubble field and the
 *     spring-in on the logo, runs a flat 0.6s fade instead.
 *   - SSR-safe: returns `null` during server render so React doesn't
 *     emit a hidden-from-storage hydration mismatch.
 *
 * EXIT — layered crossfade (NOT a single fade)
 * ────────────────────────────────────────────
 * v2 used a single 500ms opacity+y exit on the whole overlay, which
 * felt abrupt — the cream wash and the brand mark left together and
 * the hero "popped" into view. The new exit mimics the portfolio
 * (itsajinkya.vercel.app) by staging the dissolve:
 *
 *   t = 0      User clicks / auto-dismiss fires → `isExiting = true`
 *   t = 0      Children (logo, tagline, halo, tap-hint) start fading
 *              with subtle scale + drift. Bubbles freeze in place.
 *   t = 0.35s  Children essentially gone. `show = false`.
 *              AnimatePresence kicks in on the parent.
 *   t = 0.35s  Cream wash starts a 0.9s opacity fade with a tiny
 *              scale-up (1 → 1.04) so it feels like the splash recedes
 *              into depth rather than just disappearing.
 *   t = 1.25s  Overlay unmounted. Hero is fully revealed underneath.
 *
 * Net effect: a 1.25s crossfade where the hero is visible-but-veiled
 * for ~700ms before the splash fully clears — same vibe as the
 * portfolio's "dark wash lifting" sequence.
 *
 * BODY-SCROLL LOCK
 * ────────────────
 * Lives in its own `useEffect` keyed on `show` so the cleanup runs
 * the moment `show` flips false (not just on full unmount). Prevents
 * the mobile-scroll regression where `body.overflow:hidden` would
 * leak after the splash dismissed.
 */

const STORAGE_KEY = "wasro_splash_seen";

// Timing budget — total ≈ 3.85s end-to-end on first visit:
//
//   0.00 ─ 0.45s   Cream wash; bubbles start drifting up
//   0.45 ─ 1.25s   Logo eases in (gentle, no overshoot)
//   1.10 ─ 1.90s   Tagline fades up + scales subtly
//   1.60 ─ 2.20s   "tap to continue" hint at low opacity
//   2.20 ─ 2.60s   Hold — pure brand moment
//   2.60 ─ 2.95s   Brand mark fades + scales down (children stage)
//   2.95 ─ 3.85s   Cream wash dissolves with subtle scale-up
const VISIBLE_DURATION_MS = 2600;
const CHILDREN_EXIT_MS = 350;
const BG_EXIT_MS = 900;

// Bubble field — deterministic positions/sizes so server + client
// hydrate to the same DOM (would otherwise trip a hydration warning).
const BUBBLES = [
  { id: 0, size: 64, left: "14%", driftDelay: 0.00, hueShift: 0 },
  { id: 1, size: 44, left: "27%", driftDelay: 0.55, hueShift: -10 },
  { id: 2, size: 96, left: "44%", driftDelay: 0.20, hueShift: 20 },
  { id: 3, size: 36, left: "58%", driftDelay: 0.85, hueShift: 5 },
  { id: 4, size: 72, left: "72%", driftDelay: 0.35, hueShift: -15 },
  { id: 5, size: 52, left: "85%", driftDelay: 0.10, hueShift: 10 },
  { id: 6, size: 40, left: "8%", driftDelay: 1.00, hueShift: -5 },
  { id: 7, size: 56, left: "38%", driftDelay: 1.30, hueShift: 12 },
  { id: 8, size: 32, left: "65%", driftDelay: 1.55, hueShift: -8 },
];

const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function SplashScreen() {
  const [show, setShow] = useState<boolean | null>(null);
  // Stage gate: once true, children begin their fade. After
  // CHILDREN_EXIT_MS we flip `show` and let AnimatePresence dissolve
  // the background.
  const [isExiting, setIsExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Safari private mode / quota — non-fatal.
    }
    // Two-stage: children fade first, then the bg.
    setIsExiting(true);
    window.setTimeout(() => setShow(false), CHILDREN_EXIT_MS);
  }, []);

  // Mount effect — decides first-visit-ness, wires the auto-dismiss
  // timer + keyboard handler. Runs once.
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // ignore
    }
    if (seen) {
      setShow(false);
      return;
    }
    const motionQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQ.matches);
    setShow(true);

    const t = window.setTimeout(dismiss, VISIBLE_DURATION_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") dismiss();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [dismiss]);

  // Body-scroll lock — separate effect keyed on `show` so the cleanup
  // runs the moment the splash is dismissed. Releases the lock at the
  // START of the exit (not the end), so the hero is fully scrollable
  // through the entire 900ms crossfade.
  useEffect(() => {
    if (show !== true) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  if (show !== true) return null;

  // Entry animations stay as v2 (perfect ease-out-quint).
  const logoMotion = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 } }
    : {
        initial: { scale: 0.7, opacity: 0, y: 8 },
        animate: { scale: 1, opacity: 1, y: 0 },
        transition: { delay: 0.45, duration: 0.8, ease: EASE_OUT_QUINT },
      };
  const taglineMotion = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: 0.4 } }
    : {
        initial: { opacity: 0, y: 14, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { delay: 1.1, duration: 0.75, ease: EASE_OUT_QUINT },
      };

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to Wasro"
        onClick={dismiss}
        initial={{ opacity: 1, scale: 1 }}
        // Exit = the BACKGROUND dissolve. Pure opacity + tiny scale-up
        // (the splash recedes into depth instead of slamming away).
        // No vertical slide — that's what made v1 feel abrupt.
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{
          duration: BG_EXIT_MS / 1000,
          ease: EASE_OUT_QUINT,
        }}
        className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-wasro-cream"
        data-testid="wasro-splash"
      >
        {/* Bubbles — children fade together via the wrapper's
            isExiting-conditional opacity. Individual drift animations
            keep playing; the parent fade carries them out gracefully. */}
        {!reducedMotion && (
          <motion.div
            aria-hidden
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ duration: CHILDREN_EXIT_MS / 1000, ease: EASE_OUT_QUINT }}
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {BUBBLES.map((b) => (
              <motion.span
                key={b.id}
                initial={{ y: "60vh", opacity: 0 }}
                animate={{
                  y: "-110vh",
                  opacity: [0, 0.85, 0.7, 0],
                }}
                transition={{
                  delay: b.driftDelay,
                  duration: 3.6,
                  ease: [0.16, 0.84, 0.44, 1],
                  opacity: { times: [0, 0.12, 0.78, 1], duration: 3.6 },
                }}
                style={{
                  position: "absolute",
                  left: b.left,
                  width: b.size,
                  height: b.size,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 32%, rgba(255,255,255,0.95), rgba(135,189,233,${
                    0.35 + b.hueShift * 0.005
                  }) 60%, rgba(135,189,233,0.0) 100%)`,
                  border: "1px solid rgba(135,189,233,0.55)",
                  boxShadow: "inset 0 0 12px rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Halo — exits with a slight contract for a "draining" feel. */}
        <motion.div
          aria-hidden
          initial={{ scale: 0.6, opacity: 0 }}
          animate={
            isExiting
              ? { scale: 0.85, opacity: 0 }
              : reducedMotion
              ? { scale: 1, opacity: 0.55 }
              : { scale: [0.6, 1, 1.06, 1], opacity: [0, 0.55, 0.65, 0.55] }
          }
          transition={
            isExiting
              ? { duration: CHILDREN_EXIT_MS / 1000, ease: EASE_OUT_QUINT }
              : reducedMotion
              ? { delay: 0.35, duration: 0.9, ease: "easeOut" }
              : {
                  duration: 2.6,
                  times: [0, 0.35, 0.7, 1],
                  ease: EASE_OUT_QUINT,
                }
          }
          className="absolute h-64 w-64 rounded-full bg-wasro-blue/10 blur-3xl md:h-80 md:w-80"
        />

        {/* Logo. Exits with a soft shrink + fade (scale 1 → 0.94). */}
        <motion.div
          {...(isExiting
            ? {
                animate: { scale: 0.94, opacity: 0, y: -6 },
                transition: { duration: CHILDREN_EXIT_MS / 1000, ease: EASE_OUT_QUINT },
              }
            : logoMotion)}
          className="relative z-10 h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40"
        >
          <motion.div
            animate={
              reducedMotion ? { scale: 1 } : { scale: [1, 1.025, 1] }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    delay: 1.3,
                    duration: 1.4,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  }
            }
            className="relative h-full w-full"
          >
            <Image
              src="/icon.png"
              alt="Wasro"
              fill
              priority
              sizes="(min-width: 768px) 160px, 128px"
              className="object-contain drop-shadow-[0_8px_24px_rgba(27,95,168,0.18)]"
            />
          </motion.div>
        </motion.div>

        {/* Tagline — exits with a tiny upward drift + fade. */}
        <motion.p
          {...(isExiting
            ? {
                animate: { opacity: 0, y: -4, scale: 0.98 },
                transition: { duration: CHILDREN_EXIT_MS / 1000, ease: EASE_OUT_QUINT },
              }
            : taglineMotion)}
          className="relative z-10 mt-5 text-center text-sm font-semibold tracking-wide text-wasro-charcoal sm:text-base md:mt-6 md:text-lg"
        >
          Trusted Clean for Every Home
        </motion.p>

        {/* Tap-to-continue hint — first to leave (no need to linger). */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : 0.55 }}
          transition={
            isExiting
              ? { duration: 0.2, ease: EASE_OUT_QUINT }
              : { delay: 0.95, duration: 0.4 }
          }
          className="absolute bottom-7 text-[10px] font-medium uppercase tracking-[0.22em] text-wasro-slate sm:text-xs"
        >
          tap to continue
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
