# Story 1.1: Scaffold Project with Vite React TypeScript

Status: review

## Story

As a **developer**,
I want **a fully configured React TypeScript project with all dependencies, tooling, and directory structure in place**,
So that **the team has a consistent, architecture-compliant foundation to build features on**.

## Acceptance Criteria

1. **AC1: Project Initialization**
   - **Given** no existing project directory
   - **When** the project is initialized using `npm create vite@latest promptbuilder -- --template react-ts`
   - **Then** a working React 19.x + TypeScript 5.x project exists with Vite 7.x as the build tool
   - **And** TypeScript strict mode is enabled in tsconfig.json

2. **AC2: Dependencies Installed**
   - **Given** the initialized project
   - **When** dependencies are installed
   - **Then** the following packages are present: zustand, zod, sonner
   - **And** the following dev dependencies are present: vitest, @testing-library/react, @testing-library/jest-dom, jsdom, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, prettier, eslint-config-prettier

3. **AC3: Directory Structure Created**
   - **Given** the project with all dependencies
   - **When** the directory structure is created
   - **Then** the following directories exist under `src/`: components/, features/, hooks/, stores/, api/, types/, schemas/, utils/, constants/
   - **And** each directory contains an `index.ts` barrel export file
   - **And** the `api/` directory (Vercel serverless) exists at project root with `_lib/` subdirectory

4. **AC4: Build & Tooling Verification**
   - **Given** the configured project
   - **When** `npm run dev` is executed
   - **Then** the development server starts without errors
   - **And** `npm run build` produces a production bundle
   - **And** `npm run test` runs Vitest without errors (even with zero tests)
   - **And** ESLint and Prettier are configured and `npm run lint` passes

## Tasks / Subtasks

