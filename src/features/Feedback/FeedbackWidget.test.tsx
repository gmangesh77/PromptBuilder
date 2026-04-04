import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FeedbackWidget } from './FeedbackWidget';
import { useFeedbackStore } from '../../stores/feedbackStore';

describe('FeedbackWidget', () => {
  beforeEach(() => {
    useFeedbackStore.getState().resetFeedback();
    vi.restoreAllMocks();
  });

  it('renders thumbs up and thumbs down buttons', () => {
    render(<FeedbackWidget platform="chatgpt" />);
    expect(
      screen.getByRole('button', { name: 'Thumbs up' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Thumbs down' }),
    ).toBeInTheDocument();
  });

  it('renders "Was this prompt helpful?" label', () => {
    render(<FeedbackWidget platform="chatgpt" />);
    expect(
      screen.getByText('Was this prompt helpful?'),
    ).toBeInTheDocument();
  });

  it('shows comment field after selecting a rating', async () => {
    const user = userEvent.setup();
    render(<FeedbackWidget platform="chatgpt" />);
    expect(screen.queryByLabelText('Tell us more (optional)')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Thumbs up' }));
    expect(
      screen.getByLabelText('Tell us more (optional)'),
    ).toBeInTheDocument();
  });

  it('highlights selected rating with aria-pressed', async () => {
    const user = userEvent.setup();
    render(<FeedbackWidget platform="chatgpt" />);
    const thumbsUp = screen.getByRole('button', { name: 'Thumbs up' });
    expect(thumbsUp).toHaveAttribute('aria-pressed', 'false');
    await user.click(thumbsUp);
    expect(thumbsUp).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows "Thank you" after submitting', async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true })),
    );
    render(<FeedbackWidget platform="chatgpt" />);
    await user.click(screen.getByRole('button', { name: 'Thumbs down' }));
    await user.click(screen.getByText('Submit Feedback'));
    expect(
      await screen.findByText('Thank you for your feedback!'),
    ).toBeInTheDocument();
  });

  it('sends feedback to /api/feedback', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true })),
    );
    render(<FeedbackWidget platform="claude" />);
    await user.click(screen.getByRole('button', { name: 'Thumbs up' }));
    await user.type(
      screen.getByLabelText('Tell us more (optional)'),
      'Very helpful',
    );
    await user.click(screen.getByText('Submit Feedback'));
    expect(fetchSpy).toHaveBeenCalledWith('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: 'up',
        platform: 'claude',
        comment: 'Very helpful',
      }),
    });
  });
});
