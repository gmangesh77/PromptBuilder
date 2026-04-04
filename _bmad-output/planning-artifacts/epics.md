---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: ['product-brief-PromptBuilder-2026-02-01.md', 'prd.md', 'architecture.md', 'ux-design-specification.md']
---

# PromptBuilder - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for PromptBuilder, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**User Input & Intent Analysis:**
- FR1: Users can enter natural language descriptions of their needs in a text input field
- FR2: Users can provide input up to a reasonable character limit to describe their task
- FR3: System can automatically analyze user input to detect intent (what the user wants to accomplish)
- FR4: System can automatically identify the domain of the task (technical, business, creative, sales, healthcare, etc.)
- FR5: System can detect when user intent is ambiguous and requires clarification
- FR6: System can present targeted clarifying questions when user intent is unclear
- FR7: Users can answer clarifying questions through multiple choice or text input
- FR8: Users can skip clarifying questions and proceed with prompt generation anyway
- FR9: System can recognize and handle diverse use cases across technical, business, creative, sales, customer success, HR, consulting, and healthcare domains

**Platform Selection & Targeting:**
- FR10: Users can manually select a target AI platform from a list of supported platforms
- FR11: System can support platform selection for ChatGPT, Claude, Gemini, Grok, and Perplexity
- FR12: System can generate platform-specific prompts optimized for the selected AI platform's strengths
- FR13: System can apply platform-aware optimization techniques based on known platform capabilities

**Prompt Generation & Optimization:**
- FR14: System can generate optimized prompts based on user input, intent, domain, and selected platform
- FR15: System can apply role-based prompting techniques in generated prompts
- FR16: System can structure prompts with chain-of-thought reasoning where appropriate
- FR17: System can specify output formats in generated prompts when relevant
- FR18: System can include context and constraints in generated prompts
- FR19: System can incorporate few-shot examples in generated prompts when appropriate
- FR20: System can generate prompts that are ready to paste directly into AI platforms
- FR21: System can format generated prompts for optimal readability and usability

**Real-Time Feedback & Transparency:**
- FR22: System can display real-time progress indicators during prompt generation
- FR23: System can show progressive status updates as analysis proceeds (analyzing, detecting intent, generating)
- FR24: Users can observe the analysis process through visible status messages
- FR25: System can provide transparency into what the system is doing at each stage

**Content Delivery & User Actions:**
- FR26: Users can copy generated prompts to their clipboard with a single action
- FR27: System can provide visual confirmation when content is successfully copied
- FR28: Users can view the complete generated prompt before copying
- FR29: System can deliver generated prompts within a reasonable timeframe
- FR30: Users can access the interface from desktop browsers
- FR31: Users can access the interface from mobile browsers (phones and tablets)
- FR32: System can provide a responsive interface that adapts to different screen sizes

**User Feedback & Quality Improvement:**
- FR33: Users can provide positive or negative feedback on generated prompts
- FR34: Users can submit feedback without requiring an account or authentication
- FR35: Users can optionally provide detailed written feedback comments
- FR36: System can capture feedback data for prompt generation improvement
- FR37: System can associate feedback with the domain, platform, and prompt type for analysis

**Error Handling & System Reliability:**
- FR38: System can gracefully handle errors when external services are unavailable
- FR39: System can provide clear error messages to users when failures occur
- FR40: System can attempt to retry failed operations automatically where appropriate
- FR41: System can ensure no user input data is lost during the generation process
- FR42: System can handle API rate limits and quota restrictions appropriately

**Accessibility & Usability:**
- FR43: Users can navigate the interface using only keyboard input
- FR44: Users can see visual focus indicators on all interactive elements
- FR45: System can ensure sufficient color contrast for text readability
- FR46: System can provide semantic HTML structure for screen reader compatibility
- FR47: Users can resize text up to 200% without losing functionality
- FR48: System can support modern evergreen browsers (Chrome, Firefox, Safari, Edge)

### NonFunctional Requirements

**Performance:**
- NFR-P1: Page load (Time to Interactive) must be < 2 seconds for 90% of users on modern browsers
- NFR-P2: First Contentful Paint (FCP) must be < 1 second for optimal perceived performance
- NFR-P3: Prompt generation must complete within 5 seconds for 90% of requests
- NFR-P4: Streaming UI updates must render with < 100ms latency to maintain real-time perception
- NFR-P5: Copy-to-clipboard action must provide feedback within 100ms
- NFR-P6: OpenAI API calls must complete within 3 seconds under normal conditions
- NFR-P7: System must handle API response times up to 10 seconds gracefully without UI freezing
- NFR-P8: Mobile interface must remain responsive on 4G network connections (throttled to 4Mbps)
- NFR-P9: Touch interactions must respond within 100ms on mobile devices
- NFR-P10: Animations must maintain 60fps on modern mobile devices (2020+)
- NFR-P11: Initial JavaScript bundle size must be < 200 KB (gzipped)
- NFR-P12: Total page weight must be < 500 KB for MVP
- NFR-P13: Application must not cause memory leaks during extended usage sessions

**Security:**
- NFR-S1: All data transmitted between client and server must be encrypted using HTTPS/TLS 1.2+
- NFR-S2: OpenAI API keys must be stored securely on the backend and never exposed to client-side code
- NFR-S3: User input must be sanitized to prevent XSS (cross-site scripting) attacks
- NFR-S4: Feedback data must be stored securely and not contain personally identifiable information (PII)
- NFR-S5: Backend API proxy must implement rate limiting to prevent abuse (e.g., max 10 requests per IP per minute)
- NFR-S6: API endpoints must validate all input parameters to prevent injection attacks
- NFR-S7: System must protect against CSRF (cross-site request forgery) attacks
- NFR-S8: System must comply with basic GDPR principles (data minimization, purpose limitation) even without user accounts
- NFR-S9: Feedback data collection must include clear user consent mechanisms

