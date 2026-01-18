import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { EditForm } from "./edit-form"

export default async function AdminEditJobPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login")
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      employer: {
        select: {
          companyName: true
        }
      }
    }
  })

  if (!job) {
    redirect("/admin/jobs")
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/jobs" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
          ← Back to Jobs
        </Link>
        <h2 className="text-2xl font-bold text-white">Edit Job</h2>
        <p className="text-slate-400 mt-1">
          {job.employer.companyName} • {job.title}
        </p>
      </div>
      <EditForm job={job} />
    </div>
  )
}
