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
    <nav className="sticky top-14 z-10 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 py-2">
          <Link href="/employer" className={getLinkClass('/employer')} aria-current={pathname === '/employer' ? 'page' : undefined}>
            Dashboard
          </Link>
          <Link href="/employer/jobs" className={getLinkClass('/employer/jobs')} aria-current={pathname.startsWith('/employer/jobs') ? 'page' : undefined}>
            My Jobs
          </Link>
          <Link href="/employer/jobs/new" className={getLinkClass('/employer/jobs/new')} aria-current={pathname.startsWith('/employer/jobs/new') ? 'page' : undefined}>
            Post Job
          </Link>
          <Link href="/employer/profile" className={getLinkClass('/employer/profile')} aria-current={pathname.startsWith('/employer/profile') ? 'page' : undefined}>
            Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}
