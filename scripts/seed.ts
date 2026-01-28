import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.job.deleteMany({})
  await prisma.employer.deleteMany({})
  await prisma.user.deleteMany({})

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@searchfundhub.de' },
    update: {},
    create: {
      email: 'admin@searchfundhub.de',
      password: adminPassword,
      role: 'admin'
    }
  })
  console.log('✅ Admin user created: admin@searchfundhub.de')

  // Create Demo Employer User
  const demoEmployerPassword = await bcrypt.hash('Employer123', 10)
  const demoEmployer = await prisma.user.upsert({
    where: { email: 'employer@searchfundhub.de' },
    update: {},
    create: {
      email: 'employer@searchfundhub.de',
      password: demoEmployerPassword,
      role: 'employer',
      employer: {
        create: {
          companyName: 'Demo Search Fund',
          industry: 'Private Equity',
          website: 'https://demo-searchfund.de',
          description: 'Demo employer account for testing and demonstration purposes.',
          status: 'approved',
          approvedBy: 'admin@searchfundhub.de',
          approvedAt: new Date()
        }
      }
    }
  })
  console.log('✅ Demo employer created: employer@searchfundhub.de')

  // Create Real German Search Fund Employers
  const employers = [
    {
      email: 'contact@indepsponssor-berlin.de',
      companyName: 'Independent Sponsor Berlin',
      industry: 'Private Equity',
      website: 'https://independent-sponsor-berlin.de',
      description: 'Experienced PE professionals focused on industrial technology investments. Founder background: ex Large-Cap PE, ex PE-backed CEO/CFO, previous roll-up platform exit, active search fund investor.',
      status: 'approved'
    },
    {
      email: 'contact@mittelstand-ma.de',
      companyName: 'Mittelstand M&A Advisory',
      industry: 'Consulting',
      website: 'https://mittelstand-ma-advisory.de',
      description: 'M&A advisory specialists for German Mittelstand companies. Founder: 20+ years M&A manager in industrial goods, chemicals, and chemical distribution.',
      status: 'approved'
    },
    {
      email: 'contact@digital-transformation-sf.de',
      companyName: 'Digital Transformation Search Fund',
      industry: 'Technology',
      website: 'https://digital-transformation-searchfund.de',
      description: 'Search fund focused on Mittelstand succession and digital transformation. Founder: HSG MBA & Imperial Business School MBA, ex Big 4 Digital Transformation Manager, 2 years advisor at IT system provider.',
      status: 'approved'
    }
  ]

  const createdEmployers = []
  for (const emp of employers) {
    const password = await bcrypt.hash('employer123', 10)
    const user = await prisma.user.create({
      data: {
        email: emp.email,
        password: password,
        role: 'employer',
        employer: {
          create: {
            companyName: emp.companyName,
            industry: emp.industry,
            website: emp.website,
            description: emp.description,
            status: emp.status,
            approvedBy: emp.status === 'approved' ? admin.email : null,
            approvedAt: emp.status === 'approved' ? new Date() : null
          }
        }
      },
      include: {
        employer: true
      }
    })
    createdEmployers.push(user.employer!)
    console.log(`✅ Created employer: ${emp.companyName}`)
  }

  // Create Real German Search Fund Jobs
  const jobs = [
    {
      employerId: createdEmployers[0].id,
      title: 'Private Equity Intern – Independent Sponsor (Industrial Technology)',
      description: `Work directly with experienced PE professionals in industrial technology investments.

About Us:
We are an independent sponsor focused on acquiring and growing industrial technology companies. Our founder has a strong background in Large-Cap PE, PE-backed operations (CEO/CFO roles), successful roll-up platform exits, and is an active search fund investor.

The Opportunity:
This is a rare chance to work alongside experienced PE professionals in deal sourcing, commercial due diligence, and company building. You'll be part of a very lean team with direct partner contact and daily 1-on-1 mentoring.

Key Responsibilities:
- Deal sourcing and market research
- Commercial due diligence on target companies
- Build LBO financial models
- Contribute to firm building and strategy
- Support the investment process end-to-end`,
      requirements: `What You'll Bring:
- Strong analytical and financial modeling skills
- Enthusiasm for industrial technology and manufacturing
- Ability to work independently and take ownership
- Excellent communication skills in German and English
- MBA or strong undergraduate background preferred
- Interest in private equity and search funds

Position Details:
- Start: Mid-February / Early March 2026
- Duration: 3-6 months
- Schedule: Full-time, on-site in Berlin or London
- Type: Internship`,
      languageRequirements: ['German (Native)', 'English (Business)'],
      location: 'Berlin or London',
      industry: 'Private Equity',
      functionArea: 'Investment Banking',
      companySize: '1-10 employees',
      salaryRange: '€1,500 - €2,000/month',
      status: 'published',
      approvedBy: 'admin@searchfundhub.de',
      approvedAt: new Date(),
      publishedAt: new Date()
    },
    {
      employerId: createdEmployers[1].id,
      title: 'Student Assistant / Intern – M&A / ETA Advisory',
      description: `Support M&A advisory for German Mittelstand companies in transformation and growth phases.

About Us:
We specialize in M&A advisory for German Mittelstand companies. Our founder brings 20+ years of experience as an M&A manager in industrial goods, chemicals, and chemical distribution sectors.

The Role:
You'll be part of a lean advisory team working on meaningful transactions and strategic projects for established German companies. Focus areas include Mittelstand M&A, business succession planning, capital structuring, and fundraising.

What You'll Do:
- Conduct market analyses and competitive research
- Identify and qualify acquisition targets
- Prepare investment memos and due diligence materials
- Support CRM and deal automation
- Contribute to strategic planning sessions
- Research and analysis for client presentations`,
      requirements: `What We're Looking For:
- Enrolled student (business, finance, or related field)
- Strong analytical skills and attention to detail
- Interest in M&A, corporate finance, or strategy
- Good German and English communication skills
- Ability to manage 10-20 hours per week
- Proactive approach and self-starter mentality

Position Details:
- Hours: 10-20 hours per week (flexible)
- Start: ASAP
- Location: Quickborn or Remote
- Compensation: €15-20/hour`,
      languageRequirements: ['German (Native)', 'English (Business)'],
      location: 'Quickborn or Remote',
      industry: 'Consulting',
      functionArea: 'Strategy',
      companySize: '1-10 employees',
      salaryRange: '€15-20/hour',
      status: 'published',
      approvedBy: 'admin@searchfundhub.de',
      approvedAt: new Date(),
      publishedAt: new Date()
    },
    {
      employerId: createdEmployers[2].id,
      title: 'Working Student / Intern – Search Fund / Micro Private Equity',
      description: `Join a search fund focused on Mittelstand succession and digital transformation opportunities.

About Us:
We are a search fund identifying and acquiring high-potential Mittelstand companies for digital transformation. Our founder holds an HSG MBA and Imperial Business School MBA, with experience as a Big 4 Digital Transformation Manager and 2 years advising an IT system provider.

The Opportunity:
Work on identifying, evaluating, and transforming established German SMEs. You'll be involved in the full acquisition lifecycle, from screening to due diligence to post-acquisition integration and value creation.

What You'll Do:
- Screen and evaluate acquisition targets
- Develop valuation models and business cases
- Support due diligence processes
- Identify automation and efficiency opportunities
- Build and maintain deal pipeline
- Research industry trends and market dynamics`,
      requirements: `Ideal Candidate:
- Enrolled student (business, finance, engineering, or related field)
- Strong interest in Mittelstand, family businesses, or digital transformation
- Analytical mindset with financial modeling capability
- Fluent in German and English
- 15-20 hours per week commitment
- Entrepreneurial mentality and willingness to take initiative

Position Details:
- Hours: 20 hours per week
- Start: ASAP
- Location: Remote or Hybrid
- Compensation: €15-20/hour`,
      languageRequirements: ['German (Fluent)', 'English (Business)'],
      location: 'Remote or Hybrid',
      industry: 'Technology',
      functionArea: 'Operations',
      companySize: '1-10 employees',
      salaryRange: '€15-20/hour',
      status: 'published',
      approvedBy: 'admin@searchfundhub.de',
      approvedAt: new Date(),
      publishedAt: new Date()
    }
  ]

  for (const job of jobs) {
    await prisma.job.create({ 
      data: {
        ...job,
        languageRequirements: job.languageRequirements as any
      }
    })
    console.log(`✅ Created job: ${job.title}`)
  }

  console.log('\n✨ Database seeded successfully!')
  console.log('\n📧 Login Credentials:')
  console.log('Admin: admin@searchfundhub.de / admin123')
  console.log('Demo Employer: employer@searchfundhub.de / Employer123')
  console.log('Employer 1: contact@indepsponssor-berlin.de / employer123')
  console.log('Employer 2: contact@mittelstand-ma.de / employer123')
  console.log('Employer 3: contact@digital-transformation-sf.de / employer123')
  console.log('\n💌 Application Contact: jobboard@searchfundhub.de')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  