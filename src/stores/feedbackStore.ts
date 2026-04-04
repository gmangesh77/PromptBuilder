import { create } from 'zustand';

export type Rating = 'up' | 'down';

interface FeedbackState {
  rating: Rating | null;
  comment: string;
  isSubmitted: boolean;
  isSubmitting: boolean;

  setRating: (rating: Rating) => void;
  setComment: (comment: string) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitted: () => void;
  resetFeedback: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  rating: null,
  comment: '',
  isSubmitted: false,
  isSubmitting: false,

  setRating: (rating) => set({ rating }),
  setComment: (comment) => set({ comment }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSubmitted: () => set({ isSubmitted: true, isSubmitting: false }),
  resetFeedback: () =>
    set({
      rating: null,
      comment: '',
      isSubmitted: false,
      isSubmitting: false,
    }),
}));

export const useRating = () => useFeedbackStore((s) => s.rating);
export const useIsSubmitted = () => useFeedbackStore((s) => s.isSubmitted);
