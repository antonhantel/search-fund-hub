import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function HomePage() {
  // Get statistics
  const activeJobs = await prisma.job.count({
    where: { status: 'active' }
  })

  const uniqueEmployers = await prisma.employer.count({
    where: { status: 'approved' }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Find Your Next <span className="text-blue-600">Search Fund Opportunity</span>
        </h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/jobs"
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Post a Job
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Searchers */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              For Search Funders
            </h3>
            <p className="text-gray-600 text-lg">
              Discover CEO and leadership opportunities in search fund acquisitions. 
              Find the perfect role to lead a thriving business.
            </p>
          </div>

          {/* For Entrepreneurs */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              For Entrepreneurs
            </h3>
            <p className="text-gray-600 text-lg">
              Connect with talented operators to lead your acquired business. 
              Build your dream team with experienced professionals.
            </p>
          </div>

          {/* For Companies */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              For Companies
            </h3>
            <p className="text-gray-600 text-lg">
              Find experienced leaders for your executive team. 
              Connect with talented professionals ready for their next challenge.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">{activeJobs}</div>
              <div className="text-lg text-blue-100">Active Jobs</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{uniqueEmployers}</div>
              <div className="text-lg text-blue-100">Companies Hiring</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-lg text-blue-100">Success Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of search fund professionals finding their next opportunity.
        </p>
        <Link
          href="/jobs"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore Opportunities
        </Link>
      </section>
    </div>
  )
}
