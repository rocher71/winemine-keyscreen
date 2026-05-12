'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { BottomSheet } from '@/components/shared/bottom-sheet';
import { LocaleText, useLocalizedText } from '@/components/shared/locale-text';
import { toast } from '@/hooks/use-toast';
import { STORES } from '@/lib/mock/stores';

type Props = {
  wineId: string;
};

/**
 * "내 구매 정보 등록" — 하단 고정 CTA + BottomSheet 폼.
 * 저장 시 +5 XP 토스트 (mock — 실제 저장은 메모리 X).
 */
export function AddMyPriceCta({ wineId }: Props) {
  void wineId;
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [storeId, setStoreId] = useState(STORES[0]?.id ?? '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const pricePlaceholder = useLocalizedText({ ko: '가격 (₩)', en: 'Price (KRW)' });
  const submitLabel = useLocalizedText({ ko: '저장', en: 'Save' });

  const handleSubmit = () => {
    if (!price) {
      toast({
        variant: 'error',
        message: { ko: '가격을 입력해주세요', en: 'Please enter a price' },
      });
      return;
    }
    setOpen(false);
    toast({
      variant: 'xp',
      xp: 5,
      message: {
        ko: '가격 등록 +5 XP',
        en: 'Price added +5 XP',
      },
    });
    setPrice('');
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          padding: '0 16px',
          zIndex: 5,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            height: 52,
            borderRadius: 14,
            background: 'var(--color-wine-red)',
            color: 'var(--color-cream)',
            border: 'none',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(139, 26, 42, 0.45)',
          }}
        >
          <Plus size={18} strokeWidth={2} />
          <LocaleText value={{ ko: '내 구매 정보 등록', en: 'Add my purchase info' }} />
        </button>
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)} maxHeight="70%">
        <div
          style={{
            padding: '8px 16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--font-playfair)',
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            <LocaleText value={{ ko: '구매 정보 등록', en: 'Register purchase' }} />
          </h3>

          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            <LocaleText value={{ ko: '가격', en: 'Price' }} />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={pricePlaceholder}
              style={{
                padding: '10px 12px',
                background: 'var(--color-bg-map)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 10,
                color: 'var(--color-cream)',
                fontSize: 14,
                fontFamily: 'var(--font-inter)',
              }}
            />
          </label>

          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            <LocaleText value={{ ko: '매장', en: 'Store' }} />
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              style={{
                padding: '10px 12px',
                background: 'var(--color-bg-map)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 10,
                color: 'var(--color-cream)',
                fontSize: 14,
                fontFamily: 'var(--font-inter)',
              }}
            >
              {STORES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name.ko}
                  {s.branch ? ` · ${s.branch.ko}` : ''}
                </option>
              ))}
            </select>
          </label>

          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            <LocaleText value={{ ko: '구매일', en: 'Purchased at' }} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                padding: '10px 12px',
                background: 'var(--color-bg-map)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 10,
                color: 'var(--color-cream)',
                fontSize: 14,
                fontFamily: 'var(--font-inter)',
              }}
            />
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            aria-label={submitLabel}
            style={{
              marginTop: 4,
              padding: '12px 16px',
              borderRadius: 12,
              border: 'none',
              background: 'var(--color-wine-red)',
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-inter)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <LocaleText value={{ ko: '저장 (+5 XP)', en: 'Save (+5 XP)' }} />
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
