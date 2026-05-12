'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { EmptyState } from '@/components/shared/empty-state';
import { LocaleText } from '@/components/shared/locale-text';
import { useMockUser } from '@/hooks/use-mock-user';
import { getFavoritesByUser } from '@/lib/mock/favorites';
import { getWine } from '@/lib/mock/wines';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { toast } from '@/hooks/use-toast';
import type { FavoriteWine } from '@/types';

export default function FavoritesPage() {
  const t = useTranslations('favorites');
  const { user } = useMockUser();
  const initial = getFavoritesByUser(user.id);
  const [items, setItems] = useState<FavoriteWine[]>(initial);

  useEffect(() => {
    setItems(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  useRegisterFeatures('/favorites', [
    { id: 'favorites.list', labelKo: '즐겨찾기 리스트', labelEn: 'Favorites list', defaultStatus: 'planned' },
  ]);

  const toggle = (id: string, next: boolean) => {
    setItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, notifyOnPurchase: next } : f)),
    );
    toast({ message: next ? t('notifyOn') : t('notifyOff') });
  };

  return (
    <>
      <BackHeader title={t('title')} />
      <main className="wm-scroll-area" style={{ paddingTop: 8 }}>
        {items.length === 0 ? (
          <EmptyState
            illustration={<Star size={56} strokeWidth={1.25} />}
            title={t('empty')}
            description={t('emptySub')}
          />
        ) : (
          <div data-feature-id="favorites.list">
            {items.map((fav) => {
              const wine = getWine(fav.wineId);
              if (!wine) return null;
              return (
                <div
                  key={fav.id}
                  style={{
                    margin: '8px 16px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                  }}
                >
                  <Link
                    href={`/wine/${wine.id}` as Route}
                    style={{
                      flex: 1,
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      minWidth: 0,
                      textDecoration: 'none',
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        width: 44,
                        height: 60,
                        borderRadius: 6,
                        background: `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 70%)`,
                        flexShrink: 0,
                        border: '1px solid rgba(201,168,76,0.18)',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: 14,
                          color: 'var(--color-cream)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {wine.name}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 11,
                          color: 'var(--color-text-muted)',
                          marginTop: 2,
                        }}
                      >
                        {wine.vintage} · <LocaleText value={wine.region} />
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 12,
                          color: 'var(--color-text-secondary)',
                          marginTop: 4,
                        }}
                      >
                        ₩{wine.averagePriceKrw.toLocaleString()}
                      </div>
                    </div>
                  </Link>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 10,
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {t('notify')}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={fav.notifyOnPurchase}
                      onClick={() => toggle(fav.id, !fav.notifyOnPurchase)}
                      style={{
                        position: 'relative',
                        width: 38,
                        height: 22,
                        borderRadius: 11,
                        background: fav.notifyOnPurchase
                          ? 'var(--color-gold)'
                          : 'var(--color-border-default)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: 2,
                          left: fav.notifyOnPurchase ? 18 : 2,
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          background: 'var(--color-cream)',
                          transition: 'left 200ms',
                        }}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ height: 24 }} />
      </main>
    </>
  );
}
