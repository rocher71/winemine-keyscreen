'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * URL search-param + localStorage 동기화 상태.
 *
 * 초기 값 우선순위: URL → localStorage → defaultValue.
 * 변경 시 URL(router.replace)과 localStorage를 동시에 갱신.
 * SSR 시에는 defaultValue로 시작하여 mount 이후 클라이언트 값으로 동기화 (hydration mismatch 방지).
 *
 * @param key URL 검색 파라미터 키 (예: 'demo', 'exp', 'locale')
 * @param storageKey localStorage 키 (예: 'winemine.demoMode')
 * @param defaultValue 둘 다 없을 때
 * @param parse string → T 검증·파싱. null 반환 시 무시
 */
export function useUrlStorageSync<T extends string>(
  key: string,
  storageKey: string,
  defaultValue: T,
  parse: (raw: string) => T | null,
): [T, (next: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValueState] = useState<T>(defaultValue);

  // mount 이후에만 URL → localStorage → default 순으로 초기화 (hydration-safe)
  useEffect(() => {
    let next: T | null = null;
    const urlRaw = searchParams.get(key);
    if (urlRaw) next = parse(urlRaw);
    if (next == null && typeof window !== 'undefined') {
      const storedRaw = window.localStorage.getItem(storageKey);
      if (storedRaw) next = parse(storedRaw);
    }
    if (next != null && next !== value) {
      setValueState(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get(key)]);

  const setValue = useCallback(
    (next: T) => {
      setValueState(next);
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey, next);
        } catch {
          // private mode, quota 등 — 무시
        }
      }
      // URL 동기화: 같은 라우트에서 search-param만 replace (history entry 안 만듦)
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [key, storageKey, pathname, router, searchParams],
  );

  return [value, setValue];
}
