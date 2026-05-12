'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRight, Award } from 'lucide-react';
import { LocaleText, useLocalizedText } from '@/components/shared/locale-text';
import { LevelPill } from '@/components/shared/level-pill';
import { LevelProgressBar } from '@/components/shared/level-progress-bar';
import { BADGES_BY_ID } from '@/lib/mock/badges';
import type { User } from '@/types';

type Props = {
  user: User;
};

function monthsSince(date: string): number {
  const then = new Date(date);
  const now = new Date();
  return (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
}

export function ProfileHero({ user }: Props) {
  const t = useTranslations('profile');
  const initial = useLocalizedText(user.avatarInitial);
  const months = monthsSince(user.joinedAt);
  const ownedBadges = user.badges
    .map((id) => BADGES_BY_ID[id])
    .filter(Boolean)
    .slice(0, 5);

  return (
    <section
      style={{
        margin: '0 16px',
        padding: 16,
        borderRadius: 18,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          aria-hidden
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: 'var(--color-wine-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-playfair)',
            fontSize: 28,
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 20,
              color: 'var(--color-cream)',
              marginBottom: 6,
            }}
          >
            <LocaleText value={user.displayName} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <LevelPill level={user.levelId as 1 | 2 | 3 | 4 | 5} />
            {ownedBadges.map((b) => (
              <span
                key={b.id}
                aria-label={b.name.en}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  background: tierColor(b.tier),
                  display: 'inline-block',
                  border: '1px solid rgba(245,240,232,0.2)',
                }}
              />
            ))}
            {user.badges.length > 5 && (
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                }}
              >
                +{user.badges.length - 5}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              marginTop: 6,
            }}
          >
            {t('joinedFor', { months })}
          </div>
        </div>
      </div>
      <LevelProgressBar xp={user.xp} />

      {/* 랭킹 상세 정보로 이동 — 등급/혜택/XP 적립 방법 안내 */}
      <Link
        href={'/profile/ranking' as Route}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderRadius: 10,
          background: 'rgba(201, 168, 76, 0.08)',
          border: '1px solid rgba(201, 168, 76, 0.25)',
          textDecoration: 'none',
          color: 'inherit',
          marginTop: 4,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Award size={16} color="var(--color-gold)" />
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--color-cream)',
            }}
          >
            {t('rankingDetailCta')}
          </span>
        </span>
        <ChevronRight size={16} color="var(--color-text-muted)" />
      </Link>
    </section>
  );
}

function tierColor(tier: 'bronze' | 'silver' | 'gold' | 'platinum'): string {
  switch (tier) {
    case 'bronze':
      return '#A77044';
    case 'silver':
      return '#C8C8D0';
    case 'gold':
      return '#C9A84C';
    case 'platinum':
      return 'linear-gradient(135deg, #C9A84C 0%, #F5F0E8 100%)';
  }
}
