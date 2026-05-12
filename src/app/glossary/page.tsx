'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { Sparkles, AlertTriangle, Award, Beaker, Ruler, BookOpen } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { LocaleText, useLocalizedText } from '@/components/shared/locale-text';
import { GLOSSARY } from '@/lib/mock/glossary';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import type { GlossaryCategory } from '@/types';

const CATEGORY_ICON: Record<GlossaryCategory, React.ReactNode> = {
  sensory: <Sparkles size={16} color="var(--color-gold)" />,
  fault: <AlertTriangle size={16} color="var(--color-error)" />,
  classification: <Award size={16} color="var(--color-gold)" />,
  technique: <Beaker size={16} color="var(--color-cream)" />,
  unit: <Ruler size={16} color="var(--color-text-secondary)" />,
};

type Cat = 'all' | GlossaryCategory;

export default function GlossaryListPage() {
  const t = useTranslations('glossary');
  const tCats = useTranslations('glossary.categories');
  const [cat, setCat] = useState<Cat>('all');
  const [q, setQ] = useState('');

  useRegisterFeatures('/glossary', [
    { id: 'glossary.categoryChips', labelKo: '카테고리 칩', labelEn: 'Category chips', defaultStatus: 'planned' },
    { id: 'glossary.search', labelKo: '검색', labelEn: 'Search', defaultStatus: 'planned' },
    { id: 'glossary.list', labelKo: '용어 리스트', labelEn: 'Term list', defaultStatus: 'planned' },
  ]);

  const filtered = useMemo(() => {
    const trimmed = q.trim().toLowerCase();
    return GLOSSARY.filter((g) => {
      if (cat !== 'all' && g.category !== cat) return false;
      if (!trimmed) return true;
      const hay = `${g.term.ko}${g.term.en}${g.definition.ko}${g.definition.en}`.toLowerCase();
      return hay.includes(trimmed);
    }).sort((a, b) => a.term.en.localeCompare(b.term.en));
  }, [cat, q]);

  return (
    <>
      <BackHeader title={t('title')} />
      <main className="wm-scroll-area">
        <div
          data-feature-id="glossary.categoryChips"
          style={{
            display: 'flex',
            gap: 8,
            padding: '8px 16px 12px',
            overflowX: 'auto',
          }}
        >
          {(['all', 'sensory', 'fault', 'classification', 'technique', 'unit'] as Cat[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setCat(k)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                background: cat === k ? 'var(--color-wine-red)' : 'transparent',
                color: cat === k ? 'var(--color-cream)' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 16,
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tCats(k)}
            </button>
          ))}
        </div>
        <div data-feature-id="glossary.search" style={{ padding: '0 16px 12px' }}>
          <SearchInput placeholder={t('searchPlaceholder')} value={q} onChange={setQ} />
        </div>

        <div data-feature-id="glossary.list">
          {filtered.length === 0 ? (
            <div
              style={{
                padding: 32,
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-inter)',
                fontSize: 13,
              }}
            >
              {t('noResults')}
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {filtered.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/glossary/${g.id}` as Route}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 20px',
                      borderBottom: '1px solid var(--color-border-default)',
                      textDecoration: 'none',
                      minHeight: 72,
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        background: 'rgba(201,168,76,0.08)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {CATEGORY_ICON[g.category]}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <LocaleText
                        value={g.term}
                        as="div"
                        className="wm-card-title"
                      />
                      <div
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 12,
                          color: 'var(--color-text-muted)',
                          marginTop: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <LocaleText value={g.definition} />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ height: 24 }} />
      </main>
    </>
  );
}

function SearchInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const ph = useLocalizedText({ ko: placeholder, en: placeholder });
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={ph}
      aria-label={placeholder}
      style={{
        width: '100%',
        height: 40,
        padding: '0 14px',
        background: 'var(--color-bg-map)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 12,
        color: 'var(--color-cream)',
        fontFamily: 'var(--font-inter)',
        fontSize: 13,
        outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}
