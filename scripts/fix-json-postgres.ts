import { Pool } from 'pg'

// Direct PostgreSQL connection - bypasses Prisma entirely
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function fixData() {
  const client = await pool.connect()

  try {
    console.log('🔧 Starting direct database fix...\n')

    // Get all jobs with languageRequirements, casting to text to avoid JSON parsing
    const result = await client.query(`
      SELECT id, title, "languageRequirements"::text as lang_req
      FROM "Job"
      WHERE "languageRequirements" IS NOT NULL
    `)

    console.log(`Found ${result.rows.length} jobs with languageRequirements\n`)

    let fixedCount = 0

    for (const row of result.rows) {
      const { id, title, lang_req } = row

      try {
        // Try to parse as JSON
        const parsed = JSON.parse(lang_req)

        // If it's already an array, skip
        if (Array.isArray(parsed)) {
          console.log(`✓ ${title}: Already valid array`)
          continue
        }

        // If it's not an array, wrap it
        const fixed = JSON.stringify([parsed])
        await client.query(
          `UPDATE "Job" SET "languageRequirements" = $1::jsonb WHERE id = $2`,
          [fixed, id]
        )
        console.log(`✅ ${title}: Wrapped non-array JSON`)
        fixedCount++
      } catch (e) {
        // Invalid JSON string - wrap it
        const fixed = JSON.stringify([lang_req])
        await client.query(
          `UPDATE "Job" SET "languageRequirements" = $1::jsonb WHERE id = $2`,
          [fixed, id]
        )
        console.log(`✅ ${title}: Fixed invalid JSON "${lang_req}" -> ${fixed}`)
        fixedCount++
      }
    }

    console.log(`\n✨ Successfully fixed ${fixedCount} job(s)!`)
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

fixData()
  .then(() => {
    console.log('\n✅ Database fix complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })
