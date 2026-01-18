import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { DeleteJobButton } from "./delete-button"

export const dynamic = 'force-dynamic'

export default async function EmployerJobsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  let employerId = session.user?.employerId

  if (!employerId && session.user?.email) {
    const employer = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (employer) employerId = employer.id
  }

  if (!employerId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">No Employer Account</h2>
        <p className="text-slate-400">Please contact support to link your employer account.</p>
      </div>
    )
  }

  const jobs = await prisma.job.findMany({
    where: { employerId },
    orderBy: { createdAt: 'desc' }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Active</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">Pending</span>
      case 'draft':
        return <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs font-medium">Draft</span>
      case 'rejected':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">Rejected</span>
      default:
        return <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs font-medium">{status}</span>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">My Jobs</h2>
          <p className="text-slate-400 mt-2">Manage your job postings</p>
        </div>
        <Link
          href="/employer/jobs/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        >
          + Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="text-5xl mb-4">💼</div>
          <h3 className="text-xl font-semibold text-white mb-2">No jobs yet</h3>
          <p className="text-slate-400 mb-6">Create your first job posting to start attracting candidates</p>
          <Link
            href="/employer/jobs/new"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    {getStatusBadge(job.status)}
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
                  <p className="text-sm text-slate-400 line-clamp-2">{job.description}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Created {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {job.status === 'active' && (
                    <Link
                      href={`/jobs/${job.id}`}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                    >
                      View Live
                    </Link>
                  )}
                  <Link
                    href={`/employer/jobs/${job.id}`}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                  >
                    Edit
                  </Link>
                  <DeleteJobButton jobId={job.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
