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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium hover:gap-3 transition-all"
        >
          ← Back to Jobs
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {job.title}
            </h1>
            <p className="text-2xl text-blue-100 font-semibold">
              {job.employer.companyName}
            </p>
          </div>

          <div className="p-8">
            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-gray-200">
              {job.location && (
                <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
                  📍 {job.location}
                </span>
              )}
              {job.industry && (
                <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-medium">
                  🏢 {job.industry}
                </span>
              )}
              {job.functionArea && (
                <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium">
                  💼 {job.functionArea}
                </span>
              )}
              {job.companySize && (
                <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium">
                  👥 {job.companySize}
                </span>
              )}
              {job.salaryRange && (
                <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg font-medium">
                  💰 {job.salaryRange}
                </span>
              )}
              <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium">
                📅 Posted {postedDate}
              </span>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">📋</span> Job Description
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </section>

              {job.requirements && (
                <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-green-600">✓</span> Requirements
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {job.requirements}
                    </p>
                  </div>
                </section>
              )}

              {job.languageRequirements && (
                <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-orange-600">🌐</span> Language Requirements
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <ul className="list-none space-y-2 text-gray-700">
                      {Array.isArray(job.languageRequirements) ? (
                        job.languageRequirements.map((lang: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-orange-500">▸</span>
                            <span className="font-medium">{lang}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-center gap-2">
                          <span className="text-orange-500">▸</span>
                          <span className="font-medium">{String(job.languageRequirements)}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </section>
              )}

              <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-purple-600">🏢</span> About {job.employer.companyName}
                </h2>
                {job.employer.description && (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {job.employer.description}
                  </p>
                )}
                {job.employer.website && (
                  <a
                    href={job.employer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold hover:gap-3 transition-all"
                  >
                    Visit Company Website →
                  </a>
                )}
              </section>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <JobDetailActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
