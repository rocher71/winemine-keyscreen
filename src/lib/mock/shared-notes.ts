/**
 * Shared tasting notes — 커뮤니티에 공개된 다른 사용자들의 노트.
 *
 * 커뮤니티 "Tasting Notes" 탭과 'tap to view note' 진입점이 이 pool을 참조.
 * 데이터는 prototype용 mock — 실제로는 me-heavy 외의 사용자가 공유한 노트를
 * 가정한다. 각 항목은 SharedNote로 정규화.
 */

import type { LocalizedString } from '@/types';

export interface SharedNoteRating {
  /** 0~100 (expert) 혹은 0~5에 *20 환산 */
  value: number;
  label: { ko: string; en: string };
}

export interface SharedNote {
  id: string;
  authorUserId: string;
  authorName: LocalizedString;
  /** community user level (1~5) — avatar gradient 결정 */
  authorLevel: 1 | 2 | 3 | 4 | 5;
  wineId: string;
  templateId: string;
  tastedAt: string;
  createdAt: string;
  /** 평점 (0~100) */
  rating: number;
  /** 메모 본문 */
  memo: LocalizedString;
  /** 인기 정렬용 — 좋아요/저장 합산 */
  likeCount: number;
  saveCount: number;
}

export const SHARED_NOTES: SharedNote[] = [
  {
    id: 'sn-001',
    authorUserId: 'sommelier',
    authorName: { ko: '함소믈리에', en: 'Som. Ham' },
    authorLevel: 5,
    wineId: 'bgy-puligny-montrachet',
    templateId: 'tpl-sommelier',
    tastedAt: '2026-05-08T19:30:00Z',
    createdAt: '2026-05-08T22:10:00Z',
    rating: 94,
    memo: {
      ko: '헤이즐넛과 분필이 미네랄의 긴장감을 만든다. 디캔팅 30분 후 절정. 손님에게는 9도로 서빙 권장.',
      en: 'Hazelnut and chalk shape a taut mineral tension. Peak at 30 min after decanting. Serve at 9°C.',
    },
    likeCount: 142,
    saveCount: 38,
  },
  {
    id: 'sn-002',
    authorUserId: 'jiwon',
    authorName: { ko: '박지원', en: 'Jiwon Park' },
    authorLevel: 5,
    wineId: 'bgy-pommard',
    templateId: 'tpl-collector',
    tastedAt: '2026-05-06T20:00:00Z',
    createdAt: '2026-05-07T08:42:00Z',
    rating: 91,
    memo: {
      ko: '두 시간 디캔팅 후 정점. 검은 체리와 가죽. 셀러 5년 더 두면 더 좋을 듯.',
      en: 'Peak after 2-hour decant. Black cherry and leather. Could rest 5 more years.',
    },
    likeCount: 89,
    saveCount: 21,
  },
  {
    id: 'sn-003',
    authorUserId: 'mineral',
    authorName: { ko: '미네랄러버', en: 'Mineral Lover' },
    authorLevel: 5,
    wineId: 'mos-egon-muller-scharzhof',
    templateId: 'builtin-expert',
    tastedAt: '2026-05-04T18:15:00Z',
    createdAt: '2026-05-04T22:30:00Z',
    rating: 96,
    memo: {
      ko: '슬레이트의 칼날. 산미가 입천장에 새겨진다. 라임 껍질, 부싯돌. 카우달리 28초.',
      en: 'Slate blade. Acidity carves the palate. Lime zest, flint. 28-second finish.',
    },
    likeCount: 167,
    saveCount: 52,
  },
  {
    id: 'sn-004',
    authorUserId: 'duckhu',
    authorName: { ko: '와인덕후', en: 'Wine Duckhu' },
    authorLevel: 4,
    wineId: 'tus-chianti-classico',
    templateId: 'tpl-daily',
    tastedAt: '2026-05-09T19:00:00Z',
    createdAt: '2026-05-09T20:45:00Z',
    rating: 80,
    memo: {
      ko: '평일 저녁용으로 딱. 가격 대비 좋고 식사와 잘 어울려요. 다시 살래요.',
      en: 'Perfect for weeknight. Good price-to-quality, pairs well with dinner. Would buy again.',
    },
    likeCount: 34,
    saveCount: 8,
  },
  {
    id: 'sn-005',
    authorUserId: 'suyeon',
    authorName: { ko: '이서윤', en: 'Suyeon Lee' },
    authorLevel: 4,
    wineId: 'cha-krug-grande-cuvee',
    templateId: 'builtin-expert',
    tastedAt: '2026-05-02T21:30:00Z',
    createdAt: '2026-05-03T10:00:00Z',
    rating: 93,
    memo: {
      ko: '버터 토스트와 헤이즐넛. 무스가 너무 곱다. 첫 잔보다 두 번째 잔이 더 좋았던 드문 샴페인.',
      en: 'Butter toast and hazelnut. Mousse so fine. Rare champagne where the second pour beats the first.',
    },
    likeCount: 121,
    saveCount: 29,
  },
  {
    id: 'sn-006',
    authorUserId: 'minho',
    authorName: { ko: '김민호', en: 'Minho Kim' },
    authorLevel: 3,
    wineId: 'bdx-margaux',
    templateId: 'builtin-beginner',
    tastedAt: '2026-05-10T19:30:00Z',
    createdAt: '2026-05-10T22:00:00Z',
    rating: 76,
    memo: {
      ko: '처음 마셔본 마고. 향이 많고 끝맛이 부드러웠다. 와인 공부를 더 해봐야겠다.',
      en: 'First Margaux. Lots of aroma, soft finish. Need to learn more about wine.',
    },
    likeCount: 22,
    saveCount: 5,
  },
  {
    id: 'sn-007',
    authorUserId: 'haerin',
    authorName: { ko: '정해린', en: 'Haerin Jung' },
    authorLevel: 3,
    wineId: 'pie-barolo-giacomo-conterno',
    templateId: 'builtin-beginner',
    tastedAt: '2026-05-11T20:00:00Z',
    createdAt: '2026-05-11T22:15:00Z',
    rating: 88,
    memo: {
      ko: '장미와 타르. 타닌이 처음엔 단단했는데 한 시간 지나니 풀려서 부드러워졌다.',
      en: 'Rose and tar. Tannins firm at first, then softened after an hour.',
    },
    likeCount: 56,
    saveCount: 12,
  },
];

export function getSharedNote(id: string): SharedNote | undefined {
  return SHARED_NOTES.find((n) => n.id === id);
}

export function getSharedNotesSorted(
  sortBy: 'popular' | 'latest' = 'popular',
): SharedNote[] {
  const arr = [...SHARED_NOTES];
  if (sortBy === 'popular') {
    arr.sort((a, b) => b.likeCount + b.saveCount - (a.likeCount + a.saveCount));
  } else {
    arr.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return arr;
}
