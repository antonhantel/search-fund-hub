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
  linkedinUrl?: string | null
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
          linkedinUrl: formData.get('linkedinUrl'),
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
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="bg-slate-800/50 rounded-xl p-8 space-y-4">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!employer) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl p-4">
          Failed to load profile. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Company Profile</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl">
          {success}
        </div>
      )}

      {/* Company Info Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 md:p-8 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Company Information</h2>
        
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                defaultValue={employer.companyName}
                required
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-1">
                Industry
              </label>
              <select
                name="industry"
                id="industry"
                defaultValue={employer.industry || ''}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Industry</option>
                {INDUSTRY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-slate-300 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                id="website"
                defaultValue={employer.website || ''}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourcompany.com"
              />
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-slate-300 mb-1">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </span>
                <input
                  type="url"
                  name="linkedinUrl"
                  id="linkedinUrl"
                  defaultValue={employer.linkedinUrl || ''}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Displayed on your job listings
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
              Company Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              defaultValue={employer.description || ''}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell candidates about your search fund..."
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Email Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 md:p-8 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Email Address</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Current Email</p>
            <p className="text-lg font-medium text-white">{employer.user.email}</p>
          </div>
          <button
            type="button"
            disabled
            className="px-4 py-2 border border-slate-600 text-slate-500 rounded-lg cursor-not-allowed opacity-50"
            title="Email change functionality coming soon"
          >
            Change Email
          </button>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-2">
              <PasswordStrength password={passwordForm.newPassword} />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
