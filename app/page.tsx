import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { UniversityLogos } from "@/components/university-logos"

export const dynamic = 'force-dynamic'

// FAQ Data - removed "What is ETA" since it's explained above
const faqs = [
  {
    q: "Do I need to register for a Stammtisch?",
    a: "Yes. A Stammtisch only takes place if at least 10 people register on Luma."
  },
  {
    q: "Why the registration requirement?",
    a: "It ensures good conversations, stable group size and better predictability for locations."
  },
  {
    q: "I attended once, but I am not in the Stammtisch group yet. What should I do?",
    a: "Just message your host. We will add you."
  },
  {
    q: "What does this community cost?",
    a: "Nothing. It is volunteer-led."
  }
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
  const { totalJobs, latestJob } = await getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Centered White Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo-white.png"
              alt="Search Fund Hub"
              width={320}
              height={100}
              className="h-24 md:h-28 w-auto"
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-4xl mx-auto">
            Welcome to the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Search Fund Hub
            </span>{' '}
            Community
          </h1>

          {/* Germany's largest ETA community tagline */}
          <p className="mt-4 text-xl md:text-2xl font-semibold text-blue-400">
            Germany&apos;s Largest ETA Community
          </p>

          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A volunteer-driven community for everyone in the ETA ecosystem in Germany.
            Our goal is simple: create real connections, share experiences and support each other
            through in-person events, peer exchange, and career opportunities.
          </p>

          {/* Updated CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#events-community"
              className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 hover:scale-105 transition-all duration-200"
            >
              Events & Community
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm hover:scale-105 transition-all duration-200"
            >
              Intern & Working Student Job Board
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="py-12 border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">350+</div>
              <div className="mt-2 text-sm text-slate-400">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">Multiple</div>
              <div className="mt-2 text-sm text-slate-400">Events Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">2,500+</div>
              <div className="mt-2 text-sm text-slate-400">Students in Job Board Network</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">4</div>
              <div className="mt-2 text-sm text-slate-400">Locations</div>
              <div className="mt-1 text-xs text-slate-500">MUC · BER · FFM · HAM</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & What is ETA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              Our mission is to bring visibility to Entrepreneurship-through-Acquisition (ETA) as a
              potential solution to the succession gap in the German Mittelstand and as an alternative
              to founding a new company.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed">
              We promote knowledge transfer and networking between different stakeholders -
              entrepreneurial talents, companies with open succession, and investors.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-4">What is ETA?</h3>
            <p className="text-slate-300 leading-relaxed mb-6">
              <strong className="text-white">Entrepreneurship Through Acquisition</strong> is an
              entrepreneurial approach where individuals or teams search for, acquire, and then
              lead and develop an existing company, rather than founding a new one.
            </p>
            <p className="text-slate-400 text-sm italic">
              Given the massive succession gap, diverse approaches are needed in the coming years
              to lead the Mittelstand - which makes up 99% of companies in the EU - into the future.
              This structural development is also an opportunity for entrepreneurially-minded individuals.
            </p>
          </div>
        </div>
      </section>

      {/* Why Search Fund Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Our Goals</h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Building bridges between talented entrepreneurs and opportunities in the German Mittelstand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Awareness</h3>
            <p className="text-slate-400 leading-relaxed">
              We raise awareness for ETA as a potential solution to the succession gap and as an
              alternative to founding, both in the broader public and among entrepreneurial talents.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Knowledge Transfer</h3>
            <p className="text-slate-400 leading-relaxed">
              We organize targeted formats that qualify entrepreneurial talents, sensitize companies
              to external succession possibilities, and provide investors with insights.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Networking</h3>
            <p className="text-slate-400 leading-relaxed">
              Through various event formats, we promote networking within target groups and create
              connections between experienced entrepreneurs, investors, and potential successors.
            </p>
          </div>
        </div>
      </section>

      {/* Events & Community Section */}
      <section id="events-community" className="py-16 md:py-20 bg-gradient-to-b from-blue-900/30 to-transparent border-y border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Events & Community
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We host monthly events across different cities and regular flagship events with
              operators, searchers and investors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Events Card */}
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Upcoming Events</h3>
              <p className="text-slate-300 mb-6">
                Find all upcoming events across Germany on one central page. Add events to your
                calendar, receive updates and see who else is attending.
              </p>
              <a
                href="https://lu.ma/searchfundhub?k=c"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-colors"
              >
                View Events on Luma
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* WhatsApp Groups Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">WhatsApp Groups</h3>
              <p className="text-slate-300 mb-4">
                Join our announcements group to stay informed about new events, registrations,
                and community highlights.
              </p>
              <a
                href="https://chat.whatsapp.com/CwavUBUBMAUKnr4kiUgU16"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors"
              >
                Join Announcements Group
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <p className="text-sm text-slate-400 mt-4">
                <strong className="text-slate-300">Local Stammtisch Groups:</strong> Join after attending
                your first local event. These groups are more personal - everyone knows each other in person.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Board Section - Updated styling */}
      <section id="job-board" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Intern & Working Student Job Board
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore ETA roles or find out how to submit your own job post
          </p>
        </div>

        {/* Latest Job Preview */}
        {latestJob && (
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-8 md:p-10 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                LATEST OPENING
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {latestJob.location}
                    </span>
                  )}
                  {latestJob.industry && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {latestJob.industry}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/jobs/${latestJob.id}`}
                  className="inline-flex items-center justify-center bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  View Details
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Highlighted Browse Button */}
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-400/40 hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse All {totalJobs || 3} Opportunities
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            href="/for-employers"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 font-medium transition-colors"
          >
            Find out how to post your own job openings
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Employer CTA */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Hiring for Your Search Fund?
            </h3>
            <p className="text-slate-400 mb-8">
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
                Post Your First Job Free
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-slate-400 uppercase tracking-wider">Our Partners</h2>
          </div>
          <div className="flex justify-center items-center">
            <a
              href="https://lineage.partners"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center p-8 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              <img
                src="/lineage-logo.png"
                alt="Lineage Partners"
                className="h-10 w-auto"
              />
            </a>
          </div>
        </div>
      </section>

      {/* University Network Section */}
      <section className="py-16 md:py-20 bg-white/5 border-t border-white/10">
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

          <UniversityLogos />

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

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-slate-400 mb-6">
            Have questions or want to get involved? Reach out to us directly.
          </p>
          <a
            href="mailto:hello@searchfundhub.de"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            hello@searchfundhub.de
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo-white.svg" alt="Search Fund Hub" width={120} height={40} className="h-8 w-auto" />
            </div>
            <div className="text-slate-400 text-sm">
              © 2026 Search Fund Hub. Volunteer-led community.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Imprint</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
