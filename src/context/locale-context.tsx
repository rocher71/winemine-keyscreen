'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from '@/types';
import { useUrlStorageSync } from '@/hooks/use-storage-sync';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
};

const DEFAULT: Locale = 'ko';
const STORAGE_KEY = 'winemine.locale';
const URL_KEY = 'locale';

function parse(raw: string): Locale | null {
  return raw === 'ko' || raw === 'en' ? raw : null;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useUrlStorageSync<Locale>(URL_KEY, STORAGE_KEY, DEFAULT, parse);
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

/**
 * 현재 활성 locale. URL `?locale=` 또는 localStorage `winemine.locale` 또는 기본 'ko'.
 *
 * @example
 *   const { locale, setLocale } = useLocale();
 *   <LocaleText value={wine.country} />  // locale에 따라 ko/en 선택
 */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
}
