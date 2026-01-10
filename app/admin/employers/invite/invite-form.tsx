'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { INDUSTRY_OPTIONS } from '@/lib/constants'

export function InviteForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email'),
      companyName: formData.get('companyName'),
      industry: formData.get('industry'),
      website: formData.get('website'),
      description: formData.get('description'),
      autoApprove: formData.get('autoApprove') === 'on',
    }

    try {
      const response = await fetch('/api/admin/employers/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create employer')
      }

      const result = await response.json()
      alert(`Employer created successfully!\n\nEmail: ${result.email}\nPassword: ${result.password}\n\nPlease save these credentials and share them with the employer.`)
      router.push('/admin/employers')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            placeholder="employer@company.com"
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-900">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-900">
            Industry
          </label>
          <select
            name="industry"
            id="industry"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          >
            <option value="">Select Industry</option>
            {INDUSTRY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-900">
            Website
          </label>
          <input
            type="url"
            name="website"
            id="website"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            placeholder="https://company.com"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            placeholder="Brief company description..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="autoApprove"
            id="autoApprove"
            defaultChecked
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="autoApprove" className="ml-2 block text-sm text-gray-900">
            Auto-approve employer (set status to &quot;approved&quot;)
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Creating...' : 'Create Employer'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
