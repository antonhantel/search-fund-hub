'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
  showRequirements?: boolean
}

const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: 'At least 8 characters', regex: /.{8,}/ },
  { id: 'uppercase', label: 'At least one uppercase letter', regex: /[A-Z]/ },
  { id: 'lowercase', label: 'At least one lowercase letter', regex: /[a-z]/ },
  { id: 'number', label: 'At least one number', regex: /[0-9]/ },
]

export function PasswordStrength({ password, showRequirements = true }: PasswordStrengthProps) {
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong'>('weak')
  const [requirements, setRequirements] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const newRequirements: Record<string, boolean> = {}
    let metCount = 0

    PASSWORD_REQUIREMENTS.forEach((req) => {
      const isMet = req.regex.test(password)
      newRequirements[req.id] = isMet
      if (isMet) metCount++
    })

    setRequirements(newRequirements)

    if (metCount <= 1) setStrength('weak')
    else if (metCount <= 3) setStrength('medium')
    else setStrength('strong')
  }, [password])

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-200'
      case 'medium':
        return 'bg-yellow-200'
      case 'strong':
        return 'bg-green-200'
    }
  }

  const getStrengthText = () => {
    switch (strength) {
      case 'weak':
        return 'Weak'
      case 'medium':
        return 'Medium'
      case 'strong':
        return 'Strong'
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getStrengthColor()}`}
              style={{
                width: `${((Object.values(requirements).filter(Boolean).length) / PASSWORD_REQUIREMENTS.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <span className="text-sm font-medium text-slate-300 min-w-fit">{getStrengthText()}</span>
      </div>

      {showRequirements && (
        <div className="space-y-2 mt-4 pt-4 border-t border-slate-600">
          {PASSWORD_REQUIREMENTS.map((req) => (
            <div key={req.id} className="flex items-center gap-2">
              {requirements[req.id] ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
              )}
              <span className={`text-sm ${requirements[req.id] ? 'text-green-400' : 'text-slate-300'}`}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
