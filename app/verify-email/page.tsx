'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'

function VerifyEmailContent() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <div>
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Verifying Email</h1>
            <p className="mt-2 text-slate-400">Please wait while we verify your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Email Verified!</h1>
            <p className="mt-2 text-slate-300">{message}</p>
            <p className="mt-4 text-sm text-slate-500">Redirecting to your profile...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Verification Failed</h1>
            <p className="mt-2 text-slate-300">{message}</p>
            <button
              onClick={() => router.push('/employer/profile')}
              className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">Loading...</h1>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
