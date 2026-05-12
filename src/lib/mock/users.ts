/**
 * Users — currentUserFirst (빈 컬렉션), currentUserHeavy (풍부한 데이터), otherUsers 3명
 *
 * 헤비 유저 stats는 SPEC mock_data_setup 기준 + 실제 mock 컬렉션 카운트와 일치:
 *   winesTasted 32  ← tasting-notes에서 unique wineId 32개 (헤비 47 노트 중 일부 중복)
 *   countriesExplored 8
 *   regionsExplored 14
 *   notesCount 47    ← tasting-notes 중 me-heavy 47개
 *   cellarCount 28   ← cellar 중 me-heavy 28개
 */

import type { User } from '@/types';

export const currentUserFirst: User = {
  id: 'me-first',
  displayName: { ko: '게스트', en: 'Guest' },
  avatarInitial: { ko: 'G', en: 'G' },
  locale: 'ko',
  experience: 'beginner',
  xp: 0,
  levelId: 1,
  joinedAt: '2026-05-12',
  badges: [],
  stats: {
    winesTasted: 0,
    countriesExplored: 0,
    regionsExplored: 0,
    notesCount: 0,
    cellarCount: 0,
  },
};

export const currentUserHeavy: User = {
  id: 'me-heavy',
  displayName: { ko: '예진', en: 'Yejin' },
  avatarInitial: { ko: '예', en: 'Y' },
  locale: 'ko',
  experience: 'expert',
  xp: 1280,
  levelId: 3,
  joinedAt: '2025-09-12',
  badges: [
    'badge_001',
    'badge_002',
    'badge_004',
    'badge_007',
    'badge_008',
    'badge_009',
    'badge_011',
  ],
  stats: {
    winesTasted: 32,
    countriesExplored: 8,
    regionsExplored: 16,
    notesCount: 47,
    cellarCount: 28,
  },
};

export const otherUser1: User = {
  id: 'other-001',
  displayName: { ko: '도윤', en: 'Doyoon' },
  avatarInitial: { ko: '도', en: 'D' },
  locale: 'ko',
  experience: 'expert',
  xp: 2450,
  levelId: 4,
  joinedAt: '2025-04-03',
  badges: ['badge_001', 'badge_002', 'badge_003', 'badge_004', 'badge_006', 'badge_007', 'badge_010'],
  stats: {
    winesTasted: 50,
    countriesExplored: 11,
    regionsExplored: 22,
    notesCount: 78,
    cellarCount: 42,
  },
};

export const otherUser2: User = {
  id: 'other-002',
  displayName: { ko: '서연', en: 'Seoyeon' },
  avatarInitial: { ko: '서', en: 'S' },
  locale: 'ko',
  experience: 'beginner',
  xp: 280,
  levelId: 2,
  joinedAt: '2026-01-18',
  badges: ['badge_001', 'badge_002'],
  stats: {
    winesTasted: 18,
    countriesExplored: 4,
    regionsExplored: 6,
    notesCount: 21,
    cellarCount: 9,
  },
};

export const otherUser3: User = {
  id: 'other-003',
  displayName: { ko: '한빈', en: 'Hanbin' },
  avatarInitial: { ko: '한', en: 'H' },
  locale: 'ko',
  experience: 'expert',
  xp: 5240,
  levelId: 5,
  joinedAt: '2024-06-20',
  badges: [
    'badge_001',
    'badge_002',
    'badge_003',
    'badge_004',
    'badge_005',
    'badge_006',
    'badge_007',
    'badge_008',
    'badge_009',
    'badge_010',
    'badge_011',
    'badge_012',
  ],
  stats: {
    winesTasted: 200,
    countriesExplored: 18,
    regionsExplored: 47,
    notesCount: 312,
    cellarCount: 88,
  },
};

export const OTHER_USERS: User[] = [otherUser1, otherUser2, otherUser3];

export const ALL_USERS: User[] = [
  currentUserFirst,
  currentUserHeavy,
  otherUser1,
  otherUser2,
  otherUser3,
];

export const USERS_BY_ID: Record<string, User> = ALL_USERS.reduce<Record<string, User>>(
  (acc, u) => {
    acc[u.id] = u;
    return acc;
  },
  {},
);

/** SPEC 디스플레이용 매치 % — compatibility.ts로 계산해도 되지만 페이지 빠른 접근용 캐시 */
export const STATIC_MATCH_PCT: Record<string, number> = {
  'other-001': 67,
  'other-002': 42,
  'other-003': 89,
};

export function getMockUser(mode: 'first-time' | 'heavy'): User {
  return mode === 'heavy' ? currentUserHeavy : currentUserFirst;
}

export function getUserById(id: string): User | undefined {
  return USERS_BY_ID[id];
}
