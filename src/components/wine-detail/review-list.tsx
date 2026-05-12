'use client';

import { useMemo, useState } from 'react';
import { LocaleText } from '@/components/shared/locale-text';
import { ReviewCard } from './review-card';
import type { Review } from '@/types';

type SortKey = 'recent' | 'rating';

type Props = {
  reviews: Review[];
};

/**
 * 리뷰 섹션 — 정렬 토글 + 카드 리스트.
 * 빈 컬렉션이면 안내 카피.
 */
export function ReviewList({ reviews }: Props) {
  const [sort, setSort] = useState<SortKey>('recent');

  const sorted = useMemo(() => {
    const arr = [...reviews];
    if (sort === 'recent') {
      arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      // rating 정렬 — beginner는 0~5, expert는 0~100. 정규화해서 비교.
      arr.sort((a, b) => {
        const aN = a.mode === 'expert' ? a.rating / 100 : a.rating / 5;
        const bN = b.mode === 'expert' ? b.rating / 100 : b.rating / 5;
        return bN - aN;
      });
    }
    return arr;
  }, [reviews, sort]);

  return (
    <section style={{ margin: '0 16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--color-cream)',
          }}
        >
          <LocaleText value={{ ko: '리뷰', en: 'Reviews' }} />
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 6 }}>
            {reviews.length}
          </span>
        </h2>
        <div style={{ display: 'flex', gap: 4 }}>
          <SortBtn
            label={{ ko: '최근', en: 'Recent' }}
            active={sort === 'recent'}
            onClick={() => setSort('recent')}
          />
          <SortBtn
            label={{ ko: '평점 높은 순', en: 'Top rated' }}
            active={sort === 'rating'}
            onClick={() => setSort('rating')}
          />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
          }}
        >
          <LocaleText
            value={{ ko: '아직 리뷰가 없어요', en: 'No reviews yet' }}
          />
        </div>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {sorted.slice(0, 5).map((r) => (
            <li key={r.id}>
              <ReviewCard review={r} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SortBtn({
  label,
  active,
  onClick,
}: {
  label: import('@/types').LocalizedString;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '4px 10px',
        background: active ? 'var(--color-wine-red)' : 'var(--color-bg-map)',
        color: active ? 'var(--color-cream)' : 'var(--color-text-muted)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 8,
        fontFamily: 'var(--font-inter)',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      <LocaleText value={label} />
    </button>
  );
}
