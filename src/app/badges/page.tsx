'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Award, Lock } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { BottomSheet } from '@/components/shared/bottom-sheet';
import { LocaleText } from '@/components/shared/locale-text';
import { useMockUser } from '@/hooks/use-mock-user';
import { BADGES } from '@/lib/mock/badges';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import type { Badge, BadgeTier } from '@/types';

type TierFilter = 'all' | BadgeTier;

function tierColor(tier: BadgeTier): string {
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

export default function BadgesPage() {
  const t = useTranslations('badges');
  const tTiers = useTranslations('badges.tiers');
  const { user } = useMockUser();
  const owned = new Set(user.badges);
  const [tier, setTier] = useState<TierFilter>('all');
  const [selected, setSelected] = useState<Badge | null>(null);

  useRegisterFeatures('/badges', [
    { id: 'badges.tierChips', labelKo: '등급 필터', labelEn: 'Tier chips', defaultStatus: 'planned' },
    { id: 'badges.grid', labelKo: '뱃지 그리드', labelEn: 'Badge grid', defaultStatus: 'planned' },
  ]);

  const filtered = useMemo(() => {
    return tier === 'all' ? BADGES : BADGES.filter((b) => b.tier === tier);
  }, [tier]);

  return (
    <>
      <BackHeader title={t('title')}>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            fontWeight: 600,
          }}
        >
          {t('ownedOf', { owned: owned.size, total: BADGES.length })}
        </span>
      </BackHeader>
      <main className="wm-scroll-area" style={{ paddingTop: 8 }}>
        <div
          data-feature-id="badges.tierChips"
          style={{
            display: 'flex',
            gap: 8,
            padding: '8px 16px 14px',
            overflowX: 'auto',
          }}
        >
          {(['all', 'bronze', 'silver', 'gold', 'platinum'] as TierFilter[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTier(k)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                background: tier === k ? 'var(--color-wine-red)' : 'transparent',
                color: tier === k ? 'var(--color-cream)' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 16,
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tTiers(k)}
            </button>
          ))}
        </div>

        <div
          data-feature-id="badges.grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            padding: '0 16px 24px',
          }}
        >
          {filtered.map((b) => {
            const isOwned = owned.has(b.id);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelected(b)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: 10,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 14,
                  textAlign: 'center',
                  opacity: isOwned ? 1 : 0.55,
                  filter: isOwned ? 'none' : 'grayscale(0.6)',
                  position: 'relative',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    background: tierColor(b.tier),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(245,240,232,0.18)',
                    position: 'relative',
                  }}
                >
                  <Award size={28} strokeWidth={1.5} color="#05020A" />
                  {!isOwned && (
                    <Lock
                      size={20}
                      color="var(--color-cream)"
                      strokeWidth={1.5}
                      style={{
                        position: 'absolute',
                        background: 'rgba(0,0,0,0.7)',
                        borderRadius: 10,
                        padding: 4,
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--color-cream)',
                    lineHeight: 1.3,
                    minHeight: 28,
                  }}
                >
                  <LocaleText value={b.name} />
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <BottomSheet open={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <div style={{ padding: '0 8px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  background: tierColor(selected.tier),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  opacity: owned.has(selected.id) ? 1 : 0.55,
                }}
              >
                <Award size={32} strokeWidth={1.5} color="#05020A" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 18,
                    color: 'var(--color-cream)',
                    margin: 0,
                  }}
                >
                  <LocaleText value={selected.name} />
                </h3>
                <div
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    marginTop: 4,
                  }}
                >
                  {tTiers(selected.tier)}
                </div>
              </div>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 13,
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              <LocaleText value={selected.description} />
            </p>
            <div
              style={{
                padding: 12,
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.18)',
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 11,
                  color: 'var(--color-gold)',
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                {t('condition')}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                  color: 'var(--color-cream)',
                }}
              >
                <LocaleText value={selected.earnedCondition} />
              </div>
            </div>
            {!owned.has(selected.id) && (
              <div
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                  textAlign: 'center',
                }}
              >
                {t('lockedHint')}
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </>
  );
}
