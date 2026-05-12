'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { LocaleText } from '@/components/shared/locale-text';
import type { GlossaryEntry } from '@/types';
import type { Route } from 'next';

/**
 * 인라인 (i) 버튼 — 클릭 시 popover로 용어 정의 표시.
 *
 * `mock/glossary.ts`에서 lazy import — popover 열릴 때만 fetch.
 * fixture가 아직 없는 동안에는 fallback 텍스트 "Glossary entry not loaded" 표시.
 *
 * @example
 *   <GlossaryTooltip termId="caudalie" />
 *   <GlossaryTooltip termId="appellation" placement="top" />
 *
 *   {/* 인라인으로 다른 텍스트 옆에: *\/}
 *   카우달리 <GlossaryTooltip termId="caudalie" />
 */
type Placement = 'top' | 'bottom';
type Props = {
  termId: string;
  placement?: Placement;
  /** 사용자 정의 trigger. 기본은 14px Info 아이콘 */
  children?: ReactNode;
};

export function GlossaryTooltip({ termId, placement = 'bottom', children }: Props) {
  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState<GlossaryEntry | null | 'missing'>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // popover open 시점에 lazy import
  useEffect(() => {
    if (!open || entry != null) return;
    let mounted = true;
    (async () => {
      try {
        // mock-data-architect가 만든 `src/lib/mock/glossary.ts`에서 GLOSSARY 또는
        // getGlossaryEntry(termId)를 export. 세 가지 호출 형태 (named function,
        // named array, default record) 모두 지원.
        const mod = await import('@/lib/mock/glossary');
        let resolved: GlossaryEntry | null = null;
        if (typeof mod.getGlossaryEntry === 'function') {
          resolved = mod.getGlossaryEntry(termId) ?? null;
        } else if (Array.isArray(mod.GLOSSARY)) {
          resolved =
            (mod.GLOSSARY as GlossaryEntry[]).find((e) => e.id === termId) ?? null;
        } else if (mod.default && typeof mod.default === 'object') {
          // record형: { [id]: entry }
          resolved = (mod.default as Record<string, GlossaryEntry>)[termId] ?? null;
        }
        if (mounted) setEntry(resolved ?? 'missing');
      } catch {
        // fixture 미존재 — fallback 처리
        if (mounted) setEntry('missing');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [open, termId, entry]);

  // outside click 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (triggerRef.current && triggerRef.current.contains(e.target as Node)) return;
      const popover = document.getElementById(`wm-glossary-${termId}`);
      if (popover && popover.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [open, termId]);

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-label={`Definition of ${termId}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          marginLeft: 2,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-gold)',
        }}
      >
        {children ?? <Info size={14} strokeWidth={1.75} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`wm-glossary-${termId}`}
            role="tooltip"
            initial={{ opacity: 0, y: placement === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: placement === 'top' ? 4 : -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              ...(placement === 'top' ? { bottom: 'calc(100% + 8px)' } : { top: 'calc(100% + 8px)' }),
              left: 0,
              maxWidth: 280,
              width: 'max-content',
              minWidth: 200,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 12,
              padding: 14,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              zIndex: 60,
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-inter)',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 20,
                height: 20,
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={14} strokeWidth={1.75} />
            </button>

            {entry == null && (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>...</p>
            )}
            {entry === 'missing' && (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
                glossary entry not loaded
              </p>
            )}
            {entry && entry !== 'missing' && (
              <>
                <LocaleText
                  value={entry.term}
                  as="strong"
                  className="wm-glossary-term"
                />
                <LocaleText
                  value={entry.definition}
                  as="p"
                  className="wm-glossary-def"
                />
                <Link
                  href={`/glossary/${termId}` as Route}
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    fontSize: 12,
                    color: 'var(--color-gold)',
                    textDecoration: 'none',
                  }}
                >
                  Learn more →
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
