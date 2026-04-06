import { useState, useRef, useEffect } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import type { ModelTier, Provider } from '../../stores/settingsStore';
import { Button } from '../../components';
import styles from './Settings.module.css';

const PROVIDERS: { id: Provider; label: string; placeholder: string }[] = [
  { id: 'openai', label: 'OpenAI', placeholder: 'sk-...' },
  { id: 'anthropic', label: 'Anthropic', placeholder: 'sk-ant-...' },
  { id: 'google', label: 'Google', placeholder: 'AIza...' },
];

const MODEL_TIERS_BY_PROVIDER: Record<Provider, { tier: ModelTier; label: string; model: string; description: string }[]> = {
  openai: [
    { tier: 'fast', label: 'Fast', model: 'gpt-4.1-mini', description: 'Fastest, good for simple tasks' },
    { tier: 'quality', label: 'Quality', model: 'gpt-4.1', description: 'Balanced speed and quality' },
    { tier: 'best', label: 'Best', model: 'gpt-4o', description: 'Best quality, slower' },
  ],
  anthropic: [
    { tier: 'fast', label: 'Fast', model: 'claude-haiku', description: 'Fastest, cost-effective' },
    { tier: 'quality', label: 'Quality', model: 'claude-sonnet', description: 'Balanced, great reasoning' },
    { tier: 'best', label: 'Best', model: 'claude-opus', description: 'Most capable, slower' },
  ],
  google: [
    { tier: 'fast', label: 'Fast', model: 'gemini-flash-lite', description: 'Fastest, lightweight' },
    { tier: 'quality', label: 'Quality', model: 'gemini-flash', description: 'Balanced, versatile' },
    { tier: 'best', label: 'Best', model: 'gemini-pro', description: 'Most capable, slower' },
  ],
};

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
  const modelTier = useSettingsStore((s) => s.modelTier);
  const setModelTier = useSettingsStore((s) => s.setModelTier);
  const provider = useSettingsStore((s) => s.provider);
  const setProvider = useSettingsStore((s) => s.setProvider);

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

  const currentProvider = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0];
  const maskedKey = apiKey ? `...${apiKey.slice(-4)}` : '';

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
          <label className={styles.label}>AI Provider</label>
          <p className={styles.hint}>
            Choose which AI provider to use. Bring your own API key.
          </p>
          <div className={styles.tierOptions}>
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                className={`${styles.providerChip} ${provider === p.id ? styles.providerChipActive : ''}`}
                onClick={() => setProvider(p.id)}
                type="button"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label htmlFor="api-key-input" className={styles.label}>
            {currentProvider.label} API Key
          </label>
          <p className={styles.hint}>
            Your key is stored locally in your browser and sent directly to {currentProvider.label}. It is never stored on our servers.
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
                placeholder={currentProvider.placeholder}
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

        <div className={styles.section}>
          <label className={styles.label}>Model Quality</label>
          <p className={styles.hint}>
            Choose based on your speed vs quality needs.
          </p>
          <div className={styles.tierOptions}>
            {MODEL_TIERS_BY_PROVIDER[provider].map(({ tier, label, model, description }) => (
              <button
                key={tier}
                className={`${styles.tierChip} ${modelTier === tier ? styles.tierChipActive : ''}`}
                onClick={() => setModelTier(tier)}
                type="button"
              >
                <span className={styles.tierLabel}>{label}</span>
                <span className={styles.tierModel}>{model}</span>
                <span className={styles.tierDesc}>{description}</span>
              </button>
            ))}
          </div>
          <p className={styles.tierCost}>
            Your key, your cost — higher quality models use more tokens.
          </p>
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
