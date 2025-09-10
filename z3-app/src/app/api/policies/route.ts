import { NextRequest, NextResponse } from 'next/server'
import * as Minio from 'minio'
import { getSession } from '@/lib/session'
import { Policy } from '@/types'

function getMinioClient(session: any) {
  const profile = session.profile
  const endpointUrl = new URL(profile.endpoint)
  const endPoint = endpointUrl.hostname
  const port = endpointUrl.port ? parseInt(endpointUrl.port) : (endpointUrl.protocol === 'https:' ? 443 : 80)
  const useSSL = endpointUrl.protocol === 'https:'

  return new Minio.Client({
    endPoint,
    port,
    useSSL,
    accessKey: session.credentials.accessKey,
    secretKey: session.credentials.secretKey,
  })
}

// Mock data for now - MinIO Admin API would be needed for real policy management
let policies: Policy[] = [
  {
    name: 'ReadOnly',
    document: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['s3:GetObject'],
          Resource: ['*']
        }
      ]
    },
    checksum: 'abc123',
    version: '1.0.0',
    labels: {}
  },
  {
    name: 'ReadWrite',
    document: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['s3:GetObject', 's3:PutObject'],
          Resource: ['*']
        }
      ]
    },
    checksum: 'def456',
    version: '1.0.0',
    labels: {}
  },
]

export async function GET() {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // For now, return mock data. In production, you'd use MinIO Admin API
  return NextResponse.json({ items: policies, total: policies.length })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, document } = await request.json()
    const newPolicy: Policy = {
      name,
      document,
      checksum: Date.now().toString(),
      version: '1.0.0',
      labels: {},
    }

    policies.push(newPolicy)
    return NextResponse.json(newPolicy)
  } catch (error) {
    console.error('Error creating policy:', error)
    return NextResponse.json({ message: 'Failed to create policy' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, document } = await request.json()
    const policyIndex = policies.findIndex(p => p.name === name)

    if (policyIndex === -1) {
      return NextResponse.json({ message: 'Policy not found' }, { status: 404 })
    }

    policies[policyIndex] = {
      ...policies[policyIndex],
      document,
      checksum: Date.now().toString(),
    }

    return NextResponse.json(policies[policyIndex])
  } catch (error) {
    console.error('Error updating policy:', error)
    return NextResponse.json({ message: 'Failed to update policy' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name } = await request.json()
    const policyIndex = policies.findIndex(p => p.name === name)

    if (policyIndex === -1) {
      return NextResponse.json({ message: 'Policy not found' }, { status: 404 })
    }

    policies.splice(policyIndex, 1)
    return NextResponse.json({ message: 'Policy deleted successfully' })
  } catch (error) {
    console.error('Error deleting policy:', error)
    return NextResponse.json({ message: 'Failed to delete policy' }, { status: 500 })
  }
}
