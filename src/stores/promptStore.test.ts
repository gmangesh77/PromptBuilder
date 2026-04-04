import { describe, it, expect, beforeEach } from 'vitest';
import { usePromptStore } from './promptStore';

describe('promptStore', () => {
  beforeEach(() => {
    usePromptStore.setState({
      userInput: '',
      selectedPlatform: 'chatgpt',
    });
  });

  it('has correct initial state', () => {
    const state = usePromptStore.getState();
    expect(state.userInput).toBe('');
    expect(state.selectedPlatform).toBe('chatgpt');
  });

  it('setUserInput updates userInput', () => {
    usePromptStore.getState().setUserInput('Hello world');
    expect(usePromptStore.getState().userInput).toBe('Hello world');
  });

  it('setPlatform updates selectedPlatform', () => {
    usePromptStore.getState().setPlatform('claude');
    expect(usePromptStore.getState().selectedPlatform).toBe('claude');
  });

  it('clearInput resets userInput to empty string', () => {
    usePromptStore.getState().setUserInput('Some text');
    usePromptStore.getState().clearInput();
    expect(usePromptStore.getState().userInput).toBe('');
  });
});