**Scalability:**
- NFR-SC1: System architecture must support scaling from 100 internal users (MVP) to 10,000 public users (Month 3) without major architectural changes
- NFR-SC2: System must support growth to 1 million users (Month 12) with horizontal scaling of infrastructure
- NFR-SC3: Performance degradation must be < 10% when scaling to 10x user growth
- NFR-SC4: System must support at least 100 concurrent users during MVP internal testing
- NFR-SC5: System must support at least 1,000 concurrent users during public launch (Month 1-3)
- NFR-SC6: System must support at least 10,000 concurrent users at peak (Month 12)
- NFR-SC7: OpenAI API integration must handle rate limiting gracefully with queuing and retry mechanisms
- NFR-SC8: System must monitor and alert when approaching API quota limits
- NFR-SC9: Backend architecture must support multiple API providers without significant refactoring (Phase 3)
- NFR-SC10: Feedback data storage must scale to millions of records without performance degradation
- NFR-SC11: Database queries must remain performant with 10M+ feedback entries (indexed appropriately)

**Accessibility:**
- NFR-A1: All interactive elements must be accessible via keyboard navigation (Tab, Enter, Esc, Arrow keys)
- NFR-A2: Logical tab order must follow visual layout and user workflow
- NFR-A3: All focusable elements must display visible focus indicators with minimum 3:1 contrast ratio
- NFR-A4: Text must meet minimum contrast ratio of 4.5:1 for normal text, 3:1 for large text (18pt+)
- NFR-A5: Interface must use semantic HTML elements (button, nav, main, article, form labels)
- NFR-A6: Text must be resizable up to 200% without loss of functionality or content
- NFR-A7: No functionality may rely solely on color to convey information
- NFR-A8: All images (if used) must have appropriate alt text
- NFR-A9: Form inputs must have associated labels
- NFR-A10: Heading hierarchy must be logical and follow document structure (h1, h2, h3)

**Integration & Interoperability:**
- NFR-I1: System must integrate with OpenAI API using current stable API version
- NFR-I2: API integration must handle all documented OpenAI error codes gracefully
- NFR-I3: System must implement automatic retry logic for transient API failures (max 3 retries with exponential backoff)
- NFR-I4: API timeout must be set to reasonable value (e.g., 30 seconds) with user feedback during wait
- NFR-I5: System must monitor API status and display service status to users during outages
- NFR-I6: System must function correctly on Chrome, Firefox, Safari, Edge (latest stable versions)
- NFR-I7: System must provide graceful degradation for features not supported in older browsers
- NFR-I8: Clipboard API must work across all supported browsers with fallback for unsupported browsers

**Reliability & Availability:**
- NFR-R1: System must maintain 99% uptime during MVP internal testing period
- NFR-R2: System must maintain 99.5% uptime during public launch (excluding planned maintenance)
- NFR-R3: System must maintain 99.9% uptime at scale (Month 12+) with redundancy and failover
- NFR-R4: System must gracefully handle and recover from all OpenAI API errors without crashing
- NFR-R5: System must provide clear, user-friendly error messages for all failure scenarios
- NFR-R6: System must ensure no user input data is lost during generation failures
- NFR-R7: System must log all errors for debugging and monitoring purposes
- NFR-R8: System must detect OpenAI API outages within 30 seconds and display status to users
- NFR-R9: System must automatically recover when API service is restored
- NFR-R10: Database operations must be transactional to prevent data corruption
- NFR-R11: System must track and alert on key metrics (API errors, response times, user feedback rates)
- NFR-R12: System must provide real-time monitoring dashboards for operations team (post-MVP)
- NFR-R13: System must implement health check endpoints for infrastructure monitoring

**Maintainability & Deployment:**
- NFR-M1: Codebase must maintain clear separation of concerns (presentation, business logic, API integration)
- NFR-M2: Code must follow consistent style guide and linting rules (ESLint for JavaScript/React)
- NFR-M3: Critical business logic must have unit test coverage (minimum 70% for core modules)
- NFR-M4: System must support automated deployment via CI/CD pipeline
- NFR-M5: Deployments must be zero-downtime for production environment (post-MVP)
- NFR-M6: System must support rollback to previous version within 5 minutes if deployment fails
- NFR-M7: Environment configuration must be externalized (not hard-coded) for easy deployment across dev/staging/production
- NFR-M8: API integration code must be well-documented for future provider additions
- NFR-M9: Component library must have usage documentation for designers and developers
- NFR-M10: Deployment and configuration procedures must be documented for operations team

### Additional Requirements

**From Architecture - Starter Template & Technology Stack:**
- ARCH-1: Project MUST be initialized using Vite React TypeScript (Official) starter template: `npm create vite@latest promptbuilder -- --template react-ts`
- ARCH-2: Technology versions: React 19.2.x, Vite 7.3.x, TypeScript 5.9.x (strict mode), Zustand 5.x, Zod 3.x, sonner 1.x
- ARCH-3: State management via Zustand with feature-based stores (promptStore, generationStore, feedbackStore)
- ARCH-4: API communication via native fetch with SSE streaming (ReadableStream) - zero bundle cost
- ARCH-5: Styling via CSS Modules (built-in with Vite, use .module.css files)
- ARCH-6: Data validation via Zod for runtime validation with TypeScript type inference
- ARCH-7: Error handling via hybrid approach: inline validation errors + sonner toasts for API/network errors
- ARCH-8: Hosting on Vercel with serverless API proxy functions for OpenAI key protection and rate limiting
- ARCH-9: Testing via Vitest + @testing-library/react + @testing-library/jest-dom

**From Architecture - Infrastructure & Deployment:**
- ARCH-10: Vercel serverless functions for API proxy (`/api/generate.ts` SSE, `/api/feedback.ts`)
- ARCH-11: Environment config via Vercel Env Vars + .env.local (gitignored)
- ARCH-12: CI/CD via Vercel auto-deploy with preview deploys on PRs
- ARCH-13: Rate limiting: IP-based (10 req/IP/min) implemented in serverless functions
- ARCH-14: localStorage caching for generated prompts to reduce API costs

