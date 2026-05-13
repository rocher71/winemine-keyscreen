'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { AppHeader } from '@/components/nav/app-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { useMockUser } from '@/hooks/use-mock-user';
import { useMergedCellar, useMergedNotes } from '@/hooks/use-merged-data';
import { useLocalizedText } from '@/components/shared/locale-text';
import { getUnreadCount } from '@/lib/mock/notifications';
import { getWine } from '@/lib/mock/wines';
import { ProfileHero } from '@/components/profile/profile-hero';
import { StatGrid } from '@/components/profile/stat-grid';
import { QuickLinks } from '@/components/profile/quick-links';
import { useRegisterFeatures } from '@/context/feature-flag-context';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const { user } = useMockUser();
  const initial = useLocalizedText(user.avatarInitial);
  const unread = getUnreadCount(user.id);

  /* localStorage 머지 — 사용자가 셀러/노트를 추가했다면 카운트가 즉시 올라감 */
  const cellar = useMergedCellar(user.id);
  const notes = useMergedNotes(user.id);

  /* unique 와인·국가·지역 카운트 — 머지된 노트 기반 */
  const mergedStats = useMemo(() => {
    const tastedWineIds = new Set(notes.map((n) => n.wineId));
    const countries = new Set<string>();
    const regions = new Set<string>();
    for (const id of tastedWineIds) {
      const w = getWine(id);
      if (!w) continue;
      countries.add(w.country.en);
      regions.add(`${w.country.en}/${w.region.en}`);
    }
    return {
      winesTasted: tastedWineIds.size,
      countriesExplored: countries.size,
      regionsExplored: regions.size,
      notesCount: notes.length,
      cellarCount: cellar.length,
    };
  }, [notes, cellar]);

  useRegisterFeatures('/profile', [
    { id: 'profile.hero', labelKo: '프로필 헤로', labelEn: 'Profile hero', defaultStatus: 'planned' },
    { id: 'profile.statGrid', labelKo: '통계 그리드', labelEn: 'Stat grid', defaultStatus: 'planned' },
    { id: 'profile.quickLinks', labelKo: '빠른 링크', labelEn: 'Quick links', defaultStatus: 'planned' },
  ]);

  return (
    <>
      <AppHeader
        hasUnreadNotification={unread > 0}
        avatarInitial={initial}
        levelId={user.levelId}
      />
      <div className="wm-scroll-area">
        <h1
          className="wm-page-title"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 24,
            margin: 0,
            padding: '8px 20px 12px',
          }}
        >
          {t('title')}
        </h1>
        <div data-feature-id="profile.hero">
          <ProfileHero user={user} />
        </div>
        <div data-feature-id="profile.statGrid">
          <StatGrid stats={mergedStats} />
        </div>
        <div data-feature-id="profile.quickLinks">
          <QuickLinks />
        </div>
        <div style={{ height: 24 }} />
      </div>
      <BottomNav />
    </>
  );
}
