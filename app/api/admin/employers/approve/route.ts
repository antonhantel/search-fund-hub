import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { employerId } = await req.json()

  await prisma.employer.update({
    where: { id: employerId },
    data: {
      status: 'approved',
      approvedBy: session.user.email || 'admin',
      approvedAt: new Date()
    }
  })

  return NextResponse.json({ success: true })
}