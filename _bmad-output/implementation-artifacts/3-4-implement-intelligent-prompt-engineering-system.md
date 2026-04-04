# Story 3.4: Implement Intelligent Prompt Engineering System

Status: done

## Story

As a **user**,
I want **PromptBuilder to understand what I need and generate an expertly crafted prompt for my chosen platform**,
So that **I get a prompt that captures my intent better than I could write myself**.

## Acceptance Criteria

1. **AC1: Intent & Domain Detection**
   - **Given** a user submits input
   - **When** the system analyzes the input
   - **Then** it automatically detects the user's intent (FR3)
   - **And** it identifies the domain: technical, business, creative, sales, customer success, HR, consulting, or healthcare (FR4, FR9)

2. **AC2: Platform-Specific Optimization**
   - **Given** the detected intent and domain
   - **When** a prompt is generated for the selected platform
   - **Then** the prompt is optimized for the specific platform's strengths (FR12, FR13)

3. **AC3: Prompt Techniques**
   - **Given** the generation engine
   - **When** a prompt is created
   - **Then** it applies role-based prompting (FR15)
   - **And** chain-of-thought reasoning (FR16)
   - **And** output format specification (FR17)
   - **And** context and constraints (FR18)
   - **And** few-shot examples where appropriate (FR19)

4. **AC4: Ready-to-Paste Output**
   - **Given** the generated prompt
   - **When** displayed to the user
   - **Then** it is ready to paste directly into the target AI platform (FR20)
   - **And** it is formatted for optimal readability (FR21)

5. **AC5: Structured Streaming Output**
   - **Given** the OpenAI system prompt
   - **When** crafting the generation instructions
   - **Then** the response emits analysis steps first, then the final prompt
   - **And** analysis steps are delimited from the final prompt with a clear marker
   - **And** the frontend can parse analysis vs prompt sections

## Tasks / Subtasks

- [x] Task 1: Create comprehensive system prompt (AC: #1-4)
  - [x] 1.1: Create api/_lib/systemPrompt.ts with the full system prompt
  - [x] 1.2: Include intent detection and domain classification instructions
  - [x] 1.3: Include platform-specific optimization guidelines for all 5 platforms
  - [x] 1.4: Include prompt engineering techniques (role, CoT, format, context, few-shot)
  - [x] 1.5: Define output structure with delimiter between analysis and prompt

- [x] Task 2: Update api/generate.ts to use structured prompt (AC: #5)
  - [x] 2.1: Import and use systemPrompt from _lib
  - [x] 2.2: Pass platform to system prompt context

- [x] Task 3: Update frontend to parse structured output (AC: #5)
  - [x] 3.1: Update useStream or generationStore to separate analysis from prompt
  - [x] 3.2: StreamingAnalysis shows analysis section
  - [x] 3.3: PromptOutput shows only the final prompt

- [x] Task 4: Verify build, lint, and tests pass (AC: all)
  - [x] 4.1: Run npm run build and confirm success
  - [x] 4.2: Run npm run lint and confirm clean
  - [x] 4.3: Run npm run test and confirm no regressions

## Dev Notes

### Previous Story Intelligence

**Story 3.1 established:**
- api/generate.ts with basic system prompt
- SSE streaming with `data: {"content":"..."}` format
- OpenAI client configured with gpt-4.1-mini

**Story 3.3 established:**
- StreamingAnalysis component showing streamedContent
- PromptOutput component showing generatedPrompt
- Both read from generationStore

### Key Technical Decisions

**Output Structure Delimiter:** Use `---PROMPT---` as a marker in the streamed text. Content before the marker = analysis, content after = final prompt. Parse this in the generationStore's content accumulation.

**System Prompt Strategy:** Single comprehensive system prompt that instructs the model to:
1. Start with brief analysis (domain, intent, techniques being applied)
2. Output `---PROMPT---` delimiter
3. Output the final ready-to-paste prompt

**Platform optimization guidelines:** Encode specific strengths/patterns for each platform (ChatGPT, Claude, Gemini, Grok, Perplexity).

### Anti-Patterns to Avoid

- DO NOT add artificial streaming delays
- DO NOT use dangerouslySetInnerHTML for rendered output
- DO NOT expose system prompt to the client

### References

- [Source: epics.md#Story 3.4] - Complete acceptance criteria
- [Source: ux-design-specification.md] - Progressive transparency patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Lint error: `finalizeContent` accessed before declaration (react-hooks/immutability). Fixed by moving function inside useCallback body.

### Completion Notes List

- Created comprehensive system prompt in api/_lib/systemPrompt.ts with:
  - Intent detection and domain classification instructions
  - Platform-specific optimization guidelines for all 5 platforms (ChatGPT, Claude, Gemini, Grok, Perplexity)
  - Prompt engineering techniques: role-based, chain-of-thought, output format, context, few-shot
  - `---PROMPT---` delimiter for structured output (analysis before, prompt after)
- Updated api/generate.ts to use buildSystemPrompt(platform) instead of static prompt
- Updated useStream hook to parse delimiter and extract final prompt from accumulated content
- Updated StreamingAnalysis to show only analysis text (before delimiter)
- Build: 63.56 KB gzipped JS
- Tests: 57/57 passing (no regressions)

### File List

- api/_lib/systemPrompt.ts (created — comprehensive system prompt builder)
- api/generate.ts (modified — uses buildSystemPrompt, simplified user message)
- src/hooks/useStream.ts (modified — delimiter parsing, finalizeContent)
- src/features/Generation/StreamingAnalysis.tsx (modified — shows only analysis portion)
