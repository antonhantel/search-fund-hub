import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { JobDetailActions } from "./job-detail-actions"

export const dynamic = 'force-dynamic'

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const job = await prisma.job.findUnique({
    where: { id, status: 'active' },
    include: {
      employer: true
    }
  })

  if (!job) {
    notFound()
  }

  const postedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href="/jobs"
          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 mb-6 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-slate-700">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
                  {job.title}
                </h1>
                
                {/* Company with LinkedIn */}
                <div className="flex items-center gap-3">
                  <span className="text-lg text-slate-300 font-medium">
                    {job.employer.companyName}
                  </span>
                  {job.employer.linkedinUrl && (
                    <a
                      href={job.employer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {job.location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm">
                  📍 {job.location}
                </span>
              )}
              {job.industry && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm">
                  🏢 {job.industry}
                </span>
              )}
              {job.functionArea && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm">
                  💼 {job.functionArea}
                </span>
              )}
              {job.companySize && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm">
                  👥 {job.companySize}
                </span>
              )}
              {job.salaryRange && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm">
                  💰 {job.salaryRange}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                📅 Posted {postedDate}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                Job Description
              </h2>
              <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {job.description}
                </p>
              </div>
            </section>

            {job.requirements && (
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  Requirements
                </h2>
                <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {job.requirements}
                  </p>
                </div>
              </section>
            )}

            {job.languageRequirements && (
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  Language Requirements
                </h2>
                <div className="flex flex-wrap gap-2">
                  {typeof job.languageRequirements === 'string' ? (
                    <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                      {job.languageRequirements}
                    </span>
                  ) : Array.isArray(job.languageRequirements) ? (
                    (job.languageRequirements as string[]).map((lang, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                        {lang}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400">Languages required</p>
                  )}
                </div>
              </section>
            )}

            {/* About the Company */}
            <section className="bg-slate-700/30 rounded-xl p-6">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                About {job.employer.companyName}
              </h2>
              
              {job.employer.description && (
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {job.employer.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3">
                {job.employer.website && (
                  <a
                    href={job.employer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </a>
                )}
                {job.employer.linkedinUrl && (
                  <a
                    href={job.employer.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white font-medium rounded-lg hover:bg-[#004182] transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </section>
          </div>

          {/* Apply Section */}
          <div className="p-6 md:p-8 border-t border-slate-700 bg-slate-800/30">
            <JobDetailActions />
          </div>
        </div>
      </div>
    </div>
  )
}
