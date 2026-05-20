# 와인 상세 (`/wine/[id]`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/wine/[id]` (예: `/wine/bdx-margaux-2010`) |
| 파일 | `src/app/wine/[id]/page.tsx` (86 라인 — 대부분 컴포넌트 위임) |
| 헤더 | `<BackHeader title={wine.name}>` + 우측 `<FavoriteToggle wineId={wine.id} />` |
| BottomNav | 표시 |
| 진입 가드 | `getWine(id) == null`이면 `notFound()` (Next.js 404 페이지) |
| Feature flag 키 | 페이지 자체는 등록 X — 하위 컴포넌트(MyTastingNoteCard 등)가 자기 페이지 키로 등록할 수 있음 |
| 렌더 | **Server Component** (async page) |
| 베타 피드백 7항목 중 4항목 집중 | ExternalRatingsCard / PriceChart / CommunityDrinkWindowCard / WineStoryCard |

---

## 진입 경로

- `/cellar` 셀러 카드 일부 (TastedWineRow "와인 상세")
- `/cellar/[id]` "와인 상세 보기 →" 링크
- `/map` BottomSheet 와인 행
- 홈 WineFeed 카드 클릭
- 즐겨찾기 행 클릭
- 알림 `favoritePurchase + wineId` 클릭
- 노트 상세 페이지 와인 헤더

---

## 데이터 로딩 (서버에서 한 번에)

```ts
const wine = getWine(id);                                 // null이면 notFound()
const externalRating = wine.externalRatingsId ? getExternalRating(wine.id) : null;
const story          = wine.storyId           ? getWineStory(wine.id) : null;
const purchases      = getPurchasesByWine(wine.id);
const reviews        = getReviewsByWine(wine.id);
const aggregate      = getCommunityPeakAggregate(wine.id);
```

---

## 페이지 구성 (위→아래)

`<main>` flex column gap 16, padding-bottom 96.

### 1. WineHeader

`src/components/wine-detail/wine-header.tsx`

- 라디얼 그라데이션 헤로 (Hero 240+ height)
- 88×290 `<WMBottle>` 중앙 (와인 타입별 보틀 색)
- 와인 타입 색 도트 + 와인명 (Playfair) + 생산자 · 빈티지 + 지역 · 국가
- 아펠라시옹 칩 (해당 시)

### 2. MyTastingNoteCard (내 노트 있을 때만)

`src/components/wine-detail/my-tasting-note-card.tsx`

- 내가 작성한 노트가 있으면 노출 (조건부 자체 가드)
- 내 평점/100 + 메모 일부
- "커뮤니티는 평균 {N}/100점 / Community avg: {N}/100" 비교 인사이트
- 노트 클릭 → `/notes/[noteId]`

### 3. WriteNoteCta (내 노트 없을 때만)

`src/components/wine-detail/write-note-cta.tsx`

- "아직 노트가 없어요 / No notes yet"
- "이 와인의 시음 경험을 기록해보세요 / Record your tasting experience"
- 골드 보더 카드 + "노트 작성 / Write Note" 버튼 → `/notes/new/write?wineId={id}&from=newEntry`

> 둘 다 컴포넌트 내부에서 mount 가드 (`getMyNote(userId, wineId)` 등) — 페이지에서는 둘 다 mount

### 4. ExternalRatingsCard (베타 피드백 #5)

`src/components/wine-detail/external-ratings-card.tsx`

3 소스 (rating prop 통해 lookup):

- **Vivino**: 4.X / 5 별점 + 리뷰 수 + 로고
- **Wine Searcher**: WS 평균가 `$XXX` + 매칭 매장 수
- **CellarTracker**: CT 평점 95/100 + 시음 노트 수

각 행: 로고 + 점수 + 메타 + 외부 링크 아이콘 → 클릭 시 placeholder toast.

### 5. AveragePricePill

`src/components/wine-detail/average-price-pill.tsx`

- `<AveragePricePill purchases fallbackKrw={wine.averagePriceKrw} />`
- 평균 가격 칩 (gold 보더 + 골드 text) `₩{N}`

### 6. PriceChart (compact variant)

`src/components/wine-detail/price-chart.tsx` + `price-chart-inner.tsx` (dynamic SSR off)

- `<PriceChart wineId purchases variant="compact" />`
- Recharts LineChart 200×120 + "가격 추이 상세보기 → / Price detail →" 링크 → `/wine/[id]/prices`

### 7. CommunityDrinkWindowCard (베타 피드백 — community peak)

