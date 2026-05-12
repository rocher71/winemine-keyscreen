'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { ChevronRight, Sparkles, Flame, Globe2, Star, MapPin } from 'lucide-react';
import { useLocale } from '@/context/locale-context';
import { useLocalizedText } from '@/components/shared/locale-text';
import { getFeaturedWines, WINES } from '@/lib/mock/wines';
import { getExternalRating } from '@/lib/mock/external-ratings';
import { getPurchasesByWine } from '@/lib/mock/purchases';
import type { Wine } from '@/types';

/**
 * 홈 와인 피드 — 다양한 와인을 리스트뷰로 노출.
 *
 * 두 가지 탭:
 *  - "추천 / Featured"   — FEATURED_WINE_IDS (12종 큐레이션)
 *  - "트렌딩 / Trending" — 최근 가격 등록(Purchase)이 많은 와인 상위
 *  - "탐험 / Explore"   — region/wineType 다양화 sample
 *
 * 카드 클릭 시 /wine/[id]로 이동. Phase 3에서 실제 추천 알고리즘으로 교체.
 */

type FeedTab = 'featured' | 'trending' | 'explore';

const TABS: { key: FeedTab; icon: React.ReactNode }[] = [
  { key: 'featured', icon: <Sparkles size={13} /> },
  { key: 'trending', icon: <Flame size={13} /> },
  { key: 'explore', icon: <Globe2 size={13} /> },
];

export function WineFeed() {
  const t = useTranslations('home.wineFeed');
  const [tab, setTab] = useState<FeedTab>('featured');

  const items: Wine[] = useMemo(() => {
    switch (tab) {
      case 'featured':
        return getFeaturedWines();
      case 'trending':
        return [...WINES]
          .map((w) => ({ w, count: getPurchasesByWine(w.id).length }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8)
          .map((x) => x.w);
      case 'explore': {
        /* region 다양화 — 같은 region이 최대 1번만 노출 */
        const seen = new Set<string>();
        const picked: Wine[] = [];
        for (const w of WINES) {
          const key = w.region.en;
          if (seen.has(key)) continue;
          seen.add(key);
          picked.push(w);
          if (picked.length >= 10) break;
        }
        return picked;
      }
    }
  }, [tab]);

  return (
    <section
      data-feature-id="home.wineFeed"
      style={{ marginTop: 24 }}
    >
      {/* 섹션 헤더 */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 20px 8px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 18,
            color: 'var(--color-cream)',
            margin: 0,
          }}
        >
          {t('heading')}
        </h2>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
          }}
        >
          {t('subtitle')}
        </span>
      </div>

      {/* 탭 칩 */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '0 20px 10px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {TABS.map((opt) => {
          const active = tab === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setTab(opt.key)}
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 11px 5px 9px',
                borderRadius: 14,
                border: active ? '1px solid var(--color-gold)' : '1px solid var(--color-border-default)',
                background: active ? 'rgba(201, 168, 76, 0.12)' : 'transparent',
                color: active ? 'var(--color-gold)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-inter)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {opt.icon}
              {t(`tabs.${opt.key}`)}
            </button>
          );
        })}
      </div>

      {/* 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px' }}>
        {items.map((wine) => (
          <WineFeedRow key={wine.id} wine={wine} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────── Feed Row ─────────────────────── */

function WineFeedRow({ wine }: { wine: Wine }) {
  const { locale } = useLocale();
  const producer = useLocalizedText(wine.producer);
  const region = useLocalizedText(wine.region);
  const country = useLocalizedText(wine.country);
  const grapes = wine.grapes.map((g) => g[locale]).join(', ');
  const rating = getExternalRating(wine.id);
  const purchases = getPurchasesByWine(wine.id);
  const avgKrw =
    purchases.length > 0
      ? Math.round(purchases.reduce((sum, p) => sum + p.priceKrw, 0) / purchases.length)
      : wine.averagePriceKrw;

  return (
    <Link
      href={`/wine/${wine.id}` as Route}
      style={{
        display: 'flex',
        gap: 12,
        padding: 12,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 12,
        textDecoration: 'none',
        color: 'inherit',
        alignItems: 'stretch',
      }}
    >
      {/* 라벨 일러 */}
      <BottleThumb wine={wine} />

      {/* 메타 */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 15,
            color: 'var(--color-cream)',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {wine.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {producer} · {wine.vintage}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <MapPin size={10} strokeWidth={1.75} />
          {region}, {country}
        </div>
        {grapes && (
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 10,
              color: 'var(--color-text-muted)',
              opacity: 0.85,
              marginTop: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {grapes}
          </div>
        )}
      </div>

      {/* 우측: 별점 + 가격 + chevron */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexShrink: 0,
          minWidth: 70,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
          {rating?.vivino && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                fontFamily: 'var(--font-inter)',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--color-gold)',
              }}
            >
              <Star size={11} fill="var(--color-gold)" strokeWidth={0} />
              {rating.vivino.score.toFixed(1)}
            </span>
          )}
          <span
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 13,
              color: 'var(--color-cream)',
              whiteSpace: 'nowrap',
            }}
          >
            ₩{formatKrwShort(avgKrw, locale)}
          </span>
        </div>
        <ChevronRight size={16} color="var(--color-text-muted)" />
      </div>
    </Link>
  );
}

/* ─────────────────────── Bottle thumb ─────────────────────── */

function BottleThumb({ wine }: { wine: Wine }) {
  return (
    <div
      aria-hidden
      style={{
        width: 48,
        height: 64,
        flexShrink: 0,
        borderRadius: 6,
        background: `linear-gradient(180deg, ${wine.bottleColor} 0%, #0a0508 100%)`,
        position: 'relative',
        border: '1px solid rgba(245,240,232,0.05)',
        overflow: 'hidden',
      }}
    >
      {/* 라벨 */}
      <div
        style={{
          position: 'absolute',
          left: 6,
          right: 6,
          top: 26,
          bottom: 6,
          background: '#f5f0e8',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3a1418',
          fontFamily: 'var(--font-playfair)',
          fontSize: 8,
          fontWeight: 700,
          padding: '0 2px',
          textAlign: 'center',
          lineHeight: 1,
        }}
      >
        {initials(wine)}
      </div>
      {/* 캡슐 */}
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          top: 0,
          height: 20,
          background: '#0a0508',
        }}
      />
    </div>
  );
}

function initials(wine: Wine): string {
  /* 이름 또는 생산자에서 2~3 글자 추출 — 한글이 아닌 경우만 */
  const src = wine.producer.en || wine.name;
  const words = src.split(/[\s,·]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function formatKrwShort(krw: number, locale: 'ko' | 'en'): string {
  /* k/M 단위는 양 locale 공통 — 한글 단위는 i18n 누출 정책상 사용 X */
  if (krw >= 1_000_000) return `${(krw / 1_000_000).toFixed(1)}M`;
  if (krw >= 1_000) return `${Math.round(krw / 1_000)}k`;
  return krw.toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US');
}
