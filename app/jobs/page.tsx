import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Filters from './filters'

export default async function JobsPage({
  searchParams
}: {
  searchParams: { search?: string; industry?: string; location?: string; functionArea?: string }
}) {
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

  const allActiveJobs = await prisma.job.findMany({
    where: { status: 'active' },
    select: {
      industry: true,
      location: true,
      functionArea: true
    }
  })

  const industries = Array.from(
    new Set(allActiveJobs.map(j => j.industry).filter(Boolean))
  ).sort() as string[]

  const locations = Array.from(
    new Set(allActiveJobs.map(j => j.location).filter(Boolean))
  ).sort() as string[]

  const functionAreas = Array.from(
    new Set(allActiveJobs.map(j => j.functionArea).filter(Boolean))
  ).sort() as string[]

  const jobs = await prisma.job.findMany({
    where,
    include: {
      employer: {
        select: {
          companyName: true,
          industry: true,
          linkedinUrl: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Search Fund Opportunities</h1>
          <p className="mt-2 text-slate-400">Find your next role in the search fund ecosystem</p>
        </div>

        {/* Filters */}
        <Filters 
          industries={industries} 
          locations={locations} 
          functionAreas={functionAreas} 
        />

        {/* Results count */}
        <div className="mb-4 text-sm text-slate-400">
          {jobs.length} {jobs.length === 1 ? 'opportunity' : 'opportunities'} found
        </div>

        {/* Job Listings */}
        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/50 border border-slate-700 rounded-xl">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white text-lg mb-2">No jobs match your filters</p>
            <p className="text-slate-400 text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-200"
              >
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {job.title}
                    </h2>
                    
                    {/* Company with LinkedIn */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-blue-400 font-medium">
                        {job.employer.companyName}
                      </span>
                      {job.employer.linkedinUrl && (
                        <a
                          href={job.employer.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-6 h-6 bg-[#0A66C2] hover:bg-[#004182] text-white rounded transition-colors"
                          title="View on LinkedIn"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg">
                          📍 {job.location}
                        </span>
                      )}
                      {job.industry && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg">
                          🏢 {job.industry}
                        </span>
                      )}
                      {job.functionArea && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg">
                          💼 {job.functionArea}
                        </span>
                      )}
                      {job.languageRequirements && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg">
                          🌐 {typeof job.languageRequirements === 'string' 
                            ? job.languageRequirements 
                            : Array.isArray(job.languageRequirements) 
                              ? (job.languageRequirements as string[]).join(', ')
                              : 'Languages required'}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-4 border-t border-slate-700">
                    <div className="text-xs text-slate-500">
                      Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
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
