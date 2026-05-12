'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { Camera, Search } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { EmptyState } from '@/components/shared/empty-state';
import { PrimaryButton } from '@/components/shared/primary-button';
import { BottomSheet } from '@/components/shared/bottom-sheet';
import { LocaleText } from '@/components/shared/locale-text';
import { PhotoCard } from '@/components/photos/photo-card';
import { useMockUser } from '@/hooks/use-mock-user';
import { getLabelPhotosByUser } from '@/lib/mock/label-photos';
import { getWine } from '@/lib/mock/wines';
import { getCellarItem } from '@/lib/mock/cellar';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { toast } from '@/hooks/use-toast';
import type { LabelPhoto } from '@/types';

type FilterKey = 'all' | 'thisYear' | 'inCellar' | 'tasted' | 'byRegion' | 'unmatched';

export default function PhotosPage() {
  const t = useTranslations('photos');
  const tFilters = useTranslations('photos.filters');
  const tSheet = useTranslations('photos.sheet');
  const router = useRouter();
  const { user } = useMockUser();
  const all = getLabelPhotosByUser(user.id);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selected, setSelected] = useState<LabelPhoto | null>(null);

  useRegisterFeatures('/photos', [
    { id: 'photos.filterBar', labelKo: '필터 바', labelEn: 'Filter bar', defaultStatus: 'planned' },
    { id: 'photos.grid', labelKo: '사진 그리드', labelEn: 'Photo grid', defaultStatus: 'planned' },
  ]);

  const items = useMemo(() => {
    const year = new Date().getFullYear();
    switch (filter) {
      case 'thisYear':
        return all.filter((p) => new Date(p.capturedAt).getFullYear() === year);
      case 'inCellar':
        return all.filter((p) => p.linkedCellarItemId != null);
      case 'tasted':
        return all.filter((p) => p.linkedTastingNoteId != null);
      case 'unmatched':
        return all.filter((p) => p.wineId == null);
      case 'byRegion':
      case 'all':
      default:
        return all;
    }
  }, [all, filter]);

  return (
    <>
      <BackHeader title={t('title')}>
        <button
          type="button"
          onClick={() => toast({ message: t('searchToast') })}
          aria-label="Search"
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
          <Search size={20} strokeWidth={1.75} />
        </button>
      </BackHeader>
      <main className="wm-scroll-area">
        {all.length === 0 ? (
          <EmptyState
            illustration={<Camera size={56} strokeWidth={1.25} />}
            title={t('empty.title')}
            description={t('empty.sub')}
            action={
              <PrimaryButton onClick={() => router.push('/capture')}>
                {t('empty.cta')}
              </PrimaryButton>
            }
          />
        ) : (
          <>
            <div
              data-feature-id="photos.filterBar"
              style={{
                display: 'flex',
                gap: 8,
                padding: '8px 16px 12px',
                overflowX: 'auto',
              }}
            >
              {(['all', 'thisYear', 'inCellar', 'tasted', 'byRegion', 'unmatched'] as FilterKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 12px',
                    background: filter === k ? 'var(--color-wine-red)' : 'transparent',
                    color: filter === k ? 'var(--color-cream)' : 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 16,
                    fontFamily: 'var(--font-inter)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tFilters(k)}
                </button>
              ))}
            </div>
            <div
              data-feature-id="photos.grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 4,
              }}
            >
              {items.map((p) => (
                <PhotoCard key={p.id} photo={p} onClick={() => setSelected(p)} />
              ))}
            </div>
            <div style={{ height: 24 }} />
          </>
        )}
      </main>
      <BottomNav />

      <BottomSheet open={selected !== null} onClose={() => setSelected(null)}>
        {selected && <PhotoSheetContent photo={selected} onClose={() => setSelected(null)} />}
      </BottomSheet>
    </>
  );

  function PhotoSheetContent({ photo, onClose }: { photo: LabelPhoto; onClose: () => void }) {
    const wine = photo.wineId ? getWine(photo.wineId) : null;
    const cellarItem = photo.linkedCellarItemId ? getCellarItem(photo.linkedCellarItemId) : null;
    return (
      <div style={{ padding: '0 8px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          aria-hidden
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            background: `linear-gradient(160deg, ${wine?.bottleColor ?? '#3f0f1f'} 0%, #1a0a1e 80%)`,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-playfair)',
            fontSize: 84,
            color: 'var(--color-cream)',
            opacity: 0.7,
          }}
        >
          {wine ? wine.name.charAt(0) : '?'}
        </div>
        {wine ? (
          <>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 18,
                color: 'var(--color-cream)',
              }}
            >
              {wine.name} · {wine.vintage}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                color: 'var(--color-text-muted)',
              }}
            >
              <LocaleText value={wine.region} /> · <LocaleText value={wine.country} />
            </div>
            <PrimaryButton
              variant="primary"
              block
              onClick={() => {
                onClose();
                router.push(`/wine/${wine.id}` as Route);
              }}
            >
              {tSheet('viewWine')}
            </PrimaryButton>
            {cellarItem && (
              <PrimaryButton
                variant="secondary"
                block
                onClick={() => {
                  onClose();
                  router.push(`/cellar/${cellarItem.id}` as Route);
                }}
              >
                {tSheet('matched')}
              </PrimaryButton>
            )}
          </>
        ) : (
          <>
            <div
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 13,
                color: 'var(--color-text-muted)',
                textAlign: 'center',
              }}
            >
              {tSheet('unmatched')}
            </div>
            <PrimaryButton
              variant="secondary"
              block
              onClick={() => toast({ message: tSheet('linkWine') })}
            >
              {tSheet('linkWine')}
            </PrimaryButton>
          </>
        )}
        <PrimaryButton
          variant="danger"
          block
          onClick={() => toast({ message: tSheet('deleteConfirm') })}
        >
          {tSheet('delete')}
        </PrimaryButton>
      </div>
    );
  }
}
