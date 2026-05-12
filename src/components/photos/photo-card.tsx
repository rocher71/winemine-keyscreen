'use client';

import { Star, HelpCircle } from 'lucide-react';
import type { LabelPhoto } from '@/types';
import { getWine } from '@/lib/mock/wines';

type Props = {
  photo: LabelPhoto;
  onClick: () => void;
};

function shortDate(iso: string): string {
  return iso.slice(2, 10).replace(/-/g, '/');
}

export function PhotoCard({ photo, onClick }: Props) {
  const wine = photo.wineId ? getWine(photo.wineId) : null;
  const bg = wine ? wine.bottleColor : '#3f0f1f';
  const initial = wine ? wine.name.charAt(0) : '?';

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        position: 'relative',
        aspectRatio: '1 / 1',
        background: `linear-gradient(160deg, ${bg} 0%, #1a0a1e 80%)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-cream)',
          fontFamily: 'var(--font-playfair)',
          fontSize: 36,
          opacity: 0.65,
        }}
      >
        {initial}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: 'rgba(5,2,10,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {wine ? (
          <Star size={10} color="var(--color-gold)" fill="var(--color-gold)" />
        ) : (
          <HelpCircle size={10} color="var(--color-text-muted)" />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 4,
          right: 4,
          padding: '1px 4px',
          background: 'rgba(5,2,10,0.7)',
          borderRadius: 4,
          fontFamily: 'var(--font-inter)',
          fontSize: 9,
          color: 'var(--color-text-secondary)',
        }}
      >
        {shortDate(photo.capturedAt)}
      </div>
    </button>
  );
}
