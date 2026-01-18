import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

// University clubs data - placeholder for now
const universityClubs = [
  { name: "WHU Entrepreneurship Club", members: "500+", logo: "🎓", link: "https://whu.edu" },
  { name: "HEC Entrepreneurs", members: "400+", logo: "🚀", link: "https://hec.edu" },
  { name: "INSEAD PE/VC Club", members: "600+", logo: "💼", link: "https://insead.edu" },
  { name: "LBS Private Equity Club", members: "450+", logo: "📈", link: "https://london.edu" },
  { name: "HSG Founders Club", members: "350+", logo: "🌟", link: "https://unisg.ch" },
  { name: "CBS Entrepreneurship", members: "300+", logo: "🔥", link: "https://cbs.dk" },
]

async function getStats() {
  try {
    const [totalJobs, totalEmployers, latestJob] = await Promise.all([
      prisma.job.count({ where: { status: 'active' } }),
      prisma.employer.count({ where: { status: 'approved' } }),
      prisma.job.findFirst({
        where: { status: 'active' },
        include: { employer: { select: { companyName: true, linkedinUrl: true } } },
        orderBy: { createdAt: 'desc' }
      })
    ])
    return { totalJobs, totalEmployers, latestJob }
  } catch (error) {
    console.error('Database error:', error)
    return { totalJobs: 0, totalEmployers: 0, latestJob: null }
  }
}

export default async function HomePage() {
  const { totalJobs, totalEmployers, latestJob } = await getStats()

  // Placeholder stats (can be made dynamic later)
  const stats = {
    matchedCandidates: 127,
    registeredFunds: totalEmployers || 24,
    studentsInNetwork: 2500,
    activeJobs: totalJobs
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full">
            <span className="text-blue-300 text-sm font-medium">🎯 Exclusive Search Fund Opportunities</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Your Gateway to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Search Fund Careers
            </span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect with top search fund entrepreneurs through our exclusive university network. 
            Find roles that match your ambition and skillset.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/jobs" 
              className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 hover:scale-105 transition-all duration-200"
            >
              Browse Opportunities
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm hover:scale-105 transition-all duration-200"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">{stats.matchedCandidates}+</div>
              <div className="mt-2 text-sm text-slate-400">Successfully Matched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">{stats.registeredFunds}</div>
              <div className="mt-2 text-sm text-slate-400">Search Funds</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">{stats.studentsInNetwork.toLocaleString()}+</div>
              <div className="mt-2 text-sm text-slate-400">Students in Network</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">{stats.activeJobs}</div>
              <div className="mt-2 text-sm text-slate-400">Active Opportunities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Why Search Fund Hub?</h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            We&apos;re not just another job board. We&apos;re a curated community connecting ambitious talent with exceptional opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
              <span className="text-3xl">🎓</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Exclusive Network</h3>
            <p className="text-slate-400 leading-relaxed">
              Access opportunities shared only within our proprietary university entrepreneurship club network.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Verified Search Funds</h3>
            <p className="text-slate-400 leading-relaxed">
              Every employer is manually vetted. Work with reputable searchers backed by top investors.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Fast-Track Applications</h3>
            <p className="text-slate-400 leading-relaxed">
              Apply directly to decision-makers. No HR gatekeepers, no black-hole applications.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Job Preview */}
      {latestJob && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                🔥 LATEST OPENING
              </span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {latestJob.title}
                </h3>
                <p className="text-blue-300 font-medium mb-4">
                  {latestJob.employer.companyName}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                  {latestJob.location && (
                    <span className="flex items-center gap-1">
                      📍 {latestJob.location}
                    </span>
                  )}
                  {latestJob.industry && (
                    <span className="flex items-center gap-1">
                      🏢 {latestJob.industry}
                    </span>
                  )}
                  {latestJob.functionArea && (
                    <span className="flex items-center gap-1">
                      💼 {latestJob.functionArea}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/jobs/${latestJob.id}`}
                  className="inline-flex items-center justify-center bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
          
          {/* Browse More CTA */}
          <div className="mt-6 text-center">
            <Link 
              href="/jobs"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Browse {totalJobs > 1 ? `${totalJobs - 1} more` : 'all'} search fund opportunities
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* University Network Section */}
      <section className="py-16 md:py-24 bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our University Network
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We partner with leading entrepreneurship clubs at top European business schools 
              to bring you exclusive opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {universityClubs.map((club, index) => (
              <a
                key={index}
                href={club.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="text-4xl mb-3">{club.logo}</div>
                <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2">{club.name}</h4>
                <p className="text-xs text-slate-400">{club.members} members</p>
              </a>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              Want to add your university club?{' '}
              <a href="mailto:partners@searchfundhub.com" className="text-blue-400 hover:text-blue-300">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* For Employers CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hiring for Your Search Fund?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Get access to our talent pipeline of ambitious, entrepreneurial candidates from top business schools. 
            Manage your recruiting process with our intuitive Kanban-style dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/for-employers"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
            >
              Learn More
            </Link>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              Post Your First Job Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2026 Search Fund Hub. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="mailto:hello@searchfundhub.com" className="text-slate-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
