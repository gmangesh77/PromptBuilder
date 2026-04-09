import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PlatformSelector } from './PlatformSelector';

describe('PlatformSelector', () => {
  it('renders all 5 platform options', () => {
    render(<PlatformSelector value="chatgpt" onChange={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(5);
    expect(radios.map((r) => r.textContent)).toEqual([
      'ChatGPT',
      'Claude',
      'Gemini',
      'Grok',
      'Perplexity',
    ]);
  });

  it('has ChatGPT as the default selected value', () => {
    render(<PlatformSelector value="chatgpt" onChange={() => {}} />);
    const chatgpt = screen.getByRole('radio', { name: 'ChatGPT' });
    expect(chatgpt).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when a different platform is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PlatformSelector value="chatgpt" onChange={handleChange} />);
    await user.click(screen.getByRole('radio', { name: 'Claude' }));
    expect(handleChange).toHaveBeenCalledWith('claude');
  });

  it('has an associated label for accessibility', () => {
    render(<PlatformSelector value="chatgpt" onChange={() => {}} />);
    expect(screen.getByRole('radiogroup', { name: 'Target platform' })).toBeInTheDocument();
  });
});
