# Story 5.1: Implement Error Display System with ErrorBoundary & Toasts

Status: done

## Story

As a **user**,
I want **to see clear, helpful messages when something goes wrong**,
So that **I understand what happened and know what to do next**.

## Acceptance Criteria

1. **AC1: AppError Type System**
   - **Given** the AppError type system
   - **When** implemented in `src/types/error.ts`
   - **Then** it defines `AppError` with `code`, `message`, and optional `details` (ARCH-18)
   - **And** `ErrorCode` includes: `NETWORK_ERROR`, `RATE_LIMITED`, `API_ERROR`, `VALIDATION_ERROR`, `STREAM_INTERRUPTED`

2. **AC2: Toast Notifications**
   - **Given** an API or network error occurs during generation
   - **When** the error is caught by the useStream hook
   - **Then** a sonner toast notification appears with the user-friendly error message (ARCH-7)
   - **And** the toast includes a contextual action (e.g., "Try Again" button for retryable errors)
   - **And** the error is logged to console for debugging

3. **AC3: Streaming Interruption**
   - **Given** a streaming interruption
   - **When** the SSE connection drops mid-stream
   - **Then** a toast shows "Connection interrupted. Your input has been preserved." (FR39)
   - **And** any partial output is preserved and visible
   - **And** the Generate button returns to enabled state

4. **AC4: ErrorBoundary**
   - **Given** the React ErrorBoundary component
   - **When** an unexpected rendering error occurs
   - **Then** a friendly fallback UI is displayed instead of a white screen
   - **And** a "Try Again" button allows the user to recover

5. **AC5: Sonner Setup**
   - **Given** the sonner toast system
   - **When** initialized in the App root
   - **Then** toasts appear at a consistent position
   - **And** toasts auto-dismiss after 5 seconds
   - **And** toasts are keyboard dismissible with Esc

## Tasks / Subtasks

- [x] Task 1: Set up sonner Toaster (AC: #5)
  - [x] 1.1: Add `<Toaster />` to App.tsx root
  - [x] 1.2: Configure position, auto-dismiss, styling

- [x] Task 2: Add toast notifications to useStream (AC: #2, #3)
  - [x] 2.1: Import sonner toast in useStream hook
  - [x] 2.2: Show toast on API errors with user-friendly messages
  - [x] 2.3: Show toast on stream interruption
  - [x] 2.4: Log errors to console

- [x] Task 3: Create ErrorBoundary component (AC: #4)
  - [x] 3.1: Create src/components/ErrorBoundary/ErrorBoundary.tsx
  - [x] 3.2: Friendly fallback UI with "Try Again" button
  - [x] 3.3: Wrap App content with ErrorBoundary

- [x] Task 4: Write tests (AC: #1-5)
  - [x] 4.1: Test ErrorBoundary renders fallback on error
  - [x] 4.2: Test ErrorBoundary "Try Again" recovers

- [x] Task 5: Verify build, lint, and tests pass (AC: all)
  - [x] 5.1: Run build, lint, test

## Dev Notes

### Previous Story Intelligence

**Story 3.2 established:**
- AppError type and ErrorCode already exist in src/types/error.ts
- useStream hook already dispatches setError on failures
- generationStore already has error state

**Story 4.3 established:**
- 87/87 tests across 16 files
- sonner already in package.json dependencies

### Key Technical Decisions

**Sonner toast:** Already a project dependency. Use `toast.error()` for errors and `toast.success()` for confirmations. Position: top-center on mobile, top-right on desktop (sonner handles responsive).

**ErrorBoundary:** Class component (React requirement). Shows friendly message + "Try Again" button that calls `this.setState({ hasError: false })`.

### References

- [Source: epics.md#Story 5.1] - Complete acceptance criteria
- [Source: architecture.md#ARCH-7] - Sonner toast library
- [Source: architecture.md#ARCH-26] - Error display patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- ErrorBoundary recovery test: module-scoped `shouldThrow` variable needed instead of props to control throw timing correctly with React re-render cycle

### Completion Notes List

- Added `<Toaster>` from sonner to App.tsx root: top-center position, 5s auto-dismiss, close button
- Added `toast.error()` calls to all error paths in useStream: API errors, stream interruption, chunk errors, network errors
- Added `console.error()` logging at all error points for debugging
- Created ErrorBoundary class component with fallback UI: "Something went wrong" + "Try Again" button
- ErrorBoundary wraps entire App content, logs errors via componentDidCatch
- 3 ErrorBoundary tests: renders children, fallback on error, recovery on Try Again
- Build: 75.12 KB gzipped JS (sonner adds ~10KB)
- Tests: 90/90 passing across 17 test files

### File List

- src/hooks/useStream.ts (modified — added sonner toast.error calls and console.error logging)
- src/components/ErrorBoundary/ErrorBoundary.tsx (created)
- src/components/ErrorBoundary/ErrorBoundary.module.css (created)
- src/components/ErrorBoundary/ErrorBoundary.test.tsx (created — 3 tests)
- src/components/ErrorBoundary/index.ts (created)
- src/components/index.ts (modified — added ErrorBoundary export)
- src/App.tsx (modified — added Toaster, ErrorBoundary wrapper)
