import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    const session = await auth()

    // Only allow admin users
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔧 Starting data fix...')

    // Get all jobs with raw SQL to bypass JSON parsing
    const jobs = await prisma.$queryRawUnsafe(`
      SELECT id, title, "languageRequirements"
      FROM "Job"
    `) as Array<{ id: string; title: string; languageRequirements: any }>

    let fixedCount = 0
    const errors = []

    for (const job of jobs) {
      if (!job.languageRequirements) continue

      try {
        // Check if it's a string that needs to be converted to JSON array
        if (typeof job.languageRequirements === 'string') {
          try {
            // Try to parse as JSON
            JSON.parse(job.languageRequirements)
            console.log(`✓ Job ${job.id}: Already valid JSON`)
          } catch {
            // It's an invalid string, convert to JSON array
            console.log(`⚠ Job ${job.id} (${job.title}): Converting "${job.languageRequirements}" to JSON array`)

            await prisma.$executeRawUnsafe(
              `UPDATE "Job" SET "languageRequirements" = $1 WHERE id = $2`,
              JSON.stringify([job.languageRequirements]),
              job.id
            )

            fixedCount++
          }
        }
      } catch (error: any) {
        const errorMsg = `Error fixing job ${job.id}: ${error.message}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedCount} job(s)`,
      fixedCount,
      totalJobs: jobs.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error: any) {
    console.error('Error in fix-data endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to fix data', details: error.message },
      { status: 500 }
    )
  }
}
