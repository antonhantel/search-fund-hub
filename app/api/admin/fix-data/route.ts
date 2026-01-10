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
      SELECT id, title, "languageRequirements"::text as "languageRequirements"
      FROM "Job"
    `) as Array<{ id: string; title: string; languageRequirements: string | null }>

    let fixedCount = 0
    const errors = []
    const fixed = []

    for (const job of jobs) {
      if (!job.languageRequirements) continue

      try {
        // Check if it's already valid JSON
        try {
          const parsed = JSON.parse(job.languageRequirements)
          // If it parses and is an array, it's good
          if (Array.isArray(parsed)) {
            console.log(`✓ Job ${job.id}: Already valid JSON array`)
            continue
          }
          // If it parses but is not an array, wrap it
          console.log(`⚠ Job ${job.id}: Valid JSON but not array, wrapping...`)
          await prisma.$executeRawUnsafe(
            `UPDATE "Job" SET "languageRequirements" = $1::jsonb WHERE id = $2`,
            JSON.stringify([parsed]),
            job.id
          )
          fixedCount++
          fixed.push({ id: job.id, title: job.title, from: job.languageRequirements, to: JSON.stringify([parsed]) })
        } catch {
          // It's an invalid string, convert to JSON array
          console.log(`⚠ Job ${job.id} (${job.title}): Converting "${job.languageRequirements}" to JSON array`)

          const fixedValue = JSON.stringify([job.languageRequirements])
          await prisma.$executeRawUnsafe(
            `UPDATE "Job" SET "languageRequirements" = $1::jsonb WHERE id = $2`,
            fixedValue,
            job.id
          )

          fixedCount++
          fixed.push({ id: job.id, title: job.title, from: job.languageRequirements, to: fixedValue })
        }
      } catch (error: any) {
        const errorMsg = `Error fixing job ${job.id}: ${error.message}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    console.log(`\n✨ Fixed ${fixedCount} job(s) out of ${jobs.length} total`)
    if (fixed.length > 0) {
      console.log('Fixed jobs:', fixed)
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedCount} job(s)`,
      fixedCount,
      totalJobs: jobs.length,
      fixed: fixed.length > 0 ? fixed : undefined,
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
