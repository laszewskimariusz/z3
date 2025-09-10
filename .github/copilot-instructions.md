# GitHub Copilot Instructions for Z3

## Project Overview
Z3 is a web console for MinIO IAM management. It integrates with MinIO authentication without storing secrets long-term.

## Coding Guidelines
- **TypeScript**: Use strict TypeScript with proper types for all variables and functions
- **Next.js**: Follow App Router conventions, use Server Components where possible
- **React**: Use functional components with hooks
- **Styling**: Use Tailwind CSS utilities, avoid custom CSS
- **Components**: Use shadcn/ui components for consistency
- **Forms**: Use react-hook-form with Zod validation
- **State**: Use React Context for global state, SWR for server state
- **Security**: Never log or store secrets, use encrypted sessions only
- **Accessibility**: Ensure WCAG compliance, keyboard navigation, screen reader support
- **Performance**: Optimize with Next.js features, lazy loading, memoization

## Architecture
- `src/app/` - Pages and API routes
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities, API clients, configurations
- `src/types/` - TypeScript type definitions
- `src/utils/` - Helper functions

## Key Patterns
- **API Routes**: `/api/*` for backend logic
- **Middleware**: For auth, rate limiting, CORS
- **Error Handling**: Try-catch with user-friendly messages
- **Loading States**: Suspense and loading UI
- **Validation**: Zod schemas for input validation
- **Testing**: Jest + React Testing Library for unit tests

## Security Rules
- No secrets in code or logs
- HTTPS only in production
- CSRF protection on forms
- Rate limiting on admin actions
- Input sanitization
- Session encryption with strong keys

## UI/UX
- Dark mode by default
- Responsive design
- Polish loading and error states
- Consistent spacing and typography
- Accessible focus management

## MinIO Integration
- Use Admin API for IAM operations
- Handle authentication flows (AK/SK, OIDC)
- Implement effective permissions preview
- Support multiple profiles
- Dry-run permission checks

## Development
- Run `npm run dev` for development
- Use `npm run lint` for code quality
- Write tests before implementation
- Follow TDD: Red-Green-Refactor
- Commit frequently with descriptive messages

## Common Tasks
- Creating forms: Use shadcn/ui Form components with react-hook-form
- API calls: Use SWR for caching, handle errors gracefully
- Authentication: Check session in middleware, redirect on failure
- Data display: Use tables with sorting/filtering
- Navigation: Use Next.js Link for client-side routing
