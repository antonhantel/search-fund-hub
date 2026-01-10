'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'

export default function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const token = searchParams.get('token')
        const newEmail = searchParams.get('email')

        if (!token || !newEmail) {
          setStatus('error')
          setMessage('Invalid verification link')
          return
        }

        // In a real application, you would validate the token on the server
        // and update the email address
        // For now, this is a placeholder

        setStatus('success')
        setMessage('Your email has been verified successfully!')

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/employer/profile')
        }, 3000)
      } catch (error) {
        setStatus('error')
        setMessage('Failed to verify email. Please try again.')
      }
    }

    verify()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <div>
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Verifying Email</h1>
            <p className="mt-2 text-gray-600">Please wait while we verify your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Email Verified!</h1>
            <p className="mt-2 text-gray-600">{message}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting to your profile...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verification Failed</h1>
            <p className="mt-2 text-gray-600">{message}</p>
            <button
              onClick={() => router.push('/employer/profile')}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              Back to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
