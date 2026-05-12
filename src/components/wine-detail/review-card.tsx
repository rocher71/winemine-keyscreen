'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Star } from 'lucide-react';
import { LocaleText } from '@/components/shared/locale-text';
import { LevelPill } from '@/components/shared/level-pill';
import { ReviewBadge } from '@/components/shared/review-badge';
import { getUserById } from '@/lib/mock/users';
import { getLevel } from '@/lib/mock/levels';
import { getBadge } from '@/lib/mock/badges';
import type { Review } from '@/types';

type Props = {
  review: Review;
};

/**
 * Community Review Inline Card.
 *
 * CRITICAL: SPEC `community_review_inline` 규칙 — LevelPill + ReviewBadge 동반 표시.
 * 닉네임 단독 노출 금지. 두 컴포넌트가 항상 함께.
 *
 * - 상단 행: 닉네임 + LevelPill + ReviewBadge × up to 2
 * - 본문 (LocalizedString)
 * - 우하단: 평점 (별점 또는 100점) + 작성일
 * - 클릭 시 /profile/[userId]
 */
export function ReviewCard({ review }: Props) {
  const user = getUserById(review.userId);
  const levelId = (user?.levelId ?? 2) as 1 | 2 | 3 | 4 | 5;
  const level = getLevel(levelId);
  // 뱃지 — 사용자 보유 뱃지 중 최대 2개 inline (시안 mock)
  const badgeIds = user?.badges?.slice(0, 2) ?? ['badge_001'];

  const isExpert = review.mode === 'expert';

  return (
    <Link
      href={`/profile/${review.userId}` as Route}
      style={{
        display: 'block',
        padding: 14,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 12,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* 상단 행: 닉네임 + LevelPill + ReviewBadge — 동반 표시 (CRITICAL) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--color-cream)',
          }}
        >
          {user ? (
            <LocaleText value={user.displayName} />
          ) : (
            <LocaleText value={{ ko: '익명 사용자', en: 'Anonymous' }} />
          )}
        </span>
        <LevelPill level={levelId} label={level.name.en} />
        {badgeIds.map((bid) => {
          const b = getBadge(bid);
          return (
            <ReviewBadge
              key={bid}
              badgeId={bid}
              tier={(b?.tier ?? 'gold') as 'bronze' | 'silver' | 'gold' | 'platinum'}
            />
          );
        })}
      </div>

      {/* 본문 */}
      <LocaleText
        value={review.body}
        as="p"
        className="wm-review-body"
      />

      {/* 하단: 평점 + 작성일 */}
      <div
        style={{
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
        }}
      >
        <span style={{ color: 'var(--color-text-muted)' }}>{review.createdAt}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {isExpert ? (
            <strong style={{ color: 'var(--color-gold)', fontSize: 13 }}>
              {review.rating}/100
            </strong>
          ) : (
            <>
              <Star size={12} fill="var(--color-gold)" strokeWidth={0} />
              <strong style={{ color: 'var(--color-cream)', fontSize: 13 }}>
                {review.rating}/5
              </strong>
            </>
          )}
        </span>
      </div>
    </Link>
  );
}
