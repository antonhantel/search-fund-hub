import { auth } from "@/lib/auth"  // NICHT von @/auth!
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== 'admin') {
    redirect('/login')
  }

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
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Overview
                </Link>
                <Link
                  href="/admin/employers"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Employers
                </Link>
                <Link
                  href="/admin/jobs"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Jobs
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">{session.user?.email}</span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-red-600 hover:text-red-800"
              >
                Sign out
              </Link>
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