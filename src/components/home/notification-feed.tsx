'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  if (n.kind === 'drinkWindowReached' && n.cellarItemId)
    return `/cellar/${n.cellarItemId}` as Route;
  if (n.kind === 'badgeEarned') return '/badges' as Route;
  if (n.kind === 'levelUp') return '/profile' as Route;
  return '/notifications' as Route;
}

export function NotificationFeed({ items }: { items: Notification[] }) {
  const t = useTranslations('home');
  const router = useRouter();
  const visible = items.slice(0, 3);

  return (
    <section
      data-feature-id="home.notificationFeed"
      style={{ marginTop: 16 }}
    >
      <header
        style={{
          padding: '0 20px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2 className="wm-section-title">{t('notifications')}</h2>
        <Link href={'/notifications' as Route} className="wm-section-link">
          {useTranslations('common')('seeAll')}
        </Link>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px' }}>
        {visible.map((n) => (
          <button
            type="button"
            key={n.id}
            onClick={() => router.push(targetRoute(n))}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'stretch',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 14,
              border: '1px solid var(--color-border-default)',
              background: 'var(--color-surface)',
              minHeight: 76,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 4,
                borderRadius: 2,
                background: KIND_BAR_COLOR[n.kind],
                alignSelf: 'stretch',
                flexShrink: 0,
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
                <LocaleText value={n.title} />
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
                <LocaleText value={n.body} />
              </div>
            </div>
            <ChevronRight
              size={18}
              strokeWidth={1.75}
              style={{ alignSelf: 'center', color: 'var(--color-text-muted)' }}
              aria-hidden
            />
          </button>
        ))}
      </div>
    </section>
  );
}
