import { NextRequest, NextResponse } from 'next/server'
import * as Minio from 'minio'
import { saveSession } from '@/lib/session'
import { User } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { accessKey, secretKey } = await request.json()

    if (!accessKey || !secretKey) {
      return NextResponse.json({ message: 'Access Key and Secret Key are required' }, { status: 400 })
    }

    // Parse endpoint
    let endPoint: string
    let port: number
    let useSSL: boolean

    try {
      const endpointUrl = new URL(process.env.Z3_MINIO_ENDPOINT || 'http://localhost:9000')
      endPoint = endpointUrl.hostname
      port = endpointUrl.port ? parseInt(endpointUrl.port) : (endpointUrl.protocol === 'https:' ? 443 : 80)
      useSSL = endpointUrl.protocol === 'https:'
    } catch (error) {
      // Fallback to simple parsing if URL constructor fails
      const endpoint = process.env.Z3_MINIO_ENDPOINT || 'http://localhost:9000'
      const urlMatch = endpoint.match(/^(https?):\/\/([^:\/]+)(?::(\d+))?/)
      if (urlMatch) {
        useSSL = urlMatch[1] === 'https'
        endPoint = urlMatch[2]
        port = urlMatch[3] ? parseInt(urlMatch[3]) : (useSSL ? 443 : 80)
      } else {
        // Final fallback
        endPoint = 'localhost'
        port = 9000
        useSSL = false
      }
    }

    // Create MinIO client
    const minioClient = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    })

    // Test connection by listing buckets
    await minioClient.listBuckets()

    // For now, mock user
    const user: User = {
      id: 'admin',
      login: 'admin',
      status: 'active',
      groups: [],
      policies: [],
      keys: [],
      metadata: {},
    }

    // Save session
    await saveSession({
      user,
      profile: {
        label: 'Default',
        endpoint: process.env.Z3_MINIO_ENDPOINT || 'http://localhost:9000',
        region: process.env.Z3_MINIO_REGION || 'us-east-1',
        useSSL,
        verifyTLS: process.env.Z3_MINIO_VERIFY_TLS === 'true',
        authMode: 'aksk',
      },
      credentials: { accessKey, secretKey },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }
}
