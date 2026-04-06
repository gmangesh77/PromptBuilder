import { useEffect, useRef } from 'react';
import { Toaster } from 'sonner';
import { usePromptStore } from './stores/promptStore';
import { useGenerationStore } from './stores/generationStore';
import { useFeedbackStore } from './stores/feedbackStore';
import { useNavigationStore } from './stores/navigationStore';
import { useStream } from './hooks/useStream';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PromptInput, PlatformSelector } from './features/PromptInput';
import {
  StreamingAnalysis,
  PromptOutput,
  ClarifyingQuestions,
} from './features/Generation';
import { FeedbackWidget } from './features/Feedback';
import { SettingsModal } from './features/Settings';
import { TemplatesPage } from './features/Templates';
import { Button, Spinner, ErrorBoundary, Sidebar } from './components';
import type { Platform } from './types';
import styles from './App.module.css';

const MIN_INPUT_LENGTH = 10;
const CACHE_KEY = 'promptbuilder_last_generation';

interface CachedGeneration {
  userInput: string;
  platform: Platform;
  generatedPrompt: string;
}

function GeneratePage() {
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
    <>
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
    </>
  );
}

function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className={styles.comingSoon}>
      <div className={styles.comingSoonIcon}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className={styles.comingSoonTitle}>{title}</h2>
      <p className={styles.comingSoonText}>Coming soon</p>
    </div>
  );
}

function App() {
  const currentPage = useNavigationStore((s) => s.currentPage);
  const toggleSidebar = useNavigationStore((s) => s.toggleSidebar);

  return (
    <ErrorBoundary>
      <Toaster position="top-center" duration={5000} closeButton />
      <SettingsModal />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className={styles.appShell}>
        <Sidebar />
        <div className={styles.mainArea}>
          <header className={styles.header}>
            <button
              className={styles.menuButton}
              onClick={toggleSidebar}
              aria-label="Toggle navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <h1 className={styles.title}>PromptBuilder</h1>
          </header>
          <main id="main-content" className={styles.main}>
            {currentPage === 'generate' && <GeneratePage />}
            {currentPage === 'templates' && <TemplatesPage />}
            {currentPage === 'library' && <ComingSoonPage title="Library" />}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
