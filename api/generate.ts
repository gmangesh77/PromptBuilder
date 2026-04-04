import { openai, MODEL } from './_lib/openai.js';
import { generateRequestSchema } from './_lib/validation.js';
import { checkRateLimit } from './_lib/rateLimit.js';
import { checkOrigin } from './_lib/cors.js';
import { buildSystemPrompt } from './_lib/systemPrompt.js';

const TIMEOUT_MS = 30_000;

function errorResponse(code: string, message: string, status: number) {
  return Response.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  // CSRF: validate Origin header
  if (!checkOrigin(request)) {
    return errorResponse('VALIDATION_ERROR', 'Forbidden origin.', 403);
  }

  // Extract client IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Rate limit check
  if (!checkRateLimit(ip)) {
    return errorResponse(
      'RATE_LIMITED',
      'Too many requests. Please wait.',
      429,
    );
  }

  // Parse and validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('VALIDATION_ERROR', 'Invalid JSON body.', 400);
  }

  const result = generateRequestSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => i.message)
      .join('; ');
    return errorResponse('VALIDATION_ERROR', message, 400);
  }

  const { userInput, platform } = result.data;

  // Set up abort for timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const stream = await openai.chat.completions.create(
      {
        model: MODEL,
        stream: true,
        messages: [
          { role: 'system', content: buildSystemPrompt(platform) },
          {
            role: 'user',
            content: userInput,
          },
        ],
      },
      { signal: controller.signal },
    );

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(streamController) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              streamController.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
              );
            }
          }
          streamController.enqueue(encoder.encode('data: [DONE]\n\n'));
          streamController.close();
        } catch (err) {
          const message =
            err instanceof Error && err.name === 'AbortError'
              ? 'Request timed out.'
              : 'Stream interrupted.';
          streamController.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: { code: 'API_ERROR', message } })}\n\n`,
            ),
          );
          streamController.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    console.error('[generate] OpenAI error:', err);
    const apiErr = err as { status?: number; name?: string };

    if (apiErr.name === 'AbortError') {
      return errorResponse('API_ERROR', 'Request timed out. Please try again.', 504);
    }
    if (apiErr.status === 401) {
      return errorResponse('API_ERROR', 'Service configuration error. Please try again later.', 500);
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
