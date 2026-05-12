'use client';

import { useLocale } from '@/context/locale-context';
import type { LocalizedString } from '@/types';

/**
 * LocalizedString을 현재 locale에 따라 렌더.
 *
 * @example
 *   <LocaleText value={wine.country} />
 *   <LocaleText value={{ ko: '저장됨', en: 'Saved' }} as="span" className="text-cream" />
 *
 * 가공 결과를 문자열로만 받고 싶다면 `useLocalizedText(value)` 헬퍼 사용.
 */
type Props = {
  value: LocalizedString | string | null | undefined;
  as?: React.ElementType;
  className?: string;
  /** value가 null/undefined일 때 보여줄 텍스트 (없으면 빈 문자열) */
  fallback?: string;
};

export function LocaleText({ value, as: As = 'span', className, fallback = '' }: Props) {
  const { locale } = useLocale();
  if (value == null) return <As className={className}>{fallback}</As>;
  if (typeof value === 'string') return <As className={className}>{value}</As>;
  const text = value[locale] ?? value.ko ?? fallback;
  return <As className={className}>{text}</As>;
}

/**
 * LocalizedString을 plain string으로 풀어주는 훅 — aria-label, title 등에 사용.
 */
export function useLocalizedText(value: LocalizedString | string | null | undefined): string {
  const { locale } = useLocale();
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value.ko ?? '';
}