**From Architecture - Implementation Patterns:**
- ARCH-15: Component naming: PascalCase files and folders (e.g., PromptInput.tsx, features/PromptInput/)
- ARCH-16: Hooks: camelCase with `use` prefix (e.g., useStreamResponse.ts)
- ARCH-17: Co-located tests (Component.test.tsx next to Component.tsx)
- ARCH-18: AppError structure with code/message/details for all errors
- ARCH-19: AsyncState<T> pattern with data/isLoading/error shape
- ARCH-20: Feature-based project structure: src/components/, src/features/, src/hooks/, src/stores/, src/api/, src/types/, src/schemas/, src/utils/, src/constants/
- ARCH-21: API response format: direct data for success, wrapped {error: {code, message}} for errors
- ARCH-22: camelCase internally, transform to snake_case at API boundary only

**From Architecture - Data Flow:**
- ARCH-23: Data flow: User input → promptStore → useStream('/api/generate') → Vercel function → OpenAI API (streaming) → SSE chunks → generationStore → StreamingText component → useClipboard + localStorage → feedbackStore → /api/feedback

**From UX Design - Interaction Requirements:**
- UX-1: Core user flow: Input → Platform Selection → Generate → Streaming Analysis → Prompt Reveal → Copy
- UX-2: Progressive transparency pattern: "Analyzing intent..." → "Detecting domain: [specific]" → "Generating optimized prompt..." (3-4 steps, <5 seconds total)
- UX-3: Visual differentiation between streaming analysis (lighter styling, separate container) and final prompt (prominent display, ready-to-copy emphasis)
- UX-4: ChatGPT pre-selected as default platform in dropdown
- UX-5: Generate button gives users control over when processing begins (prevents accidental triggers)
- UX-6: Streaming analysis always visible in MVP (not collapsible) - transparency IS the differentiator
- UX-7: Touch-optimized interface with 44x44 minimum tap target size
- UX-8: Placeholder text: "Describe what you need in your own words"
- UX-9: Character limit invisible unless approaching maximum
- UX-10: "Copied!" visual confirmation on clipboard copy
- UX-11: Mobile-first responsive design with breakpoints: Mobile 320-480px, Tablet 768-1024px, Desktop 1025px+
- UX-12: Virtual keyboard optimization: prevent zoom-on-focus for input fields
- UX-13: Clarifying questions appear inline only when genuinely needed (0-2 targeted questions, skippable)
- UX-14: No artificial delays or fake streaming - genuine real-time API feedback
- UX-15: Human-readable analysis language (e.g., "Detecting domain: Health Information" not "Running GPT-4 inference...")
- UX-16: Emotional design stages: Welcoming Landing → Confident Click → "Aha" Streaming Moment → Prompt Reveal → Seamless Transition

**From Product Brief - Additional Context:**
- BRIEF-1: MVP is internal validation only - no public users until 90%+ positive feedback achieved
- BRIEF-2: English language only for MVP
- BRIEF-3: No offline capability (API-dependent)
- BRIEF-4: 8 user personas must be served: AI Engineer, PM, Content Manager, Sales Exec, Customer Success, HR/Talent, Business Analyst, Parent/Healthcare Consumer

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 2 | Natural language text input |
| FR2 | Epic 2 | Character limit |
| FR3 | Epic 3 | Intent detection |
| FR4 | Epic 3 | Domain identification |
| FR5 | Epic 3 | Ambiguity detection |
| FR6 | Epic 3 | Clarifying questions |
| FR7 | Epic 3 | Answer clarifying questions |
| FR8 | Epic 3 | Skip clarifying questions |
| FR9 | Epic 3 | Multi-domain recognition |
| FR10 | Epic 2 | Platform selection dropdown |
| FR11 | Epic 2 | 5 platforms supported |
| FR12 | Epic 3 | Platform-specific prompts |
| FR13 | Epic 3 | Platform-aware optimization |
| FR14 | Epic 3 | Optimized prompt generation |
| FR15 | Epic 3 | Role-based prompting |
| FR16 | Epic 3 | Chain-of-thought reasoning |
| FR17 | Epic 3 | Output format specification |
| FR18 | Epic 3 | Context and constraints |
| FR19 | Epic 3 | Few-shot examples |
| FR20 | Epic 3 | Ready-to-paste prompts |
| FR21 | Epic 3 | Prompt formatting |
| FR22 | Epic 3 | Real-time progress indicators |
| FR23 | Epic 3 | Progressive status updates |
| FR24 | Epic 3 | Visible analysis process |
| FR25 | Epic 3 | System transparency |
| FR26 | Epic 4 | Copy to clipboard |
| FR27 | Epic 4 | Copy visual confirmation |
| FR28 | Epic 4 | View complete prompt |
| FR29 | Epic 3 | Reasonable generation timeframe |
| FR30 | Epic 1 | Desktop browser access |
| FR31 | Epic 1 | Mobile browser access |
| FR32 | Epic 1 | Responsive interface |
| FR33 | Epic 4 | Thumbs up/down feedback |
| FR34 | Epic 4 | Feedback without auth |
| FR35 | Epic 4 | Optional written feedback |
| FR36 | Epic 4 | Feedback data capture |
| FR37 | Epic 4 | Feedback metadata association |
| FR38 | Epic 5 | Graceful error handling |
| FR39 | Epic 5 | Clear error messages |
| FR40 | Epic 5 | Automatic retry |
| FR41 | Epic 5 | No input data loss |
| FR42 | Epic 5 | Rate limit handling |
| FR43 | Epic 2 | Keyboard navigation |
| FR44 | Epic 2 | Focus indicators |
| FR45 | Epic 2 | Color contrast |
| FR46 | Epic 2 | Semantic HTML |
| FR47 | Epic 2 | Text resize 200% |
| FR48 | Epic 1 | Modern browser support |

