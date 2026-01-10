import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding new jobs to database...')

  // First, we need to create a default employer for these jobs
  // You can replace this with an existing employer ID
  let employer = await prisma.employer.findFirst({
    where: { companyName: 'Search Fund Hub' }
  })

  if (!employer) {
    console.log('Creating Search Fund Hub employer...')
    // Create a user for the employer
    const user = await prisma.user.create({
      data: {
        email: 'jobboard@searchfundhub.de',
        password: '$2a$10$dummy', // Placeholder password hash
        role: 'employer',
      }
    })

    employer = await prisma.employer.create({
      data: {
        userId: user.id,
        companyName: 'Search Fund Hub',
        description: 'Search Fund Hub - Connecting search fund professionals',
        status: 'approved',
        approvedAt: new Date(),
      }
    })
  }

  const jobs = [
    {
      title: 'Private Equity Intern – Independent Sponsor (Industrial Technology)',
      description: `Private Equity Intern – Independent Sponsor (Industrial Technology)

Location: Berlin oder London (On-Site)
Type: Fulltime
Duration: 3–6 Monate
Start: Mitte Feb / Anfang März

About the Founder:
- Ex Large-Cap PE
- Ex PE-backed CEO/CFO
- Aufbau und Exit einer Roll-up-Plattform
- Aktiver Search-Fund-Investor

Setup:
- Direkter Partnerkontakt
- Tägliches 1-zu-1-Mentoring
- Sehr leanes Team

Focus:
- Deal Sourcing
- Commercial DD
- LBO-Modelle
- Firm Building

Application: E-Mail an jobboard@searchfundhub.de mit Angabe "SFH-2"`,
      requirements: `- Strong interest in Private Equity and M&A
- Analytical skills and financial modeling experience
- Fluent in German and English
- Available for 3-6 months starting mid-February / early March
- Bachelor's or Master's student in Business, Finance, or related field`,
      location: 'Berlin oder London',
      industry: 'Private Equity',
      functionArea: 'Investment',
      salaryRange: 'Internship',
      status: 'active',
      languageRequirements: ['Deutsch', 'Englisch'],
      publishedAt: new Date(),
      approvedAt: new Date(),
    },
    {
      title: 'Student Assistant / Intern – M&A / ETA Advisory',
      description: `Student Assistant / Intern – M&A / ETA Advisory

Location: Quickborn / Remote
Hours: 10–20h per week
Start: ASAP

About the Founder:
- 20+ Jahre M&A-Manager in Industriegüter, Chemie und Chemiedistribution

Focus:
- Mittelstand
- Unternehmensnachfolge
- Kapitalstrukturierung
- Fundraising

Aufgaben:
- Marktanalysen
- Sourcing
- Investment Memos
- CRM und Automation

Application: E-Mail an jobboard@searchfundhub.de mit Angabe "SFH-3"`,
      requirements: `- Student in Business, Finance, or related field
- Interest in M&A and entrepreneurship through acquisition
- Strong analytical and research skills
- Experience with Excel and PowerPoint
- Self-motivated and able to work independently`,
      location: 'Quickborn / Remote',
      industry: 'M&A Advisory',
      functionArea: 'Advisory',
      salaryRange: 'Student position',
      status: 'active',
      languageRequirements: ['Deutsch', 'Englisch'],
      publishedAt: new Date(),
      approvedAt: new Date(),
    },
    {
      title: 'Working Student / Intern – Search Fund / Micro Private Equity',
      description: `Working Student / Intern – Search Fund / Micro Private Equity

Location: Remote / Hybrid
Hours: 20h per week
Start: ASAP

About the Founder:
- HSG MBA & Imperial Business School MBA
- Ex Big 4 Digital Transformation Manager
- 2 Jahre Advisor bei IT-Systemanbieter

Focus:
- Mittelstand-Nachfolge
- Digital Transformation

Aufgaben:
- Screening
- Valuation
- Due Diligence
- Automatisierung

Application: E-Mail an jobboard@searchfundhub.de mit Angabe "SFH-4"`,
      requirements: `- Student in Business, Finance, Computer Science, or related field
- Interest in search funds and entrepreneurship through acquisition
- Strong analytical skills and attention to detail
- Experience with financial modeling and valuation
- Interest in digital transformation and automation`,
      location: 'Remote / Hybrid',
      industry: 'Search Fund',
      functionArea: 'Investment',
      salaryRange: 'Working student position',
      status: 'active',
      languageRequirements: ['Deutsch', 'Englisch'],
      publishedAt: new Date(),
      approvedAt: new Date(),
    }
  ]

  for (const jobData of jobs) {
    const job = await prisma.job.create({
      data: {
        ...jobData,
        employerId: employer.id,
      }
    })
    console.log(`✅ Created job: ${job.title}`)
  }

  console.log('\n✨ Successfully added 3 new jobs!')
}

main()
  .catch((e) => {
    console.error('❌ Error adding jobs:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
