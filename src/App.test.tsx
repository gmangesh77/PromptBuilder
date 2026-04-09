import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { usePromptStore } from './stores/promptStore';
import { useGenerationStore } from './stores/generationStore';
import { useNavigationStore } from './stores/navigationStore';

describe('App', () => {
  beforeEach(() => {
    usePromptStore.setState({ userInput: '', selectedPlatform: 'chatgpt' });
    useGenerationStore.getState().resetGeneration();
    useNavigationStore.setState({ currentPage: 'generate', sidebarOpen: false });
  });

  it('renders the compose hero heading', () => {
    render(<App />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.some((h) => h.textContent?.includes('Craft prompts'))).toBe(true);
  });

  it('renders semantic header landmark', () => {
    render(<App />);
    // Multiple <header> elements exist (app shell + compose section) —
    // both register as banners in testing-library's implicit role resolution.
    expect(screen.getAllByRole('banner').length).toBeGreaterThanOrEqual(1);
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
    expect(screen.getByRole('button', { name: /generate prompt/i })).toBeInTheDocument();
  });

  it('disables Generate button when input is less than 10 chars', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /generate prompt/i })).toBeDisabled();
  });

  it('enables Generate button when input is at least 10 chars', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('What do you need?'), 'Hello world test');
    expect(screen.getByRole('button', { name: /generate prompt/i })).toBeEnabled();
  });

  it('follows correct tab order: textarea -> first platform chip -> generate button', () => {
    render(<App />);
    const textarea = screen.getByLabelText('What do you need?');
    const firstPlatformChip = screen.getByRole('radio', { name: 'ChatGPT' });
    const generateButton = screen.getByRole('button', { name: /generate prompt/i });

    // Verify DOM order (natural tab order)
    const main = screen.getByRole('main');
    const allButtons = Array.from(main.querySelectorAll('textarea, button'));
    const textareaIdx = allButtons.indexOf(textarea);
    const firstChipIdx = allButtons.indexOf(firstPlatformChip);
    const generateIdx = allButtons.indexOf(generateButton);

    expect(textareaIdx).toBeGreaterThanOrEqual(0);
    expect(firstChipIdx).toBeGreaterThan(textareaIdx);
    expect(generateIdx).toBeGreaterThan(firstChipIdx);
  });

  it('shows Generating state when streaming', () => {
    usePromptStore.setState({ userInput: 'This is a test input for generation' });
    useGenerationStore.setState({ isStreaming: true });
    render(<App />);
    expect(screen.getByText('Generating…')).toBeInTheDocument();
    const generateButton = screen.getByRole('button', { name: /generating/i });
    expect(generateButton).toBeDisabled();
  });
});
