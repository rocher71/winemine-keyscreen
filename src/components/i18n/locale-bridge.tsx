'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useLocale } from '@/context/locale-context';
import koMessages from '../../../messages/ko.json';
import enMessages from '../../../messages/en.json';
import type { ReactNode } from 'react';

const MESSAGES = {
  ko: koMessages,
  en: enMessages,
} as const;

/**
 * LocaleContext 값을 NextIntlClientProvider로 전파.
 *
 * SSR 시 LocaleContext 기본값('ko')로 렌더. 클라이언트에서 useLocale()이
 * localStorage/URL을 읽어 갱신되면 NextIntlClientProvider도 즉시 갱신됨.
 *
 * messages는 양 locale 모두 import해 두고 locale에 따라 swap.
 * 이렇게 두면 사용자가 DemoControls에서 언어를 토글할 때 즉각 UI 전체 텍스트가 변경.
 */
export function LocaleBridge({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const messages = MESSAGES[locale] ?? MESSAGES.ko;
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
