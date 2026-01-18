import { prisma } from "@/lib/prisma"
import { ApproveJobButton, RejectJobButton } from "./actions"
import Link from "next/link"

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    include: {
      employer: {
        select: {
          companyName: true,
          linkedinUrl: true
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
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Job Management</h2>
        <p className="text-slate-400 mt-2">Review and manage job postings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="text-3xl font-bold text-yellow-400">{pending.length}</div>
          <div className="text-yellow-400/70 text-sm">Pending Approval</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="text-3xl font-bold text-green-400">{active.length}</div>
          <div className="text-green-400/70 text-sm">Active</div>
        </div>
        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
          <div className="text-3xl font-bold text-slate-300">{other.length}</div>
          <div className="text-slate-400 text-sm">Other</div>
        </div>
      </div>
      
      {pending.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            Pending Approval ({pending.length})
          </h3>
          <div className="space-y-4">
            {pending.map((job) => (
              <div key={job.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-400">{job.employer.companyName}</span>
                      {job.employer.linkedinUrl && (
                        <a
                          href={job.employer.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0A66C2] hover:text-[#004182]"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-3">
                      {job.location && (
                        <span className="px-2 py-1 bg-slate-700/50 rounded">📍 {job.location}</span>
                      )}
                      {job.industry && (
                        <span className="px-2 py-1 bg-slate-700/50 rounded">🏢 {job.industry}</span>
                      )}
                      {job.functionArea && (
                        <span className="px-2 py-1 bg-slate-700/50 rounded">💼 {job.functionArea}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <ApproveJobButton jobId={job.id} />
                    <RejectJobButton jobId={job.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Active ({active.length})
          </h3>
          <div className="space-y-3">
            {active.map((job) => (
              <div key={job.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{job.title}</h4>
                    <p className="text-sm text-slate-400">{job.employer.companyName}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">✓ Active</span>
                    <Link
                      href={`/admin/jobs/${job.id}`}
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

      {other.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-slate-500 rounded-full"></span>
            Other ({other.length})
          </h3>
          <div className="space-y-3">
            {other.map((job) => (
              <div key={job.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{job.title}</h4>
                    <p className="text-sm text-slate-400">{job.employer.companyName}</p>
                    <span className="text-xs text-slate-500">Status: {job.status}</span>
                  </div>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && active.length === 0 && other.length === 0 && (
        <div className="text-center py-16 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="text-5xl mb-4">💼</div>
          <p className="text-slate-400 text-lg">No jobs found</p>
        </div>
      )}
    </div>
  )
}
