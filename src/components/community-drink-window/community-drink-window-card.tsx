'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight, Users } from 'lucide-react';
import { useMemo } from 'react';
import { LocaleText } from '@/components/shared/locale-text';
import { PeakDistribution } from './peak-distribution';
import type { CommunityPeakAggregate } from '@/types';

type Props = {
  wineId: string;
  aggregate: CommunityPeakAggregate;
};

/**
 * 커뮤니티 음용 적기 카드 — /wine/[id] 인라인.
 *
 * - 히스토그램 + 시스템/평균/중앙값 마커
 * - 상단 큰 텍스트 "평균 / 중앙값"
 * - 분포 한 줄 카피
 * - 우하단 "상세 보기" → /wine/[id]/community-peak
 * - count 0이면 빈 상태
 */
export function CommunityDrinkWindowCard({ wineId, aggregate }: Props) {
  const isEmpty = aggregate.count === 0;

  // 분포 카피 계산 — 평균 ±2년 구간 응답 비율
  const distCopy = useMemo(() => {
    if (isEmpty) return null;
    const mean = Math.round(aggregate.meanPeakYear);
    const minYear = mean - 2;
    const maxYear = mean + 2;
    const sumIn = aggregate.distribution
      .filter((p) => p.year >= minYear && p.year <= maxYear)
      .reduce((s, p) => s + p.count, 0);
    const sumAll = aggregate.distribution.reduce((s, p) => s + p.count, 0);
    const pct = sumAll > 0 ? Math.round((sumIn / sumAll) * 100) : 0;
    return { pct, minYear, maxYear };
  }, [aggregate, isEmpty]);

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
          gap: 6,
          marginBottom: 6,
        }}
      >
        <Users size={16} strokeWidth={1.75} color="var(--color-gold)" />
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--color-cream)',
          }}
        >
          <LocaleText
            value={{ ko: '커뮤니티 음용 적기', en: 'Community drinking window' }}
          />
        </h2>
      </div>

      <p
        style={{
          margin: '0 0 12px',
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: 'var(--color-text-muted)',
        }}
      >
        <LocaleText
          value={{
            ko: `전문가 ${aggregate.count}명이 추정한 절정 시점`,
            en: `Estimated by ${aggregate.count} experts (L3+)`,
          }}
        />
      </p>

      {isEmpty ? (
        <div
          style={{
            padding: '32px 16px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
          }}
        >
          <LocaleText
            value={{
              ko: '아직 추정 데이터가 부족해요. 전문가 노트에서 입력해주세요',
              en: 'Not enough data. Add an estimate in your expert note.',
            }}
          />
        </div>
      ) : (
        <>
          {/* 큰 평균 / 중앙값 */}
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--color-cream)',
              marginBottom: 8,
            }}
          >
            <LocaleText
              value={{
                ko: `평균 ${Math.round(aggregate.meanPeakYear)} · 중앙값 ${aggregate.medianPeakYear}`,
                en: `Mean ${Math.round(aggregate.meanPeakYear)} · Median ${aggregate.medianPeakYear}`,
              }}
            />
          </div>

          {/* Histogram */}
          <PeakDistribution aggregate={aggregate} height={180} showLegend />

          {/* 분포 카피 */}
          {distCopy && (
            <p
              style={{
                margin: '10px 0 0',
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
              }}
            >
              <LocaleText
                value={{
                  ko: `${aggregate.count}명 중 ${distCopy.pct}%가 ${distCopy.minYear}~${distCopy.maxYear} 사이 추천`,
                  en: `${distCopy.pct}% of ${aggregate.count} reviewers suggest ${distCopy.minYear}-${distCopy.maxYear}`,
                }}
              />
            </p>
          )}
        </>
      )}

      {/* 상세 보기 */}
      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <Link
          href={`/wine/${wineId}/community-peak` as Route}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 10px',
            color: 'var(--color-gold)',
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <LocaleText value={{ ko: '상세 보기', en: 'Details' }} />
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
