import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { EmployerNav } from "@/components/employer-nav"
import { ReactNode } from "react"

interface EmployerLayoutProps {
  children: ReactNode
}

export default async function EmployerLayout({ children }: EmployerLayoutProps) {
  const session = await auth()

  if (!session || session.user.role !== 'employer') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
              <img src="/logo.svg" alt="Search Fund Hub" className="h-8 w-8" />
              <span className="text-xl font-bold">Search Fund Hub</span>
            </Link>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
              EMPLOYER
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{session.user?.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Subnavigation */}
      <EmployerNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
