import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components';
import styles from './AuthModal.module.css';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

export function AuthModal() {
  const showAuthModal = useAuthStore((s) => s.showAuthModal);
  const closeAuthModal = useAuthStore((s) => s.closeAuthModal);
  const authView = useAuthStore((s) => s.authView);
  const setAuthView = useAuthStore((s) => s.setAuthView);
  const user = useAuthStore((s) => s.user);
  const isConfigured = useAuthStore((s) => s.isConfigured);
  const error = useAuthStore((s) => s.error);
  const isLoading = useAuthStore((s) => s.isLoading);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail);
  const signOut = useAuthStore((s) => s.signOut);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showAuthModal && !user) {
      setTimeout(() => emailInputRef.current?.focus(), 50);
    }
  }, [showAuthModal, user]);

  useEffect(() => {
    if (!showAuthModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showAuthModal, closeAuthModal]);

  if (!showAuthModal) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    if (authView === 'sign-in') {
      void signInWithEmail(email.trim(), password);
    } else {
      void signUpWithEmail(email.trim(), password);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out.');
    closeAuthModal();
  };

  const isSignedIn = Boolean(user);
  const title = isSignedIn
    ? 'Your account.'
    : authView === 'sign-in'
      ? 'Welcome back.'
      : 'Create an account.';
  const eyebrow = isSignedIn
    ? 'Account'
    : authView === 'sign-in'
      ? 'Sign in'
      : 'Sign up';

  return (
    <div className={styles.overlay} onClick={closeAuthModal}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isSignedIn ? 'Account' : 'Sign in'}
      >
        <button
          className={styles.closeButton}
          onClick={closeAuthModal}
          aria-label="Close"
        >
          &times;
        </button>

        <div className={styles.eyebrow}>
          <span className={styles.eyebrowRule} />
          <span>{eyebrow}</span>
        </div>
        <h2 className={styles.title}>
          {title.split(' ').slice(0, -1).join(' ')}{' '}
          <em>{title.split(' ').slice(-1)[0]}</em>
        </h2>

        <hr className={styles.divider} />

        {!isConfigured && (
          <div className={styles.notConfigured}>
            {typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' ||
              window.location.hostname === '127.0.0.1') ? (
              <>
                Sign-in is unavailable because Supabase is not configured.
                Copy <code>.env.example</code> to <code>.env.local</code>, add
                your <code>VITE_SUPABASE_URL</code> and{' '}
                <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>, then restart{' '}
                <code>npm run dev</code>.
              </>
            ) : (
              <>
                Sign-in is temporarily unavailable. Please try again later.
              </>
            )}
          </div>
        )}

        {isConfigured && isSignedIn && user && (
          <>
            <div className={styles.profileCard}>
              <span className={styles.fieldLabel}>Signed in as</span>
              <span className={styles.profileEmail}>{user.email}</span>
              <span className={styles.profileHint}>
                Cloud sync for history and preferences is coming next.
              </span>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={closeAuthModal}>
                Close
              </Button>
              <Button onClick={handleSignOut}>Sign out</Button>
            </div>
          </>
        )}

        {isConfigured && !isSignedIn && (
          <>
            <button
              type="button"
              className={styles.googleButton}
              onClick={() => void signInWithGoogle()}
              disabled={isLoading}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className={styles.separator}>
              <span className={styles.separatorLine} />
              <span>or</span>
              <span className={styles.separatorLine} />
            </div>

            <form className={styles.form} onSubmit={handleEmailSubmit}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="auth-email">
                  Email
                </label>
                <input
                  ref={emailInputRef}
                  id="auth-email"
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="auth-password">
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    authView === 'sign-in' ? 'current-password' : 'new-password'
                  }
                  minLength={6}
                  required
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.actions}>
                <Button variant="secondary" type="button" onClick={closeAuthModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !email.trim() || !password}
                >
                  {authView === 'sign-in' ? 'Sign in' : 'Create account'}
                </Button>
              </div>
            </form>

            <div className={styles.toggleRow}>
              {authView === 'sign-in' ? (
                <>
                  Don&rsquo;t have an account?
                  <button
                    type="button"
                    className={styles.toggleLink}
                    onClick={() => setAuthView('sign-up')}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?
                  <button
                    type="button"
                    className={styles.toggleLink}
                    onClick={() => setAuthView('sign-in')}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
