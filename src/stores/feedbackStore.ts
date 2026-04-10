import { create } from 'zustand';

export type Rating = 'up' | 'down';

export const FEEDBACK_CATEGORIES = [
  'accuracy',
  'usefulness',
  'clarity',
  'tone',
] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

interface FeedbackState {
  rating: Rating | null;
  stars: number | null;
  categories: FeedbackCategory[];
  domain: string | null;
  comment: string;
  isSubmitted: boolean;
  isSubmitting: boolean;

  setRating: (rating: Rating) => void;
  setStars: (stars: number | null) => void;
  toggleCategory: (category: FeedbackCategory) => void;
  setDomain: (domain: string | null) => void;
  setComment: (comment: string) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitted: () => void;
  resetFeedback: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  rating: null,
  stars: null,
  categories: [],
  domain: null,
  comment: '',
  isSubmitted: false,
  isSubmitting: false,

  setRating: (rating) => set({ rating }),
  setStars: (stars) => set({ stars }),
  toggleCategory: (category) => {
    const current = get().categories;
    set({
      categories: current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category],
    });
  },
  setDomain: (domain) => set({ domain }),
  setComment: (comment) => set({ comment }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSubmitted: () => set({ isSubmitted: true, isSubmitting: false }),
  resetFeedback: () =>
    set({
      rating: null,
      stars: null,
      categories: [],
      domain: null,
      comment: '',
      isSubmitted: false,
      isSubmitting: false,
    }),
}));

export const useRating = () => useFeedbackStore((s) => s.rating);
export const useIsSubmitted = () => useFeedbackStore((s) => s.isSubmitted);
