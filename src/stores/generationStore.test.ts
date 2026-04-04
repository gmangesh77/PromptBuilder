import { describe, it, expect, beforeEach } from 'vitest';
import { useGenerationStore } from './generationStore';

describe('generationStore', () => {
  beforeEach(() => {
    useGenerationStore.getState().resetGeneration();
  });

  it('has correct initial state', () => {
    const state = useGenerationStore.getState();
    expect(state.isStreaming).toBe(false);
    expect(state.streamedContent).toBe('');
    expect(state.analysisSteps).toEqual([]);
    expect(state.generatedPrompt).toBeNull();
    expect(state.questions).toEqual([]);
    expect(state.error).toBeNull();
  });

  it('startGeneration resets state and sets isStreaming', () => {
    useGenerationStore.getState().appendChunk('old content');
    useGenerationStore.getState().startGeneration();
    const state = useGenerationStore.getState();
    expect(state.isStreaming).toBe(true);
    expect(state.streamedContent).toBe('');
    expect(state.error).toBeNull();
  });

  it('appendChunk accumulates content', () => {
    useGenerationStore.getState().appendChunk('Hello');
    useGenerationStore.getState().appendChunk(' world');
    expect(useGenerationStore.getState().streamedContent).toBe('Hello world');
  });

  it('addAnalysisStep appends steps', () => {
    useGenerationStore.getState().addAnalysisStep('Analyzing...');
    useGenerationStore.getState().addAnalysisStep('Detecting domain...');
    expect(useGenerationStore.getState().analysisSteps).toEqual([
      'Analyzing...',
      'Detecting domain...',
    ]);
  });

  it('setGeneratedPrompt stores prompt and stops streaming', () => {
    useGenerationStore.getState().startGeneration();
    useGenerationStore.getState().setGeneratedPrompt('Final prompt');
    const state = useGenerationStore.getState();
    expect(state.generatedPrompt).toBe('Final prompt');
    expect(state.isStreaming).toBe(false);
  });

  it('setError stores error and stops streaming', () => {
    useGenerationStore.getState().startGeneration();
    useGenerationStore
      .getState()
      .setError({ code: 'API_ERROR', message: 'Failed' });
    const state = useGenerationStore.getState();
    expect(state.error).toEqual({ code: 'API_ERROR', message: 'Failed' });
    expect(state.isStreaming).toBe(false);
  });

  it('setQuestions stores questions and stops streaming', () => {
    useGenerationStore.getState().startGeneration();
    useGenerationStore
      .getState()
      .setQuestions([{ question: 'What scope?', options: ['A', 'B'] }]);
    const state = useGenerationStore.getState();
    expect(state.questions).toHaveLength(1);
    expect(state.questions[0].question).toBe('What scope?');
    expect(state.isStreaming).toBe(false);
  });

  it('clearQuestions empties questions array', () => {
    useGenerationStore
      .getState()
      .setQuestions([{ question: 'Test?', options: ['X'] }]);
    useGenerationStore.getState().clearQuestions();
    expect(useGenerationStore.getState().questions).toEqual([]);
  });

  it('resetGeneration clears all state including questions', () => {
    useGenerationStore.getState().startGeneration();
    useGenerationStore.getState().appendChunk('content');
    useGenerationStore.getState().addAnalysisStep('step');
    useGenerationStore
      .getState()
      .setQuestions([{ question: 'Q?', options: ['A'] }]);
    useGenerationStore.getState().resetGeneration();
    const state = useGenerationStore.getState();
    expect(state.isStreaming).toBe(false);
    expect(state.streamedContent).toBe('');
    expect(state.analysisSteps).toEqual([]);
    expect(state.generatedPrompt).toBeNull();
    expect(state.questions).toEqual([]);
    expect(state.error).toBeNull();
  });
});
