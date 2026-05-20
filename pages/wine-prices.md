# 가격 상세 (`/wine/[id]/prices`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/wine/[id]/prices` |
| 파일 | `src/app/wine/[id]/prices/page.tsx` (49 라인) + `add-my-price-cta.tsx` (collocated) |
| 헤더 | `<BackHeader title={{ko: '가격 상세', en: 'Price details'}} />` |
| BottomNav | 표시 |
| 진입 가드 | `getWine(id) == null` → `notFound()` |
| Feature flag 키 | 페이지 자체는 미등록 |
| 렌더 | **Server Component** (async page) |

---

## 진입 경로

- `/wine/[id]` PriceChart compact "가격 추이 상세보기 →"
- 알림 `favoritePurchase` 클릭 → wine 상세 → prices

---

## 페이지 구성 (위→아래)

`<main>` flex column gap 16, padding-bottom 96.

### 1. PriceChart (full variant)

`src/components/wine-detail/price-chart.tsx` (내부: `<PriceChartInner>`, dynamic import SSR off)

- `<PriceChart wineId purchases variant="full" />`
- **Recharts LineChart**:
  - 전체 기간 (`purchases`의 모든 날짜)
  - 320×200 정도 크기
  - X축: 월별 라벨
  - Y축: ₩ 단위
  - 데이터 포인트: 각 purchase의 `priceKrw` × `date`
  - 라인 컬러: 골드 + 와인레드 강조

### 2. PriceDetailTable

`src/components/wine-detail/price-detail-table.tsx`

매장별 그룹 리스트 — 14개 store에 분포 (`stores.ts`).

각 행:
- 매장명 (LocalizedString) · 지점명 (LocalizedString)
- 작성자 익명화 → `<LevelPill>` + `{LevelName} #{anonId}`
  - anonId: `anonIdFor(userId)` — `userId.slice(0,2).padEnd(4)` 같은 해시 (실제 닉네임 노출 X)
  - reviewerLevel 표시: L1~L5 LEVEL_COLORS 기반 그라데이션
- 가격: `₩{priceKrw.toLocaleString()}`
- 날짜: `YYYY-MM-DD` (또는 LocalizedDate)

### 3. AddMyPriceCta (하단 고정)

`src/app/wine/[id]/prices/add-my-price-cta.tsx` (collocated 클라이언트 컴포넌트)

- 하단 fixed CTA "내 구매 정보 등록 / Add my purchase info"
- 클릭 시 BottomSheet 오픈:
  - **매장 입력** (select 또는 typed)
  - **가격 입력** (₩)
  - **날짜 picker**
- 제출 시 → `+5 XP` 토스트 (PlaceholderToast variant=xp) + 시트 닫힘
- 시안 — 실제 저장은 안 함

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| PriceDetailTable 행 | 탭 | (현재) action 없음 (향후 store 상세) |
| AddMyPriceCta 버튼 | 클릭 | BottomSheet 오픈 |
| BottomSheet 제출 | 클릭 | +5 XP 토스트 + 닫힘 |

---

## 상태 관리

Server Component (페이지) + Client Component (AddMyPriceCta):
- AddMyPriceCta 내부 useState로 sheet open + form fields 관리
- 영속화 안 됨 (시안)

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getWine(id)` | wine lookup |
| `getPurchasesByWine(id)` | 차트 + 테이블 데이터 (source: `cellarRegistration` / `tastingNote`) |
| `stores.ts` (간접) | 매장명 lookup |
| `users.ts` (간접) | reviewerLevel, anonId 해시 |

---

## i18n 키 prefix

- 페이지: BackHeader title 인라인 `{ko, en}`
- PriceChart / PriceDetailTable / AddMyPriceCta는 각자 `wineDetail.priceChart.*`, `wineDetail.prices.*` 등

---

## 빈/오류 상태

- **wine === null**: `notFound()`
- **purchases 0건**: PriceChart가 "데이터 없음" 표시 + PriceDetailTable이 빈 상태

---

## 디자인 토큰 / 스타일

- Recharts: SSR off (`dynamic(() => import(...), { ssr: false })`)
- 골드 강조 라인 + 그리드
- LevelPill: 5단계 색상 (브론즈→실버→골드→골드→와인레드)
- 익명화 패턴 `{LevelName} #{anonId}` (예: "감식가 #a1b2")
