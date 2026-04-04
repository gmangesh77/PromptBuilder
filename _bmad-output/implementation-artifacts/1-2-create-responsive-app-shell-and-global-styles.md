# Story 1.2: Create Responsive App Shell & Global Styles

Status: done

## Story

As a **user**,
I want **to access PromptBuilder on any device and see a clean, responsive layout**,
So that **I have a consistent experience whether I'm on my phone, tablet, or desktop**.

## Acceptance Criteria

1. **AC1: Semantic App Shell**
   - **Given** the scaffolded project
   - **When** the App component is loaded
   - **Then** it renders a semantic HTML structure with `<header>`, `<main>`, and appropriate landmarks
   - **And** the page title displays "PromptBuilder"

2. **AC2: Global Styles & Design Tokens**
   - **Given** the App shell
   - **When** global styles (index.css) are loaded
   - **Then** CSS custom properties are defined for colors, spacing, typography, and breakpoints
   - **And** a CSS reset/normalize is applied for cross-browser consistency
   - **And** the base font size supports 200% text resize without breaking layout (FR47)

3. **AC3: Mobile Responsive (320-480px)**
   - **Given** the responsive layout
   - **When** viewed at mobile widths (320-480px)
   - **Then** the layout renders as a single column with full-width content
   - **And** minimum tap targets are 44x44px (UX-7)

4. **AC4: Tablet Responsive (768-1024px)**
   - **Given** the responsive layout
   - **When** viewed at tablet widths (768-1024px)
   - **Then** the layout adjusts with enhanced spacing

5. **AC5: Desktop Responsive (1025px+)**
   - **Given** the responsive layout
   - **When** viewed at desktop widths (1025px+)
   - **Then** the content is centered with a max-width container for readability

6. **AC6: Shared Component Stubs**
   - **Given** the App shell
   - **When** shared component stubs (Button, Input, Spinner) are created
   - **Then** each component has a .tsx file, a .module.css file, a .test.tsx file, and an index.ts export
   - **And** the components follow PascalCase naming convention (ARCH-15)

## Tasks / Subtasks

