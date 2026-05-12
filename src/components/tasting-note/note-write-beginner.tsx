'use client';

/**
 * note-write-beginner.tsx — 입문자 모드 작성 컨테이너.
 *
 * - `<BeginnerNote />` 단독 (자체 state 보유)
 * - Blind 탭은 비활성 → white로 fallback (handover doc §2.2)
 * - 하단: 가격 capture 토글 + 저장 버튼 → +10 XP 토스트
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BeginnerNote } from './beginner-note';
import { useLocale } from '@/context/locale-context';
import { toast } from '@/hooks/use-toast';
import { calcNoteXp } from '@/lib/xp';
import type { FormVariant } from '@/lib/tasting-note-lexicon';

export interface NoteWriteBeginnerProps {
  variant: FormVariant; // blind는 부모가 white로 변환해서 전달
  wineName: string;
  producer: string;
}

export function NoteWriteBeginner({ variant, wineName, producer }: NoteWriteBeginnerProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const [priceCapture, setPriceCapture] = useState(false);
  const [price, setPrice] = useState('');

  // beginner mode는 blind 불가 — white로 fallback
  const safeVariant: FormVariant = variant === 'blind' ? 'white' : variant;

  function handleSave() {
    let xp = calcNoteXp('beginner');
    if (priceCapture && price.trim()) xp += 5;
    toast({
      variant: 'xp',
      xp,
      message: {
        ko: `입문자 노트 +${xp} XP`,
        en: `Beginner note +${xp} XP`,
      },
    });
    window.setTimeout(() => router.back(), 1000);
  }

  return (
    <div style={{ display: 'grid', gap: 16, padding: '16px 16px 96px' }}>
      <BeginnerNote variant={safeVariant} wineName={wineName} producer={producer} />

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
    </div>
  );
}

interface PriceCaptureProps {
  on: boolean;
  price: string;
  onToggle: (v: boolean) => void;
  onPriceChange: (v: string) => void;
}

export function PriceCapture({ on, price, onToggle, onPriceChange }: PriceCaptureProps) {
  const { locale } = useLocale();
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: 14,
      }}
    >
      <label
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-cream)',
          }}
        >
          {locale === 'ko' ? '가격 입력 (+5 XP)' : 'Add price (+5 XP)'}
        </span>
        <input
          type="checkbox"
          checked={on}
          onChange={(e) => onToggle(e.target.checked)}
          style={{ accentColor: 'var(--color-gold)' }}
        />
      </label>
      {on ? (
        <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
          <input
            type="number"
            placeholder={locale === 'ko' ? '가격 (KRW)' : 'Price (KRW)'}
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
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
        </div>
      ) : null}
    </section>
  );
}
