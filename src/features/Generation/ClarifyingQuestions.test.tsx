import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClarifyingQuestions } from './ClarifyingQuestions';
import { useGenerationStore } from '../../stores/generationStore';

describe('ClarifyingQuestions', () => {
  const mockOnAnswer = vi.fn();
  const mockOnSkip = vi.fn();

  beforeEach(() => {
    useGenerationStore.getState().resetGeneration();
    mockOnAnswer.mockClear();
    mockOnSkip.mockClear();
  });

  it('renders nothing when no questions', () => {
    const { container } = render(
      <ClarifyingQuestions onAnswer={mockOnAnswer} onSkip={mockOnSkip} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders questions and option chips', () => {
    useGenerationStore.setState({
      questions: [
        {
          question: 'What type of presentation?',
          options: ['Sales pitch', 'Technical demo', 'Training'],
        },
      ],
    });
    render(
      <ClarifyingQuestions onAnswer={mockOnAnswer} onSkip={mockOnSkip} />,
    );
    expect(
      screen.getByText('What type of presentation?'),
    ).toBeInTheDocument();
    expect(screen.getByText('Sales pitch')).toBeInTheDocument();
    expect(screen.getByText('Technical demo')).toBeInTheDocument();
    expect(screen.getByText('Training')).toBeInTheDocument();
  });

  it('calls onSkip when Skip is clicked', async () => {
    const user = userEvent.setup();
    useGenerationStore.setState({
      questions: [
        {
          question: 'What scope?',
          options: ['Small', 'Large'],
        },
      ],
    });
    render(
      <ClarifyingQuestions onAnswer={mockOnAnswer} onSkip={mockOnSkip} />,
    );
    await user.click(screen.getByText('Skip'));
    expect(mockOnSkip).toHaveBeenCalledOnce();
  });

  it('Continue is disabled until all questions answered', () => {
    useGenerationStore.setState({
      questions: [
        {
          question: 'What scope?',
          options: ['Small', 'Large'],
        },
      ],
    });
    render(
      <ClarifyingQuestions onAnswer={mockOnAnswer} onSkip={mockOnSkip} />,
    );
    expect(screen.getByText('Continue')).toBeDisabled();
  });

  it('calls onAnswer with selections after answering and clicking Continue', async () => {
    const user = userEvent.setup();
    useGenerationStore.setState({
      questions: [
        {
          question: 'What scope?',
          options: ['Small', 'Large'],
        },
      ],
    });
    render(
      <ClarifyingQuestions onAnswer={mockOnAnswer} onSkip={mockOnSkip} />,
    );
    await user.click(screen.getByText('Large'));
    await user.click(screen.getByText('Continue'));
    expect(mockOnAnswer).toHaveBeenCalledWith({ 0: 'Large' });
  });
});
