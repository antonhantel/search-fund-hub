import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { InviteForm } from "./invite-form"

export default async function InviteEmployerPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Invite New Employer</h2>
      <p className="text-gray-600 mb-6">
        Create a new employer account. The employer will receive an email with login credentials.
      </p>
      <InviteForm />
    </div>
  )
}
