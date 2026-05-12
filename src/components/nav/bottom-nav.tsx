'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Globe2, Camera, Library, User } from 'lucide-react';
import type { Route } from 'next';
import type { CSSProperties } from 'react';

/**
 * 하단 탭바.
 *
 * - 높이 83px = 탭 49px + 홈 safe area 34px
 * - 배경 rgba(15,7,24,0.92) + blur(20px), 상단 1px Border
 * - 5탭: 홈, 지도, FAB(중앙), 셀러, 프로필
 * - 활성 탭은 usePathname()으로 결정 (라우트 prefix 매칭)
 * - 노트 작성·온보딩·캡처 경로에서는 마운트 자체를 안 함 — shouldShowBottomNav 헬퍼로 가드.
 *
 * 활성 매칭:
 *   /                  → 홈
 *   /map               → 지도
 *   /cellar*           → 셀러
 *   /profile*, /favorites, /badges, /photos, /notifications, /settings*
 *                      → 프로필
 *   /wine/[id]*, /glossary*, 그 외 → 활성 탭 없음
 */

type NavTabId = 'home' | 'map' | 'cellar' | 'profile';

const TABS: ReadonlyArray<{
  id: NavTabId;
  href: Route;
  Icon: typeof Home;
  labelKo: string;
  labelEn: string;
}> = [
  { id: 'home', href: '/' as Route, Icon: Home, labelKo: '홈', labelEn: 'Home' },
  { id: 'map', href: '/map' as Route, Icon: Globe2, labelKo: '지도', labelEn: 'Map' },
  { id: 'cellar', href: '/cellar' as Route, Icon: Library, labelKo: '셀러', labelEn: 'Cellar' },
  { id: 'profile', href: '/profile' as Route, Icon: User, labelKo: '프로필', labelEn: 'Profile' },
];

/** BottomNav가 숨겨져야 하는 라우트 패턴 (whitelist 인버스). */
const HIDDEN_PREFIXES: ReadonlyArray<string> = [
  '/onboarding',
  '/capture',
  '/notes/new',
];

export function shouldShowBottomNav(pathname: string | null): boolean {
  if (!pathname) return true;
  return !HIDDEN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function pickActiveTab(pathname: string | null): NavTabId | null {
  if (!pathname) return null;
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/map')) return 'map';
  if (pathname.startsWith('/cellar')) return 'cellar';
  if (
    pathname.startsWith('/profile') ||
    pathname.startsWith('/favorites') ||
    pathname.startsWith('/badges') ||
    pathname.startsWith('/photos') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/settings')
  ) {
    return 'profile';
  }
  return null;
}

import { useLocale } from '@/context/locale-context';

export function BottomNav() {
  const pathname = usePathname();
  const { locale } = useLocale();

  if (!shouldShowBottomNav(pathname)) return null;

  const activeId = pickActiveTab(pathname);

  // 5칸 레이아웃: 홈 | 지도 | FAB(공간) | 셀러 | 프로필
  const containerStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 83,
    paddingBottom: 34,
    background: 'rgba(15, 7, 24, 0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid var(--color-border-default)',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    alignItems: 'stretch',
    zIndex: 25,
  };

  return (
    <nav
      aria-label={locale === 'en' ? 'Primary' : '주요 내비게이션'}
      style={containerStyle}
    >
      {/* 1. 홈 */}
      <NavTab tab={TABS[0]} active={activeId === TABS[0].id} locale={locale} />
      {/* 2. 지도 */}
      <NavTab tab={TABS[1]} active={activeId === TABS[1].id} locale={locale} />

      {/* 3. 중앙 FAB 슬롯 */}
      <div style={{ position: 'relative' }}>
        <Link
          href={'/capture' as Route}
          aria-label={locale === 'en' ? 'Capture wine label' : '와인 라벨 촬영'}
          style={{
            position: 'absolute',
            top: -16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 56,
            height: 56,
            borderRadius: 28,
            background: 'var(--color-wine-red)',
            border: '4px solid var(--color-bg-deepest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(139, 26, 42, 0.35)',
            color: 'var(--color-cream)',
            textDecoration: 'none',
          }}
        >
          <Camera size={24} strokeWidth={1.75} />
        </Link>
      </div>

      {/* 4. 셀러 */}
      <NavTab tab={TABS[2]} active={activeId === TABS[2].id} locale={locale} />
      {/* 5. 프로필 */}
      <NavTab tab={TABS[3]} active={activeId === TABS[3].id} locale={locale} />
    </nav>
  );
}

function NavTab({
  tab,
  active,
  locale,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
  locale: 'ko' | 'en';
}) {
  const { Icon, href, labelKo, labelEn } = tab;
  const label = locale === 'en' ? labelEn : labelKo;
  const color = active ? 'var(--color-gold)' : 'var(--color-text-muted)';

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        color,
        textDecoration: 'none',
        transition: 'color 200ms ease-out',
      }}
    >
      <Icon size={20} strokeWidth={1.75} />
      <span
        style={{
          fontFamily: 'var(--font-inter)',
          fontWeight: 500,
          fontSize: 10,
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </Link>
  );
}
