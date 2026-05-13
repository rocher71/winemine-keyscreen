import { notFound } from 'next/navigation';
import { BackHeader } from '@/components/nav/back-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { PriceChart } from '@/components/wine-detail/price-chart';
import { PriceDetailTable } from '@/components/wine-detail/price-detail-table';
import { AddMyPriceCta } from './add-my-price-cta';
import { getWine } from '@/lib/mock/wines';
import { getPurchasesByWine } from '@/lib/mock/purchases';

type Params = Promise<{ id: string }>;

/**
 * /wine/[id]/prices — 가격 상세
 *
 * - 큰 PriceChart (전체 기간, variant=full)
 * - 매장별 그룹 리스트 (Store 14개에 분포) — 작성자 익명화 (LevelPill만)
 * - 하단 고정 "내 구매 정보 등록" → BottomSheet 폼 (+5 XP 토스트)
 */
export default async function WinePricesPage({ params }: { params: Params }) {
  const { id } = await params;
  const wine = getWine(id);
  if (!wine) notFound();

  const purchases = getPurchasesByWine(wine.id);

  return (
    <>
      <BackHeader title={{ ko: '가격 상세', en: 'Price details' }} />

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 96,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <PriceChart wineId={wine.id} purchases={purchases} variant="full" />
        <PriceDetailTable purchases={purchases} />
      </main>

      <AddMyPriceCta wineId={wine.id} />

      <BottomNav />
    </>
  );
}
