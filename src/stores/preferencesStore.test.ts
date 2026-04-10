import { describe, it, expect, beforeEach } from 'vitest';
import {
  usePreferencesStore,
  INSTRUCTION_SUFFIX_MAX_LENGTH,
} from './preferencesStore';

const STORAGE_KEY = 'promptbuilder_preferences';

describe('preferencesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    usePreferencesStore.getState().resetPreferences();
  });

  it('has correct initial state', () => {
    const state = usePreferencesStore.getState();
    expect(state.preferredPlatform).toBe('chatgpt');
    expect(state.defaultInstructionSuffix).toBe('');
    expect(state.favoriteDomains).toEqual([]);
    expect(state.clarificationMode).toBe('auto');
  });

  it('setPreferredPlatform updates and persists', () => {
    usePreferencesStore.getState().setPreferredPlatform('claude');
    expect(usePreferencesStore.getState().preferredPlatform).toBe('claude');
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).preferredPlatform).toBe('claude');
  });

  it('setDefaultInstructionSuffix updates and persists', () => {
    usePreferencesStore
      .getState()
      .setDefaultInstructionSuffix('Use British English.');
    expect(usePreferencesStore.getState().defaultInstructionSuffix).toBe(
      'Use British English.',
    );
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).defaultInstructionSuffix).toBe(
      'Use British English.',
    );
  });

  it('setDefaultInstructionSuffix truncates over the max length', () => {
    const oversized = 'x'.repeat(INSTRUCTION_SUFFIX_MAX_LENGTH + 100);
    usePreferencesStore.getState().setDefaultInstructionSuffix(oversized);
    expect(
      usePreferencesStore.getState().defaultInstructionSuffix.length,
    ).toBe(INSTRUCTION_SUFFIX_MAX_LENGTH);
  });

  it('toggleFavoriteDomain adds then removes', () => {
    usePreferencesStore.getState().toggleFavoriteDomain('Technical');
    expect(usePreferencesStore.getState().favoriteDomains).toEqual([
      'Technical',
    ]);
    usePreferencesStore.getState().toggleFavoriteDomain('Business');
    expect(usePreferencesStore.getState().favoriteDomains).toEqual([
      'Technical',
      'Business',
    ]);
    usePreferencesStore.getState().toggleFavoriteDomain('Technical');
    expect(usePreferencesStore.getState().favoriteDomains).toEqual([
      'Business',
    ]);
  });

  it('setClarificationMode updates and persists', () => {
    usePreferencesStore.getState().setClarificationMode('never');
    expect(usePreferencesStore.getState().clarificationMode).toBe('never');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).clarificationMode,
    ).toBe('never');
  });

  it('resetPreferences restores defaults', () => {
    const s = usePreferencesStore.getState();
    s.setPreferredPlatform('claude');
    s.setDefaultInstructionSuffix('hello');
    s.toggleFavoriteDomain('Technical');
    s.setClarificationMode('always');

    s.resetPreferences();

    const after = usePreferencesStore.getState();
    expect(after.preferredPlatform).toBe('chatgpt');
    expect(after.defaultInstructionSuffix).toBe('');
    expect(after.favoriteDomains).toEqual([]);
    expect(after.clarificationMode).toBe('auto');
  });

});
