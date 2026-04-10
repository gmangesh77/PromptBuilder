import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type AuthView = 'sign-in' | 'sign-up';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  showAuthModal: boolean;
  authView: AuthView;
  error: string | null;

  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  openAuthModal: (view?: AuthView) => void;
  closeAuthModal: () => void;
  setAuthView: (view: AuthView) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  // Start in loading state only when we actually intend to fetch a session.
  isLoading: isSupabaseConfigured,
  isConfigured: isSupabaseConfigured,
  showAuthModal: false,
  authView: 'sign-in',
  error: null,

  initialize: async () => {
    if (!isSupabaseConfigured) {
      set({ isLoading: false });
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({
      session,
      user: session?.user ?? null,
      isLoading: false,
    });

    supabase.auth.onAuthStateChange((_event, nextSession) => {
      set({
        session: nextSession,
        user: nextSession?.user ?? null,
      });
    });
  },

  signInWithGoogle: async () => {
    if (!isSupabaseConfigured) {
      set({ error: 'Sign-in is unavailable — Supabase is not configured.' });
      return;
    }
    set({ error: null });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
      },
    });
    if (error) set({ error: error.message });
  },

  signInWithEmail: async (email, password) => {
    if (!isSupabaseConfigured) {
      set({ error: 'Sign-in is unavailable — Supabase is not configured.' });
      return;
    }
    set({ error: null, isLoading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }
    set({ isLoading: false, showAuthModal: false });
  },

  signUpWithEmail: async (email, password) => {
    if (!isSupabaseConfigured) {
      set({ error: 'Sign-up is unavailable — Supabase is not configured.' });
      return;
    }
    set({ error: null, isLoading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }
    // When email confirmation is enabled, the user won't be signed in yet —
    // keep the modal open with a hint.
    set({
      isLoading: false,
      error: 'Check your email to confirm your account before signing in.',
    });
  },

  signOut: async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },

  openAuthModal: (view = 'sign-in') =>
    set({ showAuthModal: true, authView: view, error: null }),
  closeAuthModal: () => set({ showAuthModal: false, error: null }),
  setAuthView: (view) => set({ authView: view, error: null }),
  clearError: () => set({ error: null }),
}));
