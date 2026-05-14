'use client';

import { ChevronLeft, Plus, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { useLocale } from '@/context/locale-context';
import { WINES } from '@/lib/mock/wines';

const PALETTE = ['#1a0a1e', '#2a141c', '#3a1a26', '#1a0a1e', '#2a141c', '#3a1a26'] as const;

export default function NewAlbumPage() {
  const { locale } = useLocale();
  const router = useRouter();

  useRegisterFeatures('/community/new/album', [
    { id: 'album.grid', labelKo: '사진 그리드', labelEn: 'Photo grid', defaultStatus: 'planned' },
    { id: 'album.caption', labelKo: '캡션', labelEn: 'Caption', defaultStatus: 'planned' },
    { id: 'album.wines', labelKo: '태그된 와인', labelEn: 'Tagged wines', defaultStatus: 'planned' },
    { id: 'album.location', labelKo: '장소 핀', labelEn: 'Location pin', defaultStatus: 'planned' },
  ]);

  return (
    <>
      {/* Header */}
      <div
        style={{
          padding: '8px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '0.5px solid var(--color-border-default)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>
        <div
          style={{
            flex: 1,
            fontFamily: 'var(--font-playfair)',
            fontSize: 15,
            color: 'var(--color-cream)',
            textAlign: 'center',
          }}
        >
          {locale === 'en' ? 'Photo Album' : '사진 앨범'}
        </div>
        <button
          style={{
            padding: '7px 14px',
            borderRadius: 999,
            background: 'var(--color-wine-red)',
            border: 'none',
            color: 'var(--color-cream)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {locale === 'en' ? 'Publish' : '게시'}
        </button>
      </div>

      <div className="wm-scroll-area" style={{ paddingBottom: 40 }}>
      {/* Photo grid */}
      <div
        style={{
          padding: '16px 16px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 6,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              aspectRatio: '1/1',
              borderRadius: 8,
              background: PALETTE[i - 1],
              border: '1px solid var(--color-border-default)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 10,
                borderRadius: 4,
                background: WINES[i - 1]?.bottleColor ?? '#8B1A2A',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                width: 18,
                height: 18,
                borderRadius: 999,
                background: 'rgba(5,2,10,0.85)',
                color: 'var(--color-cream)',
                fontSize: 10,
                fontFamily: 'var(--font-playfair)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {i}
            </div>
          </div>
        ))}
        {/* Add slot */}
        <div
          style={{
            aspectRatio: '1/1',
            borderRadius: 8,
            background: 'var(--color-bg-surface)',
            border: '1.5px dashed var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={20} strokeWidth={1.75} color="var(--color-text-muted)" />
        </div>
      </div>

      {/* Caption */}
      <div style={{ padding: '20px 20px 0' }}>
        <div
          style={{
            fontSize: 10,
            color: 'var(--color-gold)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {locale === 'en' ? 'Caption' : '캡션'}
        </div>
        <div
          style={{
            marginTop: 8,
            padding: '14px 16px',
            borderRadius: 12,
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            fontSize: 15,
            color: 'var(--color-cream)',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          {locale === 'en'
            ? 'A quiet day of cellar organizing. Clearing B-3 and making room for 6 new arrivals.'
            : '소소한 셀러 정리의 하루. B-3 공간을 비우고 새로 들어온 6병 자리 잡기.'}
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 18,
              background: 'var(--color-gold)',
              marginLeft: 2,
              verticalAlign: 'text-bottom',
            }}
          />
        </div>
      </div>

      {/* Tagged wines */}
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span
            style={{
              fontSize: 10,
              color: 'var(--color-gold)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            {locale === 'en' ? 'Tagged Wines' : '태그된 와인'}
          </span>
          <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>3</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {WINES.slice(0, 3).map((w) => (
            <div
              key={w.id}
              style={{
                padding: '8px 12px 8px 8px',
                borderRadius: 10,
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 60,
                  borderRadius: 3,
                  background: w.bottleColor,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, color: 'var(--color-cream)' }}>
                {w.name.split(' ')[0]}
              </span>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={10} strokeWidth={1.75} />
              </button>
            </div>
          ))}
          <button
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px dashed var(--color-border-default)',
              color: 'var(--color-text-muted)',
              fontSize: 11,
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Plus size={12} strokeWidth={1.75} />
            {locale === 'en' ? 'Add' : '추가'}
          </button>
        </div>
      </div>

      {/* Location pin */}
      <div style={{ padding: '18px 16px 0' }}>
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <MapPin size={16} strokeWidth={1.75} color="var(--color-gold)" />
          <span style={{ fontSize: 12, color: 'var(--color-cream)' }}>
            {locale === 'en' ? 'Add location' : '장소 추가'}
          </span>
          <span style={{ flex: 1 }} />
          <ChevronLeft
            size={14}
            strokeWidth={1.75}
            color="var(--color-text-muted)"
            style={{ transform: 'rotate(180deg)' }}
          />
        </div>
      </div>
      </div>
    </>
  );
}
