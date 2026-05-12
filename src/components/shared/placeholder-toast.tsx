'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LocaleText } from './locale-text';

/**
 * 전역 placeholder 토스트 — 큐 길이 1.
 * `useToast().toast({ message, variant, xp })` 호출 시 표시.
 * 자동 dismiss (durationMs 기본 2500ms, 0이면 안 사라짐).
 *
 * 위치: DeviceFrame wrapper 외부 (페이지 우상단). 데스크톱에서는 viewport 우상단,
 * 모바일에서는 콘텐츠 상단(고정).
 */
export function PlaceholderToast() {
  const { current, dismissToast } = useToast();

  useEffect(() => {
    if (!current) return;
    if (current.durationMs <= 0) return;
    const id = current.id;
    const timer = window.setTimeout(() => dismissToast(id), current.durationMs);
    return () => window.clearTimeout(timer);
  }, [current, dismissToast]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 320,
            padding: '14px 20px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-gold)',
            borderRadius: 12,
            color: 'var(--color-cream)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            fontWeight: 500,
            zIndex: 100,
            cursor: 'pointer',
          }}
          onClick={() => dismissToast(current.id)}
        >
          {current.variant === 'xp' && current.xp != null ? (
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 999,
                background: 'rgba(201,168,76,0.15)',
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              +{current.xp} XP
            </span>
          ) : (
            <Sparkles size={16} strokeWidth={1.75} color="var(--color-gold)" />
          )}
          <LocaleText value={current.message} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
