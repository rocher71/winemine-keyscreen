'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { BackHeader } from '@/components/nav/back-header';
import { BottomSheet } from '@/components/shared/bottom-sheet';
import { LocaleText } from '@/components/shared/locale-text';
import { SourcePicker } from '@/components/tasting-note/source-picker';
import { useMockUser } from '@/hooks/use-mock-user';
import { getCellarByUser } from '@/lib/mock/cellar';
import { getWine } from '@/lib/mock/wines';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import type { TastingNoteSource } from '@/types';

export default function NewNoteSourcePage() {
  const t = useTranslations('notes.source');
  const router = useRouter();
  const { user } = useMockUser();
  const cellar = getCellarByUser(user.id);
  const [pickOpen, setPickOpen] = useState(false);

  useRegisterFeatures('/notes/new', [
    { id: 'notes.sourcePicker', labelKo: '출처 선택', labelEn: 'Source picker', defaultStatus: 'planned' },
  ]);

  const onPick = (source: TastingNoteSource) => {
    if (source === 'newEntry') {
      router.push('/notes/new/write?from=newEntry' as Route);
      return;
    }
    setPickOpen(true);
  };

  return (
    <>
      <BackHeader title={t('title')} />
      <main className="wm-scroll-area" style={{ padding: '12px 16px' }}>
        <div data-feature-id="notes.sourcePicker">
          <SourcePicker cellarCount={cellar.length} onPick={onPick} />
        </div>
      </main>

      <BottomSheet open={pickOpen} onClose={() => setPickOpen(false)}>
        <div style={{ padding: '0 4px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 18,
              color: 'var(--color-cream)',
              margin: '4px 8px 12px',
            }}
          >
            {t('cellarListTitle')}
          </h2>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              maxHeight: '50vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {cellar.map((it) => {
              const wine = getWine(it.wineId);
              if (!wine) return null;
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => {
                      router.push(
                        `/notes/new/write?from=cellar&itemId=${encodeURIComponent(it.id)}` as Route,
                      );
                    }}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      padding: 10,
                      width: '100%',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 10,
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        width: 32,
                        height: 44,
                        borderRadius: 4,
                        background: `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 70%)`,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: 13,
                          color: 'var(--color-cream)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {wine.name}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 11,
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {wine.vintage} · <LocaleText value={wine.region} />
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </BottomSheet>
    </>
  );
}
