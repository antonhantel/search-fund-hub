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
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
          <Link
            href="/employer/jobs/new"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {job.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                      {job.location && <span>📍 {job.location}</span>}
                      {job.industry && <span>🏢 {job.industry}</span>}
                      <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    {getStatusBadge(job.status)}
                    <div className="flex gap-2">
                      <Link
                        href={`/employer/jobs/${job.id}`}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </Link>
                      <DeleteButton jobId={job.id} />
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