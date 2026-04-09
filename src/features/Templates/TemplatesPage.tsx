import { useState, useMemo } from 'react';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/templates';
import { useNavigationStore } from '../../stores/navigationStore';
import { usePromptStore } from '../../stores/promptStore';
import type { PromptTemplate } from '../../data/templates';
import styles from './TemplatesPage.module.css';

export function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState(TEMPLATE_CATEGORIES[0].name);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);

  const navigate = useNavigationStore((s) => s.navigate);
  const setUserInput = usePromptStore((s) => s.setUserInput);

  const filteredTemplates = useMemo(() => {
    let results = TEMPLATES;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.subcategory.toLowerCase().includes(q),
      );
    } else {
      results = results.filter((t) => t.category === activeCategory);
    }

    return results;
  }, [activeCategory, searchQuery]);

  const subcategories = useMemo(() => {
    const subs = new Map<string, PromptTemplate[]>();
    for (const t of filteredTemplates) {
      const list = subs.get(t.subcategory) || [];
      list.push(t);
      subs.set(t.subcategory, list);
    }
    return subs;
  }, [filteredTemplates]);

  const handleUseTemplate = (template: PromptTemplate) => {
    let prompt = template.prompt;
    for (const input of template.inputs) {
      prompt = prompt.replace(`[${input.label}]`, `[${input.label}]`);
    }
    setUserInput(prompt);
    setSelectedTemplate(null);
    navigate('generate');
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowRule} />
          <span>02 / Templates</span>
        </div>
        <h1 className={styles.heroTitle}>
          A library for <em>every craft.</em>
        </h1>
        <hr className={styles.heroRule} />
        <p className={styles.heroDek}>
          Ready-to-use prompts written for professionals across every role.
          Pick one and make it yours.
        </p>
      </header>

      <div className={styles.searchWrapper}>
        <svg
          className={styles.searchIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search the library…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!searchQuery.trim() && (
        <nav className={styles.categoryNav} role="tablist">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              role="tab"
              aria-selected={activeCategory === cat.name}
              className={`${styles.categoryTab} ${activeCategory === cat.name ? styles.categoryTabActive : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      )}

      <div className={styles.content}>
        {filteredTemplates.length === 0 ? (
          <p className={styles.emptyState}>No templates found for &ldquo;{searchQuery}&rdquo;</p>
        ) : (
          Array.from(subcategories.entries()).map(([subcat, templates], idx) => (
            <section key={subcat} className={styles.subcategorySection}>
              <header className={styles.subHeader}>
                <span className={styles.subNumber}>{String(idx + 1).padStart(2, '0')}</span>
                <h2 className={styles.subTitle}>{subcat}</h2>
                <hr className={styles.subRule} />
              </header>
              <div className={styles.cardGrid}>
                {templates.map((template) => (
                  <button
                    key={template.id}
                    className={styles.templateCard}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <h3 className={styles.cardTitle}>{template.title}</h3>
                    <p className={styles.cardDescription}>{template.description}</p>
                    <span className={styles.cardArrow} aria-hidden="true">&#8594;</span>
                  </button>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onUse={handleUseTemplate}
        />
      )}
    </div>
  );
}

function TemplateModal({
  template,
  onClose,
  onUse,
}: {
  template: PromptTemplate;
  onClose: () => void;
  onUse: (t: PromptTemplate) => void;
}) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={template.title}
      >
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className={styles.modalEyebrow}>
          <span className={styles.eyebrowRule} />
          <span>{template.category} &middot; {template.subcategory}</span>
        </div>
        <h2 className={styles.modalTitle}>{template.title}</h2>
        <p className={styles.modalDescription}>{template.description}</p>

        <hr className={styles.modalDivider} />

        <div className={styles.modalSection}>
          <span className={styles.modalSectionLabel}>The Prompt</span>
          <pre className={styles.modalPromptText}>{template.prompt}</pre>
        </div>

        {template.inputs.length > 0 && (
          <div className={styles.modalSection}>
            <span className={styles.modalSectionLabel}>Fill in before using</span>
            <ul className={styles.modalInputsList}>
              {template.inputs.map((input) => (
                <li key={input.label}>
                  <code>[{input.label}{input.required ? ' \u2014 required' : ''}]</code>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.modalActions}>
          <button className={styles.useButton} onClick={() => onUse(template)}>
            &#9670; Use this template &#8594;
          </button>
        </div>
      </div>
    </div>
  );
}
