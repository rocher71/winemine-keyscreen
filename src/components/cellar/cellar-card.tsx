'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { LocaleText } from '@/components/shared/locale-text';
import { WMBottle } from '@/components/shared/wm-bottle';
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
      }}
    >
      {/* 병 영역 */}
      <div
        style={{
          padding: '14px 0 8px',
          background: `linear-gradient(160deg, ${wine.bottleColor}28 0%, var(--color-bottle-shelf) 80%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WMBottle
          bottleColor={wine.bottleColor}
          producer={wine.producer.ko || wine.producer.en}
          label={wine.name.split(' ')[0]}
          vintage={wine.vintage}
          width={40}
          height={130}
        />
      </div>

      {/* 메타 */}
      <div
        style={{
          padding: '10px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          minWidth: 0,
        }}
      >
        {/* 와인 타입 색 dot */}
        <WineTypeDot wineType={wine.wineType} />
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 12,
            color: 'var(--color-cream)',
            lineHeight: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 30,
          }}
        >
          {wine.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            color: 'var(--color-text-muted)',
          }}
        >
          <LocaleText value={wine.producer} as="span" />
          <br />
          <span style={{ color: 'var(--color-text-secondary)' }}>{wine.vintage}</span>
        </div>
        <div style={{ marginTop: 4 }}>
          <DrinkWindowBadge status={status} fromYear={dw.from} />
        </div>
      </div>
    </Link>
  );
}

function WineTypeDot({ wineType }: { wineType: string }) {
  const colorMap: Record<string, string> = {
    red: '#8B1A2A',
    white: '#d6c46b',
    sparkling: '#e8d690',
    rosé: '#e89b9b',
    fortified: '#5a2218',
    dessert: '#a07030',
  };
  const color = colorMap[wineType] ?? '#8B1A2A';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: color, display: 'inline-block' }} />
    </span>
  );
}
