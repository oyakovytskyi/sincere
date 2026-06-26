import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CentralHeart } from './CentralHeart'
import { WishModal } from './WishModal'
import { WISH_ITEMS, type WishItem } from '../data/wishes'
import { BLOCK_GAP, getWishOrbitOffset, ORBIT_CENTER_Y_OFFSET } from '../data/orbitLayout'

type OrbitWishArmProps = {
  wish: WishItem
  onSelect: (wish: WishItem) => void
}

function OrbitWishArm({ wish, onSelect }: OrbitWishArmProps) {
  const offset = getWishOrbitOffset(wish)

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 z-20 h-0 w-0"
      animate={{ rotate: 360 * wish.orbitDirection }}
      transition={{
        duration: wish.orbitDuration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
        }}
      >
        <motion.div
          animate={{ rotate: -360 * wish.orbitDirection }}
          transition={{
            duration: wish.orbitDuration,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <button
            type="button"
            className="flex flex-col items-center"
            style={{ gap: BLOCK_GAP }}
            onClick={() => onSelect(wish)}
            aria-label={`Відкрити побажання: ${wish.title}`}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-pink-100/65 text-lg shadow-[0_0_24px_rgba(244,114,182,0.65)] transition-transform duration-200 hover:scale-110 sm:h-12 sm:w-12"
              style={{ background: wish.avatarGradient }}
            >
              {wish.shortLabel}
            </span>
            <span
              className="max-w-38 rounded-2xl border border-pink-200/30 bg-zinc-900/70 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-pink-100/90 shadow-[0_0_18px_rgba(236,72,153,0.35)] backdrop-blur-sm transition-colors hover:bg-zinc-800/85 sm:max-w-44 sm:text-xs"
              style={{
                textShadow:
                  '0 0 12px rgba(244,114,182,0.9), 0 0 24px rgba(168,85,247,0.6)',
              }}
            >
              {wish.title}
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function PreviewScreen() {
  const [selectedWish, setSelectedWish] = useState<WishItem | null>(null)

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
          <OrbitWishArm key={wish.id} wish={wish} onSelect={setSelectedWish} />
        ))}
      </div>

      <p className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-center text-xs text-pink-200/70 sm:text-sm">
        Натисни на спогад, щоб відкрити його
      </p>

      <AnimatePresence>
        {selectedWish ? (
          <WishModal wish={selectedWish} onClose={() => setSelectedWish(null)} />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
