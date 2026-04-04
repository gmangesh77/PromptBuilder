import { useState } from 'react';
import { useGenerationStore } from '../../stores/generationStore';
import styles from './ClarifyingQuestions.module.css';

interface ClarifyingQuestionsProps {
  onAnswer: (answers: Record<number, string>) => void;
  onSkip: () => void;
}

export function ClarifyingQuestions({ onAnswer, onSkip }: ClarifyingQuestionsProps) {
  const questions = useGenerationStore((s) => s.questions);
  const [selected, setSelected] = useState<Record<number, string>>({});

  if (questions.length === 0) return null;

  const allAnswered = questions.every((_, i) => selected[i] !== undefined);

  const handleSelect = (questionIndex: number, option: string) => {
    const next = { ...selected, [questionIndex]: option };
    setSelected(next);
  };

  const handleSubmit = () => {
    if (allAnswered) {
      onAnswer(selected);
    }
  };

  return (
    <section className={styles.container} aria-label="Clarifying questions">
      <p className={styles.intro}>
        To generate the best prompt, please answer these quick questions:
      </p>
      {questions.map((q, i) => (
        <div key={i} className={styles.question}>
          <p className={styles.questionText}>{q.question}</p>
          <div className={styles.options} role="radiogroup" aria-label={q.question}>
            {q.options.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.chip} ${selected[i] === option ? styles.chipSelected : ''}`}
                onClick={() => handleSelect(i, option)}
                aria-pressed={selected[i] === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          Continue
        </button>
        <button type="button" className={styles.skipBtn} onClick={onSkip}>
          Skip
        </button>
      </div>
    </section>
  );
}
