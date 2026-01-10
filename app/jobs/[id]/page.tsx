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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/jobs"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to Jobs
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                <p className="text-xl text-gray-700">
                  {job.employer.companyName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 border-b border-gray-200 pb-6">
              {job.location && (
                <span className="flex items-center gap-2">
                  📍 <span>{job.location}</span>
                </span>
              )}
              {job.industry && (
                <span className="flex items-center gap-2">
                  🏢 <span>{job.industry}</span>
                </span>
              )}
              {job.functionArea && (
                <span className="flex items-center gap-2">
                  💼 <span>{job.functionArea}</span>
                </span>
              )}
              {job.companySize && (
                <span className="flex items-center gap-2">
                  👥 <span>{job.companySize}</span>
                </span>
              )}
              {job.salaryRange && (
                <span className="flex items-center gap-2">
                  💰 <span>{job.salaryRange}</span>
                </span>
              )}
              <span className="flex items-center gap-2">
                📅 <span>Posted {postedDate}</span>
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </section>

            {job.requirements && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Requirements
                </h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </div>
              </section>
            )}

            {job.languageRequirements && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Language Requirements
                </h2>
                <div className="prose prose-sm max-w-none">
                  <ul className="list-disc pl-5 text-gray-700">
                    {Array.isArray(job.languageRequirements) ? (
                      job.languageRequirements.map((lang: string, i: number) => (
                        <li key={i}>{lang}</li>
                      ))
                    ) : (
                      <li>{String(job.languageRequirements)}</li>
                    )}
                  </ul>
                </div>
              </section>
            )}

            <section className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                About {job.employer.companyName}
              </h2>
              {job.employer.description && (
                <p className="text-gray-700 mb-4">
                  {job.employer.description}
                </p>
              )}
              {job.employer.website && (
                <a
                  href={job.employer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
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
  )
}
