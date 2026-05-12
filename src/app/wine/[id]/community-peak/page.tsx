import { notFound } from 'next/navigation';
import { BackHeader } from '@/components/nav/back-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { LocaleText } from '@/components/shared/locale-text';
import { PeakDistribution } from '@/components/community-drink-window/peak-distribution';
import { ContributorsList } from './contributors-list';
import { AddMyEstimateCta } from './add-my-estimate-cta';
import { getWine } from '@/lib/mock/wines';
import { getCommunityPeakAggregate } from '@/lib/community-peak-aggregator';
import { getCommunityPeaksByWine } from '@/lib/mock/community-peaks';

type Params = Promise<{ id: string }>;

/**
 * /wine/[id]/community-peak — 커뮤니티 음용 적기 상세
 *
 * - 인트로 카드 (L3+ 안내 + 가중치 안내)
 * - 큰 히스토그램 (280px) + 시스템/평균/중앙값 마커
 * - 추정자 리스트 (익명화 "{LevelName} #{anonId}")
 * - 하단 고정 "내 추정 추가" CTA — L3+ 만 활성
 */
export default async function CommunityPeakPage({ params }: { params: Params }) {
  const { id } = await params;
  const wine = getWine(id);
  if (!wine) notFound();

  const aggregate = getCommunityPeakAggregate(wine.id);
  const estimates = getCommunityPeaksByWine(wine.id);

  return (
    <>
      <BackHeader
        title={{ ko: '커뮤니티 음용 적기', en: 'Community drinking window' }}
      />

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 96,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Intro card */}
        <section style={{ padding: '0 16px' }}>
          <div
            style={{
              padding: 14,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 12,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-inter)',
                fontSize: 13,
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
              }}
            >
              <LocaleText
                value={{
                  ko: '다른 사용자들이 추정한 절정 시점입니다. 시스템 추정과 비교해 보세요.',
                  en: 'Estimates from other users (L3+ only). Compare with system suggestion.',
                }}
              />
            </p>
            <p
              style={{
                margin: '6px 0 0',
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                color: 'var(--color-gold)',
              }}
            >
              <LocaleText
                value={{
                  ko: 'L4/L5 사용자의 추정은 가중치 1.5~2배 적용됩니다',
                  en: 'L4/L5 estimates are weighted 1.5-2x',
                }}
              />
            </p>
          </div>
        </section>

        {/* Big Histogram */}
        <section style={{ padding: '0 16px' }}>
          <div
            style={{
              padding: 16,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--color-cream)',
                }}
              >
                <LocaleText
                  value={{
                    ko: `평균 ${Math.round(aggregate.meanPeakYear)} · 중앙값 ${aggregate.medianPeakYear}`,
                    en: `Mean ${Math.round(aggregate.meanPeakYear)} · Median ${aggregate.medianPeakYear}`,
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                }}
              >
                {aggregate.count}{' '}
                <LocaleText value={{ ko: '명', en: 'reviewers' }} />
              </div>
            </div>
            {aggregate.count === 0 ? (
              <p
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: 13,
                }}
              >
                <LocaleText
                  value={{
                    ko: '아직 추정 데이터가 부족해요. 전문가 노트에서 입력해주세요',
                    en: 'Not enough data. Add an estimate in your expert note.',
                  }}
                />
              </p>
            ) : (
              <PeakDistribution aggregate={aggregate} height={280} showLegend />
            )}
          </div>
        </section>

        {/* Contributors */}
        <ContributorsList estimates={estimates} />
      </main>

      <AddMyEstimateCta wineId={wine.id} />

      <BottomNav />
    </>
  );
}
