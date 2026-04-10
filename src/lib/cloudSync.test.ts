import { describe, it, expect, beforeEach } from 'vitest';
import {
  hasCompletedInitialSync,
  markInitialSyncComplete,
  syncStoresForUser,
  resetLocalStoresAfterSignOut,
  __resetSyncTrackingForTests,
} from './cloudSync';
import { usePreferencesStore } from '../stores/preferencesStore';
import { useHistoryStore } from '../stores/historyStore';

describe('cloudSync', () => {
  beforeEach(() => {
    localStorage.clear();
    __resetSyncTrackingForTests();
    usePreferencesStore.getState().resetLocal();
    useHistoryStore.getState().resetLocal();
  });

  describe('sync tracking', () => {
    it('reports false before marking', () => {
      expect(hasCompletedInitialSync('user-a')).toBe(false);
    });

    it('reports true after marking', () => {
      markInitialSyncComplete('user-a');
      expect(hasCompletedInitialSync('user-a')).toBe(true);
    });

    it('tracks multiple users independently', () => {
      markInitialSyncComplete('user-a');
      expect(hasCompletedInitialSync('user-a')).toBe(true);
      expect(hasCompletedInitialSync('user-b')).toBe(false);
      markInitialSyncComplete('user-b');
      expect(hasCompletedInitialSync('user-b')).toBe(true);
    });

    it('is idempotent — marking twice is a no-op', () => {
      markInitialSyncComplete('user-a');
      markInitialSyncComplete('user-a');
      expect(hasCompletedInitialSync('user-a')).toBe(true);
    });

    it('ignores junk values in localStorage', () => {
      localStorage.setItem('promptbuilder_synced_users', 'not-json');
      expect(hasCompletedInitialSync('user-a')).toBe(false);
    });
  });

  describe('syncStoresForUser', () => {
    it('short-circuits when Supabase is not configured (no crash)', async () => {
      // In test env VITE_SUPABASE_* is unset, so isSupabaseConfigured === false.
      // This call must complete without touching any network.
      await expect(syncStoresForUser('user-a')).resolves.toBeUndefined();
    });

    it('does not mark a user as synced when unconfigured', async () => {
      await syncStoresForUser('user-a');
      expect(hasCompletedInitialSync('user-a')).toBe(false);
    });
  });

  describe('resetLocalStoresAfterSignOut', () => {
    it('clears preferencesStore and historyStore back to defaults', () => {
      usePreferencesStore.getState().setPreferredPlatform('claude');
      usePreferencesStore.getState().setDefaultInstructionSuffix('hello');
      useHistoryStore.getState().addEntry({
        userInput: 'test input ten chars',
        generatedPrompt: 'test prompt',
        platform: 'claude',
      });

      expect(usePreferencesStore.getState().preferredPlatform).toBe('claude');
      expect(useHistoryStore.getState().entries.length).toBe(1);

      resetLocalStoresAfterSignOut();

      expect(usePreferencesStore.getState().preferredPlatform).toBe('chatgpt');
      expect(usePreferencesStore.getState().defaultInstructionSuffix).toBe('');
      expect(useHistoryStore.getState().entries).toEqual([]);
    });
  });
});
