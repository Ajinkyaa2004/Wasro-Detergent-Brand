"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  motion,
  animate,
  useDragControls,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import {
  Star,
  Quote,
  MapPin,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Review } from "@/lib/reviews";
import { cn } from "@/lib/utils";

/**
 * Swipe-card stack for the home page Reviews section.
 *
 * Architecture:
 *   - Parent owns `deck` (the current cards) AND `flyingOut`
 *     ({id, direction}) — the SINGLE card currently animating off-screen.
 *   - Each card receives `flyOutDirection: 1 | -1 | null`. Only the card
 *     whose id matches `flyingOut.id` ever receives a non-null value.
 *     This is the fix for the v1 bug where arrow clicks rippled through
 *     the whole deck — that version passed a global "command" that the
 *     NEW front card re-consumed the moment the previous front left.
 *   - Front card is draggable (only "x"). Below threshold, framer's
 *     `dragSnapToOrigin` springs it back. Above threshold the parent
 *     receives the id and starts a managed fly-out.
 *   - Arrow buttons are no-ops while a fly-out is in progress, so users
 *     can't rapid-click their way through 3 cards in one frame.
 */

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY = 500;
const STACK_VISIBLE = 5;
const FLY_OUT_DURATION_MS = 280;
const FLY_OUT_DISTANCE_PX = 600;

type FlyingOut = { id: string; direction: 1 | -1 } | null;

