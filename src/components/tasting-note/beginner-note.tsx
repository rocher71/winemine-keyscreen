'use client';

/**
 * BeginnerNote — 입문자 단순화 노트.
 * handover doc §5.9 (699줄).
 *
 * - 자체 state로 모든 입력 보유 (부모와 단방향)
 * - 7단계 흐름: 와인 / 첫 인상 / 맛 / 향 / 여운 / 평점 / 메모
 * - WSET 5단계 → 3단계 (low/mid/high)
 * - 어휘 200개 → 8 큰 카테고리
 * - 각 단계 tip 박스 (GlossaryTooltip)
 */

import { useState, type ComponentType } from 'react';
import {
  Cherry,
  Citrus,
  Apple,
  Flower2,
  Flame,
  Candy,
  Sprout,
  Wheat,
  Sparkles,
  Smile,
  HelpCircle,
  Star,
} from 'lucide-react';
import { useLocale } from '@/context/locale-context';
import { GlossaryTooltip } from '@/components/glossary/glossary-tooltip';
import type { FormVariant } from '@/lib/tasting-note-lexicon';

type IconCmp = ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;

export interface BeginnerNoteProps {
  variant: FormVariant;
  wineName: string;
  producer: string;
}

type Impression = 'star' | 'smile' | 'thinking';
type SimpleScale = 'low' | 'mid' | 'high';

const SIMPLE_OPTIONS: { id: SimpleScale; ko: string; en: string }[] = [
  { id: 'low', ko: '낮음', en: 'Low' },
  { id: 'mid', ko: '중간', en: 'Mid' },
  { id: 'high', ko: '높음', en: 'High' },
];

const AROMA_CARDS: { id: string; ko: string; en: string; Icon: IconCmp }[] = [
  { id: 'berry', ko: '베리', en: 'Berry', Icon: Cherry },
  { id: 'citrus', ko: '시트러스', en: 'Citrus', Icon: Citrus },
  { id: 'stoneFruit', ko: '복숭아·살구', en: 'Stone fruit', Icon: Apple },
  { id: 'floral', ko: '꽃', en: 'Floral', Icon: Flower2 },
  { id: 'spice', ko: '향신료', en: 'Spice', Icon: Flame },
  { id: 'sweet', ko: '꿀·캐러멜', en: 'Honey/Caramel', Icon: Candy },
  { id: 'earth', ko: '흙·허브', en: 'Earth/Herb', Icon: Sprout },
  { id: 'yeast', ko: '빵·이스트', en: 'Bread/Yeast', Icon: Wheat },
];

const IMPRESSION_OPTIONS: { id: Impression; ko: string; en: string; Icon: IconCmp }[] = [
  { id: 'star', ko: '와! 최고!', en: 'Wow!', Icon: Sparkles },
  { id: 'smile', ko: '괜찮아요', en: 'Nice', Icon: Smile },
  { id: 'thinking', ko: '음... 글쎄', en: 'Hmm...', Icon: HelpCircle },
];

const FINISH_OPTIONS: { id: 'short' | 'medium' | 'long'; ko: string; en: string }[] = [
  { id: 'short', ko: '짧음', en: 'Short' },
  { id: 'medium', ko: '중간', en: 'Medium' },
  { id: 'long', ko: '긴', en: 'Long' },
];

