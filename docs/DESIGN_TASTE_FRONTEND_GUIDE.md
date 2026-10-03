# Frontend Design Taste System & Enhancements Guide

This document records the installation and application of the **`design-taste-frontend`** skill ([.agents/skills/design-taste-frontend/SKILL.md](file:///Users/kishorkc/workspace/self/acedemic-lms-frontend/.agents/skills/design-taste-frontend/SKILL.md)), detailing the architectural principles, anti-slop guidelines, and system-wide enhancements implemented across the Academic LMS frontend.

---

## 1. Skill Installation

The skill was installed into the repository via:
```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

- **Installed Skill Location**: [`.agents/skills/design-taste-frontend/SKILL.md`](file:///Users/kishorkc/workspace/self/acedemic-lms-frontend/.agents/skills/design-taste-frontend/SKILL.md)
- **Lockfile Updated**: [`skills-lock.json`](file:///Users/kishorkc/workspace/self/acedemic-lms-frontend/skills-lock.json)

---

## 2. Core Philosophy & Design Dials

The `design-taste-frontend` skill enforces **anti-slop frontend engineering** to eliminate templated AI aesthetics (such as generic purple gradients, flat repetitive card stacks, and static successful states).

### The Three Configuration Dials for Academic LMS:
* **`DESIGN_VARIANCE: 6`** (Structured & Accessible, clear visual rhythm and consistent spacing).
* **`MOTION_INTENSITY: 5`** (Fluid, spring-based micro-interactions, tactile active feedback, reduced-motion compliant).
* **`VISUAL_DENSITY: 6`** (Institutional/SaaS balance: high clarity without cockpit clutter).

---

## 3. Key Anti-Slop Rules & Discipline

1. **Color Consistency Lock**:
   - Single accent system linked directly to multi-tenant theme tokens (`--primary`, `--ring`, etc.).
   - Eliminates hardcoded color classes (e.g., ad-hoc `bg-blue-600` or `text-blue-500`) to guarantee seamless brand customization.
2. **Tactile Micro-Physics**:
   - Active press simulation (`active:scale-[0.985] active:translate-y-px`) for physical feedback.
   - Smooth `cubic-bezier(0.16, 1, 0.3, 1)` transitions.
3. **High-Fidelity Loading States**:
   - Replaced flat gray pulsing rectangles with smooth gradient shimmer animation (`animate-shimmer`).
4. **Anti-AI Tells**:
   - **No generic data**: Replaced placeholder names like "John Doe" with contextual institutional examples ("Alex Morgan", "alex.morgan@university.edu").
   - **Semantic error states**: Enforced semantic `text-destructive` and `bg-destructive/10` instead of raw red hardcodes.
   - **Accessible contrast**: Verified WCAG AA contrast for inputs, buttons, and helper labels.

---

## 4. Enhancements Implemented in Codebase

### A. Global Styles & Design System Tokens ([`src/app/globals.css`](file:///Users/kishorkc/workspace/self/acedemic-lms-frontend/src/app/globals.css))
- **Shimmer Keyframes & Utility (`.animate-shimmer`)**: Shifting light reflection across skeleton placeholders.
- **Glassmorphism Panel (`.glass-panel`)**: Refined frosted glass surface token with inner border refraction (`shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`) and dark-mode adaptation.
- **Tactile Press (`.tactile-press`)**: Physics-based interactive press feedback utility.

### B. Skeleton Component ([`src/components/ui/skeleton.tsx`](file:///Users/kishorkc/workspace/self/acedemic-lms-frontend/src/components/ui/skeleton.tsx))
- Added `shimmer` boolean prop (default `true`) using the `.animate-shimmer` gradient sweep for refined loading experiences.

### C. Button Component ([`src/components/ui/button.tsx`](file:///Users/kishorkc/workspace/self/acedemic-lms-frontend/src/components/ui/button.tsx))
- Integrated tactile press dynamics (`active:scale-[0.985] active:not-aria-[haspopup]:translate-y-px`).
- Refined focus ring offsets and contrast compliance across light/dark themes.
- Enhanced smooth transition duration (`duration-150 ease-out`).

### D. Authentication Features ([`src/features/auth/`](file:///Users/kishorkc/workspace/self/acedemic-lms-frontend/src/features/auth))
- **`LoginForm.tsx`**: Removed hardcoded Tailwind color overrides (`focus-visible:ring-blue-600`, `bg-blue-600`) and connected all interactive elements to dynamic design tokens (`bg-primary`, `text-primary-foreground`, `text-muted-foreground`).
- **`RegisterForm.tsx`**: Replaced generic placeholder "John Doe" with realistic institutional data and unified validation error feedback with semantic `text-destructive` tokens.

---

## 5. Developer Pre-Flight Checklist for New Features

Before shipping any new UI component or page, verify against this checklist:

- [ ] **Color Lock**: Are all buttons, badges, and focus rings using semantic theme tokens (`--primary`, `--accent`, `--border`) instead of hardcoded palette classes?
- [ ] **Tactile Feel**: Do interactive controls provide immediate feedback on hover and `:active` press?
- [ ] **Loading States**: Are skeleton screens matching the exact geometry of destination content with shimmer enabled?
- [ ] **Typography Rhythm**: Are headings using proper tracking (`tracking-tight` / `tracking-tighter`) and paired with `Geist` / `Geist Mono`?
- [ ] **Dark Mode Integrity**: Does the component render seamlessly in both light and dark modes with WCAG AA contrast?
- [ ] **Anti-AI Tells**: Zero em-dashes (`—`), zero generic mock names, and no arbitrary unmotivated neon glows.
