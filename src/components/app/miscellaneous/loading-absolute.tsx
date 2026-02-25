'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles } from 'lucide-react'

interface LoadingAbsoluteProps {
  show?: boolean
  blurAmount?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
}

export const LoadingAbsolute = ({
  show,
  blurAmount = 'md',
  label = 'Cargando...'
}: LoadingAbsoluteProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          {/* Backdrop with high-end glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 bg-white/20 dark:bg-slate-950/40 backdrop-blur-${blurAmount} transition-all duration-700`}
          />

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 dark:bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Content Card - Ultra Premium */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative bg-white/70 dark:bg-slate-900/80 backdrop-blur-3xl p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 dark:border-slate-700/50 flex flex-col items-center max-w-sm w-full overflow-hidden"
          >
            {/* Decoration: Subtle Gradient Shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none translate-x-[-100%] animate-[shimmer_3s_infinite]" />

            {/* Premium Orbital Spinner */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[3px] border-transparent border-t-orange-500 border-l-orange-500/30 rounded-full"
              />

              {/* Middle Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-[3px] border-transparent border-t-rose-500 border-r-rose-500/30 rounded-full opacity-80"
              />

              {/* Inner Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-[3px] border-transparent border-t-purple-600 border-b-purple-600/30 rounded-full opacity-60"
              />

              {/* Core Glow */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-16 bg-gradient-to-br from-orange-400 to-rose-600 blur-xl rounded-full opacity-30"
              />

              {/* Core Icon */}
              <div className="relative z-10 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
                <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
              </div>

              {/* Orbiting Particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    rotate: { duration: 5 + i, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
                  }}
                  className="absolute inset-[-10px] pointer-events-none"
                >
                  <div
                    className={`w-2 h-2 rounded-full absolute top-0 left-1/2 -translate-x-1/2 ${i === 0 ? 'bg-orange-400' : i === 1 ? 'bg-rose-400' : 'bg-purple-400'
                      } blur-[1px] shadow-[0_0_10px_currentColor]`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Typography & Status */}
            <div className="text-center space-y-4 relative z-10 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                  Procesando
                </span>
              </div>

              <h3 className="text-3xl font-black bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent tracking-tight leading-tight">
                {label}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-[200px] mx-auto leading-relaxed opacity-80">
                Estamos personalizando tu experiencia en Eventify
              </p>
            </div>

            {/* Multi-layered Progress Indicator */}
            <div className="w-full mt-10 space-y-4">
              <div className="relative h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                />
              </div>

              <div className="flex justify-between items-center px-1">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-orange-400/50"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  EST. 2026
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
      `}</style>
    </AnimatePresence>
  )
}

