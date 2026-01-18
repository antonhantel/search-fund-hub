'use client'

import { useState } from 'react'

export const LANGUAGE_OPTIONS = [
  'German',
  'English', 
  'French',
  'Spanish',
  'Italian',
  'Dutch',
  'Portuguese',
]

interface LanguageRequirementsProps {
  selected?: string[]
  onChange: (languages: string[]) => void
}

export function LanguageRequirements({ selected = [], onChange }: LanguageRequirementsProps) {
  const toggleLanguage = (language: string) => {
    if (selected.includes(language)) {
      onChange(selected.filter(l => l !== language))
    } else {
      onChange([...selected, language])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {LANGUAGE_OPTIONS.map(language => (
        <button
          key={language}
          type="button"
          onClick={() => toggleLanguage(language)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected.includes(language)
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700'
          }`}
        >
          {language}
          {selected.includes(language) && (
            <span className="ml-2">✓</span>
          )}
        </button>
      ))}
    </div>
  )
}
