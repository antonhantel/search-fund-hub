import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import JobForm from "./job-form"

export default async function NewJobPage() {
  const session = await auth()
  
  if (!session?.user?.employerId) {
    redirect('/login')
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Post New Job</h2>
      <JobForm employerId={session.user.employerId} />
    </div>
  )
}