export function BeginnerNote({ variant, wineName, producer }: BeginnerNoteProps) {
  const { locale } = useLocale();
  const [impression, setImpression] = useState<Impression>('smile');
  const [palate, setPalate] = useState<Record<string, SimpleScale>>({
    sweetness: 'mid',
    acidity: 'mid',
    body: 'mid',
    tannin: variant === 'red' ? 'mid' : 'low',
    bubble: variant === 'sparkling' ? 'mid' : 'low',
  });
  const [aromas, setAromas] = useState<string[]>([]);
  const [finish, setFinish] = useState<'short' | 'medium' | 'long'>('medium');
  const [rating, setRating] = useState(3);
  const [memo, setMemo] = useState('');

  const PALATE_DIMENSIONS: { id: string; ko: string; en: string; tipId?: string; show: boolean }[] = [
    { id: 'sweetness', ko: '단맛', en: 'Sweetness', tipId: 'residual-sugar', show: true },
    { id: 'acidity', ko: '신맛', en: 'Acidity', show: true },
    { id: 'body', ko: '무게감 (바디)', en: 'Body', show: true },
    { id: 'tannin', ko: '떫은맛 (타닌)', en: 'Tannin', tipId: 'tannin-texture', show: variant === 'red' || variant === 'blind' },
    { id: 'bubble', ko: '기포', en: 'Bubbles', show: variant === 'sparkling' || variant === 'blind' },
  ];

  return (
    <section style={{ display: 'grid', gap: 18 }}>
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
          {locale === 'ko' ? '입문자 모드' : 'Beginner mode'}
        </p>
        <h3
          style={{
            margin: '4px 0 4px',
            fontFamily: 'var(--font-playfair)',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--color-cream)',
          }}
        >
          {wineName || (locale === 'ko' ? '오늘의 한 잔' : "Today's glass")}
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-secondary)' }}>
          {producer}
        </p>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 12,
            color: 'var(--color-muted)',
            lineHeight: 1.5,
          }}
        >
          {locale === 'ko'
            ? '와인 한 잔, 5분이면 끝나는 짧은 기록. 어려운 용어는 잠시 잊고 느낀대로 적어보세요.'
            : 'A 5-minute record of your wine. Forget the jargon — just write what you feel.'}
        </p>
      </header>

      {/* Step 2 — 첫 인상 */}
      <Step number={1} title={locale === 'ko' ? '첫 모금, 어땠어요?' : 'First sip — how was it?'}>
        <div style={{ display: 'flex', gap: 8 }}>
          {IMPRESSION_OPTIONS.map((opt) => {
            const active = impression === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setImpression(opt.id)}
                style={{
                  flex: 1,
                  background: active ? 'rgba(201,168,76,0.18)' : 'var(--color-surface)',
                  border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border)'}`,
                  color: 'var(--color-cream)',
                  padding: '14px 8px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
                aria-pressed={active}
              >
                <opt.Icon size={26} strokeWidth={1.5} color={active ? 'var(--color-gold)' : 'var(--color-cream)'} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>
                  {locale === 'ko' ? opt.ko : opt.en}
                </span>
              </button>
            );
          })}
        </div>
      </Step>

      {/* Step 3 — 맛 */}
      <Step number={2} title={locale === 'ko' ? '맛의 균형' : 'Balance'}>
        <div style={{ display: 'grid', gap: 10 }}>
          {PALATE_DIMENSIONS.filter((d) => d.show).map((dim) => (
            <div key={dim.id}>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--color-cream)',
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>{locale === 'ko' ? dim.ko : dim.en}</span>
                {dim.tipId ? <GlossaryTooltip termId={dim.tipId} /> : null}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {SIMPLE_OPTIONS.map((opt) => {
                  const active = palate[dim.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPalate((p) => ({ ...p, [dim.id]: opt.id }))}
                      style={{
                        flex: 1,
                        background: active ? 'var(--color-wine-red)' : 'var(--color-surface)',
                        border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
                        color: active ? 'var(--color-cream)' : 'var(--color-secondary)',
                        padding: '8px',
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
          ))}
        </div>
      </Step>

      {/* Step 4 — 향 */}
      <Step number={3} title={locale === 'ko' ? '어떤 향이 떠올라요?' : 'What aromas come to mind?'}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 6,
          }}
        >
          {AROMA_CARDS.map((card) => {
            const active = aromas.includes(card.id);
            return (
              <button
                key={card.id}
                type="button"
                onClick={() =>
                  setAromas((a) => (active ? a.filter((x) => x !== card.id) : [...a, card.id]))
                }
                style={{
                  background: active ? 'rgba(201,168,76,0.18)' : 'var(--color-surface)',
                  border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border)'}`,
                  color: 'var(--color-cream)',
                  padding: '10px 4px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
                aria-pressed={active}
              >
                <card.Icon size={20} strokeWidth={1.5} color={active ? 'var(--color-gold)' : 'var(--color-cream)'} />
                <span style={{ fontSize: 10 }}>
                  {locale === 'ko' ? card.ko : card.en}
                </span>
              </button>
            );
          })}
        </div>
      </Step>

      {/* Step 5 — 여운 */}
      <Step number={4} title={locale === 'ko' ? '여운은 얼마나?' : 'How long does it linger?'}>
        <div style={{ display: 'flex', gap: 6 }}>
          {FINISH_OPTIONS.map((opt) => {
            const active = finish === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFinish(opt.id)}
                style={{
                  flex: 1,
                  background: active ? 'var(--color-wine-red)' : 'var(--color-surface)',
                  border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border)'}`,
                  color: active ? 'var(--color-cream)' : 'var(--color-secondary)',
                  padding: '10px',
                  borderRadius: 8,
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
      </Step>

      {/* Step 6 — 평점 */}
      <Step number={5} title={locale === 'ko' ? '평점' : 'Rating'}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              style={{
                background: 'transparent',
                border: 0,
                cursor: 'pointer',
                color: n <= rating ? 'var(--color-gold)' : 'var(--color-border)',
                display: 'inline-flex',
                padding: 2,
              }}
              aria-label={`${n} stars`}
            >
              <Star size={28} strokeWidth={1.5} fill={n <= rating ? 'var(--color-gold)' : 'none'} />
            </button>
          ))}
        </div>
      </Step>

      {/* Step 7 — 메모 */}
      <Step number={6} title={locale === 'ko' ? '한 줄 메모' : 'A line about this wine'}>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          placeholder={
            locale === 'ko'
              ? '예: 새 친구가 추천해준 와인. 첫 잔이 따뜻하게 느껴졌다.'
              : 'e.g. A friend recommended it. First sip felt warm.'
          }
          style={{
            width: '100%',
            background: 'var(--color-map-dark, #1A0A1E)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            color: 'var(--color-cream)',
            padding: '10px 12px',
            fontSize: 14,
            resize: 'vertical',
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
      </Step>

      {/* 자동 요약 카드 */}
      <div
        style={{
          background: 'rgba(201,168,76,0.06)',
          border: '1px solid rgba(201,168,76,0.30)',
          borderRadius: 12,
          padding: 12,
          fontSize: 13,
          color: 'var(--color-cream)',
          lineHeight: 1.5,
        }}
      >
        <div
          style={{
            color: 'var(--color-gold)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            marginBottom: 4,
          }}
        >
          {locale === 'ko' ? '오늘의 한 잔' : "Today's glass"}
        </div>
        <p style={{ margin: 0, fontStyle: 'italic', fontFamily: 'var(--font-playfair)' }}>
          {summarize({ impression, palate, aromas, finish, rating, locale })}
        </p>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ display: 'grid', gap: 8 }}>
      <h4
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-cream)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            background: 'var(--color-wine-red)',
            color: 'var(--color-cream)',
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
      </h4>
      {children}
    </section>
  );
}

