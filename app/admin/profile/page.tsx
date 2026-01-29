'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { PasswordStrength } from '@/components/password-strength'

export default function AdminProfilePage() {
  const { data: session } = useSession()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Profile</h1>

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

      {/* Email Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 md:p-8 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Email Address</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Current Email</p>
            <p className="text-lg font-medium text-white">{session?.user?.email || 'Loading...'}</p>
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
