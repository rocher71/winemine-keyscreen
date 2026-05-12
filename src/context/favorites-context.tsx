'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type FavoritesContextValue = {
  favorites: ReadonlyArray<string>;
  isFavorite: (wineId: string) => boolean;
  toggleFavorite: (wineId: string) => void;
  addFavorite: (wineId: string) => void;
  removeFavorite: (wineId: string) => void;
  clearFavorites: () => void;
};

const STORAGE_KEY = 'winemine.favorites';

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
}

function writeStorage(list: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // 무시
  }
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // SSR: 빈 배열로 시작 → mount 후 storage에서 hydrate (hydration mismatch 방지)
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readStorage());
  }, []);

  const persist = useCallback((next: string[]) => {
    setFavorites(next);
    writeStorage(next);
  }, []);

  const isFavorite = useCallback((wineId: string) => favorites.includes(wineId), [favorites]);

  const addFavorite = useCallback(
    (wineId: string) => {
      if (favorites.includes(wineId)) return;
      persist([...favorites, wineId]);
    },
    [favorites, persist],
  );

  const removeFavorite = useCallback(
    (wineId: string) => {
      if (!favorites.includes(wineId)) return;
      persist(favorites.filter((id) => id !== wineId));
    },
    [favorites, persist],
  );

  const toggleFavorite = useCallback(
    (wineId: string) => {
      if (favorites.includes(wineId)) {
        persist(favorites.filter((id) => id !== wineId));
      } else {
        persist([...favorites, wineId]);
      }
    },
    [favorites, persist],
  );

  const clearFavorites = useCallback(() => persist([]), [persist]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, addFavorite, removeFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return ctx;
}
