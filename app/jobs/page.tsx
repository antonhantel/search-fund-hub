import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Filters from './filters'
// Using emoji icons to avoid additional runtime dependency

export const dynamic = 'force-dynamic'

export default async function JobsPage({
  searchParams
}: {
  searchParams: { search?: string; industry?: string; location?: string; functionArea?: string }
}) {
  // Build filter conditions
  type WhereClause = {
    status: string
    OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>
    industry?: string
    location?: { contains: string; mode: 'insensitive' }
    functionArea?: string
  }

  const where: WhereClause = { status: 'active' }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } }
    ]
  }

  if (searchParams.industry) {
    where.industry = searchParams.industry
  }

  if (searchParams.location) {
    where.location = { contains: searchParams.location, mode: 'insensitive' }
  }

  if (searchParams.functionArea) {
    where.functionArea = searchParams.functionArea
  }

  // Fetch all active jobs for filter options
  const allActiveJobs = await prisma.job.findMany({
    where: { status: 'active' },
    select: {
      industry: true,
      location: true,
      functionArea: true
    }
  })

  // Extract unique values for filters
  const industries = Array.from(
    new Set(allActiveJobs.map(j => j.industry).filter(Boolean))
  ).sort() as string[]

  const locations = Array.from(
    new Set(allActiveJobs.map(j => j.location).filter(Boolean))
  ).sort() as string[]

  const functionAreas = Array.from(
    new Set(allActiveJobs.map(j => j.functionArea).filter(Boolean))
  ).sort() as string[]

  // Fetch filtered jobs
  const jobs = await prisma.job.findMany({
    where,
    include: {
      employer: {
        select: {
          companyName: true,
          industry: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Search Fund Jobs</h1>
          <p className="mt-2 text-gray-600">Find your next opportunity in search funds</p>
        </div>

        <Filters />

        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No jobs match your filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
                      <p className="text-lg text-blue-600 font-medium mb-4">{job.employer.companyName}</p>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                        {job.location && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl">📍</span>
                            <span>{job.location}</span>
                          </div>
                        )}

                        {job.industry && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🏢</span>
                            <span>{job.industry}</span>
                          </div>
                        )}

                        {job.functionArea && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl">💼</span>
                            <span>{job.functionArea}</span>
                          </div>
                        )}

                        {job.languageRequirements && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🌐</span>
                            <span className="text-sm">
                              {Array.isArray(job.languageRequirements)
                                ? job.languageRequirements.join(', ')
                                : String(job.languageRequirements)}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-700 mb-6 line-clamp-3">{job.description}</p>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto md:pl-4">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="w-full md:w-auto inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
