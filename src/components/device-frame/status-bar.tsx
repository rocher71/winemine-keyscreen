'use client';

/**
 * iPhone 스타일 상단 상태바 — 시안 시뮬레이션용 정적 표시.
 * 좌측 "9:41" 시계, 우측 신호+Wi-Fi+배터리 인디케이터.
 * Dynamic Island와 겹치지 않도록 좌·우 분리 배치 (height 54px).
 */
export function StatusBar() {
  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        height: 54,
        paddingTop: 18,
        paddingLeft: 28,
        paddingRight: 28,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      {/* 시계 */}
      <span
        style={{
          fontFamily: 'var(--font-inter)',
          fontWeight: 500,
          fontSize: 15,
          lineHeight: 1,
          color: 'var(--color-cream)',
          letterSpacing: '-0.01em',
        }}
      >
        9:41
      </span>

      {/* 우측 인디케이터 — 시안용 simple icon set */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* 신호: 4 dots */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none" aria-hidden>
          <rect x="0" y="7" width="3" height="4" rx="0.5" fill="var(--color-cream)" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="var(--color-cream)" />
          <rect x="9" y="3" width="3" height="8" rx="0.5" fill="var(--color-cream)" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="var(--color-cream)" />
        </svg>

        {/* Wi-Fi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden>
          <path
            d="M8 10.5l1.5-1.5a2.1 2.1 0 00-3 0L8 10.5z"
            fill="var(--color-cream)"
          />
          <path
            d="M3.8 6.3a6 6 0 018.4 0l1.4-1.4a8 8 0 00-11.2 0l1.4 1.4zM1 3.5a10 10 0 0114 0l1.4-1.4a12 12 0 00-16.8 0L1 3.5zM5.8 8.3a3.2 3.2 0 014.4 0l1.4-1.4a5.2 5.2 0 00-7.2 0l1.4 1.4z"
            fill="var(--color-cream)"
          />
        </svg>

        {/* Battery */}
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none" aria-hidden>
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="3"
            stroke="var(--color-cream)"
            strokeOpacity="0.5"
            fill="none"
          />
          <rect x="2.5" y="2.5" width="18" height="7" rx="1.5" fill="var(--color-cream)" />
          <rect x="23.5" y="3.5" width="1.5" height="5" rx="0.75" fill="var(--color-cream)" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
