import { z } from 'zod';
import { checkOrigin } from './_lib/cors.js';

const feedbackSchema = z.object({
  rating: z.enum(['up', 'down']),
  comment: z.string().max(500).optional(),
  platform: z.enum(['chatgpt', 'claude', 'gemini', 'grok', 'perplexity']),
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
