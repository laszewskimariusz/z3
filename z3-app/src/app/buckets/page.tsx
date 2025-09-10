'use client'

import { useState, useEffect } from 'react'
import { getSession } from '@/lib/session'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Bucket {
  name: string
  creationDate: Date
  objectCount: number
}

export default function BucketsPage() {
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [loading, setLoading] = useState(true)
  const [newBucketName, setNewBucketName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchBuckets()
  }, [])

  const fetchBuckets = async () => {
    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/buckets`)
      if (response.ok) {
        const data = await response.json()
        // Convert date strings back to Date objects
        const processedData = data.items.map((bucket: any) => ({
          ...bucket,
          creationDate: new Date(bucket.creationDate)
        }))
        setBuckets(processedData)
      }
    } catch (error) {
      console.error('Error fetching buckets:', error)
    } finally {
      setLoading(false)
    }
  }

  const createBucket = async () => {
    if (!newBucketName.trim()) return

    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/buckets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBucketName }),
      })

      if (response.ok) {
        setNewBucketName('')
        setShowCreateForm(false)
        fetchBuckets()
      }
    } catch (error) {
      console.error('Error creating bucket:', error)
    }
  }

  const deleteBucket = async (bucketName: string) => {
    if (!confirm(`Are you sure you want to delete bucket "${bucketName}"?`)) return

    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/buckets`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: bucketName }),
      })

      if (response.ok) {
        fetchBuckets()
      }
    } catch (error) {
      console.error('Error deleting bucket:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading buckets...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Buckets</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage S3 buckets in your MinIO instance</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
          >
            {showCreateForm ? 'Cancel' : 'Create Bucket'}
          </Button>
        </div>
      </div>

      <div className="p-6">
        {showCreateForm && (
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Create New Bucket</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bucketName" className="block text-sm font-medium text-foreground mb-2">
                  Bucket Name
                </Label>
                <Input
                  id="bucketName"
                  value={newBucketName}
                  onChange={(e) => setNewBucketName(e.target.value)}
                  placeholder="Enter bucket name"
                  className="w-full bg-background border-border text-foreground"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={createBucket}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
                >
                  Create Bucket
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">Buckets ({buckets.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted border-b border-border">
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Creation Date
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Objects
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-card divide-y divide-border">
                {buckets.map((bucket) => (
                  <TableRow key={bucket.name} className="hover:bg-muted/50">
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {bucket.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {bucket.creationDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bucket.objectCount}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteBucket(bucket.name)}
                        className="text-red-600 hover:text-red-900 border-red-300 hover:bg-red-50 px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Delete
                      </Button>
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
