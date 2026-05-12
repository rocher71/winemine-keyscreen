'use client';

/**
 * TanninPanel — Red 양식 전용 타닌 패널.
 * handover doc §5.8.
 *
 * - 강도 (`WSETSlider`)
 * - 21 texture 칩 × 4 그룹 (soft / fine / grippy / harsh)
 * - 성숙도 3택 (ripe / unripe / overripe)
 */

import { WSETSlider } from './wset-slider';
import {
  TANNIN_INTENSITY_LABELS,
  TANNIN_TEXTURE_LABELS,
  TANNIN_TEXTURE_GROUP_LABELS,
  type TanninTexture,
  type TanninTextureGroup,
} from '@/lib/tasting-note-lexicon';
import type { WSETScale } from '@/lib/tasting-note-lexicon';
import { useLocale } from '@/context/locale-context';

export interface TanninPanelState {
  intensity: WSETScale;
  texture: TanninTexture;
  ripeness: 'ripe' | 'unripe' | 'overripe';
}

export interface TanninPanelProps {
  state: TanninPanelState;
  onChange: (next: TanninPanelState) => void;
}

const GROUPS: Record<TanninTextureGroup, TanninTexture[]> = {
  soft: ['silky', 'velvety', 'smooth', 'plush', 'soft', 'round'],
  fine: ['fineGrained', 'polished', 'powdery', 'dusty', 'chalky'],
  grippy: ['grainy', 'grippy', 'firm', 'chewy'],
  harsh: ['coarse', 'rough', 'harsh', 'astringent', 'drying', 'aggressive'],
};

const RIPENESS_OPTIONS: { id: TanninPanelState['ripeness']; ko: string; en: string }[] = [
  { id: 'unripe', ko: '미숙', en: 'Unripe' },
  { id: 'ripe', ko: '잘 익음', en: 'Ripe' },
  { id: 'overripe', ko: '과숙', en: 'Overripe' },
];

export function TanninPanel({ state, onChange }: TanninPanelProps) {
  const { locale } = useLocale();

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
        {locale === 'ko' ? '타닌' : 'Tannin'}
      </h3>

      <WSETSlider
        labelText={locale === 'ko' ? '타닌 강도' : 'Tannin intensity'}
        value={state.intensity}
        onChange={(v) => onChange({ ...state, intensity: v })}
        labels={TANNIN_INTENSITY_LABELS}
      />

      <div>
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-cream)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          {locale === 'ko' ? '타닌 질감' : 'Tannin texture'}
        </p>
        <div style={{ display: 'grid', gap: 10 }}>
          {(Object.keys(GROUPS) as TanninTextureGroup[]).map((group) => (
            <div key={group}>
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
                {TANNIN_TEXTURE_GROUP_LABELS[group][locale]}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {GROUPS[group].map((tex) => {
                  const active = state.texture === tex;
                  return (
                    <button
                      key={tex}
                      type="button"
                      onClick={() => onChange({ ...state, texture: tex })}
                      style={{
                        background: active ? 'var(--color-wine-red)' : 'transparent',
                        border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
                        color: active ? 'var(--color-cream)' : 'var(--color-secondary)',
                        padding: '5px 12px',
                        borderRadius: 999,
                        fontSize: 12,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                      aria-pressed={active}
                    >
                      {TANNIN_TEXTURE_LABELS[tex][locale]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p
          style={{
            margin: '0 0 6px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-cream)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          {locale === 'ko' ? '타닌 성숙도' : 'Tannin ripeness'}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {RIPENESS_OPTIONS.map((opt) => {
            const active = state.ripeness === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ ...state, ripeness: opt.id })}
                style={{
                  flex: 1,
                  background: active ? 'var(--color-wine-red)' : 'var(--color-surface)',
                  border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
                  color: active ? 'var(--color-cream)' : 'var(--color-secondary)',
                  padding: '10px 12px',
                  borderRadius: 10,
                  fontSize: 13,
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
    </section>
  );
}
