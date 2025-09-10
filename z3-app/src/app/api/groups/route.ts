import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { Group } from '@/types'

// Mock data
let groups: Group[] = [
  { name: 'admins', description: 'Admin group', members: ['1'], policies: [] },
]

export async function GET() {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ items: groups, total: groups.length })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, description, members, policies } = await request.json()

    // Check if group already exists
    if (groups.find(g => g.name === name)) {
      return NextResponse.json({ message: 'Group already exists' }, { status: 400 })
    }

    const newGroup: Group = {
      name,
      description: description || '',
      members: members || [],
      policies: policies || [],
    }

    groups.push(newGroup)
    return NextResponse.json(newGroup)
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, description, members, policies } = await request.json()
    const groupIndex = groups.findIndex(g => g.name === name)

    if (groupIndex === -1) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 })
    }

    groups[groupIndex] = {
      name,
      description: description || '',
      members: members || [],
      policies: policies || [],
    }

    return NextResponse.json(groups[groupIndex])
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name } = await request.json()
    const groupIndex = groups.findIndex(g => g.name === name)

    if (groupIndex === -1) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 })
    }

    groups.splice(groupIndex, 1)
    return NextResponse.json({ message: 'Group deleted' })
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }
}
