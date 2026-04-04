# Story 4.1: Build Output Display with Copy-to-Clipboard

Status: done

## Story

As a **user**,
I want **to see my generated prompt clearly displayed and copy it with one click**,
So that **I can immediately paste it into my chosen AI platform**.

## Acceptance Criteria

1. **AC1: Prompt Display**
   - **Given** generation has completed
   - **When** the Output component renders
   - **Then** the complete generated prompt is displayed in a prominent container (FR28, UX-3)
   - **And** the prompt text is formatted with clear structure and readability (FR21)

2. **AC2: Copy Button**
   - **Given** the Output component
   - **When** a "Copy to Clipboard" button is displayed
   - **Then** the button is large, obvious, and clearly labeled (UX-10)
   - **And** the button meets 44x44px minimum tap target on mobile (UX-7)
   - **And** the button is keyboard accessible (FR43)

3. **AC3: Copy Feedback**
   - **Given** the user clicks the Copy button
   - **When** the Clipboard API is invoked
   - **Then** the prompt text is copied to the system clipboard (FR26)
   - **And** visual confirmation "Copied!" is displayed within 100ms (FR27, NFR-P5)
   - **And** the confirmation reverts to "Copy to Clipboard" after 2 seconds

4. **AC4: Clipboard Fallback**
   - **Given** the Clipboard API is not available
   - **When** the copy action is attempted
   - **Then** a fallback method is used (NFR-I8)

5. **AC5: useClipboard Hook**
   - **Given** the `useClipboard` custom hook
   - **When** implemented
   - **Then** it handles Clipboard API with fallback, returns `{ copy, isCopied }` state

## Tasks / Subtasks

- [x] Task 1: Create useClipboard hook (AC: #3, #4, #5)
  - [x] 1.1: Create src/hooks/useClipboard.ts
  - [x] 1.2: Use navigator.clipboard.writeText with fallback
  - [x] 1.3: Return { copy, isCopied } — isCopied resets after 2 seconds
  - [x] 1.4: Create src/hooks/useClipboard.test.ts with tests
  - [x] 1.5: Update src/hooks/index.ts barrel export

- [x] Task 2: Update PromptOutput with Copy button (AC: #1, #2, #3)
  - [x] 2.1: Add Copy to Clipboard button to PromptOutput component
  - [x] 2.2: Use useClipboard hook
  - [x] 2.3: Show "Copied!" feedback state
  - [x] 2.4: Style button prominently with 44px min height

- [x] Task 3: Write tests (AC: #1-5)
  - [x] 3.1: Test copy button renders and is accessible
  - [x] 3.2: Test "Copied!" feedback appears after click

- [x] Task 4: Verify build, lint, and tests pass (AC: all)
  - [x] 4.1: Run build, lint, test

## Dev Notes

### Previous Story Intelligence

**Story 3.3 established:**
- PromptOutput component exists at src/features/Generation/PromptOutput.tsx
- Reads generatedPrompt from generationStore
- Has heading "Your Optimized Prompt" and prompt display

### Key Technical Decisions

**useClipboard hook:** Uses navigator.clipboard.writeText() as primary. Falls back to textarea + execCommand('copy') for older browsers. Returns `{ copy: (text) => void, isCopied: boolean }`. isCopied auto-resets after 2 seconds via setTimeout.

**Button placement:** Inside the PromptOutput container, above or to the right of the prompt text.

### References

- [Source: epics.md#Story 4.1] - Complete acceptance criteria
- [Source: architecture.md#ARCH-4] - useClipboard hook in hooks directory

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Initial test failures: `document.execCommand` not defined in jsdom — fixed by assigning `document.execCommand = vi.fn()` directly instead of `vi.spyOn`
- `Object.assign(navigator, { clipboard: ... })` doesn't create Vitest spy — fixed by using `Object.defineProperty` and tracking the mock fn separately

### Completion Notes List

- Created useClipboard hook with navigator.clipboard.writeText primary + textarea/execCommand fallback
- Hook returns { copy, isCopied } — isCopied auto-resets after 2 seconds via setTimeout
- Updated PromptOutput with prominent Copy to Clipboard button in header row (flexbox layout)
- Button uses primary color styling with 44px min-height tap target
- "Copied!" feedback shown immediately on click, aria-label updates for screen readers
- 5 useClipboard tests: initial state, copy success, 2s reset, fallback when unavailable, fallback on throw
- 7 PromptOutput tests: no render when empty, prompt display, heading, a11y label, copy button render, keyboard accessible, Copied! feedback
- Build: 64.62 KB gzipped JS
- Tests: 72/72 passing across 13 test files

### File List

- src/hooks/useClipboard.ts (created)
- src/hooks/useClipboard.test.ts (created — 5 tests)
- src/hooks/index.ts (modified — added useClipboard export)
- src/features/Generation/PromptOutput.tsx (modified — added copy button with useClipboard)
- src/features/Generation/PromptOutput.module.css (modified — added header layout and copyButton styles)
- src/features/Generation/PromptOutput.test.tsx (modified — 7 tests, added copy button tests)
