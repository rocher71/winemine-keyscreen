'use client';

import type { ReactNode } from 'react';
import { StatusBar } from './status-bar';
import { DynamicIsland } from './dynamic-island';
import { HomeIndicator } from './home-indicator';
import { PushBanner } from './push-banner';

/**
 * winemine 키스크린 디바이스 프레임.
 *
 * 데스크톱 (≥768px):
 *   - 외경 414×868, border-radius 50px, Wine-Red glow shadow
 *   - 내부 콘텐츠 영역 390×844, overflow hidden
 *   - StatusBar + DynamicIsland + HomeIndicator 자동 마운트
 *
 * 모바일 (<768px):
 *   - wrapper 투명, 콘텐츠 풀스크린
 *   - StatusBar/Island/Indicator 모두 CSS로 숨김
 *
 * 페이지 콘텐츠(children)는 내부 .wm-route-outlet에 배치되며,
 * BottomNav는 페이지 또는 상위에서 별도 마운트 (whitelist 패턴).
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="wm-device-frame-wrapper"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0px, 4vh, 32px)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        className="wm-device-frame"
        role="img"
        aria-label="winemine 키스크린 시안 — iPhone 목업"
      >
        {/* 데스크톱 전용 노치·홈 인디케이터 */}
        <div className="wm-device-only-desktop">
          <DynamicIsland />
          <HomeIndicator />
        </div>

        <div className="wm-device-frame-inner">
          {/* StatusBar는 데스크톱에서만 보이도록 CSS 분기 */}
          <div className="wm-device-only-desktop">
            <StatusBar />
          </div>

          <div className="wm-route-outlet">{children}</div>

          {/* iOS 스타일 푸시 알림 배너 (Dynamic Island 아래) */}
          <PushBanner />
        </div>
      </div>
    </div>
  );
}
