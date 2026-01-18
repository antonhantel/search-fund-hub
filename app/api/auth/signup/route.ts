import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, companyName, linkedinUrl } = await request.json()

    // Validate input
    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: "Email, password, and company name are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and employer in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "employer"
        }
      })

      const employer = await tx.employer.create({
        data: {
          userId: user.id,
          companyName,
          linkedinUrl: linkedinUrl || null,
          status: "pending" // Requires admin approval
        }
      })

      return { user, employer }
    })

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Pending admin approval."
    })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    )
  }
}
