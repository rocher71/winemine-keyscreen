'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { Plus, Search, X } from 'lucide-react';
import { AppHeader } from '@/components/nav/app-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { useMockUser } from '@/hooks/use-mock-user';
import { getCellarByUser } from '@/lib/mock/cellar';
import { getWine } from '@/lib/mock/wines';
import { getTastingNotesByUser } from '@/lib/mock/tasting-notes';
import { getUnreadCount } from '@/lib/mock/notifications';
import { useLocalizedText } from '@/components/shared/locale-text';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { toast } from '@/hooks/use-toast';
import { CellarCard } from '@/components/cellar/cellar-card';
import { CellarEmptyState } from '@/components/cellar/cellar-empty-state';
import { WMBottle } from '@/components/shared/wm-bottle';
import { WMGlassRating } from '@/components/shared/wm-glass-rating';
import { LocaleText } from '@/components/shared/locale-text';
import { getDrinkWindow } from '@/lib/drink-window';
import type { CellarItem, Wine, TastingNote } from '@/types';

type CellarTab = 'cellar' | 'tasted';
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

  const [tab, setTab] = useState<CellarTab>('cellar');
  const [sort, setSort] = useState<SortKey>('recent');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [query, setQuery] = useState('');

  /* 마신 와인 — 테이스팅 노트 기반, 최신 노트 기준 dedup */
  const tastedItems = useMemo(() => {
    const notes = getTastingNotesByUser(user.id)
      .slice()
      .sort((a, b) => (a.tastedAt < b.tastedAt ? 1 : -1));
    const seen = new Set<string>();
    const result: { note: TastingNote; wine: Wine }[] = [];
    for (const note of notes) {
      if (seen.has(note.wineId)) continue;
      const wine = getWine(note.wineId);
      if (!wine) continue;
      seen.add(note.wineId);
      result.push({ note, wine });
    }
    return result;
  }, [user.id]);

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
        {/* Title + Tab + Add */}
        <div
          data-feature-id="cellar.titleBar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 16px 12px',
          }}
        >
          {/* 탭 세그먼트 */}
          <div
            style={{
              display: 'flex',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 10,
              padding: 3,
              gap: 2,
              flexShrink: 0,
            }}
          >
            {([
              { key: 'cellar' as CellarTab, label: t('title'), count: rawItems.length },
              { key: 'tasted' as CellarTab, label: '마신 와인', count: tastedItems.length },
            ] as const).map(({ key, label, count }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 7,
                    border: 'none',
                    background: active ? 'var(--color-wine-red)' : 'transparent',
                    color: active ? 'var(--color-cream)' : 'var(--color-text-muted)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    whiteSpace: 'nowrap',
                    transition: 'background 150ms ease, color 150ms ease',
                  }}
                >
                  {label}
                  <span
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 10,
                      fontWeight: 700,
                      color: active ? 'rgba(245,240,232,0.7)' : 'var(--color-text-disabled)',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1 }} />

          {tab === 'cellar' && (
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
          )}
        </div>

        {/* 마신 와인 탭 */}
        {tab === 'tasted' && (
          <TastedWinesList items={tastedItems} query={query} setQuery={setQuery} />
        )}

        {/* 내 셀러 탭 */}
        {tab === 'cellar' && (!hasAnyItems ? (
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
        ))}
      </div>
      <BottomNav />
    </>
  );
}

/* ─────────────────────── 마신 와인 탭 ─────────────────────── */

function TastedWinesList({
  items,
  query,
  setQuery,
}: {
  items: { note: TastingNote; wine: Wine }[];
  query: string;
  setQuery: (q: string) => void;
}) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(({ wine }) => {
      const hay = [wine.name, wine.producer.ko, wine.producer.en, wine.region.ko, wine.region.en, String(wine.vintage)]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  return (
    <>
      {/* 검색 */}
      <div style={{ padding: '0 16px 10px' }}>
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
            placeholder="이름·생산자·지역·빈티지"
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

      {/* 결과 수 */}
      <div style={{ padding: '0 20px 10px', fontFamily: 'var(--font-inter)', fontSize: 11, color: 'var(--color-text-muted)' }}>
        {filtered.length}병 시음 기록
      </div>

      {/* 리스트 */}
      {filtered.length === 0 ? (
        <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--color-text-muted)', fontFamily: 'var(--font-inter)', fontSize: 13 }}>
          검색 결과가 없어요
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px 24px' }}>
          {filtered.map(({ note, wine }) => (
            <TastedWineRow key={note.id} note={note} wine={wine} />
          ))}
        </div>
      )}
    </>
  );
}

