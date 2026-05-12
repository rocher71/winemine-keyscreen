'use client';

import { useEffect, useState } from 'react';

/**
 * SSR hydration mismatch 가드.
 *
 * 클라이언트에서만 사용해야 하는 상태(localStorage, window, matchMedia 등)를
 * 안전하게 다루기 위한 훅. mounted === false 인 동안에는 SSR-safe default 값으로
 * 렌더링하고, mount 이후에만 실제 값을 노출한다.
 *
 * @example
 *   const mounted = useMounted();
 *   if (!mounted) return <Placeholder />;  // SSR-safe
 *   return <RealComponent />;
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
