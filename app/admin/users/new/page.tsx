'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { INDUSTRY_OPTIONS } from '@/lib/constants'
import { Copy, Check } from 'lucide-react'

export default function CreateUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [tempPassword, setTempPassword] = useState<string | null>(null)
  const [createdEmail, setCreatedEmail] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email'),
      companyName: formData.get('companyName'),
      industry: formData.get('industry') || null,
      website: formData.get('website') || null,
      description: formData.get('description') || null,
      autoApprove: formData.get('autoApprove') === 'on'
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user')
      }

      const result = await response.json()
      setTempPassword(result.temporaryPassword)
      setCreatedEmail(result.email)
      setSuccess(true)
      e.currentTarget.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (tempPassword) {
      await navigator.clipboard.writeText(tempPassword)
      setCopiedPassword(true)
      setTimeout(() => setCopiedPassword(false), 2000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Employer Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                disabled={success}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="employer@company.de"
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
                disabled={success}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-900">
                Industry
              </label>
              <select
                name="industry"
                id="industry"
                disabled={success}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
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
                disabled={success}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="https://company.de"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                disabled={success}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Company description"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="autoApprove"
                id="autoApprove"
                defaultChecked
                disabled={success}
                className="rounded border-gray-300"
              />
              <label htmlFor="autoApprove" className="ml-2 block text-sm text-gray-900">
                Auto-approve this employer
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Creating...' : success ? 'Account Created' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Success Message */}
        {success && tempPassword && createdEmail && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-900">Account Created!</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Email Address:</p>
                <p className="font-mono text-green-900 break-all">{createdEmail}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Temporary Password (Copy Now)</p>
                <p className="text-sm text-yellow-900 mb-3">
                  This password will only be displayed once. The user should change it immediately upon first login.
                </p>
                <div className="flex items-center gap-2 bg-white border border-yellow-300 rounded p-3 font-mono text-yellow-900">
                  <span className="flex-1 select-all">{tempPassword}</span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="flex-shrink-0 p-2 hover:bg-yellow-100 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedPassword ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-yellow-700" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 mb-3">
                  <strong>Next Steps:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-blue-900 space-y-1">
                  <li>Share the temporary password with the user securely</li>
                  <li>User should login and change password immediately</li>
                  <li>User can then start posting job openings</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSuccess(false)
                  setTempPassword(null)
                  setCreatedEmail(null)
                }}
                className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 font-medium"
              >
                Create Another Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
