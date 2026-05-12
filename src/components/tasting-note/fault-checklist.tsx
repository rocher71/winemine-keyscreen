'use client';

/**
 * FaultChecklist — 11종 결함 카드 그리드.
 * handover doc §5.4.
 *
 * 정책: 사용자 명시 클릭만 기록. 자동 추론 금지.
 * 각 카드는 cause / threshold / aroma 3줄.
 */

import { useState } from 'react';
import { FAULTS, type Fault } from '@/lib/tasting-note-lexicon';
import { useLocale } from '@/context/locale-context';
import { GlossaryTooltip } from '@/components/glossary/glossary-tooltip';

export interface FaultChecklistProps {
  selected: Fault[];
  onToggle: (id: Fault) => void;
}

const FAULT_TO_GLOSSARY: Partial<Record<Fault, string>> = {
  brett: 'brett',
  corked: 'bouchonne',
};

export function FaultChecklist({ selected, onToggle }: FaultChecklistProps) {
  const { locale } = useLocale();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? FAULTS : FAULTS.slice(0, 4);

  return (
    <section className="wm-fault-checklist">
      <header style={{ marginBottom: 12 }}>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--color-cream)',
            letterSpacing: '-0.01em',
          }}
        >
          {locale === 'ko' ? '결함 점검' : 'Fault check'}
        </h3>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 13,
            color: 'var(--color-muted)',
            lineHeight: 1.5,
          }}
        >
          {locale === 'ko'
            ? '명시적으로 체크한 항목만 기록됩니다 — 자동 추론하지 않습니다.'
            : 'Only explicit checks are recorded — never inferred.'}
        </p>
      </header>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 10,
        }}
      >
        {visible.map((fault) => {
          const isOn = selected.includes(fault.id);
          const glossaryId = FAULT_TO_GLOSSARY[fault.id];
          return (
            <li key={fault.id}>
              <button
                type="button"
                onClick={() => onToggle(fault.id)}
                aria-pressed={isOn}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: isOn ? 'rgba(139,26,42,0.20)' : 'var(--color-surface)',
                  border: `1px solid ${isOn ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
                  borderRadius: 12,
                  padding: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  transition: 'all 160ms ease',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isOn ? 'var(--color-wine-red-hover, #A02030)' : 'var(--color-cream)',
                    }}
                  >
                    {locale === 'ko' ? fault.ko : fault.en}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `1.5px solid ${isOn ? 'var(--color-wine-red)' : 'var(--color-muted)'}`,
                      background: isOn ? 'var(--color-wine-red)' : 'transparent',
                      color: 'var(--color-cream)',
                      fontSize: 11,
                      lineHeight: '14px',
                      textAlign: 'center',
                    }}
                  >
                    {isOn ? '✓' : ''}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--color-secondary)',
                    lineHeight: 1.45,
                    display: 'grid',
                    gap: 3,
                  }}
                >
                  <span>
                    <strong style={{ color: 'var(--color-gold)' }}>
                      {locale === 'ko' ? '원인' : 'Cause'}
                    </strong>
                    : {fault.cause}
                  </span>
                  <span>
                    <strong style={{ color: 'var(--color-gold)' }}>
                      {locale === 'ko' ? '역치' : 'Threshold'}
                    </strong>
                    : {fault.threshold}
                  </span>
                  <span>
                    <strong style={{ color: 'var(--color-gold)' }}>
                      {locale === 'ko' ? '향' : 'Aroma'}
                    </strong>
                    : {fault.aroma}
                  </span>
                </div>
                {glossaryId ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <GlossaryTooltip termId={glossaryId} />
                  </div>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {!expanded && FAULTS.length > 4 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          style={{
            marginTop: 10,
            background: 'transparent',
            border: '1px solid var(--color-border)',
            color: 'var(--color-cream)',
            borderRadius: 999,
            padding: '6px 14px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {locale === 'ko'
            ? `+${FAULTS.length - 4}개 결함 더 보기`
            : `Show ${FAULTS.length - 4} more faults`}
        </button>
      ) : null}
    </section>
  );
}
