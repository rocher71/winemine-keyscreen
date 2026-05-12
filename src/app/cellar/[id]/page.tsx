'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { BackHeader } from '@/components/nav/back-header';
import { LocaleText } from '@/components/shared/locale-text';
import { WineLabelArt } from '@/components/shared/wine-label-art';
import { DrinkWindowBadge } from '@/components/cellar/drink-window-badge';
import { DrinkThisButton } from '@/components/cellar/drink-this-button';
import { ReviewCard } from '@/components/wine-detail/review-card';
import { getCellarItem } from '@/lib/mock/cellar';
import { getWine } from '@/lib/mock/wines';
import { getReviewsByWine } from '@/lib/mock/reviews';
import { getDrinkWindow, getDrinkWindowStatus } from '@/lib/drink-window';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { toast } from '@/hooks/use-toast';

export default function CellarItemDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations('cellar');
  const tMeta = useTranslations('cellar.meta');
  const tNotify = useTranslations('cellar.notify');
  const tDw = useTranslations('cellar.drinkWindow');

  useRegisterFeatures('/cellar/[id]', [
    { id: 'cellarDetail.wineHero', labelKo: '와인 헤로', labelEn: 'Wine hero', defaultStatus: 'planned' },
    { id: 'cellarDetail.drinkWindowCard', labelKo: '음용 시점 카드', labelEn: 'Drink window', defaultStatus: 'planned' },
    { id: 'cellarDetail.notifyToggle', labelKo: '알림 토글', labelEn: 'Notify toggle', defaultStatus: 'planned' },
    { id: 'cellarDetail.metaGrid', labelKo: '메타 그리드', labelEn: 'Meta grid', defaultStatus: 'planned' },
    { id: 'cellarDetail.drinkThis', labelKo: '마시기 CTA', labelEn: 'Drink-this CTA', defaultStatus: 'planned' },
    { id: 'cellarDetail.reviews', labelKo: '리뷰 섹션', labelEn: 'Reviews', defaultStatus: 'planned' },
  ]);

  const item = getCellarItem(params.id);
  const wine = item ? getWine(item.wineId) : null;

  const [notify, setNotify] = useState<boolean>(item?.notifyAtPeak ?? false);

  const reviews = useMemo(() => (wine ? getReviewsByWine(wine.id).slice(0, 3) : []), [wine]);
  const dw = useMemo(() => (wine ? getDrinkWindow(wine) : null), [wine]);
  const status = wine ? getDrinkWindowStatus(wine) : null;

  if (!item || !wine || !dw || !status) {
    return (
      <>
        <BackHeader />
        <main className="wm-scroll-area">
          <div style={{ padding: 24, color: 'var(--color-text-muted)' }}>
            <LocaleText value={{ ko: '셀러 항목을 찾을 수 없어요', en: 'Cellar item not found' }} />
          </div>
        </main>
      </>
    );
  }

  const currentYear = new Date().getFullYear();
  const yearsToPeak = dw.peak - currentYear;

  return (
    <>
      <BackHeader title={wine.name} />
      <main
        className="wm-scroll-area"
        style={{ paddingBottom: 96, display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {/* Wine Hero 240px */}
        <section
          data-feature-id="cellarDetail.wineHero"
          style={{
            position: 'relative',
            padding: '0 16px 8px',
          }}
        >
          <div
            style={{
              height: 240,
              borderRadius: 18,
              background: `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 70%)`,
              overflow: 'hidden',
              border: '1px solid var(--color-border-default)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WineLabelArt
              initial={wine.name.charAt(0)}
              bottleColor={wine.bottleColor}
              width={100}
              height={150}
              rounded={8}
            />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 24,
              color: 'var(--color-cream)',
              margin: '12px 0 4px',
            }}
          >
            {wine.name}
          </h1>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              color: 'var(--color-text-secondary)',
            }}
          >
            <LocaleText value={wine.producer} /> · {wine.vintage}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              marginTop: 2,
            }}
          >
            <LocaleText value={wine.region} /> · <LocaleText value={wine.country} />
          </div>
        </section>

        {/* Drink Window Card */}
        <section
          data-feature-id="cellarDetail.drinkWindowCard"
          style={{
            margin: '0 16px',
            padding: 16,
            borderRadius: 16,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <DrinkWindowBadge status={status} fromYear={dw.from} />
            <div
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 11,
                color: 'var(--color-text-muted)',
              }}
            >
              {tDw('fromTo', { from: dw.from, to: dw.to })}
            </div>
          </div>
          <DrinkWindowTimeline from={dw.from} peak={dw.peak} to={dw.to} now={currentYear} />
          <div
            style={{
              marginTop: 12,
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
            }}
          >
            {tDw('tip', { year: dw.peak })}
            {yearsToPeak > 0 && (
              <span style={{ color: 'var(--color-gold)', marginLeft: 6 }}>
                · {tDw('peakInYears', { n: yearsToPeak })}
              </span>
            )}
          </div>
        </section>

        {/* Notify toggle */}
        <section
          data-feature-id="cellarDetail.notifyToggle"
          style={{
            margin: '0 16px',
            padding: '14px 16px',
            borderRadius: 14,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              color: 'var(--color-cream)',
              fontWeight: 500,
            }}
          >
            {tNotify('label')}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={notify}
            onClick={() => {
              const next = !notify;
              setNotify(next);
              toast({
                message: next
                  ? { ko: tNotify('toggledOn'), en: tNotify('toggledOn') }
                  : { ko: tNotify('toggledOff'), en: tNotify('toggledOff') },
              });
            }}
            style={{
              position: 'relative',
              width: 44,
              height: 26,
              borderRadius: 13,
              background: notify ? 'var(--color-gold)' : 'var(--color-border-default)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 200ms',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                left: notify ? 21 : 3,
                width: 20,
                height: 20,
                borderRadius: 10,
                background: 'var(--color-cream)',
                transition: 'left 200ms',
              }}
            />
          </button>
        </section>

        {/* Meta Grid 2x2 */}
        <section
          data-feature-id="cellarDetail.metaGrid"
          style={{
            margin: '0 16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          <MetaCard label={tMeta('storage')} value={tMeta(`storage${capitalize(item.storage)}`)} />
          <MetaCard label={tMeta('acquiredAt')} value={item.acquiredAt.slice(0, 10)} />
          <MetaCard
            label={tMeta('price')}
            value={item.purchasePriceKrw ? `₩${item.purchasePriceKrw.toLocaleString()}` : '—'}
          />
          <MetaCard
            label={tMeta('memo')}
            value={item.notes ? '' : tMeta('memoEmpty')}
            localizedValue={item.notes ?? undefined}
          />
        </section>

        {/* Community reviews */}
        {reviews.length > 0 && (
          <section
            data-feature-id="cellarDetail.reviews"
            style={{ margin: '0 16px' }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: 14,
                color: 'var(--color-cream)',
                margin: '0 0 8px',
              }}
            >
              {t('communityReviews')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
            <Link
              href={`/wine/${wine.id}` as Route}
              style={{
                display: 'inline-block',
                marginTop: 12,
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {t('viewWineDetails')} →
            </Link>
          </section>
        )}
      </main>

      {/* DrinkThis Bottom Fixed */}
      <div
        data-feature-id="cellarDetail.drinkThis"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 16px 18px',
          background:
            'linear-gradient(180deg, rgba(5,2,10,0) 0%, rgba(5,2,10,0.95) 60%)',
          zIndex: 10,
        }}
      >
        <DrinkThisButton cellarItemId={item.id} />
      </div>
    </>
  );
}

