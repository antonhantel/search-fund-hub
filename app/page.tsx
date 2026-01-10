import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Find your next great role — faster.
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            Browse curated job listings from top employers. Post and manage jobs with an intuitive employer dashboard.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/jobs" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">Browse Jobs</Link>
            <Link href="/login" className="inline-block bg-white border border-gray-200 px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform">Sign in</Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-semibold">Trusted Employers</h3>
            <p className="mt-2 text-gray-600">Work with reputable companies that value talent.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-semibold">Easy Applications</h3>
            <p className="mt-2 text-gray-600">Apply quickly using our streamlined application flow.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-semibold">Powerful Employer Tools</h3>
            <p className="mt-2 text-gray-600">Post, manage and track applicants from one dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
