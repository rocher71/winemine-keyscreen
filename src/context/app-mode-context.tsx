'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { DemoMode } from '@/types';
import { useUrlStorageSync } from '@/hooks/use-storage-sync';

type AppModeContextValue = {
  demoMode: DemoMode;
  setDemoMode: (next: DemoMode) => void;
};

const DEFAULT: DemoMode = 'first-time';
const STORAGE_KEY = 'winemine.demoMode';
const URL_KEY = 'demo';

function parse(raw: string): DemoMode | null {
  return raw === 'first-time' || raw === 'heavy' ? raw : null;
}

const AppModeContext = createContext<AppModeContextValue | null>(null);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoMode] = useUrlStorageSync<DemoMode>(URL_KEY, STORAGE_KEY, DEFAULT, parse);

  /* 모바일(<768px) 브라우저에선 진짜 앱처럼 보이도록 항상 heavy 모드 강제.
   * DemoControls가 모바일에서 숨겨져 있어 사용자가 직접 토글할 UI가 없음. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 767px)');
    const sync = () => {
      if (mql.matches && demoMode !== 'heavy') setDemoMode('heavy');
    };
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, [demoMode, setDemoMode]);

  return (
    <AppModeContext.Provider value={{ demoMode, setDemoMode }}>{children}</AppModeContext.Provider>
  );
}

export function useAppMode(): AppModeContextValue {
  const ctx = useContext(AppModeContext);
  if (!ctx) throw new Error('useAppMode must be used inside <AppModeProvider>');
  return ctx;
}
