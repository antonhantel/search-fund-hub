import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Fixing invalid languageRequirements data...')

  // Get all jobs
  const jobs = await prisma.$queryRawUnsafe(`
    SELECT id, "languageRequirements"
    FROM "Job"
    WHERE "languageRequirements" IS NOT NULL
  `) as Array<{ id: string; languageRequirements: any }>

  let fixedCount = 0

  for (const job of jobs) {
    try {
      // Try to parse as JSON
      if (typeof job.languageRequirements === 'string') {
        try {
          JSON.parse(job.languageRequirements)
          // If it parses, it's already valid JSON
          console.log(`✓ Job ${job.id}: Valid JSON`)
        } catch {
          // It's an invalid string, convert to array
          console.log(`⚠ Job ${job.id}: Invalid JSON "${job.languageRequirements}" - converting to array`)

          // Convert string to array
          const fixedValue = [job.languageRequirements]

          await prisma.job.update({
            where: { id: job.id },
            data: { languageRequirements: fixedValue as any }
          })

          fixedCount++
          console.log(`✅ Job ${job.id}: Fixed`)
        }
      }
    } catch (error) {
      console.error(`❌ Job ${job.id}: Error -`, error)
    }
  }

  console.log(`\n✨ Fixed ${fixedCount} job(s) with invalid languageRequirements`)
  console.log(`✓ Checked ${jobs.length} total job(s)`)
}

main()
  .catch((e) => {
    console.error('❌ Error fixing database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
