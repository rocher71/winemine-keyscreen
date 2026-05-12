'use client';

/**
 * WSETSlider — 5도트 강도 슬라이더.
 * handover doc §5.1.
 *
 * - 5점 (`low / mediumMinus / medium / mediumPlus / high`)
 * - 마우스/터치 클릭 + 키보드 좌우 화살표
 * - 활성 점은 Gold 발광 (box-shadow)
 * - 라벨 텍스트는 i18n key + `labels[scale].{ko|en}` 양쪽 모두 표시
 */

import { useId, type KeyboardEvent } from 'react';
import { useLocale } from '@/context/locale-context';
import type { WSETScale } from '@/lib/tasting-note-lexicon';

const ORDER: WSETScale[] = ['low', 'mediumMinus', 'medium', 'mediumPlus', 'high'];

export interface WSETSliderProps {
  /** i18n 키. 라벨 텍스트가 i18n에서 풀리는 부모가 미리 제공해도 되고, 그대로 다음 prop으로 fallback. */
  labelKey?: string;
  /** 부모가 i18n에서 풀어 넘긴 한 줄 라벨 텍스트 (`labelKey`보다 우선) */
  labelText?: string;
  value: WSETScale;
  onChange: (next: WSETScale) => void;
  labels: Record<WSETScale, { ko: string; en: string }>;
  hint?: string;
  /** disabled 처리 */
  disabled?: boolean;
}

export function WSETSlider({
  labelKey,
  labelText,
  value,
  onChange,
  labels,
  hint,
  disabled = false,
}: WSETSliderProps) {
  const { locale } = useLocale();
  const groupId = useId();
  const currentIndex = ORDER.indexOf(value);

  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = ORDER[Math.max(0, currentIndex - 1)];
      if (next !== value) onChange(next);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = ORDER[Math.min(ORDER.length - 1, currentIndex + 1)];
      if (next !== value) onChange(next);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(ORDER[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(ORDER[ORDER.length - 1]);
    }
  }

  const activeLabel = labels[value]?.[locale] ?? labels[value]?.ko ?? value;
  const headLabel = labelText ?? labelKey ?? '';

  return (
    <div
      className="wm-wset-slider"
      role="group"
      aria-labelledby={`${groupId}-label`}
      style={{ width: '100%' }}
    >
      <div
        id={`${groupId}-label`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: 'var(--color-cream)',
            textTransform: 'uppercase',
          }}
        >
          {headLabel}
        </span>
        <span style={{ fontSize: 12, color: 'var(--color-gold)' }}>{activeLabel}</span>
      </div>
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={currentIndex}
        aria-valuetext={activeLabel}
        aria-disabled={disabled}
        onKeyDown={handleKey}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          padding: '8px 4px',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
        }}
      >
        {ORDER.map((scale, idx) => {
          const active = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={scale} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <button
                type="button"
                aria-label={labels[scale]?.[locale] ?? scale}
                onClick={(e) => {
                  e.preventDefault();
                  if (!disabled) onChange(scale);
                }}
                disabled={disabled}
                style={{
                  width: isCurrent ? 18 : 12,
                  height: isCurrent ? 18 : 12,
                  borderRadius: '50%',
                  border: 0,
                  padding: 0,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  background: active ? 'var(--color-gold)' : 'var(--color-border)',
                  boxShadow: isCurrent
                    ? '0 0 0 4px rgba(201, 168, 76, 0.18), 0 0 12px rgba(201, 168, 76, 0.45)'
                    : 'none',
                  transition: 'all 160ms ease',
                  flexShrink: 0,
                }}
              />
              {idx < ORDER.length - 1 && (
                <div
                  aria-hidden
                  style={{
                    flex: 1,
                    height: 2,
                    background: idx < currentIndex ? 'var(--color-gold)' : 'var(--color-border)',
                    transition: 'background 160ms ease',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {hint ? (
        <p
          style={{
            fontSize: 12,
            color: 'var(--color-muted)',
            margin: '4px 0 0',
          }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
