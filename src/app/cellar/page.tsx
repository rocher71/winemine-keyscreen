'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/nav/app-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { useMockUser } from '@/hooks/use-mock-user';
import { getCellarByUser } from '@/lib/mock/cellar';
import { getWine } from '@/lib/mock/wines';
import { getUnreadCount } from '@/lib/mock/notifications';
import { useLocalizedText } from '@/components/shared/locale-text';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { toast } from '@/hooks/use-toast';
import { CellarCard } from '@/components/cellar/cellar-card';
import { CellarEmptyState } from '@/components/cellar/cellar-empty-state';
import { getDrinkWindow } from '@/lib/drink-window';

type SortKey = 'recent' | 'drinkSoon' | 'vintage' | 'region' | 'storage' | 'price';

export default function CellarListPage() {
  const t = useTranslations('cellar');
  const { user } = useMockUser();
  const avatar = useLocalizedText(user.avatarInitial);
  const router = useRouter();
  const unread = getUnreadCount(user.id);
  const [sort, setSort] = useState<SortKey>('recent');

  useRegisterFeatures('/cellar', [
    { id: 'cellar.titleBar', labelKo: '타이틀 + 등록 버튼', labelEn: 'Title + add', defaultStatus: 'planned' },
    { id: 'cellar.sortChips', labelKo: '정렬 칩', labelEn: 'Sort chips', defaultStatus: 'planned' },
    { id: 'cellar.grid', labelKo: '셀러 그리드', labelEn: 'Cellar grid', defaultStatus: 'planned' },
  ]);

  const items = useMemo(() => {
    const list = getCellarByUser(user.id);
    const withWine = list
      .map((it) => ({ it, wine: getWine(it.wineId) }))
      .filter((x): x is { it: typeof list[number]; wine: NonNullable<ReturnType<typeof getWine>> } => x.wine != null);

    const now = new Date().getFullYear();
    switch (sort) {
      case 'drinkSoon':
        return withWine.sort((a, b) => {
          const ap = Math.abs(getDrinkWindow(a.wine).peak - now);
          const bp = Math.abs(getDrinkWindow(b.wine).peak - now);
          return ap - bp;
        });
      case 'vintage':
        return withWine.sort((a, b) => b.wine.vintage - a.wine.vintage);
      case 'region':
        return withWine.sort((a, b) => a.wine.region.en.localeCompare(b.wine.region.en));
      case 'storage':
        return withWine.sort((a, b) => a.it.storage.localeCompare(b.it.storage));
      case 'price':
        return withWine.sort((a, b) => (b.it.purchasePriceKrw ?? 0) - (a.it.purchasePriceKrw ?? 0));
      case 'recent':
      default:
        return withWine.sort(
          (a, b) => new Date(b.it.acquiredAt).getTime() - new Date(a.it.acquiredAt).getTime(),
        );
    }
  }, [user.id, sort]);

  const SORT_KEYS: SortKey[] = ['recent', 'drinkSoon', 'vintage', 'region', 'storage', 'price'];

  return (
    <>
      <AppHeader
        hasUnreadNotification={unread > 0}
        avatarInitial={avatar}
        levelId={user.id === 'me-heavy' ? user.levelId : null}
      />
      <div className="wm-scroll-area">
        <div
          data-feature-id="cellar.titleBar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 20px 12px',
          }}
        >
          <h1
            className="wm-page-title"
            style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, margin: 0 }}
          >
            {t('title')}
          </h1>
          <button
            type="button"
            onClick={() => toast({ message: t('addToast') })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 10,
              border: '1px solid var(--color-border-default)',
              background: 'transparent',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={14} strokeWidth={2} />
            {t('addCta')}
          </button>
        </div>

        {items.length === 0 ? (
          <CellarEmptyState />
        ) : (
          <>
            <div
              data-feature-id="cellar.sortChips"
              style={{
                display: 'flex',
                gap: 8,
                padding: '0 16px 12px',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {SORT_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSort(key)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 12px',
                    borderRadius: 16,
                    border: '1px solid var(--color-border-default)',
                    background: sort === key ? 'var(--color-wine-red)' : 'transparent',
                    color: sort === key ? 'var(--color-cream)' : 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t(`sort.${key}`)}
                </button>
              ))}
            </div>
            <div
              data-feature-id="cellar.grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                padding: '0 16px 24px',
              }}
            >
              {items.map(({ it, wine }) => (
                <CellarCard key={it.id} item={it} wine={wine} />
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </>
  );
}
