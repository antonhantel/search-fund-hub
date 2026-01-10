import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { DeleteButton } from "./delete-button"

export default async function EmployerJobsPage() {
  const session = await auth()
  
  if (!session?.user?.employerId) {
    redirect('/login')
  }

  const jobs = await prisma.job.findMany({
    where: { employerId: session.user.employerId },
    orderBy: { createdAt: 'desc' }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">Draft</span>
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Pending Review</span>
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Active</span>
      case 'closed':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Closed</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">{status}</span>
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Jobs</h2>
        <Link
          href="/employer/jobs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-md"
        >
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">You haven&apos;t posted any jobs yet.</p>
          <Link
            href="/employer/jobs/new"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">{job.title}</h3>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      {job.location && <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">📍 {job.location}</span>}
                      {job.industry && <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">🏢 {job.industry}</span>}
                      <span className="text-sm text-gray-500">Created {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-700 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(job.status)}
                    <div className="flex items-center gap-2">
                      <Link href={`/employer/jobs/${job.id}`} aria-label={`Edit ${job.title}`} className="p-2 rounded-md hover:bg-gray-100">
                        <span role="img" aria-hidden="true" className="text-gray-600">✏️</span>
                      </Link>
                      <button aria-label={`Delete ${job.title}`} className="p-2 rounded-md hover:bg-red-50">
                        <span role="img" aria-hidden="true" className="text-red-600">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}