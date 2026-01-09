"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700"
          >
            Search Fund Jobs
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/jobs"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Browse Jobs
            </Link>

            <div className="flex items-center gap-4">
              {session?.user ? (
                <>
                  <span className="text-sm text-gray-600">
                    {session.user.email}
                  </span>
                  <Link 
                    href={session.user.role === "admin" ? "/admin/jobs" : "/employer/jobs"}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link 
              href="/jobs"
              className="block text-gray-700 hover:text-blue-600 font-medium"
            >
              Browse Jobs
            </Link>
            {session?.user ? (
              <>
                <Link 
                  href={session.user.role === "admin" ? "/admin/jobs" : "/employer/jobs"}
                  className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
