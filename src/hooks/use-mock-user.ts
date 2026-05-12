'use client';

import { useAppMode } from '@/context/app-mode-context';
import { getMockUser } from '@/lib/mock/users';
import type { User } from '@/types';

/**
 * 현재 데모 모드에 따라 mock 유저(헤비/first-time) 반환.
 *
 *   - demoMode='heavy' → currentUserHeavy (xp=1280, 28병 셀러)
 *   - demoMode='first-time' → currentUserFirst (empty stats)
 */
export function useMockUser(): { user: User } {
  const { demoMode } = useAppMode();
  return { user: getMockUser(demoMode) };
}
