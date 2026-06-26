import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CentralHeart } from './CentralHeart'
import { WishModal } from './WishModal'
import { WISH_ITEMS, type WishItem } from '../data/wishes'

const ORBIT_DURATION = 48
const BASE_RADIUS = 118

const BLOCK_WIDTH = 132
const BLOCK_HEIGHT = 92
const BLOCK_GAP = 6
const BLOCK_PADDING = 10
const MIN_RADIUS_SCALE = 1.18
const MAX_RADIUS_SCALE = 2.35
const HEART_EXCLUSION_RX = 88
const HEART_EXCLUSION_RY = 72
const MAX_PLACEMENT_ATTEMPTS = 48
const ANGLE_STEP = Math.PI / 12
const RADIUS_BANDS = [1.2, 1.45, 1.7, 1.95, 2.2, 2.35, 1.32, 1.58, 1.84, 2.1]

type OrbitPosition = {
  angle: number
  radiusScale: number
}

type Rect = {
  left: number
  top: number
  right: number
  bottom: number
}

function getOrbitOffset(angle: number, radiusScale: number) {
  const radius = BASE_RADIUS * radiusScale
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * 0.42,
  }
}

function getBlockRect(x: number, y: number): Rect {
  const halfW = BLOCK_WIDTH / 2 + BLOCK_PADDING
  const halfH = BLOCK_HEIGHT / 2 + BLOCK_PADDING

  return {
    left: x - halfW,
    top: y - halfH,
    right: x + halfW,
    bottom: y + halfH,
  }
}

function rectsOverlap(a: Rect, b: Rect) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

function isInsideHeartZone(x: number, y: number) {
  const normX = x / HEART_EXCLUSION_RX
  const normY = y / HEART_EXCLUSION_RY
  return normX * normX + normY * normY < 1
}

function clampRadius(radiusScale: number) {
  return Math.min(MAX_RADIUS_SCALE, Math.max(MIN_RADIUS_SCALE, radiusScale))
}

function* placementCandidates(angle: number, radiusScale: number) {
  yield { angle, radiusScale: clampRadius(radiusScale) }

  for (let attempt = 1; attempt < MAX_PLACEMENT_ATTEMPTS; attempt += 1) {
    const ringIndex = Math.floor(attempt / 12)
    const angleOffset = (attempt % 12) * ANGLE_STEP
    const radius = RADIUS_BANDS[ringIndex % RADIUS_BANDS.length] ?? 1.5

    yield {
      angle: angle + angleOffset,
      radiusScale: clampRadius(radius),
    }
  }
}

function resolveBlockPositions(wishes: WishItem[]): OrbitPosition[] {
  const placedRects: Rect[] = []

  return wishes.map((wish) => {
    const startRadius = clampRadius(wish.orbitRadius)

    for (const candidate of placementCandidates(wish.orbitAngle, startRadius)) {
      const { x, y } = getOrbitOffset(candidate.angle, candidate.radiusScale)

      if (isInsideHeartZone(x, y)) {
        continue
      }

      const rect = getBlockRect(x, y)
      const hasOverlap = placedRects.some((placed) => rectsOverlap(rect, placed))

      if (!hasOverlap) {
        placedRects.push(rect)
        return candidate
      }
    }

    const fallback = {
      angle: wish.orbitAngle,
      radiusScale: clampRadius(wish.orbitRadius),
    }
    const { x, y } = getOrbitOffset(fallback.angle, fallback.radiusScale)
    placedRects.push(getBlockRect(x, y))
    return fallback
  })
}

type OrbitWishBlockProps = {
  wish: WishItem
  position: OrbitPosition
  onSelect: (wish: WishItem) => void
}

function OrbitWishBlock({ wish, position, onSelect }: OrbitWishBlockProps) {
  const offset = getOrbitOffset(position.angle, position.radiusScale)

  return (
    <motion.button
      type="button"
      className="absolute left-0 top-0 z-20 flex flex-col items-center"
      style={{
        gap: BLOCK_GAP,
        transform: `translate(${offset.x}px, ${offset.y}px) translate(-50%, -50%)`,
      }}
      animate={{ rotate: -360 }}
      transition={{
        duration: ORBIT_DURATION,
        repeat: Infinity,
        ease: 'linear',
      }}
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
    </motion.button>
  )
}

export function PreviewScreen() {
  const [selectedWish, setSelectedWish] = useState<WishItem | null>(null)
  const heartWish = WISH_ITEMS.find((wish) => wish.shortLabel === '❤️') ?? WISH_ITEMS[0]
  const orbitBlocks = useMemo(() => {
    const positions = resolveBlockPositions(WISH_ITEMS)

    return WISH_ITEMS.map((wish, index) => ({
      wish,
      position: positions[index],
    }))
  }, [])

  return (
    <div className="relative min-h-dvh w-full">
      <div className="absolute left-1/2 top-[52%] z-10 h-0 w-0 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative h-0 w-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: ORBIT_DURATION,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {orbitBlocks.map(({ wish, position }) => (
            <OrbitWishBlock
              key={wish.id}
              wish={wish}
              position={position}
              onSelect={setSelectedWish}
            />
          ))}
        </motion.div>
      </div>

      <CentralHeart onClick={() => setSelectedWish(heartWish)} />

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
