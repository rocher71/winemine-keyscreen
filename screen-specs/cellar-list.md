# 셀러 리스트 (`/cellar`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/cellar` |
| 파일 | `src/app/cellar/page.tsx` (892 라인) |
| 헤더 | `<AppHeader hasUnreadNotification avatarInitial levelId={user.id==='me-heavy' ? user.levelId : null} />` |
| BottomNav | 표시 (셀러 탭 활성) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/cellar` — 6개 (`cellar.titleBar`, `cellar.search`, `cellar.typeFilter`, `cellar.sortChips`, `cellar.resultCount`, `cellar.grid`) |

---

## 진입 경로

- BottomNav 셀러 탭
- `/capture` 인식 결과 → "셀러에 추가" → `router.push('/cellar')`
- `/capture` "내 라이브러리" 카드
- 홈/지도 등 quick action

---

## 페이지 구성

`<div className="wm-scroll-area">` 안에 다음이 들어간다.

### 1. Title Bar — 탭 세그먼트 + 추가 버튼 (padding `8px 16px 12px`, gap 10)

- **탭 세그먼트** (Surface 1px border, padding 3, gap 2, rounded 10):
  - `내 셀러` (key `cellar`) — count = `rawItems.length`
  - `마신 와인` (key `tasted`) — count = `tastedItems.length`
  - 활성 탭: bg 와인레드, cream text
  - 비활성: transparent, muted text
  - 카운트는 작은 10px weight 700, 활성 시 cream 70%

- **+ 추가 버튼** (`tab === 'cellar'`일 때만):
  - `<Plus size={14}>` + `t('addCta')` ("셀러에 추가 / Add to cellar")
  - 클릭 시 `toast({ message: t('addToast') })` PlaceholderToast ("곧 추가 기능을 지원해요")

### 2-A. `내 셀러 탭` (`tab === 'cellar'`)

#### 2-A-1. 빈 상태

`hasAnyItems === false` (= `rawItems.length === 0`)이면 `<CellarEmptyState />` 노출 (와인 SVG + "셀러가 비어있어요 / Cellar is empty" + 첫 스캔 CTA).

#### 2-A-2. 검색 입력

- Surface + border, rounded 12, padding `10px 12px`, gap 8
- 좌측 `<Search size={16} muted>`
- `<input>` placeholder `t('searchPlaceholder')` ("이름·생산자·지역·빈티지 / Name · Producer · Region · Vintage")
- 우측 `<X size={12}>` 22×22 원형 버튼 — value가 있을 때만 노출, 클릭 시 `setQuery('')`

#### 2-A-3. 와인 타입 필터 칩 (수평 스크롤)

`TYPE_FILTERS = ['all', 'red', 'white', 'sparkling', 'rosé', 'fortified']` (6종, dessert는 칩에서 제외):

- 활성: 골드 보더 + `rgba(201,168,76,0.12)` bg + 골드 text
- 비활성: default border + transparent + muted text
- 칩 좌측 8×8 `<TypeDot>` 색 도트:
  - `all` → 와인레드→골드→크림 conic 그라데이션
  - `red` → `#8B1A2A`
  - `white` → `#E8D89B`
  - `sparkling` → `#F5F0E8`
  - `rosé` → `#D4707A`
  - `fortified` → `#6B1421`
  - `dessert` → `#C9A84C`
- 라벨: `t('filterType.{key}')`

#### 2-A-4. 정렬 칩 (수평 스크롤)

`SORT_KEYS = ['recent', 'drinkSoon', 'vintage', 'region', 'storage', 'price']`:

- 활성: 와인레드 bg + cream text
- 비활성: default border + transparent + secondary text
- 라벨: `t('sort.{key}')` ("최근 등록 / 음용 시기 임박 / 빈티지 / 지역 / 보관 장소 / 가격")

**정렬 알고리즘**:
- `recent`: `new Date(b.acquiredAt) - new Date(a.acquiredAt)` 내림차순
- `drinkSoon`: `Math.abs(getDrinkWindow(wine).peak - currentYear)` 오름차순
- `vintage`: `b.vintage - a.vintage` (최신 빈티지 우선)
- `region`: `region.en` localeCompare
- `storage`: `storage` localeCompare
- `price`: `(b.purchasePriceKrw ?? 0) - (a.purchasePriceKrw ?? 0)`

#### 2-A-5. 결과 카운트 + 초기화 버튼

`isFiltered = query.trim().length > 0 || typeFilter !== 'all'`:

