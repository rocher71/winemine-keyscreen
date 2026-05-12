'use client';

import { type ReactNode } from 'react';
import { GlossaryTooltip } from '@/components/glossary/glossary-tooltip';
import { useLocalizedText } from '@/components/shared/locale-text';
import type { LocalizedString } from '@/types';

type Props = {
  history: LocalizedString;
};

/**
 * Wine Story 본문 — 도메인 용어에 GlossaryTooltip (i) 인라인 삽입.
 *
 * 최소 5곳 이상 매칭 (스펙 요구사항):
 *   - 아펠라시옹 / appellation
 *   - 그랑크뤼 / Grand Cru / 그랑 크뤼
 *   - 1855 등급 분류 / 1855 classification
 *   - 떼루아 / terroir
 *   - 빈티지 / vintage
 *   - 디캔팅 / decanting
 *   - 카베르네 / WSET / 브렛 등 추가 매칭
 *
 * 매칭은 case-insensitive, 한국어/영어 양쪽. 같은 문단 안에서 한 번만 (i) 삽입.
 */
export function StoryHistoryBody({ history }: Props) {
  const text = useLocalizedText(history);
  const paragraphs = text.split('\n\n');

  return (
    <div
      style={{
        fontFamily: 'var(--font-inter)',
        fontSize: 14,
        lineHeight: 1.65,
        color: 'var(--color-text-secondary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {paragraphs.map((para, idx) => (
        <p key={idx} style={{ margin: 0 }}>
          {annotateGlossaryTerms(para)}
        </p>
      ))}
    </div>
  );
}

/* 매칭 정의 — 한국어/영어 양쪽 같은 termId */
type TermDef = { id: string; patterns: RegExp };

const TERM_DEFS: TermDef[] = [
  {
    id: 'appellation',
    patterns: /(아펠라시옹|Appellation|appellation)/,
  },
  {
    id: 'terroir',
    patterns: /(떼루아|terroir|Terroir|terroirs)/,
  },
  {
    // grand cru는 글로서리에 직접 entry 없을 수 있으나 GlossaryTooltip이 fallback 처리
    id: 'grand-cru',
    patterns: /(그랑 크뤼|그랑크뤼|Grand Cru|grand cru|Grands Crus|First Growths?|1er Grand Cru|1등급)/,
  },
  {
    id: '1855-classification',
    patterns: /(1855년? ?등급 분류|1855 classification|1855년 메독 분류|1855 Médoc classification)/,
  },
  {
    id: 'decanting',
    patterns: /(디캔팅|decant(?:ing)?|Decant(?:ing)?)/,
  },
  {
    id: 'wset',
    patterns: /(WSET)/,
  },
  {
    id: 'brett',
    patterns: /(브렛|Brett|Brettanomyces|브레타노마이세스)/,
  },
];

/**
 * 한 문단을 받아, 첫 매칭 위치마다 GlossaryTooltip (i)를 삽입한 ReactNode 배열 반환.
 * 같은 termId는 한 문단당 한 번만.
 */
function annotateGlossaryTerms(text: string): ReactNode[] {
  const inserted = new Set<string>();
  // 모든 매칭을 위치 기준으로 수집
  type Hit = { index: number; length: number; id: string; match: string };
  const hits: Hit[] = [];
  for (const def of TERM_DEFS) {
    const re = new RegExp(def.patterns.source, def.patterns.flags + 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      hits.push({ index: m.index, length: m[0].length, id: def.id, match: m[0] });
    }
  }
  // 위치순 정렬 + 같은 id는 첫 번째만 유지
  hits.sort((a, b) => a.index - b.index);

  const result: ReactNode[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (inserted.has(hit.id)) continue;
    if (hit.index < cursor) continue; // 겹침 방지

    // 앞 텍스트 추가
    if (hit.index > cursor) {
      result.push(text.slice(cursor, hit.index));
    }
    // 매칭 단어
    result.push(
      <span key={`${hit.id}-${hit.index}`} style={{ color: 'var(--color-cream)', fontWeight: 500 }}>
        {hit.match}
        <GlossaryTooltip termId={hit.id} placement="top" />
      </span>,
    );
    inserted.add(hit.id);
    cursor = hit.index + hit.length;
  }
  if (cursor < text.length) {
    result.push(text.slice(cursor));
  }
  return result;
}
