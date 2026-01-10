import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { EditForm } from "./edit-form"

export default async function AdminEditEmployerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login")
  }

  const employer = await prisma.employer.findUnique({
    where: { id },
    include: {
      user: {
        select: { email: true }
      },
      _count: {
        select: { jobs: true }
      }
    }
  })

  if (!employer) {
    redirect("/admin/employers")
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Employer</h2>
        <p className="text-gray-600 mt-1">
          {employer.companyName} • {employer.user.email}
        </p>
      </div>
      <EditForm employer={employer} jobCount={employer._count.jobs} />
    </div>
  )
}