- 적용 중: `t('resultCount.filtered', { shown, total })`
- 적용 없음: `t('resultCount.total', { total })`
- 우측: shown ≠ total이면 골드 "필터 초기화 / Clear filters" 버튼 → `setQuery(''); setTypeFilter('all')`

#### 2-A-6. 결과 카드 그리드 (2열, gap 12, padding `0 16px 24px`)

- 결과 0이면 `<NoResults>` 카드 (dashed border, "결과 없음" + 초기화 버튼)
- 있으면 `<CellarCard item={it} wine={wine} />` 매핑

**CellarCard 구조** (`src/components/cellar/cellar-card.tsx`):
- 좌상단 색 도트 (wine type)
- 우상단 `<DrinkWindowBadge status={status} fromYear={from} />` (peakSoon/inPeak/tooEarly/pastPeak)
- 중앙 `<WMBottle bottleColor producer label vintage>` (와인 타입 색)
- 와인명 (Playfair 14px)
- 생산자 · 빈티지 · 지역
- 카드 클릭 → `<Link href={`/cellar/${item.id}`}>`

### 2-B. `마신 와인 탭` (`tab === 'tasted'`)

`<TastedWinesList items={tastedItems} query={query} setQuery={setQuery} locale={locale} />`

`tastedItems` 계산:
```ts
notes = getTastingNotesByUser(user.id).sort(tastedAt desc)
seen = Set<wineId>
for note of notes:
  if seen.has(wineId): continue
  result.push({ note, wine: getWine(note.wineId) })
```
= **wineId 기준 dedup, 최근 노트 1건만 표시**.

#### 2-B-1. 검색 입력 (동일 디자인, locale별 placeholder)

placeholder는 `locale === 'ko' ? '이름·생산자·지역·빈티지' : 'Name, producer, region, vintage'` 인라인.

#### 2-B-2. 결과 카운트 (`${N}병 시음 기록 / ${N} tasting records`)

#### 2-B-3. TastedWineRow 리스트 (flex column gap 8)

각 행 Surface + border, rounded 14.

**상단 row** (padding 12, gap 12):
- 좌측 `<WMBottle width={36} height={118}>`
- 우측 메타:
  - `<WineTypeDotSmall wineType={wine.wineType} locale={locale} />` (색 도트 7×7 + 라벨)
  - 우측 끝 9px disabled 날짜 `note.tastedAt.slice(0, 10)` (YYYY-MM-DD)
  - Playfair 14px 와인명 (2-line clamp)
  - Inter 11px muted producer · vintage
  - Inter 10px muted region

**구분선** (0.5px default, margin `0 12px`)

**노트 미리보기 카드** (padding `10px 12`):
- 헤더 (gap 8):
  - `<svg pen 11px gold>` 펜 아이콘
  - `내 시음 노트 / My Tasting Note` (Inter 10px weight 600, golden, letter-spacing 0.12em, UPPERCASE)
  - 모드 뱃지: `expert`(와인레드 25% bg + cream text) / `beginner`(골드 15% bg + golden text), 9px weight 700 UPPERCASE
  - 우측: 평점 큰 골드 Playfair 13px (`expert ? '${rating}/100' : '${rating}/5'`)
- **WMGlassRating** (size 9, value = `Math.round(rating)` — expert면 `/20`로 환산)
- **beginner 전용**: aroma 힌트 텍스트 — `note.beginnerFields.aromas.slice(0, 3).join(' · ')`
- **expert 전용**: 4차원 미니 그리드 (산도·바디·타닌·단맛, 각 8px UPPERCASE 라벨 + Playfair 11px wsetShort value)
  - `wsetShort()` 매핑: `low=낮음/Low`, `mediumMinus=중−/Med−`, `medium=중/Med`, `mediumPlus=중+/Med+`, `high=높음/High`

