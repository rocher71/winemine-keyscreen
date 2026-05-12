'use client';

import { LocaleText } from '@/components/shared/locale-text';
import type { Purchase } from '@/types';

type Props = {
  purchases: Purchase[];
  /** 폴백 — purchases 없을 때 wine.averagePriceKrw 사용 */
  fallbackKrw?: number;
};

/**
 * 평균 구매가 pill — wine_detail_page의 미니 카드.
 * 좌: "평균 구매가 / Average price"
 * 우: "₩{krw} / ${usd}"
 * 하: "{n}건 등록 / {n} entries"
 */
export function AveragePricePill({ purchases, fallbackKrw }: Props) {
  const count = purchases.length;
  const avgKrw =
    count > 0
      ? Math.round(purchases.reduce((s, p) => s + p.priceKrw, 0) / count)
      : fallbackKrw ?? 0;
  const approxUsd = avgKrw ? Math.round(avgKrw / 1380) : 0;

  return (
    <section
      style={{
        margin: '0 16px',
        padding: 14,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          <LocaleText value={{ ko: '평균 구매가', en: 'Average price' }} />
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
          }}
        >
          <LocaleText
            value={{
              ko: `${count}건 등록`,
              en: `${count} ${count === 1 ? 'entry' : 'entries'}`,
            }}
          />
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-cream)',
            lineHeight: 1.1,
          }}
        >
          ₩{avgKrw.toLocaleString()}
        </div>
        {approxUsd > 0 && (
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
            }}
          >
            ≈ ${approxUsd.toLocaleString()}
          </div>
        )}
      </div>
    </section>
  );
}
