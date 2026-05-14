'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { getWine } from '@/lib/mock/wines';

/**
 * 헤비 모드 홈 — "작성 중인 노트 이어쓰기" CTA 카드.
 * variation-B (Activity-first) 시안에서 가져온 컴포넌트.
 * 시안 mock: 레 퓌셀 2019 · 90% 작성.
 */
const DRAFT_WINE_ID = 'bgy-puligny-montrachet';
const DRAFT_PROGRESS = 90;

export function DraftNoteResume() {
  const t = useTranslations('home.draftResume');
  const wine = getWine(DRAFT_WINE_ID);
  if (!wine) return null;

  /* 라벨: "레 퓌셀 2019" 정도의 짧은 핸들 */
  const shortName = wine.name.split(' ').slice(-2).join(' ');

  return (
    <Link
      href={`/notes/new/write?wineId=${DRAFT_WINE_ID}` as Route}
      data-feature-id="home.draftResume"
      style={{
        display: 'block',
        margin: '14px 16px 0',
        padding: '12px 14px',
        borderRadius: 14,
        background:
          'linear-gradient(135deg, rgba(139,26,42,0.45), var(--color-surface))',
        border: '1px solid rgba(139,26,42,0.55)',
        textDecoration: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            background: 'var(--color-bg-deep)',
            border: '1px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              color: 'var(--color-cream)',
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {t('title')}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              color: 'var(--color-text-secondary)',
              marginTop: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {shortName} {wine.vintage} · {t('progress', { value: DRAFT_PROGRESS })}
          </div>
        </div>
        <span
          style={{
            padding: '7px 12px',
            borderRadius: 999,
            border: '1px solid #C9A84C',
            color: '#C9A84C',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'var(--font-inter)',
            flexShrink: 0,
          }}
        >
          {t('cta')}
        </span>
      </div>
    </Link>
  );
}
