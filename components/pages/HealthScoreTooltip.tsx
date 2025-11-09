'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface TooltipProps {
  show: boolean
  onClose: () => void
}

export const HealthScoreTooltip = ({ show, onClose }: TooltipProps) => {
  const [currentTip, setCurrentTip] = useState(0)

  const tips = [
    {
      icon: '🌐',
      title: 'Interactive Globe',
      description: 'Drag to rotate, scroll to zoom. Explore your destination from every angle.',
    },
    {
      icon: '📊',
      title: 'Live Data Layers',
      description: 'Click layer buttons to isolate specific data. Weather, crowds, and safety.',
    },
    {
      icon: '✨',
      title: 'Real-Time Score',
      description: 'Watch as environmental data converges into your Health Score™ in real-time.',
    },
    {
      icon: '📡',
      title: 'Offline Ready',
      description: 'Works without internet using cached data. You\'ll see a yellow banner.',
    },
  ]

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (currentTip < tips.length - 1) {
          setCurrentTip(currentTip + 1)
        } else {
          handleClose()
        }
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [show, currentTip])

  const handleClose = () => {
    setCurrentTip(0)
    onClose()
  }

  const handleNext = () => {
    if (currentTip < tips.length - 1) {
      setCurrentTip(currentTip + 1)
    } else {
      handleClose()
    }
  }

  const handleSkip = () => {
    handleClose()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleSkip}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gradient-to-b from-[#0A1929] to-[#001520] border border-[#55DDCA]/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-6xl mb-4 text-center"
            >
              {tips[currentTip].icon}
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-[#55DDCA] mb-3 text-center"
            >
              {tips[currentTip].title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-center mb-6 leading-relaxed"
            >
              {tips[currentTip].description}
            </motion.p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {tips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTip(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTip
                      ? 'bg-[#55DDCA] w-8'
                      : index < currentTip
                        ? 'bg-[#55DDCA]/50'
                        : 'bg-white/20'
                  }`}
                  aria-label={`Go to tip ${index + 1}`}
                />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all duration-300"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2 rounded-lg bg-[#55DDCA] text-[#0A1929] font-medium hover:bg-[#55DDCA]/90 transition-all duration-300"
              >
                {currentTip === tips.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to manage first-time visit
export const useHealthScoreTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('healthScoreTooltipSeen')

    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true)
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseTooltip = () => {
    setShowTooltip(false)
    localStorage.setItem('healthScoreTooltipSeen', 'true')
  }

  return { showTooltip, handleCloseTooltip }
}
