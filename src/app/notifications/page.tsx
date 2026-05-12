'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bell } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { EmptyState } from '@/components/shared/empty-state';
import { NotificationRow } from '@/components/notifications/notification-row';
import { useMockUser } from '@/hooks/use-mock-user';
import { useLocale } from '@/context/locale-context';
import { getNotificationsByUser } from '@/lib/mock/notifications';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { toast } from '@/hooks/use-toast';

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const { user } = useMockUser();
  const { locale } = useLocale();
  const notifs = getNotificationsByUser(user.id);
  const [readAll, setReadAll] = useState(false);

  useRegisterFeatures('/notifications', [
    { id: 'notif.list', labelKo: '알림 리스트', labelEn: 'Notification list', defaultStatus: 'planned' },
  ]);

  return (
    <>
      <BackHeader title={t('title')}>
        {notifs.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setReadAll(true);
              toast({ message: t('markedAllRead') });
            }}
            style={{
              padding: '6px 10px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('markAllRead')}
          </button>
        )}
      </BackHeader>
      <main className="wm-scroll-area" style={{ paddingTop: 8 }}>
        {notifs.length === 0 ? (
          <EmptyState
            illustration={<Bell size={56} strokeWidth={1.25} />}
            title={t('empty')}
            description={t('emptySub')}
          />
        ) : (
          <div data-feature-id="notif.list">
            {notifs.map((n) => (
              <NotificationRow
                key={n.id}
                notification={readAll ? { ...n, read: true } : n}
                locale={locale}
              />
            ))}
          </div>
        )}
        <div style={{ height: 24 }} />
      </main>
    </>
  );
}
