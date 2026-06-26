import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { WishItem } from '../data/wishes'

type WishModalProps = {
  wish: WishItem
  onClose: () => void
}

export function WishModal({ wish, onClose }: WishModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Закрити модальне вікно"
      />

      <motion.article
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-pink-300/25 bg-zinc-950/95 shadow-[0_0_60px_rgba(236,72,153,0.35)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`wish-modal-title-${wish.id}`}
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="aspect-4/5 w-full"
          style={{ background: wish.imageGradient }}
          role="img"
          aria-label={wish.title}
        />

        <div className="space-y-3 px-6 py-5 text-center">
          <h2 id={`wish-modal-title-${wish.id}`} className="text-2xl font-semibold text-pink-100">
            {wish.title}
          </h2>
          <p className="text-base leading-relaxed text-pink-100/85">
            {wish.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full border-t border-pink-300/15 py-4 text-sm font-medium text-pink-200 transition-colors hover:bg-pink-500/10"
        >
          Закрити
        </button>
      </motion.article>
    </motion.div>
  )
}
