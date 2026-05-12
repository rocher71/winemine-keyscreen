'use client';

import { Star } from 'lucide-react';
import { useFavorites } from '@/context/favorites-context';
import { toast } from '@/hooks/use-toast';

type Props = {
  wineId: string;
  size?: number;
};

/**
 * 즐겨찾기 토글 — Star (채워지면 Gold fill).
 * 클릭 시 FavoritesContext.toggleFavorite + 토스트.
 */
export function FavoriteToggle({ wineId, size = 22 }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(wineId);

  const onClick = () => {
    toggleFavorite(wineId);
    toast({
      message: active
        ? { ko: '즐겨찾기에서 제거했어요', en: 'Removed from favorites' }
        : { ko: '즐겨찾기에 추가했어요', en: 'Added to favorites' },
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? 'Remove favorite' : 'Add favorite'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        padding: 0,
        background: 'transparent',
        border: 'none',
        color: active ? 'var(--color-gold)' : 'var(--color-text-secondary)',
        cursor: 'pointer',
      }}
    >
      <Star
        size={size}
        strokeWidth={1.75}
        fill={active ? 'var(--color-gold)' : 'transparent'}
      />
    </button>
  );
}
