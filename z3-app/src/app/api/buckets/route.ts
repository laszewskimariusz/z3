import { NextRequest, NextResponse } from 'next/server'
import * as Minio from 'minio'
import { getSession } from '@/lib/session'

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

export async function GET() {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const minioClient = getMinioClient(session)
    const buckets = await minioClient.listBuckets()

    const bucketDetails = await Promise.all(
      buckets.map(async (bucket) => {
        try {
          const objects = minioClient.listObjects(bucket.name, '', true)
          let objectCount = 0
          for await (const obj of objects) {
            objectCount++
          }
          return {
            name: bucket.name,
            creationDate: bucket.creationDate,
            objectCount,
          }
        } catch (error) {
          return {
            name: bucket.name,
            creationDate: bucket.creationDate,
            objectCount: 0,
          }
        }
      })
    )

    return NextResponse.json({ items: bucketDetails, total: bucketDetails.length })
  } catch (error) {
    console.error('Error listing buckets:', error)
    return NextResponse.json({ message: 'Failed to list buckets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name } = await request.json()
    const minioClient = getMinioClient(session)

    await minioClient.makeBucket(name, session.profile.region || 'us-east-1')

    return NextResponse.json({ message: 'Bucket created successfully' })
  } catch (error) {
    console.error('Error creating bucket:', error)
    return NextResponse.json({ message: 'Failed to create bucket' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name } = await request.json()
    const minioClient = getMinioClient(session)

    await minioClient.removeBucket(name)

    return NextResponse.json({ message: 'Bucket deleted successfully' })
  } catch (error) {
    console.error('Error deleting bucket:', error)
    return NextResponse.json({ message: 'Failed to delete bucket' }, { status: 500 })
  }
}
