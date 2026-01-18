import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ApproveEmployerButton, RejectEmployerButton } from './actions'

export const dynamic = 'force-dynamic'

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
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Employer Management</h2>
        <p className="text-slate-400 mt-2">Review and manage employer accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="text-3xl font-bold text-yellow-400">{pending.length}</div>
          <div className="text-yellow-400/70 text-sm">Pending Approval</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="text-3xl font-bold text-green-400">{approved.length}</div>
          <div className="text-green-400/70 text-sm">Approved</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="text-3xl font-bold text-red-400">{rejected.length}</div>
          <div className="text-red-400/70 text-sm">Rejected</div>
        </div>
      </div>

      {/* Pending Employers */}
      {pending.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            Pending Approval ({pending.length})
          </h3>
          <div className="space-y-4">
            {pending.map(employer => (
              <div key={employer.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2">{employer.companyName}</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-400">
                        <span className="text-slate-500">Email:</span> {employer.user?.email}
                      </p>
                      {employer.industry && (
                        <p className="text-slate-400">
                          <span className="text-slate-500">Industry:</span> {employer.industry}
                        </p>
                      )}
                      {employer.linkedinUrl && (
                        <a 
                          href={employer.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#0A66C2] hover:underline"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn Profile
                        </a>
                      )}
                      <p className="text-slate-500">Jobs Posted: {employer._count.jobs}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/employers/${employer.id}`}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      Edit
                    </Link>
                    <ApproveEmployerButton employerId={employer.id} />
                    <RejectEmployerButton employerId={employer.id} />
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
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Approved ({approved.length})
          </h3>
          <div className="space-y-3">
            {approved.map(employer => (
              <div key={employer.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-white">{employer.companyName}</h4>
                      <p className="text-sm text-slate-400">{employer.user?.email}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                      ✓ Approved
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{employer._count.jobs} jobs</span>
                    <Link
                      href={`/admin/employers/${employer.id}`}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
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
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            Rejected ({rejected.length})
          </h3>
          <div className="space-y-3">
            {rejected.map(employer => (
              <div key={employer.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-white">{employer.companyName}</h4>
                      <p className="text-sm text-slate-400">{employer.user?.email}</p>
                    </div>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                      ✗ Rejected
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/employers/${employer.id}`}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <ApproveEmployerButton employerId={employer.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pending.length === 0 && approved.length === 0 && rejected.length === 0 && (
        <div className="text-center py-16 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-slate-400 text-lg">No employers found</p>
          <p className="text-slate-500 text-sm mt-1">New employer signups will appear here</p>
        </div>
      )}
    </div>
  )
}
