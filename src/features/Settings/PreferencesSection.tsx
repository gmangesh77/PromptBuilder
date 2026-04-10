import {
  usePreferencesStore,
  AVAILABLE_DOMAINS,
  INSTRUCTION_SUFFIX_MAX_LENGTH,
} from '../../stores/preferencesStore';
import type { ClarificationMode } from '../../stores/preferencesStore';
import { PLATFORMS } from '../../constants/platforms';
import styles from './Settings.module.css';

const CLARIFICATION_MODES: {
  value: ClarificationMode;
  label: string;
  description: string;
}[] = [
  {
    value: 'auto',
    label: 'Auto',
    description: "Let the model decide when your request is ambiguous.",
  },
  {
    value: 'always',
    label: 'Always',
    description: 'Always ask clarifying questions before generating.',
  },
  {
    value: 'never',
    label: 'Never',
    description: 'Skip questions and generate directly every time.',
  },
];

export function PreferencesSection() {
  const preferredPlatform = usePreferencesStore((s) => s.preferredPlatform);
  const setPreferredPlatform = usePreferencesStore(
    (s) => s.setPreferredPlatform,
  );
  const defaultInstructionSuffix = usePreferencesStore(
    (s) => s.defaultInstructionSuffix,
  );
  const setDefaultInstructionSuffix = usePreferencesStore(
    (s) => s.setDefaultInstructionSuffix,
  );
  const favoriteDomains = usePreferencesStore((s) => s.favoriteDomains);
  const toggleFavoriteDomain = usePreferencesStore(
    (s) => s.toggleFavoriteDomain,
  );
  const clarificationMode = usePreferencesStore((s) => s.clarificationMode);
  const setClarificationMode = usePreferencesStore(
    (s) => s.setClarificationMode,
  );

  return (
    <>
      <hr className={styles.modalDivider} />

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Preferred Platform</span>
        <p className={styles.hint}>
          Your default target AI platform. Remembered across sessions.
        </p>
        <div className={styles.chipRow}>
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`${styles.chip} ${
                preferredPlatform === p.value ? styles.chipActive : ''
              }`}
              onClick={() => setPreferredPlatform(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <hr className={styles.modalDivider} />

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Default Instructions</span>
        <p className={styles.hint}>
          Appended to every prompt you send (e.g. &ldquo;Use British
          English&rdquo; or &ldquo;Keep it concise&rdquo;).
        </p>
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.input}
            placeholder="Use a professional tone."
            value={defaultInstructionSuffix}
            onChange={(e) => setDefaultInstructionSuffix(e.target.value)}
            maxLength={INSTRUCTION_SUFFIX_MAX_LENGTH}
            aria-label="Default instruction suffix"
          />
        </div>
      </div>

      <hr className={styles.modalDivider} />

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Favorite Domains</span>
        <p className={styles.hint}>
          Quick-pick tags shown above the input. Toggle the ones you use most.
        </p>
        <div className={styles.chipRow}>
          {AVAILABLE_DOMAINS.map((domain) => {
            const active = favoriteDomains.includes(domain);
            return (
              <button
                key={domain}
                type="button"
                className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                onClick={() => toggleFavoriteDomain(domain)}
                aria-pressed={active}
              >
                {domain}
              </button>
            );
          })}
        </div>
      </div>

      <hr className={styles.modalDivider} />

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Clarifying Questions</span>
        <p className={styles.hint}>
          Control whether the model pauses to ask before generating.
        </p>
        <div className={styles.tierRow}>
          {CLARIFICATION_MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              className={`${styles.tierChip} ${
                clarificationMode === m.value ? styles.tierChipActive : ''
              }`}
              onClick={() => setClarificationMode(m.value)}
            >
              <span className={styles.tierLabel}>{m.label}</span>
              <span className={styles.tierDesc}>{m.description}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
