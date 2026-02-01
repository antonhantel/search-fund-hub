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

  // Update or create location tags
  const locationArray = Array.isArray(data.location) ? data.location : []
  for (const location of locationArray) {
    await prisma.locationTag.upsert({
      where: { name: location },
      create: { name: location, usageCount: 1 },
      update: { usageCount: { increment: 1 } },
    })
  }

  const job = await prisma.job.create({
    data: {
      employerId: session.user.employerId,
      title: data.title,
      description: data.description,
      requirements: data.requirements || null,
      languageRequirements: data.languageRequirements || null,
      location: locationArray.length > 0 ? locationArray : null,
      remoteAllowed: data.remoteAllowed || false,
      hybridAllowed: data.hybridAllowed || false,
      industry: data.industry || null,
      functionArea: data.function || data.functionArea || null,
      companySize: data.companySize || null,
      isFulltime: data.isFulltime ?? true,
      isParttime: data.isParttime ?? false,
      parttimeHoursRange: data.parttimeHoursRange || null,
      startingDateAsap: data.startingDateAsap ?? true,
      startingDate: data.startingDate ? new Date(data.startingDate) : null,
      status: data.isDraft ? 'draft' : 'pending',
    }
  })

  // Also update employer description and team profile if provided
  if (data.companyDescription || data.teamProfile) {
    await prisma.employer.update({
      where: { id: session.user.employerId },
      data: {
        ...(data.companyDescription && { description: data.companyDescription }),
        ...(data.teamProfile && { teamProfile: data.teamProfile }),
      }
    })
  }

  return NextResponse.json(job)
}
