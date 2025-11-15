'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'

const setupSteps = [
  { id: 1, message: 'Creating secure account...', duration: 400 },
  { id: 2, message: 'Initializing security dashboard...', duration: 300 },
  { id: 3, message: 'Configuring vulnerability scanner...', duration: 350 },
  { id: 4, message: 'Setting up alert system...', duration: 300 },
  { id: 5, message: 'Connecting integration services...', duration: 350 },
  { id: 6, message: 'Generating API credentials...', duration: 400 },
  { id: 7, message: 'Finalizing setup...', duration: 400 },
]

export function SetupLoader({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    if (currentStep >= setupSteps.length) {
      setTimeout(onComplete, 800)
      return
    }

    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep])
      setCurrentStep((prev) => prev + 1)
    }, setupSteps[currentStep].duration)

    return () => clearTimeout(timer)
  }, [currentStep, onComplete])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://i.pinimg.com/originals/15/2a/c9/152ac925a89821541f304410fa6e3ee8.gif"
          alt="Vortex background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Setting Up Your Account</h2>
          <p className="text-base text-gray-200 drop-shadow-md">This will only take a moment...</p>
        </div>

        <div className="bg-black/60 backdrop-blur-md rounded-lg p-6 space-y-3 max-h-96 overflow-y-auto border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:300ms]">
          {setupSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(index)
            const isCurrent = currentStep === index
            const isPending = index > currentStep

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isPending ? 'opacity-40' : 'opacity-100'
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-cyan-400 animate-in zoom-in duration-300 drop-shadow-lg" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin drop-shadow-lg" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  )}
                </div>
                <p
                  className={`text-sm font-mono ${
                    isCompleted
                      ? 'text-cyan-400 drop-shadow-md'
                      : isCurrent
                      ? 'text-white font-semibold drop-shadow-md'
                      : 'text-gray-400'
                  }`}
                >
                  {step.message}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center animate-in fade-in duration-700 [animation-delay:600ms]">
          <div className="inline-flex items-center gap-2 text-base text-gray-200 drop-shadow-md">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
            <span>
              {currentStep < setupSteps.length
                ? `Step ${currentStep + 1} of ${setupSteps.length}`
                : 'Complete!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
