'use client';

import { useTranslations } from 'next-intl';
import type { UserStats } from '@/types';

export function StatGrid({ stats }: { stats: UserStats }) {
  const t = useTranslations('profile.stats');

  const items: Array<{ label: string; value: number }> = [
    { label: t('tasted'), value: stats.winesTasted },
    { label: t('countries'), value: stats.countriesExplored },
    { label: t('regions'), value: stats.regionsExplored },
    { label: t('notes'), value: stats.notesCount },
  ];

  return (
    <section
      style={{
        margin: '12px 16px 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
      }}
    >
      {items.map((s) => (
        <div
          key={s.label}
          style={{
            padding: '12px 8px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 22,
              color: 'var(--color-cream)',
              lineHeight: 1,
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              marginTop: 4,
              fontFamily: 'var(--font-inter)',
              fontSize: 10,
              color: 'var(--color-text-muted)',
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </section>
  );
}
