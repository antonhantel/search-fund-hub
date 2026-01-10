import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Filters from './filters'
// Using emoji icons to avoid additional runtime dependency

export const dynamic = 'force-dynamic'

export default async function JobsPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; industry?: string; location?: string; functionArea?: string }>
}) {
  const params = await searchParams

  // Build filter conditions
  type WhereClause = {
    status: string
    OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>
    industry?: string
    location?: { contains: string; mode: 'insensitive' }
    functionArea?: string
  }

  const where: WhereClause = { status: 'active' }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } }
    ]
  }

  if (params.industry) {
    where.industry = params.industry
  }

  if (params.location) {
    where.location = { contains: params.location, mode: 'insensitive' }
  }

  if (params.functionArea) {
    where.functionArea = params.functionArea
  }

  let allActiveJobs, jobs

  try {
    // Fetch all active jobs for filter options
    allActiveJobs = await prisma.job.findMany({
      where: { status: 'active' },
      select: {
        industry: true,
        location: true,
        functionArea: true
      }
    })

    // Fetch filtered jobs
    jobs = await prisma.job.findMany({
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
  } catch (error) {
    console.error('Error fetching jobs:', error)
    // Return empty arrays if there's an error
    allActiveJobs = []
    jobs = []
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Search Fund Jobs</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Discover exceptional opportunities in search funds, ETA, and micro private equity
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm">
            <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">
              {jobs.length} Active Positions
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Filters />

        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-xl mb-2">No jobs match your filters</p>
            <p className="text-gray-500">Try adjusting your search criteria to see more opportunities</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
                <div key={job.id} className="group bg-white rounded-2xl shadow-md border border-gray-200 p-8 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h2>
                          <p className="text-lg text-blue-600 font-semibold mb-4">{job.employer.companyName}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.location && (
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                            <span>📍</span>
                            {job.location}
                          </span>
                        )}

                        {job.industry && (
                          <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                            <span>🏢</span>
                            {job.industry}
                          </span>
                        )}

                        {job.functionArea && (
                          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                            <span>💼</span>
                            {job.functionArea}
                          </span>
                        )}

                        {job.salaryRange && (
                          <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                            <span>💰</span>
                            {job.salaryRange}
                          </span>
                        )}

                        {job.languageRequirements && (
                          <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                            <span>🌐</span>
                            {Array.isArray(job.languageRequirements)
                              ? job.languageRequirements.join(', ')
                              : String(job.languageRequirements)}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 leading-relaxed line-clamp-3">{job.description}</p>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="block w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-xl text-center group-hover:scale-105"
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
