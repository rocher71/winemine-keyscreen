'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { LocaleText } from '@/components/shared/locale-text';
import { WMBottle } from '@/components/shared/wm-bottle';
import { WMGlassRating } from '@/components/shared/wm-glass-rating';
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
      <div
        style={{
          padding: '0 20px 8px',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 10, color: '#C9A84C', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2, fontWeight: 500 }}>
          최근 노트
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 17,
            color: 'var(--color-cream)',
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          {t('recentTasted')}
        </h2>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          padding: '0 16px 4px',
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {items.map((n) => {
          const wine = getWine(n.wineId);
          if (!wine) return null;
          const rating =
            n.beginnerFields?.rating ??
            (n.expertFields?.rating != null ? Math.round((n.expertFields.rating / 20) * 10) / 10 : 0);
          const dateStr = n.tastedAt ? n.tastedAt.slice(5) : '';
          return (
            <Link
              key={n.id}
              href={`/wine/${wine.id}` as Route}
              style={{
                width: 200,
                flexShrink: 0,
                padding: 12,
                borderRadius: 12,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-default)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                textDecoration: 'none',
                color: 'inherit',
                scrollSnapAlign: 'start',
              }}
            >
              {/* 병 + 와인 메타 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <WMBottle
                  bottleColor={wine.bottleColor}
                  producer={wine.producer.ko || wine.producer.en}
                  label={wine.name.split(' ')[0]}
                  vintage={wine.vintage}
                  width={26}
                  height={86}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: 12,
                      color: 'var(--color-cream)',
                      lineHeight: 1.25,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {wine.name}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    {wine.vintage} · {dateStr}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <WMGlassRating value={Math.round(rating)} size={8} />
                  </div>
                </div>
              </div>

              {/* 아로마 힌트 */}
              {n.beginnerFields?.aromas && n.beginnerFields.aromas.length > 0 && (
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.45,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {n.beginnerFields.aromas.slice(0, 3).join(' · ')}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
