'use client';

import { useTranslations } from 'next-intl';

export function EmptyStatHero() {
  const t = useTranslations('home.firstTime');
  return (
    <div
      data-feature-id="home.emptyStatHero"
      style={{
        margin: '12px 16px 0',
        padding: 20,
        borderRadius: 16,
        background: 'var(--color-surface)',
        border: '1px dashed var(--color-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <svg
        viewBox="0 0 100 60"
        width="100%"
        height={70}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        style={{ opacity: 0.15 }}
      >
        <ellipse cx="22" cy="28" rx="14" ry="9" fill="#2D1540" />
        <ellipse cx="48" cy="22" rx="13" ry="7" fill="#2D1540" />
        <ellipse cx="78" cy="26" rx="11" ry="8" fill="#2D1540" />
        <ellipse cx="30" cy="46" rx="8" ry="6" fill="#2D1540" />
      </svg>
      <div
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 18,
          color: 'var(--color-cream)',
        }}
      >
        {t('emptyMap')}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: 'var(--color-text-muted)',
        }}
      >
        {t('emptyMapHint')}
      </div>
    </div>
  );
}
