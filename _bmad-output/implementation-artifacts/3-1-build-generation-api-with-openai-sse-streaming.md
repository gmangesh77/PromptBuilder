# Story 3.1: Build Generation API with OpenAI SSE Streaming

Status: done

## Story

As a **developer**,
I want **a serverless API endpoint that connects to OpenAI and streams responses via SSE**,
So that **the frontend can receive real-time generation output for the streaming UI**.

## Acceptance Criteria

1. **AC1: Request Validation**
   - **Given** the `/api/generate.ts` Vercel serverless function
   - **When** a POST request is received with `{ userInput: string, platform: string }`
   - **Then** the request body is validated using a Zod schema (ARCH-6)
   - **And** invalid requests return `{ error: { code: "VALIDATION_ERROR", message: "..." } }` with 400 status

2. **AC2: OpenAI Streaming**
   - **Given** a valid request
   - **When** the OpenAI API is called
   - **Then** the API key is read from server-side environment variables only (NFR-S2)
   - **And** the request uses the OpenAI streaming API with `stream: true`
   - **And** the response is returned as SSE (`Content-Type: text/event-stream`)

3. **AC3: SSE Chunk Forwarding**
   - **Given** the SSE response
   - **When** OpenAI streams chunks
   - **Then** each chunk is forwarded as an SSE `data:` event in real-time
   - **And** the stream ends with a `data: [DONE]` event
   - **And** the connection is properly closed after streaming completes

4. **AC4: Rate Limiting**
   - **Given** rate limiting is implemented
   - **When** a client IP exceeds 10 requests per minute (NFR-S5, ARCH-13)
   - **Then** a 429 response is returned with `{ error: { code: "RATE_LIMITED", message: "Too many requests. Please wait." } }`

5. **AC5: Error Handling**
   - **Given** the OpenAI API is unavailable or returns an error
   - **When** the error is caught
   - **Then** a structured error response is returned: `{ error: { code: "API_ERROR", message: "..." } }`
   - **And** the error is logged server-side (NFR-R7)

6. **AC6: Timeout**
   - **Given** the API endpoint
   - **When** the request takes longer than 30 seconds
   - **Then** the connection times out gracefully with an appropriate error (NFR-I4)

## Tasks / Subtasks

