'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'

export const LANGUAGE_OPTIONS = [
  'German (Native)',
  'German (Fluent)',
  'German (Business)',
  'English (Native)',
  'English (Fluent)',
  'English (Business)',
  'French (Fluent)',
  'French (Business)',
  'Spanish (Fluent)',
  'Spanish (Business)',
]

interface LanguageRequirementsProps {
  selected?: string[]
  onChange: (languages: string[]) => void
}

export function LanguageRequirements({ selected = [], onChange }: LanguageRequirementsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleLanguage = (language: string) => {
    if (selected.includes(language)) {
      onChange(selected.filter(l => l !== language))
    } else {
      onChange([...selected, language])
    }
  }

  return (
    <div className="relative">
      <div className="space-y-2">
        {/* Selected languages display */}
        <div className="flex flex-wrap gap-2 min-h-10">
          {selected.map(language => (
            <span
              key={language}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              {language}
              <button
                type="button"
                onClick={() => toggleLanguage(language)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>

        {/* Dropdown button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
        >
          <span className="text-gray-700">
            {selected.length === 0 ? 'Select languages...' : `${selected.length} selected`}
          </span>
          <span className="text-gray-400">▼</span>
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="max-h-64 overflow-y-auto">
            {LANGUAGE_OPTIONS.map(language => (
              <label
                key={language}
                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(language)}
                  onChange={() => toggleLanguage(language)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                />
                <span className="ml-3 text-gray-700">{language}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
