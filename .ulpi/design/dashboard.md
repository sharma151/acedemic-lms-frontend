# Feature Spec: Super Admin & Tenant Dashboard

## 1. Overview
The Academic LMS central dashboard gives Super Admins institution-wide observability and Tenant Admins operational management over courses, enrollments, licenses, and pending administrative tasks.

## 2. User Flows & State Models

### Primary Journey
1. **Load Dashboard**: Fetch stats summary, enrollment trends, recent activity log, and pending approvals.
2. **Observe Metrics**: View total institutions, active students, license utilization, and monthly growth.
3. **Handle Pending Approvals**: Approve or reject institution onboarding requests with inline feedback toasts.
4. **Quick Actions**: Navigate directly to "Add Institution", "Generate License Keys", "Configure SSO", and "Export Audit Logs".

### 5-State Coverage

| State | UI Behavior | Feedback / Elements |
|-------|-------------|---------------------|
| **Loading / Skeleton** | Skeleton loaders mirroring exact layout dimensions, subtle pulse (`duration-1000`) | Shimmering card rails and ghost rows |
| **Empty State** | Clean slate with icon, explanation, and clear CTA | "No pending approvals — all institution requests are processed." + "View Past Approvals" button |
| **Partial State** | Metric tiles render immediately with cached or available stats; chart streams data | Loading spinner on individual chart canvas without blocking stats |
| **Success State** | High density, crisp data points, live interactive tooltips, filterable activity stream | Instant visual confirmation on quick action clicks |
| **Error State** | Non-blocking inline alert with contextual retry | "Failed to load recent activity feed" with "Retry" action button |

## 3. Component Specifications

### 3.1 `StatCards`
- **Data Model**: `{ label: string, value: string | number, change: string, trend: 'up' | 'down' | 'neutral', icon: LucideIcon, detail: string }`
- **Variants**: Default, Positive Trend (tinted emerald pill), Warning Trend (tinted amber pill).
- **A11y**: Proper `aria-label` detailing metric change (e.g. "Total Students: 24,520, up 12% from last month").

### 3.2 `EnrollmentChart`
- **Type**: Interactive Dual Bar / Area chart (Recharts) with custom tooltip and responsive container.
- **Color Mapping**: Uses locked chart tokens (`--chart-1` to `--chart-5`), grid lines bound to `border-subtle`.
- **A11y**: Screen-reader accessible data summary table available via toggle or hidden ARIA container.

### 3.3 `RecentActivity`
- **Type**: Timeline list with distinct event icon nodes, timestamps, actor labels, and status badges.
- **A11y**: Semantic `<ol>` list structure with relative time tooltips.

### 3.4 `PendingApprovals`
- **Type**: High-density table with Institution name, submitted date, license tier, requested capacity, and action buttons.
- **Interactivity**: Inline optimistic update on "Approve" / "Reject" with sonner toast notification.

### 3.5 `QuickActions`
- **Type**: Grid of actionable utility cards with keyboard shortcuts (`Cmd+K`, `Shift+A`, etc.), hover micro-elevation, and icon accents.

## 4. Build Handoff & Acceptance Criteria
- **Target Framework**: Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + Radix UI / Shadcn.
- **Acceptance Criteria**:
  - [x] All colors, typography, radius, and spacing bind strictly to `.ulpi/design/DESIGN.md`.
  - [x] Full Dark Mode & Light Mode support without contrast clipping.
  - [x] Accessible keyboard focus outlines (`outline-ring/50`).
  - [x] No unmotivated animations or bounce effects.
