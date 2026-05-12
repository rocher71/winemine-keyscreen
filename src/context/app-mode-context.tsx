'use client';

import { createContext, useContext, type ReactNode } from 'react';
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
  return (
    <AppModeContext.Provider value={{ demoMode, setDemoMode }}>{children}</AppModeContext.Provider>
  );
}

export function useAppMode(): AppModeContextValue {
  const ctx = useContext(AppModeContext);
  if (!ctx) throw new Error('useAppMode must be used inside <AppModeProvider>');
  return ctx;
}
