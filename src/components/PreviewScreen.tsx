import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CentralHeart } from "./CentralHeart";
import { WishModal } from "./WishModal";
import { WISH_ITEMS, type WishItem } from "../data/wishes";
import {
  BLOCK_GAP,
  getOrbitFitScale,
  getProjectedWishPosition,
  ORBIT_CENTER_Y_OFFSET,
  type ProjectedWishPosition,
} from "../data/orbitLayout";

type OrbitWishArmProps = {
  wish: WishItem;
  position: ProjectedWishPosition;
  onSelect: (wish: WishItem) => void;
};

function OrbitWishArm({ wish, position, onSelect }: OrbitWishArmProps) {
  return (
    <div
      className="absolute left-1/2 top-1/2 h-0 w-0"
      style={{
        transform: `translate(calc(-50% + ${position.sx}px), calc(-50% + ${position.sy}px)) scale(${position.scale})`,
        opacity: position.opacity,
        zIndex: position.zIndex,
      }}
    >
      <div
        className="absolute left-0 top-0"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <button
          type="button"
          className="group flex cursor-pointer touch-manipulation flex-col items-center rounded-2xl outline-none transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-pink-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          style={{ gap: BLOCK_GAP }}
          onClick={() => onSelect(wish)}
          aria-label={`Відкрити побажання: ${wish.title}`}
        >
          <span className="flex h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-pink-100/65 shadow-[0_0_24px_rgba(244,114,182,0.65)] transition-[border-color,box-shadow] duration-200 group-hover:border-pink-200/90 group-hover:shadow-[0_0_32px_rgba(244,114,182,0.85)] sm:h-12 sm:w-12">
            <img
              src={wish.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </span>
          <span
            className="max-w-38 rounded-2xl border border-pink-200/30 bg-zinc-900/70 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-pink-100/90 shadow-[0_0_18px_rgba(236,72,153,0.35)] backdrop-blur-sm transition-[background-color,border-color] duration-200 group-hover:border-pink-200/45 group-hover:bg-zinc-800/85 sm:max-w-44 sm:text-xs whitespace-nowrap select-none"
            style={{
              textShadow:
                "0 0 12px rgba(244,114,182,0.9), 0 0 24px rgba(168,85,247,0.6)",
            }}
          >
            {wish.title}
          </span>
        </button>
      </div>
    </div>
  );
}

export function PreviewScreen() {
  const [selectedWish, setSelectedWish] = useState<WishItem | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  const maxOrbitRadius = useMemo(
    () => Math.max(...WISH_ITEMS.map((wish) => wish.orbitRadius)),
    [],
  );

  const orbitFitScale = useMemo(
    () => getOrbitFitScale(viewport.width, viewport.height, maxOrbitRadius),
    [viewport.width, viewport.height, maxOrbitRadius],
  );

  useEffect(() => {
    const onResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      setElapsed((now - startTime) / 1000);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="relative min-h-dvh w-full">
      <div
        className="absolute left-1/2 top-1/2 z-10"
        style={{
          transform: `translate(-50%, calc(-50% + ${ORBIT_CENTER_Y_OFFSET}px))`,
        }}
      >
        <CentralHeart />

        {WISH_ITEMS.map((wish) => (
          <OrbitWishArm
            key={wish.id}
            wish={wish}
            position={getProjectedWishPosition(wish, elapsed, orbitFitScale)}
            onSelect={setSelectedWish}
          />
        ))}
      </div>

      <p className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-center text-xs text-pink-200/70 sm:text-sm">
        Натисни на спогад, щоб відкрити його
      </p>

      <AnimatePresence>
        {selectedWish ? (
          <WishModal
            wish={selectedWish}
            onClose={() => setSelectedWish(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
