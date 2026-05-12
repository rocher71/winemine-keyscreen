'use client';

import dynamic from 'next/dynamic';
import { LocaleText, useLocalizedText } from '@/components/shared/locale-text';
import { LevelPill } from '@/components/shared/level-pill';
import { BADGES_BY_ID } from '@/lib/mock/badges';
import type { User, Wine } from '@/types';

const FullWorldMap = dynamic(() => import('@/components/map/full-world-map'), {
  ssr: false,
  loading: () => null,
});

type Props = {
  user: User;
  wines: Wine[];
};

export function UserMapHero({ user, wines }: Props) {
  const initial = useLocalizedText(user.avatarInitial);
  const ownedBadges = user.badges
    .map((id) => BADGES_BY_ID[id])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <section
      style={{
        position: 'relative',
        margin: '0 16px',
        height: 240,
        overflow: 'hidden',
        borderRadius: 16,
        border: '1px solid var(--color-border-default)',
        background: 'var(--color-bg-map)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.92 }}>
        <FullWorldMap wines={wines} onCountrySelect={() => undefined} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '14px 16px',
          background:
            'linear-gradient(180deg, rgba(15,7,24,0) 0%, rgba(15,7,24,0.85) 60%)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 5,
        }}
      >
        <div
          aria-hidden
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: 'var(--color-wine-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-playfair)',
            color: 'var(--color-cream)',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 16,
              color: 'var(--color-cream)',
            }}
          >
            <LocaleText value={user.displayName} />
          </div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <LevelPill level={user.levelId as 1 | 2 | 3 | 4 | 5} />
            {ownedBadges.map((b) => (
              <span
                key={b.id}
                aria-label={b.name.en}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: tierColor(b.tier),
                  border: '1px solid rgba(245,240,232,0.25)',
                  display: 'inline-block',
                }}
              />
            ))}
          </div>
        </div>
      </div>
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
