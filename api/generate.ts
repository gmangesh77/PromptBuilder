import { streamGeneration, getModel } from './_lib/providers.js';
import { generateRequestSchema } from './_lib/validation.js';
import { checkRateLimit } from './_lib/rateLimit.js';
import { checkOrigin } from './_lib/cors.js';
import { buildSystemPrompt } from './_lib/systemPrompt.js';

const TIMEOUT_MS = 30_000;

function errorResponse(code: string, message: string, status: number) {
  return Response.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  if (!checkOrigin(request)) {
    return errorResponse('VALIDATION_ERROR', 'Forbidden origin.', 403);
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (!checkRateLimit(ip)) {
    return errorResponse('RATE_LIMITED', 'Too many requests. Please wait.', 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('VALIDATION_ERROR', 'Invalid JSON body.', 400);
  }

  const result = generateRequestSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join('; ');
    return errorResponse('VALIDATION_ERROR', message, 400);
  }

  const { userInput, platform, apiKey, modelTier, provider } = result.data;
  const model = getModel(provider, modelTier);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const { readable } = await streamGeneration({
      provider,
      apiKey,
      model,
      systemPrompt: buildSystemPrompt(platform),
      userMessage: userInput,
      signal: controller.signal,
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    console.error('[generate] API error:', err);
    const apiErr = err as { status?: number; name?: string };

    if (apiErr.name === 'AbortError') {
      return errorResponse('API_ERROR', 'Request timed out. Please try again.', 504);
    }
    if (apiErr.status === 401) {
      return errorResponse('API_ERROR', 'Invalid API key. Please check your key in Settings.', 401);
    }
    if (apiErr.status === 429) {
      return errorResponse('RATE_LIMITED', 'Too many requests. Please wait a moment.', 429);
    }
    if (apiErr.status && apiErr.status >= 500) {
      return errorResponse('API_ERROR', 'AI service temporarily unavailable. Please try again.', 502);
    }

    return errorResponse('API_ERROR', 'Generation failed. Please try again.', 500);
  } finally {
    clearTimeout(timeout);
  }
}
