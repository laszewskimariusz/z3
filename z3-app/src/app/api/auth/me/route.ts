import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session.user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        login: session.user.login,
        status: session.user.status
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ message: 'Failed to get user info' }, { status: 500 })
  }
}
