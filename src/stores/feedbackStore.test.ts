import { describe, it, expect, beforeEach } from 'vitest';
import { useFeedbackStore } from './feedbackStore';

describe('feedbackStore', () => {
  beforeEach(() => {
    useFeedbackStore.getState().resetFeedback();
  });

  it('has correct initial state', () => {
    const state = useFeedbackStore.getState();
    expect(state.rating).toBeNull();
    expect(state.comment).toBe('');
    expect(state.isSubmitted).toBe(false);
    expect(state.isSubmitting).toBe(false);
  });

  it('setRating stores rating', () => {
    useFeedbackStore.getState().setRating('up');
    expect(useFeedbackStore.getState().rating).toBe('up');
  });

  it('setComment stores comment', () => {
    useFeedbackStore.getState().setComment('Great prompt!');
    expect(useFeedbackStore.getState().comment).toBe('Great prompt!');
  });

  it('setSubmitted marks as submitted', () => {
    useFeedbackStore.getState().setSubmitting(true);
    useFeedbackStore.getState().setSubmitted();
    const state = useFeedbackStore.getState();
    expect(state.isSubmitted).toBe(true);
    expect(state.isSubmitting).toBe(false);
  });

  it('resetFeedback clears all state', () => {
    useFeedbackStore.getState().setRating('down');
    useFeedbackStore.getState().setComment('Not helpful');
    useFeedbackStore.getState().setSubmitted();
    useFeedbackStore.getState().resetFeedback();
    const state = useFeedbackStore.getState();
    expect(state.rating).toBeNull();
    expect(state.comment).toBe('');
    expect(state.isSubmitted).toBe(false);
    expect(state.isSubmitting).toBe(false);
  });
});
