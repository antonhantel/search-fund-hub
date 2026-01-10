import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function HomePage() {
  const stats = await prisma.job.aggregate({
    where: { status: 'active' },
    _count: true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-5"></div>
        <div className="relative py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              🚀 Your Gateway to Search Fund Opportunities
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Find Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Search Fund Role
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Discover exceptional opportunities in search funds, ETA, and micro private equity.
              Connect with top employers building the future.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/jobs"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Browse {stats._count} Jobs
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-white border-2 border-gray-300 px-8 py-4 rounded-xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all shadow-md hover:shadow-lg hover:scale-105"
              >
                Employer Login
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-4xl font-bold text-blue-600">{stats._count}+</div>
                <div className="text-gray-600 font-medium mt-2">Active Positions</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-4xl font-bold text-indigo-600">100%</div>
                <div className="text-gray-600 font-medium mt-2">Verified Employers</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-4xl font-bold text-purple-600">24h</div>
                <div className="text-gray-600 font-medium mt-2">Avg. Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Why Choose Search Fund Hub?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-blue-200">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Trusted Employers</h3>
            <p className="text-gray-700 leading-relaxed">
              Work with vetted search funds and private equity firms that value entrepreneurial talent and offer meaningful equity opportunities.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-green-200">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Quick Applications</h3>
            <p className="text-gray-700 leading-relaxed">
              Apply in minutes with our streamlined process. Get direct access to hiring managers and fast-track your career.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-purple-200">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Employer Dashboard</h3>
            <p className="text-gray-700 leading-relaxed">
              Post jobs, manage applications, and find top talent with our intuitive employer platform built for search funds.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of professionals finding their dream roles in search funds
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Explore Opportunities
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
