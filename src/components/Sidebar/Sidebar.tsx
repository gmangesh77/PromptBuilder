import { useNavigationStore } from '../../stores/navigationStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useThemeStore } from '../../stores/themeStore';
import type { Page } from '../../stores/navigationStore';
import styles from './Sidebar.module.css';

interface NavItem {
  page: Page;
  label: string;
  icon: React.ReactNode;
}

function GenerateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TemplatesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.02 12.02l.707.707M3 12h1m16 0h1M4.22 19.78l.707-.707m12.02-12.02l.707-.707M12 6a6 6 0 100 12A6 6 0 0012 6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.752 15.002A9.72 9.72 0 0118 15.75 9.75 9.75 0 018.25 6a9.72 9.72 0 01.753-3.752 9.753 9.753 0 00-10.498 10A9.753 9.753 0 0012 21.75c4.318 0 8.003-2.8 9.252-6.748z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { page: 'generate', label: 'Generate', icon: <GenerateIcon /> },
  { page: 'templates', label: 'Templates', icon: <TemplatesIcon /> },
  { page: 'library', label: 'Library', icon: <LibraryIcon /> },
];

export function Sidebar() {
  const currentPage = useNavigationStore((s) => s.currentPage);
  const sidebarOpen = useNavigationStore((s) => s.sidebarOpen);
  const navigate = useNavigationStore((s) => s.navigate);
  const closeSidebar = useNavigationStore((s) => s.closeSidebar);
  const openSettings = useSettingsStore((s) => s.openSettings);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <>
      {sidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <nav
        className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}
        aria-label="Main navigation"
      >
        <div className={styles.brand}>
          <span className={styles.brandText}>PromptBuilder</span>
        </div>

        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map(({ page, label, icon }) => (
            <li key={page}>
              <button
                className={`${styles.navItem} ${currentPage === page ? styles.active : ''}`}
                onClick={() => navigate(page)}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                <span className={styles.navIcon}>{icon}</span>
                <span className={styles.navLabel}>{label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.bottomActions}>
          <button
            className={styles.actionButton}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            <span className={styles.navIcon}>
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </span>
            <span className={styles.navLabel}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
          </button>
          <button
            className={styles.actionButton}
            onClick={openSettings}
            aria-label="Settings"
            title="Settings"
          >
            <span className={styles.navIcon}><SettingsIcon /></span>
            <span className={styles.navLabel}>Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
}
