import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/" className="block p-2 rounded hover:bg-accent">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/buckets" className="block p-2 rounded hover:bg-accent">
              Buckets
            </Link>
          </li>
          <li>
            <Link href="/groups" className="block p-2 rounded hover:bg-accent">
              Groups
            </Link>
          </li>
          <li>
            <Link href="/policies" className="block p-2 rounded hover:bg-accent">
              Policies
            </Link>
          </li>
          <li>
            <Link href="/keys" className="block p-2 rounded hover:bg-accent">
              Keys
            </Link>
          </li>
          <li>
            <Link href="/permissions" className="block p-2 rounded hover:bg-accent">
              Permissions
            </Link>
          </li>
          <li>
            <Link href="/settings" className="block p-2 rounded hover:bg-accent">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
