import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with default aria-label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading…');
  });

  it('renders with custom aria-label', () => {
    render(<Spinner label="Generating prompt" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Generating prompt');
  });
});
