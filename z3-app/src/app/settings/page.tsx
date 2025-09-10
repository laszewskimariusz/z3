'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Profile {
  label: string
  endpoint: string
  region: string
  useSSL: boolean
  verifyTLS: boolean
  authMode: 'aksk' | 'oidc' | 'saml' | 'ldap'
}

export default function SettingsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      label: 'Default',
      endpoint: 'localhost',
      region: 'us-east-1',
      useSSL: false,
      verifyTLS: false,
      authMode: 'aksk',
    },
  ])
  const [newProfile, setNewProfile] = useState<Partial<Profile>>({})

  const addProfile = () => {
    if (newProfile.label && newProfile.endpoint) {
      setProfiles([...profiles, newProfile as Profile])
      setNewProfile({})
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Configure your MinIO instance connections and preferences</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="bg-muted border-b border-border">
              <CardTitle className="text-lg font-medium text-foreground">MinIO Profiles</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Manage multiple MinIO instance connections
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto mb-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Label
                      </TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Endpoint
                      </TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Region
                      </TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SSL
                      </TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Auth Mode
                      </TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-gray-200">
                    {profiles.map((profile, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {profile.label}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {profile.endpoint}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {profile.region}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {profile.useSSL ? 'Yes' : 'No'}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {profile.authMode}
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

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
                      Label
                    </Label>
                    <Input
                      id="label"
                      value={newProfile.label || ''}
                      onChange={(e) => setNewProfile({ ...newProfile, label: e.target.value })}
                      placeholder="Profile name"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-2">
                      Endpoint
                    </Label>
                    <Input
                      id="endpoint"
                      value={newProfile.endpoint || ''}
                      onChange={(e) => setNewProfile({ ...newProfile, endpoint: e.target.value })}
                      placeholder="minio.example.com"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={addProfile}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Add Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
