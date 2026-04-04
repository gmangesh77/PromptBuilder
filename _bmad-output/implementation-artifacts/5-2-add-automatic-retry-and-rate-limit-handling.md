# Story 5.2: Add Automatic Retry & Rate Limit Handling

Status: done

## Story

As a **user**,
I want **the system to automatically retry when something fails temporarily**,
So that **transient errors don't interrupt my experience**.

## Acceptance Criteria

1. **AC1: Automatic Retry**
   - **Given** the useStream hook encounters a transient API error
   - **When** the error is retryable (network timeout, 500/502/503 from API)
   - **Then** automatic retry is attempted with exponential backoff (FR40)
   - **And** retry delays follow: 1s, 2s, 4s (max 3 retries)
   - **And** during retry, the UI shows "Retrying..." status
   - **And** user input is preserved throughout all retries (FR41)

2. **AC2: Max Retries Exhausted**
   - **Given** all 3 retry attempts fail
   - **When** the final retry is exhausted
   - **Then** a toast shows: "Unable to generate prompt. Please try again."
   - **And** the Generate button is re-enabled for manual retry
   - **And** the user's input text and platform selection remain intact

3. **AC3: Rate Limit Handling**
   - **Given** the API returns a 429 rate limit response
   - **When** the rate limit error is received
   - **Then** a toast shows: "Too many requests. Please wait a moment and try again."
   - **And** no automatic retry is attempted for rate limit errors

4. **AC4: Error Mapping**
   - **Given** the OpenAI API returns a documented error code
   - **When** the error is caught by the API proxy
   - **Then** it is mapped to a user-friendly message per error type
   - **And** the original error details are logged server-side only

5. **AC5: Input Preservation**
   - **Given** any error scenario
   - **When** the user's input is checked
   - **Then** the text area content is never cleared or lost
   - **And** the platform selection is preserved

## Tasks / Subtasks

- [x] Task 1: Add retry logic to useStream (AC: #1, #2)
  - [x] 1.1: Add retry loop with exponential backoff (1s, 2s, 4s)
  - [x] 1.2: Only retry on retryable errors (network, 500+)
  - [x] 1.3: Show "Retrying..." via appendChunk during retry
  - [x] 1.4: After max retries, show final error toast

- [x] Task 2: Add rate limit detection (AC: #3)
  - [x] 2.1: Detect 429 status in useStream
  - [x] 2.2: Show rate limit toast, skip retry

- [x] Task 3: Add error mapping to API endpoint (AC: #4)
  - [x] 3.1: Map OpenAI error codes to user-friendly messages in api/generate.ts

- [x] Task 4: Verify build, lint, and tests pass (AC: all)
  - [x] 4.1: Run build, lint, test

## Dev Notes

### Previous Story Intelligence

**Story 5.1 established:**
- Sonner toast system with Toaster in App.tsx root
- useStream already has toast.error calls at all error points
- ErrorBoundary wrapping App content
- 90/90 tests across 17 files

### Key Technical Decisions

**Retry strategy:** Only retry on network errors and 500+ server errors. Do NOT retry on 400, 401, 429. Exponential backoff: 1000ms, 2000ms, 4000ms.

**Rate limit:** 429 is not retryable — show immediate toast message and stop.

**Input preservation:** Already handled by Zustand stores — input state is never cleared on error.

### References

- [Source: epics.md#Story 5.2] - Complete acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- Refactored useStream with retry loop: max 3 retries with 1s/2s/4s exponential backoff
- Only retries on network errors and 500+ server errors
- 429 rate limit errors: immediate toast, no retry
- 400/401 client errors: immediate toast, no retry
- "Retrying... (attempt X/Y)" shown in streaming area during retry
- After all retries exhausted: "Unable to generate prompt" toast
- Updated api/generate.ts with OpenAI error mapping: 401→config error, 429→rate limit, 500+→service unavailable, timeout→504
- Input preservation guaranteed — Zustand stores never cleared on error
- Build: 75.45 KB gzipped JS
- Tests: 90/90 passing across 17 test files

### File List

- src/hooks/useStream.ts (modified — added retry loop, rate limit detection, exponential backoff)
- api/generate.ts (modified — added OpenAI error code mapping to user-friendly messages)
