---
project: acedemic-lms
register: product
aesthetic_direction: technical / utilitarian
color_strategy: restrained
design_system: Radix Primitives + shadcn/ui
design_variance: 6
motion_intensity: 4
visual_density: 8
---

# Academic LMS — Locked Design Language

## Design Read
Technical, dense, and mathematically disciplined — built for educators, administrators, and students who demand high data readability over decorative novelty.

## Signature
**Calibrated Data Rails with Micro-Pill Status Indicators & Precision Focus Borders:**
All interactive cards, tables, and metric tiles feature subtle tinted slate border framing (`oklch(0.92 0.015 250)` light / `oklch(0.24 0.02 250)` dark) with a crisp 1px left accent indicator on active elements and tabular data density that maximizes screen real estate without clutter.

## Color (Locked)

*Every screen must read as the same product if placed side by side.*

Neutrals are subtly tinted toward deep academic slate navy (`hue 250`).
Distribution follows 60-30-10: 60% clean canvas & surfaces, 30% structured slate borders and typography, 10% high-intent cobalt & semantic status accents.

| Role | OKLCH (Light) | OKLCH (Dark) | Hex (Light) | Hex (Dark) | WCAG Contrast | Use |
|------|---------------|--------------|-------------|------------|---------------|-----|
| `background` | `oklch(0.985 0.005 250)` | `oklch(0.12 0.02 250)` | `#f9f9fb` | `#0d1117` | 14.2:1 / 15.1:1 | App canvas & page background |
| `surface` | `oklch(1 0 0)` | `oklch(0.16 0.025 250)` | `#ffffff` | `#161b22` | Base card surface |
| `surface-elevated` | `oklch(0.99 0.005 250)` | `oklch(0.20 0.03 250)` | `#fbfbfe` | `#21262d` | Modals, popovers, dropdowns |
| `text-primary` | `oklch(0.16 0.02 250)` | `oklch(0.96 0.005 250)` | `#151922` | `#f0f2f6` | 13.8:1 | Headings, primary labels, critical values |
| `text-secondary` | `oklch(0.45 0.02 250)` | `oklch(0.72 0.015 250)` | `#575f70` | `#a9b2c3` | 5.2:1 (AA) | Descriptions, subtitles, table headers |
| `text-muted` | `oklch(0.60 0.015 250)` | `oklch(0.55 0.015 250)` | `#868e9e` | `#7a8394` | 3.2:1 | Disabled, timestamps, placeholders |
| `border` | `oklch(0.91 0.012 250)` | `oklch(0.24 0.02 250)` | `#e3e6ed` | `#282e39` | — | Card edges, separators, gridlines |
| `border-subtle` | `oklch(0.95 0.008 250)` | `oklch(0.19 0.015 250)` | `#eff1f6` | `#1c212a` | — | Internal list row dividers |
| `accent-primary` | `oklch(0.52 0.22 255)` | `oklch(0.62 0.20 255)` | `#1d62ed` | `#4080ff` | 5.1:1 (AA) | Primary buttons, active tabs, selected states |
| `accent-subtle` | `oklch(0.95 0.04 255)` | `oklch(0.24 0.06 255)` | `#eef4ff` | `#16284a` | — | Active row fill, badge background |
| `success` | `oklch(0.55 0.16 150)` | `oklch(0.65 0.16 150)` | `#158a4d` | `#2ecc71` | 4.8:1 (AA) | Approved, Active, Completed, High Attendance |
| `warning` | `oklch(0.65 0.16 75)` | `oklch(0.75 0.16 75)` | `#b86b00` | `#f39c12` | 4.6:1 (AA) | Pending approval, Trial expiry, Attention |
| `danger` | `oklch(0.55 0.22 25)` | `oklch(0.65 0.20 25)` | `#d92d20` | `#f04438` | 4.7:1 (AA) | Suspended, Overdue, Failed, Destructive actions |
| `info` | `oklch(0.58 0.14 230)` | `oklch(0.68 0.14 230)` | `#0077b6` | `#38bdf8` | 4.6:1 (AA) | Informational badges, system notices |

## Type (Locked)

| Role | Family | Fallback | Weights | Line Height | Tracking | Use |
|------|--------|----------|---------|-------------|----------|-----|
| `heading` | Geist Sans, Inter | system-ui, sans-serif | 600, 700 | 1.2 – 1.3 | `-0.02em` | Page titles, section headers, metric big numbers |
| `body` | Geist Sans, Inter | system-ui, sans-serif | 400, 500 | 1.5 | `normal` | General copy, table rows, form controls, navigation |
| `mono / data` | Geist Mono, JetBrains Mono | ui-monospace, monospace | 400, 500, 600 | 1.4 | `-0.01em` | Codes, IDs, dates, tabular numbers, logs |

## Scales (Locked)

### Spacing Scale
- `xs`: `0.25rem` (4px)
- `sm`: `0.5rem` (8px)
- `md`: `0.75rem` (12px)
- `lg`: `1rem` (16px)
- `xl`: `1.5rem` (24px)
- `2xl`: `2rem` (32px)
- `3xl`: `3rem` (48px)

### Radius Scale
- `sm`: `0.375rem` (6px) — Badges, small pills, tags
- `md`: `0.5rem` (8px) — Buttons, input fields, selects
- `lg`: `0.75rem` (12px) — Cards, dropdowns, popovers
- `xl`: `1rem` (16px) — Modals, drawer dialogs

### Motion Budget
- **Durations**:
  - Micro-interactions (hover, press): `120ms`
  - Contextual transitions (expand, tab switch, menu open): `200ms`
  - Layout reveals & page orchestration: `300ms`
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (smooth deceleration, zero bounce)
- **Reduced Motion**: All animations disabled or replaced with immediate opacity switch when `prefers-reduced-motion: reduce` is active.

## Voice & Microcopy Register
- **Tone**: Direct, concise, academic/institutional precision. No marketing buzzwords or fake statistics.
- **Action Pairs**:
  - `Add Institution` → `Institution Added`
  - `Approve Request` → `Approved`
  - `Export Report` → `Exporting...` → `Report Exported`
  - `Save Changes` → `Saved`
