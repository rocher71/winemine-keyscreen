/**
 * Community Peak Aggregator
 *
 * CommunityPeakEstimate[] → CommunityPeakAggregate (가중 평균/중앙값/분포).
 *
 * 가중치 (SPEC + 베타 피드백 정책):
 *   L3 = 1.0
 *   L4 = 1.5
 *   L5 = 2.0
 *
 * 사용처: /wine/[id]/community-peak 페이지의 히스토그램 + 시스템 peak 비교 카드.
 */

import type { CommunityPeakAggregate, CommunityPeakEstimate } from '@/types';
import { COMMUNITY_PEAKS, SYSTEM_PEAKS_BY_WINE } from './mock/community-peaks';

export const PEAK_WEIGHTS: Record<3 | 4 | 5, number> = {
  3: 1.0,
  4: 1.5,
  5: 2.0,
};

function weightOf(level: number): number {
  if (level === 5) return PEAK_WEIGHTS[5];
  if (level === 4) return PEAK_WEIGHTS[4];
  return PEAK_WEIGHTS[3];
}

/**
 * estimates → aggregate.
 *   meanPeakYear: 가중 평균
 *   medianPeakYear: 가중 중앙값 (정렬 후 누적 가중치가 totalWeight/2을 처음 넘는 항목)
 *   distribution: 연도별 가중 응답 수 (정수 연도로 반올림)
 *   systemPeakYear: SYSTEM_PEAKS_BY_WINE[wineId] (없으면 0)
 */
export function aggregateCommunityPeaks(
  wineId: string,
  estimates: CommunityPeakEstimate[],
): CommunityPeakAggregate {
  const filtered = estimates.filter((e) => e.wineId === wineId);
  const totalWeight = filtered.reduce((sum, e) => sum + weightOf(e.reviewerLevel), 0);

  // 가중 평균
  const weightedSum = filtered.reduce(
    (sum, e) => sum + e.estimatedPeakYear * weightOf(e.reviewerLevel),
    0,
  );
  const meanPeakYear = totalWeight > 0 ? weightedSum / totalWeight : 0;

  // 가중 중앙값
  const sorted = [...filtered].sort((a, b) => a.estimatedPeakYear - b.estimatedPeakYear);
  let cumulative = 0;
  let medianPeakYear = 0;
  for (const e of sorted) {
    cumulative += weightOf(e.reviewerLevel);
    if (cumulative >= totalWeight / 2) {
      medianPeakYear = e.estimatedPeakYear;
      break;
    }
  }

  // 연도별 가중 분포
  const distMap = new Map<number, number>();
  for (const e of filtered) {
    const y = e.estimatedPeakYear;
    distMap.set(y, (distMap.get(y) ?? 0) + weightOf(e.reviewerLevel));
  }
  const distribution = Array.from(distMap.entries())
    .map(([year, count]) => ({ year, count: Math.round(count * 10) / 10 }))
    .sort((a, b) => a.year - b.year);

  return {
    wineId,
    count: filtered.length,
    meanPeakYear: Math.round(meanPeakYear * 10) / 10,
    medianPeakYear,
    distribution,
    systemPeakYear: SYSTEM_PEAKS_BY_WINE[wineId] ?? 0,
  };
}

/** 페이지에서 한 줄로 호출 가능한 헬퍼 — 내부 COMMUNITY_PEAKS 사용. */
export function getCommunityPeakAggregate(wineId: string): CommunityPeakAggregate {
  return aggregateCommunityPeaks(wineId, COMMUNITY_PEAKS);
}