**액션 버튼 row** (gap 8):
- `노트 보기 / View Note` (flex 1.4, 골드 border + text) → `<Link href={`/notes/${note.id}`}>`
- `편집 / Edit` (flex 1, deep bg + secondary text) → `router.push(`/notes/new/write?from=newEntry&wineId=${wine.id}&edit=1`)`
- `와인 상세 / Wine Details` (flex 1, deep bg) → `<Link href={`/wine/${wine.id}`}>`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| 탭 세그먼트 | 클릭 | `setTab(key)` |
| + 추가 버튼 (셀러 탭) | 클릭 | placeholder toast |
| 검색 입력 | 타이핑 | `setQuery(value)` |
| 검색 X 버튼 | 클릭 | `setQuery('')` |
| 타입 필터 칩 | 클릭 | `setTypeFilter(tf)` |
| 정렬 칩 | 클릭 | `setSort(key)` |
| 결과 카운트 옆 "필터 초기화" | 클릭 | `setQuery(''); setTypeFilter('all')` |
| CellarCard | 클릭 | `/cellar/[id]` |
| TastedWineRow "노트 보기" | 클릭 | `/notes/[noteId]` |
| TastedWineRow "편집" | 클릭 | `/notes/new/write?from=newEntry&wineId={id}&edit=1` |
| TastedWineRow "와인 상세" | 클릭 | `/wine/[id]` |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `tab` | useState | `'cellar'` |
| `sort` | useState | `'recent'` |
| `typeFilter` | useState | `'all'` |
| `query` | useState | `''` |
| `rawItems` | useMemo | `getCellarByUser(user.id) + getWine` join |
| `typeFilteredItems` | useMemo | type filter 적용 |
| `searchedItems` | useMemo | 7개 필드 lowercase haystack 검색 |
| `items` | useMemo | sort 적용 |
| `tastedItems` | useMemo | 노트 dedup |
| `hasAnyItems` | derived | `rawItems.length > 0` |
| `isFiltered` | derived | query OR typeFilter≠'all' |

**검색 필드 (셀러 탭, 7개)**: `wine.name`, `producer.ko/en`, `region.ko/en`, `country.ko/en`, `appellation.ko/en`, `grapes[*].ko/en`, `vintage`

**검색 필드 (마신 와인 탭, 5개)**: `wine.name`, `producer.ko/en`, `region.ko/en`, `vintage`

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getCellarByUser(user.id)` | rawItems (heavy: 55건 / first-time: 0건) |
| `getWine(wineId)` | join + 셀러 카드 / row |
| `getTastingNotesByUser(user.id)` | 마신 와인 탭 (heavy: 65 노트 → dedup 50 wineId) |
| `getDrinkWindow(wine)` | `drinkSoon` 정렬 + CellarCard 배지 |
| `getDrinkWindowStatus(wine)` | (CellarCard 내부) |

---

## i18n 키 prefix

- `cellar.title`, `cellar.addCta`, `cellar.addToast`
- `cellar.searchPlaceholder`, `cellar.clearSearch`
- `cellar.filterType.{all,red,white,sparkling,rosé,fortified,dessert}`
- `cellar.sort.{recent,drinkSoon,vintage,region,storage,price}`
- `cellar.resultCount.{total,filtered}`
- `cellar.clearFilters`
- `cellar.noResults.{title,body}`
- `cellar.communityReviews`, `cellar.viewWineDetails` (상세 페이지에서 공유)
- `cellar.meta.*`, `cellar.notify.*`, `cellar.drinkWindow.*` (상세 페이지 공유)

`마신 와인` 탭은 inline locale 분기 (`locale === 'ko' ? ... : ...`)가 일부 사용됨 — placeholder, "${N}병 시음 기록", 빈 상태, 액션 버튼 라벨, 모드 뱃지, WSET 차원명.

---

## Feature flag 등록 (6개)

```ts
useRegisterFeatures('/cellar', [
  { id: 'cellar.titleBar' },
  { id: 'cellar.search' },
  { id: 'cellar.typeFilter' },
  { id: 'cellar.sortChips' },
  { id: 'cellar.resultCount', defaultStatus: 'considering' },
  { id: 'cellar.grid' },
])
```

---

## 빈/오류 상태

- **셀러 탭 raw 0건**: `<CellarEmptyState>` (와인 SVG + CTA)
- **셀러 탭 필터 결과 0건**: `<NoResults>` dashed card + 초기화 버튼
- **마신 와인 탭 필터 결과 0건**: 인라인 텍스트 "검색 결과가 없어요 / No results found"
- **마신 와인 탭 raw 0건**: 결과 0 메시지만 (별도 EmptyState 없음 — first-time이라면 셀러 탭이 활성)

---

## 디자인 토큰 / 스타일

- 탭 활성: `var(--color-wine-red)`
- 칩 활성: 골드 보더 + `rgba(201,168,76,0.12)`
- WMGlassRating: 9px size (작은)
- 와인 타입 색 도트: 6종 컬러 매핑 (red/white/sparkling/rosé/fortified/dessert)
