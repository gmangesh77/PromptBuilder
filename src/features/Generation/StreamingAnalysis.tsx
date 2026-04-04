import { useGenerationStore } from '../../stores/generationStore';
import styles from './StreamingAnalysis.module.css';

const PROMPT_DELIMITER = '---PROMPT---';

export function StreamingAnalysis() {
  const isStreaming = useGenerationStore((s) => s.isStreaming);
  const streamedContent = useGenerationStore((s) => s.streamedContent);

  if (!isStreaming && !streamedContent) return null;

  // Show only analysis portion (before delimiter)
  const delimiterIndex = streamedContent.indexOf(PROMPT_DELIMITER);
  const analysisText =
    delimiterIndex !== -1
      ? streamedContent.slice(0, delimiterIndex).trim()
      : streamedContent;

  if (!analysisText && !isStreaming) return null;

  return (
    <section className={styles.container} aria-label="Analysis" aria-live="polite">
      <p className={styles.content}>
        {analysisText}
        {isStreaming && <span className={styles.cursor} aria-hidden="true" />}
      </p>
    </section>
  );
}
