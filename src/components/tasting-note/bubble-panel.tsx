'use client';

/**
 * BubblePanel — Sparkling 양식 전용 기포 패널.
 * handover doc §5.8.
 *
 * 5축: size / persistence / mousse / pressure / method
 * 별도 EU 도사주 7택 (`onDosage`).
 */

import {
  DOSAGE_LABELS,
  SPARKLING_METHOD_LABELS,
  type BubbleSize,
  type BubblePersistence,
  type MousseTexture,
  type SparklingMethod,
  type SparklingDosage,
} from '@/lib/tasting-note-lexicon';
import { useLocale } from '@/context/locale-context';

export interface BubblePanelState {
  size: BubbleSize;
  persistence: BubblePersistence;
  mousse: MousseTexture;
  /** 1~6 bar */
  pressure: number;
  method: SparklingMethod;
}

export interface BubblePanelProps {
  bubbles: BubblePanelState;
  dosage: SparklingDosage;
  onBubbles: (next: BubblePanelState) => void;
  onDosage: (next: SparklingDosage) => void;
}

const SIZE_OPTIONS: { id: BubbleSize; ko: string; en: string }[] = [
  { id: 'fine', ko: '미세', en: 'Fine' },
  { id: 'medium', ko: '중간', en: 'Medium' },
  { id: 'coarse', ko: '거친', en: 'Coarse' },
];

const PERSISTENCE_OPTIONS: { id: BubblePersistence; ko: string; en: string }[] = [
  { id: 'fleeting', ko: '금방 사라짐', en: 'Fleeting' },
  { id: 'steady', ko: '안정적', en: 'Steady' },
  { id: 'persistent', ko: '지속적', en: 'Persistent' },
  { id: 'continuous', ko: '끊임없음', en: 'Continuous' },
];

const MOUSSE_OPTIONS: { id: MousseTexture; ko: string; en: string }[] = [
  { id: 'creamy', ko: '크리미', en: 'Creamy' },
  { id: 'silky', ko: '실키', en: 'Silky' },
  { id: 'frothy', ko: '거품 많음', en: 'Frothy' },
  { id: 'soft', ko: '부드러움', en: 'Soft' },
  { id: 'aggressive', ko: '공격적', en: 'Aggressive' },
];

const METHOD_OPTIONS: SparklingMethod[] = [
  'traditional',
  'charmat',
  'asti',
  'ancestral',
  'unknown',
];

const DOSAGE_OPTIONS: SparklingDosage[] = [
  'brutNature',
  'extraBrut',
  'brut',
  'extraDry',
  'sec',
  'demiSec',
  'doux',
];

export function BubblePanel({ bubbles, dosage, onBubbles, onDosage }: BubblePanelProps) {
  const { locale } = useLocale();

  function renderChips<T extends string>(
    title: string,
    options: { id: T; ko: string; en: string }[],
    current: T,
    onSet: (id: T) => void,
  ) {
    return (
      <div>
        <span
          style={{
            fontSize: 11,
            color: 'var(--color-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'block',
            marginBottom: 4,
          }}
        >
          {title}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {options.map((opt) => {
            const active = current === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSet(opt.id)}
                style={{
                  background: active ? 'var(--color-wine-red)' : 'transparent',
                  border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
                  color: active ? 'var(--color-cream)' : 'var(--color-secondary)',
                  padding: '5px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
                aria-pressed={active}
              >
                {locale === 'ko' ? opt.ko : opt.en}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section style={{ display: 'grid', gap: 14 }}>
      <h3
        style={{
          margin: 0,
          fontFamily: 'var(--font-playfair)',
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--color-cream)',
        }}
      >
        {locale === 'ko' ? '기포' : 'Bubbles'}
      </h3>

      {renderChips(
        locale === 'ko' ? '기포 크기' : 'Bubble size',
        SIZE_OPTIONS,
        bubbles.size,
        (id) => onBubbles({ ...bubbles, size: id }),
      )}
      {renderChips(
        locale === 'ko' ? '지속성' : 'Persistence',
        PERSISTENCE_OPTIONS,
        bubbles.persistence,
        (id) => onBubbles({ ...bubbles, persistence: id }),
      )}
      {renderChips(
        locale === 'ko' ? '무쎄 질감' : 'Mousse texture',
        MOUSSE_OPTIONS,
        bubbles.mousse,
        (id) => onBubbles({ ...bubbles, mousse: id }),
      )}

      <div>
        <span
          style={{
            fontSize: 11,
            color: 'var(--color-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'block',
            marginBottom: 4,
          }}
        >
          {locale === 'ko' ? `압력 (${bubbles.pressure} bar)` : `Pressure (${bubbles.pressure} bar)`}
        </span>
        <input
          type="range"
          min={1}
          max={6}
          step={0.5}
          value={bubbles.pressure}
          onChange={(e) => onBubbles({ ...bubbles, pressure: Number(e.target.value) })}
          style={{ width: '100%', accentColor: 'var(--color-gold)' }}
        />
      </div>

      <div>
        <span
          style={{
            fontSize: 11,
            color: 'var(--color-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'block',
            marginBottom: 4,
          }}
        >
          {locale === 'ko' ? '제조 방식' : 'Method'}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {METHOD_OPTIONS.map((m) => {
            const active = bubbles.method === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onBubbles({ ...bubbles, method: m })}
                style={{
                  background: active ? 'var(--color-wine-red)' : 'transparent',
                  border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
                  color: active ? 'var(--color-cream)' : 'var(--color-secondary)',
                  padding: '5px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
                aria-pressed={active}
                title={SPARKLING_METHOD_LABELS[m].note}
              >
                {SPARKLING_METHOD_LABELS[m][locale]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span
          style={{
            fontSize: 11,
            color: 'var(--color-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'block',
            marginBottom: 4,
          }}
        >
          {locale === 'ko' ? '도사주 (EU 607/2009)' : 'Dosage (EU 607/2009)'}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {DOSAGE_OPTIONS.map((d) => {
            const active = dosage === d;
            const label = DOSAGE_LABELS[d];
            return (
              <button
                key={d}
                type="button"
                onClick={() => onDosage(d)}
                style={{
                  background: active ? 'var(--color-wine-red)' : 'transparent',
                  border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
                  color: active ? 'var(--color-cream)' : 'var(--color-secondary)',
                  padding: '5px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  lineHeight: 1.2,
                }}
                aria-pressed={active}
              >
                <span>{label[locale]}</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>{label.range}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
