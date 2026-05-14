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
import { useUserData } from '@/context/user-data-context';
import { useMockUser } from '@/hooks/use-mock-user';
import { toast } from '@/hooks/use-toast';
import { calcNoteXp } from '@/lib/xp';
import type { FormVariant } from '@/lib/tasting-note-lexicon';
import type { Wine } from '@/types';

export interface NoteWriteBeginnerProps {
  variant: FormVariant; // blind는 부모가 white로 변환해서 전달
  wineName: string;
  producer: string;
  /** 와인이 매칭되어 있으면 저장 시 localStorage 영속화 */
  wine?: Wine | null;
}

export function NoteWriteBeginner({ variant, wineName, producer, wine = null }: NoteWriteBeginnerProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const { addTastingNote } = useUserData();
  const { user } = useMockUser();
  const [priceCapture, setPriceCapture] = useState(false);
  const [price, setPrice] = useState('');
  const [shareToCommunity, setShareToCommunity] = useState(false);

  // beginner mode는 blind 불가 — white로 fallback
  const safeVariant: FormVariant = variant === 'blind' ? 'white' : variant;

  function handleSave() {
    let xp = calcNoteXp('beginner');
    if (priceCapture && price.trim()) xp += 5;

    /* localStorage 영속화 — 와인이 매칭되어 있을 때만 */
    if (wine) {
      const priceKrw = priceCapture && price.trim() ? Number(price.replace(/[^0-9]/g, '')) || null : null;
      addTastingNote({
        id: `user-note-${Date.now()}`,
        userId: user.id,
        wineId: wine.id,
        source: 'newEntry',
        cellarItemId: null,
        tastedAt: new Date().toISOString().slice(0, 10),
        mode: 'beginner',
        beginnerFields: {
          impression: 'good',
          sweetness: 3,
          acidity: 3,
          body: 3,
          tannin: 3,
          aromas: [],
          finish: 'medium',
          rating: 4,
          memo: { ko: '', en: '' },
        },
        expertFields: null,
        photoUrl: null,
        priceKrw,
        isPublic: shareToCommunity,
        createdAt: new Date().toISOString(),
      });
    }

    toast({
      variant: 'xp',
      xp,
      message: {
        ko: shareToCommunity
          ? `노트 공유 +${xp} XP`
          : `입문자 노트 +${xp} XP`,
        en: shareToCommunity ? `Note shared +${xp} XP` : `Beginner note +${xp} XP`,
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

      <ShareToCommunityToggle
        on={shareToCommunity}
        onToggle={setShareToCommunity}
        locale={locale}
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

export function ShareToCommunityToggle({
  on,
  onToggle,
  locale,
}: {
  on: boolean;
  onToggle: (v: boolean) => void;
  locale: 'ko' | 'en';
}) {
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: `1px solid ${on ? 'var(--color-gold)' : 'var(--color-border)'}`,
        borderRadius: 12,
        padding: 14,
      }}
    >
      <label
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--color-cream)', fontWeight: 600 }}>
            {locale === 'en' ? 'Share to community' : '커뮤니티에 공유'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
            {locale === 'en'
              ? 'Others can see this note on the community Notes tab.'
              : '커뮤니티의 시음 노트 탭에서 이 노트가 보여요.'}
          </div>
        </div>
        <input
          type="checkbox"
          checked={on}
          onChange={(e) => onToggle(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: 'var(--color-wine-red)' }}
        />
      </label>
    </section>
  );
}
