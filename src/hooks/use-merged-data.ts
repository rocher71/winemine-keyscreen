'use client';

import { useMemo } from 'react';
import { useUserData } from '@/context/user-data-context';
import { getCellarByUser } from '@/lib/mock/cellar';
import { getTastingNotesByUser } from '@/lib/mock/tasting-notes';
import type { CellarItem, TastingNote } from '@/types';

/**
 * mock 베이스 + localStorage 사용자 추가분을 머지한 셀러/노트 hook.
 *
 * 셀러: 사용자가 등록한 항목이 mock과 같은 wineId라도 별개 ID로 추가.
 *       프로필 cellarCount 계산은 머지된 길이 사용.
 * 노트: 동일 — 사용자 노트는 추가 누적.
 *
 * 호출자가 user.id로 mock 쪽을 먼저 필터하므로, 머지는 두 배열 단순 concat.
 */

export function useMergedCellar(userId: string): CellarItem[] {
  const { userCellar } = useUserData();
  return useMemo(() => {
    const base = getCellarByUser(userId);
    /* 사용자 추가분 중 같은 userId만 — id 충돌 시 사용자 추가분 우선 */
    const userOnes = userCellar.filter((c) => c.userId === userId);
    const baseFiltered = base.filter((b) => !userOnes.some((u) => u.id === b.id));
    return [...userOnes, ...baseFiltered];
  }, [userId, userCellar]);
}

export function useMergedNotes(userId: string): TastingNote[] {
  const { userNotes } = useUserData();
  return useMemo(() => {
    const base = getTastingNotesByUser(userId);
    const userOnes = userNotes.filter((n) => n.userId === userId);
    const baseFiltered = base.filter((b) => !userOnes.some((u) => u.id === b.id));
    return [...userOnes, ...baseFiltered];
  }, [userId, userNotes]);
}

/**
 * 특정 와인에 대한 내 노트 — 없으면 null. 와인 디테일에서 "내 노트" 섹션 노출용.
 */
export function useMyNoteForWine(userId: string, wineId: string): TastingNote | null {
  const notes = useMergedNotes(userId);
  return useMemo(() => {
    const matching = notes.filter((n) => n.wineId === wineId);
    if (matching.length === 0) return null;
    /* 가장 최근 */
    return matching.sort((a, b) => new Date(b.tastedAt).getTime() - new Date(a.tastedAt).getTime())[0];
  }, [notes, wineId]);
}

/**
 * 내가 마신 unique 와인 ID 집합 — 지도에서 핀 표시할 때 사용.
 */
export function useMyTastedWineIds(userId: string): Set<string> {
  const notes = useMergedNotes(userId);
  return useMemo(() => new Set(notes.map((n) => n.wineId)), [notes]);
}