- [x] Task 1: Implement global styles and design tokens in index.css (AC: #2)
  - [x]1.1: Create CSS custom properties for colors (--color-primary, --color-bg, --color-text, --color-error, --color-success, etc.)
  - [x]1.2: Create CSS custom properties for spacing scale (--space-xs through --space-3xl)
  - [x]1.3: Create CSS custom properties for typography (--font-family, --font-size-sm/md/lg/xl, --line-height-tight/normal/relaxed)
  - [x]1.4: Create CSS custom properties for breakpoints documentation (comments, since CSS custom properties can't be used in media queries directly)
  - [x]1.5: Apply CSS reset (box-sizing, margin, padding reset, font inheritance)
  - [x]1.6: Set base font-size to 100% (16px) to support 200% resize (FR47)
  - [x]1.7: Use rem units throughout for scalable sizing

- [x] Task 2: Build semantic App shell layout (AC: #1)
  - [x]2.1: Update App.tsx with semantic HTML: `<header>`, `<main>` landmarks
  - [x]2.2: Add skip-to-content link for accessibility (hidden visually, visible on focus)
  - [x]2.3: Display "PromptBuilder" in the header
  - [x]2.4: Create App.module.css with layout container styles
  - [x]2.5: Write App.test.tsx verifying semantic landmarks render correctly

- [x] Task 3: Implement responsive layout with mobile-first breakpoints (AC: #3, #4, #5)
  - [x]3.1: Mobile-first base styles: single column, full-width, padding for touch
  - [x]3.2: Add media query for tablet (min-width: 768px): enhanced spacing, adjusted padding
  - [x]3.3: Add media query for desktop (min-width: 1025px): centered max-width container (e.g., 680px)
  - [x]3.4: Ensure minimum 44x44px tap targets via CSS custom property --min-tap-target
  - [x]3.5: Test layout at 320px, 480px, 768px, 1024px, 1440px widths visually

- [x] Task 4: Create Button component stub (AC: #6)
  - [x]4.1: Create src/components/Button/Button.tsx with typed props (children, onClick, disabled, variant, type)
  - [x]4.2: Create src/components/Button/Button.module.css with base button styles and 44px min tap target
  - [x]4.3: Create src/components/Button/Button.test.tsx with render and click tests
  - [x]4.4: Create src/components/Button/index.ts barrel export

- [x] Task 5: Create Input component stub (AC: #6)
  - [x]5.1: Create src/components/Input/Input.tsx with typed props (label, value, onChange, placeholder, error, maxLength)
  - [x]5.2: Create src/components/Input/Input.module.css with base input styles and proper focus indicators
  - [x]5.3: Create src/components/Input/Input.test.tsx with render and accessibility tests
  - [x]5.4: Create src/components/Input/index.ts barrel export

- [x] Task 6: Create Spinner component stub (AC: #6)
  - [x]6.1: Create src/components/Spinner/Spinner.tsx with typed props (size, label)
  - [x]6.2: Create src/components/Spinner/Spinner.module.css with CSS animation (transform-based for GPU acceleration)
  - [x]6.3: Create src/components/Spinner/Spinner.test.tsx with render and aria-label test
  - [x]6.4: Create src/components/Spinner/index.ts barrel export

- [x] Task 7: Update barrel exports and verify build (AC: #1, #6)
  - [x]7.1: Update src/components/index.ts to export Button, Input, Spinner
  - [x]7.2: Verify `npm run build` succeeds
  - [x]7.3: Verify `npm run lint` passes
  - [x]7.4: Verify `npm run test` passes all new tests

## Dev Notes

### Previous Story Intelligence (Story 1.1)

**Established patterns from Story 1.1:**
- App.tsx already uses CSS Modules (`App.module.css`) - continue this pattern
- ESLint flat config with eslint-config-prettier is configured
- Vitest with jsdom + @testing-library/react + jest-dom is configured
- `src/test/setup.ts` imports `@testing-library/jest-dom`
- barrel exports pattern: each directory has `index.ts`
- PascalCase component folders under `src/components/`
- Co-located tests: `Component.test.tsx` next to `Component.tsx`
- Build produces 60.68 KB gzipped - substantial budget remaining under 200 KB limit

**Files created in 1.1 that this story modifies:**
- `src/App.tsx` - will be updated with semantic HTML
- `src/App.module.css` - will be expanded with layout styles
- `src/index.css` - will be expanded with design tokens and reset
- `src/components/index.ts` - will export new components

### Architecture Compliance

**Source: [architecture.md#Naming Patterns]**
- Components: PascalCase folders (`Button/`, `Input/`, `Spinner/`)
- CSS Modules: `Component.module.css`
- Tests: co-located `Component.test.tsx`
- Each component folder has its own `index.ts`

**Source: [architecture.md#Structure Patterns]**
```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.module.css
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   ├── Input.test.tsx
│   ├── Input.module.css
│   └── index.ts
└── Spinner/
    ├── Spinner.tsx
    ├── Spinner.test.tsx
    ├── Spinner.module.css
    └── index.ts
```

### UX Design Requirements

**Source: [ux-design-specification.md]**
- Mobile-first responsive design (UX-11)
- Breakpoints: Mobile 320-480px, Tablet 768-1024px, Desktop 1025px+ (UX-11)
- 44x44px minimum tap target size (UX-7)
- Virtual keyboard optimization: prevent zoom-on-focus (font-size >= 16px) (UX-12)
- Emotional design: Welcoming Landing stage (UX-16)

**Source: [prd.md#FR43-FR47]**
- FR43: Keyboard navigation
- FR44: Visible focus indicators (3:1 contrast ratio minimum)
- FR45: Color contrast 4.5:1 for normal text
- FR46: Semantic HTML for screen readers
- FR47: Text resize up to 200% without breaking

### Design Token Strategy

Use CSS custom properties on `:root` for theming consistency. All components MUST use these tokens, never hardcoded values:

```css
/* Colors */
--color-primary: #2563eb;        /* Blue 600 */
--color-primary-hover: #1d4ed8;  /* Blue 700 */
--color-bg: #ffffff;
--color-bg-secondary: #f8fafc;   /* Slate 50 */
--color-text: #0f172a;           /* Slate 900 */
--color-text-secondary: #475569; /* Slate 600 */
--color-border: #e2e8f0;         /* Slate 200 */
--color-error: #dc2626;          /* Red 600 */
--color-success: #16a34a;        /* Green 600 */
--color-focus: #2563eb;          /* Same as primary for focus rings */

/* Spacing (rem-based, scales with text resize) */
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
--space-3xl: 4rem;     /* 64px */

/* Typography */
--font-family: system-ui, -apple-system, sans-serif;
--font-size-sm: 0.875rem;  /* 14px */
--font-size-md: 1rem;      /* 16px */
--font-size-lg: 1.25rem;   /* 20px */
--font-size-xl: 1.5rem;    /* 24px */
--font-size-2xl: 2rem;     /* 32px */

/* Layout */
--max-width: 42.5rem;   /* 680px */
--min-tap-target: 2.75rem; /* 44px */
```

### Component Stub Guidelines

These are STUBS, not complete components. They should:
- Have proper TypeScript props interfaces
- Render correctly with basic styling
- Have 1-2 meaningful tests each
- Use design tokens from index.css
- Be expandable in future stories without refactoring

DO NOT implement:
- Complex state logic
- Event handling beyond basic onClick/onChange
- Platform-specific behavior
- Animation (except Spinner)

### Anti-Patterns to Avoid

- DO NOT use `px` units for font sizes (use `rem`)
- DO NOT use inline styles
- DO NOT hardcode colors or spacing values
- DO NOT use `div` where semantic HTML elements exist (`header`, `main`, `button`, `label`)
- DO NOT create a separate `styles/` or `css/` directory - styles are co-located via CSS Modules
- DO NOT add media query breakpoints as JS - keep them CSS-only

### References

- [Source: architecture.md#Naming Patterns] - Component naming
- [Source: architecture.md#Structure Patterns] - File organization
- [Source: architecture.md#ARCH-5] - CSS Modules
- [Source: ux-design-specification.md#UX-7] - 44px tap targets
- [Source: ux-design-specification.md#UX-11] - Breakpoints
- [Source: ux-design-specification.md#UX-12] - Virtual keyboard optimization
- [Source: prd.md#FR43-FR47] - Accessibility requirements
- [Source: epics.md#Story 1.2] - Complete acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- All 7 tasks completed: global styles, semantic shell, responsive layout, Button, Input, Spinner stubs
- 12 tests passing across 4 test files (App: 4, Button: 3, Input: 3, Spinner: 2)
- Build: 60.81 KB gzipped — well under 200 KB budget
- Lint: clean, zero warnings
- Design tokens system established on :root with colors, spacing, typography, layout variables
- Mobile-first responsive breakpoints: 768px (tablet), 1025px (desktop)
- All components use CSS Modules, design tokens, PascalCase naming, co-located tests

### File List

- src/index.css (modified — design tokens, CSS reset, skip-link styles)
- src/App.tsx (modified — semantic header/main/skip-link)
- src/App.module.css (modified — responsive layout with breakpoints)
- src/App.test.tsx (created — 4 tests)
- src/components/Button/Button.tsx (created)
- src/components/Button/Button.module.css (created)
- src/components/Button/Button.test.tsx (created — 3 tests)
- src/components/Button/index.ts (created)
- src/components/Input/Input.tsx (created)
- src/components/Input/Input.module.css (created)
- src/components/Input/Input.test.tsx (created — 3 tests)
- src/components/Input/index.ts (created)
- src/components/Spinner/Spinner.tsx (created)
- src/components/Spinner/Spinner.module.css (created)
- src/components/Spinner/Spinner.test.tsx (created — 2 tests)
- src/components/Spinner/index.ts (created)
- src/components/index.ts (modified — exports Button, Input, Spinner)
