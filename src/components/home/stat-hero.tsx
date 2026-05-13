'use client';

import { useTranslations } from 'next-intl';
import type { User } from '@/types';

/**
 * 헤비 모드 홈 상단 통계 카드 그리드.
 * 디자인 시안의 StatHero — 3개 카드: 방문 국가 / 마신 와인 / 작성 노트.
 */
export function StatHero({ user }: { user: User }) {
  const t = useTranslations('home');

  const items = [
    {
      icon: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
        </svg>
      ),
      value: user.stats.countriesExplored,
      label: t('statCountries'),
      color: '#C9A84C',
    },
    {
      icon: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--color-cream)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M10 3h4v4c0 2 2 2 2 5v11h-8V12c0-3 2-3 2-5z" />
        </svg>
      ),
      value: user.stats.winesTasted,
      label: t('statWines'),
      color: 'var(--color-cream)',
    },
    {
      icon: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m4 20 4-1 11-11-3-3L5 16z" />
        </svg>
      ),
      value: user.stats.notesCount,
      label: t('statNotes'),
      color: '#C9A84C',
    },
  ];

  return (
    <div
      data-feature-id="home.statHero"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        padding: '14px 16px 0',
      }}
    >
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            padding: '14px 12px',
            borderRadius: 14,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {it.icon}
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 26,
              color: 'var(--color-cream)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {it.value}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 10,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.02em',
            }}
          >
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}
