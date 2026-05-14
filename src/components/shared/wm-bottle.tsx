import { useId } from 'react';
import type { CSSProperties } from 'react';

type WMBottleProps = {
  /** 병 body 색상 (hex) */
  bottleColor?: string;
  /** 라벨 배경 색상 */
  labelColor?: string;
  /** 라벨 첫 줄 텍스트 (생산자) */
  producer?: string;
  /** 라벨 두 번째 줄 텍스트 (와인명 짧은 버전) */
  label?: string;
  /** 빈티지 */
  vintage?: number | null;
  width?: number;
  height?: number;
  style?: CSSProperties;
};

/**
 * 와인 병 SVG 일러스트.
 * 디자인 시안의 WMBottle을 React 컴포넌트로 이식.
 * 병 형태, 포일 캡, 라벨 텍스트를 포함한 inline SVG.
 */
export function WMBottle({
  bottleColor = '#3a1018',
  labelColor = '#f3ead4',
  producer = '',
  label = '',
  vintage,
  width = 48,
  height = 160,
  style,
}: WMBottleProps) {
  const uid = useId();
  const gradId = `${uid}-g`;
  const shineId = `${uid}-sh`;

  const short = (s: string, n: number) => (s.length > n ? s.slice(0, n) + '…' : s);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 160"
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={bottleColor} stopOpacity="0.95" />
          <stop offset="50%" stopColor={bottleColor} stopOpacity="0.78" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={shineId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="30%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 병 바디 */}
      <path
        d="M18 3 H30 V30 Q30 35 33 40 Q38 48 38 64 V152 Q38 156 34 156 H14 Q10 156 10 152 V64 Q10 48 15 40 Q18 35 18 30 Z"
        fill={`url(#${gradId})`}
      />
      {/* 하이라이트 */}
      <path
        d="M18 3 H30 V30 Q30 35 33 40 Q38 48 38 64 V152 Q38 156 34 156 H14 Q10 156 10 152 V64 Q10 48 15 40 Q18 35 18 30 Z"
        fill={`url(#${shineId})`}
      />

      {/* 포일 캡 (어두운 직사각형) */}
      <rect x="16" y="2" width="16" height="28" fill="#080410" opacity="0.88" />
      {/* 골드 칼라 라인 */}
      <rect x="14" y="30" width="20" height="1.5" fill="#C9A84C" opacity="0.8" />

      {/* 라벨 */}
      <rect x="11" y="76" width="26" height="52" fill={labelColor} />

      {/* 라벨 상단 텍스트 — 생산자 */}
      {producer && (
        <text
          x="24"
          y="92"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
          fontSize="5.5"
          fontStyle="italic"
          fill="#3d1a26"
          opacity="0.85"
        >
          {short(producer, 10)}
        </text>
      )}

      {/* 구분선 */}
      <line x1="14" y1="96" x2="34" y2="96" stroke="#3d1a26" strokeWidth="0.3" opacity="0.4" />

      {/* 라벨 메인 텍스트 — 와인명 */}
      {label && (
        <text
          x="24"
          y="110"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
          fontSize="7.5"
          fontWeight="700"
          fill="#3d1a26"
        >
          {short(label, 8)}
        </text>
      )}

      {/* 빈티지 */}
      {vintage != null && (
        <text
          x="24"
          y="122"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="6.5"
          fontWeight="600"
          fill="#3d1a26"
          opacity="0.8"
        >
          {vintage}
        </text>
      )}
    </svg>
  );
}
