'use client';

import { LocaleText } from '@/components/shared/locale-text';
import { WMBottle } from '@/components/shared/wm-bottle';
import { ServingTempPill } from './serving-temp-pill';
import type { Wine } from '@/types';

type Props = {
  wine: Wine;
};

const WINE_TYPE_DOT: Record<string, string> = {
  red: '#8B1A2A',
  white: '#d6c46b',
  sparkling: '#e8d690',
  rosé: '#e89b9b',
  fortified: '#5a2218',
  dessert: '#a07030',
};

/**
 * 와인 상세 페이지 상단 히어로.
 * 디자인 시안 WineDetailScreen 스타일 — 라디얼 그라데이션 + WMBottle 중앙 배치.
 */
export function WineHeader({ wine }: Props) {
  const dotColor = WINE_TYPE_DOT[wine.wineType] ?? '#8B1A2A';

  return (
    <section style={{ position: 'relative', padding: '0 16px 20px' }}>
      {/* 히어로 영역 — 라디얼 그라데이션 + 병 */}
      <div
        aria-hidden
        style={{
          background: `radial-gradient(ellipse at center top, ${wine.bottleColor}35 0%, var(--color-bg-deep) 70%)`,
          display: 'flex',
          justifyContent: 'center',
          padding: '32px 0 24px',
          borderRadius: 18,
          border: '1px solid var(--color-border-default)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 서빙 온도 칩 */}
        <div style={{ position: 'absolute', right: 12, bottom: 12 }}>
          <ServingTempPill min={wine.servingTempCelsius.min} max={wine.servingTempCelsius.max} />
        </div>

        <WMBottle
          bottleColor={wine.bottleColor}
          producer={wine.producer.ko || wine.producer.en}
          label={wine.name.split(' ')[0]}
          vintage={wine.vintage}
          width={88}
          height={290}
        />
      </div>

      {/* 텍스트 메타 */}
      <div style={{ marginTop: 16 }}>
        {/* 와인 타입 dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: dotColor, display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
            {wine.wineType}
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontSize: 24,
            fontWeight: 400,
            color: 'var(--color-cream)',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}
        >
          {wine.name}
        </h1>
        <p
          style={{
            margin: '4px 0 0',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            color: 'var(--color-text-secondary)',
          }}
        >
          <LocaleText value={wine.producer} as="span" />
        </p>
        <p
          style={{
            margin: '6px 0 0',
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
          }}
        >
          <LocaleText value={wine.region} as="span" /> · <LocaleText value={wine.country} as="span" />
          <br />
          {wine.vintage} · {wine.grapes.map((g) => g.en).join(', ')}
        </p>
      </div>
    </section>
  );
}
