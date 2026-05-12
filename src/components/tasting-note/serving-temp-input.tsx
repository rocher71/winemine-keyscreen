'use client';

/**
 * ServingTempInput — NEW 베타 피드백.
 *
 * - 슬라이더 4~22°C, 0.5°C step
 * - 권장 범위 (`recommended`) 비교 → Gold 체크 / Wine Red 경고
 * - 카피 5단계: tooCold / slightlyCold / inRange / slightlyWarm / tooWarm
 *
 * Controlled component — 부모가 `value` 보유.
 */

import { useLocale } from '@/context/locale-context';
import type { ServingTempRange } from '@/types';

export interface ServingTempInputProps {
  value: number | null;
  onChange: (next: number | null) => void;
  recommended: ServingTempRange;
}

const COPY = {
  tooCold: { ko: '너무 차가워요', en: 'Too cold' },
  slightlyCold: { ko: '조금 차게', en: 'Slightly cold' },
  inRange: { ko: '권장 범위', en: 'In range' },
  slightlyWarm: { ko: '조금 따뜻해요', en: 'Slightly warm' },
  tooWarm: { ko: '너무 따뜻해요', en: 'Too warm' },
};

function classify(value: number, range: ServingTempRange): keyof typeof COPY {
  if (value < range.min - 3.5) return 'tooCold';
  if (value < range.min) return 'slightlyCold';
  if (value <= range.max) return 'inRange';
  if (value <= range.max + 3.5) return 'slightlyWarm';
  return 'tooWarm';
}

export function ServingTempInput({ value, onChange, recommended }: ServingTempInputProps) {
  const { locale } = useLocale();
  const v = value ?? Math.round((recommended.min + recommended.max) / 2);
  const bucket = classify(v, recommended);
  const inRange = bucket === 'inRange';

  return (
    <section style={{ display: 'grid', gap: 8 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-cream)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}
        >
          {locale === 'ko' ? '시음 온도' : 'Serving temperature'}
        </span>
        <span
          style={{
            fontSize: 12,
            color: inRange ? 'var(--color-gold)' : 'var(--color-wine-red-hover, #A02030)',
            fontWeight: 600,
          }}
        >
          {v.toFixed(1)}°C
        </span>
      </header>

      <input
        type="range"
        min={4}
        max={22}
        step={0.5}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: inRange ? 'var(--color-gold)' : 'var(--color-wine-red)' }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
        }}
      >
        <span style={{ color: 'var(--color-muted)' }}>
          {locale === 'ko'
            ? `권장 ${recommended.min}~${recommended.max}°C`
            : `Recommended ${recommended.min}-${recommended.max}°C`}
        </span>
        <span
          style={{
            color: inRange ? 'var(--color-gold)' : 'var(--color-wine-red-hover, #A02030)',
            fontWeight: 600,
          }}
        >
          {inRange ? '✓ ' : '⚠ '}
          {COPY[bucket][locale]}
        </span>
      </div>
    </section>
  );
}
