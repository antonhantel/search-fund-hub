import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { employer: true }
    })

    if (!user?.employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...user.employer,
      user: { email: user.email }
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { companyName, industry, website, description } = data

    if (!session.user.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { employer: true }
    })

    if (!user?.employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 })
    }

    const updatedEmployer = await prisma.employer.update({
      where: { id: user.employer.id },
      data: {
        companyName: companyName || user.employer.companyName,
        industry: industry || user.employer.industry,
        website: website || user.employer.website,
        description: description || user.employer.description,
      }
    })

    return NextResponse.json(updatedEmployer)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
