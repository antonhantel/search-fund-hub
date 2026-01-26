import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.employerId || !data.title || !data.description || !data.location) {
      return NextResponse.json(
        { error: "Missing required fields: employerId, title, description, location" },
        { status: 400 }
      )
    }

    // Verify employer exists and is approved
    const employer = await prisma.employer.findUnique({
      where: { id: data.employerId }
    })

    if (!employer) {
      return NextResponse.json(
        { error: "Employer not found" },
        { status: 404 }
      )
    }

    if (employer.status !== 'approved') {
      return NextResponse.json(
        { error: "Employer is not approved" },
        { status: 400 }
      )
    }

    // Create the job
    const job = await prisma.job.create({
      data: {
        employerId: data.employerId,
        title: data.title,
        description: data.description,
        requirements: data.requirements || null,
        languageRequirements: data.languageRequirements || null,
        location: data.location,
        industry: data.industry || null,
        functionArea: data.functionArea || null,
        companySize: data.companySize || null,
        salaryRange: data.salaryRange || null,
        status: data.status || 'draft',
        // If status is active, set publishedAt and approvedAt
        ...(data.status === 'active' && {
          publishedAt: new Date(),
          approvedAt: new Date(),
          approvedBy: session.user.email || 'admin'
        })
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    )
  }
}
