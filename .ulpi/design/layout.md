# Feature Spec: Layout & Navigation

## 1. Overview
The shell layout provides seamless navigation across the Super Admin portal and Tenant portals with responsive sidebar collapse, top navigation with breadcrumbs, tenant switcher, theme toggle, and notification center.

## 2. Navigation Architecture
- **Sidebar**:
  - Pinned left with slim-expand state.
  - Role-gated items with active pill indicator (locked cobalt accent).
  - Footer profile block with user avatar, institution role, and workspace badge.
- **TopNavbar**:
  - Sticky glass header with calibrated blur (`backdrop-blur-md bg-background/80`).
  - Search trigger with global shortcut badge (`⌘K`).
  - Institution selector / Tenant switcher dropdown.
  - Notification drawer trigger with unread indicator dot.
  - Theme mode toggle (Light / Dark / System).

## 3. Interaction & Accessibility
- Complete keyboard focus management with Radix UI primitives.
- Mobile drawer with backdrop overlay on viewport `< 1024px`.
- High contrast active link highlighting meeting WCAG AA standards.
