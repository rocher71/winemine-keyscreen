'use client';

/**
 * 인라인 레벨 표시 칩 — 이름 옆에 작게.
 *
 * SPEC level_colors:
 *   L1: Cream #F5F0E8
 *   L2: Gold soft #D4B85C
 *   L3: Gold #C9A84C
 *   L4: Wine Red #8B1A2A
 *   L5: Platinum gradient (Gold → Cream)
 *
 * @example
 *   <LevelPill level={3} />     →  "L3" Gold
 *   <LevelPill level={5} label="Master" />
 */
type Props = {
  level: 1 | 2 | 3 | 4 | 5;
  /** 추가 텍스트 (예: "Master"). 미지정 시 "Lx" 만 표시 */
  label?: string;
  size?: 'sm' | 'md';
};

function levelStyle(level: 1 | 2 | 3 | 4 | 5): { background: string; color: string } {
  switch (level) {
    case 1:
      return { background: '#F5F0E8', color: '#05020A' };
    case 2:
      return { background: '#D4B85C', color: '#05020A' };
    case 3:
      return { background: '#C9A84C', color: '#05020A' };
    case 4:
      return { background: '#8B1A2A', color: '#F5F0E8' };
    case 5:
      return {
        background: 'linear-gradient(135deg, #C9A84C 0%, #F5F0E8 100%)',
        color: '#05020A',
      };
  }
}

export function LevelPill({ level, label, size = 'sm' }: Props) {
  const { background, color } = levelStyle(level);
  const padding = size === 'sm' ? '2px 8px' : '4px 10px';
  const fontSize = size === 'sm' ? 10 : 11;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        borderRadius: 12,
        background,
        color,
        fontFamily: 'var(--font-inter)',
        fontWeight: 600,
        fontSize,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
      aria-label={`Level ${level}${label ? ` ${label}` : ''}`}
    >
      L{level}
      {label && <span style={{ marginLeft: 4 }}>{label}</span>}
    </span>
  );
}
