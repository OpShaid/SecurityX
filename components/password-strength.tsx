'use client'

import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })
  
  useEffect(() => {
    const newChecks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }
    
    setChecks(newChecks)
    
    const score = Object.values(newChecks).filter(Boolean).length
    setStrength((score / 5) * 100)
  }, [password])
  
  if (!password) return null
  
  const getStrengthColor = () => {
    if (strength >= 80) return 'bg-green-500'
    if (strength >= 60) return 'bg-yellow-500'
    if (strength >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }
  
  const getStrengthText = () => {
    if (strength >= 80) return 'Strong'
    if (strength >= 60) return 'Good'
    if (strength >= 40) return 'Fair'
    return 'Weak'
  }
  
  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full ${getStrengthColor()} transition-all duration-300`}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {getStrengthText()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center gap-1 ${checks.length ? 'text-green-500' : 'text-muted-foreground'}`}>
          {checks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>8+ characters</span>
        </div>
        <div className={`flex items-center gap-1 ${checks.uppercase ? 'text-green-500' : 'text-muted-foreground'}`}>
          {checks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Uppercase</span>
        </div>
        <div className={`flex items-center gap-1 ${checks.lowercase ? 'text-green-500' : 'text-muted-foreground'}`}>
          {checks.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Lowercase</span>
        </div>
        <div className={`flex items-center gap-1 ${checks.number ? 'text-green-500' : 'text-muted-foreground'}`}>
          {checks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Number</span>
        </div>
        <div className={`flex items-center gap-1 ${checks.special ? 'text-green-500' : 'text-muted-foreground'}`}>
          {checks.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Special char</span>
        </div>
      </div>
    </div>
  )
}