## Epic List

### Epic 1: Project Foundation & Deployable App Shell
Users can access a live, deployed web application on desktop and mobile browsers with the complete technical architecture in place.
**FRs covered:** FR30, FR31, FR32, FR48

### Epic 2: User Input & Platform Selection
Users can describe their need in natural language and choose a target AI platform, with a responsive, accessible, mobile-first interface.
**FRs covered:** FR1, FR2, FR10, FR11, FR43, FR44, FR45, FR46, FR47

### Epic 3: Intelligent Prompt Generation & Streaming UI
Users can generate optimized, platform-specific prompts with real-time streaming analysis showing intent detection, domain classification, and generation progress.
**FRs covered:** FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR29

### Epic 4: Prompt Output, Copy & User Feedback
Users can view the complete generated prompt, copy it to clipboard with one click, and rate the quality with thumbs up/down and optional comments - completing the full user journey.
**FRs covered:** FR26, FR27, FR28, FR33, FR34, FR35, FR36, FR37

### Epic 5: Error Handling, Resilience & Production Hardening
Users experience graceful error handling with no data loss, automatic retries, clear error messaging, and a polished, reliable experience.
**FRs covered:** FR38, FR39, FR40, FR41, FR42

---

## Epic 1: Project Foundation & Deployable App Shell

Users can access a live, deployed web application on desktop and mobile browsers with the complete technical architecture in place.

### Story 1.1: Scaffold Project with Vite React TypeScript

As a **developer**,
I want **a fully configured React TypeScript project with all dependencies, tooling, and directory structure in place**,
So that **the team has a consistent, architecture-compliant foundation to build features on**.

**Acceptance Criteria:**

**Given** no existing project directory
**When** the project is initialized using `npm create vite@latest promptbuilder -- --template react-ts`
**Then** a working React 19.x + TypeScript 5.x project exists with Vite 7.x as the build tool
**And** TypeScript strict mode is enabled in tsconfig.json

**Given** the initialized project
**When** dependencies are installed
**Then** the following packages are present: zustand, zod, sonner
**And** the following dev dependencies are present: vitest, @testing-library/react, @testing-library/jest-dom, jsdom, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, prettier, eslint-config-prettier

**Given** the project with all dependencies
**When** the directory structure is created
**Then** the following directories exist under `src/`: components/, features/, hooks/, stores/, api/, types/, schemas/, utils/, constants/
**And** each directory contains an `index.ts` barrel export file
**And** the `api/` directory (Vercel serverless) exists at project root with `_lib/` subdirectory

**Given** the configured project
**When** `npm run dev` is executed
**Then** the development server starts without errors
**And** `npm run build` produces a production bundle
**And** `npm run test` runs Vitest without errors (even with zero tests)
**And** ESLint and Prettier are configured and `npm run lint` passes

### Story 1.2: Create Responsive App Shell & Global Styles

As a **user**,
I want **to access PromptBuilder on any device and see a clean, responsive layout**,
So that **I have a consistent experience whether I'm on my phone, tablet, or desktop**.

**Acceptance Criteria:**

**Given** the scaffolded project
**When** the App component is loaded
**Then** it renders a semantic HTML structure with `<header>`, `<main>`, and appropriate landmarks
**And** the page title displays "PromptBuilder"

**Given** the App shell
**When** global styles (index.css) are loaded
**Then** CSS custom properties are defined for colors, spacing, typography, and breakpoints
**And** a CSS reset/normalize is applied for cross-browser consistency
**And** the base font size supports 200% text resize without breaking layout (FR47)

**Given** the responsive layout
**When** viewed at mobile widths (320-480px)
**Then** the layout renders as a single column with full-width content
**And** minimum tap targets are 44x44px (UX-7)

**Given** the responsive layout
**When** viewed at tablet widths (768-1024px)
**Then** the layout adjusts with enhanced spacing

**Given** the responsive layout
**When** viewed at desktop widths (1025px+)
**Then** the content is centered with a max-width container for readability

**Given** the App shell
**When** shared component stubs (Button, Input, Spinner) are created
**Then** each component has a .tsx file, a .module.css file, a .test.tsx file, and an index.ts export
**And** the components follow PascalCase naming convention (ARCH-15)

### Story 1.3: Deploy to Vercel with API Endpoint Stubs

As a **user**,
I want **to access PromptBuilder at a live URL from any modern browser**,
So that **I can use the application without any local setup**.

**Acceptance Criteria:**

**Given** the project with App shell
**When** vercel.json is configured
**Then** it defines correct build settings for Vite and routes API requests to serverless functions

**Given** the Vercel configuration
**When** API stub endpoints are created
**Then** `/api/generate.ts` exists and returns a 200 response with `{ status: "ok" }` placeholder
**And** `/api/feedback.ts` exists and returns a 200 response with `{ status: "ok" }` placeholder
**And** `/api/_lib/` directory contains placeholder files for openai.ts, rateLimit.ts, validation.ts

**Given** the project
**When** `.env.example` is created
**Then** it documents all required environment variables: `OPENAI_API_KEY`
**And** `.env.local` is listed in `.gitignore`

**Given** the deployed application
**When** accessed from Chrome, Firefox, Safari, or Edge (latest stable)
**Then** the app shell loads without errors (FR48)
**And** the app is accessible from desktop browsers (FR30)
**And** the app is accessible from mobile browsers (FR31)

**Given** the production build
**When** the bundle size is analyzed
**Then** the initial JavaScript bundle is < 200 KB gzipped (NFR-P11)
**And** total page weight is < 500 KB (NFR-P12)

---

## Epic 2: User Input & Platform Selection

Users can describe their need in natural language and choose a target AI platform, with a responsive, accessible, mobile-first interface.

### Story 2.1: Create PromptInput Component with Text Area

