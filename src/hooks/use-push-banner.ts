'use client';

import { useSyncExternalStore } from 'react';
import type { LocalizedString } from '@/types';

/**
 * iPhone 상단 푸시 알림 배너 큐 (길이 1).
 * 일반 placeholder toast와 분리 — banner는 두 줄(title + body) 레이아웃이고,
 * DeviceFrame 내부 Dynamic Island 아래에 자리잡는다.
 *
 * @example
 *   pushBanner({
 *     title: { ko: '관심 와인이 등록됐어요', en: 'A favourite wine just got logged' },
 *     body: { ko: '익명 사용자가 X를 ₩Y에 구매 기록했습니다.', en: '...' },
 *   });
 */

export interface PushBannerPayload {
  title: LocalizedString;
  body: LocalizedString;
  /** auto-dismiss ms — 기본 4500ms, 0이면 무한 */
  durationMs?: number;
}

export interface PushBannerEntry extends PushBannerPayload {
  id: number;
  durationMs: number;
}

let currentBanner: PushBannerEntry | null = null;
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot(): PushBannerEntry | null {
  return currentBanner;
}

function getServerSnapshot(): PushBannerEntry | null {
  return null;
}

export function pushBanner(payload: PushBannerPayload): void {
  currentBanner = {
    id: nextId++,
    durationMs: payload.durationMs ?? 4500,
    title: payload.title,
    body: payload.body,
  };
  emit();
}

export function dismissBanner(id?: number): void {
  if (id != null && currentBanner?.id !== id) return;
  currentBanner = null;
  emit();
}

export function usePushBanner(): {
  pushBanner: typeof pushBanner;
  dismissBanner: typeof dismissBanner;
  current: PushBannerEntry | null;
} {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { pushBanner, dismissBanner, current };
}
