import { z } from 'zod';
import { checkOrigin } from './_lib/cors.js';

const FEEDBACK_CATEGORIES = ['accuracy', 'usefulness', 'clarity', 'tone'] as const;

const feedbackSchema = z.object({
  rating: z.enum(['up', 'down']),
  comment: z.string().max(500).optional(),
  platform: z.enum(['chatgpt', 'claude', 'gemini', 'grok', 'perplexity']),
  stars: z.number().int().min(1).max(5).optional(),
  categories: z.array(z.enum(FEEDBACK_CATEGORIES)).max(4).optional(),
  domain: z.string().max(64).optional(),
});

function errorResponse(code: string, message: string, status: number) {
  return Response.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  if (!checkOrigin(request)) {
    return errorResponse('VALIDATION_ERROR', 'Forbidden origin.', 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('VALIDATION_ERROR', 'Invalid JSON body', 400);
  }

  const result = feedbackSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => i.message)
      .join(', ');
    return errorResponse('VALIDATION_ERROR', message, 400);
  }

  // Log feedback (persistent storage can be added later)
  console.log('[feedback]', JSON.stringify(result.data));

  return Response.json({ success: true });
}
