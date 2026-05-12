'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

/**
 * 중앙 정렬 모달 (DeviceFrame 내부 좌표계).
 * - max-width 320px (DeviceFrame 안 기준)
 * - scale 0.95→1 + opacity 0→1, 250ms ease-out
 * - backdrop click·Escape으로 닫기
 *
 * 본문 콘텐츠는 children에 넣고, 페이지 측에서 자유로운 레이아웃 가능.
 */
type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 닫기 X 버튼 노출 (default true) */
  showClose?: boolean;
  /** aria-labelledby — 모달 안 제목 element의 id */
  labelledBy?: string;
};

export function Modal({ open, onClose, children, showClose = true, labelledBy }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: 16,
          }}
        >
          <motion.div
            key="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 320,
              background: 'var(--color-surface)',
              borderRadius: 16,
              padding: 24,
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-inter)',
              border: '1px solid var(--color-border-default)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
              position: 'relative',
            }}
          >
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
