'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import type { Route } from 'next';

/**
 * 메인 화면 상단 헤더.
 * - 56px 높이, padding 0 20px
 * - 좌측: winemine 로고 (Playfair 22px, letter-spacing -0.02em, Cream)
 * - 우측: 알림 벨 (Bell 20px) + 아바타 (36×36 Wine Red 원형, Cream 글자, 좌상단 레벨 미니 뱃지 16×16)
 *
 * 알림 미읽음 여부와 사용자 정보는 props로 받음. provider 의존 없이 동작 가능 (Phase C에서 useMockUser로 연결).
 */
type Props = {
  hasUnreadNotification?: boolean;
  avatarInitial?: string;
  levelId?: number | null;
};

export function AppHeader({
  hasUnreadNotification = false,
  avatarInitial = 'W',
  levelId = null,
}: Props) {
  return (
    <header
      style={{
        height: 56,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <Link
        href={'/' as Route}
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 400,
          fontSize: 22,
          letterSpacing: '-0.02em',
          color: 'var(--color-cream)',
          textDecoration: 'none',
          lineHeight: 1,
        }}
      >
        winemine
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* 알림 벨 */}
        <Link
          href={'/notifications' as Route}
          aria-label="Notifications"
          style={{
            position: 'relative',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Bell size={20} strokeWidth={1.75} />
          {hasUnreadNotification && (
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: 8,
                right: 7,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'var(--color-wine-red)',
                border: '1.5px solid var(--color-bg-deepest)',
              }}
            />
          )}
        </Link>

        {/* 아바타 + 레벨 미니 뱃지 */}
        <Link
          href={'/profile' as Route}
          aria-label="Profile"
          style={{
            position: 'relative',
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'var(--color-wine-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          {avatarInitial}
          {levelId != null && (
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: -4,
                left: -4,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: 'var(--color-gold)',
                color: 'var(--color-bg-deepest)',
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                fontSize: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                border: '1.5px solid var(--color-bg-deepest)',
              }}
            >
              {levelId}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
