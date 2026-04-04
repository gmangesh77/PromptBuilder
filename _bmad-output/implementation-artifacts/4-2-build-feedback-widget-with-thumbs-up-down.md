# Story 4.2: Build Feedback Widget with Thumbs Up/Down

Status: done

## Story

As a **user**,
I want **to rate whether the generated prompt was helpful**,
So that **PromptBuilder can improve its prompt generation over time**.

## Acceptance Criteria

1. **AC1: Feedback Buttons**
   - **Given** a prompt has been generated and displayed
   - **When** the Feedback component renders below the output
   - **Then** thumbs up and thumbs down buttons are displayed (FR33)
   - **And** no account or authentication is required to submit feedback (FR34)
   - **And** the buttons are clearly labeled and accessible (FR43, FR46)

2. **AC2: Selection & Comment**
   - **Given** the feedback buttons
   - **When** the user clicks thumbs up or thumbs down
   - **Then** the selection is visually highlighted
   - **And** an optional text comment field appears: "Tell us more (optional)" (FR35)
   - **And** the Zustand feedbackStore records the selection

3. **AC3: Feedback Submission**
   - **Given** the optional comment field
   - **When** the user types a comment and submits (or skips)
   - **Then** feedback is sent to `/api/feedback` endpoint via POST
   - **And** the request body includes: `{ rating: "up" | "down", comment?: string, platform: string }` (FR36, FR37)
   - **And** no personally identifiable information is included (NFR-S4)

4. **AC4: API Endpoint**
   - **Given** the `/api/feedback.ts` serverless endpoint
   - **When** a POST request is received
   - **Then** the request body is validated with Zod
   - **And** feedback data is logged (persistent storage can be added later)
   - **And** a success response is returned
   - **And** errors return `{ error: { code, message } }` format (ARCH-21)

5. **AC5: Confirmation**
   - **Given** the feedback submission
   - **When** successfully submitted
   - **Then** a subtle "Thank you for your feedback!" confirmation is shown
   - **And** the feedback buttons are disabled to prevent duplicate submissions

## Tasks / Subtasks

- [x] Task 1: Create feedbackStore (AC: #2)
  - [x] 1.1: Create src/stores/feedbackStore.ts with rating, comment, isSubmitted state
  - [x] 1.2: Actions: setRating, setComment, submitFeedback, resetFeedback
  - [x] 1.3: Create src/stores/feedbackStore.test.ts
  - [x] 1.4: Update src/stores/index.ts barrel export

- [x] Task 2: Implement /api/feedback endpoint (AC: #4)
  - [x] 2.1: Update api/feedback.ts with Zod validation
  - [x] 2.2: Validate rating, comment, platform fields
  - [x] 2.3: Log feedback data, return success

- [x] Task 3: Create FeedbackWidget component (AC: #1, #2, #3, #5)
  - [x] 3.1: Create src/features/Feedback/FeedbackWidget.tsx
  - [x] 3.2: Create src/features/Feedback/FeedbackWidget.module.css
  - [x] 3.3: Thumbs up/down buttons with aria-labels
  - [x] 3.4: Optional comment textarea on selection
  - [x] 3.5: Submit button, "Thank you" confirmation
  - [x] 3.6: Disabled state after submission

- [x] Task 4: Integrate into App.tsx (AC: #1)
  - [x] 4.1: Show FeedbackWidget below PromptOutput when prompt exists

- [x] Task 5: Write tests (AC: #1-5)
  - [x] 5.1: Test feedbackStore state management
  - [x] 5.2: Test FeedbackWidget renders buttons
  - [x] 5.3: Test selection highlighting and comment field
  - [x] 5.4: Test submit and confirmation

- [x] Task 6: Verify build, lint, and tests pass (AC: all)
  - [x] 6.1: Run build, lint, test

## Dev Notes

### Previous Story Intelligence

**Story 4.1 established:**
- PromptOutput component with Copy to Clipboard button
- useClipboard hook in src/hooks/
- 72/72 tests passing across 13 test files

### Key Technical Decisions

**feedbackStore:** Zustand store with rating ('up' | 'down' | null), comment string, isSubmitted boolean. resetFeedback clears state for next generation.

**API validation:** Zod schema validates rating as enum, comment as optional string, platform as enum matching existing platforms.

**No PII:** Feedback is anonymous — no user ID, email, or session tracking.

### References

- [Source: epics.md#Story 4.2] - Complete acceptance criteria
- api/feedback.ts - Existing stub endpoint

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — all tasks completed without errors.

### Completion Notes List

- Created feedbackStore with Zustand: rating, comment, isSubmitted, isSubmitting state
- Implemented /api/feedback endpoint with Zod validation for rating, comment, platform
- Created FeedbackWidget with thumbs up/down buttons (emoji), optional comment textarea, submit button
- "Thank you for your feedback!" confirmation shown after submission via role="status"
- Buttons use aria-pressed for selection state, 44px min tap targets
- FeedbackWidget shown below PromptOutput only when prompt exists and not streaming
- Feedback state resets on new generation
- 5 feedbackStore tests + 6 FeedbackWidget tests
- Build: 65.28 KB gzipped JS
- Tests: 83/83 passing across 15 test files

### File List

- src/stores/feedbackStore.ts (created)
- src/stores/feedbackStore.test.ts (created — 5 tests)
- src/stores/index.ts (modified — added feedbackStore exports)
- api/feedback.ts (modified — full Zod validation endpoint)
- src/features/Feedback/FeedbackWidget.tsx (created)
- src/features/Feedback/FeedbackWidget.module.css (created)
- src/features/Feedback/FeedbackWidget.test.tsx (created — 6 tests)
- src/features/Feedback/index.ts (created)
- src/App.tsx (modified — integrated FeedbackWidget with feedback reset)
