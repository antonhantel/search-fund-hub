import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { JobForm } from "./job-form"

export const dynamic = 'force-dynamic'

export default async function NewJobPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  // Get employerId and employer data from session or lookup
  let employerId = session.user?.employerId
  let employer = null

  if (!employerId && session.user?.email) {
    employer = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (employer) employerId = employer.id
  } else if (employerId) {
    employer = await prisma.employer.findUnique({
      where: { id: employerId }
    })
  }

  if (!employerId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">No Employer Account</h2>
        <p className="text-slate-400">Please contact support to link your employer account.</p>
      </div>
    )
  }

  const employerData = employer ? {
    industry: employer.industry || undefined,
    description: employer.description || undefined,
    teamProfile: employer.teamProfile || undefined,
  } : undefined

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Post New Job</h2>
        <p className="text-slate-400 mt-2">Create a new job posting for your search fund</p>
      </div>
      <JobForm employerId={employerId} employerData={employerData} />
    </div>
  )
}
