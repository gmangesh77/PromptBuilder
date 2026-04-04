# Story 2.3: Create Prompt Store & Wire Input State

Status: done

## Story

As a **user**,
I want **my text input and platform selection to be connected with a Generate button**,
So that **I can submit my request when I'm ready**.

## Acceptance Criteria

1. **AC1: Zustand promptStore**
   - **Given** the Zustand promptStore is created
   - **When** the store is initialized
   - **Then** it contains state for: `userInput` (string), `selectedPlatform` (Platform enum defaulting to "chatgpt")
   - **And** it exposes actions: `setUserInput()`, `setPlatform()`, `clearInput()`
   - **And** selector hooks are exported: `useUserInput()`, `useSelectedPlatform()` (ARCH pattern)

2. **AC2: PromptInput Wired to Store**
   - **Given** the PromptInput component
   - **When** the user types text
   - **Then** the promptStore `userInput` state is updated in real-time via `setUserInput()`

3. **AC3: PlatformSelector Wired to Store**
   - **Given** the PlatformSelector component
   - **When** the user selects a platform
   - **Then** the promptStore `selectedPlatform` state is updated via `setPlatform()`

4. **AC4: Generate Button**
   - **Given** the input area
   - **When** a Generate button is rendered below the input and platform selector
   - **Then** it is enabled only when `userInput` is non-empty (minimum 10 characters)
   - **And** it is disabled with a visual disabled state when input is empty or too short
   - **And** the button text reads "Generate" (UX-5)
   - **And** clicking the button currently has no action (wired in Epic 3)

5. **AC5: Enter Key Shortcut**
   - **Given** the complete input section
   - **When** the user presses Enter (with Shift+Enter for newlines)
   - **Then** the Generate action is triggered if input is valid (keyboard shortcut)

6. **AC6: Tab Order**
   - **Given** all components on the page
   - **When** the user navigates via Tab
   - **Then** the tab order follows: text area -> platform selector -> Generate button (NFR-A2)

## Tasks / Subtasks

- [x] Task 1: Create Zustand promptStore (AC: #1)
  - [x] 1.1: Create src/stores/promptStore.ts with state: userInput (string, default ''), selectedPlatform (Platform, default 'chatgpt')
  - [x] 1.2: Implement actions: setUserInput(input: string), setPlatform(platform: Platform), clearInput()
  - [x] 1.3: Export selector hooks: useUserInput(), useSelectedPlatform()
  - [x] 1.4: Update src/stores/index.ts barrel export

- [x] Task 2: Wire PromptInput and PlatformSelector to store (AC: #2, #3)
  - [x] 2.1: Update App.tsx to replace local useState with store selectors and actions
  - [x] 2.2: Pass store-connected value/onChange to PromptInput and PlatformSelector

- [x] Task 3: Add Generate button with validation (AC: #4)
  - [x] 3.1: Add Generate button in App.tsx below PromptInput and PlatformSelector using shared Button component
  - [x] 3.2: Disable button when userInput.trim().length < 10
  - [x] 3.3: Button text: "Generate", onClick: no-op for now

- [x] Task 4: Implement Enter key shortcut (AC: #5)
  - [x] 4.1: Add onKeyDown handler to textarea: Enter submits (if valid), Shift+Enter inserts newline
  - [x] 4.2: Extract canGenerate logic to shared helper

- [x] Task 5: Write tests (AC: #1, #2, #3, #4, #5, #6)
  - [x] 5.1: Test promptStore: initial state, setUserInput, setPlatform, clearInput
  - [x] 5.2: Test Generate button disabled when input < 10 chars
  - [x] 5.3: Test Generate button enabled when input >= 10 chars
  - [x] 5.4: Test tab order (textarea -> selector -> button)
  - [x] 5.5: Verify build, lint, and all tests pass

## Dev Notes

### Previous Story Intelligence

**Story 2.1 established:**
- PromptInput accepts value/onChange props — ready for store wiring
- 8 tests for PromptInput (placeholder, counter threshold, maxLength, accessibility)

**Story 2.2 established:**
- PlatformSelector accepts value/onChange with Platform type
- Platform type at src/types/platform.ts
- PLATFORMS and DEFAULT_PLATFORM at src/constants/platforms.ts
- 4 tests for PlatformSelector

**Current App.tsx uses local useState** — this story replaces it with Zustand store.

### Architecture: Zustand Store Pattern

**Source: [architecture.md#ARCH-3]**

```typescript
// Store pattern
import { create } from 'zustand';

// Action naming: set + noun, verb + noun
// Selector exports: export const useX = () => useStore((s) => s.x)
```

**Store location:** `src/stores/promptStore.ts`

### Generate Button Rules

- Minimum 10 characters of trimmed input to enable
- Use the shared Button component from src/components/Button
- Text: "Generate"
- onClick: no-op (Epic 3 will wire to generation API)
- Visual disabled state when input too short

### Enter Key Behavior

- **Enter** (no modifiers): triggers Generate if input is valid (>= 10 chars)
- **Shift+Enter**: inserts newline (default textarea behavior)
- Must prevent default on Enter to avoid newline insertion when generating

### Tab Order

Natural DOM order gives correct tab sequence:
1. textarea (PromptInput)
2. select (PlatformSelector)
3. button (Generate)

No tabIndex manipulation needed — just correct DOM ordering.

### References

- [Source: architecture.md#ARCH-3] - Zustand state management
- [Source: epics.md#Story 2.3] - Complete acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- Created Zustand promptStore with userInput, selectedPlatform, setUserInput, setPlatform, clearInput
- Exported selector hooks: useUserInput(), useSelectedPlatform()
- Replaced local useState in App.tsx with store selectors and actions
- Added Generate button using shared Button component, disabled when input < 10 chars
- Added Enter key shortcut: Enter submits (when valid), Shift+Enter for newlines
- Tab order correct: textarea -> selector -> button (natural DOM order)
- 4 new store tests + 4 new App integration tests (32 total across 7 files)
- Build: 62.18 KB gzipped JS

### File List

- src/stores/promptStore.ts (created)
- src/stores/promptStore.test.ts (created — 4 tests)
- src/stores/index.ts (modified — exports promptStore hooks)
- src/features/PromptInput/PromptInput.tsx (modified — added onSubmit prop and Enter key handler)
- src/App.tsx (modified — store wiring, Generate button, removed local state)
- src/App.test.tsx (modified — added Generate button and tab order tests)
