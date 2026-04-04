# Story 2.1: Create PromptInput Component with Text Area

Status: done

## Story

As a **user**,
I want **to type what I need in my own words into a simple text field**,
So that **I can describe my task naturally without learning any special format**.

## Acceptance Criteria

1. **AC1: Text Area Renders with Placeholder**
   - **Given** the PromptBuilder app is loaded
   - **When** the PromptInput component renders
   - **Then** a text area is displayed with placeholder text "Describe what you need in your own words" (UX-8)
   - **And** the text area uses semantic HTML with an associated `<label>` (FR46, NFR-A9)
   - **And** the text area is auto-focused on desktop (not on mobile to avoid keyboard popup)

2. **AC2: Character Count Tracking**
   - **Given** the text area
   - **When** a user types input
   - **Then** the character count is tracked internally
   - **And** the character limit indicator remains invisible until the user approaches the maximum (e.g., 80% of 1000 chars) (UX-9, FR2)
   - **And** input is capped at the maximum character limit

3. **AC3: Mobile Optimization**
   - **Given** the text area on mobile (320-480px)
   - **When** the user taps to type
   - **Then** the input field does not trigger zoom-on-focus (UX-12, font-size >= 16px)
   - **And** the virtual keyboard does not obscure the input area
   - **And** the tap target meets 44x44px minimum (UX-7)

4. **AC4: Keyboard Accessibility**
   - **Given** the PromptInput component
   - **When** a user navigates via keyboard
   - **Then** the text area is reachable via Tab key (FR43)
   - **And** a visible focus indicator is displayed with minimum 3:1 contrast ratio (FR44, NFR-A3)

5. **AC5: Styling Compliance**
   - **Given** the component styling
   - **When** rendered in any viewport
   - **Then** text meets 4.5:1 contrast ratio for normal text (FR45, NFR-A4)
   - **And** text is resizable up to 200% without breaking layout (FR47)
   - **And** CSS Modules are used for scoped styling (ARCH-5)

## Tasks / Subtasks

