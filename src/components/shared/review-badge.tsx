'use client';

import { Award } from 'lucide-react';

/**
 * 인라인 뱃지 아이콘 표시 — 이름 옆 한 글자 정도 크기.
 * 풀 뱃지 카드는 mock-data-architect의 mock/badges.ts에서 가져온다.
 *
 * mock 데이터가 아직 없는 동안에는 badgeId만 받아서 Award 아이콘으로 표시.
 * Phase C 이후 BADGES fixture를 조회해 정확한 아이콘·티어로 렌더하도록 확장.
 *
 * @example
 *   <ReviewBadge badgeId="palate-purist" size={16} />
 */
type Props = {
  badgeId: string;
  size?: number;
  /** Bronze/Silver/Gold/Platinum 티어 색 — fixture 연결 후 자동 결정 */
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
};

const TIER_COLOR: Record<NonNullable<Props['tier']>, string> = {
  bronze: '#B87333',
  silver: '#C0C0C0',
  gold: '#C9A84C',
  platinum: '#E5E4E2',
};

export function ReviewBadge({ badgeId, size = 16, tier = 'gold' }: Props) {
  return (
    <span
      aria-label={`Badge ${badgeId}`}
      title={badgeId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: TIER_COLOR[tier],
      }}
    >
      <Award size={size} strokeWidth={1.75} />
    </span>
  );
}
