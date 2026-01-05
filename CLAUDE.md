# LazyBill - Project Documentation

## Project Summary

LazyBill is a modern invoicing and business management application built with SvelteKit. It helps freelancers and small businesses manage customers, create invoices, track time, and handle tasks. The application is currently in beta and features a clean, professional interface with German language support.

**Version:** 0.0.1 (early stage)
**Status:** Beta
**License:** MIT with non-compete clause
**Author:** Leopold Jofer (Copyright 2025)

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Core Technologies & Frameworks](#core-technologies--frameworks)
3. [Build Tools & Configuration](#build-tools--configuration)
4. [Code Patterns & Architectural Decisions](#code-patterns--architectural-decisions)
5. [Key Technologies & Their Purpose](#key-technologies--their-purpose)

---

## Project Structure

### Root-level Organization

```
/Users/leo/.claude-worktrees/lazybill/peaceful-blackwell/
├── src/                          # Main source code
│   ├── convex/                   # Backend (Convex database functions)
│   ├── lib/                      # Shared utilities and components
│   ├── routes/                   # SvelteKit routing
│   └── app.css                   # Global styles
├── static/                       # Static assets
├── legal/                        # Legal documents (TOS, Privacy Policy)
├── .claude/                      # Claude configuration
└── Configuration files
```

### Source Directory Structure

- **convex/** - Backend database schema and API functions (13 files)
- **lib/** - Reusable components, utilities, and hooks
  - **components/** - Custom components (Address, DatePicker, Preview, etc.)
  - **components/ui/** - shadcn-svelte UI component library (30+ components)
  - **typst/** - Invoice PDF generation using Typst
  - **hooks/** - Custom Svelte hooks
  - **assets/** - Images and icons
- **routes/** - File-based routing (223 Svelte components total)
  - **/app/** - Authenticated application routes
  - **/login/** - Authentication pages
  - **/sign-up/** - Registration pages

---

## Core Technologies & Frameworks

### Frontend Stack

- **SvelteKit 2.49.1** - Full-stack framework with file-based routing
- **Svelte 5.0** - Latest version with new runes API ($state, $props, $derived, $effect)
- **TypeScript 5.0+** - Type safety throughout
- **Vite 7.0.4** - Build tool and dev server
- **Tailwind CSS 4.0** - Utility-first styling (new v4 with Vite plugin)

### Backend & Database

- **Convex 1.31.2** - Real-time database and backend platform
  - Type-safe database queries and mutations
  - Real-time subscriptions
  - File storage for invoice PDFs
  - WebSocket connections for live updates
- **convex-svelte 0.0.12** - Svelte bindings for Convex

### Authentication

- **Better Auth 1.4.9** - Modern authentication library
- **@convex-dev/better-auth** - Convex integration for Better Auth
- **@mmailaender/convex-better-auth-svelte** - Svelte-specific bindings
- **Supports:**
  - Email/password authentication
  - Google OAuth
  - Beta user gating system

### UI Component Library

- **shadcn-svelte** - High-quality accessible components
- **bits-ui 2.14.4** - Headless UI primitives
- **Components include:** Avatar, Badge, Button, Calendar, Card, Checkbox, Command, Dialog, Dropdown Menu, Form, Input, Select, Sheet, Sidebar, Table, Textarea, Toast (Sonner), and more

### Styling & Design

- **Tailwind CSS 4.0** with custom theme
- **@tailwindcss/vite** - Official Vite plugin
- **tailwind-merge & clsx** - Class name utilities
- **tailwind-variants** - Component variants
- **tw-animate-css** - Animation utilities
- **mode-watcher** - Dark mode support (configured but not actively used)
- **Custom fonts:**
  - Funnel Display Variable (headings)
  - Atkinson Hyperlegible (body text)

### PDF & Document Generation

- **Typst.ts (@myriaddreamin/typst.ts)** - Modern typesetting system
  - Compiles Typst templates to PDF in the browser
  - Uses WebAssembly for performance
  - Custom German invoice template based on DIN 5008 standard
  - Includes QR code generation for SEPA payments (GiroCode/EPC-QR)

### Forms & Validation

- **sveltekit-superforms 2.27.2** - Advanced form handling
- **zod 4.1.5** - Schema validation

### Additional Libraries

- **@internationalized/date 3.10.0** - Date/time handling
- **date-fns 4.1.0** - Date utilities
- **@lucide/svelte 0.561.0** - Icon library
- **svelte-sonner 1.0.5** - Toast notifications
- **places-autocomplete-svelte** - Address autocomplete
- **posthog-js 1.310.1** - Analytics platform
- **plaid 41.0.0** - Banking integration (configured)
- **resend 6.6.0** - Email service

### Development Tools

- **Prettier 3.4.2** - Code formatting
  - prettier-plugin-svelte
  - prettier-plugin-tailwindcss
- **svelte-check** - Type checking
- **vite-plugin-devtools-json** - Development tools
- **Bun** - Package manager (bun.lock present)

### Deployment

- **@sveltejs/adapter-vercel 6.2.0** - Vercel deployment
- PWA manifest configured for mobile installation

---

## Build Tools & Configuration

### Build System

- **Vite 7.0.4** with SvelteKit integration
- **Optimizations:** Excludes `@myriaddreamin/typst.ts` from dependency pre-bundling
- **Plugins:** TailwindCSS, SvelteKit, devtools-json

### TypeScript Configuration

- Strict mode enabled
- Module resolution: bundler
- Extends SvelteKit's generated tsconfig
- Path aliases handled by SvelteKit (`$lib`, `$convex`)

### Convex Configuration

- Functions directory: `src/convex/`
- Uses Convex App system with plugins:
  - @convex-dev/better-auth
  - @convex-dev/migrations

### Code Quality

- **Prettier configuration:**
  - Tabs for indentation
  - Single quotes
  - Trailing commas
  - 100 character line width
  - Tailwind class sorting

---

## Code Patterns & Architectural Decisions

### Frontend Architecture

#### Svelte 5 Runes Pattern

Uses modern runes: `$state`, `$props`, `$derived`, `$effect`

Example from Editor.svelte:
```typescript
let due = $state<number | null>(invoice.dueInDays);
let typstDocument = $derived(() =>
  invoiceTemplate(company, customer, articles, invoiceDate, invoice.number, due || 0, notes)
);
```

#### Component Structure

- Page components: `+page.svelte`
- Layout components: `+layout.svelte`
- Load functions: `+page.ts`, `+layout.ts`, `+page.server.ts`, `+layout.server.ts`
- Reusable components in `/lib/components`

#### State Management

- Convex real-time queries with `useQuery`
- Local component state with `$state` rune
- Derived state with `$derived`
- Actions pattern for async operations with loading states

#### Action Pattern (Custom)

Located in `src/lib/action.svelte.ts`:
```typescript
export function action<T>(action: (args: T) => Promise<void>, errorMessage: string) {
  let isLoading = $state(false);
  // Handles loading, error states, and toast notifications
}
```

### Backend Architecture (Convex)

#### Database Schema

Tables defined in `src/convex/schema.ts`:
- **customers** - Customer records with addresses, contact info
- **companies** - User's business information
- **invoices** - Invoice data with line items, states
- **tasks** - Task management
- **timeEntries** - Time tracking
- **betaUsers** - Beta access control

#### Query/Mutation Pattern

- **Queries:** Read-only operations (real-time subscribed)
- **Mutations:** Write operations
- Authentication checked via `getUserId(ctx)`
- Safe accessors: `getCustomerSafe`, `getCustomer` (throws if not found)
- Index-based queries for performance

#### Security Model

- User ID-based data isolation
- All queries verify ownership before returning data
- Beta user gating on signup
- Better Auth integration with Convex

#### Real-time Subscriptions

- Connection state monitoring in UI
- Visual indicators for connected/disconnected states
- Optimistic updates possible with Convex

### Routing Structure

#### Public Routes

- `/` - Landing page (redirects authenticated users)
- `/login` - Email/Google login
- `/login/email` - Email-specific login
- `/sign-up` - Registration

#### Protected Routes (under `/app`)

- `/app` - Dashboard
- `/app/customers` - Customer list
- `/app/customers/[customerId]` - Customer details
- `/app/customers/[customerId]/invoices/[invoiceId]` - Invoice view
- `/app/customers/[customerId]/invoices/[invoiceId]/edit` - Invoice editor
- `/app/invoices` - All invoices
- `/app/tasks` - Task management
- `/app/time` - Time tracking (commented out in navigation)
- `/app/settings/*` - Settings pages:
  - account, bank, beta, company, invoices, notifications

#### Layout Nesting

- Root layout: Global styles, fonts, favicon
- App layout: Navigation, command palette, connection status
- Nested layouts for settings, customer details

### Authentication Flow

#### Server-side

- `hooks.server.ts` - Extracts auth token from cookies
- Stores in `event.locals.token`

#### Client-side

- `authClient` from better-auth/svelte
- `createSvelteAuthClient` wrapper
- `useAuth()` hook for authentication state
- Auto-redirect to `/login` if not authenticated

#### Beta Gating

- Database hook checks beta user list before account creation
- Prevents non-beta users from signing up

### Invoice Generation

#### Typst Template System

1. Data collected in invoice editor
2. Passed to `invoiceTemplate()` function
3. Generates Typst markup (template.typ)
4. Compiled to PDF via WebAssembly
5. Uploaded to Convex storage
6. Linked to invoice record

#### DIN 5008 Standard

- German business letter format
- Professional layout with sender/recipient
- Proper VAT calculations
- Small business exemption support
- SEPA QR code for easy payment

### UI/UX Patterns

#### Command Palette

- Keyboard shortcut: Cmd/Ctrl + K
- Quick navigation to pages
- Customer search
- Settings access

#### Mobile-First Responsive

- Bottom navigation on mobile
- Sidebar navigation on desktop
- Responsive command palette
- Touch-friendly components

#### Toast Notifications

- svelte-sonner for user feedback
- Success/error states
- Action confirmations

#### Loading States

- Custom action wrapper handles loading
- Skeleton components for async data
- Suspense component for query states
- Connection status indicators

#### Form Handling

- Superforms for complex forms
- Inline editing with InlineInput component
- Date/time pickers with @internationalized/date
- Address autocomplete with Google Places

---

## Key Technologies & Their Purpose

### By Domain

#### Data Layer

- **Convex** - Real-time backend, replaces traditional API + database
- **Zod** - Runtime type validation
- **Better Auth** - Secure authentication

#### Presentation Layer

- **SvelteKit** - SSR, routing, server functions
- **Svelte 5** - Reactive UI with new runes API
- **Tailwind CSS** - Rapid styling

#### Component System

- **shadcn-svelte** - Pre-built accessible components
- **bits-ui** - Headless primitives
- **Custom components** - Domain-specific UI

#### Document Generation

- **Typst.ts** - Professional PDF invoices
- **Custom template** - German DIN 5008 standard

#### Developer Experience

- **TypeScript** - Type safety
- **Vite** - Fast dev server
- **Prettier** - Consistent formatting
- **Vercel** - Easy deployment

#### Analytics & Monitoring

- **PostHog** - User analytics
- **Connection state monitoring** - Real-time status

#### Future Integrations

- **Plaid** - Banking/payment integration
- **Resend** - Email notifications

---

## Notable Architectural Decisions

1. **Convex over traditional backend** - Eliminates need for REST API, automatic subscriptions
2. **Svelte 5 runes** - Modern reactive paradigm, better TypeScript support
3. **Client-side PDF generation** - No server processing needed, instant previews
4. **shadcn-svelte** - Copy-paste components, full control vs. npm dependency
5. **File-based routing** - Convention over configuration
6. **Tailwind v4** - New Vite plugin, improved DX
7. **Beta gating** - Controlled rollout via database hook
8. **German-first** - UI text, invoice templates, DIN standards
9. **MIT License with SaaS restriction** - Open source but prevents direct competition

---

## Technology Highlights

### Modern Stack

- Latest Svelte 5 with runes
- Tailwind CSS v4 (just released)
- Vite 7
- TypeScript 5
- All dependencies are current as of 2025

### Real-time Features

- Live database subscriptions via Convex
- WebSocket connections with visual status
- Optimistic UI updates possible

### Production-Ready Features

- PWA manifest for mobile installation
- PostHog analytics integration
- Legal documents (TOS, Privacy Policy)
- Professional invoice templates
- Multi-language date/number formatting

---

## Project Maturity

This is a well-architected, modern full-stack application leveraging cutting-edge technologies with a clear focus on developer experience and professional invoicing capabilities for German businesses.
