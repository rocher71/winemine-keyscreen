'use client';

import { useTranslations } from 'next-intl';
import { useLocalizedText } from '@/components/shared/locale-text';
import type { User } from '@/types';

/**
 * 헤비 모드 홈 상단 200px STAT HERO.
 * 좌측 큰 숫자 + 인사말, 우측 작은 월드맵 placeholder.
 */
export function StatHero({ user }: { user: User }) {
  const t = useTranslations('home');
  const name = useLocalizedText(user.displayName);
  return (
    <div
      data-feature-id="home.statHero"
      style={{
        margin: '8px 16px 0',
        borderRadius: 20,
        height: 200,
        padding: 20,
        background:
          'linear-gradient(180deg, var(--color-surface) 0%, rgba(139,26,42,0.25) 100%)',
        border: '1px solid var(--color-border-default)',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            color: 'var(--color-text-secondary)',
          }}
        >
          {t('greeting', { name })}
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 44,
              fontWeight: 400,
              lineHeight: 1,
              color: 'var(--color-cream)',
              letterSpacing: '-0.01em',
            }}
          >
            {t('bottles', { count: user.stats.winesTasted })}
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            {t('countriesRegions', {
              countries: user.stats.countriesExplored,
              regions: user.stats.regionsExplored,
            })}
          </div>
        </div>
      </div>
      <MiniWorldMapPlaceholder />
    </div>
  );
}

function MiniWorldMapPlaceholder() {
  // 시안용 정적 SVG 그리드. 실제 월드맵은 /map에서 react-simple-maps로 렌더.
  return (
    <svg
      viewBox="0 0 100 60"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      style={{ opacity: 0.85 }}
    >
      <defs>
        <radialGradient id="mwm-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1A0A1E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0A050F" stopOpacity="0.95" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="60" fill="url(#mwm-grad)" rx="6" />
      {/* 굵직한 대륙 실루엣 placeholder */}
      <g fill="#2D1540">
        <ellipse cx="22" cy="28" rx="14" ry="9" />
        <ellipse cx="48" cy="22" rx="13" ry="7" />
        <ellipse cx="78" cy="26" rx="11" ry="8" />
        <ellipse cx="30" cy="46" rx="8" ry="6" />
        <ellipse cx="62" cy="44" rx="6" ry="5" />
      </g>
      {/* 와인 핀 (Wine Red) */}
      <g fill="#8B1A2A">
        <circle cx="45" cy="20" r="1.3" />
        <circle cx="46" cy="22" r="1.3" />
        <circle cx="48" cy="24" r="1.3" />
        <circle cx="50" cy="22" r="1.3" />
        <circle cx="52" cy="20" r="1.3" />
        <circle cx="53" cy="24" r="1.3" />
        <circle cx="44" cy="24" r="1.3" />
        <circle cx="55" cy="26" r="1.3" />
      </g>
      <g fill="#C9A84C">
        <circle cx="78" cy="26" r="1.2" />
        <circle cx="76" cy="28" r="1.2" />
        <circle cx="22" cy="30" r="1.2" />
        <circle cx="31" cy="46" r="1.2" />
      </g>
    </svg>
  );
}
