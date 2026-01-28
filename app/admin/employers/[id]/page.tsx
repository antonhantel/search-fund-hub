import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { EditForm } from "./edit-form"

export const dynamic = 'force-dynamic'

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
    <div>
      <div className="mb-6">
        <Link href="/admin/employers" className="text-blue-400 hover:text-blue-300 text-sm mb-2 inline-block">
          ← Back to Employers
        </Link>
        <h2 className="text-2xl font-bold text-white">Edit Employer</h2>
        <p className="text-slate-400 mt-1">
          {employer.companyName} • {employer.user.email}
        </p>
      </div>
      <EditForm employer={employer} jobCount={employer._count.jobs} />
    </div>
  )
}
