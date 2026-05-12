/**
 * Reviews — 와인별 커뮤니티 리뷰 (12 featured 와인에 분포, 총 약 28개)
 *
 * beginner(0~5 평점), expert(0~100 평점) 혼합.
 * other users(otherUser1·2·3)와 anon-* 사용자가 작성.
 */

import type { Review } from '@/types';

export const REVIEWS: Review[] = [
  /* bdx-margaux */
  {
    id: 'rev_001',
    userId: 'other-001',
    wineId: 'bdx-margaux',
    body: {
      ko: '마고는 향만으로 와인의 위계를 보여준다. 카시스와 시더가 켜켜이 쌓인다.',
      en: 'Margaux reveals its hierarchy on the nose alone. Cassis and cedar lay in layers.',
    },
    rating: 95,
    mode: 'expert',
    createdAt: '2026-01-15',
    likesCount: 42,
  },
  {
    id: 'rev_002',
    userId: 'other-002',
    wineId: 'bdx-margaux',
    body: {
      ko: '특별한 날이라 열어봤다. 향이 깨어나는 데 두 시간은 걸렸다.',
      en: 'Opened for a special day. The aromatics took two hours to wake.',
    },
    rating: 5,
    mode: 'beginner',
    createdAt: '2026-02-08',
    likesCount: 28,
  },
  {
    id: 'rev_003',
    userId: 'other-003',
    wineId: 'bdx-margaux',
    body: {
      ko: '2018 빈티지는 향기와 골격의 균형이 완벽하다. 2035년 이후가 더 기대된다.',
      en: 'The 2018 vintage has perfect balance of perfume and structure. The mid-2030s will be even better.',
    },
    rating: 96,
    mode: 'expert',
    createdAt: '2026-03-22',
    likesCount: 67,
  },

  /* bgy-romanee-st-vivant */
  {
    id: 'rev_004',
    userId: 'other-003',
    wineId: 'bgy-romanee-st-vivant',
    body: {
      ko: '향기 그 자체가 풍성한 한 끼다. 추출은 어디에도 없다.',
      en: 'The perfume alone is a full meal. There is no extraction anywhere.',
    },
    rating: 98,
    mode: 'expert',
    createdAt: '2026-02-14',
    likesCount: 88,
  },
  {
    id: 'rev_005',
    userId: 'other-001',
    wineId: 'bgy-romanee-st-vivant',
    body: {
      ko: '딸기와 장미가 떼루아의 마법을 보여준다. 5년 더 기다리겠다.',
      en: 'Strawberry and rose reveal the terroir spell. I will wait five more years.',
    },
    rating: 96,
    mode: 'expert',
    createdAt: '2026-04-10',
    likesCount: 54,
  },

  /* cha-krug-grande-cuvee */
  {
    id: 'rev_006',
    userId: 'other-002',
    wineId: 'cha-krug-grande-cuvee',
    body: {
      ko: '120개 이상의 와인이 들어간 한 잔이라는 사실이 와닿는다.',
      en: 'You can feel that this glass contains 120+ wines.',
    },
    rating: 5,
    mode: 'beginner',
    createdAt: '2026-03-05',
    likesCount: 33,
  },
  {
    id: 'rev_007',
    userId: 'other-001',
    wineId: 'cha-krug-grande-cuvee',
    body: {
      ko: '브리오슈와 헤이즐넛이 가장 길게 머문 NV. 한 병의 시간을 만진다.',
      en: 'The NV where brioche and hazelnut linger longest. You touch the time of a bottle.',
    },
    rating: 95,
    mode: 'expert',
    createdAt: '2026-01-28',
    likesCount: 71,
  },

  /* tus-brunello-biondi-santi */
  {
    id: 'rev_008',
    userId: 'other-001',
    wineId: 'tus-brunello-biondi-santi',
    body: {
      ko: '오래된 슬라보니아 오크가 만든 절제. 산지오베제의 정점.',
      en: 'Restraint built by old Slavonian oak. The peak of Sangiovese.',
    },
    rating: 94,
    mode: 'expert',
    createdAt: '2026-02-20',
    likesCount: 45,
  },
  {
    id: 'rev_009',
    userId: 'other-003',
    wineId: 'tus-brunello-biondi-santi',
    body: {
      ko: '가죽과 타르가 천천히 펼쳐진다. 30년을 견디는 와인.',
      en: 'Leather and tar unfold slowly. A wine that lasts thirty years.',
    },
    rating: 95,
    mode: 'expert',
    createdAt: '2026-04-02',
    likesCount: 52,
  },

  /* pie-barolo-giacomo-conterno */
  {
    id: 'rev_010',
    userId: 'other-003',
    wineId: 'pie-barolo-giacomo-conterno',
    body: {
      ko: '바롤로 전통주의의 마지막 보루. 장미와 타르의 삼각 균형.',
      en: 'The last bastion of traditional Barolo. The triangular balance of rose and tar.',
    },
    rating: 97,
    mode: 'expert',
    createdAt: '2026-01-30',
    likesCount: 81,
  },
  {
    id: 'rev_011',
    userId: 'other-001',
    wineId: 'pie-barolo-giacomo-conterno',
    body: {
      ko: '카시나 프란치아의 클래식. 90일 침용이 빚은 골격.',
      en: 'The classical Cascina Francia. A spine built by 90-day maceration.',
    },
    rating: 95,
    mode: 'expert',
    createdAt: '2026-03-18',
    likesCount: 49,
  },

  /* rio-lopez-de-heredia */
  {
    id: 'rev_012',
    userId: 'other-002',
    wineId: 'rio-lopez-de-heredia',
    body: {
      ko: '리오하인데 부르고뉴 같다. 시간이 만든 결실.',
      en: "It's a Rioja that drinks like Burgundy. A harvest shaped by time.",
    },
    rating: 5,
    mode: 'beginner',
    createdAt: '2026-02-25',
    likesCount: 38,
  },
  {
    id: 'rev_013',
    userId: 'other-001',
    wineId: 'rio-lopez-de-heredia',
    body: {
      ko: '셀러에서 10년 보낸 와인의 무게. 가죽과 시더가 단정하다.',
      en: 'The weight of ten years in cellar. Leather and cedar sit clean.',
    },
    rating: 93,
    mode: 'expert',
    createdAt: '2026-04-15',
    likesCount: 41,
  },

  /* rhn-chateau-rayas */
  {
    id: 'rev_014',
    userId: 'other-003',
    wineId: 'rhn-chateau-rayas',
    body: {
      ko: '100% 그르나슈로 빚은 부르고뉴식 우아함. 모래 토양의 마법.',
      en: 'Burgundian grace from 100% Grenache. The magic of sand soils.',
    },
    rating: 96,
    mode: 'expert',
    createdAt: '2026-03-10',
    likesCount: 62,
  },
  {
    id: 'rev_015',
    userId: 'other-001',
    wineId: 'rhn-chateau-rayas',
    body: {
      ko: '샤또네프지만 갈렛 위 와인과는 다른 결. 우아함이 본질.',
      en: 'A Châteauneuf but a different grain from the galet wines. Grace is its essence.',
    },
    rating: 94,
    mode: 'expert',
    createdAt: '2026-02-18',
    likesCount: 35,
  },

  /* mos-egon-muller-scharzhof */
  {
    id: 'rev_016',
    userId: 'other-003',
    wineId: 'mos-egon-muller-scharzhof',
    body: {
      ko: '잔당과 산미의 비현실적 균형. 50년을 더 견딜 와인.',
      en: 'The unreal balance of sugar and acid. A wine built for another 50 years.',
    },
    rating: 96,
    mode: 'expert',
    createdAt: '2026-01-25',
    likesCount: 73,
  },
  {
    id: 'rev_017',
    userId: 'other-002',
    wineId: 'mos-egon-muller-scharzhof',
    body: {
      ko: '리슬링은 시간이 빚는다는 말을 처음으로 이해했다.',
      en: 'First time I truly understood that Riesling is shaped by time.',
    },
    rating: 5,
    mode: 'beginner',
    createdAt: '2026-03-30',
    likesCount: 27,
  },

  /* nap-screaming-eagle */
  {
    id: 'rev_018',
    userId: 'other-003',
    wineId: 'nap-screaming-eagle',
    body: {
      ko: '컬트 와인의 표본이지만, 농축 너머의 균형이 있다.',
      en: 'A textbook cult wine, yet there is balance beyond the concentration.',
    },
    rating: 95,
    mode: 'expert',
    createdAt: '2026-04-08',
    likesCount: 56,
  },
  {
    id: 'rev_019',
    userId: 'other-001',
    wineId: 'nap-screaming-eagle',
    body: {
      ko: '오크빌의 햇볕이 잔에 그대로 담겼다. 흑연이 깊다.',
      en: "Oakville sunlight sits in the glass intact. The graphite runs deep.",
    },
    rating: 94,
    mode: 'expert',
    createdAt: '2026-02-12',
    likesCount: 39,
  },

  /* por-niepoort-vintage-port */
  {
    id: 'rev_020',
    userId: 'other-001',
    wineId: 'por-niepoort-vintage-port',
    body: {
      ko: '빈티지 포트는 시간을 마시는 일. 2040년대를 위해.',
      en: 'Vintage Port is drinking time itself. Save it for the 2040s.',
    },
    rating: 93,
    mode: 'expert',
    createdAt: '2026-03-15',
    likesCount: 44,
  },

  /* arg-catena-zapata-malbec */
  {
    id: 'rev_021',
    userId: 'other-001',
    wineId: 'arg-catena-zapata-malbec',
    body: {
      ko: '안데스 1500m 고도의 말벡. 흑연과 제비꽃의 미네랄 균형.',
      en: 'A Malbec from 1,500 m in the Andes. The mineral balance of graphite and violet.',
    },
    rating: 94,
    mode: 'expert',
    createdAt: '2026-04-20',
    likesCount: 47,
  },
  {
    id: 'rev_022',
    userId: 'other-002',
    wineId: 'arg-catena-zapata-malbec',
    body: {
      ko: '말벡이 이렇게 단단할 수 있다는 걸 처음 봤다.',
      en: 'First time I saw a Malbec this firm.',
    },
    rating: 5,
    mode: 'beginner',
    createdAt: '2026-02-28',
    likesCount: 31,
  },

  /* aus-penfolds-grange */
  {
    id: 'rev_023',
    userId: 'other-003',
    wineId: 'aus-penfolds-grange',
    body: {
      ko: '호주의 국가급. 시라즈 중심의 농축과 유칼립투스가 시그니처.',
      en: "Australia's national icon. Shiraz-led concentration and eucalyptus are the signature.",
    },
    rating: 95,
    mode: 'expert',
    createdAt: '2026-03-25',
    likesCount: 58,
  },
  {
    id: 'rev_024',
    userId: 'other-001',
    wineId: 'aus-penfolds-grange',
    body: {
      ko: '단일 빈야드가 아닌 호주 전역 블렌드의 미학. 매년 다르되 매년 그란지.',
      en: 'The aesthetic of an all-Australia blend, not a single vineyard. Different yearly, always Grange.',
    },
    rating: 93,
    mode: 'expert',
    createdAt: '2026-01-18',
    likesCount: 42,
  },

  /* 짧은 daily reviews (4개) */
  {
    id: 'rev_025',
    userId: 'other-002',
    wineId: 'tus-chianti-classico',
    body: {
      ko: '식사와 친구. 토마토 파스타에 늘 좋다.',
      en: 'A friend to dinner. Always good with tomato pasta.',
    },
    rating: 4,
    mode: 'beginner',
    createdAt: '2026-02-04',
    likesCount: 12,
  },
  {
    id: 'rev_026',
    userId: 'other-002',
    wineId: 'rioja',
    body: {
      ko: '미국 오크의 바닐라. 입문자에게 권한다.',
      en: 'The vanilla of American oak. I recommend it to beginners.',
    },
    rating: 4,
    mode: 'beginner',
    createdAt: '2026-03-12',
    likesCount: 9,
  },
  {
    id: 'rev_027',
    userId: 'other-002',
    wineId: 'casillero',
    body: {
      ko: '가격대비 안정. 평일 저녁의 동반자.',
      en: 'Reliable for the price. The friend of a weeknight.',
    },
    rating: 3,
    mode: 'beginner',
    createdAt: '2026-04-04',
    likesCount: 5,
  },
  {
    id: 'rev_028',
    userId: 'other-002',
    wineId: 'jacobs',
    body: {
      ko: '입문자에게 권하는 호주 시라즈. 흑후추가 친근하다.',
      en: 'An Australian Shiraz to recommend to beginners. The black pepper feels familiar.',
    },
    rating: 3,
    mode: 'beginner',
    createdAt: '2026-04-22',
    likesCount: 7,
  },
];

export function getReviewsByWine(wineId: string): Review[] {
  return REVIEWS.filter((r) => r.wineId === wineId);
}

export function getReviewsByUser(userId: string): Review[] {
  return REVIEWS.filter((r) => r.userId === userId);
}
