import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EmployerDashboard() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  let employerId = session.user?.employerId

  if (!employerId && session.user?.email) {
    const maybe = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (maybe) employerId = maybe.id
  }

  if (!employerId) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">No Employer Account Linked</h2>
        <p className="text-slate-400">Your user is authenticated but no employer profile is attached. Please contact support.</p>
      </div>
    )
  }

  const employer = await prisma.employer.findUnique({
    where: { id: employerId },
    include: { jobs: true }
  })

  if (!employer) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">❌</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Employer Account Not Found</h2>
        <p className="text-slate-400">We couldn't find your employer account. Please contact support.</p>
      </div>
    )
  }

  const jobStats = {
    draft: employer.jobs.filter(j => j.status === 'draft').length,
    pending: employer.jobs.filter(j => j.status === 'pending').length,
    active: employer.jobs.filter(j => j.status === 'active').length,
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Welcome back, {employer.companyName}!</h2>
        <p className="text-slate-400 mt-2">Manage your job postings and applicants from here.</p>
        
        {employer.status === 'pending' && (
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-400 font-medium flex items-center gap-2">
              <span>⏳</span> Your employer account is pending approval
            </p>
            <p className="text-yellow-400/70 text-sm mt-1">
              You can create job drafts, but they won't be published until your account is approved by our admin team.
            </p>
          </div>
        )}
        
        {employer.status === 'approved' && (
          <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-green-400 font-medium flex items-center gap-2">
              <span>✓</span> Your employer account is approved
            </p>
            <p className="text-green-400/70 text-sm mt-1">
              You can now post jobs and they'll be visible to job seekers immediately.
            </p>
          </div>
        )}

        {employer.status === 'rejected' && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 font-medium flex items-center gap-2">
              <span>✗</span> Your employer account was rejected
            </p>
            <p className="text-red-400/70 text-sm mt-1">
              Please contact support for more information.
            </p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Draft Jobs</p>
              <p className="mt-2 text-4xl font-bold text-white">
                {jobStats.draft}
              </p>
              <p className="text-xs text-slate-500 mt-2">Ready to publish</p>
            </div>
            <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Pending Review</p>
              <p className="mt-2 text-4xl font-bold text-yellow-400">
                {jobStats.pending}
              </p>
              <p className="text-xs text-slate-500 mt-2">Awaiting approval</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Jobs</p>
              <p className="mt-2 text-4xl font-bold text-green-400">
                {jobStats.active}
              </p>
              <p className="text-xs text-slate-500 mt-2">Currently published</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/employer/jobs/new"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
            >
              <span>+</span> Post a New Job
            </Link>
            <Link
              href="/employer/jobs"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              View All My Jobs
            </Link>
            <Link
              href="/employer/applications"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              📋 Applicant Pipeline
            </Link>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tips</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">💡</span>
              <span>Add a LinkedIn profile to your company to build trust with candidates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">💡</span>
              <span>Detailed job descriptions get 3x more qualified applicants</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">💡</span>
              <span>Use the Pipeline feature to track candidates through your hiring process</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
