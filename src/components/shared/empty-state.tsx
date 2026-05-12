'use client';

import type { ReactNode } from 'react';
import { LocaleText } from './locale-text';
import type { LocalizedString } from '@/types';

/**
 * 빈 상태 (셀러 0개, 노트 0개, 즐겨찾기 0개 등).
 * 일러스트 + 타이틀 + 설명 + CTA 슬롯.
 *
 * 일러스트는 페이지가 자유롭게 결정 (lucide 아이콘 또는 emoji 또는 SVG).
 */
type Props = {
  illustration?: ReactNode;
  title: LocalizedString | string;
  description?: LocalizedString | string;
  /** CTA 또는 보조 액션 슬롯 */
  action?: ReactNode;
};

export function EmptyState({ illustration, title, description, action }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 24px',
        gap: 12,
        color: 'var(--color-text-secondary)',
      }}
    >
      {illustration && (
        <div style={{ color: 'var(--color-gold)', opacity: 0.7, marginBottom: 4 }}>
          {illustration}
        </div>
      )}
      <LocaleText
        value={title}
        as="h2"
        className="wm-empty-title"
      />
      {description && (
        <LocaleText
          value={description}
          as="p"
          className="wm-empty-desc"
        />
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
