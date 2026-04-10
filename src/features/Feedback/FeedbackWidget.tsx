import { useFeedbackStore, FEEDBACK_CATEGORIES } from '../../stores/feedbackStore';
import type { Rating, FeedbackCategory } from '../../stores/feedbackStore';
import { useAuthStore } from '../../stores/authStore';
import { usePreferencesStore, AVAILABLE_DOMAINS } from '../../stores/preferencesStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import styles from './FeedbackWidget.module.css';

interface FeedbackWidgetProps {
  platform: string;
}

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  accuracy: 'Accuracy',
  usefulness: 'Usefulness',
  clarity: 'Clarity',
  tone: 'Tone',
};

export function FeedbackWidget({ platform }: FeedbackWidgetProps) {
  const rating = useFeedbackStore((s) => s.rating);
  const stars = useFeedbackStore((s) => s.stars);
  const categories = useFeedbackStore((s) => s.categories);
  const domain = useFeedbackStore((s) => s.domain);
  const comment = useFeedbackStore((s) => s.comment);
  const isSubmitted = useFeedbackStore((s) => s.isSubmitted);
  const isSubmitting = useFeedbackStore((s) => s.isSubmitting);
  const setRating = useFeedbackStore((s) => s.setRating);
  const setStars = useFeedbackStore((s) => s.setStars);
  const toggleCategory = useFeedbackStore((s) => s.toggleCategory);
  const setDomain = useFeedbackStore((s) => s.setDomain);
  const setComment = useFeedbackStore((s) => s.setComment);
  const setSubmitting = useFeedbackStore((s) => s.setSubmitting);
  const setSubmitted = useFeedbackStore((s) => s.setSubmitted);

  // Surface the user's favorite domains first if they have any, otherwise
  // fall back to the full list so first-time users still have choices.
  const favoriteDomains = usePreferencesStore((s) => s.favoriteDomains);
  const domainOptions: readonly string[] =
    favoriteDomains.length > 0 ? favoriteDomains : AVAILABLE_DOMAINS;

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      const authUser = useAuthStore.getState().user;
      const trimmedComment = comment.trim() || null;

      if (authUser && isSupabaseConfigured) {
        // Signed in — write directly to Supabase (RLS restricts to user).
        const { error } = await supabase.from('feedback').insert({
          user_id: authUser.id,
          rating,
          comment: trimmedComment,
          platform,
          stars,
          categories,
          domain,
        });
        if (error) {
          console.error('[feedback] supabase insert', error);
        }
      } else {
        // Anonymous — fall back to the existing logging endpoint.
        const body: Record<string, unknown> = { rating, platform };
        if (trimmedComment) body.comment = trimmedComment;
        if (stars != null) body.stars = stars;
        if (categories.length > 0) body.categories = categories;
        if (domain) body.domain = domain;
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
          <fieldset className={styles.starFieldset}>
            <legend className={styles.starLegend}>Rate it</legend>
            <div
              className={styles.starRow}
              role="radiogroup"
              aria-label="Star rating"
            >
              {[1, 2, 3, 4, 5].map((value) => {
                const selected = stars !== null && value <= stars;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.starButton} ${selected ? styles.starSelected : ''}`}
                    onClick={() => setStars(stars === value ? null : value)}
                    aria-label={`${value} star${value === 1 ? '' : 's'}`}
                    aria-pressed={stars === value}
                    disabled={isSubmitting}
                  >
                    {selected ? '\u2605' : '\u2606'}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className={styles.categoryFieldset}>
            <legend className={styles.categoryLegend}>
              What about it? (optional)
            </legend>
            <div className={styles.chipRow}>
              {FEEDBACK_CATEGORIES.map((cat) => {
                const active = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                    onClick={() => toggleCategory(cat)}
                    aria-pressed={active}
                    disabled={isSubmitting}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className={styles.categoryFieldset}>
            <legend className={styles.categoryLegend}>
              Domain (optional)
            </legend>
            <div className={styles.chipRow}>
              {domainOptions.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`${styles.chip} ${domain === d ? styles.chipActive : ''}`}
                  onClick={() => setDomain(domain === d ? null : d)}
                  aria-pressed={domain === d}
                  disabled={isSubmitting}
                >
                  {d}
                </button>
              ))}
            </div>
          </fieldset>

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
