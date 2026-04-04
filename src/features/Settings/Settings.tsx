import { useState, useRef, useEffect } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { Button } from '../../components';
import styles from './Settings.module.css';

export function SettingsButton() {
  const openSettings = useSettingsStore((s) => s.openSettings);
  const hasKey = useSettingsStore((s) => !!s.apiKey);

  return (
    <button
      className={styles.gearButton}
      onClick={openSettings}
      aria-label="Settings"
      title="Settings"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M8.325 2.317a1.5 1.5 0 013.35 0l.108.64a1.5 1.5 0 002.004.876l.576-.302a1.5 1.5 0 011.676 2.432l-.468.438a1.5 1.5 0 000 2.198l.468.438a1.5 1.5 0 01-1.676 2.432l-.576-.302a1.5 1.5 0 00-2.004.876l-.108.64a1.5 1.5 0 01-3.35 0l-.108-.64a1.5 1.5 0 00-2.004-.876l-.576.302a1.5 1.5 0 01-1.676-2.432l.468-.438a1.5 1.5 0 000-2.198l-.468-.438a1.5 1.5 0 011.676-2.432l.576.302a1.5 1.5 0 002.004-.876l.108-.64z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {!hasKey && <span className={styles.dot} />}
    </button>
  );
}

export function SettingsModal() {
  const showSettings = useSettingsStore((s) => s.showSettings);
  const closeSettings = useSettingsStore((s) => s.closeSettings);
  const apiKey = useSettingsStore((s) => s.apiKey);
  const setApiKey = useSettingsStore((s) => s.setApiKey);
  const clearApiKey = useSettingsStore((s) => s.clearApiKey);

  const [draft, setDraft] = useState('');
  const [showKey, setShowKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSettings) {
      setDraft(apiKey);
      setShowKey(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showSettings, apiKey]);

  useEffect(() => {
    if (!showSettings) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showSettings, closeSettings]);

  if (!showSettings) return null;

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      setApiKey(trimmed);
    }
    closeSettings();
  };

  const handleClear = () => {
    clearApiKey();
    setDraft('');
  };

  const maskedKey = apiKey ? `sk-...${apiKey.slice(-4)}` : '';

  return (
    <div className={styles.overlay} onClick={closeSettings}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Settings</h2>
          <button className={styles.closeButton} onClick={closeSettings} aria-label="Close">
            &times;
          </button>
        </div>

        <div className={styles.section}>
          <label htmlFor="api-key-input" className={styles.label}>
            OpenAI API Key
          </label>
          <p className={styles.hint}>
            Your key is stored locally in your browser and sent directly to OpenAI. It is never stored on our servers.
          </p>

          {apiKey && !showKey ? (
            <div className={styles.savedKey}>
              <span className={styles.maskedKey}>{maskedKey}</span>
              <button className={styles.linkButton} onClick={() => setShowKey(true)}>
                Change
              </button>
              <button className={styles.linkButton} onClick={handleClear} data-danger>
                Remove
              </button>
            </div>
          ) : (
            <div className={styles.inputRow}>
              <input
                ref={inputRef}
                id="api-key-input"
                type="password"
                className={styles.input}
                placeholder="sk-..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={closeSettings}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!draft.trim() && !apiKey}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
