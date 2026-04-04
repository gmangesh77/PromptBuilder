# Story 2.2: Create PlatformSelector Component

Status: done

## Story

As a **user**,
I want **to choose which AI platform I want my prompt optimized for**,
So that **I get a prompt tailored to the specific platform I plan to use**.

## Acceptance Criteria

1. **AC1: Platform Options Render**
   - **Given** the PromptBuilder interface
   - **When** the PlatformSelector component renders
   - **Then** a dropdown/select is displayed with 5 platform options: ChatGPT, Claude, Gemini, Grok, Perplexity (FR11)
   - **And** ChatGPT is pre-selected as the default (UX-4)
   - **And** the selector has an associated label for accessibility (FR46, NFR-A9)

2. **AC2: Platform Selection Updates**
   - **Given** the platform selector
   - **When** a user selects a different platform
   - **Then** the selection is updated immediately
   - **And** the selected platform is visually indicated

3. **AC3: Mobile Touch**
   - **Given** the selector on mobile
   - **When** the user taps the dropdown
   - **Then** the native mobile select experience is used (touch-friendly)
   - **And** the tap target is at least 44x44px (UX-7)

4. **AC4: Keyboard Accessibility**
   - **Given** the selector
   - **When** navigated via keyboard
   - **Then** it is reachable via Tab and operable with Arrow keys and Enter (FR43, NFR-A1)
   - **And** a visible focus indicator is displayed (FR44)

5. **AC5: Non-Color Selection Indication**
   - **Given** the selector
   - **When** color is used to indicate the selected state
   - **Then** the selection is also conveyed through non-color means (text, icon, or border) (NFR-A7)

## Tasks / Subtasks

- [x] Task 1: Create Platform type and constants (AC: #1)
  - [x] 1.1: Create src/types/platform.ts with Platform type (union of platform string literals)
  - [x] 1.2: Update src/types/index.ts barrel export
  - [x] 1.3: Create src/constants/platforms.ts with PLATFORMS array (label + value pairs) and DEFAULT_PLATFORM
  - [x] 1.4: Update src/constants/index.ts barrel export

- [x] Task 2: Create PlatformSelector component (AC: #1, #2, #3, #4, #5)
  - [x] 2.1: Create src/features/PromptInput/PlatformSelector.tsx using native `<select>` element (gives native mobile experience for free)
  - [x] 2.2: Accept props: value, onChange, disabled, className
  - [x] 2.3: Render associated `<label>` with the select
  - [x] 2.4: Map PLATFORMS array to `<option>` elements

- [x] Task 3: Style with CSS Modules (AC: #3, #5)
  - [x] 3.1: Create src/features/PromptInput/PlatformSelector.module.css
  - [x] 3.2: Ensure min-height meets 44px tap target
  - [x] 3.3: Style with design tokens, font-size >= 16px

- [x] Task 4: Write tests (AC: #1, #2, #4)
  - [x] 4.1: Test renders all 5 platform options
  - [x] 4.2: Test ChatGPT is default selected value
  - [x] 4.3: Test onChange fires when platform changes
  - [x] 4.4: Test label association for accessibility

- [x] Task 5: Integrate into App.tsx and update exports (AC: #1)
  - [x] 5.1: Import and render PlatformSelector in App.tsx with local state (useState)
  - [x] 5.2: Update src/features/PromptInput/index.ts to also export PlatformSelector
  - [x] 5.3: Verify npm run build, npm run lint, npm run test all pass

## Dev Notes

### Previous Story Intelligence

**Story 2.1 established:**
- PromptInput feature component in `src/features/PromptInput/`
- matchMedia mock in test setup (window.matchMedia)
- App.tsx uses local useState for prompt value
- 20 tests passing across 5 test files
- Build at 61.30 KB gzipped

**CRITICAL: PlatformSelector lives INSIDE the PromptInput feature folder** per architecture:
```
features/PromptInput/
├── PromptInput.tsx
├── PlatformSelector.tsx        ← HERE (sub-component of the PromptInput feature)
├── PlatformSelector.module.css
├── PlatformSelector.test.tsx
└── index.ts
```

### Why Native `<select>` Element

Using native HTML `<select>` gives us:
- Free native mobile dropdown experience (iOS picker, Android dropdown)
- Full keyboard accessibility (Tab, Arrow, Enter) with no extra code
- Proper semantics for screen readers
- 44px tap target via CSS min-height
- Non-color selection indication (the selected text is shown in the select box)

DO NOT create a custom dropdown — native `<select>` is the right choice per UX spec "native mobile select experience".

### Platform Constants

5 platforms: ChatGPT (default), Claude, Gemini, Grok, Perplexity
- Type: `Platform = 'chatgpt' | 'claude' | 'gemini' | 'grok' | 'perplexity'`
- Default: `'chatgpt'`
- This story uses local state; Story 2.3 wires to Zustand store

### State Management Note

Like Story 2.1, this story uses **local React state** (`useState`). Story 2.3 will wire both PromptInput and PlatformSelector to the Zustand promptStore. Do NOT create or import Zustand stores.

### References

- [Source: architecture.md#Feature Modules] - PlatformSelector in PromptInput feature
- [Source: architecture.md#types/platform.ts] - Platform type location
- [Source: architecture.md#constants/platforms.ts] - Platform constants location
- [Source: ux-design-specification.md#UX-4] - ChatGPT default
- [Source: ux-design-specification.md#UX-7] - 44px tap target
- [Source: prd.md#FR11] - 5 platform options
- [Source: epics.md#Story 2.2] - Complete acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- Created Platform type ('chatgpt' | 'claude' | 'gemini' | 'grok' | 'perplexity') in src/types/platform.ts
- Created PLATFORMS constant array and DEFAULT_PLATFORM in src/constants/platforms.ts
- Built PlatformSelector using native `<select>` for free mobile/keyboard accessibility
- Custom chevron SVG via CSS background-image (appearance: none for cross-browser styling)
- 4 new tests passing (24 total across 6 test files)
- Integrated PlatformSelector into App.tsx with local useState
- Build: 61.54 KB gzipped JS

### File List

- src/types/platform.ts (created)
- src/types/index.ts (modified — exports Platform)
- src/constants/platforms.ts (created)
- src/constants/index.ts (modified — exports PLATFORMS, DEFAULT_PLATFORM)
- src/features/PromptInput/PlatformSelector.tsx (created)
- src/features/PromptInput/PlatformSelector.module.css (created)
- src/features/PromptInput/PlatformSelector.test.tsx (created — 4 tests)
- src/features/PromptInput/index.ts (modified — exports PlatformSelector)
- src/App.tsx (modified — added PlatformSelector with useState)
