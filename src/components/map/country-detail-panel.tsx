'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { Route } from 'next';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { LocaleText } from '@/components/shared/locale-text';
import { BottomSheet } from '@/components/shared/bottom-sheet';
import type { Wine } from '@/types';

type Props = {
  open: boolean;
  isoNumeric: string | null;
  wines: Wine[];
  onClose: () => void;
};

/**
 * 국가 선택 시 BottomSheet — 지역 리스트 → 와인 리스트로 drill-down.
 */
export function CountryDetailPanel({ open, isoNumeric, wines, onClose }: Props) {
  const t = useTranslations('map');
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
      <div style={{ padding: '0 4px 12px', maxHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
        {!regionDetail ? (
          <>
            <header style={{ padding: '4px 8px 12px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 20,
                  color: 'var(--color-cream)',
                  margin: 0,
                }}
              >
                {country ? (
                  <LocaleText value={country} />
                ) : (
                  <span>{isoNumeric}</span>
                )}
                <span style={{ color: 'var(--color-text-muted)', marginLeft: 8, fontSize: 14 }}>
                  · {countryWines.length}
                </span>
              </h2>
              <div
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 12,
                  color: 'var(--color-text-muted)',
                  marginTop: 2,
                }}
              >
                {t('regionsTitle')}
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
                      background: 'rgba(45,21,64,0.25)',
                      border: '1px solid var(--color-border-default)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <LocaleText
                        value={info.name}
                        as="span"
                        className="wm-card-title"
                      />
                      <span
                        style={{
                          color: 'var(--color-text-muted)',
                          fontFamily: 'var(--font-inter)',
                          fontSize: 12,
                        }}
                      >
                        {info.count}
                      </span>
                    </div>
                    <ChevronRight size={16} color="var(--color-text-muted)" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 8px 10px',
              }}
            >
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
                <ChevronLeft size={16} />
                {t('backToRegions')}
              </button>
            </header>
            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 20,
                color: 'var(--color-cream)',
                margin: '0 8px 8px',
              }}
            >
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
                      padding: 10,
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 10,
                      textDecoration: 'none',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        width: 36,
                        height: 48,
                        borderRadius: 6,
                        background: `linear-gradient(160deg, ${w.bottleColor} 0%, #1a0a1e 70%)`,
                        flexShrink: 0,
                        border: '1px solid rgba(201,168,76,0.18)',
                      }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: 14,
                          color: 'var(--color-cream)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {w.name}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 11,
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {w.vintage}
                      </div>
                    </div>
                    <Star size={14} color="var(--color-gold)" />
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
