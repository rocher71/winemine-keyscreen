'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BackHeader } from '@/components/nav/back-header';
import { ToggleRow } from '@/components/settings/toggle-row';
import { toast } from '@/hooks/use-toast';
import { useRegisterFeatures } from '@/context/feature-flag-context';

type Toggles = {
  favoritePurchase: boolean;
  drinkWindow: boolean;
  badgeLevel: boolean;
  community: boolean;
};

const STORAGE_KEY = 'winemine.notifSettings';
const DEFAULTS: Toggles = {
  favoritePurchase: true,
  drinkWindow: true,
  badgeLevel: true,
  community: false,
};

export default function NotificationSettingsPage() {
  const t = useTranslations('settings.notifPage');
  const [toggles, setToggles] = useState<Toggles>(DEFAULTS);

  useRegisterFeatures('/settings/notifications', [
    { id: 'settings.notif.toggles', labelKo: '알림 토글', labelEn: 'Notification toggles', defaultStatus: 'planned' },
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setToggles({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const setOne = (key: keyof Toggles, next: boolean) => {
    const updated = { ...toggles, [key]: next };
    setToggles(updated);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
    }
    toast({ message: t('toggleSaved') });
  };

  return (
    <>
      <BackHeader title={t('title')} />
      <main className="wm-scroll-area" style={{ paddingTop: 12 }}>
        <div data-feature-id="settings.notif.toggles">
          <ToggleRow
            label={t('favoritePurchase')}
            checked={toggles.favoritePurchase}
            onChange={(v) => setOne('favoritePurchase', v)}
          />
          <ToggleRow
            label={t('drinkWindow')}
            checked={toggles.drinkWindow}
            onChange={(v) => setOne('drinkWindow', v)}
          />
          <ToggleRow
            label={t('badgeLevel')}
            checked={toggles.badgeLevel}
            onChange={(v) => setOne('badgeLevel', v)}
          />
          <ToggleRow
            label={t('community')}
            checked={toggles.community}
            onChange={(v) => setOne('community', v)}
          />
        </div>
      </main>
    </>
  );
}