function TastedWineRow({ note, wine }: { note: TastingNote; wine: Wine }) {
  const router = useRouter();

  // 0~5 스케일로 통일
  const rating = note.expertFields?.rating != null
    ? note.expertFields.rating / 20   // expert: 0~100 → 0~5
    : (note.beginnerFields?.rating ?? 0); // beginner: 이미 0~5

  const ratingDisplay = note.expertFields?.rating != null
    ? `${Math.round(note.expertFields.rating)}/100`
    : note.beginnerFields?.rating != null
      ? `${note.beginnerFields.rating}/5`
      : null;

  const isExpert = note.mode === 'expert';
  const dateStr = note.tastedAt.slice(0, 10);

  // expert 아로마 힌트 (aromas는 lexicon id 배열)
  const aromaHint = note.beginnerFields?.aromas?.slice(0, 3).join(' · ') ?? '';

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      {/* 상단: 와인 정보 행 */}
      <div style={{ display: 'flex', gap: 12, padding: 12, alignItems: 'center' }}>
        <WMBottle
          bottleColor={wine.bottleColor}
          producer={wine.producer.ko || wine.producer.en}
          label={wine.name.split(' ')[0]}
          vintage={wine.vintage}
          width={36}
          height={118}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <WineTypeDotSmall wineType={wine.wineType} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'var(--color-text-disabled)', marginLeft: 'auto' }}>
              {dateStr}
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 14,
              color: 'var(--color-cream)',
              lineHeight: 1.25,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {wine.name}
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
            <LocaleText value={wine.producer} as="span" /> · {wine.vintage}
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
            <LocaleText value={wine.region} as="span" />
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div style={{ height: '0.5px', background: 'var(--color-border-default)', margin: '0 12px' }} />

      {/* 내 테이스팅 노트 미리보기 */}
      <div style={{ padding: '10px 12px' }}>
        {/* 노트 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {/* 펜 아이콘 */}
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m4 20 4-1 11-11-3-3L5 16z" />
          </svg>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            내 시음 노트
          </span>
          {/* 모드 뱃지 */}
          <span
            style={{
              padding: '1px 7px',
              borderRadius: 999,
              background: isExpert ? 'rgba(139,26,42,0.25)' : 'rgba(201,168,76,0.15)',
              color: isExpert ? 'var(--color-cream)' : '#C9A84C',
              fontFamily: 'var(--font-inter)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {isExpert ? '전문가' : '입문자'}
          </span>
          {/* 평점 */}
          {ratingDisplay && (
            <>
              <span style={{ flex: 1 }} />
              <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 13, color: '#C9A84C', fontWeight: 600 }}>
                {ratingDisplay}
              </span>
            </>
          )}
        </div>

        {/* 와인잔 평점 */}
        {rating > 0 && (
          <div style={{ marginBottom: 6 }}>
            <WMGlassRating value={Math.round(rating)} size={9} />
          </div>
        )}

        {/* 아로마 힌트 (beginner) */}
        {aromaHint && (
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.45, marginBottom: 8 }}>
            {aromaHint}
          </div>
        )}

        {/* expert: 핵심 차원 4개 */}
        {isExpert && note.expertFields && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 4,
              padding: '8px 10px',
              background: 'rgba(15,7,24,0.5)',
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            {[
              { l: '산도', v: wsetShortKo(note.expertFields.acidity) },
              { l: '바디', v: wsetShortKo(note.expertFields.body) },
              { l: '타닌', v: wsetShortKo(note.expertFields.tannin) },
              { l: '단맛', v: wsetShortKo(note.expertFields.sweetness) },
            ].map((d) => (
              <div key={d.l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 8, color: 'var(--color-text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>{d.l}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 11, color: 'var(--color-cream)' }}>{d.v}</div>
              </div>
            ))}
          </div>
        )}

        {/* 액션 버튼 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            href={`/notes/${note.id}` as Route}
            style={{
              flex: 1.4,
              padding: '8px 0',
              borderRadius: 8,
              background: 'transparent',
              border: '1px solid #C9A84C',
              color: '#C9A84C',
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            노트 보기
          </Link>
          <button
            type="button"
            onClick={() => router.push(`/notes/new/write?from=newEntry&wineId=${encodeURIComponent(wine.id)}&edit=1` as Route)}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 8,
              background: 'var(--color-bg-deep)',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            편집
          </button>
          <Link
            href={`/wine/${wine.id}` as Route}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 8,
              background: 'var(--color-bg-deep)',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            와인 상세
          </Link>
        </div>
      </div>
    </div>
  );
}

function wsetShortKo(scale: string): string {
  return ({ low: '낮음', mediumMinus: '중−', medium: '중', mediumPlus: '중+', high: '높음' } as Record<string, string>)[scale] ?? scale;
}

function WineTypeDotSmall({ wineType }: { wineType: string }) {
  const colorMap: Record<string, string> = {
    red: '#8B1A2A',
    white: '#d6c46b',
    sparkling: '#e8d690',
    rosé: '#e89b9b',
    fortified: '#5a2218',
    dessert: '#a07030',
  };
  const labelMap: Record<string, string> = {
    red: '레드', white: '화이트', sparkling: '스파클링',
    rosé: '로제', fortified: '주정강화', dessert: '디저트',
  };
  const color = colorMap[wineType] ?? '#8B1A2A';
  const label = labelMap[wineType] ?? wineType;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: color, display: 'inline-block' }} />
      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: 'var(--color-text-muted)' }}>{label}</span>
    </span>
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
