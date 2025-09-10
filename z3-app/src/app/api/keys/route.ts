import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { KeyMeta } from '@/types'

// Mock data
let keys: KeyMeta[] = [
  { accessKey: 'AKIA1234567890', createdAt: new Date(), expiresAt: null, status: 'active' },
]

export async function GET() {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ items: keys, total: keys.length })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await request.json()
  const newKey: KeyMeta = {
    accessKey: 'AKIA' + Math.random().toString(36).substr(2, 10).toUpperCase(),
    createdAt: new Date(),
    expiresAt: null,
    status: 'active',
  }

  keys.push(newKey)
  return NextResponse.json({
    ...newKey,
    secretKey: 'SECRET' + Math.random().toString(36).substr(2, 20).toUpperCase() // Show once
  })
}
