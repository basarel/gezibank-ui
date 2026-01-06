import { NextRequest, NextResponse } from 'next/server'
import { getLatestBlogs } from '@/libs/payload'

export async function GET(request: NextRequest) {
  try {
    const blogs = await getLatestBlogs(3)
    return NextResponse.json({ blogs })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ blogs: [] }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
