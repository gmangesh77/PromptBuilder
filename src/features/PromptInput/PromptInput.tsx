import type { KeyboardEvent } from 'react';
import { useEffect, useRef } from 'react';
import styles from './PromptInput.module.css';

const MAX_LENGTH = 1000;

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  maxLength = MAX_LENGTH,
  disabled = false,
  className,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputId = 'prompt-input';
  const counterId = 'prompt-input-counter';
  const threshold = Math.floor(maxLength * 0.8);
  const showCounter = value.length >= threshold;
  const atLimit = value.length >= maxLength;

  useEffect(() => {
    const isDesktop = window.matchMedia('(pointer: fine)').matches;
    if (isDesktop && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <label htmlFor={inputId} className={styles.label}>
        What do you need?
      </label>
      <textarea
        ref={textareaRef}
        id={inputId}
        className={styles.textarea}
        placeholder="Describe what you need in your own words"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={maxLength}
        disabled={disabled}
        aria-describedby={showCounter ? counterId : undefined}
        rows={5}
      />
      {showCounter && (
        <p
          id={counterId}
          className={`${styles.counter} ${atLimit ? styles.counterLimit : ''}`}
          aria-live="polite"
        >
          {value.length} / {maxLength}
        </p>
      )}
    </div>
  );
}
