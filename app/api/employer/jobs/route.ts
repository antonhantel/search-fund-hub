import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'employer' || !session.user.employerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()

  const job = await prisma.job.create({
    data: {
      employerId: session.user.employerId,
      title: data.title,
      description: data.description,
      requirements: data.requirements || null,
      languageRequirements: data.languageRequirements || null,
      location: data.location,
      industry: data.industry || null,
      functionArea: data.function || data.functionArea || null,
      companySize: data.companySize || null,
      salaryRange: data.salaryRange || null,
      remoteType: data.remoteType || null,
      preExperience: data.preExperience || null,
      linkedinUrl: data.linkedinUrl || null,
      status: data.status || 'draft'
    }
  })

  return NextResponse.json(job)
}