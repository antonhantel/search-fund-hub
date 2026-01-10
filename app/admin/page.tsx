import { prisma } from "@/lib/prisma"
import { AdminActions } from "./admin-actions"

export default async function AdminDashboard() {
  let stats
  try {
    stats = await Promise.all([
      prisma.employer.count({ where: { status: 'pending' } }),
      prisma.employer.count({ where: { status: 'approved' } }),
      prisma.job.count({ where: { status: 'pending' } }),
      prisma.job.count({ where: { status: 'active' } }),
    ])
  } catch (error) {
    console.error('Error fetching stats:', error)
    stats = [0, 0, 0, 0]
  }

  const [pendingEmployers, approvedEmployers, pendingJobs, activeJobs] = stats

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

      {/* Admin Tools */}
      <div className="mb-6">
        <AdminActions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">
                  Pending Employers
                </p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {pendingEmployers}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-yellow-500 text-4xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">
                  Approved Employers
                </p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {approvedEmployers}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-green-500 text-4xl">✓</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">
                  Pending Jobs
                </p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {pendingJobs}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-yellow-500 text-4xl">📋</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">
                  Active Jobs
                </p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {activeJobs}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-green-500 text-4xl">💼</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
