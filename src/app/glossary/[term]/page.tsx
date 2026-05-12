'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { BackHeader } from '@/components/nav/back-header';
import { LocaleText } from '@/components/shared/locale-text';
import { getGlossaryEntry, GLOSSARY_BY_ID } from '@/lib/mock/glossary';
import { useRegisterFeatures } from '@/context/feature-flag-context';

function categoryColor(cat: string): string {
  switch (cat) {
    case 'fault':
      return 'var(--color-error)';
    case 'classification':
      return 'var(--color-gold)';
    case 'technique':
      return 'var(--color-cream)';
    case 'unit':
      return 'var(--color-text-secondary)';
    case 'sensory':
    default:
      return 'var(--color-gold)';
  }
}

export default function GlossaryEntryPage() {
  const params = useParams<{ term: string }>();
  const t = useTranslations('glossary');
  const tCats = useTranslations('glossary.categories');

  useRegisterFeatures('/glossary/[term]', [
    { id: 'glossaryEntry.hero', labelKo: '용어 헤로', labelEn: 'Term hero', defaultStatus: 'planned' },
    { id: 'glossaryEntry.definition', labelKo: '정의', labelEn: 'Definition', defaultStatus: 'planned' },
    { id: 'glossaryEntry.examples', labelKo: '예시', labelEn: 'Examples', defaultStatus: 'planned' },
    { id: 'glossaryEntry.relatedTerms', labelKo: '관련 용어', labelEn: 'Related terms', defaultStatus: 'planned' },
  ]);

  const entry = getGlossaryEntry(params.term);

  if (!entry) {
    return (
      <>
        <BackHeader />
        <main className="wm-scroll-area">
          <div style={{ padding: 24, color: 'var(--color-text-muted)' }}>{t('notFound')}</div>
        </main>
      </>
    );
  }

  return (
    <>
      <BackHeader title={entry.term} />
      <main className="wm-scroll-area" style={{ paddingBottom: 32 }}>
        <section data-feature-id="glossaryEntry.hero" style={{ padding: '8px 20px 16px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 10,
              background: 'rgba(201,168,76,0.12)',
              color: categoryColor(entry.category),
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            {tCats(entry.category)}
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 32,
              color: 'var(--color-cream)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            <LocaleText value={entry.term} />
          </h1>
        </section>

        <section data-feature-id="glossaryEntry.definition" style={{ padding: '0 20px 16px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: '0 0 8px',
            }}
          >
            {t('definition')}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 14,
              color: 'var(--color-cream)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            <LocaleText value={entry.definition} />
          </p>
          {entry.source && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderLeft: '3px solid var(--color-gold)',
                background: 'rgba(201,168,76,0.06)',
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-gold)',
                  marginBottom: 4,
                }}
              >
                {t('source')}
              </div>
              <LocaleText value={entry.source} />
            </div>
          )}
        </section>

        {entry.examples && (
          <section data-feature-id="glossaryEntry.examples" style={{ padding: '0 20px 16px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                color: 'var(--color-text-muted)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                margin: '0 0 8px',
              }}
            >
              {t('examples')}
            </h2>
            <blockquote
              style={{
                fontFamily: 'var(--font-playfair)',
                fontStyle: 'italic',
                fontSize: 15,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                margin: 0,
                padding: '8px 16px',
                borderLeft: '3px solid var(--color-wine-red)',
              }}
            >
              <LocaleText value={entry.examples} />
            </blockquote>
          </section>
        )}

        {entry.relatedTermIds.length > 0 && (
          <section data-feature-id="glossaryEntry.relatedTerms" style={{ padding: '0 20px 16px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                color: 'var(--color-text-muted)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                margin: '0 0 8px',
              }}
            >
              {t('related')}
            </h2>
            <div
              style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
              }}
            >
              {entry.relatedTermIds.map((rid) => {
                const r = GLOSSARY_BY_ID[rid];
                if (!r) return null;
                return (
                  <Link
                    key={rid}
                    href={`/glossary/${rid}` as Route}
                    style={{
                      flexShrink: 0,
                      padding: '6px 12px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 16,
                      color: 'var(--color-cream)',
                      fontFamily: 'var(--font-inter)',
                      fontSize: 12,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <LocaleText value={r.term} />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div style={{ padding: '20px 20px 0' }}>
          <Link
            href={'/glossary' as Route}
            style={{
              display: 'inline-block',
              padding: '10px 14px',
              border: '1px solid var(--color-border-default)',
              borderRadius: 12,
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {t('more')}
          </Link>
        </div>
      </main>
    </>
  );
}
