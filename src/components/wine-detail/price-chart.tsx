'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Route } from 'next';
import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LocaleText } from '@/components/shared/locale-text';
import type { Purchase } from '@/types';

const PriceChartInner = dynamic(() => import('./price-chart-inner'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: 200,
        background: 'var(--color-bg-map)',
        borderRadius: 8,
        opacity: 0.4,
      }}
      aria-hidden
    />
  ),
});

type RangeKey = '3M' | '1Y' | 'ALL';

type Props = {
  wineId: string;
  purchases: Purchase[];
  /** /wine/[id]/prices 페이지에서 사용 시 height 큼, range 토글 숨김 등 */
  variant?: 'compact' | 'full';
};

/**
 * 가격 추이 카드 — Recharts LineChart (SSR 불가, dynamic import).
 *
 * variant:
 *  - 'compact' (기본): 240px 카드, /wine/[id]에 inline. 우상단 range 토글 + 우하단 "상세보기" 버튼.
 *  - 'full': /wine/[id]/prices 페이지용 큰 차트, range 토글, 상세보기 버튼 없음.
 */
export function PriceChart({ wineId, purchases, variant = 'compact' }: Props) {
  const [range, setRange] = useState<RangeKey>(variant === 'full' ? 'ALL' : '1Y');

  const filtered = useMemo(() => {
    if (range === 'ALL') return purchases;
    const now = Date.now();
    const cutoff =
      range === '3M' ? now - 1000 * 60 * 60 * 24 * 92 : now - 1000 * 60 * 60 * 24 * 366;
    return purchases.filter((p) => new Date(p.purchasedAt).getTime() >= cutoff);
  }, [purchases, range]);

  const dataset = filtered.length > 0 ? filtered : purchases;
  const isEmpty = dataset.length === 0;

  const isCompact = variant === 'compact';

  return (
    <section
      style={{
        margin: '0 16px',
        padding: 16,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 16,
      }}
    >
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
          <LocaleText value={{ ko: '가격 추이', en: 'Price history' }} />
        </h2>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['3M', '1Y', 'ALL'] as RangeKey[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              style={{
                padding: '4px 8px',
                background:
                  range === r ? 'var(--color-wine-red)' : 'var(--color-bg-map)',
                color: range === r ? 'var(--color-cream)' : 'var(--color-text-muted)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 8,
                fontFamily: 'var(--font-inter)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <div
          style={{
            height: isCompact ? 200 : 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
          }}
        >
          <LocaleText
            value={{
              ko: '아직 등록된 가격이 없어요',
              en: 'No purchases yet',
            }}
          />
        </div>
      ) : (
        <PriceChartInner purchases={dataset} height={isCompact ? 200 : 280} />
      )}

      {isCompact && (
        <div style={{ marginTop: 8, textAlign: 'right' }}>
          <Link
            href={`/wine/${wineId}/prices` as Route}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              background: 'transparent',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <LocaleText value={{ ko: '상세보기', en: 'View details' }} />
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      )}
    </section>
  );
}
