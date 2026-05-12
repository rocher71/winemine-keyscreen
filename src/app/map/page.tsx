'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Filter } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { useMockUser } from '@/hooks/use-mock-user';
import { useAppMode } from '@/context/app-mode-context';
import { getTastingNotesByUser } from '@/lib/mock/tasting-notes';
import { getCellarByUser } from '@/lib/mock/cellar';
import { getWine } from '@/lib/mock/wines';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { CountryDetailPanel } from '@/components/map/country-detail-panel';
import { MapLegend } from '@/components/map/map-legend';
import { EmptyState } from '@/components/shared/empty-state';
import { PrimaryButton } from '@/components/shared/primary-button';
import { Globe2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
    >
      ...
    </div>
  ),
});

export default function MapPage() {
  const t = useTranslations('map');
  const { user } = useMockUser();
  const { demoMode } = useAppMode();
  const router = useRouter();
  const [selectedIso, setSelectedIso] = useState<string | null>(null);

  useRegisterFeatures('/map', [
    { id: 'map.fullWorldMap', labelKo: '월드맵', labelEn: 'World map', defaultStatus: 'planned' },
    { id: 'map.legend', labelKo: '범례', labelEn: 'Legend', defaultStatus: 'planned' },
    { id: 'map.countrySheet', labelKo: '국가 상세', labelEn: 'Country sheet', defaultStatus: 'planned' },
  ]);

  // 헤비: 마신 와인 + 셀러 와인을 지도에 표시
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
      <BackHeader title={t('title')}>
        <button
          type="button"
          onClick={() => toast({ message: t('filterToast') })}
          aria-label={t('filterLabel')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          <Filter size={20} strokeWidth={1.75} />
        </button>
      </BackHeader>

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
              top: '40%',
              left: 16,
              right: 16,
              padding: 20,
              borderRadius: 16,
              background: 'rgba(15,7,24,0.92)',
              border: '1px solid var(--color-border-default)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <EmptyState
              illustration={<Globe2 size={42} strokeWidth={1.25} />}
              title={t('emptyTitle')}
              action={
                <PrimaryButton onClick={() => router.push('/capture')} variant="primary">
                  {t('emptyCta')}
                </PrimaryButton>
              }
            />
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
