import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()

    const job = await prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        languageRequirements: data.languageRequirements,
        location: data.location,
        industry: data.industry,
        functionArea: data.functionArea,
        companySize: data.companySize,
        salaryRange: data.salaryRange,
        status: data.status,
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.job.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    )
  }
}
