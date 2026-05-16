'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { Route } from 'next';
import { useLocale } from '@/context/locale-context';
import { LocaleText } from '@/components/shared/locale-text';
import { BottomSheet } from '@/components/shared/bottom-sheet';
import { WMBottle } from '@/components/shared/wm-bottle';
import type { Wine } from '@/types';

type Props = {
  open: boolean;
  isoNumeric: string | null;
  wines: Wine[];
  onClose: () => void;
};

/**
 * 국가 선택 시 BottomSheet — 지역 리스트 → 와인 리스트로 drill-down.
 * 디자인 시안의 MapScreen bottom sheet 스타일 적용.
 */
export function CountryDetailPanel({ open, isoNumeric, wines, onClose }: Props) {
  const t = useTranslations('map');
  const { locale } = useLocale();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const countryWines = useMemo(
    () => (isoNumeric ? wines.filter((w) => w.isoNumeric === isoNumeric) : []),
    [wines, isoNumeric],
  );

  const country = countryWines[0]?.country;
  const regions = useMemo(() => {
    const map = new Map<string, { name: import('@/types').LocalizedString; count: number; wines: Wine[] }>();
    countryWines.forEach((w) => {
      const key = w.region.en;
      const cur = map.get(key);
      if (cur) {
        cur.count += 1;
        cur.wines.push(w);
      } else {
        map.set(key, { name: w.region, count: 1, wines: [w] });
      }
    });
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [countryWines]);

  const regionDetail = selectedRegion ? regions.find((r) => r[0] === selectedRegion) : null;

  const onSheetClose = () => {
    setSelectedRegion(null);
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onSheetClose}>
      <div style={{ padding: '0 4px 16px', maxHeight: '62vh', display: 'flex', flexDirection: 'column' }}>
        {!regionDetail ? (
          <>
            {/* 국가 헤더 */}
            <header style={{ padding: '4px 8px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 22,
                    color: 'var(--color-cream)',
                    margin: 0,
                  }}
                >
                  {country ? <LocaleText value={country} /> : <span>{isoNumeric}</span>}
                </h2>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'var(--color-text-muted)' }}>
                  {country?.en ?? ''}
                </span>
                <div style={{ flex: 1 }} />
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: 'rgba(139,26,42,0.25)',
                    color: '#C9A84C',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {locale === 'ko' ? `${countryWines.length}병` : `${countryWines.length} bottles`}
                </span>
              </div>

              {/* 스탯 미니 그리드 */}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {[
                  { l: locale === 'ko' ? '지역' : 'Region', v: String(regions.length) },
                  { l: locale === 'ko' ? '마신' : 'Tasted', v: String(countryWines.length) },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: 10,
                      background: 'var(--color-bg-deep)',
                      border: '1px solid var(--color-border-default)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 10, color: 'var(--color-text-muted)' }}>{s.l}</div>
                    <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, color: 'var(--color-cream)', marginTop: 2 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </header>

            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {regions.map(([key, info]) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setSelectedRegion(key)}
                    style={{
                      all: 'unset',
                      display: 'flex',
                      width: '100%',
                      padding: '12px 12px',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: 'var(--color-bg-deep)',
                      border: '1px solid var(--color-border-default)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--color-cream)' }}>
                        <LocaleText value={info.name} as="span" />
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: 14,
                          color: '#C9A84C',
                          fontWeight: 600,
                        }}
                      >
                        {info.count}
                      </span>
                      {/* chevron right */}
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <header style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 10px' }}>
              <button
                type="button"
                onClick={() => setSelectedRegion(null)}
                aria-label={t('backToRegions')}
                style={{
                  all: 'unset',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter)',
                  fontSize: 12,
                }}
              >
                {/* chevron left */}
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 6-6 6 6 6" />
                </svg>
                {t('backToRegions')}
              </button>
            </header>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, color: 'var(--color-cream)', margin: '0 8px 12px' }}>
              <LocaleText value={regionDetail[1].name} />
            </h2>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {regionDetail[1].wines.map((w) => (
                <li key={w.id}>
                  <Link
                    href={`/wine/${w.id}` as Route}
                    style={{
                      display: 'flex',
                      gap: 10,
                      padding: '8px 10px',
                      background: 'var(--color-bg-deep)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 10,
                      textDecoration: 'none',
                      alignItems: 'center',
                    }}
                  >
                    <WMBottle
                      bottleColor={w.bottleColor}
                      producer={w.producer.ko || w.producer.en}
                      label={w.name.split(' ')[0]}
                      vintage={w.vintage}
                      width={20}
                      height={66}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 12,
                          color: 'var(--color-cream)',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {w.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: 9, color: 'var(--color-text-muted)', marginTop: 2 }}>
                        <LocaleText value={w.producer} as="span" /> · {w.vintage}
                      </div>
                    </div>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
