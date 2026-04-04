# PromptBuilder

An AI-powered prompt engineering tool that transforms natural language descriptions into optimized, platform-specific prompts ready to paste into ChatGPT, Claude, Gemini, Grok, or Perplexity.

## Features

- **Intelligent Prompt Generation** - Analyzes your request, detects domain and intent, then generates an optimized prompt using role-based prompting, chain-of-thought, and other techniques
- **Platform-Specific Optimization** - Tailors prompts for ChatGPT, Claude, Gemini, Grok, and Perplexity based on each platform's strengths
- **Real-Time Streaming** - See the AI's analysis process streamed in real time via Server-Sent Events
- **Clarifying Questions** - When your request is ambiguous, the AI asks 1-2 targeted multiple-choice questions to refine the output
- **One-Click Copy** - Copy the generated prompt to your clipboard with a single click and visual confirmation
- **Session Persistence** - Your last generated prompt is cached in localStorage and restored when you return
- **Feedback System** - Rate prompts with thumbs up/down and optional comments
- **Error Resilience** - Automatic retry with exponential backoff, rate limit handling, and toast notifications for all error states

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 (strict) |
| Build | Vite 7 |
| State | Zustand 5 |
| Validation | Zod 4 |
| AI | OpenAI SDK 6 (gpt-4.1-mini default) |
| Notifications | Sonner 2 |
| Deployment | Vercel (serverless functions) |
| Testing | Vitest 4 + React Testing Library |
| Linting | ESLint 9 (flat config) + Prettier |

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Installation

```bash
git clone https://github.com/your-username/PromptBuilder.git
cd PromptBuilder
npm install
```

### Environment Setup

Copy the example environment file and add your API key:

```bash
cp .env.example .env
```

Edit `.env`:

```
OPENAI_API_KEY=sk-your-key-here
```

### Development

For full local development with API routes:

```bash
npx vercel dev
```

Or for frontend-only development (no API):

```bash
npm run dev
```

### Build

```bash
npm run build
```

Production bundle: ~75 KB gzipped JS, ~2.3 KB gzipped CSS.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
PromptBuilder/
├── api/                          # Vercel Serverless Functions (Web Standard API)
│   ├── generate.ts               # POST - SSE streaming prompt generation
│   ├── feedback.ts               # POST - Anonymous feedback collection
│   ├── health.ts                 # GET  - Health check endpoint
│   └── _lib/
│       ├── openai.ts             # OpenAI client + model config
│       ├── systemPrompt.ts       # Prompt engineering system prompt
│       ├── validation.ts         # Zod request schemas
│       ├── rateLimit.ts          # In-memory rate limiter (10 req/min)
│       └── cors.ts               # Origin validation (CSRF protection)
├── src/
│   ├── components/               # Shared UI components
│   │   ├── Button/
│   │   ├── ErrorBoundary/
│   │   ├── Input/
│   │   └── Spinner/
│   ├── features/                 # Feature modules
│   │   ├── PromptInput/          # Text input + platform selector
│   │   ├── Generation/           # Streaming analysis, prompt output, questions
│   │   └── Feedback/             # Thumbs up/down feedback widget
│   ├── hooks/
│   │   ├── useStream.ts          # SSE streaming with retry logic
│   │   ├── useClipboard.ts       # Clipboard API with fallback
│   │   └── useLocalStorage.ts    # Typed localStorage wrapper
│   ├── stores/                   # Zustand state management
│   │   ├── promptStore.ts        # User input + platform selection
│   │   ├── generationStore.ts    # Streaming state + generated prompt
│   │   └── feedbackStore.ts      # Feedback rating + submission
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── vercel.json
└── package.json
```

## API Endpoints

### `POST /api/generate`

Generates an optimized prompt via OpenAI streaming.

**Request:**

```json
{
  "userInput": "Help me write a technical blog post about React Server Components",
  "platform": "claude"
}
```

**Response:** Server-Sent Events stream

```
data: {"content":"Analyzing your request..."}
data: {"content":"---PROMPT---\nAct as a senior technical writer..."}
data: [DONE]
```

### `POST /api/feedback`

Submits anonymous feedback (no PII collected).

**Request:**

```json
{
  "rating": "up",
  "comment": "Very helpful prompt!",
  "platform": "claude"
}
```

### `GET /api/health`

Health check for monitoring.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-11T12:00:00.000Z"
}
```

## Configuration

| Environment Variable | Required | Default | Description |
|---------------------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4.1-mini` | OpenAI model to use |
| `ALLOWED_ORIGINS` | No | - | Comma-separated allowed origins for CSRF |

## Testing

90 tests across 17 test files covering stores, hooks, components, and utilities.

```bash
npm run test
```

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Set the `OPENAI_API_KEY` environment variable in your Vercel project settings.

## License

MIT
