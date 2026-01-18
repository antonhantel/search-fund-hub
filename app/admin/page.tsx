import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const [
    totalJobs,
    activeJobs,
    pendingJobs,
    totalEmployers,
    pendingEmployers,
    totalUsers
  ] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { status: 'active' } }),
    prisma.job.count({ where: { status: 'pending' } }),
    prisma.employer.count(),
    prisma.employer.count({ where: { status: 'pending' } }),
    prisma.user.count()
  ])

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
        <p className="text-slate-400 mt-2">Overview of platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Jobs</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalJobs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💼</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Jobs</p>
              <p className="mt-2 text-3xl font-bold text-green-400">{activeJobs}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Pending Jobs</p>
              <p className="mt-2 text-3xl font-bold text-yellow-400">{pendingJobs}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Employers</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalEmployers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingJobs > 0 && (
          <Link href="/admin/jobs" className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 hover:bg-yellow-500/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{pendingJobs} Jobs Pending</h3>
                <p className="text-yellow-400/70 text-sm">Review and approve job posts</p>
              </div>
            </div>
          </Link>
        )}

        {pendingEmployers > 0 && (
          <Link href="/admin/employers" className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 hover:bg-blue-500/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{pendingEmployers} Employers Pending</h3>
                <p className="text-blue-400/70 text-sm">Review new employer signups</p>
              </div>
            </div>
          </Link>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{totalUsers} Users</h3>
              <p className="text-slate-400 text-sm">Total registered users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/jobs" className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-center font-medium transition-colors">
            All Jobs
          </Link>
          <Link href="/admin/employers" className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-center font-medium transition-colors">
            All Employers
          </Link>
          <Link href="/admin/users/new" className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-center font-medium transition-colors">
            Add User
          </Link>
          <Link href="/" target="_blank" className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-center font-medium transition-colors">
            View Site ↗
          </Link>
        </div>
      </div>
    </div>
  )
}
