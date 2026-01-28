import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { NextResponse } from "next/server"

// PATCH - Update application stage
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let employerId = session.user?.employerId

  if (!employerId && session.user?.email) {
    const employer = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (employer) employerId = employer.id
  }

  if (!employerId) {
    return NextResponse.json({ error: 'No employer account found' }, { status: 403 })
  }

  const { applicationId, stage } = await req.json()

  if (!applicationId || !stage) {
    return NextResponse.json({ error: 'Missing applicationId or stage' }, { status: 400 })
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true }
  })

  if (!application || application.job.employerId !== employerId) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { stage }
  })

  return NextResponse.json({ success: true, stage: updated.stage })
}

// DELETE - Delete application
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let employerId = session.user?.employerId

  if (!employerId && session.user?.email) {
    const employer = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (employer) employerId = employer.id
  }

  if (!employerId) {
    return NextResponse.json({ error: 'No employer account found' }, { status: 403 })
  }

  const { applicationId } = await req.json()

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true }
  })

  if (!application || application.job.employerId !== employerId) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  await prisma.application.delete({
    where: { id: applicationId }
  })

  return NextResponse.json({ success: true })
}

// POST - Add application
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let employerId = session.user?.employerId

  if (!employerId && session.user?.email) {
    const employer = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (employer) employerId = employer.id
  }

  if (!employerId) {
    return NextResponse.json({ error: 'No employer account found' }, { status: 403 })
  }

  const data = await req.json()

  const job = await prisma.job.findUnique({
    where: { id: data.jobId }
  })

  if (!job || job.employerId !== employerId) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  const application = await prisma.application.create({
    data: {
      jobId: data.jobId,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail,
      linkedinUrl: data.linkedinUrl || null,
      notes: data.notes || null,
      stage: 'new'
    }
  })

  return NextResponse.json({
    success: true,
    application: {
      ...application,
      appliedAt: application.appliedAt.toISOString()
    }
  })
}
