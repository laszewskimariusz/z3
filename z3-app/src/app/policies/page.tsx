'use client'

import { useState, useEffect } from 'react'
import { getSession } from '@/lib/session'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Policy {
  name: string
  document: any
  checksum: string
  version: string
  labels: Record<string, string>
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    document: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['s3:GetObject'],
          Resource: ['*']
        }
      ]
    }, null, 2)
  })

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/policies`)
      if (response.ok) {
        const data = await response.json()
        setPolicies(data.items)
      }
    } catch (error) {
      console.error('Error fetching policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      let response
      if (editingPolicy) {
        response = await fetch(`${baseUrl}/api/policies`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            document: JSON.parse(formData.document)
          }),
        })
      } else {
        response = await fetch(`${baseUrl}/api/policies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            document: JSON.parse(formData.document)
          }),
        })
      }

      if (response.ok) {
        setFormData({
          name: '',
          document: JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: ['s3:GetObject'],
                Resource: ['*']
              }
            ]
          }, null, 2)
        })
        setShowCreateForm(false)
        setEditingPolicy(null)
        fetchPolicies()
      }
    } catch (error) {
      console.error('Error saving policy:', error)
    }
  }

  const editPolicy = (policy: Policy) => {
    setEditingPolicy(policy)
    setFormData({
      name: policy.name,
      document: JSON.stringify(policy.document, null, 2)
    })
    setShowCreateForm(true)
  }

  const deletePolicy = async (policyName: string) => {
    if (!confirm(`Are you sure you want to delete policy "${policyName}"?`)) return

    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/policies`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: policyName }),
      })

      if (response.ok) {
        fetchPolicies()
      }
    } catch (error) {
      console.error('Error deleting policy:', error)
    }
  }

  const cancelEdit = () => {
    setEditingPolicy(null)
    setFormData({
      name: '',
      document: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: ['s3:GetObject'],
            Resource: ['*']
          }
        ]
      }, null, 2)
    })
    setShowCreateForm(false)
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading policies...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top header with breadcrumb and actions (AWS-like) */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="mb-2 text-xs text-muted-foreground">
          <nav className="flex items-center space-x-2" aria-label="Breadcrumb">
            <span className="text-muted-foreground">MinIO</span>
            <span className="text-muted-foreground/70">/</span>
            <span className="text-foreground">Access management</span>
            <span className="text-muted-foreground/70">/</span>
            <span className="font-medium text-foreground">Policies</span>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Policies</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage IAM policies for your MinIO instance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Cancel' : editingPolicy ? 'Cancel Edit' : 'Create Policy'}
            </Button>
          </div>
        </div>
        {/* Action bar */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="w-full md:w-80">
            <Input placeholder="Search policies by name" aria-label="Search policies" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10">Refresh</Button>
            <Button variant="outline" className="h-10">Export</Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showCreateForm && (
          <div className="bg-card rounded-md shadow-sm border border-border p-6 mb-6">
            <h2 className="text-lg font-medium text-foreground mb-2">
              {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Define a policy name and provide a JSON policy document.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="policyName" className="block text-sm font-medium text-foreground mb-2">
                  Policy Name
                </Label>
                <Input
                  id="policyName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter policy name"
                  required
                  className="w-full bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="policyDocument" className="block text-sm font-medium text-foreground mb-2">
                  Policy Document (JSON)
                </Label>
                <Textarea
                  id="policyDocument"
                  value={formData.document}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, document: e.target.value })}
                  placeholder="Enter policy document as JSON"
                  rows={12}
                  required
                  className="w-full font-mono text-sm bg-background border-border text-foreground"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit">
                  {editingPolicy ? 'Update Policy' : 'Create Policy'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-card rounded-md shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-medium text-foreground">Policies ({policies.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted border-b border-border">
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-normal">Name</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-normal">Version</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-normal">Labels</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground tracking-normal">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-card divide-y divide-border">
                {policies.map((policy) => (
                  <TableRow key={policy.name} className="hover:bg-muted/50">
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {policy.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {policy.version}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {Object.keys(policy.labels).length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(policy.labels).map(([k, v]) => (
                            <span key={k} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              <span className="font-medium">{k}</span>
                              <span className="text-muted-foreground/70">=</span>
                              <span>{v}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editPolicy(policy)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deletePolicy(policy.name)}
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