function MetaCard({
  label,
  value,
  localizedValue,
}: {
  label: string;
  value: string;
  localizedValue?: import('@/types').LocalizedString;
}) {
  return (
    <div
      style={{
        padding: '12px 14px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 12,
        minHeight: 64,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
          color: 'var(--color-cream)',
          fontWeight: 500,
        }}
      >
        {localizedValue ? <LocaleText value={localizedValue} /> : value}
      </div>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function DrinkWindowTimeline({
  from,
  peak,
  to,
  now,
}: {
  from: number;
  peak: number;
  to: number;
  now: number;
}) {
  // 현재 시점의 가로 위치 (0~100%)
  const total = to - from;
  const nowPct = total > 0 ? Math.max(0, Math.min(100, ((now - from) / total) * 100)) : 50;
  const peakPct = total > 0 ? ((peak - from) / total) * 100 : 50;

  return (
    <div style={{ position: 'relative', height: 28 }}>
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 0,
          right: 0,
          height: 4,
          borderRadius: 2,
          background:
            'linear-gradient(90deg, rgba(155,139,122,0.3) 0%, var(--color-gold) 45%, var(--color-wine-red) 50%, var(--color-gold) 55%, rgba(155,139,122,0.3) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: `${peakPct}%`,
          width: 2,
          height: 16,
          background: 'var(--color-wine-red)',
          transform: 'translateX(-50%)',
        }}
        aria-hidden
      />
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: `${nowPct}%`,
          width: 12,
          height: 12,
          borderRadius: 6,
          background: 'var(--color-cream)',
          border: '2px solid var(--color-bg-deepest)',
          transform: 'translateX(-50%)',
          marginTop: 4,
        }}
        aria-label={`current ${now}`}
      />
      <div
        style={{
          position: 'absolute',
          top: 22,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-inter)',
          fontSize: 10,
          color: 'var(--color-text-muted)',
        }}
      >
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
}
