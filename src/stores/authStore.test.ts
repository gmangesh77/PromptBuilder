import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset modal + view between tests. We don't reset session/user because
    // initialize() is async and touches Supabase; those are covered elsewhere.
    useAuthStore.setState({
      showAuthModal: false,
      authView: 'sign-in',
      error: null,
    });
  });

  it('has sensible defaults', () => {
    const state = useAuthStore.getState();
    expect(state.showAuthModal).toBe(false);
    expect(state.authView).toBe('sign-in');
    expect(state.error).toBeNull();
    // session/user start null until initialize() runs
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
  });

  it('openAuthModal opens the modal in sign-in view by default', () => {
    useAuthStore.getState().openAuthModal();
    const state = useAuthStore.getState();
    expect(state.showAuthModal).toBe(true);
    expect(state.authView).toBe('sign-in');
  });

  it('openAuthModal accepts an explicit view', () => {
    useAuthStore.getState().openAuthModal('sign-up');
    expect(useAuthStore.getState().authView).toBe('sign-up');
  });

  it('closeAuthModal hides the modal and clears the error', () => {
    useAuthStore.setState({ showAuthModal: true, error: 'boom' });
    useAuthStore.getState().closeAuthModal();
    const state = useAuthStore.getState();
    expect(state.showAuthModal).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setAuthView toggles between sign-in and sign-up', () => {
    useAuthStore.getState().setAuthView('sign-up');
    expect(useAuthStore.getState().authView).toBe('sign-up');
    useAuthStore.getState().setAuthView('sign-in');
    expect(useAuthStore.getState().authView).toBe('sign-in');
  });

  it('clearError resets the error message', () => {
    useAuthStore.setState({ error: 'bad password' });
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('short-circuits auth calls when Supabase is not configured', async () => {
    // In test env VITE_SUPABASE_* is unset, so isConfigured is false.
    expect(useAuthStore.getState().isConfigured).toBe(false);

    await useAuthStore.getState().signInWithGoogle();
    expect(useAuthStore.getState().error).toMatch(/not configured/i);

    useAuthStore.getState().clearError();
    await useAuthStore.getState().signInWithEmail('a@b.co', 'password');
    expect(useAuthStore.getState().error).toMatch(/not configured/i);

    useAuthStore.getState().clearError();
    await useAuthStore.getState().signUpWithEmail('a@b.co', 'password');
    expect(useAuthStore.getState().error).toMatch(/not configured/i);
  });

  it('initialize sets isLoading=false even when unconfigured', async () => {
    useAuthStore.setState({ isLoading: true });
    await useAuthStore.getState().initialize();
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
