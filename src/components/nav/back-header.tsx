'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { LocaleText } from '@/components/shared/locale-text';
import type { LocalizedString } from '@/types';

/**
 * 깊이 있는 화면용 헤더.
 * 56px 높이, padding 0 16px
 * - 좌측: ChevronLeft 24px + 페이지 타이틀 (Inter 600 16px)
 * - 우측: 컨텍스트 액션 슬롯 (Share2, MoreHorizontal, Star 등 페이지별)
 * - 클릭 시 router.back() (onBack prop으로 override 가능)
 *
 * @example
 *   <BackHeader title={{ ko: '셀러 상세', en: 'Cellar item' }}>
 *     <button aria-label="Share"><Share2 size={20} /></button>
 *   </BackHeader>
 */
type Props = {
  title?: LocalizedString | string;
  /** 우측 컨텍스트 액션 슬롯 */
  children?: ReactNode;
  /** 기본 router.back()을 override (예: explicit href로 이동) */
  onBack?: () => void;
};

export function BackHeader({ title, children, onBack }: Props) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <header
      style={{
        height: 56,
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0, flex: 1 }}>
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            border: 'none',
            background: 'transparent',
            color: 'var(--color-cream)',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ChevronLeft size={24} strokeWidth={1.75} />
        </button>
        {title != null && (
          <LocaleText
            value={title}
            as="h1"
            className="wm-back-title"
          />
        )}
      </div>

      {children && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {children}
        </div>
      )}
    </header>
  );
}
