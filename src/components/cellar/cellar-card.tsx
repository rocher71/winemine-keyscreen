'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { LocaleText } from '@/components/shared/locale-text';
import { WineLabelArt } from '@/components/shared/wine-label-art';
import { DrinkWindowBadge } from './drink-window-badge';
import { getDrinkWindow, getDrinkWindowStatus } from '@/lib/drink-window';
import type { CellarItem, Wine } from '@/types';

type Props = {
  item: CellarItem;
  wine: Wine;
};

export function CellarCard({ item, wine }: Props) {
  const status = getDrinkWindowStatus(wine);
  const dw = getDrinkWindow(wine);

  return (
    <Link
      href={`/cellar/${item.id}` as Route}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 14,
        overflow: 'hidden',
        textDecoration: 'none',
        height: 220,
      }}
    >
      <div
        style={{
          height: 140,
          background: `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 75%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WineLabelArt
          initial={wine.name.charAt(0)}
          bottleColor={wine.bottleColor}
          width={70}
          height={104}
          rounded={6}
        />
      </div>
      <div
        style={{
          flex: 1,
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 13,
            color: 'var(--color-cream)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {wine.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
          }}
        >
          {wine.vintage} · <LocaleText value={wine.region} as="span" />
        </div>
        <div style={{ marginTop: 'auto' }}>
          <DrinkWindowBadge status={status} fromYear={dw.from} />
        </div>
      </div>
    </Link>
  );
}
