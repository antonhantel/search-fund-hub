import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function EmployerDashboard() {
  const session = await auth()
  
  if (!session?.user?.employerId) {
    redirect('/login')
  }

  const employer = await prisma.employer.findUnique({
    where: { id: session.user.employerId },
    include: {
      jobs: true
    }
  })

  if (!employer) {
    redirect('/login')
  }

  const jobStats = {
    draft: employer.jobs.filter(j => j.status === 'draft').length,
    pending: employer.jobs.filter(j => j.status === 'pending').length,
    active: employer.jobs.filter(j => j.status === 'active').length,
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
        <p className="text-gray-600 mt-1">{employer.companyName}</p>
        
        {employer.status === 'pending' && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-800">
              ⏳ Your employer account is pending approval. You can create job drafts, but they won&apos;t be published until your account is approved.
            </p>
          </div>
        )}
        
        {employer.status === 'approved' && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800">
              ✓ Your employer account is approved! You can now post jobs.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Draft Jobs</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {jobStats.draft}
                </p>
              </div>
              <span className="text-gray-400 text-4xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {jobStats.pending}
                </p>
              </div>
              <span className="text-yellow-500 text-4xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {jobStats.active}
                </p>
              </div>
              <span className="text-green-500 text-4xl">✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}