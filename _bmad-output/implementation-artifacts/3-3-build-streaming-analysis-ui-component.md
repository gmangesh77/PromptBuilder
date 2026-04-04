# Story 3.3: Build Streaming Analysis UI Component

Status: done

## Story

As a **user**,
I want **to see PromptBuilder's analysis process in real-time as it works**,
So that **I trust the system understands my request and is generating a quality prompt**.

## Acceptance Criteria

1. **AC1: Progressive Analysis Display**
   - **Given** generation has started
   - **When** analysis steps are received from the stream
   - **Then** they appear progressively: "Analyzing your request..." -> "Detecting domain: [specific domain]" -> "Generating optimized prompt..."
   - **And** each step uses human-readable language (UX-15)
   - **And** the analysis section has lighter, distinct styling from the final prompt (UX-3)

2. **AC2: Streaming Text with Cursor**
   - **Given** the streaming analysis section
   - **When** content is streaming
   - **Then** a pulsing cursor animation is visible at the end of the current text
   - **And** the animation maintains 60fps (NFR-P10)
   - **And** CSS transforms are used for GPU-accelerated animation

3. **AC3: Always Visible**
   - **Given** the streaming analysis
   - **When** displayed in any viewport
   - **Then** it is always visible and not collapsible (UX-6)

4. **AC4: Final Prompt Display**
   - **Given** the final prompt
   - **When** generation completes
   - **Then** the prompt is displayed in a prominent, visually distinct container (UX-3)
   - **And** it is clearly formatted for readability (FR21)
   - **And** the visual hierarchy makes it obvious what is the final prompt vs analysis

5. **AC5: Timing**
   - **Given** the complete generation flow
   - **When** measured end-to-end
   - **Then** the streaming analysis steps appear within 1-2 seconds of clicking Generate

## Tasks / Subtasks

- [x] Task 1: Create StreamingAnalysis feature component (AC: #1, #2, #3)
  - [x] 1.1: Create src/features/Generation/StreamingAnalysis.tsx
  - [x] 1.2: Create src/features/Generation/StreamingAnalysis.module.css with pulsing cursor
  - [x] 1.3: Read from generationStore: isStreaming, streamedContent
  - [x] 1.4: Show pulsing cursor at end of streaming text

- [x] Task 2: Create PromptOutput feature component (AC: #4)
  - [x] 2.1: Create src/features/Generation/PromptOutput.tsx
  - [x] 2.2: Create src/features/Generation/PromptOutput.module.css with prominent styling
  - [x] 2.3: Read from generationStore: generatedPrompt
  - [x] 2.4: Display final prompt when generation completes

- [x] Task 3: Create Generation barrel export (AC: all)
  - [x] 3.1: Create src/features/Generation/index.ts
  - [x] 3.2: Update src/features/index.ts barrel export

- [x] Task 4: Integrate into App.tsx (AC: #1-5)
  - [x] 4.1: Import and render StreamingAnalysis and PromptOutput
  - [x] 4.2: Show StreamingAnalysis during streaming
  - [x] 4.3: Show PromptOutput when generation completes

- [x] Task 5: Write tests (AC: #1, #2, #3, #4)
  - [x] 5.1: Test StreamingAnalysis renders streaming content
  - [x] 5.2: Test PromptOutput renders generated prompt
  - [x] 5.3: Test components show/hide based on generation state

- [x] Task 6: Verify build, lint, and tests pass (AC: all)
  - [x] 6.1: Run npm run build and confirm success
  - [x] 6.2: Run npm run lint and confirm clean
  - [x] 6.3: Run npm run test and confirm no regressions

## Dev Notes

### Previous Story Intelligence

**Story 3.2 established:**
- generationStore with isStreaming, streamedContent, generatedPrompt, error
- useStream hook wired to Generate button
- Spinner shown in button during streaming
- 48 tests passing

**Story 3.1 established:**
- SSE streaming from api/generate.ts
- Chunks contain `{"content":"..."}` with analysis + prompt text
- Stream ends with `[DONE]`

### Key Technical Decisions

**Feature location:** `src/features/Generation/` — new feature directory for streaming analysis and prompt output components.

**Pulsing cursor:** CSS animation using `@keyframes` with `opacity` for GPU-accelerated 60fps animation. No JavaScript animation.

**Content parsing:** For MVP, the streamed content is displayed as-is. Story 3.4 will refine the system prompt to structure analysis vs prompt sections with delimiters for parsing.

**Visual hierarchy (UX-3):**
- StreamingAnalysis: Lighter background, smaller text, muted colors
- PromptOutput: Prominent container, full contrast, border emphasis

### Anti-Patterns to Avoid

- DO NOT add collapsible sections for analysis (UX-6 says always visible)
- DO NOT add artificial delays to streaming display
- DO NOT use dangerouslySetInnerHTML for content rendering

### References

- [Source: architecture.md#ARCH-27] - Pulsing cursor animation
- [Source: ux-design-specification.md] - Progressive transparency, streaming UI
- [Source: epics.md#Story 3.3] - Complete acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- Created StreamingAnalysis component: shows streamed content with pulsing CSS cursor
- Cursor uses @keyframes opacity animation for GPU-accelerated 60fps
- StreamingAnalysis uses aria-live="polite" for screen reader updates
- Created PromptOutput component: prominent container with primary border for final prompt
- Visual hierarchy: analysis = lighter bg + muted text, output = prominent border + full contrast
- Both components conditionally render based on generationStore state
- Integrated both into App.tsx below Generate button
- 5 StreamingAnalysis tests + 4 PromptOutput tests
- Build: 63.46 KB gzipped JS (well under 200 KB limit)
- Tests: 57/57 passing across 11 test files

### File List

- src/features/Generation/StreamingAnalysis.tsx (created)
- src/features/Generation/StreamingAnalysis.module.css (created)
- src/features/Generation/StreamingAnalysis.test.tsx (created — 5 tests)
- src/features/Generation/PromptOutput.tsx (created)
- src/features/Generation/PromptOutput.module.css (created)
- src/features/Generation/PromptOutput.test.tsx (created — 4 tests)
- src/features/Generation/index.ts (created)
- src/features/index.ts (modified — exports Generation components)
- src/App.tsx (modified — integrated StreamingAnalysis and PromptOutput)