function summarize({
  impression,
  palate,
  aromas,
  finish,
  rating,
  locale,
}: {
  impression: Impression;
  palate: Record<string, SimpleScale>;
  aromas: string[];
  finish: 'short' | 'medium' | 'long';
  rating: number;
  locale: 'ko' | 'en';
}): string {
  const aromaNames = aromas
    .map((id) => AROMA_CARDS.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => (locale === 'ko' ? c!.ko : c!.en));

  if (locale === 'ko') {
    const impressionWord =
      impression === 'star' ? '인상 깊었던' : impression === 'smile' ? '편안했던' : '아직 어색했던';
    const aromaPhrase = aromaNames.length ? `${aromaNames.join(', ')} 향이 떠오르고` : '향은 아직 가벼웠고';
    const finishWord =
      finish === 'short' ? '짧은' : finish === 'medium' ? '적당한' : '긴';
    const bodyWord =
      palate.body === 'low' ? '가벼운' : palate.body === 'mid' ? '균형 잡힌' : '묵직한';
    return `${impressionWord} 한 잔. ${aromaPhrase}, ${bodyWord} 바디에 ${finishWord} 여운이 남았다. 별 ${rating}개.`;
  }
  const impressionWord =
    impression === 'star' ? 'memorable' : impression === 'smile' ? 'comforting' : 'unfamiliar';
  const aromaPhrase = aromaNames.length
    ? `with hints of ${aromaNames.join(', ')}`
    : 'with subtle aromas';
  const bodyWord = palate.body === 'low' ? 'light' : palate.body === 'mid' ? 'balanced' : 'full';
  return `A ${impressionWord} glass — ${bodyWord}-bodied ${aromaPhrase}, ${finish} finish. ${rating}/5 stars.`;
}
