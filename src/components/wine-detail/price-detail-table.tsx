'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRight } from 'lucide-react';
import { LocaleText } from '@/components/shared/locale-text';
import { LevelPill } from '@/components/shared/level-pill';
import { getStore } from '@/lib/mock/stores';
import { getUserById } from '@/lib/mock/users';
import { getLevel } from '@/lib/mock/levels';
import type { Purchase, Store } from '@/types';

type SortKey = 'priceAsc' | 'recent';

type Props = {
  purchases: Purchase[];
};

type Group = {
  store: Store;
  items: Purchase[];
};

/**
 * 매장별 그룹 리스트. 작성자 익명화 (Lv·뱃지만 노출).
 * 닉네임은 절대 노출하지 않음 — SPEC 정책.
 */
export function PriceDetailTable({ purchases }: Props) {
  const [sort, setSort] = useState<SortKey>('priceAsc');

  const groups = useMemo<Group[]>(() => {
    const byStore = new Map<string, Purchase[]>();
    for (const p of purchases) {
      const arr = byStore.get(p.storeId) ?? [];
      arr.push(p);
      byStore.set(p.storeId, arr);
    }
    const list: Group[] = [];
    for (const [storeId, items] of byStore) {
      const store = getStore(storeId);
      if (!store) continue;
      list.push({ store, items });
    }

    if (sort === 'priceAsc') {
      list.sort((a, b) => {
        const aMin = Math.min(...a.items.map((p) => p.priceKrw));
        const bMin = Math.min(...b.items.map((p) => p.priceKrw));
        return aMin - bMin;
      });
    } else {
      list.sort((a, b) => {
        const aMax = Math.max(
          ...a.items.map((p) => new Date(p.purchasedAt).getTime()),
        );
        const bMax = Math.max(
          ...b.items.map((p) => new Date(p.purchasedAt).getTime()),
        );
        return bMax - aMax;
      });
    }
    // each group's items sorted same way
    for (const g of list) {
      if (sort === 'priceAsc') g.items.sort((a, b) => a.priceKrw - b.priceKrw);
      else
        g.items.sort(
          (a, b) =>
            new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime(),
        );
    }
    return list;
  }, [purchases, sort]);

  if (purchases.length === 0) {
    return (
      <section style={{ margin: '0 16px', padding: 24, textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <LocaleText value={{ ko: '등록된 가격이 없어요', en: 'No prices registered yet' }} />
      </section>
    );
  }

  return (
    <section style={{ margin: '0 16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--color-cream)',
          }}
        >
          <LocaleText value={{ ko: '매장별 등록', en: 'By store' }} />
        </h2>
        <div style={{ display: 'flex', gap: 4 }}>
          <SortBtn
            label={{ ko: '가격 낮은 순', en: 'Lowest' }}
            active={sort === 'priceAsc'}
            onClick={() => setSort('priceAsc')}
          />
          <SortBtn
            label={{ ko: '최근', en: 'Recent' }}
            active={sort === 'recent'}
            onClick={() => setSort('recent')}
          />
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {groups.map((g) => (
          <li
            key={g.store.id}
            style={{
              padding: 12,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 12,
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <LocaleText
                value={g.store.name}
                as="div"
                className="wm-store-name"
              />
              {g.store.branch && (
                <LocaleText
                  value={g.store.branch}
                  as="div"
                  className="wm-store-branch"
                />
              )}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {g.items.map((p) => (
                <PurchaseRow key={p.id} purchase={p} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SortBtn({
  label,
  active,
  onClick,
}: {
  label: import('@/types').LocalizedString;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '4px 10px',
        background: active ? 'var(--color-wine-red)' : 'var(--color-bg-map)',
        color: active ? 'var(--color-cream)' : 'var(--color-text-muted)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 8,
        fontFamily: 'var(--font-inter)',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      <LocaleText value={label} />
    </button>
  );
}

function PurchaseRow({ purchase }: { purchase: Purchase }) {
  const user = getUserById(purchase.userId);
  const isSelf = purchase.userId === 'me-heavy' || purchase.userId === 'me-first';
  const levelId = (user?.levelId ?? 2) as 1 | 2 | 3 | 4 | 5;
  const level = getLevel(levelId);

  return (
    <Link
      href={`/profile/${purchase.userId}` as Route}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 4px',
        textDecoration: 'none',
        color: 'inherit',
        borderTop: '1px dashed var(--color-border-default)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--color-cream)',
          }}
        >
          ₩{purchase.priceKrw.toLocaleString()}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
          }}
        >
          <span>{purchase.purchasedAt}</span>
          <span>·</span>
          <LevelPill level={levelId} />
          <span style={{ color: 'var(--color-text-muted)' }}>
            {isSelf ? (
              <LocaleText value={{ ko: '내 등록', en: 'My entry' }} />
            ) : (
              <LocaleText value={level.name} />
            )}
          </span>
        </div>
      </div>
      <ChevronRight size={16} strokeWidth={1.75} color="var(--color-text-muted)" />
    </Link>
  );
}
