# Story 3.5: Add Clarifying Questions Flow

Status: done

## Story

As a **user**,
I want **PromptBuilder to ask me targeted questions when my request is unclear**,
So that **the generated prompt accurately captures my specific needs**.

## Acceptance Criteria

1. **AC1: Ambiguity Detection**
   - **Given** the user submits ambiguous input
   - **When** the system detects ambiguity in intent (FR5)
   - **Then** 0-2 targeted clarifying questions are presented inline (FR6, UX-13)
   - **And** questions are specific to the detected domain

2. **AC2: Multiple Choice Questions**
   - **Given** clarifying questions are displayed
   - **When** questions use multiple choice format
   - **Then** each option is displayed as a clickable button/chip
   - **And** options are touch-friendly (44x44px minimum) on mobile (UX-7)
   - **And** keyboard accessible via Tab and Enter (FR43)

3. **AC3: Skip Option**
   - **Given** clarifying questions
   - **When** the user clicks "Skip" (FR8)
   - **Then** generation proceeds without the additional context
   - **And** the skip action is clearly labeled and accessible

4. **AC4: Answer Integration**
   - **Given** clarifying questions
   - **When** the user answers one or more questions (FR7)
   - **Then** the answers are incorporated into the generation context
   - **And** prompt generation continues automatically with enhanced context

5. **AC5: Preserve Input**
   - **Given** the clarifying questions flow
   - **When** questions are displayed
   - **Then** the user's original input is preserved and visible (FR41)

## Tasks / Subtasks

- [x] Task 1: Update system prompt for clarifying questions (AC: #1)
  - [x] 1.1: Add instructions for ambiguity detection to system prompt
  - [x] 1.2: Define structured format for questions in stream: `---QUESTIONS---` delimiter
  - [x] 1.3: Questions format: JSON array `[{"question":"...","options":["a","b","c"]}]`

- [x] Task 2: Update stream parsing for questions (AC: #1, #4)
  - [x] 2.1: Add `questions` state to generationStore
  - [x] 2.2: Update useStream to detect `---QUESTIONS---` delimiter
  - [x] 2.3: Parse question JSON from stream content
  - [x] 2.4: Add `setQuestions`, `clearQuestions` actions
  - [x] 2.5: Add `submitAnswers` action that triggers re-generation with context

- [x] Task 3: Create ClarifyingQuestions UI component (AC: #2, #3)
  - [x] 3.1: Create src/features/Generation/ClarifyingQuestions.tsx
  - [x] 3.2: Create src/features/Generation/ClarifyingQuestions.module.css
  - [x] 3.3: Render question text + option chips as buttons
  - [x] 3.4: Add Skip button
  - [x] 3.5: Touch targets 44x44px minimum

- [x] Task 4: Integrate into App.tsx (AC: #4, #5)
  - [x] 4.1: Show ClarifyingQuestions when questions are present
  - [x] 4.2: On answer, re-trigger generation with original input + answers
  - [x] 4.3: On skip, proceed with generation using original input only

- [x] Task 5: Write tests (AC: #1-5)
  - [x] 5.1: Test generationStore questions state
  - [x] 5.2: Test ClarifyingQuestions renders questions and options
  - [x] 5.3: Test skip button functionality

- [x] Task 6: Verify build, lint, and tests pass (AC: all)
  - [x] 6.1: Run npm run build and confirm success
  - [x] 6.2: Run npm run lint and confirm clean
  - [x] 6.3: Run npm run test and confirm no regressions

## Dev Notes

### Previous Story Intelligence

**Story 3.4 established:**
- Comprehensive system prompt with `---PROMPT---` delimiter
- Platform-specific optimization guidelines
- useStream parses delimiter to separate analysis from prompt
- StreamingAnalysis shows analysis portion, PromptOutput shows prompt

### Key Technical Decisions

**Question Delivery:** Questions are delivered via the same SSE stream. When the AI detects ambiguity, it outputs `---QUESTIONS---` followed by a JSON array of questions, then `---PROMPT---` is withheld until answers are received.

**Re-generation flow:** When user answers questions, a new API call is made with the original input + answers appended as additional context. The system prompt instructs the AI to skip questions on the second pass.

**MVP simplification:** Since this is the AI deciding when to ask questions, the flow depends on the model's judgment. We provide the UI infrastructure but the AI controls when questions appear. Most straightforward requests will skip directly to prompt generation.

### Anti-Patterns to Avoid

- DO NOT force questions on every request — AI decides based on ambiguity
- DO NOT add text input for answers — multiple choice only for MVP
- DO NOT block indefinitely waiting for answers — include Skip option

### References

- [Source: epics.md#Story 3.5] - Complete acceptance criteria
- [Source: ux-design-specification.md#UX-13] - Clarifying questions 0-2 targeted, skippable

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- Updated system prompt with `---QUESTIONS---` delimiter for clarifying questions flow
- AI decides when to ask 0-2 questions based on ambiguity detection
- Added `SKIP_QUESTIONS` keyword to bypass questions on re-generation
- Added questions state to generationStore: ClarifyingQuestion type, setQuestions, clearQuestions
- Updated useStream hook to detect questions delimiter and parse JSON question array
- Created ClarifyingQuestions component: renders questions with option chips, Continue/Skip buttons
- Chips styled as pill buttons with 44px min tap target, selected state with primary color
- Integrated into App.tsx: handles answer submission (re-generates with enriched context) and skip
- 5 ClarifyingQuestions tests + 2 additional generationStore tests
- Build: 64.31 KB gzipped JS
- Tests: 64/64 passing across 12 test files

### File List

- api/_lib/systemPrompt.ts (modified — added QUESTIONS_DELIMITER and clarifying questions instructions)
- src/stores/generationStore.ts (modified — added questions state, setQuestions, clearQuestions, ClarifyingQuestion type)
- src/stores/generationStore.test.ts (modified — 9 tests, added questions tests)
- src/stores/index.ts (modified — exports useQuestions, ClarifyingQuestion)
- src/hooks/useStream.ts (modified — detects questions delimiter, parses question JSON)
- src/features/Generation/ClarifyingQuestions.tsx (created)
- src/features/Generation/ClarifyingQuestions.module.css (created)
- src/features/Generation/ClarifyingQuestions.test.tsx (created — 5 tests)
- src/features/Generation/index.ts (modified — exports ClarifyingQuestions)
- src/App.tsx (modified — integrated ClarifyingQuestions with answer/skip handlers)
