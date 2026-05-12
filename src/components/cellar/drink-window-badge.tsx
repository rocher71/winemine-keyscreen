'use client';

import { useTranslations } from 'next-intl';
import type { DrinkWindowStatus } from '@/lib/drink-window';

type Props = {
  status: DrinkWindowStatus;
  fromYear?: number;
};

/**
 * 셀러 카드 / 상세에서 사용하는 음용 시점 칩.
 * status별 색 / 라벨 분기.
 */
export function DrinkWindowBadge({ status, fromYear }: Props) {
  const t = useTranslations('cellar.drinkWindow');

  let bg = 'var(--color-text-muted)';
  let color = 'var(--color-cream)';
  let label = '';

  switch (status) {
    case 'peak':
      bg = 'var(--color-wine-red)';
      color = 'var(--color-cream)';
      label = t('peak');
      break;
    case 'opening':
    case 'mature':
      bg = 'var(--color-gold)';
      color = '#05020A';
      label = status === 'opening' ? t('now') : t('mature');
      break;
    case 'too-young':
      bg = 'rgba(155,139,122,0.18)';
      color = 'var(--color-text-muted)';
      label = fromYear ? t('fromYear', { year: fromYear }) : t('tooYoung');
      break;
    case 'past-peak':
      bg = 'rgba(45,21,64,0.6)';
      color = 'var(--color-text-muted)';
      label = t('pastPeak');
      break;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 10,
        background: bg,
        color,
        fontFamily: 'var(--font-inter)',
        fontWeight: 600,
        fontSize: 10,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
