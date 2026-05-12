'use client';

/**
 * note-write-expert.tsx — 전문가 모드 작성 컨테이너.
 *
 * - variant tabs: white / red / sparkling / blind
 * - variant === 'blind' → `<BlindMode />` 단독 + 정답 prop 외부 주입
 * - 그 외 → Step 1~7 세로 흐름
 * - useReducer로 모든 입력 보유 (servingTempCelsius / peakEstimate* 신규 필드 포함)
 * - 저장 시 +XP 토스트 (variant·photo·price·peakEstimate 합산) → 1초 후 router.back()
 */

import { useEffect, useMemo, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WSETSlider } from './wset-slider';
import { AromaWheel } from './aroma-wheel';
import { CaudalieMeter } from './caudalie-meter';
import { FaultChecklist } from './fault-checklist';
import { OpeningTimeline } from './opening-timeline';
import { AutoDescription } from './auto-description';
import { BlindMode, type BlindCorrectAnswer } from './blind-mode';
import { TanninPanel } from './tannin-panel';
import { BubblePanel } from './bubble-panel';
import { ServingTempInput } from './serving-temp-input';
import { PeakEtaInput } from './peak-eta-input';
import { RegionalAromaHints } from './regional-aroma-hints';
import { PriceCapture } from './note-write-beginner';
import { GlossaryTooltip } from '@/components/glossary/glossary-tooltip';
import { useLocale } from '@/context/locale-context';
import { toast } from '@/hooks/use-toast';
import { XP_ACTIONS } from '@/lib/xp';
import {
  SWEETNESS_LABELS,
  ACIDITY_LABELS,
  BODY_LABELS,
  ALCOHOL_LABELS,
  WSET_LABELS_KO,
  type EvolutionPoint,
  type FormVariant,
  type Fault,
  type WSETScale,
  type TanninTexture,
  type BubbleSize,
  type BubblePersistence,
  type MousseTexture,
  type SparklingMethod,
  type SparklingDosage,
} from '@/lib/tasting-note-lexicon';
import type { ConfidenceLevel, LocalizedString, Wine } from '@/types';

/* ──────────────────────────────── State ──────────────────────────────── */

interface State {
  variant: FormVariant;
  meta: {
    vintage: number | null;
    producer: string;
    region: string;
    wineName: string;
    grapeVarieties: string[];
  };
  aromaIntensity: WSETScale;
  aromaSelected: string[];
  sweetness: WSETScale;
  acidity: WSETScale;
  body: WSETScale;
  alcohol: WSETScale;
  flavorIntensity: WSETScale;
  flavorNotes: string;
  tannin: { intensity: WSETScale; texture: TanninTexture; ripeness: 'ripe' | 'unripe' | 'overripe' };
  bubbles: {
    size: BubbleSize;
    persistence: BubblePersistence;
    mousse: MousseTexture;
    pressure: number;
    method: SparklingMethod;
  };
  dosage: SparklingDosage;
  caudalies: number;
  faults: Fault[];
  evolution: {
    openedAt: string | null;
    decanted: boolean;
    timepoints: EvolutionPoint[];
    peakIndex: number | null;
  };
  rating: number;
  wouldBuyAgain: boolean;
  /** NEW — 시음 온도 */
  servingTempCelsius: number | null;
  /** NEW — peak ETA */
  peakEstimateYearsToPeak: number | null;
  peakEstimateConfidence: ConfidenceLevel | null;
  peakEstimateNote: LocalizedString | null;
  /** sticky: photo attach */
  photoAttached: boolean;
}

