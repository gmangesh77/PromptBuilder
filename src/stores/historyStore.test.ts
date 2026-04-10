import { describe, it, expect, beforeEach } from 'vitest';
import { useHistoryStore } from './historyStore';

describe('historyStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useHistoryStore.getState().resetLocal();
  });

  it('starts with an empty list', () => {
    expect(useHistoryStore.getState().entries).toEqual([]);
  });

  it('addEntry prepends a new entry with an id and timestamp', () => {
    useHistoryStore.getState().addEntry({
      userInput: 'describe a rainy morning in tokyo',
      generatedPrompt: 'Write a short descriptive paragraph...',
      platform: 'claude',
    });
    const entries = useHistoryStore.getState().entries;
    expect(entries.length).toBe(1);
    expect(entries[0].userInput).toBe('describe a rainy morning in tokyo');
    expect(entries[0].platform).toBe('claude');
    expect(entries[0].favorite).toBe(false);
    expect(typeof entries[0].id).toBe('string');
    expect(entries[0].id.length).toBeGreaterThan(0);
    expect(typeof entries[0].createdAt).toBe('number');
  });

  it('addEntry pushes newest entries to the front', () => {
    const s = useHistoryStore.getState();
    s.addEntry({ userInput: 'one two three four', generatedPrompt: 'a', platform: 'chatgpt' });
    s.addEntry({ userInput: 'five six seven eight', generatedPrompt: 'b', platform: 'chatgpt' });
    const entries = useHistoryStore.getState().entries;
    expect(entries[0].userInput).toBe('five six seven eight');
    expect(entries[1].userInput).toBe('one two three four');
  });

  it('removeEntry deletes by id', () => {
    const s = useHistoryStore.getState();
    s.addEntry({ userInput: 'one two three four', generatedPrompt: 'a', platform: 'chatgpt' });
    const id = useHistoryStore.getState().entries[0].id;
    s.removeEntry(id);
    expect(useHistoryStore.getState().entries).toEqual([]);
  });

  it('toggleFavorite flips the favorite flag', () => {
    const s = useHistoryStore.getState();
    s.addEntry({ userInput: 'one two three four', generatedPrompt: 'a', platform: 'chatgpt' });
    const id = useHistoryStore.getState().entries[0].id;
    s.toggleFavorite(id);
    expect(useHistoryStore.getState().entries[0].favorite).toBe(true);
    s.toggleFavorite(id);
    expect(useHistoryStore.getState().entries[0].favorite).toBe(false);
  });

  it('clearAll empties the list', () => {
    const s = useHistoryStore.getState();
    s.addEntry({ userInput: 'one two three four', generatedPrompt: 'a', platform: 'chatgpt' });
    s.addEntry({ userInput: 'five six seven eight', generatedPrompt: 'b', platform: 'chatgpt' });
    s.clearAll();
    expect(useHistoryStore.getState().entries).toEqual([]);
  });

  it('resetLocal wipes entries without touching the cloud', () => {
    const s = useHistoryStore.getState();
    s.addEntry({ userInput: 'one two three four', generatedPrompt: 'a', platform: 'chatgpt' });
    s.resetLocal();
    expect(useHistoryStore.getState().entries).toEqual([]);
  });

  it('cloud methods are safe no-ops when Supabase is unconfigured', async () => {
    // isSupabaseConfigured is false in the test env.
    await expect(
      useHistoryStore.getState().loadFromCloud('user-a'),
    ).resolves.toBeUndefined();
    await expect(
      useHistoryStore.getState().uploadLocalToCloud('user-a'),
    ).resolves.toBeUndefined();
  });
});
