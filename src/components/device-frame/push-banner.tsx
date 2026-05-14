'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePushBanner } from '@/hooks/use-push-banner';
import { LocaleText } from '@/components/shared/locale-text';

/**
 * iOS 스타일 푸시 알림 배너.
 * DeviceFrame 내부에 absolute 마운트되어 Dynamic Island 아래 ~58px 지점에 슬라이드 다운.
 * 데스크톱(≥768px) DeviceFrame에서만 보이고 모바일에서는 화면 상단.
 */
export function PushBanner() {
  const { current, dismissBanner } = usePushBanner();

  useEffect(() => {
    if (!current) return;
    if (current.durationMs <= 0) return;
    const id = current.id;
    const timer = window.setTimeout(() => dismissBanner(id), current.durationMs);
    return () => window.clearTimeout(timer);
  }, [current, dismissBanner]);

  return (
    <AnimatePresence>
      {current && (
        <motion.button
          key={current.id}
          type="button"
          onClick={() => dismissBanner(current.id)}
          initial={{ opacity: 0, y: -56, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -56, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          aria-live="polite"
          style={{
            position: 'absolute',
            top: 58,
            left: 8,
            right: 8,
            zIndex: 60,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '12px 14px',
            background: 'rgba(28, 18, 38, 0.92)',
            backdropFilter: 'blur(20px) saturate(140%)',
            WebkitBackdropFilter: 'blur(20px) saturate(140%)',
            border: '1px solid rgba(201, 168, 76, 0.18)',
            borderRadius: 18,
            boxShadow:
              '0 10px 24px rgba(0, 0, 0, 0.55), 0 1px 0 rgba(255, 255, 255, 0.04) inset',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'var(--font-inter)',
            color: 'var(--color-cream)',
          }}
        >
          {/* winemine 앱 아이콘 */}
          <div
            aria-hidden
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background:
                'linear-gradient(135deg, var(--color-wine-red) 0%, #5a0f1d 100%)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                'inset 0 0 0 0.5px rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--color-gold)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              w
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                marginBottom: 2,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                <LocaleText value={current.title} />
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: 'rgba(245,240,232,0.55)',
                  flexShrink: 0,
                }}
              >
                now
              </span>
            </div>
            <div
              style={{
                fontSize: 12,
                lineHeight: 1.4,
                color: 'rgba(245,240,232,0.85)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              <LocaleText value={current.body} />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
