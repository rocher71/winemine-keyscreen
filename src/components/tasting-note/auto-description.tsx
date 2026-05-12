'use client';

/**
 * AutoDescription — 골드 박스 자동 묘사 문장.
 * handover doc §5.6.
 *
 * - 200ms debounce 후 `buildSentence()` 실행
 * - Playfair italic 17px Gold 박스
 * - DESCRIPTION_TEMPLATES 활용 (ko/en)
 */

import { useEffect, useMemo, useState } from 'react';
import {
  DESCRIPTION_TEMPLATES,
  LEX_BY_ID,
  TANNIN_INTENSITY_LABELS,
  TANNIN_TEXTURE_LABELS,
  DOSAGE_LABELS,
  FINISH_LENGTH_LABELS,
  WSET_LABELS_KO,
  WSET_LABELS_EN,
  caudalieCategory,
  type FormVariant,
  type EvolutionPoint,
  type TanninTexture,
  type SparklingDosage,
  type BubbleSize,
  type BubblePersistence,
  type MousseTexture,
  type WSETScale,
} from '@/lib/tasting-note-lexicon';
import type { Locale } from '@/types';
import { useLocale } from '@/context/locale-context';

export interface AutoDescriptionMeta {
  vintage: number | null;
  producer: string;
  region: string;
  wineName: string;
  grapeVarieties: string[];
}

export interface AutoDescriptionAroma {
  intensity: WSETScale;
  selected: string[]; // lex ids
}

export interface AutoDescriptionPalate {
  sweetness: WSETScale;
  acidity: WSETScale;
  body: WSETScale;
  alcohol: WSETScale;
  tannin?: { intensity: WSETScale; texture: TanninTexture };
  bubbles?: {
    size: BubbleSize;
    persistence: BubblePersistence;
    mousse: MousseTexture;
  };
  dosage?: SparklingDosage;
}

export interface AutoDescriptionFinish {
  caudalies: number;
}

export interface AutoDescriptionEvolution {
  peak: EvolutionPoint | null;
}

export interface AutoDescriptionProps {
  variant: FormVariant;
  meta: AutoDescriptionMeta;
  aroma: AutoDescriptionAroma;
  palate: AutoDescriptionPalate;
  finish: AutoDescriptionFinish;
  rating: number;
  evolution?: AutoDescriptionEvolution;
  /** "노트 저장" CTA — 옵션 */
  onCTA?: () => void;
}

function fmt(template: string, dict: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in dict ? dict[k] : `{${k}}`));
}

function lexNames(ids: string[], locale: Locale, n = 3): string[] {
  return ids
    .slice(0, n)
    .map((id) => LEX_BY_ID[id])
    .filter(Boolean)
    .map((e) => (locale === 'ko' ? e.ko : e.en));
}

function wsetLabel(scale: WSETScale, locale: Locale) {
  return (locale === 'ko' ? WSET_LABELS_KO : WSET_LABELS_EN)[scale];
}

