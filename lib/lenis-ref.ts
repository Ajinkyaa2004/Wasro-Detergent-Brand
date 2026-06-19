/**
 * Shared singleton holder for the Lenis instance, so any component on the
 * page (not just the provider) can trigger a smooth scroll.
 *
 * `SmoothScrollProvider` registers the instance on mount and clears it on
 * unmount. Other components import `smoothScrollTo()` and let it figure out
 * whether to use Lenis or fall back to native `window.scrollTo`.
 */
import type Lenis from "lenis";

let current: Lenis | null = null;

/** Called by SmoothScrollProvider only. */
export function setLenisInstance(instance: Lenis | null): void {
  current = instance;
}

/** Read the current Lenis instance (or null if Lenis is disabled). */
export function getLenisInstance(): Lenis | null {
  return current;
}

export type SmoothScrollTarget = number | HTMLElement | string;

export type SmoothScrollOptions = {
  /** Pixels added to the target's resolved Y. Negative value means the
   *  target appears LOWER in the viewport (e.g. offset:-144 leaves 144px
   *  of space above the target for a sticky header). */
  offset?: number;
  /** Animation duration in seconds. Default 0.9s. */
  duration?: number;
  /** Skip the animation and snap directly. */
  immediate?: boolean;
};

/**
 * Smooth-scroll to a target position, element, or selector.
 *
 * Works whether Lenis is initialized or not:
 *   - Lenis active  → uses `lenis.scrollTo()` with the same easing the
 *                     provider was configured with
 *   - Lenis missing → falls back to `window.scrollTo({behavior: 'smooth'})`,
 *                     so reduced-motion users and SSR don't break
 */
export function smoothScrollTo(
  target: SmoothScrollTarget,
  options: SmoothScrollOptions = {}
): void {
  if (typeof window === "undefined") return;

  const lenis = getLenisInstance();

  if (lenis) {
    lenis.scrollTo(target, {
      offset: options.offset ?? 0,
      duration: options.duration ?? 0.9,
      immediate: options.immediate ?? false,
      // Same easing curve used by the provider — keeps the feel consistent.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    return;
  }

  // Fallback: native scroll. Resolve target → absolute Y.
  let top: number;
  if (typeof target === "number") {
    top = target + (options.offset ?? 0);
  } else {
    const el =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : target;
    if (!el) return;
    top =
      el.getBoundingClientRect().top + window.scrollY + (options.offset ?? 0);
  }

  window.scrollTo({
    top: Math.max(0, top),
    behavior: options.immediate ? "auto" : "smooth",
  });
}
