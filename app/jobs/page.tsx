import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Filters } from './filters'
import { Prisma } from '@prisma/client'

export default async function JobsPage({
  searchParams
}: {
  searchParams: { search?: string; industry?: string; location?: string; functionArea?: string }
}) {
  // Build filter conditions
  const where: Prisma.JobWhereInput = {
    status: 'active'
  }

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
    where.location = searchParams.location
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

        <Filters 
          industries={industries}
          locations={locations}
          functionAreas={functionAreas}
        />

        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No jobs match your filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h2>
                    <p className="text-lg text-gray-700 mb-2">
                      {job.employer.companyName}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                      {job.location && (
                        <span className="flex items-center">
                          📍 {job.location}
                        </span>
                      )}
                      {job.industry && (
                        <span className="flex items-center">
                          🏢 {job.industry}
                        </span>
                      )}
                      {job.functionArea && (
                        <span className="flex items-center">
                          💼 {job.functionArea}
                        </span>
                      )}
                      {job.languageRequirements && (
                        <span className="flex items-center">
                          🌐 {job.languageRequirements}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-3">
                      {job.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
