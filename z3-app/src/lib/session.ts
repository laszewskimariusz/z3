import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { SessionData } from '@/types'

const sessionOptions = {
  password: process.env.Z3_SESSION_SECRET || 'fallback-secret-for-development-only-change-in-production',
  cookieName: 'z3-session',
  cookieOptions: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  )
  return session
}

export async function saveSession(data: Partial<SessionData>) {
  const session = await getSession()
  Object.assign(session, data)
  await session.save()
}

export async function destroySession() {
  const session = await getSession()
  session.destroy()
}
