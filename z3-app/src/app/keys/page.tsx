'use client'

import { KeyMeta } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

async function getKeys(): Promise<KeyMeta[]> {
  const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

  const response = await fetch(`${baseUrl}/api/keys`)
  if (response.ok) {
    const data = await response.json()
    return data.items
  }
  return []
}

export default function KeysPage() {
  const [keys, setKeys] = useState<KeyMeta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const data = await getKeys()
      // Convert date strings back to Date objects
      const processedData = data.map(key => ({
        ...key,
        createdAt: new Date(key.createdAt),
        expiresAt: key.expiresAt ? new Date(key.expiresAt) : null
      }))
      setKeys(processedData)
    } catch (error) {
      console.error('Error fetching keys:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading keys...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Access Keys</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage access keys for your MinIO instance</p>
          </div>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
          >
            Create Access Key
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">Access Keys ({keys.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted border-b border-border">
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Access Key
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Created
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Expires
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-card divide-y divide-border">
                {keys.map((key) => (
                  <TableRow key={key.accessKey} className="hover:bg-muted/50">
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {key.accessKey}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {key.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {key.expiresAt?.toLocaleDateString() || 'Never'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        key.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {key.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900 border-blue-300 hover:bg-blue-50 px-3 py-1 rounded-md text-sm font-medium"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-900 border-red-300 hover:bg-red-50 px-3 py-1 rounded-md text-sm font-medium"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
