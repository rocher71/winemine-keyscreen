/**
 * Drink Window — vintage + grape/region 입력 → DrinkWindow {from, peak, to}
 *
 * SPEC §key_implementation_notes — 페이지 측에서 셀러 카드의 "마실 시점이 다가옴"
 * 계산에 사용. wines.ts의 wine.drinkWindow가 이미 채워져 있으면 그것을 우선.
 *
 * 추정 로직은 보수적 — 그랑 크뤼/1er Cru/리세르바 등 표현은 +α, 입문 와인은 짧게.
 */

import type { DrinkWindow, Wine } from '@/types';

interface DrinkWindowHint {
  /** vintage + n 년 후 시음 시작 */
  fromYears: number;
  peakYears: number;
  toYears: number;
}

/** 와인 타입·품종별 디폴트 윈도우 (vintage 기준 더하는 햇수). */
const DEFAULT_HINTS: Array<{ match: (wine: Wine) => boolean; hint: DrinkWindowHint }> = [
  // Vintage Port — 가장 길게
  {
    match: (w) =>
      w.wineType === 'fortified' && w.appellation.en.toLowerCase().includes('vintage port'),
    hint: { fromYears: 15, peakYears: 25, toYears: 55 },
  },
  // Bordeaux Left Bank Grand Cru
  {
    match: (w) =>
      w.country.en === 'France' &&
      w.region.en === 'Bordeaux' &&
      w.appellation.en.includes('1er Grand Cru'),
    hint: { fromYears: 8, peakYears: 17, toYears: 32 },
  },
  // Bordeaux Cru Classé (그 외 등급)
  {
    match: (w) => w.country.en === 'France' && w.region.en === 'Bordeaux',
    hint: { fromYears: 6, peakYears: 13, toYears: 22 },
  },
  // Burgundy Grand Cru Red
  {
    match: (w) =>
      w.country.en === 'France' &&
      w.region.en === 'Burgundy' &&
      w.wineType === 'red' &&
      w.appellation.en.includes('Grand Cru'),
    hint: { fromYears: 8, peakYears: 17, toYears: 32 },
  },
  // Burgundy 1er Cru / Village Red
  {
    match: (w) => w.country.en === 'France' && w.region.en === 'Burgundy' && w.wineType === 'red',
    hint: { fromYears: 5, peakYears: 11, toYears: 20 },
  },
  // Burgundy White (Côte de Beaune)
  {
    match: (w) => w.country.en === 'France' && w.region.en === 'Burgundy' && w.wineType === 'white',
    hint: { fromYears: 3, peakYears: 8, toYears: 15 },
  },
  // Brunello
  {
    match: (w) => w.country.en === 'Italy' && w.appellation.en.includes('Brunello'),
    hint: { fromYears: 8, peakYears: 18, toYears: 34 },
  },
  // Barolo / Barbaresco
  {
    match: (w) =>
      w.country.en === 'Italy' &&
      (w.appellation.en.includes('Barolo') || w.appellation.en.includes('Barbaresco')),
    hint: { fromYears: 8, peakYears: 18, toYears: 30 },
  },
  // Chianti Classico Riserva
  {
    match: (w) =>
      w.country.en === 'Italy' && w.appellation.en.toLowerCase().includes('chianti classico'),
    hint: { fromYears: 3, peakYears: 8, toYears: 14 },
  },
  // Rioja Gran Reserva
  {
    match: (w) => w.country.en === 'Spain' && w.appellation.en.includes('Gran Reserva'),
    hint: { fromYears: 5, peakYears: 14, toYears: 30 },
  },
  // Rioja Reserva / Ribera Reserva
  {
    match: (w) => w.country.en === 'Spain' && w.appellation.en.includes('Reserva'),
    hint: { fromYears: 4, peakYears: 9, toYears: 17 },
  },
  // Mosel Riesling Kabinett/Spätlese
  {
    match: (w) => w.country.en === 'Germany' && w.region.en === 'Mosel',
    hint: { fromYears: 3, peakYears: 11, toYears: 31 },
  },
  // Rheingau GG
  {
    match: (w) => w.country.en === 'Germany' && w.region.en === 'Rheingau',
    hint: { fromYears: 4, peakYears: 11, toYears: 21 },
  },
  // Vintage Champagne
  {
    match: (w) =>
      w.wineType === 'sparkling' &&
      w.region.en === 'Champagne' &&
      w.appellation.en.toLowerCase().includes('vintage'),
    hint: { fromYears: 6, peakYears: 12, toYears: 20 },
  },
  // NV Champagne
  {
    match: (w) => w.wineType === 'sparkling' && w.region.en === 'Champagne',
    hint: { fromYears: 3, peakYears: 7, toYears: 13 },
  },
  // Prosecco / Cava 등 가벼운 sparkling
  {
    match: (w) => w.wineType === 'sparkling',
    hint: { fromYears: 0, peakYears: 2, toYears: 5 },
  },
  // Cult Napa Cabernet
  {
    match: (w) =>
      w.country.en === 'USA' && w.region.en === 'Napa Valley' && w.averagePriceKrw >= 500_000,
    hint: { fromYears: 7, peakYears: 17, toYears: 33 },
  },
  // Napa / Sonoma Cab regular
  {
    match: (w) => w.country.en === 'USA' && w.region.en === 'Napa Valley',
    hint: { fromYears: 3, peakYears: 7, toYears: 14 },
  },
  {
    match: (w) => w.country.en === 'USA' && w.region.en === 'Sonoma',
    hint: { fromYears: 3, peakYears: 7, toYears: 12 },
  },
  // Penfolds Grange — long aging
  {
    match: (w) => w.country.en === 'Australia' && w.name.includes('Grange'),
    hint: { fromYears: 8, peakYears: 18, toYears: 38 },
  },
  {
    match: (w) => w.country.en === 'Australia',
    hint: { fromYears: 2, peakYears: 5, toYears: 11 },
  },
  // Argentina Malbec premium vs basic
  {
    match: (w) => w.country.en === 'Argentina' && w.averagePriceKrw >= 250_000,
    hint: { fromYears: 6, peakYears: 14, toYears: 27 },
  },
  {
    match: (w) => w.country.en === 'Argentina',
    hint: { fromYears: 2, peakYears: 5, toYears: 10 },
  },
  // Chile premium vs basic
  {
    match: (w) => w.country.en === 'Chile' && w.averagePriceKrw >= 250_000,
    hint: { fromYears: 5, peakYears: 13, toYears: 27 },
  },
  {
    match: (w) => w.country.en === 'Chile',
    hint: { fromYears: 1, peakYears: 3, toYears: 7 },
  },
  // Default red
  { match: (w) => w.wineType === 'red', hint: { fromYears: 2, peakYears: 6, toYears: 12 } },
  // Default white
  { match: (w) => w.wineType === 'white', hint: { fromYears: 1, peakYears: 4, toYears: 9 } },
  // Default rosé / dessert
  { match: () => true, hint: { fromYears: 0, peakYears: 2, toYears: 5 } },
];