`src/components/community-drink-window/community-drink-window-card.tsx`

- `<CommunityDrinkWindowCard wineId aggregate />`
- 미니 히스토그램 (PeakDistribution compact)
- "{N}명 추정 · 평균 {year}년 / N estimates · avg {year}"
- 상세 링크 → `/wine/[id]/community-peak`

### 8. WineStoryCard (베타 피드백 #3)

`src/components/wine-story/wine-story-card.tsx`

- `<WineStoryCard wineId story />`
- 와이너리 스토리 요약 카드
- "전체 보기 →" → `/wine/[id]/story`

### 9. ReviewList

`src/components/wine-detail/review-list.tsx`

- 최근 리뷰 ~3개 + "더 보기" CTA
- 각 ReviewCard에 작성자 LevelPill 강제

### 10. AddToCellarCta (인라인 variant)

`src/components/wine-detail/add-to-cellar-cta.tsx`

- `<AddToCellarCta wineId variant="inline" />`
- padding `8px 16px 0`
- "내 셀러에 추가 / Add to my cellar" 버튼
- 클릭 시 `addCellarItem(...)` UserDataContext + `+5 XP` 토스트

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| FavoriteToggle Heart | 클릭 | `FavoritesContext.toggle(wineId)` localStorage 갱신 |
| MyTastingNoteCard | 클릭 | `/notes/[noteId]` |
| WriteNoteCta | 클릭 | `/notes/new/write?wineId={id}&from=newEntry` |
| External 링크 아이콘 | 클릭 | placeholder toast |
| PriceChart "상세보기 →" | 클릭 | `/wine/[id]/prices` |
| CommunityDrinkWindow 상세 링크 | 클릭 | `/wine/[id]/community-peak` |
| WineStoryCard "전체 보기 →" | 클릭 | `/wine/[id]/story` |
| ReviewList "더 보기" | 클릭 | (현재) placeholder |
| AddToCellarCta | 클릭 | UserDataContext.addCellarItem + +5 XP 토스트 |

---

## 상태 관리

- **Server Component**: `useState` 없음. 모든 데이터 서버에서 한 번에 로드
- 하위 클라이언트 컴포넌트가 각자 Context 사용 (`FavoritesContext`, `UserDataContext`)

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getWine(id)` | 메인 lookup, 없으면 `notFound()` |
| `getExternalRating(id)` | Vivino/WS/CT 점수 (옵셔널) |
| `getWineStory(id)` | 와이너리 스토리 (옵셔널) |
| `getPurchasesByWine(id)` | 가격 추이 + 평균가 |
| `getReviewsByWine(id)` | 리뷰 리스트 |
| `getCommunityPeakAggregate(id)` | 커뮤니티 음용 적기 히스토그램 데이터 |

---

## 모드 분기

- `MyTastingNoteCard` vs `WriteNoteCta`: 내 노트 유무에 따라
- `beginner` vs `expert`: 페이지 자체는 분기 X — MyTastingNoteCard 내부에서 평점 표기만 다름
- `ko` vs `en`: BackHeader title은 `wine.name` (locale-neutral 와인명 string), 그 외 LocalizedString 컴포넌트가 분기
- 다크 vs 라이트: 토큰 기반 자동 분기

---

## i18n 키 prefix

페이지 자체는 인라인 텍스트 없음 — 하위 컴포넌트가 다음 prefix 사용:
- `wineDetail.*`, `wineDetail.externalRatings.*`
- `wineDetail.priceChart.*`, `wineDetail.communityPeak.*`
- `wineDetail.story.*`, `wineDetail.reviews.*`
- `wineDetail.writeNote.*`, `wineDetail.myNote.*`
- `wineDetail.addToCellar.*`

---

## 빈/오류 상태

- **wine 없음**: `notFound()` → app/not-found.tsx
- **externalRating 없음**: ExternalRatingsCard가 자체 빈 상태 노출
- **story 없음**: WineStoryCard가 자체 빈 상태 ("스토리 준비 중" 등)
- **reviews 없음**: ReviewList가 자체 빈 상태 ("아직 리뷰가 없어요")
- **aggregate.count === 0**: CommunityDrinkWindowCard가 "데이터 부족" 상태

---

## 디자인 토큰 / 스타일

- 하단 padding 96 — BottomNav 위로 콘텐츠가 가려지지 않게
- 섹션 간 gap 16 (flex column)
- 모든 카드 Surface 토큰 + default border + rounded 12~16
