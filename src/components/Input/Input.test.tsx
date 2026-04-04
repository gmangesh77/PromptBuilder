import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders with associated label', () => {
    render(<Input label="Your prompt" />);
    expect(screen.getByLabelText('Your prompt')).toBeInTheDocument();
  });

  it('displays error message when error prop is set', () => {
    render(<Input label="Your prompt" error="Too short" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Too short');
    expect(screen.getByLabelText('Your prompt')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not display error message when no error', () => {
    render(<Input label="Your prompt" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
