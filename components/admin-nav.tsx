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
    const baseClass = 'px-4 py-2.5 font-medium rounded-lg transition-all'
    if (isActive(href)) {
      return `${baseClass} bg-blue-600 text-white`
    }
    return `${baseClass} text-slate-300 hover:text-white hover:bg-slate-700`
  }

  return (
    <nav className="bg-slate-800/30 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 py-3 overflow-x-auto">
          <Link href="/admin" className={getLinkClass('/admin')} aria-current={pathname === '/admin' ? 'page' : undefined}>
            Dashboard
          </Link>
          <Link href="/admin/jobs" className={getLinkClass('/admin/jobs')} aria-current={pathname.startsWith('/admin/jobs') ? 'page' : undefined}>
            Jobs
          </Link>
          <Link href="/admin/employers" className={getLinkClass('/admin/employers')} aria-current={pathname.startsWith('/admin/employers') ? 'page' : undefined}>
            Employers
          </Link>
        </div>
      </div>
    </nav>
  )
}
