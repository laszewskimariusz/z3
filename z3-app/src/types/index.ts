export interface User {
  id: string
  login: string
  status: 'active' | 'inactive' | 'blocked'
  groups: string[]
  policies: string[]
  keys: KeyMeta[]
  metadata: Record<string, any>
}

export interface Group {
  name: string
  description: string
  members: string[]
  policies: string[]
}

export interface Policy {
  name: string
  document: any
  checksum: string
  version: string
  labels: Record<string, string>
}

export interface KeyMeta {
  accessKey: string
  createdAt: Date
  expiresAt: Date | null
  status: 'active' | 'inactive' | 'expired'
}

export interface Profile {
  label: string
  endpoint: string
  region: string
  useSSL: boolean
  verifyTLS: boolean
  authMode: 'aksk' | 'oidc' | 'saml' | 'ldap'
  issuerURL?: string
  clientId?: string
  clientSecret?: string
}

export interface SessionData {
  user?: User
  profile: Profile
  credentials?: {
    accessKey: string
    secretKey: string
  }
}

export interface IAMListResponse<T> {
  items: T[]
  total: number
  page: number
}

export interface IAMError {
  code: string
  message: string
  details?: any
}

export interface PermissionCheck {
  action: string
  resource: string
  allowed: boolean
  reason?: string
}
