import { prisma } from "@/lib/prisma"
import { ApproveJobButton, RejectJobButton } from "./actions"

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    include: {
      employer: {
        select: {
          companyName: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const pending = jobs.filter(j => j.status === 'pending')
  const active = jobs.filter(j => j.status === 'active')

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Management</h2>
      
      {/* Pending Jobs */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Approval ({pending.length})
          </h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {pending.map((job) => (
                <li key={job.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-600">{job.employer.companyName}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                        {job.location && <span>📍 {job.location}</span>}
                        {job.industry && <span>🏢 {job.industry}</span>}
                        {job.functionArea && <span>💼 {job.functionArea}</span>}
                      </div>
                      <p className="text-sm text-gray-700 mt-3 line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <ApproveJobButton jobId={job.id} />
                      <RejectJobButton jobId={job.id} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Active Jobs */}
      {active.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Active ({active.length})
          </h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {active.map((job) => (
                <li key={job.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-600">{job.employer.companyName}</p>
                    </div>
                    <span className="text-green-600 font-medium">✓ Active</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}