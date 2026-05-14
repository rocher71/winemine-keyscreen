/**
 * 타 유저 프로필 헬퍼.
 *
 * 시안 prototype에서는 me-heavy 외 유저에게는 실제 mock note가 없으므로,
 * me-heavy의 공개 노트 풀을 결정적(deterministic)으로 슬라이스해
 * "이 사람도 와인을 마시고 있다"는 인상을 만든다.
 *
 * 동일 userId는 항상 같은 슬라이스를 반환하므로 매 렌더가 일관됨.
 */

import type { TastingNote, User } from '@/types';
import { TASTING_NOTES } from '@/lib/mock/tasting-notes';
import {
  ALL_USERS,
  USERS_BY_ID,
  currentUserHeavy,
  STATIC_MATCH_PCT,
} from '@/lib/mock/users';
import { COMM_USERS, type CommUser } from '@/lib/mock/community-posts';

/* 커뮤니티 유저 → 합성 User. COMM_USER는 stats가 없으므로 level 기반 합리적 기본값 */
function levelToStats(level: 1 | 2 | 3 | 4 | 5): User['stats'] {
  switch (level) {
    case 5: return { winesTasted: 180, countriesExplored: 16, regionsExplored: 38, notesCount: 240, cellarCount: 75 };
    case 4: return { winesTasted: 90, countriesExplored: 12, regionsExplored: 24, notesCount: 105, cellarCount: 38 };
    case 3: return { winesTasted: 42, countriesExplored: 8, regionsExplored: 14, notesCount: 48, cellarCount: 16 };
    case 2: return { winesTasted: 18, countriesExplored: 4, regionsExplored: 6, notesCount: 21, cellarCount: 9 };
    case 1: return { winesTasted: 4, countriesExplored: 2, regionsExplored: 2, notesCount: 5, cellarCount: 1 };
  }
}

function commUserToUser(c: CommUser): User {
  return {
    id: c.id,
    displayName: { ko: c.name, en: c.name },
    avatarInitial: { ko: c.initial, en: c.initial },
    locale: 'ko',
    experience: c.level >= 4 ? 'expert' : 'beginner',
    xp: c.level * 600,
    levelId: c.level,
    joinedAt: '2025-01-01',
    badges: [],
    stats: levelToStats(c.level),
  };
}

const COMM_USERS_AS_USERS: User[] = COMM_USERS.map(commUserToUser);
const COMM_USERS_BY_ID: Record<string, User> = COMM_USERS_AS_USERS.reduce<
  Record<string, User>
>((acc, u) => {
  acc[u.id] = u;
  return acc;
}, {});

/** 어떤 ID든 — 실제 user, other-*, community user — User로 해소 */
export function resolveUser(id: string): User | undefined {
  return USERS_BY_ID[id] ?? COMM_USERS_BY_ID[id];
}

export function isResolvableUser(id: string): boolean {
  return resolveUser(id) != null;
}

/* ───────── notes donor 패턴 ───────── */

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** 모든 유저는 me-heavy 외에 노트가 없으므로, me-heavy 공개 노트 풀을 슬라이스해 공유. */
export function getProfileNotes(userId: string): TastingNote[] {
  if (userId === currentUserHeavy.id) {
    return TASTING_NOTES.filter((n) => n.userId === userId && n.isPublic);
  }
  const pool = TASTING_NOTES.filter(
    (n) => n.userId === currentUserHeavy.id && n.isPublic,
  );
  if (pool.length === 0) return [];
  const hash = hashString(userId);
  /* 슬라이스 크기 12~28 */
  const size = 12 + (hash % 17);
  const start = hash % Math.max(1, pool.length - size);
  return pool.slice(start, start + size);
}

/** me-heavy 기준 타 유저 매치 %. STATIC_MATCH_PCT 우선 + community 유저는 level 기반 fallback. */
export function getMatchPctVsMe(userId: string): number {
  if (STATIC_MATCH_PCT[userId] !== undefined) return STATIC_MATCH_PCT[userId];
  const u = resolveUser(userId);
  if (!u) return 0;
  /* level 격차 + userId hash로 50~85 사이 결정적 값 */
  const myLevel = currentUserHeavy.levelId;
  const gap = Math.abs(u.levelId - myLevel);
  const base = 78 - gap * 6;
  const jitter = hashString(userId) % 11;
  return Math.max(35, Math.min(92, base + jitter - 5));
}

/** 컴포넌트가 모든 알려진 유저를 enumerate해야 할 때 */
export function getAllKnownUsers(): User[] {
  return [...ALL_USERS, ...COMM_USERS_AS_USERS];
}
