'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { BackHeader } from '@/components/nav/back-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { LocaleText } from '@/components/shared/locale-text';
import { UserMapHero } from '@/components/profile/user-map-hero';
import { TasteCompatibilityCard } from '@/components/profile/taste-compatibility-card';
import { currentUserHeavy } from '@/lib/mock/users';
import { getWine, WINES_BY_ID } from '@/lib/mock/wines';
import { resolveUser, getProfileNotes, getMatchPctVsMe } from '@/lib/profile-helpers';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { useLocale } from '@/context/locale-context';
import { toast } from '@/hooks/use-toast';

export default function OtherProfilePage() {
  const params = useParams<{ userId: string }>();
  const t = useTranslations('profile.other');
  const { locale } = useLocale();
  const [sort, setSort] = useState<'recent' | 'rating'>('recent');

  useRegisterFeatures('/profile/[userId]', [
    { id: 'otherProfile.userMapHero', labelKo: '유저 지도 헤로', labelEn: 'User map hero', defaultStatus: 'planned' },
    { id: 'otherProfile.compat', labelKo: '취향 일치 카드', labelEn: 'Compatibility card', defaultStatus: 'planned' },
    { id: 'otherProfile.wineList', labelKo: '와인 리스트', labelEn: 'Wine list', defaultStatus: 'planned' },
    { id: 'otherProfile.publicNotes', labelKo: '공개 노트', labelEn: 'Public notes', defaultStatus: 'planned' },
  ]);

  const other = resolveUser(params.userId);

  const sortedWines = useMemo(() => {
    if (!other) return [];
    const notes = getProfileNotes(other.id);
    const withWines = notes
      .map((n) => ({ note: n, wine: WINES_BY_ID[n.wineId] }))
      .filter((x) => x.wine != null);
    if (sort === 'rating') {
      withWines.sort((a, b) => {
        const ar = a.note.expertFields?.rating ?? (a.note.beginnerFields?.rating ?? 0) * 20;
        const br = b.note.expertFields?.rating ?? (b.note.beginnerFields?.rating ?? 0) * 20;
        return br - ar;
      });
    } else {
      withWines.sort(
        (a, b) => new Date(b.note.tastedAt).getTime() - new Date(a.note.tastedAt).getTime(),
      );
    }
    return withWines;
  }, [other, sort]);

  const sharedStats = useMemo(() => {
    if (!other) return { sharedWines: 0, sharedRegions: 0 };
    const myNotes = getProfileNotes(currentUserHeavy.id);
    const otherNotes = getProfileNotes(other.id);
    const myWineIds = new Set(myNotes.map((n) => n.wineId));
    const sharedWineIds = otherNotes.filter((n) => myWineIds.has(n.wineId)).map((n) => n.wineId);
    const myRegions = new Set(
      myNotes
        .map((n) => getWine(n.wineId))
        .filter((w): w is NonNullable<typeof w> => w != null)
        .map((w) => w.region.en),
    );
    const sharedRegions = new Set<string>();
    otherNotes
      .map((n) => getWine(n.wineId))
      .filter((w): w is NonNullable<typeof w> => w != null)
      .forEach((w) => {
        if (myRegions.has(w.region.en)) sharedRegions.add(w.region.en);
      });
    return { sharedWines: sharedWineIds.length, sharedRegions: sharedRegions.size };
  }, [other]);

  if (!other) {
    return (
      <>
        <BackHeader />
        <main className="wm-scroll-area">
          <div style={{ padding: 24, color: 'var(--color-text-muted)' }}>
            <LocaleText value={{ ko: '사용자를 찾을 수 없어요', en: 'User not found' }} />
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  const matchPct = getMatchPctVsMe(other.id);
  const wineHeroWines = sortedWines.map((x) => x.wine);
  const publicNotes = sortedWines.slice(0, 4);

  return (
    <>
      <BackHeader title={other.displayName}>
        <button
          type="button"
          onClick={() => toast({ message: t('followToast') })}
          style={{
            padding: '6px 12px',
            background: 'transparent',
            color: 'var(--color-gold)',
            border: '1px solid var(--color-gold)',
            borderRadius: 10,
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t('follow')}
        </button>
      </BackHeader>

      <main
        className="wm-scroll-area"
        style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 20 }}
      >
        <div data-feature-id="otherProfile.userMapHero">
          <UserMapHero user={other} wines={wineHeroWines} />
        </div>
        <div data-feature-id="otherProfile.compat">
          <TasteCompatibilityCard
            matchPct={matchPct}
            sharedWines={sharedStats.sharedWines}
            sharedRegions={sharedStats.sharedRegions}
          />
        </div>

        {/* 공개 노트 — 최근 4개 미리보기 */}
        {publicNotes.length > 0 && (
          <section data-feature-id="otherProfile.publicNotes" style={{ margin: '0 16px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-cream)',
                margin: '0 0 10px',
              }}
            >
              {locale === 'en' ? 'Public notes' : '공개 노트'}
              <span style={{ color: 'var(--color-text-muted)', marginLeft: 6, fontWeight: 400 }}>
                {sortedWines.length}
              </span>
            </h2>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {publicNotes.map(({ note, wine }) => {
                const memo = note.expertFields?.memo ?? note.beginnerFields?.memo;
                const memoText = memo
                  ? locale === 'en'
                    ? memo.en
                    : memo.ko
                  : '';
                const rating =
                  note.expertFields?.rating ??
                  (note.beginnerFields?.rating != null
                    ? Math.round(note.beginnerFields.rating * 20)
                    : null);
                return (
                  <li key={note.id}>
                    <Link
                      href={`/wine/${wine.id}` as Route}
                      style={{
                        display: 'block',
                        padding: 12,
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 12,
                        textDecoration: 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-playfair)',
                            fontSize: 13,
                            color: 'var(--color-cream)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          {wine.name} {wine.vintage}
                        </div>
                        {rating != null && (
                          <span
                            style={{
                              fontSize: 11,
                              color: 'var(--color-gold)',
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            ◆ {rating}
                          </span>
                        )}
                      </div>
                      {memoText && (
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.55,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontStyle: 'italic',
                          }}
                        >
                          {memoText}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section data-feature-id="otherProfile.wineList" style={{ margin: '0 16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-cream)',
                margin: 0,
              }}
            >
              {t('winesTitle')}
              <span style={{ color: 'var(--color-text-muted)', marginLeft: 6, fontWeight: 400 }}>
                {sortedWines.length}
              </span>
            </h2>
            <div style={{ display: 'flex', gap: 4 }}>
              <SortBtn
                label={t('sortRecent')}
                active={sort === 'recent'}
                onClick={() => setSort('recent')}
              />
              <SortBtn
                label={t('sortRating')}
                active={sort === 'rating'}
                onClick={() => setSort('rating')}
              />
            </div>
          </div>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {sortedWines.slice(0, 30).map(({ wine, note }) => (
              <li key={note.id}>
                <Link
                  href={`/wine/${wine.id}` as Route}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: 10,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 12,
                    textDecoration: 'none',
                    alignItems: 'center',
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      width: 40,
                      height: 56,
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
                        fontSize: 14,
                        color: 'var(--color-cream)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {wine.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 11,
                        color: 'var(--color-text-muted)',
                        marginTop: 2,
                      }}
                    >
                      {wine.vintage} · <LocaleText value={wine.region} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <BottomNav />
    </>
  );
}

function SortBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '4px 10px',
        background: active ? 'var(--color-wine-red)' : 'transparent',
        color: active ? 'var(--color-cream)' : 'var(--color-text-muted)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 8,
        fontFamily: 'var(--font-inter)',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}
