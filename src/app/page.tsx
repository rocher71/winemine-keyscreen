'use client';

import { useEffect } from 'react';
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
            <StatHero user={user} />
            <div style={{ padding: '12px 16px 0' }}>
              <LevelProgressBar xp={user.xp} onClick={() => router.push('/badges')} />
            </div>
            <NotificationFeed items={notifications} />
            <RecentNotesStrip notes={notes} />
            <WineFeed />
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
