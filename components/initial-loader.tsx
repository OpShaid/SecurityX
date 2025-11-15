'use client'

import { useEffect, useState } from 'react'

export function InitialLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 300)
          return 100
        }
        return Math.min(prev + 1, 100)
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://i.pinimg.com/originals/15/2a/c9/152ac925a89821541f304410fa6e3ee8.gif"
          alt="Vortex background"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 w-80 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center">
          <p className="text-4xl font-bold text-white mb-3 drop-shadow-lg">SecurityX</p>
          <p className="text-base text-gray-200 drop-shadow-md">Initializing security platform...</p>
        </div>
        
        <div className="relative h-3 bg-black/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/20">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-white tabular-nums drop-shadow-lg">{Math.floor(progress)}%</p>
        </div>
      </div>
    </div>
  )
}
