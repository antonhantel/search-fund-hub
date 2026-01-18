import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { EditForm } from "./edit-form"

export default async function EmployerEditJobPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  // Get employerId
  let employerId = session.user?.employerId

  if (!employerId && session.user?.email) {
    const employer = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (employer) employerId = employer.id
  }

  if (!employerId) {
    redirect("/login")
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      employer: {
        select: {
          id: true,
          companyName: true
        }
      }
    }
  })

  if (!job) {
    redirect("/employer/jobs")
  }

  // Verify ownership
  if (job.employer.id !== employerId) {
    redirect("/employer/jobs")
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/employer/jobs" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
          ← Back to My Jobs
        </Link>
        <h2 className="text-2xl font-bold text-white">Edit Job</h2>
        <p className="text-slate-400 mt-1">{job.title}</p>
      </div>
      <EditForm job={job} />
    </div>
  )
}
