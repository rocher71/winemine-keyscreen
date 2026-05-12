/**
 * Notifications — 헤비 유저 12개
 *
 * 분포 (SPEC mock_data_setup):
 *   favoritePurchase 5, drinkWindowReached 4, badgeEarned 2, levelUp 1
 *
 * createdAt은 최신 → 과거 순. 일부는 read=true, 일부 false.
 */

import type { Notification } from '@/types';

export const NOTIFICATIONS: Notification[] = [
  /* ── favoritePurchase × 5 ── */
  {
    id: 'noti_001',
    userId: 'me-heavy',
    kind: 'favoritePurchase',
    wineId: 'bgy-romanee-st-vivant',
    cellarItemId: null,
    badgeId: null,
    actorUserId: 'anon-cp-0029',
    title: { ko: '관심 와인이 등록됐어요', en: 'A favourite wine just got logged' },
    body: {
      ko: '도윤님이 Romanée-Saint-Vivant Grand Cru를 ₩5,650,000에 구매 기록했습니다.',
      en: 'Doyoon logged a purchase of Romanée-Saint-Vivant Grand Cru at ₩5,650,000.',
    },
    createdAt: '2026-05-10T09:14:00Z',
    read: false,
  },
  {
    id: 'noti_002',
    userId: 'me-heavy',
    kind: 'favoritePurchase',
    wineId: 'pie-barolo-giacomo-conterno',
    cellarItemId: null,
    badgeId: null,
    actorUserId: 'anon-cp-0083',
    title: { ko: '관심 와인이 등록됐어요', en: 'A favourite wine just got logged' },
    body: {
      ko: '익명 사용자가 Barolo Cascina Francia를 ₩1,250,000에 구매 기록했습니다.',
      en: 'An anonymous user logged a purchase of Barolo Cascina Francia at ₩1,250,000.',
    },
    createdAt: '2026-05-08T18:22:00Z',
    read: false,
  },
  {
    id: 'noti_003',
    userId: 'me-heavy',
    kind: 'favoritePurchase',
    wineId: 'mos-egon-muller-scharzhof',
    cellarItemId: null,
    badgeId: null,
    actorUserId: 'anon-cp-0142',
    title: { ko: '관심 와인이 등록됐어요', en: 'A favourite wine just got logged' },
    body: {
      ko: '익명 사용자가 Scharzhofberger Kabinett을 ₩395,000에 구매 기록했습니다.',
      en: 'An anonymous user logged a purchase of Scharzhofberger Kabinett at ₩395,000.',
    },
    createdAt: '2026-05-05T14:08:00Z',
    read: true,
  },
  {
    id: 'noti_004',
    userId: 'me-heavy',
    kind: 'favoritePurchase',
    wineId: 'rhn-chateau-rayas',
    cellarItemId: null,
    badgeId: null,
    actorUserId: 'anon-cp-0195',
    title: { ko: '관심 와인이 등록됐어요', en: 'A favourite wine just got logged' },
    body: {
      ko: '익명 사용자가 Château Rayas를 ₩1,100,000에 구매 기록했습니다.',
      en: 'An anonymous user logged a purchase of Château Rayas at ₩1,100,000.',
    },
    createdAt: '2026-04-30T11:45:00Z',
    read: true,
  },
  {
    id: 'noti_005',
    userId: 'me-heavy',
    kind: 'favoritePurchase',
    wineId: 'aus-penfolds-grange',
    cellarItemId: null,
    badgeId: null,
    actorUserId: 'anon-cp-0231',
    title: { ko: '관심 와인이 등록됐어요', en: 'A favourite wine just got logged' },
    body: {
      ko: '익명 사용자가 Penfolds Grange를 ₩1,210,000에 구매 기록했습니다.',
      en: 'An anonymous user logged a purchase of Penfolds Grange at ₩1,210,000.',
    },
    createdAt: '2026-04-22T20:30:00Z',
    read: true,
  },

  /* ── drinkWindowReached × 4 ── */
  {
    id: 'noti_006',
    userId: 'me-heavy',
    kind: 'drinkWindowReached',
    wineId: 'bdx-leoville-barton',
    cellarItemId: 'cellar_003',
    badgeId: null,
    actorUserId: null,
    title: { ko: '마실 시기가 다가왔어요', en: 'A drinking window has opened' },
    body: {
      ko: '셀러의 Château Léoville Barton 2014 (생 줄리앙 2eme Cru)이 시음 적기에 진입했습니다.',
      en: 'Your cellar bottle of Château Léoville Barton 2014 (Saint-Julien 2ème Cru) has entered its drinking window.',
    },
    createdAt: '2026-05-09T07:00:00Z',
    read: false,
  },
  {
    id: 'noti_007',
    userId: 'me-heavy',
    kind: 'drinkWindowReached',
    wineId: 'rio-lopez-de-heredia',
    cellarItemId: 'cellar_014',
    badgeId: null,
    actorUserId: null,
    title: { ko: '마실 시기가 다가왔어요', en: 'A drinking window has opened' },
    body: {
      ko: '셀러의 Viña Tondonia Gran Reserva 2010이 절정기에 가까워졌습니다.',
      en: "Your cellar bottle of Viña Tondonia Gran Reserva 2010 is approaching peak.",
    },
    createdAt: '2026-04-28T07:00:00Z',
    read: true,
  },
  {
    id: 'noti_008',
    userId: 'me-heavy',
    kind: 'drinkWindowReached',
    wineId: 'tus-chianti-classico',
    cellarItemId: 'cellar_025',
    badgeId: null,
    actorUserId: null,
    title: { ko: '마실 시기가 다가왔어요', en: 'A drinking window has opened' },
    body: {
      ko: '셀러의 Chianti Classico 2021 (Felsina)이 곧 절정에 도달합니다.',
      en: "Your cellar bottle of Chianti Classico 2021 (Felsina) is about to reach peak.",
    },
    createdAt: '2026-04-12T07:00:00Z',
    read: true,
  },
  {
    id: 'noti_009',
    userId: 'me-heavy',
    kind: 'drinkWindowReached',
    wineId: 'cha-billecart-rose',
    cellarItemId: 'cellar_020',
    badgeId: null,
    actorUserId: null,
    title: { ko: '마실 시기가 다가왔어요', en: 'A drinking window has opened' },
    body: {
      ko: '냉장고의 Billecart-Salmon Brut Rosé가 시음 적기에 진입했습니다.',
      en: 'Your fridge bottle of Billecart-Salmon Brut Rosé has entered its drinking window.',
    },
    createdAt: '2026-04-02T07:00:00Z',
    read: true,
  },

  /* ── badgeEarned × 2 ── */
  {
    id: 'noti_010',
    userId: 'me-heavy',
    kind: 'badgeEarned',
    wineId: null,
    cellarItemId: null,
    badgeId: 'badge_007',
    actorUserId: null,
    title: { ko: '아로마 헌터 뱃지 획득', en: 'Aroma Hunter badge earned' },
    body: {
      ko: '12개 아로마 카테고리 모두에서 노트를 작성했습니다. 코가 깊어지고 있어요.',
      en: 'You have written notes in all 12 aroma categories. Your nose is getting deeper.',
    },
    createdAt: '2026-03-28T15:20:00Z',
    read: true,
  },
  {
    id: 'noti_011',
    userId: 'me-heavy',
    kind: 'badgeEarned',
    wineId: null,
    cellarItemId: null,
    badgeId: 'badge_011',
    actorUserId: null,
    title: { ko: "셀러의 손길 뱃지 획득", en: "Cellarer's Touch badge earned" },
    body: {
      ko: '드링킹 윈도우 도래 시점에 셀러 와인을 열었습니다. 인내의 보상이에요.',
      en: 'You opened a cellar bottle just as its drinking window arrived. A reward for patience.',
    },
    createdAt: '2026-02-15T19:45:00Z',
    read: true,
  },

  /* ── levelUp × 1 ── */
  {
    id: 'noti_012',
    userId: 'me-heavy',
    kind: 'levelUp',
    wineId: null,
    cellarItemId: null,
    badgeId: null,
    actorUserId: null,
    title: { ko: '레벨 3 감식가로 진입', en: 'Reached Level 3 — Connoisseur' },
    body: {
      ko: '아펠라시옹과 빈티지를 비교하는 단계입니다. 라벨만 봐도 윤곽이 잡혀요.',
      en: 'You compare appellations and vintages now. The label alone sketches a silhouette.',
    },
    createdAt: '2026-01-08T12:00:00Z',
    read: true,
  },
];

export function getNotificationsByUser(userId: string): Notification[] {
  return NOTIFICATIONS.filter((n) => n.userId === userId);
}

export function getUnreadCount(userId: string): number {
  return NOTIFICATIONS.filter((n) => n.userId === userId && !n.read).length;
}
