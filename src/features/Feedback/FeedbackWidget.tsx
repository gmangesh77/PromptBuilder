import { useFeedbackStore } from '../../stores/feedbackStore';
import { useAuthStore } from '../../stores/authStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Rating } from '../../stores/feedbackStore';
import styles from './FeedbackWidget.module.css';

interface FeedbackWidgetProps {
  platform: string;
}

export function FeedbackWidget({ platform }: FeedbackWidgetProps) {
  const rating = useFeedbackStore((s) => s.rating);
  const comment = useFeedbackStore((s) => s.comment);
  const isSubmitted = useFeedbackStore((s) => s.isSubmitted);
  const isSubmitting = useFeedbackStore((s) => s.isSubmitting);
  const setRating = useFeedbackStore((s) => s.setRating);
  const setComment = useFeedbackStore((s) => s.setComment);
  const setSubmitting = useFeedbackStore((s) => s.setSubmitting);
  const setSubmitted = useFeedbackStore((s) => s.setSubmitted);

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      const authUser = useAuthStore.getState().user;

      if (authUser && isSupabaseConfigured) {
        // Signed in — write directly to Supabase (RLS restricts to user).
        const { error } = await supabase.from('feedback').insert({
          user_id: authUser.id,
          rating,
          comment: comment.trim() || null,
          platform,
        });
        if (error) {
          console.error('[feedback] supabase insert', error);
        }
      } else {
        // Anonymous — fall back to the existing logging endpoint.
        const body: Record<string, unknown> = { rating, platform };
        if (comment.trim()) body.comment = comment.trim();
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
    } catch {
      // Silently fail — feedback is non-critical
    }
    setSubmitted();
  };

  if (isSubmitted) {
    return (
      <div className={styles.container} role="status">
        <p className={styles.thanks}>Thank you for your feedback!</p>
      </div>
    );
  }

  const thumbButton = (value: Rating, label: string, emoji: string) => (
    <button
      type="button"
      className={`${styles.thumbButton} ${rating === value ? styles.selected : ''}`}
      onClick={() => setRating(value)}
      aria-label={label}
      aria-pressed={rating === value}
      disabled={isSubmitting}
    >
      {emoji}
    </button>
  );

  return (
    <div className={styles.container}>
      <p className={styles.label}>Was this prompt helpful?</p>
      <div className={styles.buttons}>
        {thumbButton('up', 'Thumbs up', '\u{1F44D}')}
        {thumbButton('down', 'Thumbs down', '\u{1F44E}')}
      </div>
      {rating && (
        <>
          <label htmlFor="feedback-comment" className={styles.commentLabel}>
            Tell us more (optional)
          </label>
          <textarea
            id="feedback-comment"
            className={styles.commentInput}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What could be improved?"
            maxLength={500}
            rows={3}
            disabled={isSubmitting}
          />
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting…' : 'Submit Feedback'}
          </button>
        </>
      )}
    </div>
  );
}
