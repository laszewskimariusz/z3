# Z3: Web Console for MinIO IAM

Z3 is a web-based console for managing MinIO Identity and Access Management (IAM) resources. It provides a user-friendly interface for administrators, operators, and auditors to handle users, groups, policies, and access keys without duplicating MinIO's authentication system.

## Features

### MVP Features

- **Authentication**: Integrates with MinIO's existing auth (AK/SK, OIDC, SAML, LDAP)
- **Users & Groups**: CRUD operations, assign policies, manage memberships
- **Policies**: JSON editor with validation, effective permissions preview, dry-run checks
- **Access Keys/Service Accounts**: Create, rotate, disable, one-time secret reveal
- **Profiles**: Manage multiple MinIO instances
- **UI/UX**: Dark mode, i18n (EN/PL), WCAG accessibility

### Post-MVP (Nice-to-have)

- Audit logs with filters and CSV export
- Policy templates
- Guided wizards for access grants
- Bulk operations

## Quick Start

### Prerequisites

- Node.js 18+
- MinIO instance running

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/laszewskimariusz/z3.git
   cd z3
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

See `.env.example` for all available configuration options. Key settings include:

- `Z3_SESSION_SECRET`: Used for encrypting sessions
- MinIO connection details for default profile
- OIDC settings if using SSO

## Screenshots

(TODO: Add screenshots here)

## Threat Model

Z3 prioritizes security by never persisting MinIO secrets in any database or long-term storage. Secrets are handled only in secure, encrypted sessions (httpOnly, sameSite cookies) and are never committed to version control. The app relies on MinIO's authentication flows, ensuring no duplication of user accounts or credentials.

## Architecture

- **Frontend**: Next.js with shadcn/ui and Tailwind CSS
- **Backend**: Next.js API routes for MinIO Admin/S3 API calls
- **Authentication**: Session-based, integrating with MinIO auth
- **Data Storage**: None (stateless, session-only)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

See [SECURITY.md](SECURITY.md) for our security policy.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for our code of conduct.