"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Don't show navbar on admin or employer pages (they have their own headers)
  if (pathname.startsWith('/admin') || pathname.startsWith('/employer')) {
    return null
  }

  // Check if we're on a dark page (landing, login, signup, for-employers, jobs)
  const isDarkPage = pathname === '/' || pathname === '/login' || pathname.startsWith('/signup') || pathname === '/for-employers' || pathname.startsWith('/jobs')

  return (
    <nav className={`fixed top-0 w-full z-50 ${isDarkPage ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700' : 'bg-white shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center"
          >
            <img
              src={isDarkPage ? "/logo-white.svg" : "/logo.svg"}
              alt="Search Fund Hub"
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/jobs"
              className={`font-medium transition ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Browse Jobs
            </Link>
            <Link 
              href="/for-employers"
              className={`font-medium transition ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              For Employers
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
                <>
                  <Link 
                    href="/login"
                    className={`px-4 py-2 rounded-lg transition font-medium ${isDarkPage ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-700 hover:text-blue-600'}`}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-medium"
                  >
                    Sign Up
                  </Link>
                </>
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
              href="/jobs"
              className={`block font-medium ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Browse Jobs
            </Link>
            <Link 
              href="/for-employers"
              className={`block font-medium ${isDarkPage ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              For Employers
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
              <>
                <Link 
                  href="/login"
                  className={`block px-4 py-2 ${isDarkPage ? 'text-slate-300' : 'text-gray-700'}`}
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
