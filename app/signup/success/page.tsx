import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Account Created!</h1>
          <p className="text-slate-400">
            Your employer account has been created and is pending approval.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-left mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">What happens next?</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="text-white font-medium">Review in Progress</p>
                <p className="text-slate-400 text-sm">Our team will review your application</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="text-white font-medium">Email Notification</p>
                <p className="text-slate-400 text-sm">You'll receive an email once approved (usually &lt;24h)</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="text-white font-medium">Start Hiring</p>
                <p className="text-slate-400 text-sm">Post jobs and manage your recruiting pipeline</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Login
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
