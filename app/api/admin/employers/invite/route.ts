import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// Generate a random password
function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    // Only allow admin users
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, companyName, industry, website, description, autoApprove } = body

    // Validate required fields
    if (!email || !companyName) {
      return NextResponse.json(
        { error: 'Email and company name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Generate password
    const password = generatePassword()
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and employer
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
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
            approvedAt: autoApprove ? new Date() : null,
          }
        }
      },
      include: {
        employer: true
      }
    })

    // In a real app, you would send an email here
    // For now, we return the password in the response
    console.log(`Created employer account: ${email} with password: ${password}`)

    return NextResponse.json({
      success: true,
      email: user.email,
      password: password, // In production, send this via email instead
      employer: user.employer
    })
  } catch (error) {
    console.error('Error creating employer:', error)
    return NextResponse.json(
      { error: 'Failed to create employer account' },
      { status: 500 }
    )
  }
}
