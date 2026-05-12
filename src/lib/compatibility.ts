/**
 * Compatibility — 두 사용자 간 취향 매치 % 산출
 *
 * 사용처: /profile/[userId] 페이지 상단 "취향 매치" 카드.
 *
 * 알고리즘 (시안 mock):
 *   1. 두 유저의 tasting-notes 합집합에서 와인의 country/region/grape 분포 추출
 *   2. country 30% + region 35% + grape 25% + level 격차 보정 10%
 *   3. 0~100% 반환
 *
 * 실제 ML 기반 매치는 후속 단계. 현재는 결정적 휴리스틱.
 *
 * users.ts의 STATIC_MATCH_PCT (otherUser1=67, otherUser2=42, otherUser3=89)와
 * 결과가 정확히 일치하지 않아도 됨 — 페이지가 STATIC_MATCH_PCT를 우선 사용,
 * 이 함수는 임의 두 유저 비교용.
 */

import type { TastingNote, User, Wine } from '@/types';
import { TASTING_NOTES } from './mock/tasting-notes';
import { WINES_BY_ID } from './mock/wines';
import { STATIC_MATCH_PCT } from './mock/users';

function getUserNoteWines(userId: string): Wine[] {
  return TASTING_NOTES.filter((n) => n.userId === userId)
    .map((n) => WINES_BY_ID[n.wineId])
    .filter((w): w is Wine => Boolean(w));
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set<string>([...setA].filter((x) => setB.has(x)));
  const union = new Set<string>([...setA, ...setB]);
  return intersection.size / union.size;
}

/**
 * 두 사용자의 취향 매치 0~100. user.id에 따라 다음 순서로 결정:
 *   1. STATIC_MATCH_PCT[otherUserId] 가 정의되어 있으면 그 값 반환 (현재 유저 me-heavy 기준).
 *   2. 그 외엔 jaccard 기반 휴리스틱 계산.
 */
export function getCompatibility(userA: User, userB: User): number {
  // me-heavy를 기준으로 한 static 매핑이 있으면 그것을 우선
  if (userA.id === 'me-heavy' && STATIC_MATCH_PCT[userB.id] !== undefined) {
    return STATIC_MATCH_PCT[userB.id];
  }
  if (userB.id === 'me-heavy' && STATIC_MATCH_PCT[userA.id] !== undefined) {
    return STATIC_MATCH_PCT[userA.id];
  }

  const winesA = getUserNoteWines(userA.id);
  const winesB = getUserNoteWines(userB.id);

  if (winesA.length === 0 || winesB.length === 0) return 0;

  const countriesA = new Set(winesA.map((w) => w.country.en));
  const countriesB = new Set(winesB.map((w) => w.country.en));
  const regionsA = new Set(winesA.map((w) => w.region.en));
  const regionsB = new Set(winesB.map((w) => w.region.en));
  const grapesA = new Set(winesA.flatMap((w) => w.grapes.map((g) => g.en)));
  const grapesB = new Set(winesB.flatMap((w) => w.grapes.map((g) => g.en)));

  const countrySim = jaccardSimilarity(countriesA, countriesB);
  const regionSim = jaccardSimilarity(regionsA, regionsB);
  const grapeSim = jaccardSimilarity(grapesA, grapesB);

  // level 격차 보정: 레벨이 비슷할수록 가산
  const levelGap = Math.abs(userA.levelId - userB.levelId);
  const levelBonus = Math.max(0, 1 - levelGap / 5); // 0 격차 → 1, 5격차 → 0

  const score = countrySim * 0.3 + regionSim * 0.35 + grapeSim * 0.25 + levelBonus * 0.1;

  return Math.round(score * 100);
}

/** 페이지 디스플레이용 1줄 헤더. */
export function getCompatibilityLabel(pct: number): { ko: string; en: string } {
  if (pct >= 80) return { ko: '아주 잘 맞아요', en: 'A perfect match' };
  if (pct >= 60) return { ko: '꽤 잘 맞아요', en: 'Quite a fit' };
  if (pct >= 40) return { ko: '닮은 부분이 있어요', en: 'You share some ground' };
  return { ko: '서로 새로운 영역이에요', en: 'Fresh territory for both' };
}
