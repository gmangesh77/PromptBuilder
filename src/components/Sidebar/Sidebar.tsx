import { useNavigationStore } from '../../stores/navigationStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useThemeStore } from '../../stores/themeStore';
import type { Page } from '../../stores/navigationStore';
import styles from './Sidebar.module.css';

interface NavItem {
  page: Page;
  number: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { page: 'generate', number: '01', label: 'Compose' },
  { page: 'templates', number: '02', label: 'Templates' },
  { page: 'library', number: '03', label: 'Library' },
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
          <span className={styles.brandName}>Cognify Prompts</span>
          <span className={styles.brandTagline}>power your imagination</span>
        </div>

        <div className={styles.sectionLabel}>Sections</div>
        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map(({ page, number, label }) => (
            <li key={page}>
              <button
                className={`${styles.navItem} ${currentPage === page ? styles.active : ''}`}
                onClick={() => navigate(page)}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                <span className={styles.navNumber}>{number}</span>
                <span className={styles.navLabel}>{label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.spacer} />

        <div className={styles.sectionLabel}>Preferences</div>
        <div className={styles.bottomActions}>
          <button
            className={styles.actionButton}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <span className={styles.actionGlyph}>{theme === 'dark' ? '☀' : '☾'}</span>
            <span className={styles.actionLabel}>
              {theme === 'dark' ? 'Daylight' : 'Night'}
            </span>
          </button>
          <button
            className={styles.actionButton}
            onClick={openSettings}
            aria-label="Settings"
          >
            <span className={styles.actionGlyph}>◎</span>
            <span className={styles.actionLabel}>Settings</span>
          </button>
        </div>

        <div className={styles.colophon}>
          <span className={styles.colophonRule} />
          <span className={styles.colophonText}>MMXXVI · v2</span>
        </div>
      </nav>
    </>
  );
}
