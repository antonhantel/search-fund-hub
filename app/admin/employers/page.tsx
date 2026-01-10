import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminEmployersPage() {
  const employers = await prisma.employer.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Employers</h2>
      </div>

      <div className="grid gap-4">
        {employers.map((e) => (
          <div key={e.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{e.companyName}</h3>
                <p className="text-sm text-gray-600 mt-1">{e.industry}</p>
                <p className="text-sm text-gray-500 mt-2">{e.contactEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/employers/${e.id}`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">Edit</Link>
                <Link href="#" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">Approve</Link>
                <Link href="#" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">Reject</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
import { prisma } from "@/lib/prisma"
import { ApproveEmployerButton, RejectEmployerButton } from "./actions"
import Link from "next/link"

export default async function EmployersPage() {
  const employers = await prisma.employer.findMany({
    include: {
      user: {
        select: { email: true }
      },
      _count: {
        select: { jobs: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const pending = employers.filter(e => e.status === 'pending')
  const approved = employers.filter(e => e.status === 'approved')
  const rejected = employers.filter(e => e.status === 'rejected')

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Employer Management</h2>
      
      {/* Pending Employers */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Approval ({pending.length})
          </h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {pending.map((employer) => (
                <li key={employer.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {employer.firstName && employer.lastName 
                          ? `${employer.firstName} ${employer.lastName}`
                          : employer.companyName
                        }
                      </h4>
                      <p className="text-sm text-gray-500">{employer.user.email}</p>
                      <p className="text-sm text-gray-600 mt-1">{employer.companyName}</p>
                      <p className="text-xs text-gray-500 mt-1">Jobs Posted: {employer._count.jobs}</p>
                      {employer.industry && (
                        <p className="text-sm text-gray-600 mt-1">Industry: {employer.industry}</p>
                      )}
                      {employer.website && (
                        <a 
                          href={employer.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                        >
                          {employer.website}
                        </a>
                      )}
                      {employer.description && (
                        <p className="text-sm text-gray-700 mt-2">{employer.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/admin/employers/${employer.id}`}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </Link>
                      <ApproveEmployerButton employerId={employer.id} />
                      <RejectEmployerButton employerId={employer.id} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Approved Employers */}
      {approved.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Approved ({approved.length})
          </h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {approved.map((employer) => (
                <li key={employer.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {employer.firstName && employer.lastName 
                          ? `${employer.firstName} ${employer.lastName}`
                          : employer.companyName
                        }
                      </h4>
                      <p className="text-sm text-gray-500">{employer.user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Jobs Posted: {employer._count.jobs}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-green-600 font-medium">✓ Approved</span>
                      <Link
                        href={`/admin/employers/${employer.id}`}
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

      {rejected.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rejected ({rejected.length})
          </h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {rejected.map((employer) => (
                <li key={employer.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {employer.firstName && employer.lastName 
                          ? `${employer.firstName} ${employer.lastName}`
                          : employer.companyName
                        }
                      </h4>
                      <p className="text-sm text-gray-500">{employer.user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Jobs Posted: {employer._count.jobs}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-red-600 font-medium">✗ Rejected</span>
                      <Link
                        href={`/admin/employers/${employer.id}`}
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

      {pending.length === 0 && approved.length === 0 && rejected.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No employers found</p>
        </div>
      )}
    </div>
  )
}