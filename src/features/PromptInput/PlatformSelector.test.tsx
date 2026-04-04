import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PlatformSelector } from './PlatformSelector';

describe('PlatformSelector', () => {
  it('renders all 5 platform options', () => {
    render(<PlatformSelector value="chatgpt" onChange={() => {}} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
    expect(options.map((o) => o.textContent)).toEqual([
      'ChatGPT',
      'Claude',
      'Gemini',
      'Grok',
      'Perplexity',
    ]);
  });

  it('has ChatGPT as the default selected value', () => {
    render(<PlatformSelector value="chatgpt" onChange={() => {}} />);
    expect(screen.getByLabelText('Target platform')).toHaveValue('chatgpt');
  });

  it('calls onChange when a different platform is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PlatformSelector value="chatgpt" onChange={handleChange} />);
    await user.selectOptions(screen.getByLabelText('Target platform'), 'claude');
    expect(handleChange).toHaveBeenCalledWith('claude');
  });

  it('has an associated label for accessibility', () => {
    render(<PlatformSelector value="chatgpt" onChange={() => {}} />);
    expect(screen.getByLabelText('Target platform')).toBeInTheDocument();
  });
});
