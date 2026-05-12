'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CellarItem, TastingNote } from '@/types';
import { useMounted } from '@/hooks/use-mounted';

/**
 * UserDataContext — localStorage로 사용자 활동(셀러 추가, 노트 작성)을 영속화.
 *
 * 시안 단계에서 DB 없이 사용자가 등록한 셀러/노트가 새로고침 후에도 유지되도록.
 * `useMockUser()`의 mock 데이터 위에 사용자 추가분을 누적하여 셀러/노트 헬퍼가 머지된
 * 리스트를 반환할 수 있게 한다.
 *
 * 정책:
 *  - userId는 컨텍스트가 모름. 호출자(useMergedCellar/useMergedNotes)가 user.id로 필터.
 *  - localStorage 키: 'winemine.userCellar', 'winemine.userNotes'
 *  - SSR 안전: 마운트 전에는 빈 배열 반환 → mock만 노출 → hydration mismatch 방지
 *  - 시안이므로 동시성/큐 등 무시.
 */

const CELLAR_KEY = 'winemine.userCellar';
const NOTES_KEY = 'winemine.userNotes';

interface UserDataContextValue {
  /** localStorage에서 읽은 사용자 셀러 추가분 */
  userCellar: CellarItem[];
  /** localStorage에서 읽은 사용자 노트 추가분 */
  userNotes: TastingNote[];
  /** 셀러 추가 */
  addCellarItem: (item: CellarItem) => void;
  /** 셀러 제거 */
  removeCellarItem: (id: string) => void;
  /** 노트 추가 */
  addTastingNote: (note: TastingNote) => void;
  /** 노트 제거 (편집용) */
  removeTastingNote: (id: string) => void;
  /** 모두 초기화 — DemoControls 디버그용 */
  clearAll: () => void;
}

const Ctx = createContext<UserDataContextValue | null>(null);

function readArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota/private mode — silent */
  }
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const [userCellar, setUserCellar] = useState<CellarItem[]>([]);
  const [userNotes, setUserNotes] = useState<TastingNote[]>([]);

  /* 클라이언트 마운트 후 localStorage 초기 로드 */
  useEffect(() => {
    setUserCellar(readArray<CellarItem>(CELLAR_KEY));
    setUserNotes(readArray<TastingNote>(NOTES_KEY));
  }, []);

  const addCellarItem = useCallback((item: CellarItem) => {
    setUserCellar((prev) => {
      const next = [item, ...prev.filter((p) => p.id !== item.id)];
      writeArray(CELLAR_KEY, next);
      return next;
    });
  }, []);

  const removeCellarItem = useCallback((id: string) => {
    setUserCellar((prev) => {
      const next = prev.filter((p) => p.id !== id);
      writeArray(CELLAR_KEY, next);
      return next;
    });
  }, []);

  const addTastingNote = useCallback((note: TastingNote) => {
    setUserNotes((prev) => {
      const next = [note, ...prev.filter((p) => p.id !== note.id)];
      writeArray(NOTES_KEY, next);
      return next;
    });
  }, []);

  const removeTastingNote = useCallback((id: string) => {
    setUserNotes((prev) => {
      const next = prev.filter((p) => p.id !== id);
      writeArray(NOTES_KEY, next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    writeArray(CELLAR_KEY, []);
    writeArray(NOTES_KEY, []);
    setUserCellar([]);
    setUserNotes([]);
  }, []);

  const value = useMemo<UserDataContextValue>(
    () => ({
      /* 마운트 전에는 mock만 노출 — hydration safe */
      userCellar: mounted ? userCellar : [],
      userNotes: mounted ? userNotes : [],
      addCellarItem,
      removeCellarItem,
      addTastingNote,
      removeTastingNote,
      clearAll,
    }),
    [mounted, userCellar, userNotes, addCellarItem, removeCellarItem, addTastingNote, removeTastingNote, clearAll],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUserData(): UserDataContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUserData must be used inside UserDataProvider');
  return ctx;
}
