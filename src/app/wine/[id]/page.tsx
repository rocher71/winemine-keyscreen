import { notFound } from 'next/navigation';
import { BackHeader } from '@/components/nav/back-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { WineHeader } from '@/components/wine-detail/wine-header';
import { ExternalRatingsCard } from '@/components/wine-detail/external-ratings-card';
import { AveragePricePill } from '@/components/wine-detail/average-price-pill';
import { PriceChart } from '@/components/wine-detail/price-chart';
import { CommunityDrinkWindowCard } from '@/components/community-drink-window/community-drink-window-card';
import { WineStoryCard } from '@/components/wine-story/wine-story-card';
import { ReviewList } from '@/components/wine-detail/review-list';
import { AddToCellarCta } from '@/components/wine-detail/add-to-cellar-cta';
import { FavoriteToggle } from '@/components/wine-detail/favorite-toggle';
import { getWine } from '@/lib/mock/wines';
import { getExternalRating } from '@/lib/mock/external-ratings';
import { getWineStory } from '@/lib/mock/wine-stories';
import { getPurchasesByWine } from '@/lib/mock/purchases';
import { getReviewsByWine } from '@/lib/mock/reviews';
import { getCommunityPeakAggregate } from '@/lib/community-peak-aggregator';

/**
 * /wine/[id] — Wine Detail
 *
 * 베타 피드백 7항목 중 4항목이 집중되는 페이지:
 *  1. ExternalRatingsCard (Vivino / WS / CT)
 *  2. PriceChart (가격 추이)
 *  3. CommunityDrinkWindowCard (커뮤니티 음용 적기)
 *  4. WineStoryCard (와이너리 스토리)
 */
type Params = Promise<{ id: string }>;

export default async function WineDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const wine = getWine(id);
  if (!wine) notFound();

  const externalRating = wine.externalRatingsId ? getExternalRating(wine.id) : null;
  const story = wine.storyId ? getWineStory(wine.id) : null;
  const purchases = getPurchasesByWine(wine.id);
  const reviews = getReviewsByWine(wine.id);
  const aggregate = getCommunityPeakAggregate(wine.id);

  return (
    <>
      <BackHeader title={wine.name}>
        <FavoriteToggle wineId={wine.id} />
      </BackHeader>

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <WineHeader wine={wine} />

        <ExternalRatingsCard rating={externalRating} />

        <AveragePricePill purchases={purchases} fallbackKrw={wine.averagePriceKrw} />

        <PriceChart wineId={wine.id} purchases={purchases} variant="compact" />

        <CommunityDrinkWindowCard wineId={wine.id} aggregate={aggregate} />

        <WineStoryCard wineId={wine.id} story={story} />

        <ReviewList reviews={reviews} />

        <div style={{ padding: '8px 16px 0' }}>
          <AddToCellarCta wineId={wine.id} variant="inline" />
        </div>
      </main>

      <BottomNav />
    </>
  );
}
