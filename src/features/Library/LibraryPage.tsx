import { useState, useMemo } from 'react';
import { useHistoryStore } from '../../stores/historyStore';
import type { HistoryEntry } from '../../stores/historyStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { usePromptStore } from '../../stores/promptStore';
import { useGenerationStore } from '../../stores/generationStore';
import { useClipboard } from '../../hooks/useClipboard';
import type { Platform } from '../../types/platform';
import styles from './LibraryPage.module.css';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  return `${months} months ago`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EmptyBookIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M9 7h6M9 11h4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Entry card
// ---------------------------------------------------------------------------

interface EntryCardProps {
  entry: HistoryEntry;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onLoad: (entry: HistoryEntry) => void;
}

function EntryCard({ entry, onToggleFavorite, onDelete, onLoad }: EntryCardProps) {
  const { copy, isCopied } = useClipboard();

  const titleText = entry.userInput.length > 80
    ? entry.userInput.slice(0, 80) + '…'
    : entry.userInput;

  const previewText = entry.generatedPrompt.length > 120
    ? entry.generatedPrompt.slice(0, 120) + '…'
    : entry.generatedPrompt;

  return (
    <article className={styles.card}>
      {/* Clickable main area */}
      <button
        className={styles.cardBody}
        onClick={() => onLoad(entry)}
        aria-label={`Load prompt: ${titleText}`}
      >
        <div className={styles.cardMeta}>
          <span className={`${styles.platformBadge} ${styles[`platform_${entry.platform}`]}`}>
            {entry.platform}
          </span>
          <time className={styles.cardTime} dateTime={new Date(entry.createdAt).toISOString()}>
            {timeAgo(entry.createdAt)}
          </time>
        </div>
        <h3 className={styles.cardTitle}>{titleText}</h3>
        <p className={styles.cardPreview}>{previewText}</p>
      </button>

      {/* Action row */}
      <div className={styles.cardActions}>
        <button
          className={`${styles.actionBtn} ${styles.copyBtn} ${isCopied ? styles.copied : ''}`}
          onClick={() => copy(entry.generatedPrompt)}
          aria-label={isCopied ? 'Copied!' : 'Copy generated prompt'}
        >
          <CopyIcon />
          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
        <div className={styles.iconActions}>
          <button
            className={`${styles.iconBtn} ${entry.favorite ? styles.favoriteActive : ''}`}
            onClick={() => onToggleFavorite(entry.id)}
            aria-label={entry.favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={entry.favorite}
          >
            <StarIcon filled={entry.favorite} />
          </button>
          <button
            className={`${styles.iconBtn} ${styles.deleteBtn}`}
            onClick={() => onDelete(entry.id)}
            aria-label="Delete entry"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type FilterTab = 'all' | 'favorites';

export function LibraryPage() {
  const entries = useHistoryStore((s) => s.entries);
  const removeEntry = useHistoryStore((s) => s.removeEntry);
  const toggleFavorite = useHistoryStore((s) => s.toggleFavorite);
  const clearAll = useHistoryStore((s) => s.clearAll);

  const navigate = useNavigationStore((s) => s.navigate);
  const setUserInput = usePromptStore((s) => s.setUserInput);
  const setPlatform = usePromptStore((s) => s.setPlatform);
  const setGeneratedPrompt = useGenerationStore((s) => s.setGeneratedPrompt);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (activeTab === 'favorites') {
      result = result.filter((e) => e.favorite);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.userInput.toLowerCase().includes(q) ||
          e.generatedPrompt.toLowerCase().includes(q),
      );
    }

    return result;
  }, [entries, activeTab, searchQuery]);

  const handleLoad = (entry: HistoryEntry) => {
    setUserInput(entry.userInput);
    setPlatform(entry.platform as Platform);
    setGeneratedPrompt(entry.generatedPrompt);
    navigate('generate');
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearAll();
    setConfirmClear(false);
  };

  const hasEntries = entries.length > 0;
  const hasResults = filteredEntries.length > 0;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h2 className={styles.pageTitle}>Library</h2>
          <p className={styles.pageSubtitle}>Your prompt history</p>
        </div>

        <div className={styles.searchWrapper}>
          <SearchIcon />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search prompt history"
          />
        </div>
      </div>

      {/* Filter bar */}
      {hasEntries && (
        <div className={styles.filterBar}>
          <div className={styles.tabs} role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'all'}
              className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
              <span className={styles.tabCount}>{entries.length}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'favorites'}
              className={`${styles.tab} ${activeTab === 'favorites' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
              <span className={styles.tabCount}>{entries.filter((e) => e.favorite).length}</span>
            </button>
          </div>

          {confirmClear ? (
            <div className={styles.confirmRow}>
              <span className={styles.confirmText}>Clear all history?</span>
              <button className={styles.confirmYes} onClick={handleClearAll}>Yes, clear</button>
              <button className={styles.confirmNo} onClick={() => setConfirmClear(false)}>Cancel</button>
            </div>
          ) : (
            <button className={styles.clearBtn} onClick={handleClearAll}>
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {!hasEntries ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <EmptyBookIcon />
          </div>
          <p className={styles.emptyTitle}>No prompts yet</p>
          <p className={styles.emptyText}>
            Generate your first prompt to see it here.
          </p>
        </div>
      ) : !hasResults ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <SearchIcon />
          </div>
          <p className={styles.emptyTitle}>No results</p>
          <p className={styles.emptyText}>
            No prompts matching &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      ) : (
        <ul className={styles.list} aria-label="Prompt history">
          {filteredEntries.map((entry) => (
            <li key={entry.id} className={styles.listItem}>
              <EntryCard
                entry={entry}
                onToggleFavorite={toggleFavorite}
                onDelete={removeEntry}
                onLoad={handleLoad}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
