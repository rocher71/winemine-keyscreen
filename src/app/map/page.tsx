'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BottomNav } from '@/components/nav/bottom-nav';
import { useMockUser } from '@/hooks/use-mock-user';
import { useAppMode } from '@/context/app-mode-context';
import { getTastingNotesByUser } from '@/lib/mock/tasting-notes';
import { getCellarByUser } from '@/lib/mock/cellar';
import { getWine } from '@/lib/mock/wines';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { CountryDetailPanel } from '@/components/map/country-detail-panel';
import { MapLegend } from '@/components/map/map-legend';
import { PrimaryButton } from '@/components/shared/primary-button';
import { toast } from '@/hooks/use-toast';
import { useLocalizedText } from '@/components/shared/locale-text';
import { getUnreadCount } from '@/lib/mock/notifications';

const FullWorldMap = dynamic(() => import('@/components/map/full-world-map'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        background: 'var(--color-bg-map)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-inter)',
        fontSize: 13,
      }}
    />
  ),
});

type FilterKey = 'all' | 'tasted' | 'cellar' | 'favorite';

const FILTER_LABELS: Record<FilterKey, { ko: string; en: string }> = {
  all:      { ko: '전체',     en: 'All' },
  tasted:   { ko: '마신 와인', en: 'Tasted' },
  cellar:   { ko: '셀러',     en: 'Cellar' },
  favorite: { ko: '즐겨찾기',  en: 'Favorites' },
};
const FILTER_KEYS: FilterKey[] = ['all', 'tasted', 'cellar', 'favorite'];

export default function MapPage() {
  const t = useTranslations('map');
  const { user } = useMockUser();
  const { demoMode } = useAppMode();
  const router = useRouter();
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const avatar = useLocalizedText(user.avatarInitial);
  const unread = getUnreadCount(user.id);

  useRegisterFeatures('/map', [
    { id: 'map.fullWorldMap', labelKo: '월드맵', labelEn: 'World map', defaultStatus: 'planned' },
    { id: 'map.legend', labelKo: '범례', labelEn: 'Legend', defaultStatus: 'planned' },
    { id: 'map.countrySheet', labelKo: '국가 상세', labelEn: 'Country sheet', defaultStatus: 'planned' },
  ]);

  const wines = useMemo(() => {
    if (demoMode !== 'heavy') return [];
    const tasted = getTastingNotesByUser(user.id)
      .map((n) => getWine(n.wineId))
      .filter((w): w is NonNullable<typeof w> => w != null);
    const cellar = getCellarByUser(user.id)
      .map((c) => getWine(c.wineId))
      .filter((w): w is NonNullable<typeof w> => w != null);
    const map = new Map<string, NonNullable<ReturnType<typeof getWine>>>();
    [...tasted, ...cellar].forEach((w) => map.set(w.id, w));
    return Array.from(map.values());
  }, [user.id, demoMode]);

  const isFirstTime = demoMode !== 'heavy';

  return (
    <>
      {/* 필터 바 */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '10px 16px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
          background: 'var(--color-bg-deep)',
          borderBottom: '0.5px solid var(--color-border-default)',
        }}
      >
        {FILTER_KEYS.map((key) => {
          const on = activeFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setActiveFilter(key);
                if (key !== 'all') toast({ message: t('filterToast') });
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                background: on ? 'rgba(201,168,76,0.15)' : 'var(--color-surface)',
                border: `1px solid ${on ? '#C9A84C' : 'var(--color-border-default)'}`,
                color: on ? '#C9A84C' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-inter)',
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {FILTER_LABELS[key].ko}
            </button>
          );
        })}

        {/* 슬라이더/필터 아이콘 버튼 */}
        <button
          type="button"
          onClick={() => toast({ message: t('filterToast') })}
          aria-label={t('filterLabel')}
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            flexShrink: 0,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {/* sliders icon */}
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 6h12M20 6h0M4 12h4M12 12h8M4 18h12M20 18h0" />
            <circle cx="18" cy="6" r="2" />
            <circle cx="10" cy="12" r="2" />
            <circle cx="18" cy="18" r="2" />
          </svg>
        </button>
      </div>

      <main
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--color-bg-map)',
        }}
      >
        <div
          data-feature-id="map.fullWorldMap"
          style={{ position: 'absolute', inset: 0 }}
        >
          <FullWorldMap wines={wines} onCountrySelect={setSelectedIso} />
        </div>
        <div data-feature-id="map.legend">
          <MapLegend />
        </div>

        {isFirstTime && (
          <div
            style={{
              position: 'absolute',
              top: '38%',
              left: 20,
              right: 20,
              padding: 24,
              borderRadius: 16,
              background: 'rgba(15,7,24,0.92)',
              border: '1px solid rgba(201,168,76,0.35)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* 카메라 아이콘 */}
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
              <path d="M3 8h3l2-2h8l2 2h3v12H3z" />
              <circle cx="12" cy="14" r="3.5" />
            </svg>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 18,
                color: 'var(--color-cream)',
                marginTop: 10,
              }}
            >
              {t('emptyTitle')}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 11,
                color: 'var(--color-text-muted)',
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              사진 한 장이면 와인 정보가 자동 채워지고, 마신 국가가 지도에 칠해집니다
            </div>
            <div style={{ marginTop: 14 }}>
              <PrimaryButton onClick={() => router.push('/capture')} variant="primary">
                {t('emptyCta')}
              </PrimaryButton>
            </div>
          </div>
        )}

        <div data-feature-id="map.countrySheet">
          <CountryDetailPanel
            open={selectedIso !== null}
            isoNumeric={selectedIso}
            wines={wines}
            onClose={() => setSelectedIso(null)}
          />
        </div>
      </main>

      <BottomNav />
    </>
  );
}
