import { create } from 'zustand';
import type { AppError } from '../types/error';

export interface ClarifyingQuestion {
  question: string;
  options: string[];
}

interface GenerationState {
  isStreaming: boolean;
  streamedContent: string;
  analysisSteps: string[];
  generatedPrompt: string | null;
  questions: ClarifyingQuestion[];
  error: AppError | null;
  startGeneration: () => void;
  appendChunk: (content: string) => void;
  addAnalysisStep: (step: string) => void;
  setGeneratedPrompt: (prompt: string) => void;
  setQuestions: (questions: ClarifyingQuestion[]) => void;
  clearQuestions: () => void;
  setError: (error: AppError) => void;
  resetGeneration: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  isStreaming: false,
  streamedContent: '',
  analysisSteps: [],
  generatedPrompt: null,
  questions: [],
  error: null,
  startGeneration: () =>
    set({
      isStreaming: true,
      streamedContent: '',
      analysisSteps: [],
      generatedPrompt: null,
      questions: [],
      error: null,
    }),
  appendChunk: (content) =>
    set((state) => ({ streamedContent: state.streamedContent + content })),
  addAnalysisStep: (step) =>
    set((state) => ({ analysisSteps: [...state.analysisSteps, step] })),
  setGeneratedPrompt: (prompt) =>
    set({ generatedPrompt: prompt, isStreaming: false }),
  setQuestions: (questions) => set({ questions, isStreaming: false }),
  clearQuestions: () => set({ questions: [] }),
  setError: (error) => set({ error, isStreaming: false }),
  resetGeneration: () =>
    set({
      isStreaming: false,
      streamedContent: '',
      analysisSteps: [],
      generatedPrompt: null,
      questions: [],
      error: null,
    }),
}));

export const useIsStreaming = () =>
  useGenerationStore((s) => s.isStreaming);
export const useStreamedContent = () =>
  useGenerationStore((s) => s.streamedContent);
export const useGeneratedPrompt = () =>
  useGenerationStore((s) => s.generatedPrompt);
export const useQuestions = () =>
  useGenerationStore((s) => s.questions);
export const useGenerationError = () =>
  useGenerationStore((s) => s.error);
