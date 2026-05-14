'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import type { CSSProperties } from 'react';

type NavTabId = 'home' | 'map' | 'cellar' | 'community';

/* Monoline SVG icons — same set as design system */
const ICON_PATHS: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8h3l2-2h8l2 2h3v12H3z" />
      <circle cx="12" cy="14" r="3.5" />
    </>
  ),
  cellar: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 3v18M15 3v18M4 9h16M4 15h16" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </>
  ),
  community: (
    <>
      <circle cx="9" cy="9" r="3.2" />
      <circle cx="17" cy="10.5" r="2.4" />
      <path d="M3 20c0.8-3 3.4-4.6 6-4.6s5.2 1.6 6 4.6" />
      <path d="M15 20c0.6-2.2 2.4-3.4 4-3.4s2.8 0.8 3 2.2" />
    </>
  ),
};

function NavIcon({ name, size = 22, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
      aria-hidden
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

const TABS: ReadonlyArray<{
  id: NavTabId;
  href: Route;
  icon: string;
  labelKo: string;
  labelEn: string;
}> = [
  { id: 'home',      href: '/' as Route,          icon: 'home',      labelKo: '홈',      labelEn: 'Home' },
  { id: 'map',       href: '/map' as Route,        icon: 'globe',     labelKo: '지도',    labelEn: 'Map' },
  { id: 'cellar',    href: '/cellar' as Route,     icon: 'cellar',    labelKo: '셀러',    labelEn: 'Cellar' },
  { id: 'community', href: '/community' as Route,  icon: 'community', labelKo: '커뮤니티', labelEn: 'Community' },
];

const HIDDEN_PREFIXES: ReadonlyArray<string> = [
  '/onboarding',
  '/capture',
  '/notes/new',
];

export function shouldShowBottomNav(pathname: string | null): boolean {
  if (!pathname) return true;
  return !HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function pickActiveTab(pathname: string | null): NavTabId | null {
  if (!pathname) return null;
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/map')) return 'map';
  if (pathname.startsWith('/cellar')) return 'cellar';
  if (pathname.startsWith('/community')) return 'community';
  if (
    pathname.startsWith('/profile') ||
    pathname.startsWith('/favorites') ||
    pathname.startsWith('/badges') ||
    pathname.startsWith('/photos') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/settings')
  ) return null;
  return null;
}

import { useLocale } from '@/context/locale-context';

export function BottomNav() {
  const pathname = usePathname();
  const { locale } = useLocale();

  if (!shouldShowBottomNav(pathname)) return null;
  const activeId = pickActiveTab(pathname);

  const containerStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '8px 12px 28px',
    background: 'var(--gradient-bottom-nav)',
    display: 'flex',
    alignItems: 'flex-end',
    gap: 0,
    borderTop: '0.5px solid var(--color-border-default)',
    zIndex: 25,
  };

  return (
    <>
      {/* 모바일에선 BottomNav가 position:fixed라 normal flow 빠짐 →
       * 마지막 콘텐츠가 nav에 가려지지 않도록 in-flow spacer 삽입.
       * 데스크톱에선 CSS로 spacer 숨김. */}
      <div className="wm-bottom-nav-spacer" aria-hidden />
    <nav
      className="wm-bottom-nav"
      aria-label={locale === 'en' ? 'Primary' : '주요 내비게이션'}
      style={containerStyle}
    >
      {/* 홈 */}
      <NavTab tab={TABS[0]} active={activeId === 'home'} locale={locale} />
      {/* 지도 */}
      <NavTab tab={TABS[1]} active={activeId === 'map'} locale={locale} />

      {/* 중앙 FAB — 카메라 */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Link
          href={'/capture' as Route}
          aria-label={locale === 'en' ? 'Capture wine label' : '와인 라벨 촬영'}
          style={{
            width: 52,
            height: 52,
            borderRadius: 999,
            background: 'linear-gradient(135deg, #8B1A2A, #5b1424)',
            border: '1px solid #C9A84C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(139,26,42,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
            color: 'var(--color-cream)',
            textDecoration: 'none',
            flexShrink: 0,
            marginTop: -24,
          }}
        >
          <NavIcon name="camera" size={24} color="var(--color-cream)" />
        </Link>
      </div>

      {/* 셀러 */}
      <NavTab tab={TABS[2]} active={activeId === 'cellar'} locale={locale} />
      {/* 커뮤니티 */}
      <NavTab tab={TABS[3]} active={activeId === 'community'} locale={locale} />
    </nav>
    </>
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
  const label = locale === 'en' ? tab.labelEn : tab.labelKo;
  const color = active ? '#C9A84C' : 'var(--color-text-muted)';

  return (
    <Link
      href={tab.href}
      aria-current={active ? 'page' : undefined}
      style={{
        flex: 1,
        padding: '6px 0',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        color,
        textDecoration: 'none',
      }}
    >
      <NavIcon name={tab.icon} size={22} color={color} />
      <span
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 10,
          fontWeight: active ? 600 : 400,
          letterSpacing: '0.02em',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </Link>
  );
}
