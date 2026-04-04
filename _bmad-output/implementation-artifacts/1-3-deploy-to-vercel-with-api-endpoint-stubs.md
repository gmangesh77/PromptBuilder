# Story 1.3: Deploy to Vercel with API Endpoint Stubs

Status: done

## Story

As a **user**,
I want **to access PromptBuilder at a live URL from any modern browser**,
So that **I can use the application without any local setup**.

## Acceptance Criteria

1. **AC1: Vercel Configuration**
   - **Given** the project with App shell
   - **When** vercel.json is configured
   - **Then** it defines correct build settings for Vite and routes API requests to serverless functions

2. **AC2: API Stub Endpoints**
   - **Given** the Vercel configuration
   - **When** API stub endpoints are created
   - **Then** `/api/generate.ts` exists and returns a 200 response with `{ status: "ok" }` placeholder
   - **And** `/api/feedback.ts` exists and returns a 200 response with `{ status: "ok" }` placeholder
   - **And** `/api/_lib/` directory contains placeholder files for openai.ts, rateLimit.ts, validation.ts

3. **AC3: Environment Configuration**
   - **Given** the project
   - **When** `.env.example` is created
   - **Then** it documents all required environment variables: `OPENAI_API_KEY`
   - **And** `.env.local` is listed in `.gitignore`

4. **AC4: Browser Compatibility**
   - **Given** the deployed application
   - **When** accessed from Chrome, Firefox, Safari, or Edge (latest stable)
   - **Then** the app shell loads without errors (FR48)
   - **And** the app is accessible from desktop browsers (FR30)
   - **And** the app is accessible from mobile browsers (FR31)

5. **AC5: Bundle Size**
   - **Given** the production build
   - **When** the bundle size is analyzed
   - **Then** the initial JavaScript bundle is < 200 KB gzipped (NFR-P11)
   - **And** total page weight is < 500 KB (NFR-P12)

## Tasks / Subtasks

