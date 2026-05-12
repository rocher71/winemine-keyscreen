'use client';

/**
 * BlindMode — Blind 양식 단독.
 * handover doc §5.7.
 *
 * - 내부 state로 4 입력 (grape / region / vintage / price)
 * - "정답 공개 (Reveal & Score)" — 각 25점, 총 100점
 * - 등급 라벨 (Master / Advanced / Enthusiast / Exploring / Finding)
 * - 정답은 **prop으로 외부 주입** — 랜딩 하드코드 변경 (handover doc §5.7)
 */

import { useState } from 'react';
import { useLocale } from '@/context/locale-context';

export interface BlindCorrectAnswer {
  /** 한 줄 텍스트 비교용 — 두 locale 공통의 가장 단순한 정답 표기 */
  grape: string;
  region: string;
  vintage: number;
  /** KRW 가격대 — "200000-300000" 형태나 단순 숫자 모두 허용 */
  priceRangeKrw: { min: number; max: number };
}

export interface BlindModeProps {
  /** 외부에서 주입되는 정답. 없으면 채점 비활성 */
  correctAnswer?: BlindCorrectAnswer | null;
  onCTA?: () => void;
}

interface Guesses {
  grape: string;
  region: string;
  vintage: string;
  priceRange: string;
}

function rankLabel(score: number, locale: 'ko' | 'en') {
  if (locale === 'ko') {
    if (score >= 90) return 'Master Sommelier 수준';
    if (score >= 70) return 'Advanced Sommelier 후보';
    if (score >= 50) return 'Wine Enthusiast';
    if (score >= 25) return '탐험 단계 — 더 마셔보세요';
    return '재미있는 발견 — 와인의 다양성을 즐기세요';
  }
  if (score >= 90) return 'Master Sommelier level';
  if (score >= 70) return 'Advanced Sommelier candidate';
  if (score >= 50) return 'Wine Enthusiast';
  if (score >= 25) return 'Exploring — keep tasting';
  return 'Finding — enjoy wine diversity';
}

function computeScore(guesses: Guesses, answer: BlindCorrectAnswer): {
  total: number;
  detail: { grape: number; region: number; vintage: number; price: number };
} {
  const grape = guesses.grape.trim().toLowerCase().includes(answer.grape.toLowerCase()) ? 25 : 0;
  const region = guesses.region.trim().toLowerCase().includes(answer.region.toLowerCase())
    ? 25
    : 0;
  const v = parseInt(guesses.vintage, 10);
  const vintage = !Number.isNaN(v) && Math.abs(v - answer.vintage) <= 2 ? 25 : 0;
  // price: 사용자가 "200000-300000" 또는 "약 250000"으로 입력
  const numbers = guesses.priceRange.match(/\d+/g)?.map(Number) ?? [];
  let price = 0;
  if (numbers.length) {
    const userMin = Math.min(...numbers);
    const userMax = Math.max(...numbers);
    // overlap with answer range
    const overlap = userMin <= answer.priceRangeKrw.max && userMax >= answer.priceRangeKrw.min;
    if (overlap) price = 25;
  }
  return { total: grape + region + vintage + price, detail: { grape, region, vintage, price } };
}

export function BlindMode({ correctAnswer, onCTA }: BlindModeProps) {
  const { locale } = useLocale();
  const [guesses, setGuesses] = useState<Guesses>({
    grape: '',
    region: '',
    vintage: '',
    priceRange: '',
  });
  const [revealed, setRevealed] = useState(false);

  const score = revealed && correctAnswer ? computeScore(guesses, correctAnswer) : null;
  const canScore = !!correctAnswer;

  function reset() {
    setGuesses({ grape: '', region: '', vintage: '', priceRange: '' });
    setRevealed(false);
  }

  return (
    <section style={{ display: 'grid', gap: 14 }}>
      <header>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
          }}
        >
          {locale === 'ko' ? 'BLIND TASTING' : 'BLIND TASTING'}
        </p>
        <h3
          style={{
            margin: '4px 0 0',
            fontFamily: 'var(--font-playfair)',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--color-cream)',
          }}
        >
          {locale === 'ko' ? '와인을 맞춰보세요' : 'Guess the wine'}
        </h3>
      </header>

      <div style={{ display: 'grid', gap: 10 }}>
        {(
          [
            ['grape', locale === 'ko' ? '품종 추정' : 'Grape guess'],
            ['region', locale === 'ko' ? '지역 추정' : 'Region guess'],
            ['vintage', locale === 'ko' ? '빈티지 추정' : 'Vintage guess'],
            ['priceRange', locale === 'ko' ? '가격대 추정 (KRW)' : 'Price range guess (KRW)'],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            style={{ display: 'grid', gap: 4, fontSize: 12, color: 'var(--color-secondary)' }}
          >
            <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {label}
            </span>
            <input
              type="text"
              value={guesses[key]}
              onChange={(e) => setGuesses((g) => ({ ...g, [key]: e.target.value }))}
              disabled={revealed}
              style={{
                background: 'var(--color-map-dark, #1A0A1E)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                color: 'var(--color-cream)',
                padding: '10px 12px',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </label>
        ))}
      </div>

      {!canScore ? (
        <p
          style={{
            fontSize: 12,
            color: 'var(--color-muted)',
            margin: 0,
          }}
        >
          {locale === 'ko'
            ? '정답 데이터가 없어 채점이 비활성화되었습니다.'
            : 'Scoring disabled — no correct answer data.'}
        </p>
      ) : null}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          disabled={!canScore || revealed}
          onClick={() => setRevealed(true)}
          style={{
            flex: 1,
            background: !canScore || revealed ? 'var(--color-border)' : 'var(--color-wine-red)',
            border: 0,
            color: 'var(--color-cream)',
            padding: '12px 16px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            cursor: !canScore || revealed ? 'not-allowed' : 'pointer',
          }}
        >
          {locale === 'ko' ? '정답 공개 (Reveal & Score)' : 'Reveal & Score'}
        </button>
        {revealed ? (
          <button
            type="button"
            onClick={reset}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-cream)',
              padding: '12px 16px',
              borderRadius: 999,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {locale === 'ko' ? '재시도' : 'Retry'}
          </button>
        ) : null}
      </div>

      {revealed && correctAnswer && score ? (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-gold)',
            borderRadius: 12,
            padding: 14,
            display: 'grid',
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--color-gold)',
            }}
          >
            {score.total}/100
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-cream)', fontWeight: 600 }}>
            {rankLabel(score.total, locale)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-secondary)', display: 'grid', gap: 2 }}>
            <span>
              {locale === 'ko' ? '품종' : 'Grape'}: {correctAnswer.grape} ({score.detail.grape}/25)
            </span>
            <span>
              {locale === 'ko' ? '지역' : 'Region'}: {correctAnswer.region} ({score.detail.region}/25)
            </span>
            <span>
              {locale === 'ko' ? '빈티지' : 'Vintage'}: {correctAnswer.vintage} ({score.detail.vintage}
              /25)
            </span>
            <span>
              {locale === 'ko' ? '가격대' : 'Price'}: KRW {correctAnswer.priceRangeKrw.min.toLocaleString()}
              –{correctAnswer.priceRangeKrw.max.toLocaleString()} ({score.detail.price}/25)
            </span>
          </div>
          {onCTA ? (
            <button
              type="button"
              onClick={onCTA}
              style={{
                marginTop: 8,
                background: 'var(--color-wine-red)',
                border: 0,
                color: 'var(--color-cream)',
                padding: '10px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {locale === 'ko' ? '노트 저장' : 'Save note'}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
