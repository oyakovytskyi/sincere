import { motion } from 'framer-motion'

type IntroScreenProps = {
  onContinue: () => void
}

export function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center px-6">
      <motion.div
        className="w-full max-w-xl rounded-3xl border border-pink-300/30 bg-zinc-950/65 p-8 text-center shadow-[0_0_70px_rgba(236,72,153,0.28)] backdrop-blur-md sm:p-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-4xl font-semibold text-pink-100 sm:text-6xl">
          З днем народження!
        </h1>

        <p className="mt-4 text-base leading-relaxed text-pink-100/85 sm:text-lg">
          Сьогодні все для тебе: теплі слова, світлі побажання та найніжніші
          спогади.
        </p>

        <motion.button
          type="button"
          className="mt-7 cursor-pointer rounded-2xl border border-pink-300/40 bg-pink-500/25 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-pink-100 outline-none transition-colors hover:bg-pink-500/35 focus-visible:ring-2 focus-visible:ring-pink-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:text-base"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
        >
          Перейти до побажань
        </motion.button>
      </motion.div>
    </div>
  )
}
