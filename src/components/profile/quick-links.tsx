'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { Star, Award, Bell, Settings, LogOut, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Item = {
  href?: Route;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

export function QuickLinks() {
  const t = useTranslations('profile.links');
  const tProfile = useTranslations('profile');

  const items: Item[] = [
    { href: '/favorites' as Route, icon: <Star size={18} />, label: t('favorites') },
    { href: '/badges' as Route, icon: <Award size={18} />, label: t('badges') },
    { href: '/notifications' as Route, icon: <Bell size={18} />, label: t('notifications') },
    { href: '/settings' as Route, icon: <Settings size={18} />, label: t('settings') },
    {
      icon: <LogOut size={18} />,
      label: t('signOut'),
      onClick: () => toast({ message: tProfile('signOutToast') }),
    },
  ];

  return (
    <section style={{ margin: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, idx) =>
        item.href ? (
          <Link
            key={idx}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 14px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 12,
              color: 'var(--color-cream)',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter)',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span style={{ color: 'var(--color-gold)' }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            <ChevronRight size={16} color="var(--color-text-muted)" />
          </Link>
        ) : (
          <button
            key={idx}
            type="button"
            onClick={item.onClick}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 14px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 12,
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-inter)',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span style={{ color: 'var(--color-gold)' }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            <ChevronRight size={16} color="var(--color-text-muted)" />
          </button>
        ),
      )}
    </section>
  );
}
