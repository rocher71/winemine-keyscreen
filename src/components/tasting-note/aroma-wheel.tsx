'use client';

/**
 * AromaWheel — 320×320 SVG 원형 휠 + 어휘 칩 패널.
 * handover doc §5.2.
 *
 * - 12 wedge (AROMA_CATEGORIES)
 * - 내부 state: activeCat (초기값 'fruity'), hoveredLex (툴팁용)
 * - AROMA_LEXICON을 variant로 필터 (appliesTo)
 * - lex 칩 hover/tap → ImpactCompound 한 줄 설명 툴팁
 */

import { useMemo, useState } from 'react';
import {
  AROMA_CATEGORIES,
  AROMA_LEXICON,
  IMPACT_BY_ID,
  type AromaCategoryId,
  type FormVariant,
  type LexEntry,
} from '@/lib/tasting-note-lexicon';
import { useLocale } from '@/context/locale-context';

export interface AromaWheelProps {
  variant: FormVariant;
  selected: string[];
  onToggle: (lexId: string) => void;
  /** 옵션 — 외부에서 카테고리 강제 펼치기 (예: RegionalAromaHints 칩 클릭) */
  forcedCategory?: AromaCategoryId;
}

const SIZE = 320;
const CENTER = SIZE / 2;
const OUTER_R = 150;
const INNER_R = 60;
const N = 12;
const SEG = (Math.PI * 2) / N;

function polar(r: number, angle: number) {
  return {
    x: CENTER + r * Math.cos(angle - Math.PI / 2),
    y: CENTER + r * Math.sin(angle - Math.PI / 2),
  };
}

function wedgePath(i: number) {
  const a0 = i * SEG;
  const a1 = (i + 1) * SEG;
  const p0 = polar(OUTER_R, a0);
  const p1 = polar(OUTER_R, a1);
  const p2 = polar(INNER_R, a1);
  const p3 = polar(INNER_R, a0);
  return `M ${p0.x} ${p0.y} A ${OUTER_R} ${OUTER_R} 0 0 1 ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${INNER_R} ${INNER_R} 0 0 0 ${p3.x} ${p3.y} Z`;
}

export function AromaWheel({ variant, selected, onToggle, forcedCategory }: AromaWheelProps) {
  const { locale } = useLocale();
  const [activeCat, setActiveCat] = useState<AromaCategoryId>('fruity');
  const [hoveredLex, setHoveredLex] = useState<string | null>(null);

  const effectiveCat = forcedCategory ?? activeCat;

  const filteredLex = useMemo<LexEntry[]>(
    () =>
      AROMA_LEXICON.filter(
        (l) =>
          l.category === effectiveCat &&
          (l.appliesTo?.includes(variant) ?? true),
      ),
    [effectiveCat, variant],
  );

  const hoveredImpact = hoveredLex
    ? AROMA_LEXICON.find((l) => l.id === hoveredLex)?.impactCompound
    : null;
  const impact = hoveredImpact ? IMPACT_BY_ID[hoveredImpact] : null;

  return (
    <section style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <h3
        style={{
          margin: 0,
          fontFamily: 'var(--font-playfair)',
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--color-cream)',
          alignSelf: 'flex-start',
        }}
      >
        {locale === 'ko' ? '아로마 휠' : 'Aroma wheel'}
      </h3>

      <div
        style={{ position: 'relative', width: SIZE, height: SIZE }}
        role="group"
        aria-label="Aroma wheel"
      >
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {AROMA_CATEGORIES.map((cat, i) => {
            const active = cat.id === effectiveCat;
            return (
              <g key={cat.id}>
                <path
                  d={wedgePath(i)}
                  fill={cat.color}
                  opacity={active ? 1 : 0.42}
                  stroke="var(--color-deep-dark, #0A050F)"
                  strokeWidth={1.2}
                  style={{ cursor: 'pointer', transition: 'opacity 160ms ease' }}
                  onClick={() => setActiveCat(cat.id)}
                  aria-label={cat[locale]}
                />
              </g>
            );
          })}
          <circle cx={CENTER} cy={CENTER} r={INNER_R - 2} fill="var(--color-deepest-dark, #05020A)" />
          <text
            x={CENTER}
            y={CENTER + 4}
            textAnchor="middle"
            style={{
              fill: 'var(--color-gold)',
              fontFamily: 'var(--font-playfair)',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {AROMA_CATEGORIES.find((c) => c.id === effectiveCat)?.[locale]}
          </text>
        </svg>
      </div>

      {/* 어휘 칩 패널 */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          minHeight: 32,
        }}
      >
        {filteredLex.length === 0 ? (
          <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>
            {locale === 'ko'
              ? '이 양식에 적용 가능한 어휘가 없습니다.'
              : 'No lexicon entries for this variant.'}
          </span>
        ) : (
          filteredLex.map((lex) => {
            const active = selected.includes(lex.id);
            return (
              <button
                key={lex.id}
                type="button"
                onClick={() => onToggle(lex.id)}
                onMouseEnter={() => setHoveredLex(lex.id)}
                onMouseLeave={() => setHoveredLex((c) => (c === lex.id ? null : c))}
                onFocus={() => setHoveredLex(lex.id)}
                onBlur={() => setHoveredLex((c) => (c === lex.id ? null : c))}
                aria-pressed={active}
                style={{
                  background: active ? 'var(--color-gold)' : 'transparent',
                  color: active ? 'var(--color-deepest-dark, #05020A)' : 'var(--color-secondary)',
                  border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border)'}`,
                  padding: '5px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {locale === 'ko' ? lex.ko : lex.en}
              </button>
            );
          })
        )}
      </div>

      {impact ? (
        <div
          style={{
            width: '100%',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            padding: 10,
            fontSize: 12,
            color: 'var(--color-secondary)',
          }}
        >
          <div style={{ color: 'var(--color-gold)', fontWeight: 600, marginBottom: 2 }}>
            {impact.name} <span style={{ opacity: 0.7 }}>({impact.chemistry})</span>
          </div>
          <div>{impact.note}</div>
          <div style={{ opacity: 0.7, marginTop: 2 }}>
            {locale === 'ko' ? '역치' : 'Threshold'}: {impact.threshold}
          </div>
        </div>
      ) : null}
    </section>
  );
}