As a **user**,
I want **to type what I need in my own words into a simple text field**,
So that **I can describe my task naturally without learning any special format**.

**Acceptance Criteria:**

**Given** the PromptBuilder app is loaded
**When** the PromptInput component renders
**Then** a text area is displayed with placeholder text "Describe what you need in your own words" (UX-8)
**And** the text area uses semantic HTML with an associated `<label>` (FR46, NFR-A9)
**And** the text area is auto-focused on desktop (not on mobile to avoid keyboard popup)

**Given** the text area
**When** a user types input
**Then** the character count is tracked internally
**And** the character limit indicator remains invisible until the user approaches the maximum (e.g., 80% of 1000 chars) (UX-9, FR2)
**And** input is capped at the maximum character limit

**Given** the text area on mobile (320-480px)
**When** the user taps to type
**Then** the input field does not trigger zoom-on-focus (UX-12, font-size >= 16px)
**And** the virtual keyboard does not obscure the input area
**And** the tap target meets 44x44px minimum (UX-7)

**Given** the PromptInput component
**When** a user navigates via keyboard
**Then** the text area is reachable via Tab key (FR43)
**And** a visible focus indicator is displayed with minimum 3:1 contrast ratio (FR44, NFR-A3)

**Given** the component styling
**When** rendered in any viewport
**Then** text meets 4.5:1 contrast ratio for normal text (FR45, NFR-A4)
**And** text is resizable up to 200% without breaking layout (FR47)
**And** CSS Modules are used for scoped styling (ARCH-5)

### Story 2.2: Create PlatformSelector Component

As a **user**,
I want **to choose which AI platform I want my prompt optimized for**,
So that **I get a prompt tailored to the specific platform I plan to use**.

**Acceptance Criteria:**

**Given** the PromptBuilder interface
**When** the PlatformSelector component renders
**Then** a dropdown/select is displayed with 5 platform options: ChatGPT, Claude, Gemini, Grok, Perplexity (FR11)
**And** ChatGPT is pre-selected as the default (UX-4)
**And** the selector has an associated label for accessibility (FR46, NFR-A9)

**Given** the platform selector
**When** a user selects a different platform
**Then** the selection is updated immediately
**And** the selected platform is visually indicated

**Given** the selector on mobile
**When** the user taps the dropdown
**Then** the native mobile select experience is used (touch-friendly)
**And** the tap target is at least 44x44px (UX-7)

**Given** the selector
**When** navigated via keyboard
**Then** it is reachable via Tab and operable with Arrow keys and Enter (FR43, NFR-A1)
**And** a visible focus indicator is displayed (FR44)

**Given** the selector
**When** color is used to indicate the selected state
**Then** the selection is also conveyed through non-color means (text, icon, or border) (NFR-A7)

### Story 2.3: Create Prompt Store & Wire Input State

As a **user**,
I want **my text input and platform selection to be connected with a Generate button**,
So that **I can submit my request when I'm ready**.

**Acceptance Criteria:**

**Given** the Zustand promptStore is created
**When** the store is initialized
**Then** it contains state for: `userInput` (string), `selectedPlatform` (Platform enum defaulting to "chatgpt")
**And** it exposes actions: `setUserInput()`, `setPlatform()`, `clearInput()`
**And** selector hooks are exported: `useUserInput()`, `useSelectedPlatform()` (ARCH pattern)

**Given** the PromptInput component
**When** the user types text
**Then** the promptStore `userInput` state is updated in real-time via `setUserInput()`

**Given** the PlatformSelector component
**When** the user selects a platform
**Then** the promptStore `selectedPlatform` state is updated via `setPlatform()`

**Given** the input area
**When** a Generate button is rendered below the input and platform selector
**Then** it is enabled only when `userInput` is non-empty (minimum 10 characters)
**And** it is disabled with a visual disabled state when input is empty or too short
**And** the button text reads "Generate" (UX-5)
**And** clicking the button currently has no action (wired in Epic 3)

**Given** the complete input section
**When** the user presses Enter (with Shift+Enter for newlines)
**Then** the Generate action is triggered if input is valid (keyboard shortcut)

**Given** all components on the page
**When** the user navigates via Tab
**Then** the tab order follows: text area → platform selector → Generate button (NFR-A2)

---

## Epic 3: Intelligent Prompt Generation & Streaming UI

Users can generate optimized, platform-specific prompts with real-time streaming analysis showing intent detection, domain classification, and generation progress.

### Story 3.1: Build Generation API with OpenAI SSE Streaming

As a **developer**,
I want **a serverless API endpoint that connects to OpenAI and streams responses via SSE**,
So that **the frontend can receive real-time generation output for the streaming UI**.

**Acceptance Criteria:**

**Given** the `/api/generate.ts` Vercel serverless function
**When** a POST request is received with `{ userInput: string, platform: string }`
**Then** the request body is validated using a Zod schema (ARCH-6)
**And** invalid requests return `{ error: { code: "VALIDATION_ERROR", message: "..." } }` with 400 status

**Given** a valid request
**When** the OpenAI API is called
**Then** the API key is read from server-side environment variables only (NFR-S2)
**And** the request uses the OpenAI streaming API with `stream: true`
**And** the response is returned as SSE (`Content-Type: text/event-stream`)

**Given** the SSE response
**When** OpenAI streams chunks
**Then** each chunk is forwarded as an SSE `data:` event in real-time
**And** the stream ends with a `data: [DONE]` event
**And** the connection is properly closed after streaming completes

**Given** rate limiting is implemented
**When** a client IP exceeds 10 requests per minute (NFR-S5, ARCH-13)
**Then** a 429 response is returned with `{ error: { code: "RATE_LIMITED", message: "Too many requests. Please wait." } }`

**Given** the OpenAI API is unavailable or returns an error
**When** the error is caught
**Then** a structured error response is returned: `{ error: { code: "API_ERROR", message: "..." } }`
**And** the error is logged server-side (NFR-R7)

