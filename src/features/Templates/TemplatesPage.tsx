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
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Discover</h2>
          <p className={styles.pageSubtitle}>
            Ready-to-use prompts across every role. Pick one and make it yours.
          </p>
        </div>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!searchQuery.trim() && (
        <div className={styles.categoryTabs} role="tablist">
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
        </div>
      )}

      <div className={styles.content}>
        {filteredTemplates.length === 0 ? (
          <p className={styles.emptyState}>No templates found for "{searchQuery}"</p>
        ) : (
          Array.from(subcategories.entries()).map(([subcat, templates]) => (
            <section key={subcat} className={styles.subcategorySection}>
              <h3 className={styles.subcategoryTitle}>{subcat}</h3>
              <div className={styles.cardGrid}>
                {templates.map((template) => (
                  <button
                    key={template.id}
                    className={styles.templateCard}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <h4 className={styles.cardTitle}>{template.title}</h4>
                    <p className={styles.cardDescription}>{template.description}</p>
                    <span className={styles.cardArrow} aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
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
        <h3 className={styles.modalTitle}>{template.title}</h3>
        <p className={styles.modalDescription}>{template.description}</p>

        <div className={styles.modalPromptSection}>
          <h4 className={styles.modalPromptLabel}>Prompt</h4>
          <div className={styles.modalPromptText}>{template.prompt}</div>
        </div>

        {template.inputs.length > 0 && (
          <div className={styles.modalInputs}>
            <h4 className={styles.modalInputsLabel}>Fill in before using:</h4>
            <ul className={styles.modalInputsList}>
              {template.inputs.map((input) => (
                <li key={input.label} className={styles.modalInputItem}>
                  [{input.label}{input.required ? ' - REQUIRED' : ''}]
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.modalActions}>
          <button className={styles.navButton} onClick={onClose} aria-label="Previous template">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className={styles.useButton} onClick={() => onUse(template)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Use Template
          </button>
          <button className={styles.navButton} onClick={onClose} aria-label="Next template">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