type Action =
  | { type: 'SET_VARIANT'; value: FormVariant }
  | { type: 'SET_AROMA_INTENSITY'; value: WSETScale }
  | { type: 'TOGGLE_AROMA'; lexId: string }
  | { type: 'ADD_AROMA'; lexId: string }
  | { type: 'SET_PALATE'; key: 'sweetness' | 'acidity' | 'body' | 'alcohol' | 'flavorIntensity'; value: WSETScale }
  | { type: 'SET_FLAVOR_NOTES'; value: string }
  | { type: 'SET_TANNIN'; value: State['tannin'] }
  | { type: 'SET_BUBBLES'; value: State['bubbles'] }
  | { type: 'SET_DOSAGE'; value: SparklingDosage }
  | { type: 'SET_CAUDALIES'; value: number }
  | { type: 'TOGGLE_FAULT'; id: Fault }
  | { type: 'SET_OPENED_AT'; value: string | null }
  | { type: 'SET_DECANT'; value: boolean }
  | { type: 'UPSERT_EVOLUTION'; tp: EvolutionPoint }
  | { type: 'SET_PEAK'; idx: number | null }
  | { type: 'SET_RATING'; value: number }
  | { type: 'SET_WOULD_BUY'; value: boolean }
  | { type: 'SET_SERVING_TEMP'; value: number | null }
  | { type: 'SET_PEAK_YEARS'; value: number | null }
  | { type: 'SET_PEAK_CONF'; value: ConfidenceLevel }
  | { type: 'SET_PEAK_NOTE'; value: LocalizedString | null }
  | { type: 'SET_PHOTO'; value: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_VARIANT':
      return { ...state, variant: action.value };
    case 'SET_AROMA_INTENSITY':
      return { ...state, aromaIntensity: action.value };
    case 'TOGGLE_AROMA':
      return {
        ...state,
        aromaSelected: state.aromaSelected.includes(action.lexId)
          ? state.aromaSelected.filter((id) => id !== action.lexId)
          : [...state.aromaSelected, action.lexId],
      };
    case 'ADD_AROMA':
      return state.aromaSelected.includes(action.lexId)
        ? state
        : { ...state, aromaSelected: [...state.aromaSelected, action.lexId] };
    case 'SET_PALATE':
      return { ...state, [action.key]: action.value };
    case 'SET_FLAVOR_NOTES':
      return { ...state, flavorNotes: action.value };
    case 'SET_TANNIN':
      return { ...state, tannin: action.value };
    case 'SET_BUBBLES':
      return { ...state, bubbles: action.value };
    case 'SET_DOSAGE':
      return { ...state, dosage: action.value };
    case 'SET_CAUDALIES':
      return { ...state, caudalies: action.value };
    case 'TOGGLE_FAULT':
      return {
        ...state,
        faults: state.faults.includes(action.id)
          ? state.faults.filter((f) => f !== action.id)
          : [...state.faults, action.id],
      };
    case 'SET_OPENED_AT':
      return { ...state, evolution: { ...state.evolution, openedAt: action.value } };
    case 'SET_DECANT':
      return { ...state, evolution: { ...state.evolution, decanted: action.value } };
    case 'UPSERT_EVOLUTION': {
      const idx = state.evolution.timepoints.findIndex(
        (tp) => tp.minutesAfterOpen === action.tp.minutesAfterOpen,
      );
      const next =
        idx >= 0
          ? state.evolution.timepoints.map((tp, i) => (i === idx ? action.tp : tp))
          : [...state.evolution.timepoints, action.tp];
      return { ...state, evolution: { ...state.evolution, timepoints: next } };
    }
    case 'SET_PEAK':
      return { ...state, evolution: { ...state.evolution, peakIndex: action.idx } };
    case 'SET_RATING':
      return { ...state, rating: action.value };
    case 'SET_WOULD_BUY':
      return { ...state, wouldBuyAgain: action.value };
    case 'SET_SERVING_TEMP':
      return { ...state, servingTempCelsius: action.value };
    case 'SET_PEAK_YEARS':
      return { ...state, peakEstimateYearsToPeak: action.value };
    case 'SET_PEAK_CONF':
      return { ...state, peakEstimateConfidence: action.value };
    case 'SET_PEAK_NOTE':
      return { ...state, peakEstimateNote: action.value };
    case 'SET_PHOTO':
      return { ...state, photoAttached: action.value };
    default:
      return state;
  }
}

