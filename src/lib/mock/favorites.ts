/**
 * Favorite Wines — 헤비 유저 7개
 *
 * 일부는 notifyOnPurchase=true (관심 와인 등록 시 알림 받기).
 * 추가될 와인은 모두 셀러에 없는 것 + featured 와인 위주.
 */

import type { FavoriteWine } from '@/types';

export const FAVORITES: FavoriteWine[] = [
  {
    id: 'fav_001',
    userId: 'me-heavy',
    wineId: 'bgy-romanee-st-vivant',
    notifyOnPurchase: true,
    addedAt: '2025-12-15',
  },
  {
    id: 'fav_002',
    userId: 'me-heavy',
    wineId: 'pie-barolo-giacomo-conterno',
    notifyOnPurchase: true,
    addedAt: '2025-11-20',
  },
  {
    id: 'fav_003',
    userId: 'me-heavy',
    wineId: 'rhn-chateau-rayas',
    notifyOnPurchase: true,
    addedAt: '2025-12-05',
  },
  {
    id: 'fav_004',
    userId: 'me-heavy',
    wineId: 'mos-egon-muller-scharzhof',
    notifyOnPurchase: true,
    addedAt: '2026-01-10',
  },
  {
    id: 'fav_005',
    userId: 'me-heavy',
    wineId: 'nap-screaming-eagle',
    notifyOnPurchase: true,
    addedAt: '2026-02-04',
  },
  {
    id: 'fav_006',
    userId: 'me-heavy',
    wineId: 'tus-bolgheri-sassicaia',
    notifyOnPurchase: false,
    addedAt: '2026-02-28',
  },
  {
    id: 'fav_007',
    userId: 'me-heavy',
    wineId: 'aus-penfolds-grange',
    notifyOnPurchase: true,
    addedAt: '2026-03-15',
  },
];

export function getFavoritesByUser(userId: string): FavoriteWine[] {
  return FAVORITES.filter((f) => f.userId === userId);
}

export function isFavorite(userId: string, wineId: string): boolean {
  return FAVORITES.some((f) => f.userId === userId && f.wineId === wineId);
}
