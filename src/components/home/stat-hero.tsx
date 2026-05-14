'use client';

import { useTranslations } from 'next-intl';
import type { User } from '@/types';

/**
 * 헤비 모드 홈 상단 통계 카드 그리드.
 * 3개 카드: 방문 국가 / 마신 와인 / 작성 노트.
 * 정보량 대비 점유 면적을 줄이기 위해 아이콘을 제거하고 값·라벨만 컴팩트하게 표시.
 */
export function StatHero({ user }: { user: User }) {
  const t = useTranslations('home');

  const items = [
    { value: user.stats.countriesExplored, label: t('statCountries') },
    { value: user.stats.winesTasted, label: t('statWines') },
    { value: user.stats.notesCount, label: t('statNotes') },
  ];

  return (
    <div
      data-feature-id="home.statHero"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 6,
        padding: '12px 16px 0',
      }}
    >
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            padding: '8px 10px',
            borderRadius: 12,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 20,
              color: 'var(--color-cream)',
              lineHeight: 1.1,
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
