'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type FeatureStatus = 'planned' | 'considering' | 'dropped';

export interface FeatureFlagDefinition {
  id: string;
  /** 사용자에게 보이는 라벨 (LocalizedString을 쓰지 않고 short ko/en 토큰 한 줄 사용) */
  labelKo: string;
  labelEn: string;
  /** 기본 상태 (페이지가 등록 시 명시). 사용자 토글이 우선 적용됨. */
  defaultStatus?: FeatureStatus;
}

type FlagState = Record<string, FeatureStatus>;

interface FeatureFlagContextValue {
  /** 현재 라우트가 등록한 컴포넌트 정의 (Panel이 자동 노출) */
  registry: FeatureFlagDefinition[];
  /** id별 사용자 토글 상태 */
  state: FlagState;
  /** 페이지가 자기 inventory를 등록 (cleanup 자동 동작) */
  register: (defs: FeatureFlagDefinition[]) => () => void;
  /** Panel이 호출 — 특정 컴포넌트 상태 변경 */
  setStatus: (id: string, status: FeatureStatus) => void;
  /** 현재 화면 결정 메모 (localStorage 영속, 라우트별 분리) */
  note: string;
  setNote: (next: string) => void;
  /** Panel이 현재 라우트 key를 알기 위해 사용. localStorage 분리용 */
  routeKey: string;
  setRouteKey: (next: string) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

const STATE_STORAGE_KEY = 'winemine.featureFlags';
const NOTE_STORAGE_KEY = 'winemine.featureFlagNotes';

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<FeatureFlagDefinition[]>([]);
  const registryRef = useRef<FeatureFlagDefinition[]>([]);
  const [state, setState] = useState<FlagState>({});
  const [allNotes, setAllNotes] = useState<Record<string, string>>({});
  const [routeKey, setRouteKey] = useState<string>('/');

  // Hydrate from localStorage on mount
  useEffect(() => {
    setState(readJSON<FlagState>(STATE_STORAGE_KEY, {}));
    setAllNotes(readJSON<Record<string, string>>(NOTE_STORAGE_KEY, {}));
  }, []);

  const register = useCallback((defs: FeatureFlagDefinition[]) => {
    registryRef.current = defs;
    setRegistry(defs);
    // Default status가 있는 경우, 기존 사용자 토글이 없으면 default 채워둠
    setState((prev) => {
      const next = { ...prev };
      let changed = false;
      defs.forEach((d) => {
        if (d.defaultStatus && next[d.id] == null) {
          next[d.id] = d.defaultStatus;
          changed = true;
        }
      });
      if (changed) {
        writeJSON(STATE_STORAGE_KEY, next);
        return next;
      }
      return prev;
    });
    return () => {
      registryRef.current = [];
      setRegistry([]);
    };
  }, []);

  const setStatus = useCallback((id: string, status: FeatureStatus) => {
    setState((prev) => {
      const next = { ...prev, [id]: status };
      writeJSON(STATE_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const setNote = useCallback(
    (next: string) => {
      setAllNotes((prev) => {
        const updated = { ...prev, [routeKey]: next };
        writeJSON(NOTE_STORAGE_KEY, updated);
        return updated;
      });
    },
    [routeKey],
  );

  const value = useMemo<FeatureFlagContextValue>(
    () => ({
      registry,
      state,
      register,
      setStatus,
      note: allNotes[routeKey] ?? '',
      setNote,
      routeKey,
      setRouteKey,
    }),
    [registry, state, register, setStatus, allNotes, routeKey, setNote],
  );

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
}

export function useFeatureFlags(): FeatureFlagContextValue {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) throw new Error('useFeatureFlags must be inside <FeatureFlagProvider>');
  return ctx;
}

/**
 * 페이지가 자기 inventory를 패널에 등록.
 * usePathname()으로 routeKey 자동 설정. 언마운트 시 cleanup.
 *
 * @example
 *   useRegisterFeatures('/profile', [
 *     { id: 'profile.hero', labelKo: '프로필 헤로', labelEn: 'Profile hero' },
 *     { id: 'profile.statGrid', labelKo: '통계 그리드', labelEn: 'Stat grid' },
 *   ]);
 */
export function useRegisterFeatures(routeKey: string, defs: FeatureFlagDefinition[]): void {
  const { register, setRouteKey } = useFeatureFlags();
  useEffect(() => {
    setRouteKey(routeKey);
    const cleanup = register(defs);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey, JSON.stringify(defs.map((d) => d.id))]);
}

/**
 * 컴포넌트가 자기 상태(dropped 등)를 읽어 data-feature-status 부여하는 헬퍼.
 */
export function useFeatureStatus(id: string): FeatureStatus | undefined {
  const { state } = useFeatureFlags();
  return state[id];
}
