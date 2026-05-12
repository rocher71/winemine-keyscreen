'use client';

import { Check } from 'lucide-react';

export type RadioOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

type Props<T extends string> = {
  options: RadioOption<T>[];
  value: T;
  onChange: (next: T) => void;
};

export function RadioList<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '0 16px' }}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={selected}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '14px 16px',
              background: 'var(--color-surface)',
              border: `1px solid ${selected ? 'var(--color-gold)' : 'var(--color-border-default)'}`,
              borderRadius: 12,
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                border: `2px solid ${selected ? 'var(--color-gold)' : 'var(--color-border-default)'}`,
                background: selected ? 'var(--color-gold)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {selected && <Check size={12} strokeWidth={3} color="#05020A" />}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--color-cream)',
                }}
              >
                {opt.label}
              </div>
              {opt.description && (
                <div
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 12,
                    color: 'var(--color-text-muted)',
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {opt.description}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
