'use client';

import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { getCommunityUser } from '@/lib/mock/community-posts';

/**
 * 커뮤니티 유저 아바타.
 * 레벨별 그라디언트 배경:
 *   1 = gray, 2 = blue-ish, 3 = silver, 4 = gold, 5 = wine+darker
 */

function levelGradient(level: number): string {
  switch (level) {
    case 1: return 'linear-gradient(135deg, #555560, #2a2a35)';
    case 2: return 'linear-gradient(135deg, #4a6fa5, #1a2a45)';
    case 3: return 'linear-gradient(135deg, #b8b8c0, #3a3a48)';
    case 4: return 'linear-gradient(135deg, #C9A84C, #0F0718)';
    case 5: return 'linear-gradient(135deg, #8B1A2A, #3a0810)';
    default: return 'linear-gradient(135deg, #555560, #2a2a35)';
  }
}

function levelBorderColor(level: number): string {
  switch (level) {
    case 1: return '#55556088';
    case 2: return '#4a6fa588';
    case 3: return '#b8b8c088';
    case 4: return '#C9A84C88';
    case 5: return '#8B1A2A88';
    default: return '#55556088';
  }
}

type Props = {
  userId: string;
  size?: number;
  /** 프로필 링크를 비활성화하고 싶을 때 (예: 본인 작성 컴포저 미리보기) */
  asLink?: boolean;
};

export function CommUserAvatar({ userId, size = 36, asLink = true }: Props) {
  const user = getCommunityUser(userId);
  const router = useRouter();
  if (!user) return null;

  const baseStyle: CSSProperties = {
    width: size,
    height: size,
    borderRadius: 999,
    flexShrink: 0,
    background: levelGradient(user.level),
    border: `1px solid ${levelBorderColor(user.level)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-cream)',
    fontFamily: 'var(--font-playfair)',
    fontSize: Math.round(size * 0.42),
    fontWeight: 700,
    textDecoration: 'none',
  };

  if (asLink) {
    /* button + programmatic navigation — 부모 Link 카드 안에서도 안전 (중첩 <a> 회피) */
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/profile/${userId}`);
        }}
        aria-label={`${user.name} 프로필`}
        style={{ ...baseStyle, padding: 0, cursor: 'pointer' }}
      >
        {user.initial}
      </button>
    );
  }
  return <div style={baseStyle}>{user.initial}</div>;
}