function initialState(variant: FormVariant, wine: Wine | null): State {
  return {
    variant,
    meta: {
      vintage: wine?.vintage ?? null,
      producer: wine?.producer.ko ?? '',
      region: wine?.region.ko ?? '',
      wineName: wine?.name ?? '',
      grapeVarieties: wine?.grapes.map((g) => g.ko) ?? [],
    },
    aromaIntensity: 'medium',
    aromaSelected: [],
    sweetness: 'medium',
    acidity: 'medium',
    body: 'medium',
    alcohol: 'medium',
    flavorIntensity: 'medium',
    flavorNotes: '',
    tannin: { intensity: 'medium', texture: 'soft', ripeness: 'ripe' },
    bubbles: { size: 'fine', persistence: 'persistent', mousse: 'creamy', pressure: 5, method: 'traditional' },
    dosage: 'brut',
    caudalies: 0,
    faults: [],
    evolution: { openedAt: null, decanted: false, timepoints: [], peakIndex: null },
    rating: 0,
    wouldBuyAgain: false,
    servingTempCelsius: null,
    peakEstimateYearsToPeak: null,
    peakEstimateConfidence: null,
    peakEstimateNote: null,
    photoAttached: false,
  };
}

/* ──────────────────────────── Component ──────────────────────────── */

export interface NoteWriteExpertProps {
  initialVariant: FormVariant;
  wine: Wine | null;
  /** L1~L5 — peak ETA L3+ 가드용 */
  userLevelId: number;
  /** Blind 모드 정답 — wine prop이 있으면 자동 생성 가능하지만 명시 prop 우선 */
  blindAnswer?: BlindCorrectAnswer | null;
}

