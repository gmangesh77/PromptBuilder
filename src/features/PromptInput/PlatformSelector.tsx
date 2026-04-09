import type { Platform } from '../../types/platform';
import { PLATFORMS } from '../../constants/platforms';
import styles from './PlatformSelector.module.css';

interface PlatformSelectorProps {
  value: Platform;
  onChange: (platform: Platform) => void;
  disabled?: boolean;
  className?: string;
}

export function PlatformSelector({
  value,
  onChange,
  disabled = false,
  className,
}: PlatformSelectorProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <span className={styles.label}>For</span>
      <div className={styles.chips} role="radiogroup" aria-label="Target platform">
        {PLATFORMS.map(({ label, value: val }) => (
          <button
            key={val}
            type="button"
            role="radio"
            aria-checked={value === val}
            className={`${styles.chip} ${value === val ? styles.chipActive : ''}`}
            onClick={() => onChange(val as Platform)}
            disabled={disabled}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
