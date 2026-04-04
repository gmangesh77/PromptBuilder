---
stepsCompleted: ['step-01-init.md', 'step-02-context.md', 'step-03-starter.md', 'step-04-decisions.md', 'step-05-patterns.md', 'step-06-structure.md']
inputDocuments: ['product-brief-PromptBuilder-2026-02-01.md', 'prd.md', 'ux-design-specification.md']
workflowType: 'architecture'
project_name: 'PromptBuilder'
user_name: 'Mangesh'
date: '2026-02-02'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

PromptBuilder has 48 functional requirements across 6 categories:

1. **User Input & Intent Analysis (FR1-FR9):** Core intelligence layer - natural language input processing, automatic intent detection, domain classification, and smart clarifying questions when ambiguous. This is the "brain" that makes PromptBuilder intelligent.

2. **Platform Selection & Targeting (FR10-FR13):** Platform abstraction layer - supports 5 AI platforms (ChatGPT, Claude, Gemini, Grok, Perplexity) with platform-specific prompt optimization based on known capabilities.

3. **Prompt Generation & Optimization (FR14-FR21):** Generation engine - applies role-based prompting, chain-of-thought reasoning, output formatting, context/constraints, and few-shot examples. Outputs ready-to-paste prompts.

4. **Real-Time Feedback & Transparency (FR22-FR25):** Streaming UI layer - progressive status updates showing analysis steps, building trust through visible intelligence.

5. **Content Delivery & User Actions (FR26-FR32):** Presentation layer - copy-to-clipboard, responsive design, cross-device support.

6. **User Feedback & Quality (FR33-FR37):** Analytics layer - thumbs up/down collection without authentication, feedback data for improvement.

7. **Error Handling & Reliability (FR38-FR42):** Resilience layer - graceful degradation, retry logic, input preservation, rate limit handling.

**Non-Functional Requirements:**

| Category | Key Requirements | Architectural Impact |
|----------|------------------|---------------------|
| **Performance** | TTI < 2s, FCP < 1s, generation < 5s | Aggressive bundle optimization, streaming architecture |
| **Bundle Size** | < 200 KB gzipped | Code splitting, tree shaking, minimal dependencies |
| **Security** | HTTPS, server-side API keys, XSS prevention | Backend proxy required, input sanitization |
| **Rate Limiting** | 10 req/IP/min | IP-based throttling in API proxy |
| **Scalability** | 100 → 10K → 1M users | Stateless frontend, horizontally scalable backend |
| **Reliability** | 99% → 99.9% uptime | Health checks, automatic retry, graceful degradation |
| **Accessibility** | Keyboard nav, 4.5:1 contrast, semantic HTML | Component library with a11y built-in |

**Scale & Complexity:**

- **Primary domain:** Full-stack Web Application (React SPA + API Proxy)
- **Complexity level:** Medium
- **Estimated architectural components:** 8-10 major modules
- **Real-time requirements:** Yes (streaming UI)
- **Authentication:** None in MVP
- **Data persistence:** Minimal (feedback only)

### Technical Constraints & Dependencies

**Hard Constraints:**
- OpenAI API as sole LLM provider (MVP)
- Modern browsers only (Chrome, Firefox, Safari, Edge - latest stable)
- No offline capability (API-dependent)
- English language only (MVP)

**External Dependencies:**
- OpenAI API (GPT-4 or equivalent)
- Clipboard API (browser)
- Hosting platform (Vercel/Netlify/AWS Amplify)

**Cost Constraints:**
- API usage must be cost-effective (rate limiting, caching consideration)
- Bundle size affects hosting costs and user experience

### Cross-Cutting Concerns Identified

1. **Streaming Architecture:** Affects API integration, frontend rendering, error handling, and mobile performance. Must handle partial responses, connection drops, and progressive UI updates.

2. **Mobile-First Performance:** Bundle size < 200 KB, 60fps animations, touch responsiveness < 100ms. Affects every component and library choice.

3. **Error Resilience:** API failures must not crash UI, input must never be lost, clear user feedback required. Affects API layer, state management, and UI components.

4. **Rate Limiting Without Auth:** IP-based throttling in API proxy, graceful handling of limits in UI. Affects backend architecture and error handling.

5. **Feedback Without Authentication:** Anonymous feedback collection, no PII, GDPR-compliant data minimization. Affects data model and storage strategy.

