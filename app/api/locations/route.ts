import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''

  if (query.length < 2) {
    return NextResponse.json({ locations: [] })
  }

  try {
    // Get existing location tags that match the query
    const existingTags = await prisma.locationTag.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: {
        usageCount: 'desc',
      },
      take: 10,
    })

    const locations = existingTags.map(tag => tag.name)

    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Failed to fetch location suggestions:', error)
    return NextResponse.json({ locations: [] })
  }
}
