import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendApplicationConfirmation, sendNewApplicationNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const jobId = formData.get('jobId') as string
    const candidateName = formData.get('candidateName') as string
    const candidateEmail = formData.get('candidateEmail') as string
    const linkedinUrl = formData.get('linkedinUrl') as string | null
    const coverLetter = formData.get('coverLetter') as string | null
    const resumeFile = formData.get('resume') as File | null

    // Validation
    if (!jobId || !candidateName || !candidateEmail) {
      return NextResponse.json(
        { error: 'Job ID, name, and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(candidateEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Verify the job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId, status: 'active' },
      include: {
        employer: {
          include: {
            user: { select: { email: true } }
          }
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or no longer accepting applications' },
        { status: 404 }
      )
    }

    // Check for duplicate application (same email + job)
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        candidateEmail: candidateEmail.toLowerCase()
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 409 }
      )
    }

    // Handle resume file upload
    // For now, we'll store the file as a data URL or external link
    // In production, you'd upload to S3/Cloudinary/etc.
    let resumeUrl: string | null = null

    if (resumeFile && resumeFile.size > 0) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(resumeFile.type)) {
        return NextResponse.json(
          { error: 'Resume must be a PDF or Word document' },
          { status: 400 }
        )
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (resumeFile.size > maxSize) {
        return NextResponse.json(
          { error: 'Resume file size must be less than 5MB' },
          { status: 400 }
        )
      }

      // Convert to base64 data URL for storage
      // In production, upload to cloud storage and store the URL
      const bytes = await resumeFile.arrayBuffer()
      const base64 = Buffer.from(bytes).toString('base64')
      resumeUrl = `data:${resumeFile.type};base64,${base64}`
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        jobId,
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.toLowerCase().trim(),
        linkedinUrl: linkedinUrl?.trim() || null,
        resumeUrl,
        coverLetter: coverLetter?.trim() || null,
        stage: 'new'
      }
    })

    // Send confirmation email to applicant
    await sendApplicationConfirmation({
      candidateName,
      candidateEmail,
      jobTitle: job.title,
      companyName: job.employer.companyName
    })

    // Send notification email to employer
    if (job.employer.user?.email) {
      await sendNewApplicationNotification({
        employerEmail: job.employer.user.email,
        candidateName,
        jobTitle: job.title,
        applicationId: application.id
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application.id
    })
  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    )
  }
}