6. **Platform-Specific Optimization:** Prompt templates and optimization logic vary by target platform. Affects generation engine architecture and maintainability.

## Starter Template Evaluation

### Primary Technology Domain

React SPA (Single Page Application) based on project requirements for a streaming UI web application with mobile-first responsive design and real-time OpenAI API integration.

### Starter Options Considered

| Option | Bundle Impact | Flexibility | Maintenance | Fit |
|--------|--------------|-------------|-------------|-----|
| Vite React-TS (Official) | Minimal (~45 KB) | High | Excellent | ⭐ Best |
| Vite + Tailwind + shadcn | Medium (+15 KB) | Medium | Good | Good |
| Community Feature-Rich | Heavy (+50 KB) | Low | Variable | Over-engineered |

### Selected Starter: Vite React TypeScript (Official)

**Rationale for Selection:**

1. **Minimal bundle footprint** - Meets < 200 KB requirement with room for streaming UI libraries
2. **No opinionated styling** - Allows CSS Modules choice from PRD
3. **Clean state management** - Compatible with React Context API specification
4. **Official maintenance** - Always current with latest Vite and React versions
5. **MVP-aligned** - Start lean, add only what's needed

**Initialization Command:**

```bash
npm create vite@latest promptbuilder -- --template react-ts
cd promptbuilder
npm install
```

**Post-Initialization Setup:**

```bash
# Add testing
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Add CSS Modules support (built-in with Vite, just use .module.css files)

# Add ESLint/Prettier refinements
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript 5.x with strict mode
- React 18.x with functional components
- ESNext target with modern module resolution

**Build Tooling:**
- Vite 5.x with SWC for fast compilation
- Hot Module Replacement (HMR) for development
- Optimized production builds with tree-shaking

**Code Organization:**
- `src/` directory for source code
- `public/` for static assets
- Component-based structure (to be refined)

**Development Experience:**
- Fast dev server with instant updates
- TypeScript type checking
- ESLint for code quality

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- State Management: Zustand
- API Communication: Native fetch with SSE streaming
- Hosting: Vercel with serverless API proxy

**Important Decisions (Shape Architecture):**
- Data Validation: Zod
- Error Handling: Hybrid (inline + sonner toasts)
- Component Architecture: Feature-based with shared components
- Caching: localStorage for generated prompts

**Deferred Decisions (Post-MVP):**
- Routing (add React Router if multiple pages needed)
- CI testing pipeline (add GitHub Actions when test coverage matures)

### Data Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Validation Library** | Zod | Runtime validation with TypeScript type inference; validates OpenAI API responses |
| **Caching Strategy** | localStorage | Persists generated prompts across sessions; reduces API costs on repeat queries |

### API & Communication Patterns

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **HTTP Client** | Native fetch | Zero bundle cost; first-class streaming support via ReadableStream |
| **Streaming Pattern** | SSE via fetch/ReadableStream | Matches OpenAI API format; enables progressive "typing" UI |
| **Error Handling** | Hybrid (inline + toast) | Validation errors inline; API/network errors via sonner toasts |
| **Toast Library** | sonner (~4 KB) | Modern, animated, lightweight |

### Frontend Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **State Management** | Zustand (~3 KB) | Minimal bundle; excellent TypeScript support; no boilerplate |
| **Component Structure** | Feature-based | `features/` for domains, `components/` for shared UI |
| **Routing** | None (MVP) | Single-page experience; add React Router if pages needed later |

**Project Structure:**

```
src/
├── components/       # Shared UI (Button, Input, Toast)
├── features/
│   ├── prompt-input/    # Input area, platform selector
│   ├── generation/      # Streaming output, status
│   └── feedback/        # Thumbs up/down
├── hooks/            # Shared hooks (useStream, useCache)
├── stores/           # Zustand stores
├── api/              # API client, types
└── utils/            # Helpers, constants
```

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Hosting Platform** | Vercel | Best React/Vite DX; native serverless for API proxy; edge caching |
| **API Proxy** | Vercel Serverless Functions | Protects OpenAI API key; handles rate limiting |
| **Environment Config** | Vercel Env Vars + .env.local | Secure secrets management; standard practice |
| **CI/CD** | Vercel auto-deploy | Zero config; preview deploys on PR; simplicity for MVP |

### Technology Versions (Verified Feb 2026)

| Technology | Version | Notes |
|------------|---------|-------|
| React | 19.2.x | Latest stable |
| Vite | 7.3.x | Latest stable |
| TypeScript | 5.9.x | Latest stable (strict mode) |
| Zustand | 5.x | Latest stable |
| Zod | 3.x | Latest stable |
| sonner | 1.x | Latest stable |

### Decision Impact Analysis

**Implementation Sequence:**
1. Project scaffolding (Vite + React + TypeScript)
2. Zustand stores setup
3. API proxy with streaming (Vercel serverless)
4. Core UI components with sonner
5. Feature modules (input → generation → feedback)
6. localStorage caching layer
7. Zod validation schemas

**Cross-Component Dependencies:**
- Zustand stores → used by all features
- API client → depends on Zod schemas for response validation
- Streaming hook → consumed by generation feature
- sonner → initialized at app root, used throughout

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Addressed:** 7 areas where AI agents could make different choices, now standardized.

### Naming Patterns

**Component & File Naming:**

| Element | Convention | Example |
|---------|------------|---------|
| React components | PascalCase | `PromptInput.tsx` |
| Component folders | PascalCase | `features/PromptInput/` |
| Hooks | camelCase + `use` prefix | `useStreamResponse.ts` |
| Utilities | camelCase | `formatPrompt.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_ENDPOINTS.ts` |
| Types/Interfaces | PascalCase + suffix | `PromptInputProps`, `GenerationState` |

**Variable & Function Naming:**

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `userInput`, `isLoading` |
| Functions | camelCase, verb-first | `handleSubmit`, `fetchPrompt` |
| Boolean vars | `is`/`has`/`should` prefix | `isStreaming`, `hasError` |
| Event handlers | `handle` + event | `handleInputChange` |

### Structure Patterns

**Test Location:** Co-located with source files

```
features/
└── PromptInput/
    ├── PromptInput.tsx
    ├── PromptInput.test.tsx
    ├── PromptInput.module.css
    └── index.ts
