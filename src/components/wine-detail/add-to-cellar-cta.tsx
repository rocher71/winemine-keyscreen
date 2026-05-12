'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Plus } from 'lucide-react';
import { LocaleText } from '@/components/shared/locale-text';

type Props = {
  wineId: string;
  variant?: 'inline' | 'fixed';
};

/**
 * 셀러 추가 CTA. 페이지 하단에 inline 또는 fixed로.
 * 클릭 시 /capture로 이동 (mock 셀러 등록 흐름).
 */
export function AddToCellarCta({ wineId, variant = 'inline' }: Props) {
  void wineId; // mock - wineId는 capture에서 mock 자동 매칭

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 52,
    padding: '0 20px',
    borderRadius: 14,
    background: 'var(--color-wine-red)',
    color: 'var(--color-cream)',
    border: 'none',
    fontFamily: 'var(--font-inter)',
    fontWeight: 600,
    fontSize: 15,
    textDecoration: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(139, 26, 42, 0.45)',
  };

  if (variant === 'fixed') {
    return (
      <div
        style={{
          position: 'sticky',
          bottom: 16,
          padding: '0 16px',
          zIndex: 5,
        }}
      >
        <Link href={'/capture' as Route} style={buttonStyle}>
          <Plus size={18} strokeWidth={2} />
          <LocaleText value={{ ko: '셀러에 추가', en: 'Add to cellar' }} />
        </Link>
      </div>
    );
  }

  return (
    <Link href={'/capture' as Route} style={buttonStyle}>
      <Plus size={18} strokeWidth={2} />
      <LocaleText value={{ ko: '셀러에 추가', en: 'Add to cellar' }} />
    </Link>
  );
}