export function NoteWriteExpert({
  initialVariant,
  wine,
  userLevelId,
  blindAnswer = null,
}: NoteWriteExpertProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState(initialVariant, wine));
  const [priceCapture, setPriceCapture] = useState(false);
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (initialVariant !== state.variant) {
      dispatch({ type: 'SET_VARIANT', value: initialVariant });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialVariant]);

  const wsetLabel = useMemo(
    () => (locale === 'ko' ? WSET_LABELS_KO : WSET_LABELS_KO),
    [locale],
  );
  void wsetLabel; // referenced only for shape; WSETSlider does locale-aware mapping internally

  function handleSave() {
    let xp = state.variant === 'blind' ? XP_ACTIONS.expertBlindNote : XP_ACTIONS.expertNote;
    if (state.photoAttached) xp += XP_ACTIONS.photoAttach;
    if (priceCapture && price.trim()) xp += XP_ACTIONS.priceAdd;
    if (state.peakEstimateYearsToPeak != null && userLevelId >= 3) xp += XP_ACTIONS.peakEstimate;
    toast({
      variant: 'xp',
      xp,
      message: {
        ko: `전문가 노트 +${xp} XP`,
        en: `Expert note +${xp} XP`,
      },
    });
    window.setTimeout(() => router.back(), 1000);
  }

  // Effective answer for Blind mode
  const effectiveBlindAnswer: BlindCorrectAnswer | null = useMemo(() => {
    if (blindAnswer) return blindAnswer;
    if (!wine) return null;
    return {
      grape: wine.grapes[0]?.en ?? wine.grapes[0]?.ko ?? '',
      region: wine.region.en ?? wine.region.ko ?? '',
      vintage: wine.vintage,
      priceRangeKrw: {
        min: Math.round(wine.averagePriceKrw * 0.7),
        max: Math.round(wine.averagePriceKrw * 1.3),
      },
    };
  }, [blindAnswer, wine]);

  return (
    <div style={{ display: 'grid', gap: 18, padding: '16px 16px 96px' }}>
      {/* Variant tabs */}
      <VariantTabs current={state.variant} onChange={(v) => dispatch({ type: 'SET_VARIANT', value: v })} />

      {state.variant === 'blind' ? (
        <BlindMode correctAnswer={effectiveBlindAnswer} onCTA={handleSave} />
      ) : (
        <>
          {/* Step 1 — Capture */}
          <StepHeader number={1} title={locale === 'ko' ? '라벨 인식 / 메타' : 'Capture'} />
          <WineMetaCard
            wineName={state.meta.wineName}
            producer={state.meta.producer}
            vintage={state.meta.vintage}
            region={state.meta.region}
          />
          <PhotoToggle
            on={state.photoAttached}
            onChange={(v) => dispatch({ type: 'SET_PHOTO', value: v })}
          />
          {wine ? (
            <ServingTempInput
              value={state.servingTempCelsius}
              onChange={(v) => dispatch({ type: 'SET_SERVING_TEMP', value: v })}
              recommended={wine.servingTempCelsius}
            />
          ) : null}

          {/* Step 2 — Aroma */}
          <StepHeader number={2} title={locale === 'ko' ? '아로마' : 'Aroma'} />
          <WSETSlider
            labelText={locale === 'ko' ? '향 강도' : 'Aroma intensity'}
            value={state.aromaIntensity}
            onChange={(v) => dispatch({ type: 'SET_AROMA_INTENSITY', value: v })}
            labels={ACIDITY_LABELS}
          />
          {wine ? (
            <RegionalAromaHints
              wine={wine}
              selected={state.aromaSelected}
              onToggle={(id) => dispatch({ type: 'ADD_AROMA', lexId: id })}
            />
          ) : null}
          <AromaWheel
            variant={state.variant}
            selected={state.aromaSelected}
            onToggle={(id) => dispatch({ type: 'TOGGLE_AROMA', lexId: id })}
          />

          {/* Step 3 — Palate */}
          <StepHeader number={3} title={locale === 'ko' ? '미각' : 'Palate'} />
          <WSETSlider
            labelText={locale === 'ko' ? '당도' : 'Sweetness'}
            value={state.sweetness}
            onChange={(v) => dispatch({ type: 'SET_PALATE', key: 'sweetness', value: v })}
            labels={SWEETNESS_LABELS}
          />
          <WSETSlider
            labelText={locale === 'ko' ? '산도' : 'Acidity'}
            value={state.acidity}
            onChange={(v) => dispatch({ type: 'SET_PALATE', key: 'acidity', value: v })}
            labels={ACIDITY_LABELS}
          />
          <WSETSlider
            labelText={locale === 'ko' ? '바디' : 'Body'}
            value={state.body}
            onChange={(v) => dispatch({ type: 'SET_PALATE', key: 'body', value: v })}
            labels={BODY_LABELS}
          />
          <WSETSlider
            labelText={locale === 'ko' ? '알코올' : 'Alcohol'}
            value={state.alcohol}
            onChange={(v) => dispatch({ type: 'SET_PALATE', key: 'alcohol', value: v })}
            labels={ALCOHOL_LABELS}
          />

          {state.variant === 'red' ? (
            <TanninPanel
              state={state.tannin}
              onChange={(v) => dispatch({ type: 'SET_TANNIN', value: v })}
            />
          ) : null}

          {state.variant === 'sparkling' ? (
            <BubblePanel
              bubbles={state.bubbles}
              dosage={state.dosage}
              onBubbles={(v) => dispatch({ type: 'SET_BUBBLES', value: v })}
              onDosage={(v) => dispatch({ type: 'SET_DOSAGE', value: v })}
            />
          ) : null}

          <WSETSlider
            labelText={locale === 'ko' ? '풍미 강도' : 'Flavor intensity'}
            value={state.flavorIntensity}
            onChange={(v) => dispatch({ type: 'SET_PALATE', key: 'flavorIntensity', value: v })}
            labels={ACIDITY_LABELS}
          />
          <textarea
            placeholder={locale === 'ko' ? '풍미 노트 (자유 입력)' : 'Flavor notes (free text)'}
            value={state.flavorNotes}
            onChange={(e) => dispatch({ type: 'SET_FLAVOR_NOTES', value: e.target.value })}
            rows={2}
            style={{
              background: 'var(--color-map-dark, #1A0A1E)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              color: 'var(--color-cream)',
              padding: '8px 10px',
              fontSize: 13,
              resize: 'vertical',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />

          {/* Step 4 — Finish */}
          <StepHeader number={4} title={locale === 'ko' ? '피니시' : 'Finish'} />
          <CaudalieMeter
            caudalies={state.caudalies}
            onChange={(v) => dispatch({ type: 'SET_CAUDALIES', value: v })}
          />

          {/* Step 5 — Faults */}
          <StepHeader number={5} title={locale === 'ko' ? '결함 점검' : 'Faults'} />
          <FaultChecklist
            selected={state.faults}
            onToggle={(id) => dispatch({ type: 'TOGGLE_FAULT', id })}
          />

          {/* Step 6 — Evolution */}
          <StepHeader number={6} title={locale === 'ko' ? '오프닝 타임라인' : 'Opening timeline'} />
          <OpeningTimeline
            variant={state.variant}
            meta={{
              vintage: state.meta.vintage,
              grapeVarieties: state.meta.grapeVarieties,
              region: state.meta.region,
            }}
            state={state.evolution}
            onOpenedAt={(v) => dispatch({ type: 'SET_OPENED_AT', value: v })}
            onDecant={(v) => dispatch({ type: 'SET_DECANT', value: v })}
            onUpsert={(tp) => dispatch({ type: 'UPSERT_EVOLUTION', tp })}
            onPeak={(idx) => dispatch({ type: 'SET_PEAK', idx })}
          />

          {/* Step 7 — Peak ETA & Rating */}
          <StepHeader number={7} title={locale === 'ko' ? '음용 적기 & 평점' : 'Peak ETA & Rating'} />
          <PeakEtaInput
            vintageYear={state.meta.vintage}
            yearsToPeak={state.peakEstimateYearsToPeak}
            confidence={state.peakEstimateConfidence}
            note={state.peakEstimateNote}
            userLevelId={userLevelId}
            onYearsToPeak={(v) => dispatch({ type: 'SET_PEAK_YEARS', value: v })}
            onConfidence={(c) => dispatch({ type: 'SET_PEAK_CONF', value: c })}
            onNote={(n) => dispatch({ type: 'SET_PEAK_NOTE', value: n })}
          />

          <RatingRow
            rating={state.rating}
            wouldBuyAgain={state.wouldBuyAgain}
            onRate={(v) => dispatch({ type: 'SET_RATING', value: v })}
            onBuy={(v) => dispatch({ type: 'SET_WOULD_BUY', value: v })}
          />

          <AutoDescription
            variant={state.variant}
            meta={state.meta}
            aroma={{ intensity: state.aromaIntensity, selected: state.aromaSelected }}
            palate={{
              sweetness: state.sweetness,
              acidity: state.acidity,
              body: state.body,
              alcohol: state.alcohol,
              tannin: state.variant === 'red' ? state.tannin : undefined,
              bubbles: state.variant === 'sparkling' ? state.bubbles : undefined,
              dosage: state.variant === 'sparkling' ? state.dosage : undefined,
            }}
            finish={{ caudalies: state.caudalies }}
            rating={state.rating}
            evolution={{
              peak:
                state.evolution.peakIndex != null
                  ? state.evolution.timepoints[state.evolution.peakIndex] ?? null
                  : null,
            }}
          />

          <PriceCapture
            on={priceCapture}
            price={price}
            onToggle={setPriceCapture}
            onPriceChange={setPrice}
          />

          <button
            type="button"
            onClick={handleSave}
            style={{
              background: 'var(--color-wine-red)',
              border: 0,
              color: 'var(--color-cream)',
              padding: '14px 16px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {locale === 'ko' ? '저장' : 'Save'}
          </button>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────── Sub-components ──────────────────────────── */

function VariantTabs({
  current,
  onChange,
}: {
  current: FormVariant;
  onChange: (v: FormVariant) => void;
}) {
  const { locale } = useLocale();
  const tabs: { id: FormVariant; ko: string; en: string }[] = [
    { id: 'white', ko: '화이트', en: 'White' },
    { id: 'red', ko: '레드', en: 'Red' },
    { id: 'sparkling', ko: '스파클링', en: 'Sparkling' },
    { id: 'blind', ko: '블라인드', en: 'Blind' },
  ];
  return (
    <div
      role="tablist"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 4,
        padding: 4,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 999,
      }}
    >
      {tabs.map((t) => {
        const active = current === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            style={{
              background: active ? 'var(--color-wine-red)' : 'transparent',
              border: 0,
              color: active ? 'var(--color-cream)' : 'var(--color-secondary)',
              padding: '8px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {locale === 'ko' ? t.ko : t.en}
          </button>
        );
      })}
    </div>
  );
}

function StepHeader({ number, title }: { number: number; title: string }) {
  return (
    <h3
      style={{
        margin: '8px 0 -4px',
        fontFamily: 'var(--font-playfair)',
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--color-cream)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span
        style={{
          background: 'var(--color-gold)',
          color: 'var(--color-deepest-dark, #05020A)',
          width: 22,
          height: 22,
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {number}
      </span>
      {title}
    </h3>
  );
}

function WineMetaCard({
  wineName,
  producer,
  vintage,
  region,
}: {
  wineName: string;
  producer: string;
  vintage: number | null;
  region: string;
}) {
  const { locale } = useLocale();
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 14,
        padding: 14,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          width: 60,
          height: 80,
          background: 'linear-gradient(180deg, #5A1A24 0%, #2D0D12 100%)',
          border: '1px solid var(--color-border)',
          borderRadius: 6,
          flexShrink: 0,
        }}
      />
      <div style={{ display: 'grid', gap: 2, flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--color-cream)',
            lineHeight: 1.2,
          }}
        >
          {wineName || (locale === 'ko' ? '와인 정보 입력' : 'Enter wine info')}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{producer}</div>
        <div style={{ fontSize: 11, color: 'var(--color-muted)', display: 'flex', gap: 6 }}>
          <span>{vintage ?? 'NV'}</span>
          {region ? <span>· {region}</span> : null}
          <GlossaryTooltip termId="appellation" />
        </div>
      </div>
    </section>
  );
}

function PhotoToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  const { locale } = useLocale();
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        background: on ? 'rgba(201,168,76,0.15)' : 'var(--color-surface)',
        border: `1px solid ${on ? 'var(--color-gold)' : 'var(--color-border)'}`,
        color: 'var(--color-cream)',
        padding: '10px 14px',
        borderRadius: 12,
        fontSize: 13,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      aria-pressed={on}
    >
      <span>{locale === 'ko' ? '사진 추가 (+5 XP)' : 'Add photo (+5 XP)'}</span>
      <span style={{ fontSize: 18 }}>{on ? '✓' : '📷'}</span>
    </button>
  );
}

function RatingRow({
  rating,
  wouldBuyAgain,
  onRate,
  onBuy,
}: {
  rating: number;
  wouldBuyAgain: boolean;
  onRate: (n: number) => void;
  onBuy: (b: boolean) => void;
}) {
  const { locale } = useLocale();
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: 14,
        display: 'grid',
        gap: 10,
      }}
    >
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
          {locale === 'ko' ? '평점' : 'Rating'}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onRate(n)}
              style={{
                background: 'transparent',
                border: 0,
                fontSize: 30,
                cursor: 'pointer',
                color: n <= rating ? 'var(--color-gold)' : 'var(--color-border)',
                padding: 0,
              }}
              aria-label={`${n} stars`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <label
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
          color: 'var(--color-cream)',
          cursor: 'pointer',
        }}
      >
        <span>{locale === 'ko' ? '다시 사시겠어요?' : 'Would buy again?'}</span>
        <input
          type="checkbox"
          checked={wouldBuyAgain}
          onChange={(e) => onBuy(e.target.checked)}
          style={{ accentColor: 'var(--color-gold)' }}
        />
      </label>
    </section>
  );
}
