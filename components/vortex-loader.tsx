'use client'

import { useEffect, useState } from 'react'

export function VortexLoader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://i.pinimg.com/originals/15/2a/c9/152ac925a89821541f304410fa6e3ee8.gif"
          alt="Vortex background"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 [animation-delay:300ms]">
        <p className="text-3xl font-bold text-white mb-4 animate-pulse drop-shadow-lg">
          Loading SecurityX
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms] shadow-lg shadow-cyan-400/50" />
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms] shadow-lg shadow-blue-400/50" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms] shadow-lg shadow-purple-400/50" />
        </div>
      </div>
    </div>
  )
}
