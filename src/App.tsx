import { useEffect, useRef } from 'react';
import { Toaster } from 'sonner';
import { usePromptStore } from './stores/promptStore';
import { useGenerationStore } from './stores/generationStore';
import { useFeedbackStore } from './stores/feedbackStore';
import { useNavigationStore } from './stores/navigationStore';
import { useHistoryStore } from './stores/historyStore';
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
import { LibraryPage } from './features/Library';
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
  const addHistoryEntry = useHistoryStore((s) => s.addEntry);
  const lastSavedRef = useRef('');

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
    if (generatedPrompt && !isStreaming && generatedPrompt !== lastSavedRef.current) {
      lastSavedRef.current = generatedPrompt;
      cache.set({ userInput, platform: selectedPlatform, generatedPrompt });
      addHistoryEntry({ userInput, generatedPrompt, platform: selectedPlatform });
    }
  }, [generatedPrompt, isStreaming, userInput, selectedPlatform, cache, addHistoryEntry]);

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
      <article className={styles.compose}>
        <header className={styles.composeHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowRule} />
            <span>01 / Compose</span>
          </div>
          <h1 className={styles.composeTitle}>
            Craft prompts<br />
            <em>that work.</em>
          </h1>
          <hr className={styles.composeRule} />
          <p className={styles.composeDek}>
            A quiet tool for serious conversations with AI. Describe what you need,
            pick a platform, and receive a prompt engineered for clarity.
          </p>
        </header>

        <div className={styles.composeBody}>
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
          <div className={styles.generateRow}>
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
                <>Generate Prompt <span aria-hidden="true">→</span></>
              )}
            </Button>
          </div>
        </div>
      </article>
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
            <span className={styles.title}>PromptBuilder</span>
          </header>
          <main id="main-content" className={styles.main}>
            {currentPage === 'generate' && <GeneratePage />}
            {currentPage === 'templates' && <TemplatesPage />}
            {currentPage === 'library' && <LibraryPage />}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