```

**Store Organization:** Feature-based Zustand slices

```
stores/
├── promptStore.ts
├── generationStore.ts
└── feedbackStore.ts
```

### Format Patterns

**API Response Format:** Hybrid (direct success, wrapped errors)

```typescript
// Success - direct data
{ prompt: "...", platform: "claude" }

// Error - wrapped
{ error: { code: "RATE_LIMITED", message: "Too many requests" } }
```

**JSON Field Naming:** camelCase internally, transform at API boundary

```typescript
// Internal (camelCase)
interface GenerationRequest {
  userInput: string;
  targetPlatform: Platform;
  maxTokens?: number;
}

// Proxy transforms to OpenAI (snake_case) at boundary
```

### State Management Patterns

**Zustand Store Pattern:**

```typescript
// Action naming: set + noun, verb + noun
setUserInput(), setPlatform(), clearInput(), resetGeneration()

// Selector exports
export const useUserInput = () => usePromptStore((s) => s.userInput);
export const useIsGenerating = () => useGenerationStore((s) => s.isStreaming);
```

**Async State Shape:**

```typescript
interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: AppError | null;
}
```

### Error Handling Patterns

**Error Structure:**

```typescript
interface AppError {
  code: ErrorCode;
  message: string;        // User-friendly
  details?: string;       // Technical (dev only)
}

type ErrorCode =
  | 'NETWORK_ERROR'
  | 'RATE_LIMITED'
  | 'API_ERROR'
  | 'VALIDATION_ERROR'
  | 'STREAM_INTERRUPTED';
