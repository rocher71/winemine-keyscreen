'use client';

/**
 * 와인 라벨 일러스트 placeholder.
 *
 * 실제 라벨 사진이 없는 경우, bottleColor 기반 그라데이션 + 와인 이니셜로
 * 시안용 카드 일러스트를 만든다. width/height props로 다양한 컨텍스트에 재사용.
 *
 * 디자인:
 *   - 어두운 베이스 (bottleColor) + 위쪽 하이라이트
 *   - 정중앙에 와인 이니셜 (Playfair, Cream)
 *   - Gold 가는 보더 (1px)로 라벨 느낌
 */
type Props = {
  initial: string;
  bottleColor?: string;
  width?: number;
  height?: number;
  rounded?: number;
};

export function WineLabelArt({
  initial,
  bottleColor = '#3f0f1f',
  width = 80,
  height = 110,
  rounded = 8,
}: Props) {
  return (
    <div
      aria-hidden
      style={{
        width,
        height,
        borderRadius: rounded,
        background: `linear-gradient(160deg, ${bottleColor} 0%, ${shade(bottleColor, -20)} 60%, ${shade(bottleColor, -40)} 100%)`,
        border: '1px solid rgba(201,168,76,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-cream)',
        fontFamily: 'var(--font-playfair)',
        fontWeight: 400,
        fontSize: Math.max(20, Math.min(width, height) * 0.42),
        letterSpacing: '-0.02em',
        textTransform: 'uppercase',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{initial.slice(0, 1)}</span>
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amt));
  return `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
