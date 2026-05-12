'use client';

/**
 * Dynamic Island — iPhone 14 Pro+ 의 알약 모양 노치.
 * 데스크톱 DeviceFrame 안에서만 표시.
 * 모바일에서는 숨김 (CSS).
 */
export function DynamicIsland() {
  return (
    <div
      aria-hidden
      className="wm-dynamic-island"
      style={{
        position: 'absolute',
        top: 11,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 120,
        height: 34,
        backgroundColor: '#000000',
        borderRadius: 17,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    />
  );
}
