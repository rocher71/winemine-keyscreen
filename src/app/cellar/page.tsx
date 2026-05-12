'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Search, X } from 'lucide-react';
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
import type { CellarItem, Wine } from '@/types';

type SortKey = 'recent' | 'drinkSoon' | 'vintage' | 'region' | 'storage' | 'price';
type TypeFilter = 'all' | 'red' | 'white' | 'sparkling' | 'rosé' | 'fortified' | 'dessert';

interface ItemWithWine {
  it: CellarItem;
  wine: Wine;
}

const SORT_KEYS: SortKey[] = ['recent', 'drinkSoon', 'vintage', 'region', 'storage', 'price'];
const TYPE_FILTERS: TypeFilter[] = ['all', 'red', 'white', 'sparkling', 'rosé', 'fortified'];

export default function CellarListPage() {
  const t = useTranslations('cellar');
  const { user } = useMockUser();
  const avatar = useLocalizedText(user.avatarInitial);
  const unread = getUnreadCount(user.id);

  const [sort, setSort] = useState<SortKey>('recent');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [query, setQuery] = useState('');

  useRegisterFeatures('/cellar', [
    { id: 'cellar.titleBar', labelKo: '타이틀 + 등록 버튼', labelEn: 'Title + add', defaultStatus: 'planned' },
    { id: 'cellar.search', labelKo: '검색 입력', labelEn: 'Search input', defaultStatus: 'planned' },
    { id: 'cellar.typeFilter', labelKo: '와인 타입 필터', labelEn: 'Wine type filter', defaultStatus: 'planned' },
    { id: 'cellar.sortChips', labelKo: '정렬 칩', labelEn: 'Sort chips', defaultStatus: 'planned' },
    { id: 'cellar.resultCount', labelKo: '결과 카운트', labelEn: 'Result count', defaultStatus: 'considering' },
    { id: 'cellar.grid', labelKo: '셀러 그리드', labelEn: 'Cellar grid', defaultStatus: 'planned' },
  ]);

  /* 1. raw list — wine 있는 항목만 */
  const rawItems: ItemWithWine[] = useMemo(() => {
    const list = getCellarByUser(user.id);
    return list
      .map((it) => ({ it, wine: getWine(it.wineId) }))
      .filter((x): x is ItemWithWine => x.wine != null);
  }, [user.id]);

  /* 2. type filter */
  const typeFilteredItems = useMemo(() => {
    if (typeFilter === 'all') return rawItems;
    return rawItems.filter(({ wine }) => wine.wineType === typeFilter);
  }, [rawItems, typeFilter]);

  /* 3. text 검색 — 이름 / 생산자 / 지역 / 국가 / 아펠라시옹 / 품종 / 빈티지 */
  const searchedItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return typeFilteredItems;
    return typeFilteredItems.filter(({ wine }) => {
      const haystack = [
        wine.name,
        wine.producer.ko,
        wine.producer.en,
        wine.region.ko,
        wine.region.en,
        wine.country.ko,
        wine.country.en,
        wine.appellation.ko,
        wine.appellation.en,
        ...wine.grapes.flatMap((g) => [g.ko, g.en]),
        String(wine.vintage),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [typeFilteredItems, query]);

  /* 4. sort */
  const items = useMemo(() => {
    const list = [...searchedItems];
    const now = new Date().getFullYear();
    switch (sort) {
      case 'drinkSoon':
        return list.sort((a, b) => {
          const ap = Math.abs(getDrinkWindow(a.wine).peak - now);
          const bp = Math.abs(getDrinkWindow(b.wine).peak - now);
          return ap - bp;
        });
      case 'vintage':
        return list.sort((a, b) => b.wine.vintage - a.wine.vintage);
      case 'region':
        return list.sort((a, b) => a.wine.region.en.localeCompare(b.wine.region.en));
      case 'storage':
        return list.sort((a, b) => a.it.storage.localeCompare(b.it.storage));
      case 'price':
        return list.sort((a, b) => (b.it.purchasePriceKrw ?? 0) - (a.it.purchasePriceKrw ?? 0));
      case 'recent':
      default:
        return list.sort((a, b) => new Date(b.it.acquiredAt).getTime() - new Date(a.it.acquiredAt).getTime());
    }
  }, [searchedItems, sort]);

  const hasAnyItems = rawItems.length > 0;
  const isFiltered = query.trim().length > 0 || typeFilter !== 'all';

  return (
    <>
      <AppHeader
        hasUnreadNotification={unread > 0}
        avatarInitial={avatar}
        levelId={user.id === 'me-heavy' ? user.levelId : null}
      />
      <div className="wm-scroll-area">
        {/* Title + Add */}
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

        {!hasAnyItems ? (
          <CellarEmptyState />
        ) : (
          <>
            {/* Search input */}
            <div data-feature-id="cellar.search" style={{ padding: '0 16px 10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 12,
                }}
              >
                <Search size={16} color="var(--color-text-muted)" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  aria-label={t('searchPlaceholder')}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-cream)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 13,
                    padding: 0,
                    minWidth: 0,
                  }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={t('clearSearch')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 22,
                      height: 22,
                      border: 'none',
                      background: 'rgba(245,240,232,0.08)',
                      borderRadius: 11,
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <X size={12} strokeWidth={2.25} />
                  </button>
                )}
              </div>
            </div>

            {/* Type filter chips */}
            <div
              data-feature-id="cellar.typeFilter"
              style={{
                display: 'flex',
                gap: 6,
                padding: '0 16px 10px',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {TYPE_FILTERS.map((tf) => {
                const active = typeFilter === tf;
                return (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTypeFilter(tf)}
                    style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '5px 10px 5px 8px',
                      borderRadius: 14,
                      border: active ? '1px solid var(--color-gold)' : '1px solid var(--color-border-default)',
                      background: active ? 'rgba(201, 168, 76, 0.12)' : 'transparent',
                      color: active ? 'var(--color-gold)' : 'var(--color-text-muted)',
                      fontFamily: 'var(--font-inter)',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <TypeDot type={tf} active={active} />
                    {t(`filterType.${tf}`)}
                  </button>
                );
              })}
            </div>

            {/* Sort chips */}
            <div
              data-feature-id="cellar.sortChips"
              style={{
                display: 'flex',
                gap: 8,
                padding: '0 16px 10px',
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
                    padding: '5px 11px',
                    borderRadius: 14,
                    border: '1px solid var(--color-border-default)',
                    background: sort === key ? 'var(--color-wine-red)' : 'transparent',
                    color: sort === key ? 'var(--color-cream)' : 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t(`sort.${key}`)}
                </button>
              ))}
            </div>

            {/* Result count */}
            <div
              data-feature-id="cellar.resultCount"
              style={{
                padding: '0 20px 10px',
                fontFamily: 'var(--font-inter)',
                fontSize: 11,
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>
                {isFiltered
                  ? t('resultCount.filtered', { shown: items.length, total: rawItems.length })
                  : t('resultCount.total', { total: rawItems.length })}
              </span>
              {isFiltered && (items.length !== rawItems.length) && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setTypeFilter('all');
                  }}
                  style={{
                    all: 'unset',
                    color: 'var(--color-gold)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 11,
                  }}
                >
                  {t('clearFilters')}
                </button>
              )}
            </div>

            {/* Grid or no-results */}
            {items.length === 0 ? (
              <NoResults t={t} onClear={() => { setQuery(''); setTypeFilter('all'); }} />
            ) : (
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
            )}
          </>
        )}
      </div>
      <BottomNav />
    </>
  );
}

