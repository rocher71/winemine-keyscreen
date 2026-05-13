'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/nav/app-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { useMockUser } from '@/hooks/use-mock-user';
import { useAppMode } from '@/context/app-mode-context';
import { StatHero } from '@/components/home/stat-hero';
import { LevelProgressBar } from '@/components/shared/level-progress-bar';
import { NotificationFeed } from '@/components/home/notification-feed';
import { RecentNotesStrip } from '@/components/home/recent-notes-strip';
import { QuickActions } from '@/components/home/quick-actions';
import { FirstTimeGreeting } from '@/components/home/first-time-greeting';
import { EmptyStatHero } from '@/components/home/empty-stat-hero';
import { SuggestedActions } from '@/components/home/suggested-actions';
import { WineFeed } from '@/components/home/wine-feed';
import { CommunityShortcutCard } from '@/components/community/community-shortcut-card';
import { getNotificationsByUser, getUnreadCount } from '@/lib/mock/notifications';
import { getTastingNotesByUser } from '@/lib/mock/tasting-notes';
import { useLocalizedText } from '@/components/shared/locale-text';
import { useRegisterFeatures } from '@/context/feature-flag-context';

export default function HomePage() {
  const { user } = useMockUser();
  const { demoMode } = useAppMode();
  const router = useRouter();

  // first-time + 온보딩 미완료 → /onboarding으로 redirect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (demoMode !== 'first-time') return;
    const done = window.localStorage.getItem('winemine.onboardingComplete');
    if (done !== 'true') {
      router.replace('/onboarding');
    }
  }, [demoMode, router]);

  const isHeavy = demoMode === 'heavy';
  const notifications = getNotificationsByUser(user.id);
  const notes = getTastingNotesByUser(user.id);
  const avatar = useLocalizedText(user.avatarInitial);
  const unread = getUnreadCount(user.id);

  useRegisterFeatures(
    '/',
    isHeavy
      ? [
          { id: 'home.statHero', labelKo: '통계 헤로', labelEn: 'Stat hero', defaultStatus: 'planned' },
          { id: 'home.levelProgressBar', labelKo: '레벨 진행 바', labelEn: 'Level progress', defaultStatus: 'planned' },
          { id: 'home.notificationFeed', labelKo: '알림 피드', labelEn: 'Notification feed', defaultStatus: 'planned' },
          { id: 'home.recentNotesStrip', labelKo: '최근 노트 스트립', labelEn: 'Recent notes', defaultStatus: 'planned' },
          { id: 'home.wineFeed', labelKo: '와인 피드', labelEn: 'Wine feed', defaultStatus: 'planned' },
          { id: 'home.quickActions', labelKo: '빠른 액션', labelEn: 'Quick actions', defaultStatus: 'planned' },
        ]
      : [
          { id: 'home.firstTimeGreeting', labelKo: '첫 인사', labelEn: 'First-time greeting', defaultStatus: 'planned' },
          { id: 'home.emptyStatHero', labelKo: '빈 통계 헤로', labelEn: 'Empty stat hero', defaultStatus: 'planned' },
          { id: 'home.suggestedActions', labelKo: '제안 액션', labelEn: 'Suggested actions', defaultStatus: 'planned' },
          { id: 'home.wineFeed', labelKo: '와인 피드', labelEn: 'Wine feed', defaultStatus: 'planned' },
        ],
  );

  return (
    <>
      <AppHeader
        hasUnreadNotification={unread > 0}
        avatarInitial={avatar}
        levelId={isHeavy ? user.levelId : null}
      />
      <div className="wm-scroll-area">
        {isHeavy ? (
          <>
            {/* 에디토리얼 인사말 */}
            <HeavyGreeting name={user.displayName.ko || user.displayName.en} />

            {/* 3-col 통계 카드 */}
            <StatHero user={user} />

            {/* 레벨 진행 바 */}
            <div
              data-feature-id="home.levelProgressBar"
              style={{
                margin: '14px 16px 0',
                padding: 16,
                borderRadius: 14,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-default)',
              }}
            >
              <LevelProgressBar xp={user.xp} onClick={() => router.push('/badges')} />
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-inter)' }}>
                노트 작성으로 +5 XP · 새 국가 첫 등록 시 +20 XP
              </div>
            </div>

            {/* 세계 지도 cameo */}
            <MapCameo countries={user.stats.countriesExplored} regions={user.stats.regionsExplored} />

            {/* 알림 피드 */}
            <NotificationFeed items={notifications} />

            {/* 최근 노트 */}
            <RecentNotesStrip notes={notes} />

            {/* 와인 피드 */}
            <WineFeed />

            <div style={{ height: 12 }} />
            <CommunityShortcutCard />
            <QuickActions user={user} />
          </>
        ) : (
          <>
            <FirstTimeGreeting user={user} />
            <EmptyStatHero />
            <SuggestedActions />
            <WineFeed />
          </>
        )}
        <div style={{ height: 32 }} />
      </div>
      <BottomNav />
    </>
  );
}

