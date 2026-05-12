'use client';

import { LocaleText } from '@/components/shared/locale-text';
import { ServingTempPill } from './serving-temp-pill';
import type { Wine } from '@/types';

type Props = {
  wine: Wine;
};

/**
 * 와인 상세 페이지 상단 240px 헤더.
 * - 라벨 일러스트 (bottleColor 그라데이션 + SVG, 외부 이미지 X)
 * - 와인명 / 생산자 / 빈티지 / 지역·국가
 * - wineType + grape 칩 행
 * - 우하단 ServingTemp 미니 칩
 */
export function WineHeader({ wine }: Props) {
  const labelGradient = `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 70%)`;

  return (
    <section
      style={{
        position: 'relative',
        padding: '0 16px 20px',
      }}
    >
      {/* 라벨 일러 240px */}
      <div
        aria-hidden
        style={{
          height: 240,
          borderRadius: 18,
          background: labelGradient,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          border: '1px solid var(--color-border-default)',
        }}
      >
        {/* SVG 보틀 일러 — 외부 이미지 X */}
        <svg
          viewBox="0 0 200 240"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <linearGradient id="wm-bottle-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={wine.bottleColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="wm-bottle-hi" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* bottle body */}
          <path
            d="M88 24 L88 72 Q72 96 72 140 L72 220 Q72 232 84 232 L116 232 Q128 232 128 220 L128 140 Q128 96 112 72 L112 24 Z"
            fill="url(#wm-bottle-grad)"
          />
          {/* neck cap */}
          <rect x="86" y="20" width="28" height="10" fill="#0a050f" rx="2" />
          {/* highlight */}
          <rect x="78" y="110" width="14" height="100" fill="url(#wm-bottle-hi)" rx="8" />
          {/* label */}
          <rect
            x="76"
            y="146"
            width="48"
            height="56"
            fill="var(--color-cream)"
            opacity="0.94"
            rx="2"
          />
          <text
            x="100"
            y="170"
            fill="var(--color-wine-red)"
            fontFamily="serif"
            fontSize="8"
            fontWeight="700"
            textAnchor="middle"
          >
            {wine.vintage}
          </text>
          <text
            x="100"
            y="184"
            fill="#05020A"
            fontFamily="serif"
            fontSize="6"
            fontWeight="600"
            textAnchor="middle"
          >
            wine
          </text>
          <text
            x="100"
            y="194"
            fill="#05020A"
            fontFamily="serif"
            fontSize="4"
            fontStyle="italic"
            textAnchor="middle"
          >
            est.
          </text>
        </svg>

        {/* 우하단 ServingTemp 칩 — 라벨 일러 위 */}
        <div style={{ position: 'absolute', right: 12, bottom: 12 }}>
          <ServingTempPill min={wine.servingTempCelsius.min} max={wine.servingTempCelsius.max} />
        </div>
      </div>

      {/* 텍스트 메타 */}
      <div style={{ marginTop: 16 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--color-cream)',
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
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
          <LocaleText value={wine.producer} as="span" /> · {wine.vintage}
        </p>
        <p
          style={{
            margin: '4px 0 0',
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          <LocaleText value={wine.region} as="span" /> ·{' '}
          <LocaleText value={wine.country} as="span" />
        </p>
      </div>

      {/* 칩 행: wineType + grapes */}
      <div
        style={{
          marginTop: 12,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
        }}
      >
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 999,
            background: 'var(--color-wine-red)',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {wine.wineType}
        </span>
        {wine.grapes.map((grape, i) => (
          <span
            key={i}
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
            }}
          >
            <LocaleText value={grape} />
          </span>
        ))}
      </div>
    </section>
  );
}
