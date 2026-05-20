# 셀러 아이템 상세 (`/cellar/[id]`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/cellar/[id]` (예: `/cellar/cellar-bdx-margaux-2010`) |
| 파일 | `src/app/cellar/[id]/page.tsx` (447 라인) |
| 헤더 | `<BackHeader title={wine.name} />` |
| BottomNav | 표시 |
| 진입 가드 | 없음 — `item` 또는 `wine` 못 찾으면 "셀러 항목을 찾을 수 없어요" 빈 페이지 |
| Feature flag 키 | `/cellar/[id]` — 6개 |

---

## 진입 경로

- `/cellar` CellarCard 클릭
- 알림 `drinkWindowReached + cellarItemId` 클릭

---

## 페이지 구성 (위→아래 6섹션)

`<main>` flex column gap 16, padding-bottom 96 (하단 고정 CTA 영역 확보).

### 1. Wine Hero (height 240, padding `0 16px 8px`)

`data-feature-id="cellarDetail.wineHero"`

- 240px 컨테이너 rounded 18, default border
- 배경: `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 70%)`
- 중앙 `<WineLabelArt initial={wine.name.charAt(0)} bottleColor width={100} height={150} rounded={8} />` (SVG 라벨 placeholder)
- 그 아래:
  - `<h1>` Playfair 24px cream — `wine.name`
  - Inter 13px secondary — `<LocaleText value={wine.producer} /> · {vintage}`
  - Inter 12px muted — `<LocaleText value={wine.region} /> · <LocaleText value={wine.country} />`

### 2. Drink Window Card (margin `0 16px`, padding 16, Surface rounded 16)

`data-feature-id="cellarDetail.drinkWindowCard"`

- 상단 row (justify space-between, margin-bottom 12):
  - `<DrinkWindowBadge status={status} fromYear={dw.from} />` (peakSoon/inPeak/tooEarly/pastPeak — `getDrinkWindowStatus()` 결과)
  - 우측 Inter 11px muted: `tDw('fromTo', { from, to })` ("2024–2032")
- `<DrinkWindowTimeline from={dw.from} peak={dw.peak} to={dw.to} now={currentYear} />`:
  - height 28 컨테이너
  - 배경 bar (4px height): `linear-gradient(90deg, gray30% → gold45% → wineRed50% → gold55% → gray30%)` — gold→wineRed→gold가 peak 중심
  - peak 세로 마커 (2×16, 와인레드)
  - 현재 위치 점 (12×12 원, cream + 2px deepest 보더, gold pulse)
  - 양끝 라벨 `from` / `to` (Inter 10px muted)
- 하단 본문 (margin-top 12, Inter 12 secondary):
  - `tDw('tip', { year: dw.peak })` ("피크: 2028년")
  - `yearsToPeak > 0`일 때 골드 `· tDw('peakInYears', { n })` ("· 피크까지 4년 / Peak in 4y")

### 3. Notify Toggle (margin `0 16px`, padding `14px 16`, Surface rounded 14, justify space-between)

`data-feature-id="cellarDetail.notifyToggle"`

- 좌측 라벨: Inter 13 cream weight 500 — `tNotify('label')` ("피크 도달 시 알림 / Notify when drink window starts")
- 우측 토글 (44×26, role="switch"):
  - ON: bg gold
  - OFF: bg border-default
  - 노브: 20×20 cream, top 3, left `3 ↔ 21` (200ms transition)
- 클릭 시 `setNotify(!notify)` + 토스트:
  - ON → `tNotify('toggledOn')` ("알림이 켜졌어요 / Notification turned on")
  - OFF → `tNotify('toggledOff')` ("알림이 꺼졌어요 / Notification turned off")

> 시안 단계 — 토글 상태는 useState만, localStorage 비저장.

### 4. Meta Grid 2×2 (margin `0 16px`, gap 10)

`data-feature-id="cellarDetail.metaGrid"`

`<MetaCard label value localizedValue?>` × 4 (Surface, border, rounded 12, minHeight 64, padding `12px 14`):

| 라벨 | 값 |
|---|---|
| `tMeta('storage')` ("보관 / Storage") | `tMeta('storage${capitalize(item.storage)}')` — `storageCellar` / `storageFridge` / `storageRoom` / `storageOffsite` |
| `tMeta('acquiredAt')` ("취득일 / Acquired") | `item.acquiredAt.slice(0, 10)` (YYYY-MM-DD) |
| `tMeta('price')` ("구매 가격 / Price") | `item.purchasePriceKrw` 있으면 `₩{N.toLocaleString()}`, 없으면 `—` |
| `tMeta('memo')` ("메모 / Memo") | `item.notes`가 LocalizedString이면 `<LocaleText>`, 없으면 `tMeta('memoEmpty')` ("메모 없음 / No memo") |

