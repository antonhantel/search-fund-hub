import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()

    const employer = await prisma.employer.update({
      where: { id: params.id },
      data: {
        companyName: data.companyName,
        industry: data.industry,
        website: data.website,
        description: data.description,
        status: data.status,
      },
    })

    return NextResponse.json(employer)
  } catch (error) {
    console.error("Error updating employer:", error)
    return NextResponse.json(
      { error: "Failed to update employer" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.employer.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting employer:", error)
    return NextResponse.json(
      { error: "Failed to delete employer" },
      { status: 500 }
    )
  }
}
