import { NextRequest, NextResponse } from 'next/server'
import { getSession, destroySession } from '@/lib/session'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getSession()

    if (!session.user) {
      return NextResponse.json({ message: 'No active session' }, { status: 400 })
    }

    // Destroy the session
    await destroySession()

    // Also clear the cookie explicitly
    const cookieStore = await cookies()
    cookieStore.delete('z3-session')

    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 })
  }
}
