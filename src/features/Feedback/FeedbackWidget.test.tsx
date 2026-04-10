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

  it('renders star selector, category chips and domain chips after rating', async () => {
    const user = userEvent.setup();
    render(<FeedbackWidget platform="chatgpt" />);
    await user.click(screen.getByRole('button', { name: 'Thumbs up' }));

    // 5 stars
    expect(screen.getByRole('button', { name: '1 star' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5 stars' })).toBeInTheDocument();

    // 4 category chips
    expect(screen.getByRole('button', { name: 'Accuracy' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Usefulness' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clarity' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tone' })).toBeInTheDocument();

    // Domain chip row (falls back to the 8 AVAILABLE_DOMAINS when the user
    // has no favorites set).
    expect(screen.getByRole('button', { name: 'Technical' })).toBeInTheDocument();
  });

  it('sends stars, categories, and domain to /api/feedback', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true })),
    );
    render(<FeedbackWidget platform="claude" />);
    await user.click(screen.getByRole('button', { name: 'Thumbs up' }));
    await user.click(screen.getByRole('button', { name: '4 stars' }));
    await user.click(screen.getByRole('button', { name: 'Accuracy' }));
    await user.click(screen.getByRole('button', { name: 'Clarity' }));
    await user.click(screen.getByRole('button', { name: 'Technical' }));
    await user.click(screen.getByText('Submit Feedback'));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [, init] = fetchSpy.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toEqual({
      rating: 'up',
      platform: 'claude',
      stars: 4,
      categories: ['accuracy', 'clarity'],
      domain: 'Technical',
    });
  });
});
