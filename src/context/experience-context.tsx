'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Experience } from '@/types';
import { useUrlStorageSync } from '@/hooks/use-storage-sync';

type ExperienceContextValue = {
  experience: Experience;
  setExperience: (next: Experience) => void;
};

const DEFAULT: Experience = 'beginner';
const STORAGE_KEY = 'winemine.experience';
const URL_KEY = 'exp';

function parse(raw: string): Experience | null {
  return raw === 'beginner' || raw === 'expert' ? raw : null;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [experience, setExperience] = useUrlStorageSync<Experience>(
    URL_KEY,
    STORAGE_KEY,
    DEFAULT,
    parse,
  );
  return (
    <ExperienceContext.Provider value={{ experience, setExperience }}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceContextValue {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error('useExperience must be used inside <ExperienceProvider>');
  return ctx;
}