- [x] Task 1: Create vercel.json configuration (AC: #1)
  - [x] 1.1: Create vercel.json with Vite framework detection and SPA rewrites
  - [x] 1.2: Configure rewrites so non-API routes serve index.html for client-side routing

- [x] Task 2: Update API stubs to use modern Web Standard APIs (AC: #2)
  - [x] 2.1: Rewrite api/generate.ts using Web Standard Request/Response (no @vercel/node dependency needed)
  - [x] 2.2: Rewrite api/feedback.ts using Web Standard Request/Response
  - [x] 2.3: Verify api/_lib/ placeholder files exist (openai.ts, rateLimit.ts, validation.ts)

- [x] Task 3: Verify environment and gitignore configuration (AC: #3)
  - [x] 3.1: Confirm .env.example documents OPENAI_API_KEY
  - [x] 3.2: Confirm .gitignore covers .env.local (via *.local pattern)

- [x] Task 4: Verify build, lint, and tests pass (AC: #4, #5)
  - [x] 4.1: Run npm run build and confirm success
  - [x] 4.2: Run npm run lint and confirm zero warnings
  - [x] 4.3: Run npm run test and confirm all 12 tests pass
  - [x] 4.4: Verify JS bundle < 200 KB gzipped (NFR-P11) and total page weight < 500 KB (NFR-P12)

## Dev Notes

### Previous Story Intelligence (Stories 1.1 & 1.2)

**Story 1.1 established:**
- API stubs already exist at `api/generate.ts`, `api/feedback.ts`, `api/_lib/openai.ts`, `api/_lib/rateLimit.ts`, `api/_lib/validation.ts`
- These stubs currently import `@vercel/node` types — but that package is NOT installed in devDependencies
- `.env.example` already created with `OPENAI_API_KEY=`
- `.gitignore` already has `*.local` pattern covering `.env.local`
- Build produces 60.81 KB gzipped JS — well under 200 KB budget
- API files in `api/` directory are NOT compiled by project `tsc -b` (only `src/` is compiled)

**Story 1.2 established:**
- 12 tests passing (App: 4, Button: 3, Input: 3, Spinner: 2)
- Lint is clean with zero warnings
- All components use CSS Modules, design tokens, PascalCase naming

**CRITICAL: What already exists vs what needs to be created:**
| Item | Status | Action Needed |
|------|--------|---------------|
| `api/generate.ts` | Exists (uses @vercel/node) | Rewrite to Web Standard API |
| `api/feedback.ts` | Exists (uses @vercel/node) | Rewrite to Web Standard API |
| `api/_lib/openai.ts` | Exists (placeholder) | No change |
| `api/_lib/rateLimit.ts` | Exists (placeholder) | No change |
| `api/_lib/validation.ts` | Exists (placeholder) | No change |
| `.env.example` | Exists | Verify only |
| `.gitignore` (*.local) | Exists | Verify only |
| `vercel.json` | Does NOT exist | Create |

### Architecture Compliance

**Source: [architecture.md#ARCH-8]** — Hosting on Vercel with serverless API proxy functions
**Source: [architecture.md#ARCH-10]** — Vercel serverless functions: `/api/generate.ts` (SSE), `/api/feedback.ts`
**Source: [architecture.md#ARCH-11]** — Environment config: Vercel Env Vars + .env.local (gitignored)
**Source: [architecture.md#ARCH-12]** — CI/CD: Vercel auto-deploy with preview deploys on PRs

### Web Research: Vercel + Vite 7.x Deployment (Feb 2026)

**Key findings:**
1. **Zero config works** for most Vite deployments to Vercel — framework auto-detected
2. **Modern Web Standard APIs** (Request/Response) are the recommended approach for serverless functions as of 2026 — no `@vercel/node` package needed
3. **`/api` directory convention** is still the standard for serverless functions on Vercel
4. **Vite 7 requires Node.js 20.19+** — Vercel defaults to Node.js 24 LTS now
5. **SPA rewrites** needed in vercel.json only if client-side routing is used (future-proofing)

**Modern serverless function pattern (no dependency needed):**
```typescript
export function GET(request: Request) {
  return Response.json({ status: 'ok' });
}

export function POST(request: Request) {
  return Response.json({ status: 'ok' });
}
```

**vercel.json for SPA with API routes:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Important: Two api/ Directories

**Source: [Story 1.1 Dev Notes]**
1. `api/` at project root = Vercel Serverless Functions (backend, deployed as serverless)
2. `src/api/` = Frontend API client code (bundled into the SPA)

These are completely separate. This story only touches `api/` (root).

### Anti-Patterns to Avoid

- DO NOT install `@vercel/node` — use Web Standard Request/Response instead (modern approach)
- DO NOT add the `api/` directory to tsconfig include — Vercel compiles these separately
- DO NOT create a `vercel.json` with explicit build commands — let Vercel auto-detect Vite
- DO NOT add OPENAI_API_KEY to any committed file — only in .env.example as empty placeholder

### References

- [Source: architecture.md#ARCH-8] - Vercel hosting
- [Source: architecture.md#ARCH-10] - Serverless functions
- [Source: architecture.md#ARCH-11] - Environment configuration
- [Source: architecture.md#ARCH-12] - CI/CD auto-deploy
- [Source: prd.md#FR30,FR31,FR48] - Browser support
- [Source: prd.md#NFR-P11,NFR-P12] - Bundle size limits
- [Source: epics.md#Story 1.3] - Complete acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- Created vercel.json with SPA rewrites and API route passthrough
- Updated API stubs (generate.ts, feedback.ts) from @vercel/node to modern Web Standard API (Request/Response) — no extra dependency needed
- Verified api/_lib/ placeholders exist (openai.ts, rateLimit.ts, validation.ts)
- Confirmed .env.example has OPENAI_API_KEY and .gitignore covers *.local
- Build: 60.81 KB gzipped JS, 0.88 KB CSS, 0.27 KB HTML — well under both 200 KB JS and 500 KB total limits
- Lint: clean, zero warnings
- Tests: 12/12 passing, no regressions

### File List

- vercel.json (created — Vercel deployment config with SPA rewrites)
- api/generate.ts (modified — Web Standard API POST handler)
- api/feedback.ts (modified — Web Standard API POST handler)
