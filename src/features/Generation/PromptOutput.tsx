import { useGenerationStore } from '../../stores/generationStore';
import { useClipboard } from '../../hooks/useClipboard';
import styles from './PromptOutput.module.css';

export function PromptOutput() {
  const generatedPrompt = useGenerationStore((s) => s.generatedPrompt);
  const { copy, isCopied } = useClipboard();

  if (!generatedPrompt) return null;

  return (
    <section className={styles.container} aria-label="Generated prompt">
      <div className={styles.header}>
        <h2 className={styles.heading}>Your Optimized Prompt</h2>
        <button
          type="button"
          className={styles.copyButton}
          onClick={() => copy(generatedPrompt)}
          aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
        >
          {isCopied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
      <div className={styles.prompt}>{generatedPrompt}</div>
    </section>
  );
}
