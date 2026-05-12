'use client';

import { useEffect, useState } from 'react';

/**
 * window.matchMedia를 React 상태로 노출.
 * SSR 시 항상 false 반환 (CSS media query로 분기 가능한 케이스는 CSS 우선 권장).
 *
 * @example
 *   const isMobile = useMediaQuery('(max-width: 767px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
