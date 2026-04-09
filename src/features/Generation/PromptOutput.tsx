import { useGenerationStore } from '../../stores/generationStore';
import { useClipboard } from '../../hooks/useClipboard';
import styles from './PromptOutput.module.css';

export function PromptOutput() {
  const generatedPrompt = useGenerationStore((s) => s.generatedPrompt);
  const { copy, isCopied } = useClipboard();

  if (!generatedPrompt) return null;

  return (
    <section className={styles.container} aria-label="Generated prompt">
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowRule} />
          <span>02 / The Prompt</span>
        </div>
        <h2 className={styles.heading}>Ready to paste.</h2>
      </header>
      <pre className={styles.prompt}>{generatedPrompt}</pre>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.copyButton}
          onClick={() => copy(generatedPrompt)}
          aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
        >
          {isCopied ? '✓ Copied' : 'Copy to clipboard →'}
        </button>
      </div>
    </section>
  );
}
