'use client';

/**
 * OpeningTimeline — 코르크 오픈 시각·디캔팅·시점별 변화 기록.
 * handover doc §5.5 (가장 복잡, 439줄).
 *
 * - 상단: openedAt picker + 디캔터 토글 + 라이브 타이머 chip
 * - 가로 8 dot timeline (TIMEPOINT_PRESETS)
 * - 활성 timepoint 입력 카드
 * - matchOpeningGuide 권장 카드
 * - SVG 라인 차트 (overallScore over time)
 * - setInterval(1000) 라이브 타이머 — cleanup 필수
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  OPENING_GUIDE,
  TIMEPOINT_PRESETS,
  matchOpeningGuide,
  type EvolutionPoint,
  type FormVariant,
  type Delta,
  type OpeningGuideEntry,
} from '@/lib/tasting-note-lexicon';
import { Wine, Star } from 'lucide-react';
import { useLocale } from '@/context/locale-context';

export interface OpeningTimelineMeta {
  vintage: number | null;
  grapeVarieties: string[];
  region: string;
}

export interface OpeningTimelineState {
  openedAt: string | null; // ISO 8601
  decanted: boolean;
  timepoints: EvolutionPoint[];
  peakIndex: number | null;
}

export interface OpeningTimelineProps {
  variant: FormVariant;
  meta: OpeningTimelineMeta;
  state: OpeningTimelineState;
  onOpenedAt: (iso: string | null) => void;
  onDecant: (next: boolean) => void;
  onUpsert: (tp: EvolutionPoint) => void;
  onPeak: (idx: number | null) => void;
}

const DELTA_OPTIONS: Delta[] = [-2, -1, 0, 1, 2];

function deltaLabel(d: Delta, locale: 'ko' | 'en') {
  const ko: Record<Delta, string> = { [-2]: '--', [-1]: '-', 0: '=', 1: '+', 2: '++' };
  const en = ko;
  return (locale === 'ko' ? ko : en)[d];
}

function fmtTime(ms: number, locale: 'ko' | 'en') {
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hrs > 0) return locale === 'ko' ? `${hrs}시간 ${rem}분` : `${hrs}h ${rem}m`;
  return locale === 'ko' ? `${mins}분` : `${mins}m`;
}

export function OpeningTimeline({
  variant,
  meta,
  state,
  onOpenedAt,
  onDecant,
  onUpsert,
  onPeak,
}: OpeningTimelineProps) {
  const { locale } = useLocale();
  const [now, setNow] = useState(() => Date.now());
  const [activeMinutes, setActiveMinutes] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  // setInterval(1000) — 라이브 타이머 cleanup 필수
  useEffect(() => {
    if (!state.openedAt) return;
    intervalRef.current = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      if (intervalRef.current != null) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [state.openedAt]);

  const elapsedMs = state.openedAt ? now - new Date(state.openedAt).getTime() : 0;

  const guide: OpeningGuideEntry | null = useMemo(
    () =>
      matchOpeningGuide({
        variant,
        vintage: meta.vintage,
        grapeVarieties: meta.grapeVarieties,
        region: meta.region,
      }),
    [variant, meta.vintage, meta.grapeVarieties, meta.region],
  );

  const tpByMin = useMemo<Record<number, EvolutionPoint>>(() => {
    const map: Record<number, EvolutionPoint> = {};
    state.timepoints.forEach((tp) => {
      map[tp.minutesAfterOpen] = tp;
    });
    return map;
  }, [state.timepoints]);

  const activeTp = tpByMin[activeMinutes];

  function ensureTpExists(): EvolutionPoint {
    if (activeTp) return activeTp;
    const preset = TIMEPOINT_PRESETS.find((p) => p.minutes === activeMinutes);
    return {
      minutesAfterOpen: activeMinutes,
      label: preset?.label ?? `${activeMinutes}분`,
      aromaIntensityDelta: 0,
      tanninSoftnessDelta: 0,
      bodyDelta: 0,
      reductionPresent: false,
      newAromasEmerged: [],
      overallScore: 3,
      note: '',
    };
  }

  function update(patch: Partial<EvolutionPoint>) {
    const base = ensureTpExists();
    onUpsert({ ...base, ...patch });
  }

  return (
    <section style={{ display: 'grid', gap: 14 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--color-cream)',
          }}
        >
          {locale === 'ko' ? '오프닝 타임라인' : 'Opening timeline'}
        </h3>
        {state.openedAt ? (
          <span
            style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(201,168,76,0.18)',
              color: 'var(--color-gold)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmtTime(elapsedMs, locale)}
          </span>
        ) : null}
      </header>

      {/* 상단 컨트롤 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => onOpenedAt(state.openedAt ? null : new Date().toISOString())}
          style={{
            background: state.openedAt ? 'var(--color-wine-red)' : 'var(--color-surface)',
            border: `1px solid ${state.openedAt ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
            color: 'var(--color-cream)',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {state.openedAt && <Wine size={13} strokeWidth={1.5} color="var(--color-cream)" />}
            {state.openedAt
              ? locale === 'ko'
                ? '코르크 오픈됨'
                : 'Cork opened'
              : locale === 'ko'
                ? '코르크 오픈 시각 기록'
                : 'Record opening time'}
          </span>
        </button>
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: 'var(--color-secondary)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={state.decanted}
            onChange={(e) => onDecant(e.target.checked)}
            style={{ accentColor: 'var(--color-gold)' }}
          />
          {locale === 'ko' ? '디캔터 사용' : 'Decanted'}
        </label>
      </div>

      {/* 가로 8 dot timeline */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          overflowX: 'auto',
        }}
      >
        {TIMEPOINT_PRESETS.map((preset, idx) => {
          const filled = !!tpByMin[preset.minutes];
          const isActive = activeMinutes === preset.minutes;
          const isPeak = state.peakIndex != null && state.timepoints[state.peakIndex]?.minutesAfterOpen === preset.minutes;
          return (
            <div
              key={preset.minutes}
              style={{ display: 'flex', alignItems: 'center', flex: idx < TIMEPOINT_PRESETS.length - 1 ? 1 : '0 0 auto' }}
            >
              <button
                type="button"
                onClick={() => setActiveMinutes(preset.minutes)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  padding: 4,
                }}
                aria-label={preset.label}
                aria-pressed={isActive}
              >
                <span
                  style={{
                    width: isActive ? 16 : 12,
                    height: isActive ? 16 : 12,
                    borderRadius: '50%',
                    background: isPeak
                      ? 'var(--color-gold)'
                      : filled
                        ? 'var(--color-wine-red)'
                        : 'var(--color-border)',
                    boxShadow: isActive
                      ? '0 0 0 4px rgba(201,168,76,0.18)'
                      : 'none',
                    transition: 'all 160ms ease',
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: isActive ? 'var(--color-gold)' : 'var(--color-muted)',
                    marginTop: 4,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {preset.label}
                </span>
              </button>
              {idx < TIMEPOINT_PRESETS.length - 1 && (
                <div
                  aria-hidden
                  style={{
                    flex: 1,
                    height: 2,
                    background: 'var(--color-border)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 활성 timepoint 입력 카드 */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: 14,
          display: 'grid',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h4
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-cream)',
            }}
          >
            {TIMEPOINT_PRESETS.find((p) => p.minutes === activeMinutes)?.label ?? `${activeMinutes}분`}{' '}
            {locale === 'ko' ? '시점' : 'point'}
          </h4>
          {activeTp ? (
            <button
              type="button"
              onClick={() => {
                const idx = state.timepoints.findIndex((tp) => tp.minutesAfterOpen === activeMinutes);
                onPeak(state.peakIndex === idx ? null : idx);
              }}
              style={{
                background: state.peakIndex != null && state.timepoints[state.peakIndex]?.minutesAfterOpen === activeMinutes ? 'var(--color-gold)' : 'transparent',
                border: '1px solid var(--color-gold)',
                color: state.peakIndex != null && state.timepoints[state.peakIndex]?.minutesAfterOpen === activeMinutes ? 'var(--color-deepest-dark, #05020A)' : 'var(--color-gold)',
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: 999,
                cursor: 'pointer',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Star size={11} strokeWidth={1.5} fill="currentColor" />
                {locale === 'ko' ? '정점' : 'Peak'}
              </span>
            </button>
          ) : null}
        </div>

        {(['aromaIntensityDelta', 'tanninSoftnessDelta', 'bodyDelta'] as const).map((field) => {
          const label =
            locale === 'ko'
              ? field === 'aromaIntensityDelta'
                ? '향 강도'
                : field === 'tanninSoftnessDelta'
                  ? '타닌 부드러움'
                  : '바디'
              : field === 'aromaIntensityDelta'
                ? 'Aroma intensity'
                : field === 'tanninSoftnessDelta'
                  ? 'Tannin softness'
                  : 'Body';
          const current = activeTp?.[field] ?? 0;
          return (
            <div key={field}>
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
                {label}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {DELTA_OPTIONS.map((d) => {
                  const active = current === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => update({ [field]: d } as Partial<EvolutionPoint>)}
                      style={{
                        flex: 1,
                        background: active ? 'var(--color-wine-red)' : 'transparent',
                        border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
                        color: active ? 'var(--color-cream)' : 'var(--color-secondary)',
                        padding: '6px',
                        borderRadius: 8,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                      aria-pressed={active}
                    >
                      {deltaLabel(d, locale)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-secondary)' }}>
          <input
            type="checkbox"
            checked={activeTp?.reductionPresent ?? false}
            onChange={(e) => update({ reductionPresent: e.target.checked })}
            style={{ accentColor: 'var(--color-gold)' }}
          />
          {locale === 'ko' ? '환원취 느껴짐' : 'Reduction present'}
        </label>

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
            {locale === 'ko' ? '전반 점수' : 'Overall score'}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const active = (activeTp?.overallScore ?? 3) === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => update({ overallScore: n as 1 | 2 | 3 | 4 | 5 })}
                  style={{
                    flex: 1,
                    background: active ? 'var(--color-gold)' : 'transparent',
                    border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border)'}`,
                    color: active ? 'var(--color-deepest-dark, #05020A)' : 'var(--color-secondary)',
                    padding: '6px',
                    borderRadius: 8,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                  aria-pressed={active}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        <textarea
          placeholder={locale === 'ko' ? '메모 (선택)' : 'Note (optional)'}
          value={activeTp?.note ?? ''}
          onChange={(e) => update({ note: e.target.value })}
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
      </div>

      {/* 권장 디캔팅 카드 */}
      {guide ? (
        <div
          style={{
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.30)',
            borderRadius: 12,
            padding: 12,
            fontSize: 12,
            color: 'var(--color-secondary)',
            lineHeight: 1.55,
          }}
        >
          <div style={{ color: 'var(--color-gold)', fontWeight: 600, marginBottom: 4 }}>
            {locale === 'ko' ? '권장 디캔팅' : 'Recommended decanting'} —{' '}
            {locale === 'ko' ? guide.ko : guide.en}
          </div>
          <div>
            {locale === 'ko'
              ? `${guide.recommendedMinutes.min}~${guide.recommendedMinutes.max}분 (평균 정점 ${guide.recommendedMinutes.peak}분)`
              : `${guide.recommendedMinutes.min}-${guide.recommendedMinutes.max} min (avg peak ${guide.recommendedMinutes.peak} min)`}
          </div>
          <div style={{ opacity: 0.85, marginTop: 4 }}>{guide.rationale}</div>
        </div>
      ) : null}

      {/* SVG 라인 차트 */}
      {state.timepoints.length > 1 ? (
        <TimelineChart points={state.timepoints} peakIndex={state.peakIndex} />
      ) : null}
    </section>
  );
}

function TimelineChart({
  points,
  peakIndex,
}: {
  points: EvolutionPoint[];
  peakIndex: number | null;
}) {
  const sorted = useMemo(
    () => [...points].sort((a, b) => a.minutesAfterOpen - b.minutesAfterOpen),
    [points],
  );
  const W = 300;
  const H = 100;
  const maxMin = Math.max(...sorted.map((p) => p.minutesAfterOpen), 60);
  const path = sorted
    .map((p, i) => {
      const x = (p.minutesAfterOpen / maxMin) * (W - 20) + 10;
      const y = H - ((p.overallScore - 1) / 4) * (H - 20) - 10;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <line x1={10} y1={H - 10} x2={W - 10} y2={H - 10} stroke="var(--color-border)" strokeWidth={1} />
      <path d={path} fill="none" stroke="var(--color-gold)" strokeWidth={2} strokeLinecap="round" />
      {sorted.map((p, i) => {
        const x = (p.minutesAfterOpen / maxMin) * (W - 20) + 10;
        const y = H - ((p.overallScore - 1) / 4) * (H - 20) - 10;
        const isPeak = peakIndex != null && points[peakIndex]?.minutesAfterOpen === p.minutesAfterOpen;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isPeak ? 5 : 3.5}
            fill={isPeak ? 'var(--color-gold)' : 'var(--color-wine-red)'}
            stroke="var(--color-deepest-dark, #05020A)"
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}