- [x] Task 1: Install openai package (AC: #2)
  - [x] 1.1: npm install openai (production dependency for serverless functions)

- [x] Task 2: Implement api/_lib/openai.ts — OpenAI client (AC: #2)
  - [x] 2.1: Create OpenAI client reading OPENAI_API_KEY from process.env
  - [x] 2.2: Export client instance for reuse

- [x] Task 3: Implement api/_lib/validation.ts — Zod schemas (AC: #1)
  - [x] 3.1: Create generateRequestSchema with Zod v4: userInput (string, min 10, max 1000), platform (enum of 5 platforms)
  - [x] 3.2: Export schema and inferred type

- [x] Task 4: Implement api/_lib/rateLimit.ts — IP-based rate limiter (AC: #4)
  - [x] 4.1: Create in-memory rate limiter (Map-based, 10 req/min per IP)
  - [x] 4.2: Export checkRateLimit function returning boolean

- [x] Task 5: Implement api/generate.ts — SSE streaming endpoint (AC: #1-6)
  - [x] 5.1: Handle only POST method (405 for others)
  - [x] 5.2: Extract client IP from x-forwarded-for header
  - [x] 5.3: Check rate limit before processing
  - [x] 5.4: Parse and validate request body with Zod
  - [x] 5.5: Call OpenAI streaming API with system prompt + user input
  - [x] 5.6: Stream chunks as SSE data events, end with [DONE]
  - [x] 5.7: Handle errors (validation, rate limit, API, timeout)

- [x] Task 6: Verify build and lint pass (AC: all)
  - [x] 6.1: Run npm run build and confirm success
  - [x] 6.2: Run npm run lint and confirm clean
  - [x] 6.3: Run npm run test and confirm no regressions

## Dev Notes

### Previous Story Intelligence

**Story 1.3 established:**
- api/generate.ts and api/feedback.ts use Web Standard API (POST function, Response.json)
- api/_lib/ has placeholder files (openai.ts, rateLimit.ts, validation.ts)
- No @vercel/node dependency — using native Request/Response
- api/ files NOT compiled by project tsc (separate Vercel compilation)

### Key Technical Decisions

**OpenAI SDK:** openai v6.x (latest). Use official SDK with stream: true.

**Model:** Use `gpt-4.1-mini` (cost-effective, GPT-4o retiring Feb 13, 2026). Make model configurable via env var.

**Rate Limiting:** In-memory Map-based (simple, MVP-appropriate). Does not persist across cold starts but acceptable for MVP. No external Redis dependency needed.

**Zod v4 Syntax (CRITICAL):**
```typescript
// v4 correct syntax:
import { z } from 'zod';
z.object({ ... })        // NOT z.strictObject
z.enum([...])             // Same as v3
z.string().min(10)        // String methods still chain in v4
```

**SSE Format:**
```
data: {"content":"chunk text"}\n\n
data: [DONE]\n\n
```

**Error Response Format:**
```typescript
{ error: { code: "ERROR_CODE", message: "Human-readable message" } }
```

### Architecture: Two api/ Directories

- `api/` at project root = Vercel Serverless Functions (THIS story)
- `src/api/` = Frontend API client code (Story 3.2)

### System Prompt Strategy

The system prompt will instruct OpenAI to:
1. Analyze the user's input (detect intent, domain)
2. Generate an optimized prompt for the target platform
3. Structure the response with analysis steps delimited from the final prompt

Story 3.4 will refine the prompt engineering system. This story focuses on the API plumbing.

### Anti-Patterns to Avoid

- DO NOT expose OPENAI_API_KEY to client-side code
- DO NOT use Vercel AI SDK — use raw OpenAI SDK + manual SSE (per architecture spec)
- DO NOT add Upstash/Redis for rate limiting — in-memory is fine for MVP
- DO NOT add tests for serverless functions (they run in Vercel's runtime, not vitest/jsdom)

### References

- [Source: architecture.md#ARCH-6] - Zod validation
- [Source: architecture.md#ARCH-10] - Vercel serverless functions
- [Source: architecture.md#ARCH-13] - Rate limiting
- [Source: prd.md#NFR-S2] - Server-side API keys
- [Source: prd.md#NFR-S5] - Rate limiting 10 req/min
- [Source: epics.md#Story 3.1] - Complete acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- Installed openai v6.21.0 as production dependency
- Created OpenAI client with configurable model via OPENAI_MODEL env var (defaults to gpt-4.1-mini)
- Created Zod v4 generateRequestSchema: userInput (string, min 10, max 1000), platform (enum of 5 platforms)
- Exported GenerateRequest inferred type
- Created in-memory Map-based rate limiter: 10 req/min per IP, auto-resets per window
- Implemented full SSE streaming endpoint with Web Standard API (POST function + Response)
- SSE format: `data: {"content":"..."}` chunks, ends with `data: [DONE]`
- Error handling: VALIDATION_ERROR (400), RATE_LIMITED (429), API_ERROR (500)
- 30-second timeout via AbortController
- System prompt instructs analysis + optimized prompt generation for target platform
- Build: 62.18 KB gzipped JS (unchanged — api/ files not bundled by Vite)
- Lint: clean, Tests: 32/32 passing (no regressions)
- Note: Vercel uses named export POST (Web Standard API), not default export

### File List

- api/_lib/openai.ts (modified — OpenAI client + configurable model)
- api/_lib/validation.ts (modified — Zod v4 generateRequestSchema)
- api/_lib/rateLimit.ts (modified — in-memory IP rate limiter)
- api/generate.ts (modified — full SSE streaming endpoint)
- package.json (modified — added openai dependency)
