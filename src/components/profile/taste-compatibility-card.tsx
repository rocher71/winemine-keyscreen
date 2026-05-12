'use client';

import { useTranslations } from 'next-intl';

type Props = {
  matchPct: number;
  sharedWines: number;
  sharedRegions: number;
};

export function TasteCompatibilityCard({ matchPct, sharedWines, sharedRegions }: Props) {
  const t = useTranslations('profile.other');
  const dash = 2 * Math.PI * 26;

  return (
    <section
      style={{
        margin: '0 16px',
        padding: 18,
        borderRadius: 16,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
        <svg width={60} height={60} viewBox="0 0 60 60">
          <circle
            cx={30}
            cy={30}
            r={26}
            stroke="var(--color-border-default)"
            strokeWidth={4}
            fill="none"
          />
          <circle
            cx={30}
            cy={30}
            r={26}
            stroke="var(--color-gold)"
            strokeWidth={4}
            fill="none"
            strokeDasharray={dash}
            strokeDashoffset={dash * (1 - matchPct / 100)}
            transform="rotate(-90 30 30)"
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-cream)',
          }}
        >
          {matchPct}%
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            fontWeight: 500,
          }}
        >
          {t('matchTitle')}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 26,
            color: 'var(--color-cream)',
            lineHeight: 1,
            margin: '4px 0 6px',
          }}
        >
          {matchPct}%
        </div>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            lineHeight: 1.4,
          }}
        >
          {t('matchDesc', { shared: sharedWines, regions: sharedRegions })}
        </div>
      </div>
    </section>
  );
}
