'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  login: string
  status: string
}

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/auth/me`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const baseUrl = process.env.Z3_API_BASE_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Redirect to login page
        window.location.href = '/login'
      } else {
        console.error('Logout failed')
        alert('Logout failed. Please try again.')
      }
    } catch (error) {
      console.error('Logout error:', error)
      alert('Logout failed. Please try again.')
    }
  }

  if (!mounted) {
    return (
      <header className="border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Z3</h1>
          <div className="ml-auto">
            <Button variant="outline" size="sm" disabled>
              Loading...
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold">Z3</h1>
        <div className="ml-auto flex items-center gap-3">
          {user && (
            <div className="text-sm text-muted-foreground">
              Logged in as: <span className="font-medium text-foreground">{user.login}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 border-red-300 dark:border-red-800"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