export function buildSentence(
  props: Pick<AutoDescriptionProps, 'variant' | 'meta' | 'aroma' | 'palate' | 'finish' | 'rating' | 'evolution'>,
  locale: Locale,
): string {
  const { variant, meta, aroma, palate, finish, rating, evolution } = props;
  const t = DESCRIPTION_TEMPLATES[locale];

  // Placeholder fallback
  if (!aroma.selected.length && finish.caudalies === 0 && rating === 0) {
    return t.placeholder;
  }

  const primaries = lexNames(aroma.selected, locale, 2);
  const secondaries = lexNames(aroma.selected.slice(2), locale, 2);
  const intensity = wsetLabel(aroma.intensity, locale);

  const introTpl = meta.vintage == null ? t.introNV : t.intro;
  const intro = fmt(introTpl, {
    vintage: String(meta.vintage ?? ''),
    region: meta.region || (locale === 'ko' ? '미지' : 'Unknown'),
    producer: meta.producer || (locale === 'ko' ? '미상' : 'Unknown'),
    wineName: meta.wineName || (locale === 'ko' ? '와인' : 'wine'),
  });

  const aromaSentence = fmt(t.aroma, {
    intensity,
    primary: primaries.join(', ') || (locale === 'ko' ? '잔잔한 향' : 'subtle aromas'),
    secondary: secondaries.join(', ') || (locale === 'ko' ? '은은한 여운' : 'delicate undertones'),
  });

  const palateSentence = fmt(t.palate, {
    body: wsetLabel(palate.body, locale),
    acidity: wsetLabel(palate.acidity, locale),
    sweetness: wsetLabel(palate.sweetness, locale),
  });

  const parts = [intro, aromaSentence, palateSentence];

  if (variant === 'red' && palate.tannin) {
    parts.push(
      fmt(t.redTannin, {
        tanninIntensity: TANNIN_INTENSITY_LABELS[palate.tannin.intensity][locale],
        tanninTexture: TANNIN_TEXTURE_LABELS[palate.tannin.texture][locale],
      }),
    );
  }

  if (variant === 'sparkling' && palate.bubbles && props.palate.dosage) {
    parts.push(
      fmt(t.sparkling, {
        bubbleSize: palate.bubbles.size,
        bubblePersistence: palate.bubbles.persistence,
        mousse: palate.bubbles.mousse,
        dosage: DOSAGE_LABELS[props.palate.dosage][locale],
      }),
    );
  }

  if (finish.caudalies > 0) {
    const cat = caudalieCategory(finish.caudalies);
    parts.push(
      fmt(t.finish, {
        caudalies: String(finish.caudalies),
        finishLength: FINISH_LENGTH_LABELS[cat][locale],
        finishQuality: '',
      }),
    );
  } else {
    parts.push(t.finishNoCaudalie);
  }

  if (evolution?.peak) {
    parts.push(
      fmt(t.evolution, {
        peakLabel: `${evolution.peak.minutesAfterOpen}분`,
        firstChange:
          evolution.peak.aromaIntensityDelta > 0
            ? locale === 'ko'
              ? '향이 활짝 피어남'
              : 'aromas open up'
            : '',
        newAromas: lexNames(evolution.peak.newAromasEmerged ?? [], locale, 2).join(', '),
      }),
    );
  }

  if (rating > 0) {
    parts.push(fmt(t.rating, { rating: String(rating) }));
  }

  return parts.filter(Boolean).join(' ');
}

export function AutoDescription(props: AutoDescriptionProps) {
  const { locale } = useLocale();
  const [text, setText] = useState<string>(() => buildSentence(props, locale));

  // 200ms debounce
  useEffect(() => {
    const handle = window.setTimeout(() => {
      setText(buildSentence(props, locale));
    }, 200);
    return () => window.clearTimeout(handle);
  }, [props, locale]);

  const placeholder = useMemo(
    () => DESCRIPTION_TEMPLATES[locale].placeholder,
    [locale],
  );

  return (
    <section
      style={{
        background:
          'linear-gradient(135deg, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.04) 100%)',
        border: '1px solid rgba(201,168,76,0.35)',
        borderRadius: 14,
        padding: 16,
        position: 'relative',
        minHeight: 80,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
          marginBottom: 6,
        }}
      >
        {locale === 'ko' ? '자동 묘사' : 'Auto description'}
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--font-playfair)',
          fontStyle: 'italic',
          fontSize: 17,
          lineHeight: 1.6,
          color: 'var(--color-cream)',
        }}
      >
        {text || placeholder}
      </p>
      {props.onCTA ? (
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            onClick={props.onCTA}
            style={{
              background: 'var(--color-wine-red)',
              border: 0,
              color: 'var(--color-cream)',
              padding: '8px 16px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {locale === 'ko' ? '노트 저장' : 'Save note'}
          </button>
        </div>
      ) : null}
    </section>
  );
}
