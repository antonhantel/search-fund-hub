'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminNav() {
  const pathname = usePathname()

  const isActive = (href: string): boolean => {
    if (href === '/admin') {
      return pathname === '/admin'
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
          <Link href="/admin" className={getLinkClass('/admin')} aria-current={pathname === '/admin' ? 'page' : undefined}>
            Dashboard
          </Link>
          <Link href="/admin/employers" className={getLinkClass('/admin/employers')} aria-current={pathname.startsWith('/admin/employers') ? 'page' : undefined}>
            Employers
          </Link>
          <Link href="/admin/jobs" className={getLinkClass('/admin/jobs')} aria-current={pathname.startsWith('/admin/jobs') ? 'page' : undefined}>
            Jobs
          </Link>
          <Link href="/admin/users/new" className={getLinkClass('/admin/users/new')} aria-current={pathname.startsWith('/admin/users/new') ? 'page' : undefined}>
            Create User
          </Link>
          <Link href="/admin/profile" className={getLinkClass('/admin/profile')} aria-current={pathname.startsWith('/admin/profile') ? 'page' : undefined}>
            Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}