**Given** the API endpoint
**When** the request takes longer than 30 seconds
**Then** the connection times out gracefully with an appropriate error (NFR-I4)

### Story 3.2: Create Streaming Hook & Generation Store

As a **user**,
I want **to click Generate and see the response appear in real-time**,
So that **I know the system is actively working on my request**.

**Acceptance Criteria:**

**Given** the Zustand generationStore is created
**When** initialized
**Then** it contains state for: `isStreaming` (boolean), `streamedContent` (string), `analysisSteps` (string[]), `generatedPrompt` (string | null), `error` (AppError | null)
**And** it exposes actions: `startGeneration()`, `appendChunk()`, `addAnalysisStep()`, `setGeneratedPrompt()`, `setError()`, `resetGeneration()`
**And** selector hooks are exported per ARCH patterns

**Given** the `useStream` custom hook
**When** called with a URL and request body
**Then** it initiates a fetch request with `Accept: text/event-stream`
**And** it reads the response body as a ReadableStream
**And** each SSE chunk is parsed using a `parseSSE` utility (ARCH-4)
**And** parsed data is dispatched to the generationStore

**Given** the Generate button from Epic 2
**When** the user clicks Generate with valid input
**Then** `generationStore.startGeneration()` is called
**And** `useStream` is invoked with `/api/generate` and `{ userInput, platform }` from promptStore
**And** the Generate button shows a disabled state with spinner (ARCH-27)
**And** the button remains disabled until streaming completes

**Given** a streaming response
**When** chunks arrive
**Then** they are appended to `streamedContent` in real-time
**And** the UI updates with < 100ms latency per chunk (NFR-P4)

**Given** the stream completes
**When** `[DONE]` is received
**Then** `isStreaming` is set to false
**And** the final prompt is extracted and stored in `generatedPrompt`
**And** the Generate button returns to its enabled state

### Story 3.3: Build Streaming Analysis UI Component

As a **user**,
I want **to see PromptBuilder's analysis process in real-time as it works**,
So that **I trust the system understands my request and is generating a quality prompt**.

**Acceptance Criteria:**

**Given** generation has started
**When** analysis steps are received from the stream
**Then** they appear progressively: "Analyzing your request..." → "Detecting domain: [specific domain]" → "Identifying key requirements..." → "Generating optimized prompt..." (UX-2)
**And** each step uses human-readable language, not technical jargon (UX-15)
**And** the analysis section has lighter, distinct styling from the final prompt (UX-3)

**Given** the streaming analysis section
**When** content is streaming
**Then** a pulsing cursor animation is visible at the end of the current text (ARCH-27)
**And** the animation maintains 60fps (NFR-P10)
**And** CSS transforms are used for GPU-accelerated animation (UX-14)

**Given** the streaming analysis
**When** displayed in any viewport
**Then** it is always visible and not collapsible (UX-6)
**And** on mobile, smooth auto-scrolling follows the streaming content

**Given** the final prompt
**When** generation completes
**Then** the prompt is displayed in a prominent, visually distinct container (UX-3)
**And** it is clearly formatted for readability (FR21)
**And** the visual hierarchy makes it obvious what to copy vs. what is analysis

**Given** the complete generation flow
**When** measured end-to-end
**Then** the streaming analysis steps appear within 1-2 seconds of clicking Generate
**And** the complete prompt is delivered within 5 seconds for 90% of requests (NFR-P3, FR29)

### Story 3.4: Implement Intelligent Prompt Engineering System

As a **user**,
I want **PromptBuilder to understand what I need and generate an expertly crafted prompt for my chosen platform**,
So that **I get a prompt that captures my intent better than I could write myself**.

**Acceptance Criteria:**

**Given** a user submits input
**When** the system analyzes the input
**Then** it automatically detects the user's intent (FR3)
**And** it identifies the domain: technical, business, creative, sales, customer success, HR, consulting, or healthcare (FR4, FR9)
**And** the detected domain is displayed in the streaming analysis (e.g., "Detecting domain: System Architecture")

**Given** the detected intent and domain
**When** a prompt is generated for the selected platform
**Then** the prompt is optimized for the specific platform's strengths (FR12, FR13)
**And** platform-specific optimization is applied:
  - ChatGPT: Conversational content, creative tasks, structured output
  - Claude: Long-form analysis, system architecture, nuanced communication
  - Gemini: Multi-modal tasks, research synthesis
  - Grok: Real-time information, conversational style
  - Perplexity: Research with citations, competitive intelligence, health information

**Given** the generation engine
**When** a prompt is created
**Then** it applies role-based prompting where appropriate ("Act as a...") (FR15)
**And** it structures with chain-of-thought reasoning when beneficial (FR16)
**And** it specifies output format when relevant (FR17)
**And** it includes relevant context and constraints (FR18)
**And** it incorporates few-shot examples where appropriate (FR19)

**Given** the generated prompt
**When** displayed to the user
**Then** it is ready to paste directly into the target AI platform (FR20)
**And** it is formatted for optimal readability with clear structure (FR21)
**And** it addresses all 8 user persona domains: AI engineering, product management, content marketing, sales, customer success, HR/talent, consulting, and healthcare (FR9, BRIEF-4)

**Given** the OpenAI system prompt
**When** crafting the generation instructions
**Then** the system prompt structures the response to emit analysis steps first, then the final prompt
**And** analysis steps are delimited from the final prompt in the stream for frontend parsing
**And** no artificial delays are added - streaming is genuine real-time API output (UX-14)

### Story 3.5: Add Clarifying Questions Flow

As a **user**,
I want **PromptBuilder to ask me targeted questions when my request is unclear**,
So that **the generated prompt accurately captures my specific needs**.

**Acceptance Criteria:**

