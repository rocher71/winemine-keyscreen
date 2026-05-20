# 즐겨찾기 (`/favorites`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/favorites` |
| 파일 | `src/app/favorites/page.tsx` (184 라인) |
| 헤더 | `<BackHeader title={t('title')} />` ("즐겨찾기 / Favorites") |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/favorites` — `favorites.list` |

---

## 진입 경로

- `/profile` QuickLinks "즐겨찾기"
- 홈 QuickActions "즐겨찾기"
- 와인 상세 FavoriteToggle 토글 후 즐겨찾기 진입 (간접)

---

## 페이지 구성

`<main className="wm-scroll-area" style={paddingTop: 8}>`

### 빈 상태 (items.length === 0)

`<EmptyState illustration={<Star size={56} strokeWidth={1.25}/>} title={t('empty')} description={t('emptySub')} />`
- "즐겨찾기 와인이 없어요 / No favorites yet"
- "와인 상세에서 ♡ 아이콘을 눌러 추가하세요 / Tap ♡ on a wine to add"

### 즐겨찾기 행 리스트

`data-feature-id="favorites.list"`

`items.map(fav => { wine = getWine(fav.wineId); ... })` — wine 없으면 skip.

각 행 (margin `8px 16px`, Surface + border, rounded 14, gap 12, padding 12):
- 좌측 `<Link href={`/wine/${wine.id}`}>` (flex 1, gap 12):
  - 44×60 와인 보틀 그라데이션 카드 — `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 70%)` + gold 18% border
  - 와인명 (Playfair)
  - 생산자 · 빈티지
  - 지역
- 우측 토글 "구매 시 알림 / Notify on purchase":
  - 작은 라벨 + 토글 스위치 (gold ON / border-default OFF)
  - 클릭 시 `toggle(fav.id, !current)`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| 와인 카드 (Link) | 클릭 | `/wine/{wine.id}` |
| 알림 토글 | 클릭 | `toggle(id, next)` → setState + 토스트 |

**`toggle(id, next)`**:
```ts
setItems(prev => prev.map(f => f.id === id ? {...f, notifyOnPurchase: next} : f));
toast({ message: next ? t('notifyOn') : t('notifyOff') });
```

> 시안 — 페이지 useState만 갱신, mock favorites.ts에는 영속화 안 됨. (실제 영속화는 FavoritesContext 통해 localStorage `winemine.favorites`)

---

## 상태 관리

| 상태 | 종류 | 출처 |
|---|---|---|
| `user` | mock | `useMockUser()` |
| `initial` | mock | `getFavoritesByUser(user.id)` |
| `items` | useState | initial로 초기화 |

**useEffect**: `user.id` 변경 시 `setItems(initial)` 리셋

**Context (간접)**: FavoritesContext — 와인 상세 FavoriteToggle에서 localStorage 갱신, 이 페이지는 mock initial 사용

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getFavoritesByUser(user.id)` | initial 리스트 (mock) |
| `getWine(wineId)` | 행 wine 정보 |

---

## i18n 키 prefix

- `favorites.{title, empty, emptySub, notifyOn, notifyOff}`

---

## Feature flag 등록 (1개)

```ts
useRegisterFeatures('/favorites', [
  { id: 'favorites.list' },
])
```

---

## 빈/오류 상태

- **items.length === 0**: `<EmptyState>` 노출
- **wine === null** (개별 행): 해당 행 skip (`if (!wine) return null`)

---

## 디자인 토큰 / 스타일

- 행 카드: Surface + default border + rounded 14
- 보틀 mini: 44×60 gradient
- 토글: gold ON / border-default OFF

---

## 즐겨찾기 → 구매 알림 end-to-end (FEATURES §6 참조)

```
1. /favorites에서 "구매 시 알림" 토글 ON
2. 다른 유저가 해당 와인 구매 (셀러 추가 또는 노트 가격 입력)
3. 임계치 도달 시 푸시 알림 발송
4. 알림 탭 → /wine/{id}
5. PriceChart → /wine/{id}/prices (PriceDetailTable)
```
