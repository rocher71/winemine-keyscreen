'use client';

/**
 * SourcePicker — 노트 작성 진입 (/notes/new 첫 화면).
 *
 * - 2 큰 카드: "내 셀러에서" / "새 와인"
 * - 셀러 카드는 cellarCount 표시. first-time이면 disabled.
 *
 * Controlled — 부모(`/notes/new` 페이지)가 라우팅 결정.
 */

import { useLocale } from '@/context/locale-context';
import type { TastingNoteSource } from '@/types';

export interface SourcePickerProps {
  cellarCount: number;
  onPick: (source: TastingNoteSource) => void;
}

export function SourcePicker({ cellarCount, onPick }: SourcePickerProps) {
  const { locale } = useLocale();
  const cellarDisabled = cellarCount === 0;

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <header style={{ marginBottom: 4 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-playfair)',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--color-cream)',
          }}
        >
          {locale === 'ko' ? '어떤 와인을 기록할까요?' : 'Which wine are you recording?'}
        </h2>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 13,
            color: 'var(--color-muted)',
          }}
        >
          {locale === 'ko'
            ? '셀러에 있는 와인을 따시거나, 새로운 와인을 만나셨나요?'
            : 'Opening a wine from your cellar, or trying something new?'}
        </p>
      </header>

      <div style={{ display: 'grid', gap: 10 }}>
        <button
          type="button"
          onClick={() => !cellarDisabled && onPick('cellar')}
          disabled={cellarDisabled}
          style={{
            background: 'var(--color-surface)',
            border: `1px solid ${cellarDisabled ? 'var(--color-disabled, #4A3D56)' : 'var(--color-gold)'}`,
            borderRadius: 14,
            padding: 18,
            textAlign: 'left',
            cursor: cellarDisabled ? 'not-allowed' : 'pointer',
            opacity: cellarDisabled ? 0.5 : 1,
            display: 'grid',
            gap: 6,
          }}
        >
          <div style={{ fontSize: 30 }}>🍷</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--color-cream)',
            }}
          >
            {locale === 'ko' ? '내 셀러에서' : 'From my cellar'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
            {cellarDisabled
              ? locale === 'ko'
                ? '아직 셀러가 비어 있어요'
                : 'Your cellar is empty'
              : locale === 'ko'
                ? `${cellarCount}병 보관 중`
                : `${cellarCount} bottles in cellar`}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onPick('newEntry')}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-wine-red)',
            borderRadius: 14,
            padding: 18,
            textAlign: 'left',
            cursor: 'pointer',
            display: 'grid',
            gap: 6,
          }}
        >
          <div style={{ fontSize: 30 }}>📸</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--color-cream)',
            }}
          >
            {locale === 'ko' ? '새 와인' : 'New wine'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
            {locale === 'ko'
              ? '라벨 사진을 찍거나 직접 입력해요'
              : 'Snap the label or enter manually'}
          </div>
        </button>
      </div>
    </section>
  );
}
