'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { LocaleText } from '@/components/shared/locale-text';
import { WineLabelArt } from '@/components/shared/wine-label-art';
import { getWine } from '@/lib/mock/wines';
import type { TastingNote } from '@/types';

export function RecentNotesStrip({ notes }: { notes: TastingNote[] }) {
  const t = useTranslations('home');
  const items = notes
    .slice()
    .sort((a, b) => (a.tastedAt < b.tastedAt ? 1 : -1))
    .slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section data-feature-id="home.recentNotesStrip" style={{ marginTop: 18 }}>
      <header style={{ padding: '0 20px 8px' }}>
        <h2 className="wm-section-title">{t('recentTasted')}</h2>
      </header>
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          padding: '0 16px 4px',
          scrollSnapType: 'x mandatory',
        }}
      >
        {items.map((n) => {
          const wine = getWine(n.wineId);
          if (!wine) return null;
          const rating =
            n.beginnerFields?.rating ??
            (n.expertFields?.rating != null ? Math.round((n.expertFields.rating / 20) * 10) / 10 : 0);
          return (
            <Link
              key={n.id}
              href={`/wine/${wine.id}` as Route}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                width: 140,
                flexShrink: 0,
                textDecoration: 'none',
                scrollSnapAlign: 'start',
              }}
            >
              <WineLabelArt
                initial={wine.name[0] ?? 'W'}
                bottleColor={wine.bottleColor}
                width={140}
                height={120}
                rounded={10}
              />
              <div className="wm-card-title" style={{ fontSize: 13 }}>
                {wine.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 6,
                }}
              >
                <span className="wm-card-meta">
                  <LocaleText value={wine.region} />
                  {' · '}
                  {wine.vintage}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2,
                    color: 'var(--color-gold)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  <Star size={10} strokeWidth={2} fill="currentColor" />
                  {rating.toFixed(1)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