```

**Error Routing:**

| Error Type | Handler | UI Response |
|------------|---------|-------------|
| Validation | Inline | Red border + message below field |
| Network/API | Hook catch | sonner toast + retry option |
| Stream interrupt | Stream hook | Toast + preserve partial output |
| Rate limit | API proxy | Toast with wait time |

### Loading State Patterns

| Scenario | UI Pattern |
|----------|------------|
| Button action | Disable + spinner inside button |
| Streaming | Progressive text + pulsing cursor |
| Background save | Silent or subtle indicator |
| Timeout (>10s) | Show timeout message |

### Enforcement Guidelines

**All AI Agents MUST:**

1. Follow naming conventions exactly — no variations
2. Co-locate tests with source files
3. Use the `AppError` structure for all errors
4. Never swallow errors — always log or display
5. Never clear user input on error
6. Use `isLoading`/`isStreaming` boolean naming
7. Transform API casing at proxy boundary only

**Anti-Patterns to Avoid:**

| ❌ Don't | ✅ Do |
|----------|-------|
| `user-input.tsx` | `UserInput.tsx` |
| `tests/__tests__/` folder | `Component.test.tsx` co-located |
| `{ success: true, data }` for success | Direct data response |
| `loading`, `fetching` mixed naming | Consistent `isLoading` |
| `snake_case` in frontend code | `camelCase` everywhere |
| Silent error catching | Toast + log every error |

## Project Structure & Boundaries

### Complete Project Directory Structure

```
promptbuilder/
├── .env.example
├── .env.local                      # gitignored
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── vercel.json
├── README.md
│
├── api/                            # Vercel Serverless Functions
│   ├── generate.ts                 # POST /api/generate (SSE)
│   ├── feedback.ts                 # POST /api/feedback
│   └── _lib/
│       ├── openai.ts
│       ├── rateLimit.ts
│       └── validation.ts
│
├── public/
│   ├── favicon.ico
│   └── og-image.png
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.module.css
    ├── index.css
    ├── vite-env.d.ts
    ├── components/                 # Shared UI
    │   ├── Button/
    │   ├── Input/
    │   ├── Spinner/
    │   ├── ErrorBoundary/
    │   └── index.ts
    ├── features/                   # Feature modules
    │   ├── PromptInput/
    │   ├── Generation/
    │   ├── Output/
    │   ├── Feedback/
    │   └── index.ts
    ├── hooks/
    │   ├── useStream.ts
    │   ├── useClipboard.ts
    │   ├── useLocalStorage.ts
    │   └── index.ts
    ├── stores/
    │   ├── promptStore.ts
    │   ├── generationStore.ts
    │   ├── feedbackStore.ts
    │   └── index.ts
    ├── api/                        # Frontend API client
    │   ├── client.ts
    │   ├── generate.ts
    │   ├── feedback.ts
    │   └── index.ts
    ├── types/
    │   ├── prompt.ts
    │   ├── platform.ts
    │   ├── feedback.ts
    │   ├── error.ts
    │   └── index.ts
    ├── schemas/
    │   ├── promptSchema.ts
    │   ├── feedbackSchema.ts
    │   └── index.ts
    ├── utils/
    │   ├── formatPrompt.ts
    │   ├── parseSSE.ts
    │   └── index.ts
    └── constants/
        ├── platforms.ts
        ├── endpoints.ts
        └── index.ts
```

### Architectural Boundaries

**API Layer:**
- `/api/generate.ts` - SSE streaming endpoint, validates input, rate limits by IP, streams OpenAI response
- `/api/feedback.ts` - Accepts thumbs up/down, stores anonymously
- `/api/_lib/` - Shared server utilities (OpenAI client, rate limiting, Zod schemas)

**State Layer (Zustand):**
- `promptStore` - User input text, selected platform
- `generationStore` - Streaming state, partial/complete output, errors
- `feedbackStore` - Submission state

**Component Layer:**
- `components/` - Stateless, reusable UI primitives
- `features/` - Stateful, domain-specific modules connected to stores

### Data Flow

```
[User types] → promptStore.setUserInput()
     ↓
[User clicks generate] → useStream('/api/generate')
     ↓
[Vercel function] → OpenAI API (streaming)
     ↓
[SSE chunks] → generationStore.appendChunk()
     ↓
[Output renders] → StreamingText component
     ↓
[User copies] → useClipboard() + localStorage cache
     ↓
[User rates] → feedbackStore.submit() → /api/feedback
```

### Requirements Mapping

| FR Category | Primary Location |
|-------------|------------------|
| User Input & Intent (FR1-9) | `features/PromptInput/`, `api/generate.ts` |
| Platform Selection (FR10-13) | `features/PromptInput/PlatformSelector.tsx`, `constants/platforms.ts` |
| Prompt Generation (FR14-21) | `api/generate.ts`, `api/_lib/openai.ts` |
| Real-Time Feedback (FR22-25) | `features/Generation/`, `hooks/useStream.ts` |
| Content Delivery (FR26-32) | `features/Output/`, `hooks/useClipboard.ts` |
| User Feedback (FR33-37) | `features/Feedback/`, `api/feedback.ts` |
| Error Handling (FR38-42) | `components/ErrorBoundary/`, `types/error.ts`, `hooks/useStream.ts` |

