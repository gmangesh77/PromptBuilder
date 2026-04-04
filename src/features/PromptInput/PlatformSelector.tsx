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
      <label htmlFor="platform-selector" className={styles.label}>
        Target platform
      </label>
      <select
        id="platform-selector"
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as Platform)}
        disabled={disabled}
      >
        {PLATFORMS.map(({ label, value: val }) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