### 5. Community Reviews (reviews.length > 0일 때만)

`data-feature-id="cellarDetail.reviews"`

- `<h2>` Inter 14 weight 600 — `t('communityReviews')` ("커뮤니티 리뷰 / Community reviews")
- `<ReviewCard review={r} />` × 최대 3건 (`getReviewsByWine(wine.id).slice(0, 3)`)
  - 작성자 레벨 칩 + 별점 + 메모
- 하단 `<Link href={`/wine/${wine.id}`}>` 골드 `t('viewWineDetails') →` ("와인 상세 보기 →")

### 6. DrinkThis Bottom Fixed CTA

`data-feature-id="cellarDetail.drinkThis"`

- `position: absolute; bottom: 0; left/right: 0`, padding `12px 16px 18px`, zIndex 10
- 배경 그라데이션 fade `linear-gradient(180deg, rgba(5,2,10,0) 0%, rgba(5,2,10,0.95) 60%)`
- `<DrinkThisButton cellarItemId={item.id} />`:
  - "마시기 / Drink this" 90px 높이 와인레드 버튼
  - 클릭 시:
    1. localStorage `winemine.noteDraft`에 draft 시작 (wineId, source='cellar', startedAt)
    2. `router.push('/notes/new/write?wineId=${id}&fromCellar=${id}')`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| Notify Toggle | 클릭 | `setNotify(!notify)` + 토스트 |
| ReviewCard | 탭 | (현재) action 없음 |
| "와인 상세 보기 →" | 클릭 | `/wine/{wineId}` |
| DrinkThisButton | 클릭 | draft 시작 + `/notes/new/write` |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `item` | mock | `getCellarItem(params.id)` |
| `wine` | mock | `item ? getWine(item.wineId) : null` |
| `notify` | useState | `item?.notifyAtPeak ?? false` (영속화 안 됨) |
| `reviews` | useMemo | `getReviewsByWine(wine.id).slice(0, 3)` |
| `dw` | useMemo | `getDrinkWindow(wine)` → `{from, peak, to}` |
| `status` | derived | `getDrinkWindowStatus(wine)` |
| `currentYear` | derived | `new Date().getFullYear()` |
| `yearsToPeak` | derived | `dw.peak - currentYear` |

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getCellarItem(id)` | item lookup |
| `getWine(wineId)` | wine 정보 |
| `getReviewsByWine(wineId)` | 커뮤니티 리뷰 |
| `getDrinkWindow(wine)` | from/peak/to 산출 |
| `getDrinkWindowStatus(wine)` | peakSoon/inPeak/tooEarly/pastPeak |

---

## i18n 키 prefix

- `cellar.title`, `cellar.communityReviews`, `cellar.viewWineDetails`
- `cellar.meta.{storage,acquiredAt,price,memo,memoEmpty,storageCellar,storageFridge,storageRoom,storageOffsite}`
- `cellar.notify.{label,toggledOn,toggledOff}`
- `cellar.drinkWindow.{fromTo,tip,peakInYears}`

---

## Feature flag 등록 (6개)

```ts
useRegisterFeatures('/cellar/[id]', [
  { id: 'cellarDetail.wineHero' },
  { id: 'cellarDetail.drinkWindowCard' },
  { id: 'cellarDetail.notifyToggle' },
  { id: 'cellarDetail.metaGrid' },
  { id: 'cellarDetail.drinkThis' },
  { id: 'cellarDetail.reviews' },
])
```

---

## 빈/오류 상태

- **item 또는 wine null** (404 대신): BackHeader + "셀러 항목을 찾을 수 없어요 / Cellar item not found" muted text 24px padding
- **reviews.length === 0**: Community Reviews 섹션 자체가 안 렌더 (조건부 `{reviews.length > 0 && ...}`)
- **purchasePriceKrw null**: `—` 표시
- **item.notes null**: "메모 없음" 표시

---

## 디자인 토큰 / 스타일

- Hero 그라데이션: `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 70%)`
- Surface 카드 토큰: `var(--color-surface)` + `var(--color-border-default)` + rounded 12~16
- DrinkWindow timeline gradient: 5개 stop (gray→gold→wineRed→gold→gray)
- 현재 위치 점: cream + 2px deepest 보더 (펄스 애니메이션 X — 시안)
- 하단 fade: `linear-gradient(180deg, rgba(5,2,10,0) → rgba(5,2,10,0.95) 60%)`
