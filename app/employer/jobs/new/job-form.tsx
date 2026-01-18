'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LanguageRequirements } from '@/components/language-requirements'

export function JobForm({ employerId }: { employerId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    industry: '',
    employmentType: 'full-time',
    salary: '',
    externalUrl: '',
    function: '',
    requirements: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, asDraft: boolean = false) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          employerId,
          isDraft: asDraft,
          languageRequirements: selectedLanguages.length > 0 ? selectedLanguages : null
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
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Job description, about the company, the opportunity..."
          />
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-slate-200 mb-2">
            Requirements
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Qualifications, skills, and experience required..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-200 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Berlin, Remote"
            />
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
              placeholder="e.g., Technology, Finance"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Function */}
          <div>
            <label htmlFor="function" className="block text-sm font-medium text-slate-200 mb-2">
              Function *
            </label>
            <input
              type="text"
              id="function"
              name="function"
              value={formData.function}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Operations, Strategy"
            />
          </div>

          {/* Employment Type */}
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-slate-200 mb-2">
              Employment Type *
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="intern">Internship</option>
            </select>
          </div>
        </div>

        {/* Salary */}
        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-slate-200 mb-2">
            Salary Range
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., €50,000 - €80,000"
          />
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

        {/* External URL */}
        <div>
          <label htmlFor="externalUrl" className="block text-sm font-medium text-slate-200 mb-2">
            Application URL
          </label>
          <input
            type="url"
            id="externalUrl"
            name="externalUrl"
            value={formData.externalUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://careers.company.com/apply"
          />
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
          onClick={(e) => handleSubmit(e as any, true)}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white font-semibold rounded-lg transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </button>
      </div>
    </form>
  )
}
