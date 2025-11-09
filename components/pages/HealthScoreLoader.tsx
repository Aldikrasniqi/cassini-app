'use client'

import { motion } from 'framer-motion'

export const HealthScoreLoader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0A1929] via-[#001520] to-black">
      <div className="text-center">
        <motion.div
          className="relative w-24 h-24 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-[#55DDCA]/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-t-4 border-r-4 border-[#55DDCA]"
            animate={{
              boxShadow: [
                '0 0 20px rgba(85,221,202,0.3)',
                '0 0 40px rgba(85,221,202,0.6)',
                '0 0 20px rgba(85,221,202,0.3)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[#55DDCA] font-medium mb-2">Initializing Health Score™</p>
          <p className="text-gray-400 text-sm">Loading environmental data...</p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#55DDCA]"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
