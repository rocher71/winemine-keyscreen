---
name: winemine-mock-fixtures
description: winemine 키스크린의 모든 mock fixture 파일을 작성하는 스킬. src/lib/mock/ 디렉토리에 users/wines/cellar/tasting-notes/purchases/stores/notifications/favorites/badges/levels/reviews/wine-stories/external-ratings/community-peaks/label-photos/glossary 16개 fixture + 보조 lib(xp.ts, drink-window.ts, regional-aromas.ts, community-peak-aggregator.ts, compatibility.ts). 모든 사용자 노출 문자열은 LocalizedString { ko, en } 패턴, 헤비 유저는 풍부한 데이터, first-time은 빈 컬렉션. 다음 키워드/상황에서 반드시 트리거할 것: 'mock 데이터 만들어', 'fixture 작성', '와인 카탈로그 생성', '셀러 mock', '베타 피드백 mock 데이터', 'community peaks', '와이너리 스토리 데이터', '외부 평점 mock', 'glossary 시드', 'regional aromas 매핑'. 후속 작업으로 '신규 와인 추가', 'mock 데이터 정합 수정'도 트리거.
---

# winemine-mock-fixtures — 데이터 fixture 작성

## 목적

WINEMINE_KEYSCREEN_SPEC.md `core_data_entities` + `key_implementation_notes.mock_data_setup` 기준 모든 mock fixture를 작성. 시안 검수자가 보기에 "와인 도메인에 진짜 같은" 디테일.

## Why fixture를 한 에이전트가?

LocalizedString shape 일관성, mock 카운트 정합(헤비 유저 stats와 실제 컬렉션 일치), 와인 ID 참조 무결성을 단일 에이전트가 책임지면 페이지 빌더가 안심하고 import할 수 있다. 분산해서 만들면 ID 충돌·shape 불일치가 빈발.

## 작성 순서 (의존 순)

```
1. types/index.ts            ← 모든 타입 먼저
2. levels.ts → badges.ts     ← 정적 카탈로그
3. users.ts                  ← currentUserHeavy/First/otherUsers 3명
4. stores.ts                 ← 매장 14개
5. wines.ts                  ← 60종 카탈로그 (recommended-wines.ts 재사용)
6. wine-stories.ts           ← 12종 와인의 스토리
7. external-ratings.ts       ← 12종 외부 평점
8. regional-aromas.ts (lib/) ← 지역·품종 → lex id 매핑
9. drink-window.ts (lib/)    ← vintage+grape → drinkWindow
10. cellar.ts                ← 헤비 28 + first-time 0
11. tasting-notes.ts         ← 헤비 47 (beginner/expert mix)
12. purchases.ts             ← 12 와인 × 4~9건 ~ 70건
13. community-peaks.ts       ← 12 와인 × 30명 ~ 360 추정
14. community-peak-aggregator.ts (lib/) ← 가중 평균/중앙값/분포 계산
15. reviews.ts               ← 와인별 리뷰
16. notifications.ts         ← 헤비 12개
17. favorites.ts             ← 헤비 7개
18. label-photos.ts          ← 헤비 24개
19. glossary.ts              ← 12 시드 entry
20. xp.ts (lib/)             ← XP → level 변환
21. compatibility.ts (lib/)  ← 두 유저 매치 %
```

## LocalizedString 패턴

```ts
export type LocalizedString = { ko: string; en: string };
```

모든 사용자 노출 문자열은 이 형태. 와인명·생산자(Château Margaux)는 두 locale 같지만 객체로 통일.

**검증:** 모든 LocalizedString의 `en` 필드를 정규식 `/[가-힯]/`로 검사 → 매치 0건이어야 함.

## 핵심 데이터 정합 규칙

### users.ts — currentUserHeavy

```ts
{
  id: 'me-heavy',
  displayName: { ko: '예진', en: 'Yejin' },
  avatarInitial: { ko: '예', en: 'Y' },
  locale: 'ko',
  experience: 'expert',
  xp: 1280,
  levelId: 3,
  joinedAt: '2025-09-12',
  badges: ['badge_001', 'badge_002', 'badge_004', 'badge_007', 'badge_008', 'badge_009', 'badge_011'],
  stats: {
    winesTasted: 32,
    countriesExplored: 8,
    regionsExplored: 14,
    notesCount: 47,
    cellarCount: 28,
  },
}
```

**stats 정합:**
- `winesTasted`는 헤비 유저가 마신 unique 와인 수 (tasting-notes의 wineId 중복 제거 후 count)
- `cellarCount`는 cellar.ts에서 헤비 항목 개수와 일치
- `notesCount`는 tasting-notes에서 헤비 노트 개수와 일치
- countries / regions도 tasting-notes 합집합으로 계산 가능해야 함

### wines.ts — 60종

- 기존 `src/lib/recommended-wines.ts`의 8종을 re-export로 포함
- 추가 52종은 다음 지역에서 분배:
  - Bordeaux 5, Burgundy 8, Champagne 6, Rhône 4, Loire 3
  - Italy: Tuscany 4, Piedmont 3, Veneto 2
  - Spain: Rioja 3, Ribera del Duero 2
  - Germany: Mosel 2
  - Portugal 2
  - USA: Napa 4, Sonoma 2
  - Australia: Barossa 2, Margaret River 1
  - Chile 2, Argentina 2, South Africa 2, New Zealand 1

각 와인:
- `isoNumeric`: ISO 3166-1 numeric, 3자리 0패딩, `world-110m.json` geo.id와 매칭 가능
- `coords`: 지역의 대략적 위경도
- `drinkWindow`: vintage 기준 from/peak/to 연도
- `servingTempCelsius`: { min, max } — 와인 타입별 (red 16~18, white 8~12, sparkling 6~8 등)
- `bottleColor`: hex (라벨 일러용)
- `signatureAromaLexIds`: regional-aromas.ts에서 자동 유도 가능 (또는 직접 명시)

