# Story 3.2: Create Streaming Hook & Generation Store

Status: done

## Story

As a **user**,
I want **to click Generate and see the response appear in real-time**,
So that **I know the system is actively working on my request**.

## Acceptance Criteria

1. **AC1: Generation Store**
   - **Given** the Zustand generationStore is created
   - **When** initialized
   - **Then** it contains state for: `isStreaming` (boolean), `streamedContent` (string), `analysisSteps` (string[]), `generatedPrompt` (string | null), `error` (AppError | null)
   - **And** it exposes actions: `startGeneration()`, `appendChunk()`, `addAnalysisStep()`, `setGeneratedPrompt()`, `setError()`, `resetGeneration()`
   - **And** selector hooks are exported per ARCH patterns

2. **AC2: useStream Hook**
   - **Given** the `useStream` custom hook
   - **When** called with a URL and request body
   - **Then** it initiates a fetch request with `Accept: text/event-stream`
   - **And** it reads the response body as a ReadableStream
   - **And** each SSE chunk is parsed using a `parseSSE` utility (ARCH-4)
   - **And** parsed data is dispatched to the generationStore

3. **AC3: Generate Button Wiring**
   - **Given** the Generate button from Epic 2
   - **When** the user clicks Generate with valid input
   - **Then** `generationStore.startGeneration()` is called
   - **And** `useStream` is invoked with `/api/generate` and `{ userInput, platform }` from promptStore
   - **And** the Generate button shows a disabled state with spinner
   - **And** the button remains disabled until streaming completes

4. **AC4: Real-Time Streaming**
   - **Given** a streaming response
   - **When** chunks arrive
   - **Then** they are appended to `streamedContent` in real-time
   - **And** the UI updates with < 100ms latency per chunk (NFR-P4)

5. **AC5: Stream Completion**
   - **Given** the stream completes
   - **When** `[DONE]` is received
   - **Then** `isStreaming` is set to false
   - **And** the final prompt is extracted and stored in `generatedPrompt`
   - **And** the Generate button returns to its enabled state

## Tasks / Subtasks

- [x] Task 1: Create AppError type and ErrorCode (AC: #1)
  - [x] 1.1: Create src/types/error.ts with AppError interface and ErrorCode union type
  - [x] 1.2: Update src/types/index.ts barrel export

- [x] Task 2: Create parseSSE utility (AC: #2)
  - [x] 2.1: Create src/utils/parseSSE.ts that parses SSE `data:` lines
  - [x] 2.2: Handle [DONE] sentinel, JSON parse, error chunks
  - [x] 2.3: Create src/utils/parseSSE.test.ts with unit tests
  - [x] 2.4: Update src/utils/index.ts barrel export

- [x] Task 3: Create generationStore (AC: #1)
  - [x] 3.1: Create src/stores/generationStore.ts with state and actions
  - [x] 3.2: Export selector hooks: useIsStreaming, useStreamedContent, useGeneratedPrompt, useGenerationError
  - [x] 3.3: Create src/stores/generationStore.test.ts with unit tests
  - [x] 3.4: Update src/stores/index.ts barrel export

- [x] Task 4: Create useStream hook (AC: #2, #4, #5)
  - [x] 4.1: Create src/hooks/useStream.ts with fetch + ReadableStream SSE parsing
  - [x] 4.2: Dispatch parsed chunks to generationStore
  - [x] 4.3: Handle [DONE], errors, and stream completion
  - [x] 4.4: Update src/hooks/index.ts barrel export

- [x] Task 5: Wire Generate button to streaming (AC: #3)
  - [x] 5.1: Update App.tsx: import generation store and useStream
  - [x] 5.2: handleGenerate calls startGeneration + triggers stream
  - [x] 5.3: Show Spinner in Generate button while streaming
  - [x] 5.4: Disable button during streaming

- [x] Task 6: Verify build, lint, and tests pass (AC: all)
  - [x] 6.1: Run npm run build and confirm success
  - [x] 6.2: Run npm run lint and confirm clean
  - [x] 6.3: Run npm run test and confirm no regressions

## Dev Notes

### Previous Story Intelligence

**Story 3.1 established:**
- api/generate.ts: Full SSE streaming endpoint with Web Standard API
- SSE format: `data: {"content":"..."}` chunks, ends with `data: [DONE]`
- Error format: `{ error: { code: "ERROR_CODE", message: "..." } }`
- OpenAI client, Zod validation, rate limiting all implemented

**Story 2.3 established:**
- promptStore with userInput, selectedPlatform, actions, selectors
- Generate button in App.tsx using shared Button component
- Button disabled when input < 10 chars
- handleGenerate is currently a no-op

### Key Technical Decisions

**AppError type (ARCH-18):**
```typescript
interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
}
type ErrorCode = 'NETWORK_ERROR' | 'RATE_LIMITED' | 'API_ERROR' | 'VALIDATION_ERROR' | 'STREAM_INTERRUPTED';
```

**parseSSE utility:** Parse each `data: ` line from SSE stream. Handle `[DONE]` as stream-end signal. Parse JSON content chunks. Handle error chunks embedded in stream.

**useStream hook:** Uses native fetch + ReadableStream (ARCH-4). No Vercel AI SDK. Reads stream via TextDecoderStream or manual TextDecoder. Dispatches to generationStore.

**Generate button during streaming:** Show Spinner component inside button, disable button. Text changes to show loading state.

### Anti-Patterns to Avoid

- DO NOT use Vercel AI SDK — use raw fetch + ReadableStream
- DO NOT use EventSource API — use fetch for POST support
- DO NOT add artificial delays to streaming
- DO NOT test useStream hook directly (requires SSE mocking) — test parseSSE utility and store separately

### References

- [Source: architecture.md#ARCH-4] - Streaming via fetch/ReadableStream
- [Source: architecture.md#ARCH-18] - AppError structure
- [Source: architecture.md#ARCH-19] - AsyncState pattern
- [Source: architecture.md#ARCH-23] - Data flow
- [Source: epics.md#Story 3.2] - Complete acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- Created AppError interface and ErrorCode type in src/types/error.ts
- Created parseSSE utility with 8 unit tests: handles content chunks, [DONE], error chunks, invalid data
- Created generationStore with isStreaming, streamedContent, analysisSteps, generatedPrompt, error state
- Exported 4 selector hooks: useIsStreaming, useStreamedContent, useGeneratedPrompt, useGenerationError
- 7 generationStore tests covering all actions and state transitions
- Created useStream hook using native fetch + ReadableStream (ARCH-4, no Vercel AI SDK)
- Hook handles SSE parsing, error responses, stream completion, abort support
- Wired Generate button: shows Spinner + "Generating..." text during streaming
- Disables input, selector, and button during streaming
- Build: 63.20 KB gzipped JS (well under 200 KB limit)
- Tests: 48/48 passing across 9 test files (16 new tests)

### File List

- src/types/error.ts (created — AppError, ErrorCode)
- src/types/index.ts (modified — exports error types)
- src/utils/parseSSE.ts (created — SSE line parser)
- src/utils/parseSSE.test.ts (created — 8 tests)
- src/utils/index.ts (modified — exports parseSSE)
- src/stores/generationStore.ts (created — streaming state store)
- src/stores/generationStore.test.ts (created — 7 tests)
- src/stores/index.ts (modified — exports generationStore)
- src/hooks/useStream.ts (created — fetch + ReadableStream SSE hook)
- src/hooks/index.ts (modified — exports useStream)
- src/App.tsx (modified — wired streaming, spinner in button)
- src/App.test.tsx (modified — 9 tests, added streaming state test)
