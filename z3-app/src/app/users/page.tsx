'use client'

import { useState, useEffect } from 'react'
import { getSession } from '@/lib/session'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface User {
  id: string
  login: string
  status: 'active' | 'inactive' | 'blocked'
  groups: string[]
  policies: string[]
  keys: any[]
  metadata: Record<string, any>
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    login: '',
    status: 'active' as 'active' | 'inactive' | 'blocked',
    groups: '',
    policies: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/users`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.items)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const userData = {
        login: formData.login,
        status: formData.status,
        groups: formData.groups.split(',').map(g => g.trim()).filter(g => g),
        policies: formData.policies.split(',').map(p => p.trim()).filter(p => p)
      }

      let response
      if (editingUser) {
        response = await fetch(`${baseUrl}/api/users`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingUser.id, ...userData }),
        })
      } else {
        response = await fetch(`${baseUrl}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        })
      }

      if (response.ok) {
        setFormData({
          login: '',
          status: 'active',
          groups: '',
          policies: ''
        })
        setShowCreateForm(false)
        setEditingUser(null)
        fetchUsers()
      }
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const editUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      login: user.login,
      status: user.status,
      groups: user.groups.join(', '),
      policies: user.policies.join(', ')
    })
    setShowCreateForm(true)
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setFormData({
      login: '',
      status: 'active',
      groups: '',
      policies: ''
    })
    setShowCreateForm(false)
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading users...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage IAM users for your MinIO instance</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
          >
            {showCreateForm ? 'Cancel' : editingUser ? 'Cancel Edit' : 'Create User'}
          </Button>
        </div>
      </div>

      <div className="p-6">
        {showCreateForm && (
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {editingUser ? 'Edit User' : 'Create New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="userLogin" className="block text-sm font-medium text-foreground mb-2">
                  Login
                </Label>
                <Input
                  id="userLogin"
                  value={formData.login}
                  onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  placeholder="Enter login name"
                  required
                  className="w-full bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="userStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </Label>
                <select
                  id="userStatus"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'blocked' })}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <Label htmlFor="userGroups" className="block text-sm font-medium text-gray-700 mb-2">
                  Groups (comma-separated)
                </Label>
                <Input
                  id="userGroups"
                  value={formData.groups}
                  onChange={(e) => setFormData({ ...formData, groups: e.target.value })}
                  placeholder="group1, group2, group3"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="userPolicies" className="block text-sm font-medium text-gray-700 mb-2">
                  Policies (comma-separated)
                </Label>
                <Input
                  id="userPolicies"
                  value={formData.policies}
                  onChange={(e) => setFormData({ ...formData, policies: e.target.value })}
                  placeholder="ReadOnly, ReadWrite"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">Users ({users.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted border-b border-border">
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ID
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Login
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Groups
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Policies
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-card divide-y divide-border">
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {user.id}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {user.login}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.groups.join(', ') || 'None'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.policies.join(', ') || 'None'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editUser(user)}
                          className="text-blue-600 hover:text-blue-900 border-blue-300 hover:bg-blue-50 px-3 py-1 rounded-md text-sm font-medium"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
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
