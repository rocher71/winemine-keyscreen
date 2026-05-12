'use client';

import { Thermometer } from 'lucide-react';
import { LocaleText } from '@/components/shared/locale-text';
import { GlossaryTooltip } from '@/components/glossary/glossary-tooltip';
import type { LocalizedString } from '@/types';

type Props = {
  min: number;
  max: number;
};

/**
 * 시음 온도 칩 — 와인 헤더 우하단에 배치되는 미니 칩.
 * 클릭 시 GlossaryTooltip popover (termId는 fixture에 없을 수 있어 fallback OK).
 */
export function ServingTempPill({ min, max }: Props) {
  const label: LocalizedString = {
    ko: `${min}-${max}°C 권장`,
    en: `${min}-${max}°C recommended`,
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        borderRadius: 999,
        background: 'rgba(201, 168, 76, 0.12)',
        border: '1px solid var(--color-gold)',
        color: 'var(--color-gold)',
        fontFamily: 'var(--font-inter)',
        fontWeight: 500,
        fontSize: 11,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      <Thermometer size={12} strokeWidth={1.75} />
      <LocaleText value={label} />
      <GlossaryTooltip termId="serving-temperature" placement="top" />
    </span>
  );
}
