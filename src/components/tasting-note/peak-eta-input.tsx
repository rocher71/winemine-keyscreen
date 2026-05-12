'use client';

/**
 * PeakEtaInput — NEW 베타 피드백.
 *
 * - 슬라이더: 현재 빈티지부터 +0~+20년 (peak ETA)
 * - 확신도 라디오: low / medium / high
 * - 한 줄 메모 (선택)
 * - **L3+ 가드**: currentUser.levelId < 3이면 disabled + "더 마셔보고 다시" 안내
 * - 푸터: "다른 사용자들의 추정과 함께 와인 상세 페이지에 집계됩니다"
 */

import { useLocale } from '@/context/locale-context';
import type { ConfidenceLevel, LocalizedString } from '@/types';

export interface PeakEtaInputProps {
  /** 와인의 vintage 연도 (NV면 null — 그 경우 currentYear 기반) */
  vintageYear: number | null;
  /** null이면 미설정 */
  yearsToPeak: number | null;
  confidence: ConfidenceLevel | null;
  note: LocalizedString | null;
  userLevelId: number;
  onYearsToPeak: (n: number | null) => void;
  onConfidence: (c: ConfidenceLevel) => void;
  onNote: (note: LocalizedString | null) => void;
}

const CONFIDENCE_OPTIONS: { id: ConfidenceLevel; ko: string; en: string }[] = [
  { id: 'low', ko: '낮음', en: 'Low' },
  { id: 'medium', ko: '보통', en: 'Medium' },
  { id: 'high', ko: '높음', en: 'High' },
];

export function PeakEtaInput({
  vintageYear,
  yearsToPeak,
  confidence,
  note,
  userLevelId,
  onYearsToPeak,
  onConfidence,
  onNote,
}: PeakEtaInputProps) {
  const { locale } = useLocale();
  const locked = userLevelId < 3;

  const baseYear = vintageYear ?? new Date().getFullYear();
  const years = yearsToPeak ?? 0;
  const targetYear = baseYear + years;

  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: `1px solid ${locked ? 'var(--color-disabled, #4A3D56)' : 'var(--color-border)'}`,
        borderRadius: 12,
        padding: 14,
        display: 'grid',
        gap: 10,
        opacity: locked ? 0.7 : 1,
      }}
    >
      <header>
        <h4
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--color-cream)',
          }}
        >
          {locale === 'ko' ? '이 와인, 언제가 가장 좋을까요?' : 'When will this wine peak?'}
        </h4>
      </header>

      {locked ? (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: 'var(--color-muted)',
            lineHeight: 1.5,
            padding: '8px 0',
          }}
        >
          {locale === 'ko' ? '더 마셔보고 다시' : 'Come back after more bottles'}
          <br />
          <span style={{ fontSize: 11, opacity: 0.7 }}>
            {locale === 'ko' ? '(L3+ 사용자에게만 노출됩니다)' : '(Only available at L3+)'}
          </span>
        </p>
      ) : (
        <>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--color-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {years === 0
                  ? locale === 'ko' ? '지금이 절정' : 'Peaking now'
                  : locale === 'ko' ? `+${years}년 후` : `+${years} years`}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                {locale === 'ko' ? `${targetYear}년` : targetYear}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={years}
              onChange={(e) => onYearsToPeak(Number(e.target.value))}
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
              {locale === 'ko' ? '확신도' : 'Confidence'}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {CONFIDENCE_OPTIONS.map((opt) => {
                const active = confidence === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onConfidence(opt.id)}
                    style={{
                      flex: 1,
                      background: active ? 'var(--color-wine-red)' : 'transparent',
                      border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
                      color: active ? 'var(--color-cream)' : 'var(--color-secondary)',
                      padding: '6px',
                      borderRadius: 8,
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

          <textarea
            placeholder={
              locale === 'ko'
                ? '메모 (선택) — 예: 타닌이 아직 단단해 보임'
                : 'Note (optional) — e.g. tannins still firm'
            }
            value={note ? note[locale] : ''}
            onChange={(e) => {
              const next = e.target.value.trim();
              if (!next) {
                onNote(null);
              } else {
                onNote({
                  ko: note?.ko && locale === 'en' ? note.ko : next,
                  en: note?.en && locale === 'ko' ? note.en : next,
                });
              }
            }}
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

          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: 'var(--color-muted)',
              lineHeight: 1.5,
            }}
          >
            {locale === 'ko'
              ? '다른 사용자들의 추정과 함께 와인 상세 페이지에 집계됩니다'
              : 'Aggregated with other users on the wine page'}
          </p>
        </>
      )}
    </section>
  );
}
