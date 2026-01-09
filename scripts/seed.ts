import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@searchfund.com' },
    update: {},
    create: {
      email: 'admin@searchfund.com',
      password: adminPassword,
      role: 'admin'
    }
  })
  console.log('✅ Admin user created')

  // Create Sample Employers
  const employers = [
    {
      email: 'contact@acmemanufacturing.com',
      companyName: 'Acme Manufacturing Co.',
      industry: 'Manufacturing',
      website: 'https://acmemanufacturing.com',
      description: 'Leading manufacturer of precision components with 50+ years of history. Strong market position and consistent profitability.',
      status: 'approved'
    },
    {
      email: 'hr@techsolutions.io',
      companyName: 'TechSolutions Inc.',
      industry: 'Technology',
      website: 'https://techsolutions.io',
      description: 'B2B SaaS company serving mid-market enterprises. Recurring revenue model with 95% retention rate.',
      status: 'approved'
    },
    {
      email: 'jobs@healthcareservices.com',
      companyName: 'Regional Healthcare Services',
      industry: 'Healthcare',
      website: 'https://regionalhealthcare.com',
      description: 'Network of outpatient clinics across three states. Fragmented market with significant consolidation opportunity.',
      status: 'pending'
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

  // Create Sample Jobs
  const jobs = [
    {
      employerId: createdEmployers[0].id,
      title: 'CEO - Precision Manufacturing Company',
      description: `We are seeking an entrepreneurial CEO to lead our established precision manufacturing company through its next phase of growth.

About the Company:
- 50+ year history with strong reputation in automotive and aerospace sectors
- $15M annual revenue with 20% EBITDA margins
- 75 employees across two facilities
- Stable customer base with opportunities for expansion

The Opportunity:
This is an ideal platform for an experienced operator to implement operational improvements, pursue add-on acquisitions, and expand into adjacent markets. The current owner is retiring and seeking a capable successor to continue the company's legacy.

Key Responsibilities:
- Lead day-to-day operations and strategic planning
- Drive operational excellence and continuous improvement initiatives
- Identify and execute on growth opportunities
- Build and develop the leadership team
- Maintain strong relationships with key customers and suppliers`,
      requirements: `Qualifications:
- MBA or relevant graduate degree preferred
- 5+ years of operational experience in manufacturing or similar industries
- Search fund, private equity, or consulting background a plus
- Strong financial acumen and P&L management experience
- Proven leadership and team-building skills
- Entrepreneurial mindset with hands-on approach`,
      location: 'Detroit, MI',
      industry: 'Manufacturing',
      functionArea: 'General Management',
      companySize: '51-200 employees',
      salaryRange: '$180,000 - $250,000 base + equity',
      status: 'active',
      approvedBy: admin.email,
      approvedAt: new Date(),
      publishedAt: new Date()
    },
    {
      employerId: createdEmployers[1].id,
      title: 'VP of Operations - B2B SaaS Platform',
      description: `Join our growing B2B SaaS company as VP of Operations and help scale our business to $50M+ ARR.

About the Company:
- Established SaaS platform serving 500+ mid-market customers
- $12M ARR with 40% YoY growth
- 95% net revenue retention
- Strong product-market fit in HR tech space

The Role:
We're looking for an operationally-minded leader to build and scale our operations function as we enter our next growth phase. This role will be critical in establishing operational discipline while maintaining our entrepreneurial culture.

What You'll Do:
- Design and implement scalable operational processes
- Lead customer success and support functions
- Drive operational metrics and KPIs
- Partner with Sales and Product on go-to-market strategy
- Build high-performing operations team`,
      requirements: `What We're Looking For:
- 7+ years of operational experience, preferably in SaaS
- Track record of scaling operations in high-growth environment
- Data-driven decision maker with strong analytical skills
- Experience managing cross-functional teams
- Excellent communication and stakeholder management
- MBA or relevant advanced degree preferred`,
      location: 'Austin, TX (Hybrid)',
      industry: 'Technology',
      functionArea: 'Operations',
      companySize: '51-200 employees',
      salaryRange: '$160,000 - $200,000 + equity',
      status: 'active',
      approvedBy: admin.email,
      approvedAt: new Date(),
      publishedAt: new Date()
    },
    {
      employerId: createdEmployers[0].id,
      title: 'CFO - Manufacturing Growth Company',
      description: `Seeking a strategic CFO to support our growth and acquisition strategy.

Company Overview:
We're a profitable manufacturing company at an inflection point. After years of steady organic growth, we're ready to accelerate through operational improvements and strategic acquisitions.

The Opportunity:
As CFO, you'll be a key member of the leadership team, responsible for all financial operations and playing a critical role in our M&A strategy. This is an opportunity to have significant impact in a growing company backed by a search fund model.

Responsibilities:
- Oversee all financial operations and reporting
- Lead financial planning and analysis
- Support due diligence and integration of acquisitions
- Implement systems and processes to support growth
- Partner with CEO on strategic initiatives
- Manage banking relationships and capital structure`,
      requirements: `Ideal Candidate:
- CPA or CMA required, MBA preferred
- 8+ years progressive finance experience
- Manufacturing or industrial experience highly valued
- M&A transaction experience
- Strong systems implementation background
- Hands-on approach suitable for growing company
- Excellent communication skills`,
      location: 'Detroit, MI',
      industry: 'Manufacturing',
      functionArea: 'Finance',
      companySize: '51-200 employees',
      salaryRange: '$150,000 - $180,000 + bonus',
      status: 'pending',
      approvedBy: null,
      approvedAt: null,
      publishedAt: null
    },
    {
      employerId: createdEmployers[2].id,
      title: 'CEO - Multi-Site Healthcare Services',
      description: `Lead a network of outpatient healthcare clinics through consolidation and growth.

About Us:
We operate a network of specialized outpatient clinics across three states, serving over 50,000 patients annually. The healthcare services sector is highly fragmented, presenting significant opportunity for a skilled operator to build a regional platform through organic growth and strategic acquisitions.

The Role:
As CEO, you will have full operational responsibility for our existing clinic network while leading our expansion strategy. This is a true entrepreneurial opportunity within the healthcare sector.

Key Priorities:
- Optimize operations across existing clinic network
- Standardize processes and implement best practices
- Drive clinical quality and patient satisfaction
- Identify and execute on acquisition opportunities
- Build scalable infrastructure for growth
- Navigate healthcare regulatory environment`,
      requirements: `Requirements:
- Healthcare operations experience strongly preferred
- MBA or MHA from top program
- 5+ years of relevant experience
- Strong analytical and financial skills
- Proven leadership and change management abilities
- Comfort with regulated industry environment
- Multi-site operations experience a plus`,
      location: 'Columbus, OH',
      industry: 'Healthcare',
      functionArea: 'General Management',
      companySize: '201-500 employees',
      salaryRange: '$200,000 - $275,000 + equity',
      status: 'pending',
      approvedBy: null,
      approvedAt: null,
      publishedAt: null
    },
    {
      employerId: createdEmployers[1].id,
      title: 'Head of Sales - Enterprise SaaS',
      description: `Build and scale our enterprise sales function as we move upmarket.

Company Background:
We've established strong product-market fit in the mid-market and are now ready to move upmarket to enterprise customers. This is a ground-floor opportunity to build our enterprise sales motion from scratch.

What You'll Build:
- Enterprise sales strategy and go-to-market approach
- Sales processes, playbooks, and enablement
- High-performing enterprise sales team
- Strategic partnerships and channel programs
- Sales operations and analytics infrastructure

The Impact:
You'll have the autonomy to build the enterprise sales function your way, with full support from leadership and resources to succeed. This role reports directly to the CEO and is a critical hire for our next phase.`,
      requirements: `What You Bring:
- 10+ years of enterprise software sales experience
- Track record of building sales teams from scratch
- Experience selling to Fortune 1000 companies
- Strong leadership and coaching abilities
- Data-driven approach to sales management
- Startup or high-growth company experience
- Willingness to be hands-on initially`,
      location: 'Remote (US)',
      industry: 'Technology',
      functionArea: 'Sales & Marketing',
      companySize: '51-200 employees',
      salaryRange: '$180,000 - $220,000 + commission + equity',
      status: 'active',
      approvedBy: admin.email,
      approvedAt: new Date(),
      publishedAt: new Date()
    }
  ]

  for (const job of jobs) {
    await prisma.job.create({ data: job })
    console.log(`✅ Created job: ${job.title}`)
  }

  console.log('\n✨ Database seeded successfully!')
  console.log('\n📧 Login Credentials:')
  console.log('Admin: admin@searchfund.com / admin123')
  console.log('Employer: contact@acmemanufacturing.com / employer123')
  console.log('Employer: hr@techsolutions.io / employer123')
  console.log('Employer: jobs@healthcareservices.com / employer123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  