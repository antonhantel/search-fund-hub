'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function EmployerNav() {
  const pathname = usePathname()

  const isActive = (href: string): boolean => {
    if (href === '/employer') {
      return pathname === '/employer'
    }
    return pathname.startsWith(href)
  }

  const getLinkClass = (href: string): string => {
    const baseClass = 'px-4 py-3 font-medium transition-colors border-b-2'
    if (isActive(href)) {
      return `${baseClass} bg-blue-50 text-blue-600 border-blue-600`
    }
    return `${baseClass} text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-300`
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1">
          <Link href="/employer" className={getLinkClass('/employer')}>
            Dashboard
          </Link>
          <Link href="/employer/jobs" className={getLinkClass('/employer/jobs')}>
            My Jobs
          </Link>
          <Link href="/employer/jobs/new" className={getLinkClass('/employer/jobs/new')}>
            Post Job
          </Link>
        </div>
      </div>
    </nav>
  )
}