**Given** the user submits ambiguous input
**When** the system detects ambiguity in intent (FR5)
**Then** 0-2 targeted clarifying questions are presented inline (FR6, UX-13)
**And** the questions are specific to the detected domain (not generic)
**And** questions appear within the streaming analysis section

**Given** clarifying questions are displayed
**When** questions use multiple choice format
**Then** each option is displayed as a clickable button/chip
**And** options are touch-friendly (44x44px minimum) on mobile (UX-7)
**And** keyboard accessible via Tab and Enter (FR43)

**Given** clarifying questions are displayed
**When** questions allow text input
**Then** a compact text field is provided inline
**And** the field has proper label association (FR46)

**Given** clarifying questions
**When** the user answers one or more questions (FR7)
**Then** the answers are incorporated into the generation context
**And** prompt generation continues automatically with enhanced context

**Given** clarifying questions
**When** the user clicks "Skip" or presses Esc (FR8)
**Then** generation proceeds without the additional context
**And** the system generates the best prompt possible with available information
**And** the skip action is clearly labeled and accessible

**Given** the clarifying questions flow
**When** questions are displayed
**Then** the user's original input is preserved and visible (FR41)
**And** the overall generation time remains < 5 seconds (excluding user response time) (NFR-P3)

---

## Epic 4: Prompt Output, Copy & User Feedback

Users can view the complete generated prompt, copy it to clipboard with one click, and rate the quality with thumbs up/down and optional comments - completing the full user journey.

### Story 4.1: Build Output Display with Copy-to-Clipboard

As a **user**,
I want **to see my generated prompt clearly displayed and copy it with one click**,
So that **I can immediately paste it into my chosen AI platform**.

**Acceptance Criteria:**

**Given** generation has completed
**When** the Output component renders
**Then** the complete generated prompt is displayed in a prominent container (FR28)
**And** the prompt is visually distinct from the analysis section above (UX-3)
**And** the prompt text is formatted with clear structure and readability (FR21)

**Given** the Output component
**When** a "Copy to Clipboard" button is displayed
**Then** the button is large, obvious, and clearly labeled (UX-10)
**And** the button meets 44x44px minimum tap target on mobile (UX-7)
**And** the button is keyboard accessible via Tab and activatable with Enter (FR43)

**Given** the user clicks the Copy button
**When** the Clipboard API is invoked
**Then** the complete prompt text is copied to the system clipboard (FR26)
**And** visual confirmation "Copied!" is displayed within 100ms (FR27, NFR-P5)
**And** the confirmation text reverts to "Copy to Clipboard" after 2 seconds

**Given** the Clipboard API is not available in a browser
**When** the copy action is attempted
**Then** a fallback method is used (e.g., textarea selection + document.execCommand) (NFR-I8)
**And** the user is still shown confirmation or a helpful message

**Given** the Output component on mobile
**When** the user long-presses or taps
**Then** text selection works correctly for manual copy as a fallback
**And** the layout does not break or shift unexpectedly

**Given** the `useClipboard` custom hook
**When** implemented
**Then** it handles Clipboard API with fallback, returns `{ copy, isCopied }` state
**And** it is reusable across components

### Story 4.2: Build Feedback Widget with Thumbs Up/Down

As a **user**,
I want **to rate whether the generated prompt was helpful**,
So that **PromptBuilder can improve its prompt generation over time**.

**Acceptance Criteria:**

**Given** a prompt has been generated and displayed
**When** the Feedback component renders below the output
**Then** thumbs up and thumbs down buttons are displayed (FR33)
**And** no account or authentication is required to submit feedback (FR34)
**And** the buttons are clearly labeled and accessible (FR43, FR46)

**Given** the feedback buttons
**When** the user clicks thumbs up or thumbs down
**Then** the selection is visually highlighted
**And** an optional text comment field appears: "Tell us more (optional)" (FR35)
**And** the Zustand feedbackStore records the selection

**Given** the optional comment field
**When** the user types a comment and submits (or skips)
**Then** feedback is sent to `/api/feedback` endpoint via POST
**And** the request body includes: `{ rating: "up" | "down", comment?: string, platform: string, domain: string }` (FR36, FR37)
**And** no personally identifiable information is included (NFR-S4)

**Given** the `/api/feedback.ts` serverless endpoint
**When** a POST request is received
**Then** the request body is validated with Zod
**And** feedback data is stored (initially logged; persistent storage can be added later)
**And** a success response is returned
**And** errors return `{ error: { code, message } }` format (ARCH-21)

**Given** the feedback submission
**When** successfully submitted
**Then** a subtle "Thank you for your feedback!" confirmation is shown
**And** the feedback buttons are disabled to prevent duplicate submissions

**Given** the feedback flow
**When** consent is considered
**Then** submitting feedback serves as implicit consent for anonymous data collection (NFR-S9)
**And** no PII is collected or stored (NFR-S8)

### Story 4.3: Add localStorage Caching & Session Continuity

As a **user**,
I want **my last generated prompt to persist if I accidentally close the tab**,
So that **I don't lose my work and can come back to copy it**.

**Acceptance Criteria:**

**Given** a prompt has been generated
**When** the generation completes
**Then** the prompt, platform, and user input are cached in localStorage (ARCH-14)
**And** the cache key is structured (e.g., `promptbuilder_last_generation`)

**Given** the user returns to PromptBuilder
**When** the app loads and cached data exists
**Then** the last generated prompt is restored in the Output component
**And** the original user input is restored in the PromptInput field
**And** the selected platform is restored in the PlatformSelector

**Given** the `useLocalStorage` custom hook
**When** implemented
**Then** it provides `get`, `set`, and `clear` operations with type safety
**And** it handles missing/corrupted data gracefully (returns defaults)
**And** it does not store any PII (NFR-S4)

**Given** the user generates a new prompt
**When** the new generation completes
**Then** the localStorage cache is updated with the latest generation
**And** old cached data is replaced

---

## Epic 5: Error Handling, Resilience & Production Hardening

