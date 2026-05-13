'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getCommunityPosts } from '@/lib/mock/community-posts';
import { useLocale } from '@/context/locale-context';
import { useTranslations } from 'next-intl';
import type { Route } from 'next';

export function CommunityShortcutCard() {
  const t = useTranslations('community');
  const { locale } = useLocale();
  const posts = getCommunityPosts();
  const latest = posts[0];

  return (
    <Link href={'/community' as Route} style={{ textDecoration: 'none' }}>
      <div
        style={{
          margin: '0 16px',
          padding: '14px 16px',
          borderRadius: 14,
          background:
            'linear-gradient(135deg, rgba(139,26,42,0.2), var(--color-bg-surface))',
          border: '1px solid rgba(201,168,76,0.33)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 6,
            }}
          >
            <span
              style={{
                padding: '2px 7px',
                borderRadius: 999,
                background: 'rgba(201,168,76,0.13)',
                border: '1px solid rgba(201,168,76,0.4)',
                color: 'var(--color-gold)',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {t('title')}
            </span>
            <span
              style={{
                padding: '2px 7px',
                borderRadius: 999,
                background: 'var(--color-wine-red)',
                color: 'var(--color-cream)',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              NEW
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 14,
              color: 'var(--color-cream)',
              lineHeight: 1.3,
            }}
          >
            {t('shortcut.title')}
          </div>

          {/* Latest post preview */}
          {latest && (
            <div
              style={{
                fontSize: 11,
                color: 'var(--color-text-muted)',
                marginTop: 4,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              } as React.CSSProperties}
            >
              {latest.title}
            </div>
          )}
        </div>

        <ChevronRight size={16} strokeWidth={1.75} color="var(--color-gold)" />
      </div>
    </Link>
  );
}
