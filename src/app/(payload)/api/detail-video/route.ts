import { getDetailByTourTitle } from '@/libs/payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tourTitle = searchParams.get('tourTitle')

    if (!tourTitle) {
      return NextResponse.json(
        { error: 'tourTitle parameter is required' },
        { status: 400 }
      )
    }

    const detail = await getDetailByTourTitle(tourTitle)

    if (!detail) {
      return NextResponse.json(null, { status: 200 })
    }

    return NextResponse.json(detail, { status: 200 })
  } catch (error) {
    console.error('Error fetching detail:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
