'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

function variantStyle(v: Variant, disabled: boolean) {
  if (disabled) {
    return {
      background: 'var(--color-text-disabled)',
      color: 'var(--color-text-muted)',
      border: '1px solid transparent',
    };
  }
  switch (v) {
    case 'primary':
      return {
        background: 'var(--color-wine-red)',
        color: 'var(--color-cream)',
        border: '1px solid var(--color-wine-red)',
      };
    case 'secondary':
      return {
        background: 'transparent',
        color: 'var(--color-cream)',
        border: '1px solid var(--color-border-default)',
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: 'var(--color-text-secondary)',
        border: '1px solid transparent',
      };
    case 'danger':
      return {
        background: 'transparent',
        color: 'var(--color-error)',
        border: '1px solid var(--color-error)',
      };
  }
}

function sizeStyle(s: Size) {
  switch (s) {
    case 'sm':
      return { padding: '6px 12px', fontSize: 13, height: 32 };
    case 'md':
      return { padding: '10px 16px', fontSize: 14, height: 40 };
    case 'lg':
      return { padding: '14px 20px', fontSize: 15, height: 48 };
  }
}

/**
 * Generic CTA 버튼 — winemine 토큰 색 사용.
 */
export function PrimaryButton({
  variant = 'primary',
  size = 'md',
  block = false,
  leadingIcon,
  trailingIcon,
  children,
  disabled,
  style,
  ...rest
}: Props) {
  const v = variantStyle(variant, !!disabled);
  const s = sizeStyle(size);
  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        ...v,
        ...s,
        display: block ? 'flex' : 'inline-flex',
        width: block ? '100%' : 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 12,
        fontFamily: 'var(--font-inter)',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 200ms ease-out, transform 100ms ease-out',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
