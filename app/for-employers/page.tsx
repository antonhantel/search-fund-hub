import Link from "next/link"

export default function ForEmployersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full">
            <span className="text-blue-300 text-sm font-medium">👋 For Search Fund Entrepreneurs</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Hire Exceptional Talent{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Faster
            </span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Access our exclusive network of ambitious candidates from top European business schools. 
            Streamline your recruiting with our intuitive pipeline management tools.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 hover:scale-105 transition-all duration-200"
            >
              Post Your First Job Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Hire
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From posting jobs to managing your pipeline, we've built tools specifically for search fund recruiting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Targeted Reach</h3>
              <p className="text-slate-400">
                Your jobs are shared with 2,500+ students across our partner university entrepreneurship clubs—people who actually want to work at search funds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Kanban Pipeline</h3>
              <p className="text-slate-400">
                Track candidates through your recruiting process with our drag-and-drop Kanban board. From new applicants to hired—all in one place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">LinkedIn Integration</h3>
              <p className="text-slate-400">
                Your LinkedIn profile is prominently displayed on job listings. Candidates can learn about you directly—building trust before they apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Get from sign-up to your first hire in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Create Your Profile</h3>
              <p className="text-slate-400">
                Sign up, add your company details and LinkedIn. We'll verify your search fund within 24 hours.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Post Your Job</h3>
              <p className="text-slate-400">
                Describe the role, requirements, and what makes your opportunity unique. Published instantly after approval.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Manage & Hire</h3>
              <p className="text-slate-400">
                Track applicants in your Kanban board, communicate with candidates, and make great hires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* University Network Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our University Partner Network
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We partner with leading entrepreneurship and finance clubs at top universities
              to bring you access to exceptional student talent.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { name: "WHU ETA Club", abbrev: "WHU", logo: "/WHU ETA Club.png" },
              { name: "ETA Sankt Gallen", abbrev: "HSG", logo: "/ETA St Gallen.png" },
              { name: "TU Investment Club", abbrev: "TUM", logo: "/TU Investment Club.png" },
              { name: "Green Finance Consulting", abbrev: "GFC", logo: "/Green Finance Consulting.png" },
              { name: "Integra e.V.", abbrev: "INT", logo: "/Integra e.V..png" },
              { name: "Aachen Investment Club", abbrev: "AIC", logo: "/Aachen Investment Club.png" },
              { name: "HHL Private Equity Club", abbrev: "HHL", logo: "/HHL Private Equity Club.png" },
              { name: "Further partnerships in the pipeline", abbrev: "+", logo: null },
            ].map((club, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-8 text-center hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="h-32 flex items-center justify-center mb-4">
                  {club.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="h-28 w-auto max-w-full object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <span className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{club.abbrev}</span>
                    </div>
                  )}
                </div>
                <h4 className="text-base font-semibold text-white line-clamp-2">{club.name}</h4>
              </div>
            ))}
          </div>

          {/* University Partnership CTA */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-3">
              Want to Add Your University Club?
            </h3>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              We&apos;re always looking to expand our network with entrepreneurship, finance, and consulting clubs
              from universities across DACH and Europe.
            </p>
            <a
              href="mailto:partners@searchfundhub.com?subject=University%20Club%20Partnership"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us About Partnerships
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Next Great Hire?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join 24+ search funds already using Search Fund Hub to build their teams.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 transition-all duration-200"
          >
            Create Your Account →
          </Link>
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
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              <Link href="/jobs" className="text-slate-400 hover:text-white transition-colors">Browse Jobs</Link>
              <a href="mailto:hello@searchfundhub.com" className="text-slate-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
