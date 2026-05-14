'use client';

import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { Pencil, Share2, Star, Calendar } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { LocaleText } from '@/components/shared/locale-text';
import { useLocale } from '@/context/locale-context';
import { useMockUser } from '@/hooks/use-mock-user';
import { getTastingNoteById } from '@/lib/mock/tasting-notes';
import { getSharedNote } from '@/lib/mock/shared-notes';
import { getWine } from '@/lib/mock/wines';
import { getTemplateById, BUILTIN_BEGINNER_ID, BUILTIN_EXPERT_ID } from '@/lib/mock/tasting-templates';
import { resolveUser } from '@/lib/profile-helpers';

/**
 * 테이스팅 노트 read-only 조회 페이지.
 *
 * 두 가지 노트 소스 지원:
 *  1. 내 노트 (TASTING_NOTES) — 'note_xxx' ID
 *  2. 공유 노트 (SHARED_NOTES) — 'sn-xxx' ID
 *
 * 보여주는 내용: 와인 정보 / 작성자 / 평점 / 메모 / 모드별 차원 요약
 * 내 노트일 때만 'Edit' 액션 노출.
 */
export default function ViewNotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = use(params);
  const router = useRouter();
  const { locale } = useLocale();
  const { user } = useMockUser();

  const data = useMemo(() => {
    /* shared note pool 우선 — sn- prefix */
    const shared = getSharedNote(noteId);
    if (shared) {
      const wine = getWine(shared.wineId);
      const author = resolveUser(shared.authorUserId);
      const template = getTemplateById(shared.templateId);
      return {
        kind: 'shared' as const,
        wineId: shared.wineId,
        wine,
        authorUserId: shared.authorUserId,
        authorName: shared.authorName,
        authorLevel: shared.authorLevel,
        rating100: shared.rating,
        tastedAt: shared.tastedAt,
        memo: shared.memo,
        template,
        author,
        mineEditable: false,
      };
    }
    const mine = getTastingNoteById(noteId);
    if (mine) {
      const wine = getWine(mine.wineId);
      const rating100 =
        mine.expertFields?.rating ??
        (mine.beginnerFields ? mine.beginnerFields.rating * 20 : 0);
      const memo =
        mine.expertFields?.memo ?? mine.beginnerFields?.memo ?? { ko: '', en: '' };
      const template = getTemplateById(
        mine.mode === 'beginner' ? BUILTIN_BEGINNER_ID : BUILTIN_EXPERT_ID,
      );
      return {
        kind: 'mine' as const,
        note: mine,
        wineId: mine.wineId,
        wine,
        authorUserId: mine.userId,
        authorName: user.displayName,
        authorLevel: user.levelId as 1 | 2 | 3 | 4 | 5,
        rating100,
        tastedAt: mine.tastedAt,
        memo,
        template,
        author: user,
        mineEditable: mine.userId === user.id,
      };
    }
    return null;
  }, [noteId, user]);

  if (!data || !data.wine) {
    return (
      <>
        <BackHeader title={{ ko: '노트', en: 'Note' }} />
        <div className="wm-scroll-area">
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>
            {locale === 'en' ? 'Note not found.' : '노트를 찾을 수 없어요.'}
          </div>
        </div>
      </>
    );
  }

  const { wine } = data;
  const dateStr = data.tastedAt.slice(0, 10);

  return (
    <>
      <BackHeader title={{ ko: '테이스팅 노트', en: 'Tasting note' }}>
        {data.mineEditable && (
          <button
            type="button"
            onClick={() => router.push(`/notes/new/write?from=newEntry&wineId=${data.wineId}&edit=1`)}
            aria-label="Edit"
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: 6,
              display: 'inline-flex',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Pencil size={18} strokeWidth={1.75} />
          </button>
        )}
        <button
          type="button"
          aria-label="Share"
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: 6,
            display: 'inline-flex',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Share2 size={18} strokeWidth={1.75} />
        </button>
      </BackHeader>

      <div className="wm-scroll-area" style={{ paddingBottom: 40 }}>
        {/* 와인 헤더 */}
        <Link
          href={`/wine/${data.wineId}` as Route}
          style={{
            display: 'flex',
            gap: 12,
            padding: '14px 20px',
            textDecoration: 'none',
            alignItems: 'center',
          }}
        >
          <div
            aria-hidden
            style={{
              width: 44,
              height: 64,
              borderRadius: 6,
              background: `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 70%)`,
              flexShrink: 0,
              border: '1px solid rgba(201,168,76,0.18)',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 16,
                color: 'var(--color-cream)',
                lineHeight: 1.3,
              }}
            >
              {wine.name}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                color: 'var(--color-text-muted)',
                marginTop: 2,
              }}
            >
              {wine.vintage} · <LocaleText value={wine.region} /> · <LocaleText value={wine.country} />
            </div>
          </div>
        </Link>

        {/* 작성자 + 메타 row */}
        <div
          style={{
            margin: '0 16px',
            padding: 14,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-gold)',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                background: levelGradient(data.authorLevel),
                border: '1px solid rgba(201,168,76,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-playfair)',
                fontSize: 13,
                color: 'var(--color-cream)',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {(locale === 'ko' ? data.authorName.ko : data.authorName.en).charAt(0)}
            </div>
            <Link
              href={`/profile/${data.authorUserId}` as Route}
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 14,
                color: 'var(--color-cream)',
                textDecoration: 'none',
                flex: 1,
              }}
            >
              <LocaleText value={data.authorName} />
            </Link>
            {data.template && (
              <span
                style={{
                  padding: '4px 9px',
                  borderRadius: 999,
                  border: '1px solid var(--color-border-default)',
                  fontSize: 10,
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                <LocaleText value={data.template.title} />
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                color: 'var(--color-text-muted)',
              }}
            >
              <Calendar size={12} strokeWidth={1.75} />
              {dateStr}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-gold)',
              }}
            >
              <Star size={12} fill="var(--color-gold)" strokeWidth={0} />
              {Math.round(data.rating100)}/100
            </span>
          </div>
        </div>

        {/* 메모 */}
        <div
          style={{
            margin: '16px 16px 0',
            padding: 16,
            background: 'rgba(15,7,24,0.6)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 14,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: 'var(--color-gold)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            {locale === 'en' ? 'Memo' : '메모'}
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'var(--color-cream)',
              lineHeight: 1.65,
              fontStyle: 'italic',
              fontFamily: 'var(--font-playfair)',
            }}
          >
            <LocaleText value={data.memo} />
          </div>
        </div>

        {/* 모드별 차원 요약 — 내 노트일 때 */}
        {data.kind === 'mine' && data.note.expertFields && (
          <DimensionsExpert fields={data.note.expertFields} locale={locale} />
        )}
        {data.kind === 'mine' && data.note.beginnerFields && (
          <DimensionsBeginner fields={data.note.beginnerFields} locale={locale} />
        )}
      </div>
    </>
  );
}

