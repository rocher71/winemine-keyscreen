/**
 * External Ratings — 12개 featured wines의 Vivino/WineSearcher/CellarTracker 점수
 *
 * 베타 피드백 §externalRatings 반영. 나머지 ~52종은 ExternalRating 없음 →
 * 카드에서 빈 상태 표시. 점수는 시안용 mock — 실제 데이터 동기화 시 갱신.
 */

import type { ExternalRating } from '@/types';

export const EXTERNAL_RATINGS: ExternalRating[] = [
  {
    id: 'er_bdx-margaux',
    wineId: 'bdx-margaux',
    vivino: { score: 4.6, reviewCount: 12_450 },
    wineSearcher: {
      score: 96,
      priceRank: { ko: '보르도 1er 그룹 상위 10%', en: 'Top 10% of Bordeaux 1ers' },
    },
    cellarTracker: { score: 94, reviewCount: 3210 },
    globalAvgPriceUsd: 880,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_bgy-romanee-st-vivant',
    wineId: 'bgy-romanee-st-vivant',
    vivino: { score: 4.7, reviewCount: 4_120 },
    wineSearcher: {
      score: 98,
      priceRank: { ko: '부르고뉴 Grand Cru 상위 5%', en: 'Top 5% of Burgundy Grands Crus' },
    },
    cellarTracker: { score: 96, reviewCount: 1_840 },
    globalAvgPriceUsd: 4_200,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_cha-krug-grande-cuvee',
    wineId: 'cha-krug-grande-cuvee',
    vivino: { score: 4.6, reviewCount: 8_240 },
    wineSearcher: {
      score: 95,
      priceRank: { ko: '논빈티지 샴페인 상위 1%', en: 'Top 1% of NV Champagne' },
    },
    cellarTracker: { score: 93, reviewCount: 2_410 },
    globalAvgPriceUsd: 380,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_tus-brunello-biondi-santi',
    wineId: 'tus-brunello-biondi-santi',
    vivino: { score: 4.5, reviewCount: 5_910 },
    wineSearcher: {
      score: 95,
      priceRank: { ko: '브루넬로 상위 1%', en: 'Top 1% of Brunello di Montalcino' },
    },
    cellarTracker: { score: 93, reviewCount: 2_180 },
    globalAvgPriceUsd: 760,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_pie-barolo-giacomo-conterno',
    wineId: 'pie-barolo-giacomo-conterno',
    vivino: { score: 4.7, reviewCount: 6_350 },
    wineSearcher: {
      score: 97,
      priceRank: { ko: '바롤로 상위 1%', en: 'Top 1% of Barolo' },
    },
    cellarTracker: { score: 95, reviewCount: 2_650 },
    globalAvgPriceUsd: 1_050,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_rio-lopez-de-heredia',
    wineId: 'rio-lopez-de-heredia',
    vivino: { score: 4.5, reviewCount: 7_810 },
    wineSearcher: {
      score: 94,
      priceRank: { ko: '리오하 그란 리세르바 상위 5%', en: 'Top 5% of Rioja Gran Reserva' },
    },
    cellarTracker: { score: 92, reviewCount: 3_080 },
    globalAvgPriceUsd: 190,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_rhn-chateau-rayas',
    wineId: 'rhn-chateau-rayas',
    vivino: { score: 4.7, reviewCount: 3_640 },
    wineSearcher: {
      score: 97,
      priceRank: { ko: '샤또네프 뒤 빠쁘 상위 1%', en: 'Top 1% of Châteauneuf-du-Pape' },
    },
    cellarTracker: { score: 96, reviewCount: 1_540 },
    globalAvgPriceUsd: 880,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_mos-egon-muller-scharzhof',
    wineId: 'mos-egon-muller-scharzhof',
    vivino: { score: 4.6, reviewCount: 2_810 },
    wineSearcher: {
      score: 96,
      priceRank: { ko: '모젤 카비넷 상위 1%', en: 'Top 1% of Mosel Kabinett' },
    },
    cellarTracker: { score: 94, reviewCount: 1_220 },
    globalAvgPriceUsd: 320,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_nap-screaming-eagle',
    wineId: 'nap-screaming-eagle',
    vivino: { score: 4.8, reviewCount: 1_540 },
    wineSearcher: {
      score: 99,
      priceRank: { ko: '나파 컬트 와인 상위 1%', en: 'Top 1% of Napa cult wines' },
    },
    cellarTracker: { score: 97, reviewCount: 980 },
    globalAvgPriceUsd: 5_400,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_por-niepoort-vintage-port',
    wineId: 'por-niepoort-vintage-port',
    vivino: { score: 4.6, reviewCount: 3_120 },
    wineSearcher: {
      score: 95,
      priceRank: { ko: '빈티지 포트 상위 5%', en: 'Top 5% of Vintage Port' },
    },
    cellarTracker: { score: 94, reviewCount: 1_410 },
    globalAvgPriceUsd: 260,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_arg-catena-zapata-malbec',
    wineId: 'arg-catena-zapata-malbec',
    vivino: { score: 4.5, reviewCount: 5_240 },
    wineSearcher: {
      score: 94,
      priceRank: { ko: '아르헨티나 말벡 상위 1%', en: 'Top 1% of Argentine Malbec' },
    },
    cellarTracker: { score: 92, reviewCount: 1_870 },
    globalAvgPriceUsd: 300,
    lastSyncedAt: '2026-04-30',
  },
  {
    id: 'er_aus-penfolds-grange',
    wineId: 'aus-penfolds-grange',
    vivino: { score: 4.6, reviewCount: 6_710 },
    wineSearcher: {
      score: 96,
      priceRank: { ko: '호주 시라즈 상위 1%', en: 'Top 1% of Australian Shiraz' },
    },
    cellarTracker: { score: 94, reviewCount: 2_330 },
    globalAvgPriceUsd: 1_000,
    lastSyncedAt: '2026-04-30',
  },
];

export const EXTERNAL_RATINGS_BY_WINE_ID: Record<string, ExternalRating> = EXTERNAL_RATINGS.reduce<
  Record<string, ExternalRating>
>((acc, r) => {
  acc[r.wineId] = r;
  return acc;
}, {});

export function getExternalRating(wineId: string): ExternalRating | undefined {
  return EXTERNAL_RATINGS_BY_WINE_ID[wineId];
}
