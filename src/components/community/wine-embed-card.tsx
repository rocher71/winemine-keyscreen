'use client';

import Link from 'next/link';
import { MapPin, ChevronRight } from 'lucide-react';
import { getWine } from '@/lib/mock/wines';
import { useLocale } from '@/context/locale-context';
import type { Route } from 'next';

type Props = {
  wineId: string;
  mini?: boolean;
};

export function WineEmbedCard({ wineId, mini = false }: Props) {
  const wine = getWine(wineId);
  const { locale } = useLocale();

  if (!wine) return null;

  const name = wine.name;
  const producer = locale === 'en' ? wine.producer.en : wine.producer.ko;

  return (
    <Link
      href={`/wine/${wine.id}` as Route}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
        padding: mini ? 10 : 12,
        borderRadius: 12,
        background: 'var(--color-bg-deep)',
        border: '1px solid rgba(201,168,76,0.2)',
        textDecoration: 'none',
      }}
    >
      {/* bottle silhouette */}
      <div
        style={{
          width: mini ? 22 : 28,
          height: mini ? 74 : 94,
          borderRadius: 4,
          background: wine.bottleColor,
          flexShrink: 0,
          opacity: 0.85,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <MapPin size={10} strokeWidth={2} color="var(--color-gold)" />
          <span
            style={{
              fontSize: 9,
              color: 'var(--color-gold)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {locale === 'en' ? 'This Wine' : '이 와인'}
          </span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 12.5,
            color: 'var(--color-cream)',
            lineHeight: 1.3,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
          {producer} · {wine.vintage}
        </div>
      </div>

      <ChevronRight size={14} strokeWidth={1.75} color="var(--color-gold)" />
    </Link>
  );
}