function levelGradient(level: 1 | 2 | 3 | 4 | 5): string {
  switch (level) {
    case 1: return 'linear-gradient(135deg, #555560, #2a2a35)';
    case 2: return 'linear-gradient(135deg, #4a6fa5, #1a2a45)';
    case 3: return 'linear-gradient(135deg, #b8b8c0, #3a3a48)';
    case 4: return 'linear-gradient(135deg, #C9A84C, #0F0718)';
    case 5: return 'linear-gradient(135deg, #8B1A2A, #3a0810)';
  }
}

function DimensionsExpert({
  fields,
  locale,
}: {
  fields: NonNullable<ReturnType<typeof getTastingNoteById>>['expertFields'];
  locale: 'ko' | 'en';
}) {
  if (!fields) return null;
  const dims = [
    { label: locale === 'ko' ? '단맛' : 'Sweet', value: fields.sweetness },
    { label: locale === 'ko' ? '산미' : 'Acid', value: fields.acidity },
    { label: locale === 'ko' ? '바디' : 'Body', value: fields.body },
    { label: locale === 'ko' ? '타닌' : 'Tannin', value: fields.tannin },
  ];
  return (
    <div
      style={{
        margin: '16px 16px 0',
        padding: 14,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 14,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: 'var(--color-gold)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        {locale === 'en' ? 'WSET dimensions' : 'WSET 차원'}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
        }}
      >
        {dims.map((d) => (
          <div key={d.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 9,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 4,
              }}
            >
              {d.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 13,
                color: 'var(--color-cream)',
                lineHeight: 1.1,
              }}
            >
              {wsetShort(d.value, locale)}
            </div>
          </div>
        ))}
      </div>
      {fields.faults.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--color-wine-red-hover)' }}>
          {locale === 'en' ? 'Faults: ' : '결함: '}
          {fields.faults.join(', ')}
        </div>
      )}
    </div>
  );
}

function DimensionsBeginner({
  fields,
  locale,
}: {
  fields: NonNullable<ReturnType<typeof getTastingNoteById>>['beginnerFields'];
  locale: 'ko' | 'en';
}) {
  if (!fields) return null;
  const dims = [
    { label: locale === 'ko' ? '단맛' : 'Sweet', v: fields.sweetness },
    { label: locale === 'ko' ? '산미' : 'Acid', v: fields.acidity },
    { label: locale === 'ko' ? '바디' : 'Body', v: fields.body },
    { label: locale === 'ko' ? '타닌' : 'Tannin', v: fields.tannin },
  ];
  return (
    <div
      style={{
        margin: '16px 16px 0',
        padding: 14,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 14,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: 'var(--color-gold)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        {locale === 'en' ? 'Palate' : '맛 균형'}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
        }}
      >
        {dims.map((d) => (
          <div key={d.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 9,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 4,
              }}
            >
              {d.label}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 14,
                color: 'var(--color-cream)',
                lineHeight: 1.1,
              }}
            >
              {d.v}/5
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function wsetShort(
  scale: 'low' | 'mediumMinus' | 'medium' | 'mediumPlus' | 'high',
  locale: 'ko' | 'en',
): string {
  if (locale === 'ko') {
    return { low: '낮음', mediumMinus: '중−', medium: '중', mediumPlus: '중+', high: '높음' }[scale];
  }
  return { low: 'Low', mediumMinus: 'M−', medium: 'Med', mediumPlus: 'M+', high: 'High' }[scale];
}
