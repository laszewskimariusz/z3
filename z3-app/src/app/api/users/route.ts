import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { User } from '@/types'

// Mock data
let users: User[] = [
  { id: '1', login: 'admin', status: 'active', groups: [], policies: [], keys: [], metadata: {} },
  { id: '2', login: 'user1', status: 'active', groups: [], policies: [], keys: [], metadata: {} },
]

export async function GET() {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ items: users, total: users.length })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { login, password } = await request.json()
  const newUser: User = {
    id: Date.now().toString(),
    login,
    status: 'active',
    groups: [],
    policies: [],
    keys: [],
    metadata: {},
  }

  users.push(newUser)
  return NextResponse.json(newUser)
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, login, status, groups, policies } = await request.json()
    const userIndex = users.findIndex(u => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    users[userIndex] = {
      ...users[userIndex],
      login,
      status,
      groups,
      policies,
    }

    return NextResponse.json(users[userIndex])
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    const userIndex = users.findIndex(u => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    users.splice(userIndex, 1)
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 })
  }
}
