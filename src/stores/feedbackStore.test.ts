import { describe, it, expect, beforeEach } from 'vitest';
import { useFeedbackStore } from './feedbackStore';

describe('feedbackStore', () => {
  beforeEach(() => {
    useFeedbackStore.getState().resetFeedback();
  });

  it('has correct initial state', () => {
    const state = useFeedbackStore.getState();
    expect(state.rating).toBeNull();
    expect(state.stars).toBeNull();
    expect(state.categories).toEqual([]);
    expect(state.domain).toBeNull();
    expect(state.comment).toBe('');
    expect(state.isSubmitted).toBe(false);
    expect(state.isSubmitting).toBe(false);
  });

  it('setRating stores rating', () => {
    useFeedbackStore.getState().setRating('up');
    expect(useFeedbackStore.getState().rating).toBe('up');
  });

  it('setStars stores a 1-5 rating', () => {
    useFeedbackStore.getState().setStars(4);
    expect(useFeedbackStore.getState().stars).toBe(4);
    useFeedbackStore.getState().setStars(null);
    expect(useFeedbackStore.getState().stars).toBeNull();
  });

  it('toggleCategory adds and removes categories', () => {
    const s = useFeedbackStore.getState();
    s.toggleCategory('accuracy');
    expect(useFeedbackStore.getState().categories).toEqual(['accuracy']);
    s.toggleCategory('clarity');
    expect(useFeedbackStore.getState().categories).toEqual([
      'accuracy',
      'clarity',
    ]);
    s.toggleCategory('accuracy');
    expect(useFeedbackStore.getState().categories).toEqual(['clarity']);
  });

  it('setDomain stores the selected domain', () => {
    useFeedbackStore.getState().setDomain('Technical');
    expect(useFeedbackStore.getState().domain).toBe('Technical');
    useFeedbackStore.getState().setDomain(null);
    expect(useFeedbackStore.getState().domain).toBeNull();
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

  it('resetFeedback clears all state including new fields', () => {
    const s = useFeedbackStore.getState();
    s.setRating('down');
    s.setStars(2);
    s.toggleCategory('tone');
    s.setDomain('Sales');
    s.setComment('Not helpful');
    s.setSubmitted();
    s.resetFeedback();
    const state = useFeedbackStore.getState();
    expect(state.rating).toBeNull();
    expect(state.stars).toBeNull();
    expect(state.categories).toEqual([]);
    expect(state.domain).toBeNull();
    expect(state.comment).toBe('');
    expect(state.isSubmitted).toBe(false);
    expect(state.isSubmitting).toBe(false);
  });
});
