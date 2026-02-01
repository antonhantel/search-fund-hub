'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function updateApplicationStage(applicationId: string, newStage: string) {
  const session = await auth()

  if (!session) {
    throw new Error('Unauthorized')
  }

  // Verify the application belongs to one of the employer's jobs
  let employerId = session.user?.employerId

  if (!employerId && session.user?.email) {
    const employer = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (employer) employerId = employer.id
  }

  if (!employerId) {
    throw new Error('No employer account found')
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true }
  })

  if (!application || application.job.employerId !== employerId) {
    throw new Error('Application not found or unauthorized')
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: {
      stage: newStage,
      stageChangedAt: new Date()
    }
  })

  // DO NOT call revalidatePath here - it causes the page to re-fetch
  // and reset client state. The optimistic update handles the UI,
  // and the database is already updated.

  return { success: true, stage: updated.stage }
}

export async function addApplication(data: {
  candidateName: string
  candidateEmail: string
  linkedinUrl?: string
  resumeUrl?: string
  jobId: string
  notes?: string
}) {
  const session = await auth()

  if (!session) {
    throw new Error('Unauthorized')
  }

  // Verify the job belongs to the employer
  let employerId = session.user?.employerId

  if (!employerId && session.user?.email) {
    const employer = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (employer) employerId = employer.id
  }

  if (!employerId) {
    throw new Error('No employer account found')
  }

  const job = await prisma.job.findUnique({
    where: { id: data.jobId }
  })

  if (!job || job.employerId !== employerId) {
    throw new Error('Job not found or unauthorized')
  }

  const application = await prisma.application.create({
    data: {
      jobId: data.jobId,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail,
      linkedinUrl: data.linkedinUrl || null,
      resumeUrl: data.resumeUrl || null,
      notes: data.notes || null,
      stage: 'screening',
      stageChangedAt: new Date()
    }
  })

  return {
    success: true,
    application: {
      ...application,
      appliedAt: application.appliedAt.toISOString(),
      stageChangedAt: application.stageChangedAt.toISOString()
    }
  }
}

export async function deleteApplication(applicationId: string) {
  const session = await auth()

  if (!session) {
    throw new Error('Unauthorized')
  }

  // Verify the application belongs to one of the employer's jobs
  let employerId = session.user?.employerId

  if (!employerId && session.user?.email) {
    const employer = await prisma.employer.findFirst({
      where: { user: { email: session.user.email } }
    })
    if (employer) employerId = employer.id
  }

  if (!employerId) {
    throw new Error('No employer account found')
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true }
  })

  if (!application || application.job.employerId !== employerId) {
    throw new Error('Application not found or unauthorized')
  }

  await prisma.application.delete({
    where: { id: applicationId }
  })

  return { success: true }
}
