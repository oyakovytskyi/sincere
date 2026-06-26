import { motion } from 'framer-motion'

type CentralHeartProps = {
  onClick?: () => void
}

export function CentralHeart({ onClick }: CentralHeartProps) {
  const isInteractive = typeof onClick === 'function'

  return (
    <div
      className={`absolute left-1/2 top-[52%] z-20 -translate-x-1/2 -translate-y-1/2 ${
        isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {isInteractive ? (
        <motion.button
          type="button"
          onClick={onClick}
          aria-label="Відкрити головне побажання"
          whileTap={{ scale: 0.96 }}
          className="relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
        >
          <HeartVisual />
        </motion.button>
      ) : (
        <div className="relative">
          <HeartVisual />
        </div>
      )}
    </div>
  )
}

function HeartVisual() {
  return (
    <>
      <motion.div
        className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/25 blur-3xl"
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        viewBox="0 0 200 180"
        className="relative h-28 w-28 drop-shadow-[0_0_28px_rgba(236,72,153,0.9)] sm:h-36 sm:w-36"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      >
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="45%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>
          <filter id="heartGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M100 165 C55 125, 10 95, 35 55 C55 25, 85 35, 100 58 C115 35, 145 25, 165 55 C190 95, 145 125, 100 165 Z"
          fill="url(#heartGradient)"
          filter="url(#heartGlow)"
        />
      </motion.svg>

      {[...Array(12)].map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-pink-200"
          style={{
            left: `${50 + Math.cos(index * 0.9) * 38}%`,
            top: `${50 + Math.sin(index * 0.9) * 32}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1.4, 0.5],
          }}
          transition={{
            duration: 1.8 + (index % 4) * 0.3,
            repeat: Infinity,
            delay: index * 0.12,
          }}
        />
      ))}
    </>
  )
}
