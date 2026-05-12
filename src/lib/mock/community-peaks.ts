/**
 * Community Peak Estimates — 12 featured 와인 × ~30 응답자 = ~360
 *
 * 베타 피드백 §communityPeak. reviewerLevel은 L3~L5만 (L3+ 가드).
 * 정규분포 + 시스템 peak보다 약 1~2년 늦은 쪽 bias (전문가의 보수적 추정 시뮬).
 *
 * 데이터는 결정적 함수로 생성 — 시안 검수자에게 동일한 분포가 항상 보이게.
 */

import type { CommunityPeakEstimate } from '@/types';

interface WinePeakSeed {
  wineId: string;
  /** 시스템 peak — wine.drinkWindow.peak와 일치 */
  systemPeak: number;
  /** 응답자 수 */
  responses: number;
}

const SEEDS: WinePeakSeed[] = [
  { wineId: 'bdx-margaux', systemPeak: 2035, responses: 38 },
  { wineId: 'bgy-romanee-st-vivant', systemPeak: 2035, responses: 24 },
  { wineId: 'cha-krug-grande-cuvee', systemPeak: 2028, responses: 41 },
  { wineId: 'tus-brunello-biondi-santi', systemPeak: 2036, responses: 32 },
  { wineId: 'pie-barolo-giacomo-conterno', systemPeak: 2037, responses: 29 },
  { wineId: 'rio-lopez-de-heredia', systemPeak: 2030, responses: 26 },
  { wineId: 'rhn-chateau-rayas', systemPeak: 2032, responses: 22 },
  { wineId: 'mos-egon-muller-scharzhof', systemPeak: 2030, responses: 27 },
  { wineId: 'nap-screaming-eagle', systemPeak: 2034, responses: 19 },
  { wineId: 'por-niepoort-vintage-port', systemPeak: 2040, responses: 21 },
  { wineId: 'arg-catena-zapata-malbec', systemPeak: 2032, responses: 28 },
  { wineId: 'aus-penfolds-grange', systemPeak: 2035, responses: 33 },
];

/** seed-based deterministic PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box-Muller로 정규 분포 [mean, std]. */
function gaussian(rand: () => number, mean: number, std: number): number {
  const u1 = rand() || 1e-12;
  const u2 = rand() || 1e-12;
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * std;
}

const CONFIDENCE_BY_LEVEL: Record<3 | 4 | 5, 'low' | 'medium' | 'high'> = {
  3: 'low',
  4: 'medium',
  5: 'high',
};

const NOTES_KO = [
  '아직 타닌이 너무 강함',
  '향이 막 깨어나는 중',
  '지금 마셔도 충분히 즐길 수 있음',
  '5년 더 묵힐 가치 충분',
  '디캔팅 90분 이상 권장',
  '아직 어리지만 잠재력 분명',
  '몇 년 안에 절정 도달할 듯',
  '시간이 만들어줄 와인',
  '지금이 가장 좋은 시기',
];
const NOTES_EN = [
  'Tannins still tight',
  'Aromatics just beginning to wake',
  'Drinking well even now',
  'Worth aging another five years',
  'Decant 90+ minutes',
  'Young, but the potential is clear',
  'Will hit its stride within a few years',
  'A wine time will shape',
  'At its sweet spot right now',
];

function generatePeaksForSeed(seed: WinePeakSeed, startId: number): CommunityPeakEstimate[] {
  const rand = mulberry32(seed.wineId.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7));
  const items: CommunityPeakEstimate[] = [];
  // 시스템 peak보다 약 +1.2년 mean shift, std 2.5년
  const mean = seed.systemPeak + 1.2;
  const std = 2.5;

  for (let i = 0; i < seed.responses; i++) {
    const raw = gaussian(rand, mean, std);
    const year = Math.round(raw);

    // reviewerLevel 분포: L3 60%, L4 30%, L5 10%
    const lvlRoll = rand();
    const level: 3 | 4 | 5 = lvlRoll < 0.6 ? 3 : lvlRoll < 0.9 ? 4 : 5;
    const confidence = CONFIDENCE_BY_LEVEL[level];

    // 약 25%만 한 줄 메모 작성
    const hasNote = rand() < 0.25;
    const noteIdx = Math.floor(rand() * NOTES_KO.length);

    // createdAt: 2025-10-01 ~ 2026-05-01 사이 분산
    const dayOffset = Math.floor(rand() * 210);
    const base = new Date('2025-10-01T00:00:00Z').getTime();
    const date = new Date(base + dayOffset * 86_400_000).toISOString().slice(0, 10);

    items.push({
      id: `cp_${String(startId + i).padStart(4, '0')}`,
      wineId: seed.wineId,
      userId: `anon-cp-${String(startId + i).padStart(4, '0')}`,
      estimatedPeakYear: year,
      confidence,
      note: hasNote ? { ko: NOTES_KO[noteIdx], en: NOTES_EN[noteIdx] } : null,
      createdAt: date,
      reviewerLevel: level,
    });
  }

  return items;
}

let idCursor = 1;
export const COMMUNITY_PEAKS: CommunityPeakEstimate[] = SEEDS.flatMap((seed) => {
  const list = generatePeaksForSeed(seed, idCursor);
  idCursor += seed.responses;
  return list;
});

export function getCommunityPeaksByWine(wineId: string): CommunityPeakEstimate[] {
  return COMMUNITY_PEAKS.filter((p) => p.wineId === wineId);
}

/** systemPeak lookup — community-peak-aggregator.ts에서 참조용. */
export const SYSTEM_PEAKS_BY_WINE: Record<string, number> = SEEDS.reduce<Record<string, number>>(
  (acc, s) => {
    acc[s.wineId] = s.systemPeak;
    return acc;
  },
  {},
);
