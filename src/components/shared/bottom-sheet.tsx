'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';

/**
 * 모바일/데스크톱 통합 BottomSheet.
 *
 * - drag handle 36×4 Gold
 * - translateY 100%→0, 350ms ease-out (Framer Motion)
 * - backdrop fade 200ms
 * - Escape 키 닫기, backdrop click 닫기, body scroll lock
 * - DeviceFrame 안에서 absolute로 떠 있으므로 DeviceFrame inner의 좌표계에서 동작
 *
 * @example
 *   const [open, setOpen] = useState(false);
 *   <BottomSheet open={open} onClose={() => setOpen(false)}>
 *     <div>...</div>
 *   </BottomSheet>
 */
type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** sheet 최대 높이 (DeviceFrame inner 기준), default 70% */
  maxHeight?: string | number;
};

export function BottomSheet({ open, onClose, children, maxHeight = '70%' }: Props) {
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
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 40,
            }}
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              maxHeight,
              background: 'var(--color-surface)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '12px 16px 24px',
              zIndex: 41,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            {/* drag handle */}
            <div
              aria-hidden
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: 'var(--color-gold)',
                alignSelf: 'center',
                marginBottom: 4,
              }}
            />
            <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
