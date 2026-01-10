'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ReactNode } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

function NavLink({
  href,
  pathname,
  children,
}: {
  href: string
  pathname: string
  children: ReactNode
}) {
  const isActive =
    pathname === href || (href !== '/admin' && pathname.startsWith(href))
  const baseClass =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors"
  const activeClass = isActive
    ? "bg-blue-100 text-blue-900"
    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"

  return (
    <Link href={href} className={`${baseClass} ${activeClass}`}>
      {children}
    </Link>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="ml-10 flex items-center space-x-4">
                <NavLink href="/admin" pathname={pathname}>
                  Overview
                </NavLink>
                <NavLink href="/admin/employers" pathname={pathname}>
                  Employers
                </NavLink>
                <NavLink href="/admin/jobs" pathname={pathname}>
                  Jobs
                </NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}