- [x] Task 1: Create PromptInput feature component with textarea and label (AC: #1)
  - [x] 1.1: Create src/features/PromptInput/ directory structure (PromptInput.tsx, PromptInput.module.css, PromptInput.test.tsx, index.ts)
  - [x] 1.2: Implement PromptInput.tsx with semantic `<label>` + `<textarea>` and placeholder "Describe what you need in your own words"
  - [x] 1.3: Accept props: value, onChange, maxLength (default 1000), disabled, className
  - [x] 1.4: Generate stable id for label-textarea association

- [x] Task 2: Implement character limit with progressive indicator (AC: #2)
  - [x] 2.1: Track character count from value prop length
  - [x] 2.2: Show character count indicator only when value length >= 800 (80% of 1000)
  - [x] 2.3: Display as "X / 1000" format with aria-live="polite" for screen reader announcements
  - [x] 2.4: Cap input at maxLength using textarea's native maxLength attribute

- [x] Task 3: Implement desktop auto-focus with mobile detection (AC: #1)
  - [x] 3.1: Use a simple media query check (matchMedia for pointer:fine or min-width:1025px) to detect desktop
  - [x] 3.2: Auto-focus textarea only on desktop to avoid mobile keyboard popup

- [x] Task 4: Style with CSS Modules and design tokens (AC: #3, #5)
  - [x] 4.1: Create PromptInput.module.css with textarea styles using design tokens
  - [x] 4.2: Ensure font-size >= 16px (var(--font-size-md)) to prevent iOS zoom-on-focus
  - [x] 4.3: Ensure min-height meets 44px tap target (var(--min-tap-target))
  - [x] 4.4: Style character counter (hidden by default, visible near limit, error color at limit)

- [x] Task 5: Write comprehensive tests (AC: #1, #2, #4)
  - [x] 5.1: Test textarea renders with correct placeholder and label association
  - [x] 5.2: Test character counter is hidden when under 800 chars
  - [x] 5.3: Test character counter is visible when at/above 800 chars
  - [x] 5.4: Test maxLength attribute is applied
  - [x] 5.5: Test keyboard accessibility (aria attributes)

- [x] Task 6: Integrate PromptInput into App.tsx and update barrel exports (AC: #1)
  - [x] 6.1: Import and render PromptInput in App.tsx main area with local state (useState)
  - [x] 6.2: Update src/features/index.ts to export PromptInput
  - [x] 6.3: Verify npm run build, npm run lint, npm run test all pass

## Dev Notes

### Previous Story Intelligence (Stories 1.1, 1.2, 1.3)

**Established patterns:**
- CSS Modules for all component styling (`Component.module.css`)
- Design tokens from `:root` in index.css — always use `var(--token-name)`, never hardcoded values
- PascalCase component folders and filenames
- Co-located tests: `Component.test.tsx` next to `Component.tsx`
- Barrel exports: each directory has `index.ts`
- Testing: Vitest + @testing-library/react + @testing-library/user-event + jest-dom
- Existing shared Input component is a generic textarea stub in `src/components/Input/`
- Build at 60.81 KB gzipped — substantial budget remaining

**CRITICAL DISTINCTION — Feature vs Shared Components:**
- `src/components/` = Stateless, reusable UI primitives (Button, Input, Spinner)
- `src/features/` = Stateful, domain-specific modules (PromptInput is HERE)
- PromptInput is a FEATURE component at `src/features/PromptInput/`, NOT in `src/components/`
- PromptInput does NOT extend or wrap the shared Input component — it's a standalone feature component with its own textarea

### Architecture Compliance

**Source: [architecture.md#Feature Modules]**
- Feature components live in `src/features/FeatureName/`
- Connected to Zustand stores (but Story 2.3 handles store wiring — this story uses local state)
- Domain-specific, stateful

**Source: [architecture.md#Naming Patterns]**
| Element | Convention | This Story |
|---------|------------|------------|
| Component | PascalCase | `PromptInput.tsx` |
| Folder | PascalCase | `features/PromptInput/` |
| CSS Module | PascalCase | `PromptInput.module.css` |
| Test | Co-located | `PromptInput.test.tsx` |
| Props interface | PascalCase + Props | `PromptInputProps` |

### UX Design Requirements

**Source: [ux-design-specification.md#UX-8]** — Placeholder: "Describe what you need in your own words"
**Source: [ux-design-specification.md#UX-9]** — Character limit invisible unless approaching maximum
**Source: [ux-design-specification.md#UX-12]** — No zoom-on-focus (font-size >= 16px)
**Source: [ux-design-specification.md#UX-7]** — 44px minimum tap target
**Source: [ux-design-specification.md#Emotional Design]** — "Welcoming Landing" stage: user should think "I know exactly what to do" without instructions

**Character Counter Behavior:**
- HIDDEN when value.length < 800 (80% of 1000)
- VISIBLE as "X / 1000" when value.length >= 800
- Use `aria-live="polite"` for screen reader announcements
- Style with warning/error color as approaching limit

**Auto-focus Strategy:**
- Desktop (pointer:fine or width >= 1025px): auto-focus textarea
- Mobile: do NOT auto-focus (prevents unwanted keyboard popup)
- Use `window.matchMedia('(pointer: fine)')` for detection

### State Management Note

This story uses **local React state** (`useState`) for the textarea value. Story 2.3 will wire this to the Zustand promptStore. Do NOT create or import Zustand stores in this story.

### Anti-Patterns to Avoid

- DO NOT put PromptInput in `src/components/` — it belongs in `src/features/`
- DO NOT use `px` units for font sizes (use `rem` via design tokens)
- DO NOT hardcode colors or spacing values
- DO NOT import or extend the shared `Input` component — PromptInput is independent
- DO NOT create a Zustand store — that's Story 2.3
- DO NOT use inline styles
- DO NOT add the character counter as always-visible — it must be hidden until 80% threshold

### References

- [Source: architecture.md#Feature Modules] - Feature component location
- [Source: architecture.md#Naming Patterns] - Naming conventions
- [Source: architecture.md#ARCH-5] - CSS Modules
- [Source: ux-design-specification.md#UX-7,8,9,12] - UX requirements
- [Source: prd.md#FR1,FR2,FR43-FR47] - Functional requirements
- [Source: epics.md#Story 2.1] - Complete acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- TS6133: Removed unused COUNTER_THRESHOLD constant
- TypeError: window.matchMedia not a function in jsdom — added matchMedia mock to src/test/setup.ts

### Completion Notes List

- Created PromptInput feature component with textarea, label, and progressive character counter
- Character counter hidden when < 800 chars (80% of 1000), visible at/above threshold
- Counter shows error styling at max limit
- Desktop auto-focus via matchMedia('(pointer: fine)') — no focus on mobile to prevent keyboard popup
- Font-size >= 16px (var(--font-size-md)) prevents iOS zoom-on-focus
- All design tokens used, no hardcoded values
- 8 new tests passing (20 total across 5 test files)
- Integrated PromptInput into App.tsx with local useState
- Build: 61.30 KB gzipped JS — well under 200 KB budget
- Added matchMedia mock to test setup for jsdom compatibility

### File List

- src/features/PromptInput/PromptInput.tsx (created)
- src/features/PromptInput/PromptInput.module.css (created)
- src/features/PromptInput/PromptInput.test.tsx (created — 8 tests)
- src/features/PromptInput/index.ts (created)
- src/features/index.ts (modified — exports PromptInput)
- src/App.tsx (modified — added PromptInput with useState)
- src/test/setup.ts (modified — added matchMedia mock for jsdom)
