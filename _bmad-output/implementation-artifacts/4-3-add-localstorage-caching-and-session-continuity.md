# Story 4.3: Add localStorage Caching & Session Continuity

Status: done

## Story

As a **user**,
I want **my last generated prompt to persist if I accidentally close the tab**,
So that **I don't lose my work and can come back to copy it**.

## Acceptance Criteria

1. **AC1: Cache on Generation**
   - **Given** a prompt has been generated
   - **When** the generation completes
   - **Then** the prompt, platform, and user input are cached in localStorage (ARCH-14)
   - **And** the cache key is structured (e.g., `promptbuilder_last_generation`)

2. **AC2: Restore on Load**
   - **Given** the user returns to PromptBuilder
   - **When** the app loads and cached data exists
   - **Then** the last generated prompt is restored in the Output component
   - **And** the original user input is restored in the PromptInput field
   - **And** the selected platform is restored in the PlatformSelector

3. **AC3: useLocalStorage Hook**
   - **Given** the `useLocalStorage` custom hook
   - **When** implemented
   - **Then** it provides `get`, `set`, and `clear` operations with type safety
   - **And** it handles missing/corrupted data gracefully (returns defaults)
   - **And** it does not store any PII (NFR-S4)

4. **AC4: Cache Update**
   - **Given** the user generates a new prompt
   - **When** the new generation completes
   - **Then** the localStorage cache is updated with the latest generation
   - **And** old cached data is replaced

## Tasks / Subtasks

- [x] Task 1: Create useLocalStorage hook (AC: #3)
  - [x] 1.1: Create src/hooks/useLocalStorage.ts
  - [x] 1.2: Typed get/set/clear operations
  - [x] 1.3: Handle JSON parse errors gracefully
  - [x] 1.4: Create src/hooks/useLocalStorage.test.ts
  - [x] 1.5: Update src/hooks/index.ts barrel export

- [x] Task 2: Add cache persistence logic (AC: #1, #4)
  - [x] 2.1: Cache to localStorage when generatedPrompt is set
  - [x] 2.2: Cache key: `promptbuilder_last_generation`
  - [x] 2.3: Cache object: { userInput, platform, generatedPrompt }

- [x] Task 3: Restore cached state on load (AC: #2)
  - [x] 3.1: On app mount, read from localStorage
  - [x] 3.2: Restore promptStore (userInput, platform) and generationStore (generatedPrompt)

- [x] Task 4: Write tests (AC: #1-4)
  - [x] 4.1: Test useLocalStorage hook
  - [x] 4.2: Test cache persistence and restore

- [x] Task 5: Verify build, lint, and tests pass (AC: all)
  - [x] 5.1: Run build, lint, test

## Dev Notes

### Previous Story Intelligence

**Story 4.2 established:**
- FeedbackWidget below PromptOutput
- feedbackStore with resetFeedback on new generation
- 83/83 tests passing across 15 test files

### Key Technical Decisions

**Cache key:** `promptbuilder_last_generation` — single key with JSON object value.

**Restore timing:** On app mount (useEffect in App.tsx), before first render completes.

**No PII:** Only stores userInput, platform, generatedPrompt — no user identifiers.

### References

- [Source: epics.md#Story 4.3] - Complete acceptance criteria
- [Source: architecture.md#ARCH-14] - localStorage caching

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- Created useLocalStorage hook with typed get/set/clear and graceful JSON parse error handling
- Cache key: `promptbuilder_last_generation` stores { userInput, platform, generatedPrompt }
- Restore on mount via useEffect with ref guard to prevent double-execution in StrictMode
- Cache updates automatically when generatedPrompt changes and streaming is complete
- 4 useLocalStorage tests: missing key, round-trip, clear, corrupted JSON
- Build: 65.49 KB gzipped JS
- Tests: 87/87 passing across 16 test files

### File List

- src/hooks/useLocalStorage.ts (created)
- src/hooks/useLocalStorage.test.ts (created — 4 tests)
- src/hooks/index.ts (modified — added useLocalStorage export)
- src/App.tsx (modified — added cache restore on mount and cache update on generation)
