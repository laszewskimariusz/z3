'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PermissionsPage() {
  const [action, setAction] = useState('')
  const [resource, setResource] = useState('')
  const [userId, setUserId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkPermission = async () => {
    setLoading(true)
    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/permissions/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, resource, userId }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to check permission' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Permission Check</h1>
            <p className="text-sm text-muted-foreground mt-1">Test IAM permissions for your MinIO instance</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-2xl">
          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-lg font-medium text-gray-900">Dry-run Permission Test</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Test if a user can perform an action on a resource without actually executing it
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user ID"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-2">
                  Action
                </Label>
                <Input
                  id="action"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="e.g., s3:GetObject"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="resource" className="block text-sm font-medium text-gray-700 mb-2">
                  Resource
                </Label>
                <Input
                  id="resource"
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                  placeholder="e.g., bucket/object"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <Button
                onClick={checkPermission}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Check Permission'}
              </Button>
              {result && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Result:</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
