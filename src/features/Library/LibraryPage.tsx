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

// ---------------------------------------------------------------------------
// Entry card — editorial list item
// ---------------------------------------------------------------------------

interface EntryCardProps {
  entry: HistoryEntry;
  index: number;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onLoad: (entry: HistoryEntry) => void;
}

function EntryCard({ entry, index, onToggleFavorite, onDelete, onLoad }: EntryCardProps) {
  const { copy, isCopied } = useClipboard();

  const truncatedUserInput = entry.userInput.length > 80
    ? entry.userInput.slice(0, 80) + '…'
    : entry.userInput;

  const truncatedGeneratedPrompt = entry.generatedPrompt.length > 120
    ? entry.generatedPrompt.slice(0, 120) + '…'
    : entry.generatedPrompt;

  return (
    <li className={styles.entry}>
      <button
        className={styles.entryBody}
        onClick={() => onLoad(entry)}
        aria-label={`Load prompt: ${truncatedUserInput}`}
      >
        <div className={styles.entryMeta}>
          <span className={styles.entryNumber}>{String(index + 1).padStart(2, '0')}</span>
          <span className={styles.entryTime}>{timeAgo(entry.createdAt)}</span>
          <span className={styles.entryDivider}>·</span>
          <span className={`${styles.entryPlatform} ${styles[`platform_${entry.platform}` as keyof typeof styles]}`}>
            {entry.platform}
          </span>
        </div>
        <h3 className={styles.entryTitle}>{truncatedUserInput}</h3>
        <p className={styles.entryPreview}>{truncatedGeneratedPrompt}</p>
      </button>
      <div className={styles.entryActions}>
        <button
          className={`${styles.entryAction} ${entry.favorite ? styles.entryActionFavorited : ''}`}
          onClick={() => onToggleFavorite(entry.id)}
          aria-label={entry.favorite ? 'Unfavorite' : 'Favorite'}
          aria-pressed={entry.favorite}
        >
          <StarIcon filled={entry.favorite} />
        </button>
        <button
          className={`${styles.entryAction} ${isCopied ? styles.entryActionCopied : ''}`}
          onClick={() => copy(entry.generatedPrompt)}
          aria-label={isCopied ? 'Copied!' : 'Copy'}
        >
          <CopyIcon />
        </button>
        <button
          className={`${styles.entryAction} ${styles.entryActionDanger}`}
          onClick={() => onDelete(entry.id)}
          aria-label="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
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
  const [filter, setFilter] = useState<FilterTab>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (filter === 'favorites') {
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
  }, [entries, filter, searchQuery]);

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

  return (
    <div className={styles.page}>
      {/* Editorial hero */}
      <header className={styles.hero}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowRule} />
          <span>03 / Library</span>
        </div>
        <h1 className={styles.heroTitle}>
          Your <em>conversations.</em>
        </h1>
        <hr className={styles.heroRule} />
        <p className={styles.heroDek}>
          Every prompt you've generated, kept close at hand. Revisit, favorite, copy, or start anew.
        </p>
      </header>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <SearchIcon />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search prompt history"
          />
        </div>

        <nav className={styles.filterTabs} role="tablist">
          <button
            role="tab"
            aria-selected={filter === 'all'}
            className={`${styles.filterTab} ${filter === 'all' ? styles.filterTabActive : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            role="tab"
            aria-selected={filter === 'favorites'}
            className={`${styles.filterTab} ${filter === 'favorites' ? styles.filterTabActive : ''}`}
            onClick={() => setFilter('favorites')}
          >
            Favorites
          </button>
        </nav>

        {entries.length > 0 && (
          <div className={styles.clearWrapper}>
            {confirmClear ? (
              <>
                <span className={styles.clearConfirmText}>Clear all history?</span>
                <button
                  className={`${styles.clearConfirmButton} ${styles.clearConfirmYes}`}
                  onClick={handleClearAll}
                >
                  Yes, clear
                </button>
                <button
                  className={`${styles.clearConfirmButton} ${styles.clearConfirmNo}`}
                  onClick={() => setConfirmClear(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className={styles.clearButton} onClick={handleClearAll}>
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {filteredEntries.length === 0 ? (
        <div className={styles.emptyState}>
          {searchQuery
            ? `Nothing found for "${searchQuery}"`
            : 'No prompts yet. Start with Compose.'}
        </div>
      ) : (
        <ol className={styles.entryList}>
          {filteredEntries.map((entry, idx) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              index={idx}
              onToggleFavorite={toggleFavorite}
              onDelete={removeEntry}
              onLoad={handleLoad}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