/* ─────────────────────── 보조 컴포넌트 ─────────────────────── */

function TypeDot({ type, active }: { type: TypeFilter; active: boolean }) {
  if (type === 'all') {
    return (
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #8B1A2A 0%, #C9A84C 50%, #F5F0E8 100%)',
          opacity: active ? 1 : 0.5,
        }}
      />
    );
  }
  const color: Record<Exclude<TypeFilter, 'all'>, string> = {
    red: '#8B1A2A',
    white: '#E8D89B',
    sparkling: '#F5F0E8',
    rosé: '#D4707A',
    fortified: '#6B1421',
    dessert: '#C9A84C',
  };
  return (
    <span
      aria-hidden
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        background: color[type],
        opacity: active ? 1 : 0.55,
      }}
    />
  );
}

function NoResults({ t, onClear }: { t: ReturnType<typeof useTranslations>; onClear: () => void }) {
  return (
    <div
      style={{
        margin: '8px 16px 24px',
        padding: '32px 20px',
        textAlign: 'center',
        border: '1px dashed var(--color-border-default)',
        borderRadius: 14,
      }}
    >
      <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, color: 'var(--color-cream)', marginBottom: 6 }}>
        {t('noResults.title')}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: 'var(--color-text-muted)',
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        {t('noResults.body')}
      </div>
      <button
        type="button"
        onClick={onClear}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'inline-block',
          padding: '8px 16px',
          borderRadius: 10,
          background: 'transparent',
          border: '1px solid var(--color-gold)',
          color: 'var(--color-gold)',
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {t('clearFilters')}
      </button>
    </div>
  );
}
