# Research: Z3 Web Console for MinIO IAM

## Next.js
Next.js is a React framework for building full-stack web applications. Key features for Z3:
- **App Router**: File-based routing with nested layouts
- **Server Components**: Server-side rendering for better performance
- **API Routes**: Built-in backend for MinIO API calls
- **TypeScript Support**: Built-in, no configuration needed
- **Middleware**: For authentication, rate limiting, etc.
- **Version**: 14.x (latest stable)

## shadcn/ui
A collection of accessible, customizable UI components built on Radix UI primitives and styled with Tailwind CSS.
- **Components**: Button, Input, Table, Dialog, Form, etc.
- **Accessibility**: WCAG compliant
- **Theming**: CSS variables for easy customization
- **CLI Tool**: `npx shadcn-ui@latest add` for installing components
- **Dark Mode**: Built-in support

## Tailwind CSS
A utility-first CSS framework for rapid UI development.
- **Utility Classes**: Direct styling without custom CSS
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Class-based dark mode toggle
- **JIT Compiler**: Fast compilation
- **Customization**: Via tailwind.config.js

## MinIO JavaScript SDK
Official SDK for interacting with MinIO servers.
- **S3 API**: Compatible with AWS S3 SDK
- **Admin API**: For IAM operations (users, groups, policies, keys)
- **Authentication**: AK/SK, STS tokens
- **Installation**: `npm install minio`
- **Usage**: Client for S3, AdminClient for IAM

## Authentication Integration
- **AK/SK**: Simple form input, store in session
- **OIDC/SAML/LDAP**: Redirect to MinIO's auth endpoint
- **Session Management**: Use `iron-session` for secure, encrypted sessions
- **No DB**: Session-only storage

## Security Libraries
- **iron-session**: For session management
- **next-csrf**: CSRF protection
- **helmet**: Security headers
- **Rate Limiting**: `express-rate-limit` or custom middleware

## Internationalization (i18n)
- **next-i18next**: For EN/PL translations
- **Setup**: JSON files for translations

## Form Handling
- **react-hook-form**: For form validation
- **zod**: Schema validation for forms and API

## State Management
- **React Context**: For global state (profiles, user session)
- **SWR**: For data fetching and caching

## Testing
- **Jest**: Test runner
- **React Testing Library**: Component testing
- **Playwright**: E2E testing

## Deployment
- **Vercel**: Recommended for Next.js
- **Docker**: For containerized deployment
- **HTTPS**: Required, with certificates

## MinIO Compatibility
- **Versions**: Current stable (2023+)
- **Features**: Admin API for IAM
- **Distributed**: Works with clustered MinIO

## UI/UX Considerations
- **Dark Mode Default**: As per spec
- **Responsive**: Mobile-friendly
- **Keyboard Navigation**: Accessibility
- **Loading States**: For API calls
- **Error Handling**: User-friendly error messages

## Performance
- **Server Components**: Reduce client bundle
- **Image Optimization**: Next.js built-in
- **Caching**: SWR for API responses
- **Bundle Analysis**: `next build --analyze`

## Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
