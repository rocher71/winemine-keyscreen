'use client';

/**
 * CaudalieMeter — 220px 원형 progress ring + 중앙 큰 숫자.
 * handover doc §5.3.
 *
 * - Tap to start → Tap to stop (toggle)
 * - `requestAnimationFrame`으로 1초당 1 카운트
 * - 30초까지만 ring 진행, 그 이상은 카운트만 증가
 * - Reset 별도 버튼
 * - 정지 시 caudalieCategory + caudalieComparison 비교 카피
 * - 우상단 (i) GlossaryTooltip "caudalie"
 */

import { useEffect, useRef, useState } from 'react';
import {
  caudalieCategory,
  caudalieComparison,
  FINISH_LENGTH_LABELS,
} from '@/lib/tasting-note-lexicon';
import { useLocale } from '@/context/locale-context';
import { GlossaryTooltip } from '@/components/glossary/glossary-tooltip';

export interface CaudalieMeterProps {
  caudalies: number;
  onChange: (next: number) => void;
}

const RING_MAX = 30;
const RING_SIZE = 220;
const STROKE = 12;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CaudalieMeter({ caudalies, onChange }: CaudalieMeterProps) {
  const { locale } = useLocale();
  const [running, setRunning] = useState(false);
  const startRef = useRef<number | null>(null);
  const baseRef = useRef<number>(caudalies);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    baseRef.current = caudalies;

    function tick(now: number) {
      if (!startRef.current) return;
      const elapsed = (now - startRef.current) / 1000;
      const next = Math.floor(baseRef.current + elapsed);
      if (next !== caudalies) onChange(next);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // we intentionally only want to start/stop loop with `running`; caudalies updates inside loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const ratio = Math.min(caudalies, RING_MAX) / RING_MAX;
  const dashOffset = CIRCUMFERENCE * (1 - ratio);
  const category = caudalieCategory(caudalies);

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--color-cream)',
          }}
        >
          {locale === 'ko' ? '피니시 — 카우달리' : 'Finish — Caudalie'}
        </h3>
        <GlossaryTooltip termId="caudalie" />
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          style={{
            position: 'relative',
            width: RING_SIZE,
            height: RING_SIZE,
            borderRadius: '50%',
            border: 0,
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label={running ? 'Tap to stop' : 'Tap to start'}
        >
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
            aria-hidden
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={STROKE}
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: running ? 'none' : 'stroke-dashoffset 280ms ease-out' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-cream)',
              gap: 2,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 60,
                lineHeight: 1,
                fontWeight: 600,
                color: 'var(--color-gold)',
              }}
            >
              {caudalies}
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              {locale === 'ko' ? `${running ? '정지' : '시작'}하려면 탭` : `Tap to ${running ? 'stop' : 'start'}`}
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-secondary)' }}>
              caudalies
            </span>
          </div>
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              onChange(0);
            }}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-secondary)',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {locale === 'ko' ? '리셋' : 'Reset'}
          </button>
        </div>
      </div>

      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: 12,
          color: 'var(--color-secondary)',
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <div style={{ color: 'var(--color-gold)', fontWeight: 600, marginBottom: 4 }}>
          {FINISH_LENGTH_LABELS[category][locale]}{' '}
          <span style={{ opacity: 0.7, fontSize: 11 }}>({FINISH_LENGTH_LABELS[category].range})</span>
        </div>
        <div>{caudalieComparison(caudalies, locale)}</div>
      </div>
    </section>
  );
}
