"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  // Check if we should hide navbar (admin/employer pages have their own headers)
  const shouldHideNavbar = pathname.startsWith('/admin') || pathname.startsWith('/employer')

  // Check if we're on a dark page (landing, login, signup, for-employers, jobs, team)
  const isDarkPage = pathname === '/' || pathname === '/login' || pathname.startsWith('/signup') || pathname === '/for-employers' || pathname.startsWith('/jobs') || pathname === '/team'

  // Scroll handler for homepage - show navbar after scrolling past hero logo
  useEffect(() => {
    if (!isHomePage || shouldHideNavbar) {
      setIsVisible(true)
      return
    }

    const handleScroll = () => {
      // Show navbar after scrolling 250px (past the hero logo)
      const scrollThreshold = 250
      setIsVisible(window.scrollY > scrollThreshold)
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage, shouldHideNavbar])

  // Don't show navbar on admin or employer pages (they have their own headers)
  if (shouldHideNavbar) {
    return null
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-transform duration-300 ${
      isHomePage && !isVisible ? '-translate-y-full' : 'translate-y-0'
    } ${isDarkPage ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700' : 'bg-white shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center"
          >
            <img
              src={isDarkPage ? "/logo-white.png" : "/Logo-blue.png"}
              alt="Search Fund Hub"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#events-community"
              className={`font-medium transition ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Events & Community
            </Link>
            <Link
              href="/jobs"
              className={`font-medium transition ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Job Board
            </Link>
            <Link
              href="/for-employers"
              className={`font-medium transition ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              For Employers
            </Link>
            <Link
              href="/team"
              className={`font-medium transition ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Team
            </Link>

            <div className="flex items-center gap-4">
              {session?.user ? (
                <>
                  <Link
                    href={session.user.role === "admin" ? "/admin" : "/employer"}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className={`px-4 py-2 rounded-lg transition font-medium ${isDarkPage ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-medium"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className={`w-6 h-6 ${isDarkPage ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className={`md:hidden mt-4 space-y-4 pb-4 ${isDarkPage ? 'text-white' : ''}`}>
            <Link
              href="/#events-community"
              className={`block font-medium ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Events & Community
            </Link>
            <Link
              href="/jobs"
              className={`block font-medium ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Job Board
            </Link>
            <Link
              href="/for-employers"
              className={`block font-medium ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              For Employers
            </Link>
            <Link
              href="/team"
              className={`block font-medium ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Team
            </Link>
            {session?.user ? (
              <>
                <Link
                  href={session.user.role === "admin" ? "/admin" : "/employer"}
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${isDarkPage ? 'text-slate-300 hover:bg-slate-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
