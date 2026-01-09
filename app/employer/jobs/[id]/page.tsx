import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { EditForm } from "./edit-form"

export default async function EmployerEditJobPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  
  if (!session?.user?.employerId) {
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
  if (job.employer.id !== session.user.employerId) {
    redirect("/employer/jobs")
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Job</h2>
        <p className="text-gray-600 mt-1">
          {job.employer.companyName} • {job.title}
        </p>
      </div>
      <EditForm job={job} />
    </div>
  )
}
