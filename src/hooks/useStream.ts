import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useGenerationStore } from '../stores/generationStore';
import { useSettingsStore } from '../stores/settingsStore';
import type { ClarifyingQuestion } from '../stores/generationStore';
import { parseSSE } from '../utils/parseSSE';
import type { ErrorCode } from '../types/error';

const PROMPT_DELIMITER = '---PROMPT---';
const QUESTIONS_DELIMITER = '---QUESTIONS---';
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];

interface StreamRequest {
  userInput: string;
  platform: string;
}

function isRetryableStatus(status: number): boolean {
  return status >= 500;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useStream() {
  const abortRef = useRef<AbortController | null>(null);

  const startGeneration = useGenerationStore((s) => s.startGeneration);
  const appendChunk = useGenerationStore((s) => s.appendChunk);
  const setGeneratedPrompt = useGenerationStore((s) => s.setGeneratedPrompt);
  const setQuestions = useGenerationStore((s) => s.setQuestions);
  const setError = useGenerationStore((s) => s.setError);

  const generate = useCallback(
    async (body: StreamRequest) => {
      const apiKey = useSettingsStore.getState().apiKey;
      if (!apiKey) {
        toast.error('Please set your OpenAI API key in Settings first.');
        useSettingsStore.getState().openSettings();
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      startGeneration();

      function finalizeContent(content: string) {
        const questionsIndex = content.indexOf(QUESTIONS_DELIMITER);
        if (questionsIndex !== -1) {
          const questionsText = content
            .slice(questionsIndex + QUESTIONS_DELIMITER.length)
            .trim();
          try {
            const parsed = JSON.parse(questionsText) as ClarifyingQuestion[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setQuestions(parsed);
              return;
            }
          } catch {
            // Fall through to prompt handling
          }
        }

        const promptIndex = content.indexOf(PROMPT_DELIMITER);
        if (promptIndex !== -1) {
          setGeneratedPrompt(
            content.slice(promptIndex + PROMPT_DELIMITER.length).trim(),
          );
        } else {
          setGeneratedPrompt(content);
        }
      }

      async function attemptStream(): Promise<boolean> {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({ ...body, apiKey }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorBody = (await response.json().catch(() => null)) as {
            error?: { code?: string; message?: string };
          } | null;
          const code =
            (errorBody?.error?.code as ErrorCode) || 'API_ERROR';
          const message =
            errorBody?.error?.message ||
            'Generation failed. Please try again.';

          // Rate limit — do not retry
          if (response.status === 429) {
            console.error('[useStream] Rate limited:', message);
            toast.error(
              'Too many requests. Please wait a moment and try again.',
            );
            setError({ code: 'RATE_LIMITED', message });
            return true; // handled, no retry
          }

          // Retryable server errors
          if (isRetryableStatus(response.status)) {
            return false; // signal retry
          }

          // Non-retryable client errors (400, 401, etc.)
          console.error('[useStream] API error:', code, message);
          toast.error(message);
          setError({ code, message });
          return true; // handled, no retry
        }

        const reader = response.body?.getReader();
        if (!reader) {
          const message = 'Unable to read response stream.';
          console.error('[useStream]', message);
          toast.error(message);
          setError({ code: 'STREAM_INTERRUPTED', message });
          return true;
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const chunk = parseSSE(line);
            if (!chunk) continue;

            if (chunk.type === 'content' && chunk.content) {
              appendChunk(chunk.content);
              fullContent += chunk.content;
            } else if (chunk.type === 'error' && chunk.error) {
              console.error('[useStream] Stream error:', chunk.error);
              toast.error(chunk.error.message);
              setError(chunk.error);
              reader.cancel();
              return true;
            } else if (chunk.type === 'done') {
              finalizeContent(fullContent);
              return true;
            }
          }
        }

        if (fullContent) {
          finalizeContent(fullContent);
        }
        return true;
      }

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        if (controller.signal.aborted) return;

        if (attempt > 0) {
          appendChunk(`\n\nRetrying... (attempt ${attempt + 1}/${MAX_RETRIES + 1})\n`);
          await delay(RETRY_DELAYS[attempt - 1]);
          if (controller.signal.aborted) return;
        }

        try {
          const handled = await attemptStream();
          if (handled) return;
          // Not handled = retryable, continue loop
        } catch (err) {
          if (
            err instanceof DOMException &&
            err.name === 'AbortError'
          )
            return;

          if (attempt < MAX_RETRIES) {
            console.error(
              `[useStream] Attempt ${attempt + 1} failed, retrying...`,
              err,
            );
            continue;
          }

          const message =
            'Connection failed. Please check your network and try again.';
          console.error('[useStream] All retries exhausted:', err);
          toast.error('Unable to generate prompt. Please try again.');
          setError({ code: 'NETWORK_ERROR', message });
          return;
        }
      }

      // All retries exhausted (server errors)
      const message = 'Unable to generate prompt. Please try again.';
      console.error('[useStream] All retries exhausted');
      toast.error(message);
      setError({ code: 'API_ERROR', message });
    },
    [startGeneration, appendChunk, setGeneratedPrompt, setQuestions, setError],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { generate, abort };
}
