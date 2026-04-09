import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PromptOutput } from './PromptOutput';
import { useGenerationStore } from '../../stores/generationStore';

describe('PromptOutput', () => {
  beforeEach(() => {
    useGenerationStore.getState().resetGeneration();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders nothing when no generated prompt', () => {
    const { container } = render(<PromptOutput />);
    expect(container.firstChild).toBeNull();
  });

  it('renders generated prompt when available', () => {
    useGenerationStore.setState({
      generatedPrompt: 'Act as a senior software architect...',
    });
    render(<PromptOutput />);
    expect(
      screen.getByText('Act as a senior software architect...'),
    ).toBeInTheDocument();
  });

  it('renders heading', () => {
    useGenerationStore.setState({
      generatedPrompt: 'Test prompt',
    });
    render(<PromptOutput />);
    expect(
      screen.getByRole('heading', { name: 'Ready to paste.' }),
    ).toBeInTheDocument();
  });

  it('has accessible section label', () => {
    useGenerationStore.setState({
      generatedPrompt: 'Test prompt',
    });
    render(<PromptOutput />);
    expect(screen.getByLabelText('Generated prompt')).toBeInTheDocument();
  });

  it('renders copy button', () => {
    useGenerationStore.setState({
      generatedPrompt: 'Test prompt',
    });
    render(<PromptOutput />);
    expect(
      screen.getByRole('button', { name: 'Copy to clipboard' }),
    ).toBeInTheDocument();
  });

  it('copy button is keyboard accessible', () => {
    useGenerationStore.setState({
      generatedPrompt: 'Test prompt',
    });
    render(<PromptOutput />);
    const button = screen.getByRole('button', { name: 'Copy to clipboard' });
    expect(button.tagName).toBe('BUTTON');
  });

  it('shows Copied! feedback after clicking copy', async () => {
    const user = userEvent.setup();
    useGenerationStore.setState({
      generatedPrompt: 'Test prompt to copy',
    });
    render(<PromptOutput />);
    await user.click(screen.getByRole('button', { name: 'Copy to clipboard' }));
    expect(screen.getByText('✓ Copied')).toBeInTheDocument();
  });
});
