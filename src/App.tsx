import { useEffect, useRef } from 'react';
import { Toaster } from 'sonner';
import { usePromptStore } from './stores/promptStore';
import { useGenerationStore } from './stores/generationStore';
import { useFeedbackStore } from './stores/feedbackStore';
import { useStream } from './hooks/useStream';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PromptInput, PlatformSelector } from './features/PromptInput';
import {
  StreamingAnalysis,
  PromptOutput,
  ClarifyingQuestions,
} from './features/Generation';
import { FeedbackWidget } from './features/Feedback';
import { SettingsButton, SettingsModal } from './features/Settings';
import { Button, Spinner, ErrorBoundary } from './components';
import type { Platform } from './types';
import styles from './App.module.css';

const MIN_INPUT_LENGTH = 10;
const CACHE_KEY = 'promptbuilder_last_generation';

interface CachedGeneration {
  userInput: string;
  platform: Platform;
  generatedPrompt: string;
}

function App() {
  const userInput = usePromptStore((s) => s.userInput);
  const selectedPlatform = usePromptStore((s) => s.selectedPlatform);
  const setUserInput = usePromptStore((s) => s.setUserInput);
  const setPlatform = usePromptStore((s) => s.setPlatform);
  const isStreaming = useGenerationStore((s) => s.isStreaming);
  const questions = useGenerationStore((s) => s.questions);
  const clearQuestions = useGenerationStore((s) => s.clearQuestions);
  const generatedPrompt = useGenerationStore((s) => s.generatedPrompt);
  const setGeneratedPrompt = useGenerationStore((s) => s.setGeneratedPrompt);
  const resetFeedback = useFeedbackStore((s) => s.resetFeedback);
  const { generate } = useStream();
  const cache = useLocalStorage<CachedGeneration>(CACHE_KEY);
  const restoredRef = useRef(false);

  // Restore cached generation on mount
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const cached = cache.get();
    if (cached?.generatedPrompt) {
      setUserInput(cached.userInput);
      setPlatform(cached.platform);
      setGeneratedPrompt(cached.generatedPrompt);
    }
  }, [cache, setUserInput, setPlatform, setGeneratedPrompt]);

  // Cache when a new prompt is generated
  useEffect(() => {
    if (generatedPrompt && !isStreaming) {
      cache.set({
        userInput,
        platform: selectedPlatform,
        generatedPrompt,
      });
    }
  }, [generatedPrompt, isStreaming, userInput, selectedPlatform, cache]);

  const canGenerate =
    userInput.trim().length >= MIN_INPUT_LENGTH && !isStreaming;

  const handleGenerate = () => {
    if (!canGenerate) return;
    resetFeedback();
    generate({ userInput, platform: selectedPlatform });
  };

  const handleAnswer = (answers: Record<number, string>) => {
    clearQuestions();
    const answerContext = questions
      .map((q, i) => `Q: ${q.question}\nA: ${answers[i]}`)
      .join('\n');
    const enrichedInput = `${userInput}\n\nAdditional context from clarifying questions:\n${answerContext}\n\nSKIP_QUESTIONS`;
    generate({ userInput: enrichedInput, platform: selectedPlatform });
  };

  const handleSkip = () => {
    clearQuestions();
    const skipInput = `${userInput}\n\nSKIP_QUESTIONS`;
    generate({ userInput: skipInput, platform: selectedPlatform });
  };

  return (
    <ErrorBoundary>
      <Toaster position="top-center" duration={5000} closeButton />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <h1 className={styles.title}>PromptBuilder</h1>
            <p className={styles.subtitle}>Craft perfect prompts for any AI platform</p>
            <div className={styles.headerActions}>
              <SettingsButton />
            </div>
          </div>
        </header>
        <SettingsModal />
        <main id="main-content" className={styles.main}>
          <div className={styles.card}>
            <PromptInput
              value={userInput}
              onChange={setUserInput}
              onSubmit={canGenerate ? handleGenerate : undefined}
              disabled={isStreaming}
            />
            <PlatformSelector
              value={selectedPlatform}
              onChange={setPlatform}
              disabled={isStreaming}
            />
            <Button
              disabled={!canGenerate}
              onClick={handleGenerate}
              className={styles.generateBtn}
            >
              {isStreaming ? (
                <>
                  <Spinner size="sm" label="Generating" /> Generating…
                </>
              ) : (
                'Generate Prompt'
              )}
            </Button>
          </div>
          <StreamingAnalysis />
          {questions.length > 0 && (
            <ClarifyingQuestions
              onAnswer={handleAnswer}
              onSkip={handleSkip}
            />
          )}
          <PromptOutput />
          {generatedPrompt && !isStreaming && (
            <FeedbackWidget platform={selectedPlatform} />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
