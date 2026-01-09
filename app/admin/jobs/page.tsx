import { prisma } from "@/lib/prisma"
import { ApproveJobButton, RejectJobButton } from "./actions"
import Link from "next/link"

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
  const other = jobs.filter(j => j.status !== 'pending' && j.status !== 'active')

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Management</h2>
      
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
                        {job.languageRequirements && <span>🌐 {job.languageRequirements}</span>}
                      </div>
                      <p className="text-sm text-gray-700 mt-3 line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </Link>
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

      {active.length > 0 && (
        <div className="mb-8">
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
                    <div className="flex gap-2 items-center">
                      <span className="text-green-600 font-medium">✓ Active</span>
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {other.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Other ({other.length})
          </h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {other.map((job) => (
                <li key={job.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-600">{job.employer.companyName}</p>
                      <p className="text-xs text-gray-500 mt-1">Status: {job.status}</p>
                    </div>
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {pending.length === 0 && active.length === 0 && other.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No jobs found</p>
        </div>
      )}
    </div>
  )
}
