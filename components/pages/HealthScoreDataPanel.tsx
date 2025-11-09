'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface DataPanelProps {
  layerData: {
    weather: number
    crowd: number
    safety: number
  }
  healthScore: number
  isOffline: boolean
}

export const HealthScoreDataPanel = ({ layerData, healthScore, isOffline }: DataPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const getStatusLabel = (value: number, type: 'weather' | 'crowd' | 'safety') => {
    if (type === 'weather') {
      if (value >= 80) return 'Clear conditions'
      if (value >= 60) return 'Mostly favorable'
      if (value >= 40) return 'Variable conditions'
      return 'Adverse weather'
    }

    if (type === 'crowd') {
      if (value >= 80) return 'Extremely crowded'
      if (value >= 60) return 'High density'
      if (value >= 40) return 'Moderate activity'
      return 'Low density'
    }

    // safety
    if (value >= 80) return 'Secure'
    if (value >= 60) return 'Generally safe'
    if (value >= 40) return 'Caution advised'
    return 'High risk'
  }

  const getBarColor = (value: number, type: 'weather' | 'crowd' | 'safety') => {
    if (type === 'weather') return '#55DDCA'

    if (type === 'crowd') {
      if (value >= 70) return '#F87171'
      if (value >= 40) return '#FBBF24'
      return '#34D399'
    }

    // safety
    if (value >= 75) return '#34D399'
    if (value >= 45) return '#FBBF24'
    return '#F87171'
  }

  return (
    <div className="fixed top-20 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative"
      >
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className="absolute -left-12 top-0 w-10 h-10 rounded-l-lg bg-white/5 border border-r-0 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
          aria-label={isExpanded ? 'Hide data panel' : 'Show data panel'}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-[#55DDCA]"
          >
            {isExpanded ? '→' : '←'}
          </motion.div>
        </button>

        {/* Data Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-[#55DDCA] font-semibold text-lg mb-1">Live Metrics</h3>
                  <p className="text-gray-400 text-xs">
                    {isOffline ? 'Cached data' : 'Real-time monitoring'}
                  </p>
                </div>

                {/* Composite Score */}
                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-[#55DDCA]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Health Score™</span>
                    <motion.span
                      key={healthScore}
                      initial={{ scale: 1.2, color: '#55DDCA' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold"
                    >
                      {healthScore}
                    </motion.span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${healthScore}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          healthScore >= 75
                            ? 'linear-gradient(90deg, #34D399, #10B981)'
                            : healthScore >= 50
                              ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                              : 'linear-gradient(90deg, #F87171, #EF4444)',
                      }}
                    />
                  </div>
                </div>

                {/* Individual Metrics */}
                <div className="space-y-4">
                  {/* Weather */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getBarColor(layerData.weather, 'weather') }}
                        />
                        <span className="text-gray-300 text-sm">Weather</span>
                      </div>
                      <span className="text-white font-medium text-sm">{layerData.weather}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${layerData.weather}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: getBarColor(layerData.weather, 'weather') }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {getStatusLabel(layerData.weather, 'weather')}
                    </p>
                  </div>

                  {/* Crowd Density */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getBarColor(layerData.crowd, 'crowd') }}
                        />
                        <span className="text-gray-300 text-sm">Crowd Density</span>
                      </div>
                      <span className="text-white font-medium text-sm">{layerData.crowd}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${layerData.crowd}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: getBarColor(layerData.crowd, 'crowd') }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {getStatusLabel(layerData.crowd, 'crowd')}
                    </p>
                  </div>

                  {/* Safety Index */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getBarColor(layerData.safety, 'safety') }}
                        />
                        <span className="text-gray-300 text-sm">Safety Index</span>
                      </div>
                      <span className="text-white font-medium text-sm">{layerData.safety}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${layerData.safety}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: getBarColor(layerData.safety, 'safety') }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {getStatusLabel(layerData.safety, 'safety')}
                    </p>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 text-center">
                    {isOffline ? 'Last sync: Offline mode' : `Updated ${new Date().toLocaleTimeString()}`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
