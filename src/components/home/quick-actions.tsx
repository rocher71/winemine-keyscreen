'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { TrendingUp, Globe2, Star, Award } from 'lucide-react';
import type { User } from '@/types';
import { BADGES } from '@/lib/mock/badges';

export function QuickActions({ user }: { user: User }) {
  const t = useTranslations('home.quickActions');
  const owned = user.badges.length;
  const total = BADGES.length;

  const items = [
    {
      href: '/cellar',
      Icon: TrendingUp,
      title: t('cellar'),
      sub: t('cellarSub', { count: user.stats.cellarCount }),
    },
    {
      href: '/map',
      Icon: Globe2,
      title: t('map'),
      sub: t('mapSub', { count: user.stats.regionsExplored }),
    },
    {
      href: '/favorites',
      Icon: Star,
      title: t('favorites'),
      sub: t('favoritesSub', { count: user.id === 'me-heavy' ? 7 : 0 }),
    },
    {
      href: '/badges',
      Icon: Award,
      title: t('badges'),
      sub: t('badgesSub', { owned, total }),
    },
  ] as const;

  return (
    <section
      data-feature-id="home.quickActions"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        padding: '0 16px',
        marginTop: 18,
      }}
    >
      {items.map(({ href, Icon, title, sub }) => (
        <Link
          key={href}
          href={href as Route}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: '14px 16px',
            borderRadius: 14,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            textDecoration: 'none',
            minHeight: 86,
          }}
        >
          <Icon size={20} strokeWidth={1.75} color="var(--color-gold)" />
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-cream)',
            }}
          >
            {title}
          </div>
          <div className="wm-card-meta">{sub}</div>
        </Link>
      ))}
    </section>
  );
}
