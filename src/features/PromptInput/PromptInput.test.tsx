import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PromptInput } from './PromptInput';

describe('PromptInput', () => {
  it('renders textarea with placeholder and associated label', () => {
    render(<PromptInput value="" onChange={() => {}} />);
    const textarea = screen.getByLabelText('What do you need?');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute(
      'placeholder',
      'Describe what you need in your own words',
    );
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PromptInput value="" onChange={handleChange} />);
    await user.type(screen.getByLabelText('What do you need?'), 'a');
    expect(handleChange).toHaveBeenCalledWith('a');
  });

  it('does not show character counter when under threshold', () => {
    render(<PromptInput value={'x'.repeat(799)} onChange={() => {}} />);
    expect(screen.queryByText(/799/)).not.toBeInTheDocument();
  });

  it('shows character counter when at threshold (800 chars)', () => {
    render(<PromptInput value={'x'.repeat(800)} onChange={() => {}} />);
    expect(screen.getByText('800 / 1000')).toBeInTheDocument();
  });

  it('shows character counter when above threshold', () => {
    render(<PromptInput value={'x'.repeat(950)} onChange={() => {}} />);
    expect(screen.getByText('950 / 1000')).toBeInTheDocument();
  });

  it('applies maxLength attribute to textarea', () => {
    render(<PromptInput value="" onChange={() => {}} />);
    expect(screen.getByLabelText('What do you need?')).toHaveAttribute(
      'maxLength',
      '1000',
    );
  });

  it('supports custom maxLength', () => {
    render(<PromptInput value="" onChange={() => {}} maxLength={500} />);
    expect(screen.getByLabelText('What do you need?')).toHaveAttribute(
      'maxLength',
      '500',
    );
  });

  it('has aria-live on counter for screen reader announcements', () => {
    render(<PromptInput value={'x'.repeat(900)} onChange={() => {}} />);
    const counter = screen.getByText('900 / 1000');
    expect(counter).toHaveAttribute('aria-live', 'polite');
  });
});
