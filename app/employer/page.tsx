import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function EmployerDashboard() {
  const session = await auth()
  
  // Session check is done by layout/middleware, so we should have a valid session here
  if (!session?.user?.employerId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Employer Account Found</h2>
        <p className="text-gray-600">Please contact support to set up your employer account.</p>
      </div>
    )
  }

  const employer = await prisma.employer.findUnique({
    where: { id: session.user.employerId },
    include: {
      jobs: true
    }
  })

  if (!employer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Employer Account Not Found</h2>
        <p className="text-gray-600">We couldn't find your employer account. Please contact support.</p>
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
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {employer.companyName}!</h2>
        <p className="text-gray-600 mt-2">Manage your job postings and applicants from here.</p>
        
        {employer.status === 'pending' && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">
              ⏳ Your employer account is pending approval
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              You can create job drafts, but they won&apos;t be published until your account is approved by our admin team.
            </p>
          </div>
        )}
        
        {employer.status === 'approved' && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              ✓ Your employer account is approved
            </p>
            <p className="text-green-700 text-sm mt-1">
              You can now post jobs and they&apos;ll be visible to job seekers immediately.
            </p>
          </div>
        )}

        {employer.status === 'rejected' && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">
              ✗ Your employer account was rejected
            </p>
            <p className="text-red-700 text-sm mt-1">
              Please contact support for more information.
            </p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Draft Jobs</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">
                  {jobStats.draft}
                </p>
                <p className="text-xs text-gray-500 mt-2">Ready to publish</p>
              </div>
              <span className="text-5xl opacity-10">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="mt-2 text-4xl font-bold text-yellow-600">
                  {jobStats.pending}
                </p>
                <p className="text-xs text-gray-500 mt-2">Awaiting approval</p>
              </div>
              <span className="text-5xl opacity-10">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <p className="mt-2 text-4xl font-bold text-green-600">
                  {jobStats.active}
                </p>
                <p className="text-xs text-gray-500 mt-2">Currently published</p>
              </div>
              <span className="text-5xl opacity-10">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Link
            href="/employer/jobs/new"
            className="block px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            + Post a New Job
          </Link>
          <Link
            href="/employer/jobs"
            className="block px-4 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors text-center"
          >
            View All My Jobs
          </Link>
        </div>
      </div>
    </div>
  )
}