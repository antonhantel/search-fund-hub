'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JobForm({ employerId }: { employerId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDraft, setIsDraft] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    industry: '',
    employmentType: 'full-time',
    salary: '',
    externalUrl: '',
    function: ''
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
          isDraft: asDraft
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Senior React Developer"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Job description, requirements, and responsibilities..."
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
            Industry *
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Technology, Finance"
          />
        </div>

        {/* Function */}
        <div>
          <label htmlFor="function" className="block text-sm font-medium text-gray-700 mb-2">
            Function *
          </label>
          <input
            type="text"
            id="function"
            name="function"
            value={formData.function}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Engineering, Sales"
          />
        </div>

        {/* Employment Type */}
        <div>
          <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type *
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="intern">Internship</option>
          </select>
        </div>

        {/* Salary */}
        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., $80,000 - $120,000"
          />
        </div>

        {/* External URL */}
        <div>
          <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Application URL
          </label>
          <input
            type="url"
            id="externalUrl"
            name="externalUrl"
            value={formData.externalUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://careers.company.com/apply"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post Job'}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e as any, true)}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-semibold rounded-lg transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </button>
      </div>
    </form>
  )
}
