import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

function generatePassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const all = uppercase + lowercase + numbers

  let password = ''
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]

  for (let i = 3; i < 12; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }

  return password.split('').sort(() => Math.random() - 0.5).join('')
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { email, companyName, industry, website, description, autoApprove } = data

    // Validate required fields
    if (!email || !companyName) {
      return NextResponse.json({
        error: 'Email and company name are required'
      }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({
        error: 'Email already exists'
      }, { status: 400 })
    }

    // Generate temporary password
    const temporaryPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10)

    // Create user and employer
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'employer',
        employer: {
          create: {
            companyName,
            industry: industry || null,
            website: website || null,
            description: description || null,
            status: autoApprove ? 'approved' : 'pending',
            approvedBy: autoApprove ? session.user.email : null,
            approvedAt: autoApprove ? new Date() : null
          }
        }
      },
      include: {
        employer: true
      }
    })

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      temporaryPassword,
      employer: {
        id: user.employer!.id,
        companyName: user.employer!.companyName,
        status: user.employer!.status
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({
      error: 'Failed to create user'
    }, { status: 500 })
  }
}
