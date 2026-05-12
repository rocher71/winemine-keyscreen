'use client';

import { useSyncExternalStore } from 'react';

/**
 * 전역 PlaceholderToast 큐.
 * 길이 1 — 새 호출이 기존 토스트를 즉시 교체.
 *
 * Pub/sub 패턴으로 React 트리 외부에서도 호출 가능 (`toast(...)` 함수형 API).
 *
 * @example
 *   const { toast } = useToast();
 *   toast({ message: { ko: '저장됨', en: 'Saved' } });
 *   toast({ message: { ko: '+10 XP', en: '+10 XP' }, variant: 'xp', xp: 10 });
 */

import type { LocalizedString } from '@/types';

export type ToastVariant = 'default' | 'xp' | 'error';

export interface ToastPayload {
  /** 표시 메시지. plain string도 허용하지만 가능한 LocalizedString 사용 권장. */
  message: LocalizedString | string;
  variant?: ToastVariant;
  /** xp variant에서 좌측에 "+N XP" 칩을 보여줄 때 사용 */
  xp?: number;
  /** auto-dismiss ms (default 2500). 0이면 자동 dismiss 안 함. */
  durationMs?: number;
}

export interface ToastEntry extends ToastPayload {
  id: number;
  variant: ToastVariant;
  durationMs: number;
}

let currentToast: ToastEntry | null = null;
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot(): ToastEntry | null {
  return currentToast;
}

function getServerSnapshot(): ToastEntry | null {
  return null;
}

/** 직접 호출형 API — 컴포넌트 밖에서도 사용 가능 */
export function toast(payload: ToastPayload): void {
  currentToast = {
    id: nextId++,
    variant: payload.variant ?? 'default',
    durationMs: payload.durationMs ?? 2500,
    message: payload.message,
    xp: payload.xp,
  };
  emit();
}

export function dismissToast(id?: number): void {
  if (id != null && currentToast?.id !== id) return;
  currentToast = null;
  emit();
}

export function useToast(): {
  toast: typeof toast;
  dismissToast: typeof dismissToast;
  current: ToastEntry | null;
} {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { toast, dismissToast, current };
}
