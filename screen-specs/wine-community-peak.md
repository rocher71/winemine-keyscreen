# 커뮤니티 음용 적기 상세 (`/wine/[id]/community-peak`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/wine/[id]/community-peak` |
| 파일 | `src/app/wine/[id]/community-peak/page.tsx` (166 라인) + `contributors-list.tsx` + `add-my-estimate-cta.tsx` |
| 헤더 | `<BackHeader title={{ko: '커뮤니티 음용 적기', en: 'Community drinking window'}} />` |
| BottomNav | 표시 |
| 진입 가드 | `getWine(id) == null` → `notFound()` |
| Feature flag 키 | 페이지 자체는 미등록 |
| 렌더 | **Server Component** (async page) |
| 핵심 컴포넌트 | `PeakDistribution` (Recharts BarChart), `ContributorsList`, `AddMyEstimateCta` |

---

## 진입 경로

- `/wine/[id]` CommunityDrinkWindowCard "상세보기 →"

---

## 페이지 구성 (위→아래)

`<main>` flex column gap 20, padding-bottom 96.

### 1. Intro Card (padding `0 16px`, Surface 12 rounded, padding 14)

**본문 P** (Inter 13 secondary line-height 1.6):
- `다른 사용자들이 추정한 절정 시점입니다. 시스템 추정과 비교해 보세요. / Estimates from other users (L3+ only). Compare with system suggestion.`

**보조 P** (margin-top 6, Inter 12 golden):
- `L4/L5 사용자의 추정은 가중치 1.5~2배 적용됩니다 / L4/L5 estimates are weighted 1.5-2x`

> L3 이상만 추정을 남길 수 있고, L4/L5는 가중치 추가. `community-peaks.ts`에서 `reviewerLevel ∈ {3, 4, 5}` 강제.

### 2. Big Histogram (padding `0 16px`, Surface 16 rounded, padding 16)

**헤더 row** (justify space-between baseline, margin-bottom 12):
- 좌측 Playfair 22px weight 700 cream: `평균 ${Math.round(meanPeakYear)} · 중앙값 ${medianPeakYear} / Mean ${...} · Median ${...}`
- 우측 Inter 11px muted: `${count} ${ko: '명' | en: 'reviewers'}`

**히스토그램**:
- `aggregate.count === 0`이면 인라인 텍스트 — `아직 추정 데이터가 부족해요. 전문가 노트에서 입력해주세요 / Not enough data. Add an estimate in your expert note.`
- 아니면 `<PeakDistribution aggregate={aggregate} height={280} showLegend />`:
  - **Recharts BarChart**
  - X축: 년도 (peak year ±5 윈도우)
  - Y축: 추정 수
  - 마커 3종:
    - **시스템 추정** — 골드
    - **평균** — 크림
    - **중앙값** — 와인레드 점선
  - showLegend: 하단 범례

### 3. ContributorsList

`src/app/wine/[id]/community-peak/contributors-list.tsx`

- 익명화 추정자 리스트:
  - 각 행: `<LevelPill>` + `{LevelName} #{anonId}` (예: "감식가 #a1b2")
  - 추정 년도 + 신뢰도 메타 (low/medium/high)
  - 메모 (옵셔널 LocalizedString)
- `reviewerLevel ∈ {3, 4, 5}` 강제 — L1/L2 발생 불가

### 4. AddMyEstimateCta (하단 고정)

`src/app/wine/[id]/community-peak/add-my-estimate-cta.tsx`

- 하단 fixed
- "내 추정 추가 / Add my estimate" 버튼
- **L3+ 가드**:
  - 현재 사용자 레벨 < 3 → disabled + "L3에 도달하면 활성화 / Unlocks at Connoisseur (L3)" 텍스트
  - L3+ → enabled + 클릭 시 BottomSheet 폼 (절정 연도 input + 신뢰도 라디오 + 메모 textarea)
- 제출 시 → +5 XP 토스트 + 시트 닫힘

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| ContributorsList 행 | 탭 | (현재) action 없음 |
| AddMyEstimateCta (L1/L2) | 클릭 | disabled / 가드 메시지만 |
| AddMyEstimateCta (L3+) | 클릭 | BottomSheet 폼 |
| BottomSheet 제출 | 클릭 | +5 XP 토스트 + 닫힘 |

---

## 상태 관리

- **Server Component**: aggregate · estimates 서버 로드
- **AddMyEstimateCta** (Client): useState로 sheet open + form fields

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getWine(id)` | wine lookup |
| `getCommunityPeakAggregate(id)` | `{meanPeakYear, medianPeakYear, count, bins, systemSuggestion}` |
| `getCommunityPeaksByWine(id)` | 개별 추정 리스트 (ContributorsList 입력) |

### aggregate 타입 shape (community-peak-aggregator.ts)

```ts
{
  meanPeakYear: number,
  medianPeakYear: number,
  count: number,
  bins: Array<{year: number, count: number, weightedCount: number}>,
  systemSuggestion: number,    // wine.drinkWindow.peak 또는 산정값
}
```

---

## 모드 분기

- 현재 사용자 레벨 < 3: AddMyEstimateCta disabled
- 현재 사용자 레벨 ≥ 3: AddMyEstimateCta enabled
- locale 분기: 모든 LocalizedString
- 다크/라이트: 토큰 기반

---

## i18n 키 prefix

- 페이지 직접 인라인 `{ko, en}` 사용 (intro, 헤더, 빈 상태)
- ContributorsList / AddMyEstimateCta는 자기 prefix

---

## 빈/오류 상태

- **wine === null**: `notFound()`
- **aggregate.count === 0**: histogram 자리에 안내 텍스트
- **estimates.length === 0**: ContributorsList 자체 빈 상태

---

## 디자인 토큰 / 스타일

- Surface 카드: `var(--color-surface)` + default border + rounded 16
- 골드 강조: 시스템 추정 마커 + L4/L5 가중치 안내 문구
- 크림: 평균 마커
- 와인레드 점선: 중앙값 마커
- Recharts: SSR off
