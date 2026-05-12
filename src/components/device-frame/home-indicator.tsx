'use client';

/**
 * Home Indicator — 하단 134×5 막대.
 * 데스크톱 DeviceFrame 안에서만 표시. 모바일에서는 숨김.
 */
export function HomeIndicator() {
  return (
    <div
      aria-hidden
      className="wm-home-indicator"
      style={{
        position: 'absolute',
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 134,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: 'rgba(245, 240, 232, 0.4)',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    />
  );
}
