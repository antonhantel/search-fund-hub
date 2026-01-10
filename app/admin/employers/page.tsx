import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminEmployersPage() {
  const employers = await prisma.employer.findMany({
    include: {
      user: true,
      _count: { select: { jobs: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  const pending = employers.filter(e => e.status === 'pending')
  const approved = employers.filter(e => e.status === 'approved')
  const rejected = employers.filter(e => e.status === 'rejected')

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Employer Management</h2>

      {/* Pending Employers */}
      {pending.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Approval ({pending.length})
          </h3>
          <div className="space-y-4">
            {pending.map(employer => (
              <div key={employer.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{employer.companyName}</h4>
                    <p className="text-sm text-gray-600 mb-1">Contact: {employer.user?.email}</p>
                    {employer.industry && <p className="text-sm text-gray-600 mb-1">Industry: {employer.industry}</p>}
                    <p className="text-sm text-gray-500">Jobs Posted: {employer._count.jobs}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <Link
                      href={`/admin/employers/${employer.id}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Employers */}
      {approved.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Approved ({approved.length})
          </h3>
          <div className="space-y-4">
            {approved.map(employer => (
              <div key={employer.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{employer.companyName}</h4>
                    <p className="text-sm text-gray-600 mb-1">Contact: {employer.user?.email}</p>
                    <p className="text-sm text-gray-500">Jobs Posted: {employer._count.jobs}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">✓ Approved</span>
                    <Link
                      href={`/admin/employers/${employer.id}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected Employers */}
      {rejected.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Rejected ({rejected.length})
          </h3>
          <div className="space-y-4">
            {rejected.map(employer => (
              <div key={employer.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{employer.companyName}</h4>
                    <p className="text-sm text-gray-600 mb-1">Contact: {employer.user?.email}</p>
                    <p className="text-sm text-gray-500">Jobs Posted: {employer._count.jobs}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">✗ Rejected</span>
                    <Link
                      href={`/admin/employers/${employer.id}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pending.length === 0 && approved.length === 0 && rejected.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No employers found</p>
        </div>
      )}
    </div>
  )
}
