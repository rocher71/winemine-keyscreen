'use client';

import Link from 'next/link';
import type { Route } from 'next';
import type { CSSProperties } from 'react';
import { useLocale } from '@/context/locale-context';

type Props = {
  hasUnreadNotification?: boolean;
  avatarInitial?: string;
  levelId?: number | null;
};

/** 와인잔 SVG 로고 마크 */
function WMLogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden style={{ display: 'block', flexShrink: 0 }}>
      {/* 와인잔 외곽선 */}
      <path
        d="M9 5h14c0 7-3.5 11-7 11.5V25h4v2H12v-2h4v-8.5C12.5 16 9 12 9 5z"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 와인 fill (Wine Red) */}
      <path
        d="M11 6h10c0 5-2.5 8-5 8.5C13.5 14 11 11 11 6z"
        fill="#8B1A2A"
        opacity="0.9"
      />
    </svg>
  );
}

/** "wine·mine" 워드마크 */
function WMLogoWordmark({ size = 18 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-playfair)',
        fontSize: size,
        color: 'var(--color-cream)',
        letterSpacing: '-0.01em',
        fontWeight: 500,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      wine
      <span style={{ color: '#C9A84C', margin: '0 0.5px' }}>·</span>
      mine
    </span>
  );
}

/** 레벨 칩 (L4 · 골드) */
const LEVEL_NAMES_KO: Record<number, string> = {
  1: '브론즈', 2: '실버', 3: '골드', 4: '골드', 5: '마스터',
};
const LEVEL_NAMES_EN: Record<number, string> = {
  1: 'Bronze', 2: 'Silver', 3: 'Gold', 4: 'Gold', 5: 'Master',
};

function LevelChip({ levelId, initial }: { levelId: number; initial: string }) {
  const { locale } = useLocale();
  const LEVEL_COLORS: Record<number, string> = {
    1: '#a87341',
    2: '#b8b8c0',
    3: '#C9A84C',
    4: '#C9A84C',
    5: '#8B1A2A',
  };
  const levelNames = locale === 'ko' ? LEVEL_NAMES_KO : LEVEL_NAMES_EN;
  const color = LEVEL_COLORS[levelId] ?? '#C9A84C';
  const name = levelNames[levelId] ?? '';
  return (
    <Link
      href={'/profile' as Route}
      aria-label={`Level ${levelId} · Profile`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 32,
        padding: '0 10px 0 4px',
        borderRadius: 999,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      {/* 아바타 원형 */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          background: `linear-gradient(135deg, ${color}, ${color}99)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-playfair)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--color-bg-deepest)',
          flexShrink: 0,
        }}
      >
        {initial}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          color,
          fontWeight: 600,
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}
      >
        L{levelId}
      </span>
    </Link>
  );
}

/** 알림 벨 버튼 */
function BellButton({ hasUnread }: { hasUnread: boolean }) {
  const { locale } = useLocale();
  const btnStyle: CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: 'transparent',
    border: 'none',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    flexShrink: 0,
  };
  return (
    <Link href={'/notifications' as Route} aria-label={locale === 'ko' ? '알림' : 'Notifications'} style={btnStyle}>
      {/* Bell SVG (monoline) */}
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 16V10a6 6 0 0 1 12 0v6l1.5 2H4.5z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
        {hasUnread && (
          <circle cx="18" cy="6" r="2.5" fill="#8B1A2A" stroke="none" />
        )}
      </svg>
    </Link>
  );
}

/**
 * 메인 화면 상단 헤더.
 * - WMLogoMark (와인잔 SVG) + "wine·mine" 워드마크
 * - 우측: 알림 벨 + 레벨 칩 (heavy) 또는 아바타 링크 (first-time)
 */
export function AppHeader({
  hasUnreadNotification = false,
  avatarInitial = 'W',
  levelId = null,
}: Props) {
  const { locale } = useLocale();
  return (
    <header
      style={{
        padding: '12px 20px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: '0.5px solid var(--color-border-default)',
        background: 'var(--color-bg-deep)',
        flexShrink: 0,
      }}
    >
      <Link
        href={'/' as Route}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          textDecoration: 'none',
        }}
      >
        <WMLogoMark size={26} />
        <WMLogoWordmark size={18} />
      </Link>

      <div style={{ flex: 1 }} />

      <BellButton hasUnread={hasUnreadNotification} />

      {levelId != null ? (
        <LevelChip levelId={levelId} initial={avatarInitial} />
      ) : (
        <Link
          href={'/profile' as Route}
          aria-label={locale === 'ko' ? '프로필' : 'Profile'}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: 'var(--color-wine-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          {avatarInitial}
        </Link>
      )}
    </header>
  );
}
