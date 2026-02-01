'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LanguageRequirements } from '@/components/language-requirements'

// Function categories that make sense for Investors, Searchers & Operators
const FUNCTION_CATEGORIES = [
  { value: 'general-management', label: 'General Management / CEO' },
  { value: 'operations', label: 'Operations' },
  { value: 'finance', label: 'Finance / Controlling' },
  { value: 'strategy', label: 'Strategy & Business Development' },
  { value: 'sales', label: 'Sales / Commercial' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'HR / People' },
  { value: 'investment', label: 'Investment / Deal Team' },
  { value: 'portfolio', label: 'Portfolio Management' },
  { value: 'due-diligence', label: 'Due Diligence' },
  { value: 'tech', label: 'Technology / IT' },
  { value: 'product', label: 'Product Management' },
  { value: 'supply-chain', label: 'Supply Chain / Procurement' },
  { value: 'legal', label: 'Legal / Compliance' },
  { value: 'other', label: 'Other' },
]

interface EmployerData {
  industry?: string
  description?: string
  teamProfile?: string
}

export function JobForm({ employerId, employerData }: { employerId: string, employerData?: EmployerData }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [locationTags, setLocationTags] = useState<string[]>([])
  const [locationInput, setLocationInput] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    industry: employerData?.industry || '',
    functionArea: '',
    remoteAllowed: false,
    hybridAllowed: false,
    isFulltime: true,
    isParttime: false,
    parttimeHoursRange: '',
    startingDateAsap: true,
    startingDate: '',
    companyDescription: employerData?.description || '',
    teamProfile: employerData?.teamProfile || '',
  })

  // Fetch location suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (locationInput.length < 2) {
        setLocationSuggestions([])
        return
      }
      try {
        const response = await fetch(`/api/locations?q=${encodeURIComponent(locationInput)}`)
        if (response.ok) {
          const data = await response.json()
          setLocationSuggestions(data.locations || [])
        }
      } catch (err) {
        console.error('Failed to fetch location suggestions:', err)
      }
    }
    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [locationInput])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addLocationTag = (location: string) => {
    const trimmed = location.trim()
    if (trimmed && !locationTags.includes(trimmed)) {
      setLocationTags(prev => [...prev, trimmed])
    }
    setLocationInput('')
    setShowSuggestions(false)
  }

  const removeLocationTag = (location: string) => {
    setLocationTags(prev => prev.filter(t => t !== location))
  }

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && locationInput.trim()) {
      e.preventDefault()
      addLocationTag(locationInput)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, asDraft: boolean = false) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validation
    if (locationTags.length === 0 && !formData.remoteAllowed) {
      setError('Please add at least one location or mark as remote')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          employerId,
          isDraft: asDraft,
          location: locationTags,
          languageRequirements: selectedLanguages.length > 0 ? selectedLanguages : null,
          startingDate: formData.startingDateAsap ? null : formData.startingDate || null,
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to save job')
      }

      router.push('/employer/jobs')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 md:p-8 max-w-3xl">
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Private Equity Intern – Industrial Technology"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-200 mb-2">
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
          />
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-slate-200 mb-2">
            Requirements *
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Qualifications, skills, and experience required..."
          />
        </div>

        {/* Location with Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Location *
          </label>
          <div className="space-y-3">
            {/* Location Tags */}
            {locationTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {locationTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeLocationTag(tag)}
                      className="hover:text-blue-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Location Input */}
            <div className="relative">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value)
                  setShowSuggestions(true)
                }}
                onKeyDown={handleLocationKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type a city and press Enter..."
              />

              {/* Suggestions dropdown */}
              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {locationSuggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => addLocationTag(suggestion)}
                      className="w-full px-4 py-2 text-left text-white hover:bg-slate-600 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Remote & Hybrid checkboxes */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remoteAllowed"
                  checked={formData.remoteAllowed}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-slate-300">Remote possible</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="hybridAllowed"
                  checked={formData.hybridAllowed}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-slate-300">Hybrid possible</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Function */}
          <div>
            <label htmlFor="functionArea" className="block text-sm font-medium text-slate-200 mb-2">
              Function *
            </label>
            <select
              id="functionArea"
              name="functionArea"
              value={formData.functionArea}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a function...</option>
              {FUNCTION_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-slate-200 mb-2">
              Industry *
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Manufacturing, Technology"
            />
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Employment Type *
          </label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFulltime"
                  checked={formData.isFulltime}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-slate-300">Full-time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isParttime"
                  checked={formData.isParttime}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-slate-300">Part-time</span>
              </label>
            </div>

            {formData.isParttime && (
              <div>
                <label htmlFor="parttimeHoursRange" className="block text-sm text-slate-400 mb-1">
                  Hours per week
                </label>
                <input
                  type="text"
                  id="parttimeHoursRange"
                  name="parttimeHoursRange"
                  value={formData.parttimeHoursRange}
                  onChange={handleChange}
                  className="w-full md:w-64 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 15-20 hours"
                />
              </div>
            )}
          </div>
        </div>

        {/* Language Requirements */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Language Requirements
          </label>
          <LanguageRequirements
            selected={selectedLanguages}
            onChange={setSelectedLanguages}
          />
          <p className="text-xs text-slate-400 mt-2">Select the languages required for this position</p>
        </div>

        {/* Starting Date */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Starting Date *
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="startingDateAsap"
                checked={formData.startingDateAsap}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="text-slate-300">As soon as possible (ASAP)</span>
            </label>

            {!formData.startingDateAsap && (
              <div>
                <label htmlFor="startingDate" className="block text-sm text-slate-400 mb-1">
                  Preferred start date
                </label>
                <input
                  type="date"
                  id="startingDate"
                  name="startingDate"
                  value={formData.startingDate}
                  onChange={handleChange}
                  required={!formData.startingDateAsap}
                  className="w-full md:w-64 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
        </div>

        {/* Company Description */}
        <div>
          <label htmlFor="companyDescription" className="block text-sm font-medium text-slate-200 mb-2">
            Company Description *
          </label>
          <textarea
            id="companyDescription"
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your company, its mission, and what makes it unique..."
          />
        </div>

        {/* Team Profile */}
        <div>
          <label htmlFor="teamProfile" className="block text-sm font-medium text-slate-200 mb-2">
            Team Profile *
          </label>
          <textarea
            id="teamProfile"
            name="teamProfile"
            value={formData.teamProfile}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Introduce your team members by name and background. E.g., 'Our team includes John (ex-McKinsey), Sarah (10+ years in manufacturing), and Michael (founder of 2 previous startups)...'"
          />
          <p className="text-xs text-slate-400 mt-2">Tip: Name-dropping team members and their backgrounds helps candidates understand who they&apos;ll be working with</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Submit for Review'}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, true)}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white font-semibold rounded-lg transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </button>
      </div>
    </form>
  )
}
