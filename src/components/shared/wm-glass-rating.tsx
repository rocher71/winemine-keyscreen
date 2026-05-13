/**
 * 와인잔 아이콘 5개로 이루어진 평점 표시 컴포넌트.
 * 디자인 시안의 WMGlassRating을 React로 이식.
 */

type WMGlassRatingProps = {
  /** 0~5 범위의 평점 (소수 가능) */
  value: number;
  size?: number;
  color?: string;
  gap?: number;
};

function WineGlassIcon({
  filled,
  half,
  size,
  color,
}: {
  filled: boolean;
  half: boolean;
  size: number;
  color: string;
}) {
  const dimColor = 'rgba(255,255,255,0.18)';
  const halfId = `wg-half-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 12 16"
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden
    >
      {half && (
        <defs>
          <linearGradient id={halfId}>
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      {/* 잔 볼 */}
      <path
        d="M3 2 Q3 7 6 8 Q9 7 9 2 Z"
        fill={filled ? color : half ? `url(#${halfId})` : 'transparent'}
        stroke={filled || half ? color : dimColor}
        strokeWidth="0.7"
        strokeLinejoin="round"
        opacity={filled || half ? 1 : 0.35}
      />
      {/* 스템 */}
      <line
        x1="6"
        y1="8"
        x2="6"
        y2="13.5"
        stroke={filled || half ? color : dimColor}
        strokeWidth="0.7"
        opacity={filled || half ? 1 : 0.35}
      />
      {/* 베이스 */}
      <line
        x1="3.5"
        y1="14"
        x2="8.5"
        y2="14"
        stroke={filled || half ? color : dimColor}
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity={filled || half ? 1 : 0.35}
      />
    </svg>
  );
}

export function WMGlassRating({
  value,
  size = 10,
  color = '#C9A84C',
  gap = 2,
}: WMGlassRatingProps) {
  const clamped = Math.max(0, Math.min(5, value));

  return (
    <span
      style={{ display: 'inline-flex', gap, alignItems: 'center' }}
      aria-label={`${clamped.toFixed(1)} / 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < Math.floor(clamped);
        const half = !filled && i < clamped;
        return (
          <WineGlassIcon key={i} filled={filled} half={half} size={size} color={color} />
        );
      })}
    </span>
  );
}
