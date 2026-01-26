import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { CreateJobForm } from "./create-form"

export const dynamic = 'force-dynamic'

export default async function NewJobPage() {
  // Get all approved employers for the dropdown
  const employers = await prisma.employer.findMany({
    where: { status: 'approved' },
    select: {
      id: true,
      companyName: true
    },
    orderBy: { companyName: 'asc' }
  })

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>
        <h2 className="text-3xl font-bold text-white">Create New Job</h2>
        <p className="text-slate-400 mt-2">Create a job posting and assign it to an employer</p>
      </div>

      {employers.length > 0 ? (
        <CreateJobForm employers={employers} />
      ) : (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
          <div className="text-3xl mb-3">⚠️</div>
          <h3 className="text-xl font-semibold text-yellow-400 mb-2">No Approved Employers</h3>
          <p className="text-slate-400 mb-4">
            You need at least one approved employer to create a job posting.
          </p>
          <Link
            href="/admin/employers"
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors"
          >
            Go to Employers
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}
