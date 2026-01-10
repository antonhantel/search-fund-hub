'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { INDUSTRY_OPTIONS } from '@/lib/constants'
import { PasswordStrength } from '@/components/password-strength'

interface EmployerData {
  id: string
  companyName: string
  industry?: string | null
  website?: string | null
  description?: string | null
  user: {
    email: string
  }
}

export default function EmployerProfilePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [employer, setEmployer] = useState<EmployerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        const response = await fetch('/api/employer/profile')
        if (!response.ok) throw new Error('Failed to load profile')
        const data = await response.json()
        setEmployer(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployer()
  }, [])

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/employer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.get('companyName'),
          industry: formData.get('industry'),
          website: formData.get('website'),
          description: formData.get('description')
        })
      })

      if (!response.ok) throw new Error('Failed to update profile')

      setSuccess('Profile updated successfully')
      const updated = await response.json()
      setEmployer(prev => prev ? { ...prev, ...updated } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch('/api/user/password/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update password')
      }

      setSuccess('Password updated successfully')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="bg-white rounded-2xl p-8 space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!employer) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4">
          Failed to load profile. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Company Profile</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {/* Company Info Card */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
        
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-900">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              defaultValue={employer.companyName}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-900">
              Industry
            </label>
            <select
              name="industry"
              id="industry"
              defaultValue={employer.industry || ''}
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
              defaultValue={employer.website || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
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
              defaultValue={employer.description || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Email Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Address</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Email</p>
            <p className="text-lg font-medium text-gray-900">{employer.user.email}</p>
          </div>
          <button
            type="button"
            disabled
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md bg-gray-50 cursor-not-allowed opacity-50"
            title="Email change functionality coming soon"
          >
            Change Email
          </button>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-900">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            />
            <div className="mt-3">
              <PasswordStrength password={passwordForm.newPassword} />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
