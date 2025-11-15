'use client'

import { useEffect, useState } from 'react'
import { VortexLoader } from './vortex-loader'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <VortexLoader />
  }

  return (
    <div className="animate-in fade-in duration-500">
      {children}
    </div>
  )
}
