import Link from "next/link"

const teamMembers = [
  {
    name: "Carlo Schmid",
    role: "Co-Founder",
    description: "Founder and General Partner of LINEAGE, a Fund of Searchers supporting succession entrepreneurs in Europe. Previously investor at Cherry Ventures, started career in Investment Banking at Merrill Lynch.",
    linkedIn: "https://de.linkedin.com/in/crlschmd",
    image: "/CSchmid.jpeg",
  },
  {
    name: "Paul Liepe",
    role: "Co-Founder",
    description: "Enterprise Architect at Siemens Battery Solutions, focusing on IoT and AI innovations. Over 8 years of experience in agile project management with a technical background in industrial and energy systems.",
    linkedIn: "https://de.linkedin.com/in/paulliepe",
    image: "/PLiepe.jpeg",
  },
  {
    name: "John Schanbacher",
    role: "Board Member",
    description: "Works in Private Equity and succession entrepreneurship. Shares analysis on PE deals and operational value drivers for tech companies. Enabler for succession entrepreneurs through LINEAGE and Search Funds.",
    linkedIn: "https://www.linkedin.com/in/john-schanbacher/",
    image: "/JSchanbacher.jpeg",
  },
  {
    name: "Clemens Hacker",
    role: "Jobboard Lead",
    description: "Finance background (Esade MiF) with experience at BCG and in VC (Redalpine). Combines analytical consulting experience with a strong focus on Search Funds and business succession.",
    linkedIn: "https://www.linkedin.com/in/clemenshacker/",
    image: "/CHacker.jpeg",
  },
  {
    name: "Anton Hantel",
    role: "Product Lead",
    description: "Anton runs the employer platform powering job postings, application intake, and candidate screening for the community. He is currently pursuing an MBA at MIT Sloan with a focus on Entrepreneurship & Innovation. Previously, he worked as a Strategy Consultant at Boston Consulting Group, advising consumer and retail firms on large-scale transformations.",
    linkedIn: "https://www.linkedin.com/in/anton-hantel/",
    image: "/AHantel.jpg",
  },
  {
    name: "Alexander Rast",
    role: "Munich City Captain",
    description: "Actively involved in building the Search Fund Hub community. Focus on ETA/Search Funds and community building in the German Mittelstand.",
    linkedIn: "https://www.linkedin.com/in/alexander-rast/",
    image: "/ARast.jpeg",
  },
  {
    name: "Lukas Pahl",
    role: "Hamburg City Captain",
    description: "Involved in organizing Search Fund Hub meetups and events. Focuses on networking and event organization in the growing German Search Fund community.",
    linkedIn: "https://www.linkedin.com/in/lukas-pahl/",
    image: "/LPahl.jpg",
  },
  {
    name: "Tobias Röhrl",
    role: "Berlin City Captain",
    description: "Part of the core team for German Search Fund activities. Combines transaction and deal focus with community work in the Search ecosystem.",
    linkedIn: "https://www.linkedin.com/in/tobiasroehrl/",
    image: "/TRoehrl.jpeg",
  },
  {
    name: "TBD",
    role: "Frankfurt City Captain",
    description: "Position open - reach out if interested!",
    linkedIn: null,
    image: null,
  },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Meet the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Team
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Search Fund Hub is run entirely by volunteers who are passionate about building
            the ETA ecosystem in Germany.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group"
              >
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  {member.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {member.name === "TBD" ? "?" : member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-white text-center mb-1">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-blue-400 text-sm font-medium text-center mb-3">
                  {member.role}
                </p>

                {/* Description */}
                <p className="text-slate-400 text-sm text-center mb-4">
                  {member.description}
                </p>

                {/* LinkedIn */}
                {member.linkedIn && (
                  <div className="flex justify-center">
                    <a
                      href={member.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 md:py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Want to Get Involved?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for passionate people to help grow the ETA community in Germany.
            Whether you want to host events, contribute to the job board, or help in other ways - reach out!
          </p>
          <a
            href="mailto:hello@searchfundhub.de"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img src="/logo-white.png" alt="Search Fund Hub" className="h-10 w-auto" />
              <a
                href="https://www.linkedin.com/company/search-fund-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 bg-[#0A66C2] hover:bg-[#004182] text-white rounded transition-colors"
                title="Follow us on LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <div className="text-slate-400 text-sm">
              © 2026 Search Fund Hub. Volunteer-led community.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              <Link href="/jobs" className="text-slate-400 hover:text-white transition-colors">Jobs</Link>
              <a href="mailto:hello@searchfundhub.de" className="text-slate-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
