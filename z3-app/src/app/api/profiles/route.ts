import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

// Mock profiles storage
let profiles: any[] = [
  {
    label: 'Default',
    endpoint: 'localhost',
    region: 'us-east-1',
    useSSL: false,
    verifyTLS: false,
    authMode: 'aksk',
  },
]

export async function GET() {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ items: profiles, total: profiles.length })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const newProfile = await request.json()
  profiles.push(newProfile)
  return NextResponse.json(newProfile)
}