export function ReviewsSwipeStack({ reviews }: { reviews: Review[] }) {
  // Reverse the incoming order so the FIRST review ends up as the
  // visually front card. (Per the reference pattern, the LAST item in
  // the rendered array is the visual front.)
  const initialDeck = useMemo(() => [...reviews].reverse(), [reviews]);
  const [deck, setDeck] = useState<Review[]>(initialDeck);
  const [flyingOut, setFlyingOut] = useState<FlyingOut>(null);

  const reset = useCallback(() => {
    setDeck(initialDeck);
    setFlyingOut(null);
  }, [initialDeck]);

  // Centralised "remove the front card with this id" — used by both
  // dragger-driven swipes and arrow-driven programmatic swipes.
  const dropCard = useCallback((id: string) => {
    setDeck((pv) => pv.filter((c) => c.id !== id));
    setFlyingOut(null);
  }, []);

  const triggerArrowSwipe = useCallback(
    (direction: 1 | -1) => {
      // Lock out while a swipe is mid-flight so a rapid double-click
      // doesn't burn through two cards.
      if (deck.length === 0 || flyingOut) return;
      const front = deck[deck.length - 1];
      setFlyingOut({ id: front.id, direction });
      // Parent removes the card from state after the animation has had
      // time to play. The card's internal `animate(x, …)` does the visual.
      window.setTimeout(() => dropCard(front.id), FLY_OUT_DURATION_MS);
    },
    [deck, flyingOut, dropCard]
  );

  // Drag-driven fly-out path. The card invokes this with the offset sign
  // when its drag end crosses the threshold. Parent then drops the card
  // after the same wait so the card's drag-momentum has time to scroll
  // it the rest of the way off-screen.
  const triggerDragSwipe = useCallback(
    (id: string, direction: 1 | -1) => {
      if (flyingOut) return;
      setFlyingOut({ id, direction });
      window.setTimeout(() => dropCard(id), FLY_OUT_DURATION_MS);
    },
    [flyingOut, dropCard]
  );

  const totalCount = initialDeck.length;
  const currentIndex = totalCount - deck.length + 1;
  const empty = deck.length === 0;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* The stack itself */}
      <div
        className="relative grid h-[480px] w-full max-w-sm place-items-center"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(27,95,168,0.08) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        {empty ? (
          <EmptyState onReset={reset} totalCount={totalCount} />
        ) : (
          deck
            .slice(-STACK_VISIBLE)
            .map((review, idx, arr) => {
              const isFront = idx === arr.length - 1;
              const isFlying = flyingOut?.id === review.id;
              return (
                <SwipeCard
                  key={review.id}
                  review={review}
                  isFront={isFront}
                  depth={arr.length - 1 - idx}
                  flyOutDirection={isFlying ? flyingOut!.direction : null}
                  onDragRelease={(direction) =>
                    triggerDragSwipe(review.id, direction)
                  }
                />
              );
            })
        )}
      </div>

      {/* Controls */}
      {!empty && (
        <div className="flex w-full max-w-sm items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => triggerArrowSwipe(-1)}
            disabled={!!flyingOut}
            aria-label="Previous (swipe left)"
            className="group inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-wasro-charcoal shadow-md ring-1 ring-wasro-border transition hover:-translate-y-0.5 hover:bg-rose-50 hover:text-rose-600 hover:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <ChevronLeft
              size={20}
              className="transition group-hover:-translate-x-0.5"
            />
          </button>

          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-wasro-slate">
              {currentIndex} of {totalCount}
            </div>
            <p className="mt-1 text-[10px] text-wasro-slate/80">
              Swipe or use arrows
            </p>
          </div>

          <button
            type="button"
            onClick={() => triggerArrowSwipe(1)}
            disabled={!!flyingOut}
            aria-label="Next (swipe right)"
            className="group inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-wasro-charcoal shadow-md ring-1 ring-wasro-border transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-600 hover:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <ChevronRight
              size={20}
              className="transition group-hover:translate-x-0.5"
            />
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Card
// ----------------------------------------------------------------------------

function SwipeCard({
  review,
  isFront,
  depth,
  flyOutDirection,
  onDragRelease,
}: {
  review: Review;
  isFront: boolean;
  depth: number;
  /** Non-null ONLY when this specific card is the one flying out. */
  flyOutDirection: 1 | -1 | null;
  /** Called when the user releases a drag past the swipe threshold. */
  onDragRelease: (direction: 1 | -1) => void;
}) {
  const x = useMotionValue(0);
  const dragControls = useDragControls();
  // Snapshot the previous flyOutDirection so the effect only triggers on
  // the rising edge (null → 1 or null → -1), never on remount or
  // re-render with the same value.
  const flyOutAppliedRef = useRef<1 | -1 | null>(null);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const rotate = useTransform(() => {
    const offset = isFront ? 0 : depth % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  const scale = isFront ? 1 : 1 - depth * 0.04;
  const translateY = isFront ? 0 : depth * 8;

  // When the parent flags THIS card as flying out, animate x off-screen.
  // Note: this only ever runs on the card whose id matches `flyingOut.id`
  // in the parent — sibling cards always see `flyOutDirection={null}` so
  // they never enter this branch.
  useEffect(() => {
    if (flyOutDirection === null) {
      flyOutAppliedRef.current = null;
      return;
    }
    if (flyOutAppliedRef.current === flyOutDirection) return;
    flyOutAppliedRef.current = flyOutDirection;

    const controls = animate(x, flyOutDirection * FLY_OUT_DISTANCE_PX, {
      duration: FLY_OUT_DURATION_MS / 1000,
      ease: [0.32, 0, 0.67, 0], // easeIn — quick at start, glide out
    });
    return () => controls.stop();
  }, [flyOutDirection, x]);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (!isFront) return;
    if (
      Math.abs(info.offset.x) > SWIPE_THRESHOLD ||
      Math.abs(info.velocity.x) > SWIPE_VELOCITY
    ) {
      const direction: 1 | -1 = info.offset.x > 0 ? 1 : -1;
      // Hand control back to the parent — it will set flyOutDirection on
      // this card so the same animation path runs as for arrow clicks.
      onDragRelease(direction);
    }
    // Below threshold: dragSnapToOrigin springs the card back, no action.
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!isFront) return;
    dragControls.start(event, { snapToCursor: false });
  };

  return (
    <motion.div
      onPointerDown={handlePointerDown}
      className="absolute h-[440px] w-72 origin-bottom touch-none select-none overflow-hidden rounded-3xl shadow-2xl ring-1 ring-wasro-border sm:w-80"
      style={{
        x,
        opacity,
        rotate,
        zIndex: isFront ? 50 : 50 - depth,
        pointerEvents: isFront ? "auto" : "none",
        boxShadow: isFront
          ? "0 25px 50px -12px rgba(0,0,0,0.25), 0 8px 16px -8px rgba(0,0,0,0.15)"
          : "0 10px 20px -10px rgba(0,0,0,0.15)",
      }}
      animate={{
        scale,
        y: translateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag={isFront && flyOutDirection === null ? "x" : false}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragSnapToOrigin
      onDragEnd={handleDragEnd}
    >
      <CardBody review={review} draggable={isFront} />
    </motion.div>
  );
}

// ----------------------------------------------------------------------------
// Card body
// ----------------------------------------------------------------------------

function CardBody({
  review,
  draggable,
}: {
  review: Review;
  draggable: boolean;
}) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-4 bg-gradient-to-br from-wasro-blue to-wasro-blue-dark p-6 text-white",
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      )}
    >
      <Quote size={36} className="text-white/15" aria-hidden />
      {review.title && (
        <h3 className="line-clamp-2 text-xl font-bold leading-tight">
          {review.title}
        </h3>
      )}
      <p className="line-clamp-6 text-sm leading-relaxed text-white/90">
        &ldquo;{review.body}&rdquo;
      </p>
      <div className="mt-auto space-y-3">
        <div
          className="flex items-center gap-0.5"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={14}
              className={cn(
                i <= review.rating
                  ? "fill-wasro-yellow text-wasro-yellow"
                  : "text-white/30"
              )}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-2 border-t border-white/15 pt-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">{review.name}</div>
            <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-white/80">
              <MapPin size={11} />
              <span className="truncate">{review.location}</span>
            </div>
          </div>
          {review.productLabel && (
            <span className="max-w-[55%] truncate rounded-pill bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
              {review.productLabel}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ----------------------------------------------------------------------------
// Empty state
// ----------------------------------------------------------------------------

function EmptyState({
  onReset,
  totalCount,
}: {
  onReset: () => void;
  totalCount: number;
}) {
  return (
    <div className="flex h-[440px] w-72 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-wasro-blue/30 bg-white p-6 text-center sm:w-80">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-wasro-blue-light text-wasro-blue">
        <Quote size={24} />
      </div>
      <h3 className="text-base font-bold text-wasro-charcoal">
        You&apos;ve seen them all
      </h3>
      <p className="text-sm leading-relaxed text-wasro-slate">
        That&apos;s {totalCount} {totalCount === 1 ? "story" : "stories"} from
        Wasro shoppers. Want another look?
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-pill bg-wasro-blue px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-wasro-blue-dark"
      >
        <RotateCcw size={14} /> Restart deck
      </button>
    </div>
  );
}