Users experience graceful error handling with no data loss, automatic retries, clear error messaging, and a polished, reliable experience.

### Story 5.1: Implement Error Display System with ErrorBoundary & Toasts

As a **user**,
I want **to see clear, helpful messages when something goes wrong**,
So that **I understand what happened and know what to do next**.

**Acceptance Criteria:**

**Given** the AppError type system
**When** implemented in `src/types/error.ts`
**Then** it defines `AppError` with `code` (ErrorCode), `message` (user-friendly string), and optional `details` (technical string) (ARCH-18)
**And** `ErrorCode` includes: `NETWORK_ERROR`, `RATE_LIMITED`, `API_ERROR`, `VALIDATION_ERROR`, `STREAM_INTERRUPTED`
**And** the `AsyncState<T>` pattern is implemented with `data`, `isLoading`, `error` fields (ARCH-19)

**Given** an API or network error occurs during generation
**When** the error is caught by the useStream hook
**Then** a sonner toast notification appears with the user-friendly error message (ARCH-7, ARCH-26)
**And** the toast includes a contextual action (e.g., "Try Again" button for retryable errors)
**And** the error is logged to console for debugging (NFR-R7)

**Given** a validation error on user input
**When** the input fails validation
**Then** the error is displayed inline below the input field with a red border (ARCH-26)
**And** the error message is specific (e.g., "Please enter at least 10 characters")
**And** a toast is NOT shown for inline validation errors

**Given** a streaming interruption
**When** the SSE connection drops mid-stream
**Then** a toast shows "Connection interrupted. Your input has been preserved." (FR39)
**And** any partial output is preserved and visible
**And** the Generate button returns to enabled state

**Given** the React ErrorBoundary component
**When** an unexpected rendering error occurs
**Then** a friendly fallback UI is displayed instead of a white screen
**And** the error is logged (NFR-R7)
**And** a "Try Again" button allows the user to recover

**Given** the sonner toast system
**When** initialized in the App root
**Then** toasts appear at a consistent position (top-right on desktop, top-center on mobile)
**And** toasts auto-dismiss after 5 seconds
**And** toasts are keyboard dismissible with Esc (FR43)

### Story 5.2: Add Automatic Retry & Rate Limit Handling

As a **user**,
I want **the system to automatically retry when something fails temporarily**,
So that **transient errors don't interrupt my experience**.

**Acceptance Criteria:**

**Given** the useStream hook encounters a transient API error
**When** the error is retryable (network timeout, 500/502/503 from API)
**Then** automatic retry is attempted with exponential backoff (FR40, NFR-I3)
**And** retry delays follow: 1s → 2s → 4s (max 3 retries)
**And** during retry, the UI shows "Retrying..." status in the streaming area
**And** user input is preserved throughout all retries (FR41)

**Given** all 3 retry attempts fail
**When** the final retry is exhausted
**Then** a toast shows a clear message: "Unable to generate prompt. Please try again." (FR39)
**And** the Generate button is re-enabled for manual retry
**And** the user's input text and platform selection remain intact (FR41)

**Given** the API returns a 429 rate limit response
**When** the rate limit error is received (FR42)
**Then** a toast shows: "Too many requests. Please wait a moment and try again."
**And** the Generate button is temporarily disabled with a countdown or "wait" indicator
**And** no automatic retry is attempted for rate limit errors (explicit user action required)

**Given** the OpenAI API returns a documented error code
**When** the error is caught by the API proxy
**Then** it is mapped to a user-friendly message per error type (NFR-I2):
  - 401: "Service configuration error. Please try again later."
  - 429: "Too many requests. Please wait a moment."
  - 500+: "AI service temporarily unavailable. Retrying..."
  - Timeout: "Request timed out. Please try again."
**And** the original error details are logged server-side only (NFR-R7)

**Given** any error scenario
**When** the user's input is checked
**Then** the text area content is never cleared or lost (FR41)
**And** the platform selection is preserved
**And** any cached localStorage data remains intact

### Story 5.3: Production Hardening - Security, Health Check & Test Coverage

As a **product owner**,
I want **the application to be secure, monitorable, and well-tested**,
So that **we can confidently run the MVP for internal validation**.

**Acceptance Criteria:**

**Given** user input handling
**When** text is rendered in the UI
**Then** all user input is sanitized to prevent XSS attacks (NFR-S3)
**And** React's built-in JSX escaping is leveraged (no `dangerouslySetInnerHTML`)
**And** API endpoint input is validated with Zod on the server side (NFR-S6)

**Given** the API endpoints
**When** CSRF protection is considered
**Then** API endpoints validate the `Origin` or `Referer` header for POST requests (NFR-S7)
**And** requests from unauthorized origins are rejected

**Given** the `/api/health` endpoint is created
**When** a GET request is made
**Then** it returns `{ status: "ok", timestamp: "..." }` with 200 status (NFR-R13)
**And** it can be used by Vercel or external monitoring services for uptime checks

**Given** the core business logic modules
**When** unit tests are written
**Then** test coverage meets minimum 70% for: `parseSSE` utility, Zod validation schemas, Zustand store actions, `useClipboard` hook, `useStream` hook error paths (NFR-M3)
**And** tests are co-located with source files (ARCH-17)
**And** tests run via `npm run test` with Vitest

**Given** the complete application
**When** accessibility is verified
**Then** all heading hierarchy is logical (h1 → h2 → h3) (NFR-A10)
**And** all images (if any) have alt text (NFR-A8)
**And** no functionality relies solely on color (NFR-A7)
**And** the application functions correctly on Chrome, Firefox, Safari, Edge latest stable (NFR-I6)

**Given** the production build
**When** bundle size is re-verified after all features
**Then** initial JavaScript bundle remains < 200 KB gzipped (NFR-P11)
**And** total page weight remains < 500 KB (NFR-P12)
**And** no memory leaks are detected during a 10-minute usage session (NFR-P13)
