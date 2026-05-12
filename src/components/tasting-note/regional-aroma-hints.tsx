'use client';

/**
 * RegionalAromaHints — NEW 베타 피드백.
 *
 * - props: wine (전체 Wine 객체)
 * - `getRegionalAromasForWine(wine)` 호출 → lex id 배열
 * - 3~6개 시그니처 칩 노출 (LEX_BY_ID로 ko/en 라벨)
 * - 칩 클릭 시 부모(note-write-expert)의 AromaWheel selected에 추가
 * - 헤더: "이 지역에서 자주 나타나는 향 / Typical for this region"
 *
 * lexicon에 없는 lex id는 자동 skip (콘솔 경고는 lib/regional-aromas.ts의 sanitize가 처리).
 */

import { useMemo } from 'react';
import { LEX_BY_ID } from '@/lib/tasting-note-lexicon';
import { getRegionalAromasForWine } from '@/lib/regional-aromas';
import { useLocale } from '@/context/locale-context';
import type { Wine } from '@/types';

export interface RegionalAromaHintsProps {
  wine: Wine;
  selected: string[];
  onToggle: (lexId: string) => void;
  /** 최대 노출 칩 수 (기본 6) */
  limit?: number;
}

export function RegionalAromaHints({ wine, selected, onToggle, limit = 6 }: RegionalAromaHintsProps) {
  const { locale } = useLocale();

  const lexIds = useMemo(() => {
    const ids = getRegionalAromasForWine(wine);
    // signatureAromaLexIds도 함께 활용 — wine 자체 시그니처 우선
    const merged = [...(wine.signatureAromaLexIds ?? []), ...ids];
    // dedupe + lexicon 존재 검증
    const seen = new Set<string>();
    const valid: string[] = [];
    for (const id of merged) {
      if (seen.has(id)) continue;
      if (!LEX_BY_ID[id]) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[RegionalAromaHints] lex id "${id}" not in lexicon — skipped`);
        }
        continue;
      }
      seen.add(id);
      valid.push(id);
      if (valid.length >= limit) break;
    }
    return valid;
  }, [wine, limit]);

  if (lexIds.length === 0) return null;

  return (
    <section
      style={{
        background: 'rgba(201,168,76,0.06)',
        border: '1px solid rgba(201,168,76,0.30)',
        borderRadius: 12,
        padding: 12,
        display: 'grid',
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.10em',
          color: 'var(--color-gold)',
        }}
      >
        {locale === 'ko' ? '이 지역에서 자주 나타나는 향' : 'Typical for this region'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {lexIds.map((id) => {
          const lex = LEX_BY_ID[id];
          const active = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => onToggle(id)}
              aria-pressed={active}
              style={{
                background: active ? 'var(--color-gold)' : 'transparent',
                color: active ? 'var(--color-deepest-dark, #05020A)' : 'var(--color-cream)',
                border: `1px solid ${active ? 'var(--color-gold)' : 'rgba(201,168,76,0.50)'}`,
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
        })}
      </div>
    </section>
  );
}
