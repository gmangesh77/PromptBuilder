import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { StreamingAnalysis } from './StreamingAnalysis';
import { useGenerationStore } from '../../stores/generationStore';

describe('StreamingAnalysis', () => {
  beforeEach(() => {
    useGenerationStore.getState().resetGeneration();
  });

  it('renders nothing when not streaming and no content', () => {
    const { container } = render(<StreamingAnalysis />);
    expect(container.firstChild).toBeNull();
  });

  it('renders streamed content during streaming', () => {
    useGenerationStore.setState({
      isStreaming: true,
      streamedContent: 'Analyzing your request...',
    });
    render(<StreamingAnalysis />);
    expect(screen.getByText(/Analyzing your request/)).toBeInTheDocument();
  });

  it('shows pulsing cursor while streaming', () => {
    useGenerationStore.setState({
      isStreaming: true,
      streamedContent: 'Working...',
    });
    render(<StreamingAnalysis />);
    const cursor = document.querySelector('[aria-hidden="true"]');
    expect(cursor).toBeInTheDocument();
  });

  it('hides cursor when streaming stops', () => {
    useGenerationStore.setState({
      isStreaming: false,
      streamedContent: 'Done content',
    });
    render(<StreamingAnalysis />);
    const cursor = document.querySelector('[aria-hidden="true"]');
    expect(cursor).toBeNull();
  });

  it('has aria-live for screen reader updates', () => {
    useGenerationStore.setState({
      isStreaming: true,
      streamedContent: 'test',
    });
    render(<StreamingAnalysis />);
    expect(screen.getByLabelText('Analysis')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });
});
