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
    const baseClass = 'px-4 py-2.5 font-medium rounded-lg transition-all'
    if (isActive(href)) {
      return `${baseClass} bg-blue-600 text-white`
    }
    return `${baseClass} text-slate-400 hover:text-white hover:bg-slate-700`
  }

  return (
    <nav className="bg-slate-800/30 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 py-3 overflow-x-auto">
          <Link href="/employer" className={getLinkClass('/employer')} aria-current={pathname === '/employer' ? 'page' : undefined}>
            Dashboard
          </Link>
          <Link href="/employer/jobs" className={getLinkClass('/employer/jobs')} aria-current={pathname.startsWith('/employer/jobs') && !pathname.includes('new') ? 'page' : undefined}>
            My Jobs
          </Link>
          <Link href="/employer/applications" className={getLinkClass('/employer/applications')} aria-current={pathname.startsWith('/employer/applications') ? 'page' : undefined}>
            Pipeline
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
