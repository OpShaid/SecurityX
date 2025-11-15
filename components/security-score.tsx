'use client'

import { Shield, TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'

export function SecurityScore() {
  const [score, setScore] = useState(0)
  const [displayScore, setDisplayScore] = useState(0)
  
  useEffect(() => {
    // Calculate security score based on various factors
    const targetScore = 87 // Would be calculated from real data
    setScore(targetScore)
    
    // Animate score counting up
    let current = 0
    const increment = targetScore / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= targetScore) {
        setDisplayScore(targetScore)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(current))
      }
    }, 20)
    
    return () => clearInterval(timer)
  }, [])
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }
  
  const getScoreRing = (score: number) => {
    const circumference = 2 * Math.PI * 45
    const offset = circumference - (score / 100) * circumference
    
    return { circumference, offset }
  }
  
  const { circumference, offset } = getScoreRing(displayScore)
  
  return (
    <Card className="glass border-border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Security Score
      </h3>
      
      <div className="flex items-center justify-between">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-secondary/30"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className={getScoreColor(displayScore)}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.5s ease-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(displayScore)}`}>
              {displayScore}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
        
        <div className="flex-1 ml-6 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground">+5 from last week</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Vulnerabilities</span>
              <span className="text-foreground font-semibold">3 found</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last Scan</span>
              <span className="text-foreground font-semibold">2 hours ago</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Integrations</span>
              <span className="text-foreground font-semibold">2 active</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
