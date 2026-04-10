import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/**
 * Whether the browser has valid Supabase credentials configured. Every UI
 * surface that calls Supabase should gate on this flag so the app degrades
 * gracefully when env vars are missing (e.g. local dev without .env.local).
 */
export const isSupabaseConfigured = Boolean(url && key);

// Placeholder URL/key prevent a module-load crash when env vars are missing.
// All real usage is gated behind `isSupabaseConfigured` — requests against
// the placeholder would fail, but we never reach them.
export const supabase: SupabaseClient = createClient(
  url ?? 'https://placeholder.supabase.co',
  key ?? 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'promptbuilder-auth',
    },
  },
);
