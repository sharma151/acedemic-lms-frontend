# Academic LMS - Multi-Tenant Frontend

A production-ready frontend for a Multi-Tenant Academic Learning Management System (LMS) built with Next.js (App Router), Tailwind CSS v4, and Shadcn UI.

## 🏗️ Technical Architecture

This repository uses a domain-driven structure mapped to Next.js App Router for multi-tenant isolation via middleware.

```text
src/
├── app/                  # Next.js App Router and Host-based routes
│   ├── (auth)/           # Authentication layout and flows
│   ├── (super-admin)/    # Root platform administration
│   └── (tenant-portal)/  # Specific institution/tenant LMS portal
├── components/           # Shared UI and utility components
│   ├── ui/               # Shadcn UI primitives
│   ├── common/           # Permission checks, shared layout parts
│   └── providers/        # React Contexts, Theme, Query Client
├── features/             # Domain-driven feature modules (auth, tenants, roles, users)
├── hooks/                # Custom React Hooks
├── lib/                  # Utilities (Axios interceptors, auth token helpers)
└── middleware.ts         # Host-based routing middleware
```

### Core Technologies
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **State Management:** Zustand (Auth & Tenant contexts)
- **Data Fetching:** TanStack React Query v5 + Axios
- **Form Handling:** React Hook Form + Zod

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.17 or higher)
- npm or yarn

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure your environment variables. Create a `.env.local` file at the root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_ROOT_DOMAIN=lms.com
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌍 Multi-Tenant Local Testing

The application uses `middleware.ts` to inspect the `Host` header and route dynamically:
- Root Domain (`app.lvh.me:3000` or `admin.lvh.me:3000`) -> Maps to `(super-admin)` routes.
- Tenant Domain (`oxford.lvh.me:3000`) -> Maps to `(tenant-portal)` routes.
- All Auth routes (`/login`, `/register`) are accessible from any host, but inherit the host's tenant context.

### Testing Locally
For easy sub-domain testing locally, use `lvh.me` which automatically resolves to `127.0.0.1`.
- Access Super Admin: [http://app.lvh.me:3000](http://app.lvh.me:3000)
- Access Tenant 'Oxford': [http://oxford.lvh.me:3000](http://oxford.lvh.me:3000)

Alternatively, configure your `etc/hosts` file (on Windows: `C:\Windows\System32\drivers\etc\hosts`):
```text
127.0.0.1 app.lms.local
127.0.0.1 oxford.lms.local
```
*(Remember to update `NEXT_PUBLIC_ROOT_DOMAIN` to `lms.local` in your `.env.local`)*

---

## 🎨 Dynamic Theming & Branding

The frontend implements dynamic CSS variable injection based on the fetched tenant data.

1. **Branding Fetch:** When a tenant logs in or accesses their subdomain, the `TenantThemeProvider` hooks into `useTenantStore`.
2. **Variable Injection:** The provider injects standard HSL CSS variables (`--primary`, `--secondary`) directly into the `document.documentElement` (`<html>` tag).
3. **Seamless Shadcn Integration:** Since Shadcn UI relies strictly on CSS variables for its colors (e.g., `bg-primary`, `text-primary-foreground`), the entire application seamlessly adopts the institution's colors instantly without any additional CSS processing or building.

---

## 🔗 Backend API Integrations

The `apiClient` (`src/lib/api-client.ts`) handles all requests, injecting `Authorization` headers and `X-Tenant-ID`. It also automatically handles `401 Unauthorized` responses by fetching a refresh token from the server, storing it, and retrying the failed request seamlessly.

| Module | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/login` | POST | Authenticates user and returns JWT |
| | `/auth/register` | POST | Registers a new user |
| | `/auth/refresh` | POST | Uses httpOnly cookies to refresh JWT |
| | `/auth/google` | GET | Initiates Google OAuth flow |
| **Tenants** | `/tenants/{id}/branding` | GET | Fetches dynamic colors, logos, and names |
| | `/tenants/{id}/settings` | GET | Fetches specific LMS configurations |
| **Roles** | `/roles` | GET | Fetches all roles in current tenant |
| | `/roles/{id}/permissions` | GET | Fetches granular permissions for RBAC |
| **Users** | `/users` | GET, POST | CRUD operations for LMS Users |

---

## 🛡️ Role-Based Access Control (RBAC)

The `PermissionGate` component acts as a declarative guard for the UI:
```tsx
import { PermissionGate } from '@/components/common/PermissionGate';

export default function SensitiveComponent() {
  return (
    <PermissionGate permission="manage:users" fallback={<p>Access Denied</p>}>
      <UserManagementTable />
    </PermissionGate>
  );
}
```
If the authenticated user does not have the specified permission in their roles array, the fallback is rendered (or nothing at all).
