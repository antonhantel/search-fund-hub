import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import KanbanBoard from "./kanban-board"

export const dynamic = 'force-dynamic'

export default async function ApplicationsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Resolve employerId
  let employerId = session.user?.employerId

  if (!employerId && session.user?.email) {
    const employer = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (employer) employerId = employer.id
  }

  if (!employerId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Employer Account</h2>
        <p className="text-gray-600">Please contact support to link your employer account.</p>
      </div>
    )
  }

  // Fetch all jobs with their applications
  const jobs = await prisma.job.findMany({
    where: { employerId },
    include: {
      applications: {
        orderBy: { appliedAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Flatten all applications with job info
  const allApplications = jobs.flatMap(job => 
    job.applications.map(app => ({
      ...app,
      jobTitle: job.title,
      jobId: job.id
    }))
  )

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Applicant Pipeline</h2>
        <p className="text-gray-600 mt-2">
          Track and manage candidates through your recruiting process
        </p>
      </div>

      <KanbanBoard 
        applications={allApplications}
        jobs={jobs.map(j => ({ id: j.id, title: j.title }))}
      />
    </div>
  )
}
