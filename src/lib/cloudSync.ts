import { usePreferencesStore } from '../stores/preferencesStore';
import { useHistoryStore } from '../stores/historyStore';
import { isSupabaseConfigured } from './supabase';

const SYNCED_USERS_KEY = 'promptbuilder_synced_users';

function loadSyncedUsers(): string[] {
  try {
    const raw = localStorage.getItem(SYNCED_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

function saveSyncedUsers(ids: string[]): void {
  try {
    localStorage.setItem(SYNCED_USERS_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable — silently fail.
  }
}

/**
 * Has this user already completed the first-time local→cloud migration
 * on this browser? Used to decide whether a sign-in should upload local
 * data (first-sync) or simply download cloud data (subsequent sign-in).
 */
export function hasCompletedInitialSync(userId: string): boolean {
  return loadSyncedUsers().includes(userId);
}

export function markInitialSyncComplete(userId: string): void {
  const ids = loadSyncedUsers();
  if (!ids.includes(userId)) {
    ids.push(userId);
    saveSyncedUsers(ids);
  }
}

/** Test hook — resets sync-tracking state. Not used in production code. */
export function __resetSyncTrackingForTests(): void {
  try {
    localStorage.removeItem(SYNCED_USERS_KEY);
  } catch {
    // noop
  }
}

/**
 * Called when the user transitions from signed-out to signed-in.
 *
 * - First sign-in for this user on this device: upload the anonymous local
 *   data to Supabase (local-wins on conflict), then mark this user as
 *   synced.
 * - Subsequent sign-ins: skip upload; only download cloud state.
 *
 * In both cases we finish by downloading cloud state into local, so the
 * in-memory store is authoritative and write-throughs are consistent.
 */
export async function syncStoresForUser(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const isFirstSync = !hasCompletedInitialSync(userId);

  if (isFirstSync) {
    await usePreferencesStore.getState().uploadLocalToCloud(userId);
    await useHistoryStore.getState().uploadLocalToCloud(userId);
    markInitialSyncComplete(userId);
  }

  await usePreferencesStore.getState().loadFromCloud(userId);
  await useHistoryStore.getState().loadFromCloud(userId);
}

/**
 * Called when the user signs out. Wipes local state so a subsequent user
 * on a shared device doesn't inherit the previous user's data. Cloud data
 * is untouched and will re-hydrate on next sign-in.
 */
export function resetLocalStoresAfterSignOut(): void {
  usePreferencesStore.getState().resetLocal();
  useHistoryStore.getState().resetLocal();
}