/**
 * Wine 기준 DrinkWindow를 추정. wine.drinkWindow가 채워져 있으면 그것을 그대로 반환.
 */
export function getDrinkWindow(wine: Wine): DrinkWindow {
  if (wine.drinkWindow && wine.drinkWindow.peak > 0) {
    return wine.drinkWindow;
  }
  const hint = DEFAULT_HINTS.find((h) => h.match(wine))!.hint;
  return {
    from: wine.vintage + hint.fromYears,
    peak: wine.vintage + hint.peakYears,
    to: wine.vintage + hint.toYears,
  };
}

/**
 * 현재 연도 기준으로 와인의 drink-window 상태를 분류.
 *
 *   'too-young'   — 아직 from 이전 (수년 후 시음 가능)
 *   'opening'     — from ≤ 현재 < peak (열기 시작)
 *   'peak'        — peak 근처 ±1년
 *   'mature'      — peak 이후, to 이전 (성숙기)
 *   'past-peak'   — to 초과
 */
export type DrinkWindowStatus = 'too-young' | 'opening' | 'peak' | 'mature' | 'past-peak';

export function getDrinkWindowStatus(
  wine: Wine,
  currentYear: number = new Date().getFullYear(),
): DrinkWindowStatus {
  const { from, peak, to } = getDrinkWindow(wine);
  if (currentYear < from) return 'too-young';
  if (Math.abs(currentYear - peak) <= 1) return 'peak';
  if (currentYear < peak) return 'opening';
  if (currentYear <= to) return 'mature';
  return 'past-peak';
}
