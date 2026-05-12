'use client';

import { Star, Info } from 'lucide-react';
import { LocaleText, useLocalizedText } from '@/components/shared/locale-text';
import { toast } from '@/hooks/use-toast';
import type { ExternalRating } from '@/types';

type Props = {
  rating: ExternalRating | undefined | null;
};

/**
 * 외부 평점 카드 — Vivino / Wine Searcher / CellarTracker + Global avg price.
 * rating이 null/undefined인 경우 빈 상태 표시.
 *
 * SPEC `external_ratings_card` 반영.
 */
export function ExternalRatingsCard({ rating }: Props) {
  const mockNoticeLabel = useLocalizedText({
    ko: '시안 mock 데이터입니다. 실제 API 미연동.',
    en: 'Mock data only — actual API not connected.',
  });

  if (!rating) {
    return (
      <section
        style={{
          margin: '0 16px',
          padding: 16,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 16,
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
          textAlign: 'center',
        }}
        aria-live="polite"
      >
        <LocaleText value={{ ko: '외부 평점 없음', en: 'No external ratings' }} />
      </section>
    );
  }

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
          <LocaleText value={{ ko: '외부 평점', en: 'External ratings' }} />
        </h2>
        {rating.globalAvgPriceUsd != null && (
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 10,
                color: 'var(--color-text-muted)',
              }}
            >
              <LocaleText value={{ ko: '글로벌 평균가', en: 'Global avg' }} />
            </div>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 18,
                color: 'var(--color-gold)',
                fontWeight: 600,
              }}
            >
              ${rating.globalAvgPriceUsd.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        {/* Vivino */}
        <RatingPill
          source="Vivino"
          score={
            rating.vivino ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                  color: 'var(--color-gold)',
                }}
              >
                <Star size={14} fill="var(--color-gold)" strokeWidth={0} />
                {rating.vivino.score.toFixed(1)}
              </span>
            ) : (
              <span style={{ color: 'var(--color-text-muted)' }}>—</span>
            )
          }
          sub={
            rating.vivino ? `${rating.vivino.reviewCount.toLocaleString()} reviews` : null
          }
        />
        {/* Wine Searcher */}
        <RatingPill
          source="Wine Searcher"
          score={
            rating.wineSearcher ? (
              <span style={{ color: 'var(--color-cream)' }}>
                {rating.wineSearcher.score}
                <span
                  style={{ fontSize: 11, color: 'var(--color-text-muted)' }}
                >
                  /100
                </span>
              </span>
            ) : (
              <span style={{ color: 'var(--color-text-muted)' }}>—</span>
            )
          }
          subLocalized={rating.wineSearcher?.priceRank ?? null}
        />
        {/* CellarTracker */}
        <RatingPill
          source="CellarTracker"
          score={
            rating.cellarTracker ? (
              <span style={{ color: 'var(--color-cream)' }}>
                {rating.cellarTracker.score}
                <span
                  style={{ fontSize: 11, color: 'var(--color-text-muted)' }}
                >
                  /100
                </span>
              </span>
            ) : (
              <span style={{ color: 'var(--color-text-muted)' }}>—</span>
            )
          }
          sub={
            rating.cellarTracker
              ? `${rating.cellarTracker.reviewCount.toLocaleString()} reviews`
              : null
          }
        />
      </div>

      {/* footer: lastSynced + mock notice */}
      <div
        style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-inter)',
          fontSize: 10,
          color: 'var(--color-text-muted)',
        }}
      >
        <LocaleText
          value={{
            ko: `마지막 동기화: ${rating.lastSyncedAt}`,
            en: `Last synced: ${rating.lastSyncedAt}`,
          }}
        />
        <button
          type="button"
          aria-label={mockNoticeLabel}
          onClick={() =>
            toast({
              message: {
                ko: '시안 mock 데이터입니다',
                en: 'Mock data only',
              },
            })
          }
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-gold)',
            cursor: 'pointer',
            padding: 2,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <Info size={12} strokeWidth={1.75} />
        </button>
      </div>
    </section>
  );
}

function RatingPill({
  source,
  score,
  sub,
  subLocalized,
}: {
  source: string;
  score: React.ReactNode;
  sub?: string | null;
  subLocalized?: import('@/types').LocalizedString | null;
}) {
  return (
    <div
      style={{
        padding: '10px 8px',
        background: 'var(--color-bg-map)',
        borderRadius: 10,
        border: '1px solid var(--color-border-default)',
        minHeight: 70,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 10,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {source}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--color-cream)',
          lineHeight: 1.1,
        }}
      >
        {score}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            color: 'var(--color-text-muted)',
          }}
        >
          {sub}
        </div>
      )}
      {subLocalized && (
        <LocaleText
          value={subLocalized}
          as="div"
          className="wm-rating-sub"
        />
      )}
    </div>
  );
}
