'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BackHeader } from '@/components/nav/back-header';
import { NoteWriteBeginner } from '@/components/tasting-note/note-write-beginner';
import { NoteWriteExpert } from '@/components/tasting-note/note-write-expert';
import { useExperience } from '@/context/experience-context';
import { useMockUser } from '@/hooks/use-mock-user';
import { getCellarItem } from '@/lib/mock/cellar';
import { getWine } from '@/lib/mock/wines';
import { useLocale } from '@/context/locale-context';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import type { FormVariant } from '@/lib/tasting-note-lexicon';
import type { Wine } from '@/types';

function variantFromWineType(t: Wine['wineType']): FormVariant {
  if (t === 'white') return 'white';
  if (t === 'sparkling') return 'sparkling';
  return 'red';
}

function NoteWriteInner() {
  const params = useSearchParams();
  const { experience } = useExperience();
  const { user } = useMockUser();
  const { locale } = useLocale();
  const t = useTranslations('notes.write');

  useRegisterFeatures('/notes/new/write', [
    { id: 'noteWrite.modeContainer', labelKo: '모드 컨테이너', labelEn: 'Mode container', defaultStatus: 'planned' },
  ]);

  const from = params.get('from');
  const itemId = params.get('itemId');
  const wineIdParam = params.get('wineId');

  const { wine, variant } = useMemo(() => {
    if (from === 'cellar' && itemId) {
      const item = getCellarItem(itemId);
      const w: Wine | null = item ? (getWine(item.wineId) ?? null) : null;
      return {
        wine: w,
        variant: w ? variantFromWineType(w.wineType) : ('red' as FormVariant),
      };
    }
    /* from=newEntry — capture/캡쳐 결과에서 wineId 파라미터로 와인 ID 전달받은 경우 */
    if (wineIdParam) {
      const w = getWine(wineIdParam) ?? null;
      return {
        wine: w,
        variant: w ? variantFromWineType(w.wineType) : ('red' as FormVariant),
      };
    }
    return { wine: null as Wine | null, variant: 'red' as FormVariant };
  }, [from, itemId, wineIdParam]);

  const wineName = wine?.name ?? '';
  const producer = wine ? (locale === 'en' ? wine.producer.en : wine.producer.ko) : '';

  return (
    <>
      <BackHeader title={t('title')} />
      <main
        className="wm-scroll-area"
        data-feature-id="noteWrite.modeContainer"
        style={{ padding: '12px 16px 24px' }}
      >
        {experience === 'expert' ? (
          <NoteWriteExpert
            initialVariant={variant}
            wine={wine}
            userLevelId={user.levelId}
            blindAnswer={null}
          />
        ) : (
          <NoteWriteBeginner variant={variant} wineName={wineName} producer={producer} wine={wine} />
        )}
      </main>
    </>
  );
}

export default function NoteWritePage() {
  return (
    <Suspense fallback={null}>
      <NoteWriteInner />
    </Suspense>
  );
}
