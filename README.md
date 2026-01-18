# Search Fund Hub

A modern job platform connecting search fund entrepreneurs with top talent from elite European business schools.

## Features

### For Job Seekers
- **Browse Jobs** - Search and filter search fund opportunities by location, industry, and function
- **Direct Applications** - Apply directly to search fund positions
- **LinkedIn Integration** - View employer LinkedIn profiles directly from job listings

### For Employers (Search Funds)
- **Post Jobs** - Create and manage job postings
- **Kanban Pipeline** - Track candidates through your recruiting process
- **Company Profile** - Showcase your search fund with LinkedIn integration
- **Application Tracking** - Manage all applications in one place

### For Admins
- **Employer Approvals** - Review and approve new employer registrations
- **Job Moderation** - Approve or reject job postings
- **Dashboard Analytics** - Overview of platform activity

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (we recommend [Supabase](https://supabase.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/antonhantel/search-fund-hub.git
   cd search-fund-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database (Supabase PostgreSQL)
   DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   npm run seed-jobs
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooled, for Supabase use port 6543) |
| `DIRECT_URL` | Direct PostgreSQL connection (for migrations, port 5432) |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js session encryption |
| `NEXTAUTH_URL` | Base URL of your application |

## Project Structure

```
search-fund-hub/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard
│   ├── employer/           # Employer dashboard
│   ├── jobs/               # Public job listings
│   ├── api/                # API routes
│   └── ...
├── components/             # Reusable React components
├── lib/                    # Utility functions and configurations
├── prisma/                 # Database schema and migrations
└── public/                 # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/)
3. Add environment variables in Vercel Project Settings
4. Deploy!

**Important for Supabase:** Use the **Transaction pooler** connection string (port 6543) for `DATABASE_URL` on Vercel.

## University Network

Search Fund Hub partners with leading European business school entrepreneurship clubs:

- WHU Entrepreneurship Club
- HEC Entrepreneurs
- INSEAD PE/VC Club
- LBS Private Equity Club
- HSG Founders Club
- CBS Entrepreneurship

## License

This project is private and proprietary.

## Contact

- **Website**: [searchfundhub.de](https://searchfundhub.de)
- **LinkedIn**: [Search Fund Hub](https://www.linkedin.com/company/search-fund-hub/)

---

Built with ❤️ for the European Search Fund community