/* 에디토리얼 인사말 컴포넌트 */
function HeavyGreeting({ name }: { name: string }) {
  return (
    <div style={{ padding: '18px 20px 0' }}>
      <div style={{
        fontFamily: 'var(--font-inter)',
        fontSize: 10,
        color: '#C9A84C',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: 6,
        fontWeight: 500,
      }}>
        오늘의 셀러
      </div>
      <div style={{
        fontFamily: 'var(--font-playfair)',
        fontSize: 22,
        color: 'var(--color-cream)',
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
      }}>
        {name}님, 오늘은 어떤 와인을 여실 건가요?
      </div>
    </div>
  );
}

/* 홈 세계지도 cameo */
function MapCameo({ countries, regions }: { countries: number; regions: number }) {
  return (
    <Link
      href={'/map' as Route}
      style={{
        display: 'block',
        margin: '14px 16px 0',
        borderRadius: 14,
        overflow: 'hidden',
        background: 'var(--color-bg-map)',
        border: '1px solid var(--color-border-default)',
        textDecoration: 'none',
      }}
    >
      <div style={{
        padding: '12px 14px 0',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 14,
            color: 'var(--color-cream)',
          }}>
            당신의 와인 지도
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2, fontFamily: 'var(--font-inter)' }}>
            {countries}개국 · {regions}개 지역
          </div>
        </div>
        <span style={{
          fontSize: 10,
          color: '#C9A84C',
          letterSpacing: '0.04em',
          fontFamily: 'var(--font-inter)',
          fontWeight: 600,
        }}>
          전체 →
        </span>
      </div>
      {/* 지도 미리보기 (정적 placeholder — 실제 지도는 /map에서) */}
      <MiniMapPreview />
    </Link>
  );
}

/* 홈 세계지도 정적 preview */
function MiniMapPreview() {
  /* 방문한 주요 국가 위치 (픽셀, viewBox 320×100) */
  const COUNTRY_DOTS = [
    // 프랑스, 이탈리아, 스페인 (서유럽)
    { x: 148, y: 34, strong: true },
    { x: 155, y: 38, strong: true },
    { x: 141, y: 40, strong: false },
    // 독일, 오스트리아
    { x: 154, y: 30, strong: false },
    { x: 160, y: 32, strong: false },
    // 미국
    { x: 60, y: 38, strong: true },
    // 아르헨티나
    { x: 88, y: 76, strong: false },
    // 칠레
    { x: 82, y: 74, strong: false },
    // 호주
    { x: 256, y: 68, strong: false },
    // 남아공
    { x: 168, y: 76, strong: false },
    // 뉴질랜드
    { x: 274, y: 76, strong: false },
    // 일본
    { x: 246, y: 36, strong: false },
    // 포르투갈
    { x: 138, y: 42, strong: false },
    // 헝가리
    { x: 161, y: 34, strong: false },
  ];

  return (
    <svg
      viewBox="0 0 320 100"
      width="100%"
      height={100}
      style={{ display: 'block', marginTop: 6 }}
      aria-hidden
    >
      {/* 대륙 실루엣 (단순화) */}
      <g fill="#2D1540" opacity="0.8">
        {/* 북미 */}
        <ellipse cx="62" cy="32" rx="38" ry="18" />
        {/* 남미 */}
        <ellipse cx="86" cy="72" rx="18" ry="18" />
        {/* 유럽 */}
        <ellipse cx="152" cy="32" rx="22" ry="12" />
        {/* 아프리카 */}
        <ellipse cx="162" cy="62" rx="18" ry="22" />
        {/* 아시아 */}
        <ellipse cx="224" cy="30" rx="36" ry="16" />
        {/* 호주 */}
        <ellipse cx="258" cy="68" rx="18" ry="12" />
      </g>
      {/* 방문 국가 — 와인 레드 */}
      {COUNTRY_DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.strong ? 3.5 : 2.5}
          fill={d.strong ? '#8B1A2A' : '#C9A84C'}
          opacity={d.strong ? 0.9 : 0.7}
        />
      ))}
    </svg>
  );
}
