import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GalaxyBackground } from './components/GalaxyBackground'
import { IntroScreen } from './components/IntroScreen'
import { PreviewScreen } from './components/PreviewScreen'

function App() {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-black">
      <GalaxyBackground />

      <AnimatePresence initial={false} mode="wait">
        {isPreviewVisible ? (
          <motion.section
            key="preview"
            className="absolute inset-0 z-10"
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 1.01 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
          >
            <PreviewScreen />
          </motion.section>
        ) : (
          <motion.section
            key="intro"
            className="absolute inset-0 z-10"
            initial={{ opacity: 0, y: -12, scale: 1.01 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.99 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
          >
            <IntroScreen onContinue={() => setIsPreviewVisible(true)} />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
