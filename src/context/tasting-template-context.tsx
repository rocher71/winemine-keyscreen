'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { TastingTemplate, TemplateField } from '@/types';
import {
  BUILTIN_BEGINNER,
  BUILTIN_EXPERT,
  COMMUNITY_TEMPLATES,
} from '@/lib/mock/tasting-templates';

/**
 * 테이스팅 양식 상태:
 *  - savedTemplateIds: 사용자가 커뮤니티 풀에서 저장한 템플릿 ID 목록
 *  - customTemplates: 사용자가 직접 만든 템플릿 (전체 객체 저장)
 *
 * picker가 노출하는 양식 = builtin 2종 + 저장한 커뮤니티 양식 + 내가 만든 커스텀
 */

interface TastingTemplateContextValue {
  /** 저장한 커뮤니티 템플릿 ID 목록 */
  savedTemplateIds: ReadonlyArray<string>;
  /** 내가 만든 커스텀 템플릿 */
  myCustomTemplates: ReadonlyArray<TastingTemplate>;
  /** picker에 노출되는 전체 템플릿 (builtin 2 + saved + my custom) */
  availableTemplates: ReadonlyArray<TastingTemplate>;
  isSaved: (templateId: string) => boolean;
  saveTemplate: (templateId: string) => void;
  unsaveTemplate: (templateId: string) => void;
  createCustomTemplate: (input: {
    title: TastingTemplate['title'];
    description: TastingTemplate['description'];
    fields: TemplateField[];
    isPublic: boolean;
  }) => string; /* returns new id */
  updateCustomTemplate: (
    id: string,
    patch: Partial<Pick<TastingTemplate, 'title' | 'description' | 'fields' | 'isPublic'>>,
  ) => void;
  deleteCustomTemplate: (id: string) => void;
}

const SAVED_KEY = 'winemine.savedTemplateIds';
const CUSTOM_KEY = 'winemine.customTemplates';

function readSaved(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function readCustom(): TastingTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TastingTemplate[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore quota */
  }
}

const Ctx = createContext<TastingTemplateContextValue | null>(null);

export function TastingTemplateProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [myCustom, setMyCustom] = useState<TastingTemplate[]>([]);

  useEffect(() => {
    setSavedIds(readSaved());
    setMyCustom(readCustom());
  }, []);

  const persistSaved = useCallback((next: string[]) => {
    setSavedIds(next);
    write(SAVED_KEY, next);
  }, []);

  const persistCustom = useCallback((next: TastingTemplate[]) => {
    setMyCustom(next);
    write(CUSTOM_KEY, next);
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const saveTemplate = useCallback(
    (id: string) => {
      if (savedIds.includes(id)) return;
      persistSaved([...savedIds, id]);
    },
    [savedIds, persistSaved],
  );

  const unsaveTemplate = useCallback(
    (id: string) => persistSaved(savedIds.filter((x) => x !== id)),
    [savedIds, persistSaved],
  );

  const createCustomTemplate = useCallback<
    TastingTemplateContextValue['createCustomTemplate']
  >(
    ({ title, description, fields, isPublic }) => {
      const id = `tpl-custom-${Date.now()}`;
      const next: TastingTemplate = {
        id,
        kind: 'custom',
        title,
        description,
        authorUserId: 'me-heavy',
        authorName: { ko: '나', en: 'Me' },
        isPublic,
        savesCount: 0,
        createdAt: new Date().toISOString(),
        fields,
      };
      persistCustom([...myCustom, next]);
      return id;
    },
    [myCustom, persistCustom],
  );

  const updateCustomTemplate = useCallback<
    TastingTemplateContextValue['updateCustomTemplate']
  >(
    (id, patch) => {
      persistCustom(
        myCustom.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
    },
    [myCustom, persistCustom],
  );

  const deleteCustomTemplate = useCallback(
    (id: string) => persistCustom(myCustom.filter((t) => t.id !== id)),
    [myCustom, persistCustom],
  );

  const availableTemplates = useMemo<TastingTemplate[]>(() => {
    const savedFromCommunity = COMMUNITY_TEMPLATES.filter((t) =>
      savedIds.includes(t.id),
    );
    return [BUILTIN_BEGINNER, BUILTIN_EXPERT, ...savedFromCommunity, ...myCustom];
  }, [savedIds, myCustom]);

  const value: TastingTemplateContextValue = useMemo(
    () => ({
      savedTemplateIds: savedIds,
      myCustomTemplates: myCustom,
      availableTemplates,
      isSaved,
      saveTemplate,
      unsaveTemplate,
      createCustomTemplate,
      updateCustomTemplate,
      deleteCustomTemplate,
    }),
    [
      savedIds,
      myCustom,
      availableTemplates,
      isSaved,
      saveTemplate,
      unsaveTemplate,
      createCustomTemplate,
      updateCustomTemplate,
      deleteCustomTemplate,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTastingTemplates(): TastingTemplateContextValue {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error('useTastingTemplates must be used inside <TastingTemplateProvider>');
  return ctx;
}