- [x] Task 1: Initialize Vite project (AC: #1)
  - [x] 1.1: Run `npm create vite@latest promptbuilder -- --template react-ts` in the project root
  - [x] 1.2: Verify React 19.x, TypeScript 5.9.x, Vite 7.3.x installed
  - [x] 1.3: Enable `strict: true` in tsconfig.json (verify it's set by template)
  - [x] 1.4: Verify `npm run dev` starts the dev server

- [x] Task 2: Install all dependencies (AC: #2)
  - [x] 2.1: Install production deps: `npm install zustand zod sonner`
  - [x] 2.2: Install dev deps: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
  - [x] 2.3: Install linting deps: `npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier`
  - [x] 2.4: Verify all packages resolve without peer dependency conflicts

- [x] Task 3: Configure ESLint with flat config (AC: #4)
  - [x] 3.1: Create `eslint.config.js` (NOT `.eslintrc` - ESLint 10 removed legacy config)
  - [x] 3.2: Configure TypeScript-ESLint plugin with recommended rules
  - [x] 3.3: Integrate prettier via eslint-config-prettier to disable conflicting rules
  - [x] 3.4: Add `lint` script to package.json: `"lint": "eslint src/"`
  - [x] 3.5: Verify `npm run lint` passes on scaffolded code

- [x] Task 4: Configure Prettier (AC: #4)
  - [x] 4.1: Create `.prettierrc` with project settings (singleQuote, semi, trailingComma, printWidth)
  - [x] 4.2: Create `.prettierignore` (dist, node_modules, coverage)
  - [x] 4.3: Add `format` script to package.json: `"format": "prettier --write src/"`

- [x] Task 5: Configure Vitest (AC: #4)
  - [x] 5.1: Create `vitest.config.ts` with jsdom environment and setup file
  - [x] 5.2: Create `src/test/setup.ts` with `@testing-library/jest-dom` import
  - [x] 5.3: Add `test` script to package.json: `"test": "vitest run"`, `"test:watch": "vitest"`
  - [x] 5.4: Verify `npm run test` executes without errors (zero tests is OK)

- [x] Task 6: Create project directory structure (AC: #3)
  - [x] 6.1: Create all `src/` subdirectories: components/, features/, hooks/, stores/, api/, types/, schemas/, utils/, constants/
  - [x] 6.2: Create barrel `index.ts` in each directory (empty exports initially)
  - [x] 6.3: Create Vercel serverless directory: `api/` at project root
  - [x] 6.4: Create `api/_lib/` subdirectory at project root
  - [x] 6.5: Create placeholder files: `api/generate.ts`, `api/feedback.ts`, `api/_lib/openai.ts`, `api/_lib/rateLimit.ts`, `api/_lib/validation.ts`

- [x] Task 7: Clean up Vite boilerplate (AC: #1, #4)
  - [x] 7.1: Remove default Vite demo content from App.tsx (replace with minimal "PromptBuilder" heading)
  - [x] 7.2: Remove default CSS content (App.css, index.css) - leave files empty or minimal
  - [x] 7.3: Remove Vite/React logo assets from `src/` and `public/`
  - [x] 7.4: Update `index.html` title to "PromptBuilder"
  - [x] 7.5: Verify `npm run build` succeeds and `npm run lint` passes after cleanup

## Dev Notes

### Critical Architecture Compliance

**Source: [architecture.md#Selected Starter]**
- MUST use `npm create vite@latest promptbuilder -- --template react-ts` exactly
- MUST NOT add any additional libraries beyond what's specified (no Tailwind, no shadcn, no React Router)
- MUST NOT create a `.eslintrc.cjs` file — ESLint 10 uses flat config only (`eslint.config.js`)

**Source: [architecture.md#Technology Versions]**
Architecture doc specifies these versions (verified Feb 2026):
| Package | Arch Spec | Actual Latest | Action |
|---------|-----------|---------------|--------|
| React | 19.2.x | 19.2.4 | Use latest (matches) |
| Vite | 7.3.x | 7.3.1 | Use latest (matches) |
| TypeScript | 5.9.x | 5.9.x | Use latest (matches) |
| Zustand | 5.x | 5.0.11 | Use latest (matches) |
| Zod | 3.x | **4.3.6** | **USE v4** - architecture says v3 but v4 is stable, 14x faster, 57% smaller |
| sonner | 1.x | **2.0.7** | **USE v2** - architecture says v1 but v2 is latest stable |

### Version Discrepancy Notes

**Zod v4 (was v3 in architecture):**
- Zod 4 is the current stable release with 14x faster parsing and 57% smaller core
- New `@zod/mini` package available (~1.9 KB gzipped) for frontend use - consider for bundle size
- API is largely backward compatible but import paths may differ
- Install: `npm install zod` (v4 is default now)

**sonner v2 (was v1 in architecture):**
- sonner 2.x is the current stable release
- API should be backward compatible
- Install: `npm install sonner`

**ESLint v10 (breaking change):**
- `.eslintrc.*` config files are NO LONGER SUPPORTED
- Must use `eslint.config.js` (flat config) exclusively
- `defineConfig()` helper is now available for type-safe config
- Architecture doc references `.eslintrc.cjs` — IGNORE that, use flat config

**Vitest v4:**
- Major version jump from what might have been expected
- Browser Mode now stable, Visual Regression testing added
- Config format unchanged, compatible with Vite 7

### Project Structure Notes

**Source: [architecture.md#Complete Project Directory Structure]**

The EXACT directory structure to create:
```
promptbuilder/
├── .env.example
├── .gitignore
├── eslint.config.js          # NOT .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── vercel.json               # Created in Story 1.3, not this story
├── api/                      # Vercel Serverless Functions (project root)
│   ├── generate.ts
│   ├── feedback.ts
│   └── _lib/
│       ├── openai.ts
│       ├── rateLimit.ts
│       └── validation.ts
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.module.css         # CSS Modules per ARCH-5
    ├── index.css
    ├── vite-env.d.ts
    ├── test/
    │   └── setup.ts           # @testing-library/jest-dom setup
    ├── components/
    │   └── index.ts
    ├── features/
    │   └── index.ts
    ├── hooks/
    │   └── index.ts
    ├── stores/
    │   └── index.ts
    ├── api/                   # Frontend API client (NOT the serverless api/)
    │   └── index.ts
    ├── types/
    │   └── index.ts
    ├── schemas/
    │   └── index.ts
    ├── utils/
    │   └── index.ts
    └── constants/
        └── index.ts
```

**IMPORTANT DISTINCTION:** There are TWO `api/` directories:
1. `api/` at project root = Vercel Serverless Functions (backend)
2. `src/api/` = Frontend API client code

### Naming Conventions to Establish

**Source: [architecture.md#Naming Patterns]**
| Element | Convention | Example |
|---------|------------|---------|
| React components | PascalCase | `PromptInput.tsx` |
| Component folders | PascalCase | `features/PromptInput/` |
| Hooks | camelCase + `use` prefix | `useStreamResponse.ts` |
| Utilities | camelCase | `formatPrompt.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_ENDPOINTS.ts` |
| Types/Interfaces | PascalCase + suffix | `PromptInputProps`, `GenerationState` |
| CSS Modules | PascalCase filename | `App.module.css` |
| Tests | Co-located | `Component.test.tsx` next to `Component.tsx` |

### Anti-Patterns to Avoid

**Source: [architecture.md#Anti-Patterns to Avoid]**
- DO NOT create a `tests/` or `__tests__/` directory - tests are co-located
- DO NOT use `kebab-case` for component files (use `PascalCase`)
- DO NOT install React Router, Tailwind, or any CSS framework
- DO NOT add any state management beyond Zustand
- DO NOT create `.eslintrc.cjs` or `.eslintrc.json` (use flat config)
- DO NOT use CommonJS `require()` - use ES modules only

### Environment Requirements

- **Node.js 20.19+ or 22.12+** required (Vite 7 dropped Node 18 support)
- Verify Node version before running scaffold command

### References

- [Source: architecture.md#Selected Starter] - Initialization command and rationale
- [Source: architecture.md#Post-Initialization Setup] - Dependency installation commands
- [Source: architecture.md#Complete Project Directory Structure] - Full directory tree
- [Source: architecture.md#Naming Patterns] - All naming conventions
- [Source: architecture.md#Anti-Patterns to Avoid] - What NOT to do
- [Source: architecture.md#Technology Versions] - Version specifications
- [Source: epics.md#Story 1.1] - Complete acceptance criteria
- [Source: prd.md#FR30,FR31,FR32,FR48] - Browser support and responsive requirements

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Vite scaffold used create-vite@8.3.0 (auto-installed)
- Dev server started in 733ms on port 5173
- Production build: 193.29 KB JS (60.68 KB gzipped) - well under 200 KB limit
- All 269 packages installed with 0 vulnerabilities

### Completion Notes List

- AC1 SATISFIED: Project initialized with Vite 7.3.1, React 19.2.x, TypeScript 5.9.3, strict mode enabled
- AC2 SATISFIED: All production deps (zustand 5.0.11, zod 4.3.6, sonner 2.0.7) and dev deps installed with 0 conflicts
- AC3 SATISFIED: All 9 src/ subdirectories with barrel exports + api/ root directory with _lib/ and placeholder files
- AC4 SATISFIED: `npm run dev` starts server, `npm run build` produces bundle, `npm run test` passes (zero tests), `npm run lint` passes
- Vite template already provided ESLint flat config with TypeScript-ESLint - added eslint-config-prettier integration
- Zod installed as v4.3.6 (architecture spec said v3 but v4 is current stable with 14x perf improvement)
- sonner installed as v2.0.7 (architecture spec said v1 but v2 is current stable)
- App.tsx uses CSS Modules (App.module.css) per ARCH-5 convention

### Change Log

- 2026-02-11: Story 1.1 implemented - full project scaffold with all tooling configured

### File List

New files created:
- .env.example
- .prettierrc
- .prettierignore
- vitest.config.ts
- src/App.module.css
- src/test/setup.ts
- src/components/index.ts
- src/features/index.ts
- src/hooks/index.ts
- src/stores/index.ts
- src/api/index.ts
- src/types/index.ts
- src/schemas/index.ts
- src/utils/index.ts
- src/constants/index.ts
- api/generate.ts
- api/feedback.ts
- api/_lib/openai.ts
- api/_lib/rateLimit.ts
- api/_lib/validation.ts

Modified files:
- package.json (added deps, scripts)
- eslint.config.js (added eslint-config-prettier)
- index.html (updated title, removed vite.svg ref)
- src/App.tsx (replaced boilerplate with minimal PromptBuilder heading)
- src/index.css (replaced boilerplate with minimal reset)
- .gitignore (from Vite template, covers *.local)

Deleted files:
- src/App.css (replaced by App.module.css)
- src/assets/ (Vite boilerplate logos)
- public/vite.svg (Vite boilerplate)
