'use client'

import { useState, useEffect } from 'react'
import { InitialLoader } from '@/components/initial-loader'

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Check if user has already seen the loader
    const loaded = sessionStorage.getItem('securityx_loaded')
    if (loaded) {
      setShowLoader(false)
      setHasLoaded(true)
    }
  }, [])

  const handleLoaderComplete = () => {
    sessionStorage.setItem('securityx_loaded', 'true')
    setShowLoader(false)
    setHasLoaded(true)
  }

  return (
    <>
      {showLoader && !hasLoaded && <InitialLoader onComplete={handleLoaderComplete} />}
      
      <div className={showLoader && !hasLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        {children}
      </div>
    </>
  )
}
