import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { usePromptStore } from './stores/promptStore';
import { useGenerationStore } from './stores/generationStore';

describe('App', () => {
  beforeEach(() => {
    usePromptStore.setState({ userInput: '', selectedPlatform: 'chatgpt' });
    useGenerationStore.getState().resetGeneration();
  });

  it('renders the PromptBuilder heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('PromptBuilder');
  });

  it('renders semantic header landmark', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders semantic main landmark', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders skip-to-content link', () => {
    render(<App />);
    const skipLink = screen.getByText('Skip to content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders Generate button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument();
  });

  it('disables Generate button when input is less than 10 chars', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Generate' })).toBeDisabled();
  });

  it('enables Generate button when input is at least 10 chars', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('What do you need?'), 'Hello world test');
    expect(screen.getByRole('button', { name: 'Generate' })).toBeEnabled();
  });

  it('follows correct tab order: textarea -> selector -> button', () => {
    render(<App />);
    const textarea = screen.getByLabelText('What do you need?');
    const selector = screen.getByLabelText('Target platform');
    const button = screen.getByRole('button', { name: 'Generate' });

    // Verify DOM order (natural tab order)
    const main = screen.getByRole('main');
    const focusables = main.querySelectorAll('textarea, select, button');
    expect(focusables[0]).toBe(textarea);
    expect(focusables[1]).toBe(selector);
    expect(focusables[2]).toBe(button);
  });

  it('shows Generating state when streaming', () => {
    usePromptStore.setState({ userInput: 'This is a test input for generation' });
    useGenerationStore.setState({ isStreaming: true });
    render(<App />);
    expect(screen.getByText('Generating…')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
