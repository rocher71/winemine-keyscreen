/**
 * XP & Level System
 *
 * SPEC §key_implementation_notes — XP 적립 액션과 레벨 임계값.
 * levels.ts의 LEVELS와 정합 유지 (L3 = 500~1499 XP).
 *
 * 페이지 사용처:
 *   - 노트 작성/셀러 추가 등 액션 후 토스트 "+10 XP"
 *   - 레벨업 시 모달 (LevelUpModal)
 *   - 프로필 상단 XP 게이지
 */

import { LEVELS } from './mock/levels';

export const XP_ACTIONS = {
  cellarAdd: 5,
  beginnerNote: 10,
  expertNote: 20,
  expertBlindNote: 25,
  photoAttach: 5,
  priceAdd: 5,
  peakEstimate: 5,
  firstCountry: 30,
  firstRegion: 15,
  communityReview: 15,
} as const;

export type XPActionId = keyof typeof XP_ACTIONS;

/**
 * 현재 XP 기준 레벨과 다음 레벨까지의 진척도(0~1)를 반환.
 *
 *   - L5(maxXp null)에 도달하면 progress=1, remaining=0
 *   - level 매칭 실패 시 L1 디폴트
 */
export function xpToLevel(xp: number): {
  levelId: number;
  /** 0~1 진척도 (현재 레벨 안에서) */
  progress: number;
  /** 다음 레벨까지 남은 XP (L5는 0) */
  remaining: number;
  /** 0~100 백분율 */
  progressPct: number;
} {
  const level = LEVELS.find((l) => xp >= l.minXp && (l.maxXp === null || xp <= l.maxXp)) ?? LEVELS[0];

  if (level.maxXp === null) {
    return { levelId: level.id, progress: 1, remaining: 0, progressPct: 100 };
  }

  const span = level.maxXp - level.minXp + 1;
  const within = xp - level.minXp;
  const progress = Math.max(0, Math.min(1, within / span));
  return {
    levelId: level.id,
    progress,
    remaining: Math.max(0, level.maxXp - xp + 1),
    progressPct: Math.round(progress * 100),
  };
}

/**
 * 두 XP 값(이전·이후) 비교 → 레벨업 발생 여부.
 */
export function detectLevelUp(prevXp: number, nextXp: number): { leveledUp: boolean; newLevelId: number } {
  const prev = xpToLevel(prevXp).levelId;
  const next = xpToLevel(nextXp).levelId;
  return { leveledUp: next > prev, newLevelId: next };
}

/**
 * 노트 모드/모드 별 XP 적립 계산.
 *   mode=beginner → 10 XP
 *   mode=expert  → 20 XP (블라인드면 25 XP)
 */
export function calcNoteXp(mode: 'beginner' | 'expert', blind = false): number {
  if (mode === 'beginner') return XP_ACTIONS.beginnerNote;
  return blind ? XP_ACTIONS.expertBlindNote : XP_ACTIONS.expertNote;
}
