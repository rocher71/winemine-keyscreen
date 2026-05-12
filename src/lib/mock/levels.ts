/**
 * Level 카탈로그 — 5단계
 *
 * 임계값은 xp.ts의 xpToLevel과 정확히 동기. heavy 유저 xp=1280 → L3.
 *
 *  L1 Novice            0 ~ 99     XP   bronze 톤
 *  L2 Enthusiast      100 ~ 499    XP   gold-bronze
 *  L3 Connoisseur     500 ~ 1499   XP   gold (현재 헤비 유저 위치)
 *  L4 Sommelier      1500 ~ 3999   XP   wine red (deep)
 *  L5 Master         4000+        XP   wine red gradient (top)
 */

import type { Level } from '@/types';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: { ko: '입문자', en: 'Novice' },
    minXp: 0,
    maxXp: 99,
    color: '#9B8B7A',
    description: {
      ko: '와인의 세계에 발을 디뎠습니다. 한 모금이 호기심으로 바뀌는 단계.',
      en: 'You have entered the world of wine. The stage where one sip becomes curiosity.',
    },
  },
  {
    id: 2,
    name: { ko: '애호가', en: 'Enthusiast' },
    minXp: 100,
    maxXp: 499,
    color: '#C9A84C',
    description: {
      ko: '취향이 생기기 시작했습니다. 좋아하는 산지와 품종이 어렴풋이 잡힙니다.',
      en: 'Your taste is starting to form. You can faintly sketch the regions and grapes you prefer.',
    },
  },
  {
    id: 3,
    name: { ko: '감식가', en: 'Connoisseur' },
    minXp: 500,
    maxXp: 1499,
    color: '#C9A84C',
    description: {
      ko: '아펠라시옹과 빈티지를 비교하기 시작합니다. 라벨만 보고도 윤곽을 그릴 수 있습니다.',
      en: 'You start comparing appellations and vintages. The label alone gives you a silhouette.',
    },
  },
  {
    id: 4,
    name: { ko: '소믈리에', en: 'Sommelier' },
    minXp: 1500,
    maxXp: 3999,
    color: '#8B1A2A',
    description: {
      ko: '구조·균형·여운을 언어로 분해할 수 있습니다. 누구에게 무엇을 권할지 망설이지 않습니다.',
      en: 'You can decompose structure, balance, and finish into language. You no longer hesitate when pairing.',
    },
  },
  {
    id: 5,
    name: { ko: '마스터', en: 'Master' },
    minXp: 4000,
    maxXp: null,
    color: '#A02030',
    description: {
      ko: '한 잔에서 떼루아의 시간 흐름을 읽습니다. 새로운 와인이 또 다른 첫걸음이 됩니다.',
      en: 'You read the passage of terroir time in a single glass. Each new wine becomes another first step.',
    },
  },
];

export const LEVELS_BY_ID: Record<number, Level> = LEVELS.reduce<Record<number, Level>>(
  (acc, level) => {
    acc[level.id] = level;
    return acc;
  },
  {},
);

export function getLevel(levelId: number): Level {
  return LEVELS_BY_ID[levelId] ?? LEVELS[0];
}
