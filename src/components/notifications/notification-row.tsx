'use client';

import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { LocaleText } from '@/components/shared/locale-text';
import type { Notification } from '@/types';

const KIND_BAR_COLOR: Record<Notification['kind'], string> = {
  favoritePurchase: 'var(--color-wine-red)',
  drinkWindowReached: 'var(--color-gold)',
  badgeEarned: 'var(--color-cream)',
  levelUp: 'var(--color-gold)',
  reviewLiked: 'var(--color-text-secondary)',
};

function targetRoute(n: Notification): Route {
  if (n.kind === 'favoritePurchase' && n.wineId) return `/wine/${n.wineId}` as Route;
  if (n.kind === 'drinkWindowReached' && n.cellarItemId) return `/cellar/${n.cellarItemId}` as Route;
  if (n.kind === 'badgeEarned') return '/badges' as Route;
  if (n.kind === 'levelUp') return '/profile' as Route;
  return '/notifications' as Route;
}

function relativeTime(iso: string, locale: 'ko' | 'en'): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return locale === 'en' ? 'now' : '방금';
  if (min < 60) return locale === 'en' ? `${min}m` : `${min}분`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return locale === 'en' ? `${hr}h` : `${hr}시간`;
  const day = Math.floor(hr / 24);
  if (day < 30) return locale === 'en' ? `${day}d` : `${day}일`;
  const mon = Math.floor(day / 30);
  return locale === 'en' ? `${mon}mo` : `${mon}달`;
}

export function NotificationRow({
  notification,
  locale,
}: {
  notification: Notification;
  locale: 'ko' | 'en';
}) {
  const router = useRouter();
  const time = relativeTime(notification.createdAt, locale);

  return (
    <button
      type="button"
      onClick={() => router.push(targetRoute(notification))}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'stretch',
        gap: 12,
        padding: '14px 14px',
        margin: '6px 16px',
        borderRadius: 14,
        background: notification.read
          ? 'transparent'
          : 'rgba(139,26,42,0.08)',
        border: '1px solid var(--color-border-default)',
        minHeight: 80,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 4,
          borderRadius: 2,
          background: KIND_BAR_COLOR[notification.kind],
          flexShrink: 0,
          alignSelf: 'stretch',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-cream)',
            marginBottom: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <LocaleText value={notification.title} />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          <LocaleText value={notification.body} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 4,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            color: 'var(--color-text-muted)',
          }}
        >
          {time}
        </span>
        {!notification.read && (
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: 'var(--color-wine-red)',
            }}
          />
        )}
      </div>
    </button>
  );
}