### community-peaks.ts (베타 피드백 핵심)

12종 와인 × 약 30 명 = 약 360개 추정. **reviewerLevel은 L3~L5만** (스펙: L3+ 가드).

각 추정:
```ts
{
  id: 'cp_001',
  wineId: 'bdx-margaux',
  userId: 'user_anon_42',
  estimatedPeakYear: 2030,
  confidence: 'medium',
  note: null,
  createdAt: '2025-11-15',
  reviewerLevel: 4,
}
```

분포는 시스템 추정 peak 주변에서 정규분포 + 약간 늦은 쪽으로 bias (전문가들이 시스템보다 좀 더 늦게 보는 경향 시뮬).

### external-ratings.ts (베타 피드백)

12종 와인에만 시드 (나머지 48종은 ExternalRating 없음 → 카드에서 빈 상태 표시):

```ts
{
  id: 'er_bdx-margaux',
  wineId: 'bdx-margaux',
  vivino: { score: 4.5, reviewCount: 12450 },
  wineSearcher: { score: 93, priceRank: 'Top 10% of Bordeaux' },
  cellarTracker: { score: 92, reviewCount: 3210 },
  globalAvgPriceUsd: 480,
  lastSyncedAt: '2026-04-30',
}
```

### wine-stories.ts (베타 피드백)

12종 와인 — 와이너리 역사 3~4문단 + funFact 1줄 + 양조 철학 1단락:

```ts
{
  id: 'ws_bdx-margaux',
  wineryName: { ko: '샤또 마고', en: 'Château Margaux' },
  foundedYear: 1572,
  location: { ko: '프랑스, 보르도, 메독, 마고', en: 'France, Bordeaux, Médoc, Margaux' },
  history: { ko: '...', en: '...' }, // 3~4문단
  funFact: { ko: '...', en: '...' },
  philosophy: { ko: '...', en: '...' },
  vineyardArea: '85 ha',
  producerPhotoUrl: null,
}
```

### regional-aromas.ts (베타 피드백)

지역·품종 → 시그니처 lex id 매핑. lex id는 `src/lib/tasting-note-lexicon.ts`의 AROMA_LEXICON에 실제 존재하는 것만:

```ts
export const REGIONAL_AROMAS: Record<string, string[]> = {
  'fr-champagne': ['brioche', 'yeast', 'apple', 'hazelnut', 'citrus', 'biscuit'],
  'it-brunello': ['cherry', 'leather', 'tobacco', 'dried-herb', 'balsamic'],
  'it-barolo': ['rose', 'tar', 'truffle', 'cherry', 'dried-rose', 'licorice'],
  'fr-beaujolais': ['banana', 'cherry', 'bubblegum', 'violet', 'fresh-red-berry'],
  'fr-bdx-left': ['cassis', 'cedar', 'pencil-shaving', 'graphite', 'blackcurrant'],
  'fr-bgy-nuits': ['strawberry', 'raspberry', 'mushroom', 'forest-floor', 'violet'],
  'fr-bgy-beaune': ['hazelnut', 'butter', 'citrus', 'mineral', 'white-flower'],
  'de-mosel': ['petrol', 'lime', 'slate', 'white-peach', 'apricot'],
};

export function getRegionalAromasForWine(wine: Wine): string[] {
  // wine.region/grapes → key 매핑 후 lex id 배열 반환
}
```

존재하지 않는 lex id는 콘솔 경고 + skip. QA가 검증.

### glossary.ts (베타 피드백 — "카우달리가 뭐예요")

12 시드 entry. 각 entry:
- `term`, `definition` (2~4문장), `examples` (선택), `source` (선택), `category`, `relatedTermIds[]`
- 출처는 가능하면 명시 (WSET, Peynaud, AWRI, EU Reg 607/2009 등)

### community-peak-aggregator.ts

```ts
export function aggregateCommunityPeaks(estimates: CommunityPeakEstimate[]): CommunityPeakAggregate {
  const weights = { 3: 1.0, 4: 1.5, 5: 2.0 };
  // 가중 평균, 가중 중앙값, 연도별 가중 응답 수 분포
}
```

### xp.ts

```ts
export const XP_ACTIONS = {
  cellarAdd: 5,
  beginnerNote: 10,
  expertNote: 20,
  expertBlindNote: 25,
  photoAttach: 5,
  priceAdd: 5,
  peakEstimate: 5,
  firstCountry: 30,
  firstRegion: 15,
  communityReview: 15,
} as const;

export function xpToLevel(xp: number): { levelId: number; progressPct: number } { ... }
```

## 자체 검증 체크리스트

작성 후 직접 확인:
- [ ] `grep -rE '[가-힯]' src/lib/mock/*.ts | grep -v '\.ko:'` → 영어 필드에 한글 누출 0
- [ ] currentUserHeavy stats가 mock 카운트와 일치
- [ ] regional-aromas의 모든 lex id가 lexicon.ts AROMA_LEXICON에 존재
- [ ] community-peaks의 reviewerLevel ∈ {3, 4, 5} 만
- [ ] external-ratings 12종, wine-stories 12종 (같은 와인 ID 셋)

## 스킬 종료 조건

- 16개 fixture + 5개 lib 모듈 작성 완료
- TypeScript strict 통과 (any 0)
- 자체 검증 체크리스트 통과
- `_workspace/B_mock_data_report.md` 작성 (각 fixture 카운트 + LocalizedString 검증 결과 포함)
