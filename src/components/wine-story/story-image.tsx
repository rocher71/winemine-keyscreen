'use client';

import { Grape } from 'lucide-react';

type Props = {
  bottleColor?: string;
  height?: number;
};

/**
 * 와이너리 스토리 hero placeholder — 외부 이미지 X, 다크 그라데이션 + WineryIcon.
 */
export function StoryImage({ bottleColor = '#5b1424', height = 240 }: Props) {
  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        height,
        borderRadius: 18,
        background: `linear-gradient(160deg, ${bottleColor} 0%, var(--color-bg-deepest) 100%)`,
        overflow: 'hidden',
        border: '1px solid var(--color-border-default)',
      }}
    >
      {/* 어두운 오버레이 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 30% 40%, rgba(201,168,76,0.15) 0%, transparent 60%)',
        }}
      />
      {/* 큰 grape 아이콘 */}
      <div
        style={{
          position: 'absolute',
          right: 24,
          bottom: 24,
          opacity: 0.18,
          color: 'var(--color-gold)',
        }}
      >
        <Grape size={120} strokeWidth={1} />
      </div>
    </div>
  );
}
