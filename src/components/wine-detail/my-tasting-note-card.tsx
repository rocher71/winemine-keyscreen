'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { BookOpen, Calendar, Star, Pencil } from 'lucide-react';
import { useMockUser } from '@/hooks/use-mock-user';
import { useMyNoteForWine } from '@/hooks/use-merged-data';
import { useLocale } from '@/context/locale-context';
import { getExpertReviewStats } from '@/lib/mock/reviews';
import type { Wine } from '@/types';

/**
 * 와인 디테일 페이지에 사용자의 노트가 있을 때만 노출되는 카드.
 *
 * - 내 노트가 있으면: 노트 미니뷰 (mode·rating·tastedAt·핵심 차원) + 편집 CTA
 * - 없으면: null 반환 (와인 디테일 페이지에서 mount 안 함)
 * - 추가로 전문가 리뷰 10건+ 와인이면 "커뮤니티 비교" 미니 인사이트 1줄
 */

interface Props {
  wine: Wine;
}

const COMMUNITY_THRESHOLD = 10;

export function MyTastingNoteCard({ wine }: Props) {
  const t = useTranslations('wineDetail.myNote');
  const router = useRouter();
  const { user } = useMockUser();
  const { locale } = useLocale();
  const note = useMyNoteForWine(user.id, wine.id);

  if (!note) return null;

  const ratingDisplay =
    note.mode === 'expert' && note.expertFields
      ? `${Math.round(note.expertFields.rating)}/100`
      : note.mode === 'beginner' && note.beginnerFields
        ? `${note.beginnerFields.rating}/5`
        : '–';

  const communityStats = getExpertReviewStats(wine.id);
  const hasCommunityCompare =
    note.mode === 'expert' &&
    note.expertFields &&
    communityStats &&
    communityStats.count >= COMMUNITY_THRESHOLD;

  const myRating100 = note.mode === 'expert' ? note.expertFields?.rating ?? 0 : 0;
  const diff = hasCommunityCompare ? Math.round(myRating100 - communityStats.avgRating) : 0;

  return (
    <section
      onClick={() => router.push(`/notes/${note.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/notes/${note.id}`);
        }
      }}
      style={{
        margin: '0 16px 16px',
        padding: 16,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-gold)',
        borderRadius: 16,
        boxShadow: '0 0 24px rgba(201, 168, 76, 0.10)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'pointer',
      }}
    >
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={16} color="var(--color-gold)" />
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {t('label')}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/notes/new/write?from=newEntry&wineId=${wine.id}&edit=1`);
          }}
          style={{
            all: 'unset',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <Pencil size={11} />
          {t('edit')}
        </button>
      </div>

      {/* 메타 row — tastedAt + rating + mode */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          <Calendar size={11} strokeWidth={1.75} />
          {note.tastedAt}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--color-gold)',
          }}
        >
          <Star size={11} fill="var(--color-gold)" strokeWidth={0} />
          {ratingDisplay}
        </span>
        <span
          style={{
            padding: '2px 8px',
            background: note.mode === 'expert' ? 'var(--color-wine-red)' : 'rgba(201,168,76,0.18)',
            color: note.mode === 'expert' ? 'var(--color-cream)' : 'var(--color-gold)',
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {t(`mode.${note.mode}`)}
        </span>
      </div>

      {/* expert 노트 차원 미니 — 4 dimension */}
      {note.mode === 'expert' && note.expertFields && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 6,
            padding: 10,
            background: 'rgba(15, 7, 24, 0.6)',
            borderRadius: 10,
          }}
        >
          <MiniDim label={t('dim.sweetness')} value={wsetShort(note.expertFields.sweetness, locale)} />
          <MiniDim label={t('dim.acidity')} value={wsetShort(note.expertFields.acidity, locale)} />
          <MiniDim label={t('dim.body')} value={wsetShort(note.expertFields.body, locale)} />
          <MiniDim label={t('dim.tannin')} value={wsetShort(note.expertFields.tannin, locale)} />
        </div>
      )}

      {/* 비교 인사이트 (10+ 와인일 때만) */}
      {hasCommunityCompare && (
        <div
          style={{
            padding: 12,
            background: 'rgba(139, 26, 42, 0.12)',
            border: '1px solid var(--color-wine-red)',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--color-wine-red-hover)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {t('community.label')}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 10,
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              color: 'var(--color-cream)',
            }}
          >
            <span>
              {t('community.you')}{' '}
              <strong style={{ fontFamily: 'var(--font-playfair)', fontSize: 16 }}>{Math.round(myRating100)}</strong>
            </span>
            <span style={{ color: 'var(--color-text-muted)' }}>·</span>
            <span>
              {t('community.avg')}{' '}
              <strong style={{ fontFamily: 'var(--font-playfair)', fontSize: 16 }}>
                {communityStats.avgRating.toFixed(1)}
              </strong>
            </span>
            <span
              style={{
                color: diff > 0 ? '#22C55E' : diff < 0 ? '#EF4444' : 'var(--color-text-muted)',
                fontWeight: 700,
              }}
            >
              {diff > 0 ? `+${diff}` : diff}
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
            }}
          >
            {t('community.basis', { count: communityStats.count })}
          </div>
        </div>
      )}
    </section>
  );
}

function MiniDim({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 9,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 13,
          color: 'var(--color-cream)',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function wsetShort(scale: 'low' | 'mediumMinus' | 'medium' | 'mediumPlus' | 'high', locale: 'ko' | 'en'): string {
  if (locale === 'ko') {
    return { low: '낮음', mediumMinus: '중−', medium: '중', mediumPlus: '중+', high: '높음' }[scale];
  }
  return { low: 'Low', mediumMinus: 'M−', medium: 'Med', mediumPlus: 'M+', high: 'High' }[scale];
}
