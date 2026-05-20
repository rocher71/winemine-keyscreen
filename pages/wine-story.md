# 와이너리 스토리 (`/wine/[id]/story`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/wine/[id]/story` |
| 파일 | `src/app/wine/[id]/story/page.tsx` (312 라인) + `story-history-body.tsx` |
| 헤더 | `<BackHeader title={{ko: '와이너리 이야기', en: 'Winery story'}} />` |
| BottomNav | 표시 |
| 진입 가드 | `getWine(id) == null` → `notFound()` / `getWineStory(id) == null`이면 "스토리 준비 중" 빈 페이지 |
| Feature flag 키 | 페이지 자체는 미등록 (정적 컨텐츠) |
| 렌더 | **Server Component** (async page) |
| 베타 피드백 #3 | WineStoryCard + 풀 페이지 |

---

## 진입 경로

- `/wine/[id]` WineStoryCard "전체 보기 →"
- 와인 상세 일부에서 인라인 링크

---

## 페이지 구성 (story 있을 때)

`<main>` flex column gap 20, padding-bottom 96.

### 1. Hero (padding `0 16px`)

- `<StoryImage bottleColor={wine.bottleColor} height={220} />` — 와이너리 헤로 이미지 placeholder (gradient SVG 또는 정적 이미지)
- 그 아래:
  - `<h1>` Playfair 28px weight 700 cream line-height 1.15 letter-spacing -0.01em — `<LocaleText value={story.wineryName} />`
  - Inter 13px secondary — `설립 ${story.foundedYear} · ${story.location[locale]}` / `Founded ${year} · ${location}`

### 2. History 본문

- `<StoryHistoryBody body={story.history} />` (`src/app/wine/[id]/story/story-history-body.tsx`)
- 3~4문단 LocalizedString
- **인라인 `<GlossaryTooltip>`**: 최소 5곳 (terroir, appellation, brett, decanting, tannin-texture 등)
- `(i)` 버튼 클릭 → 용어 BottomSheet 노출

### 3. FunFact 카드

- Gold 보더 + `<Lightbulb size={14} color="gold">` 아이콘
- 한 줄 사실 (LocalizedString) — "여기서 와인을 마신 유명 인사 / Famous person who drank here" 등

### 4. Philosophy 단락 (story.philosophy 있을 때만 — 조건부)

- LocalizedString 본문

### 5. 메타 그리드 2×2

| 라벨 | 값 |
|---|---|
| 설립 연도 / Founded | `story.foundedYear` |
| 포도밭 면적 / Vineyard area | `${story.vineyardHa}ha` |
| 주요 품종 / Main grapes | `wine.grapes.slice(0, 2).map(g => g[locale]).join(', ')` (인라인 grapeSummary/grapeSummaryEn) |
| 연 생산량 / Annual production | `${story.annualBottles.toLocaleString()}병` |

### 6. Back to wine CTA (하단)

- `<Link href={`/wine/${wine.id}`}>` "이 와인 다시 보기 / Back to this wine" + `<ArrowLeft size={14}>`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| `<GlossaryTooltip>` (i) | 클릭 | 용어 BottomSheet (12 entries 풀에서 lookup) |
| "이 와인 다시 보기 →" | 클릭 | `/wine/[id]` |

---

## 상태 관리

Server Component — 모든 데이터 서버에서 한 번에 로드. `story === null`이면 빈 페이지 분기.

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getWine(id)` | wine lookup (없으면 `notFound()`) |
| `getWineStory(wineId)` | 스토리 본문 (옵셔널) |
| GlossaryTooltip → `glossary.ts` | 인라인 용어 정의 lookup |

### Story 타입 shape (예상)

```ts
{
  wineryName: LocalizedString,
  foundedYear: number,
  location: LocalizedString,
  history: LocalizedString,         // 3~4문단
  funFact: LocalizedString,
  philosophy?: LocalizedString,
  vineyardHa: number,
  annualBottles: number,
}
```

---

## i18n 키 prefix

- 페이지 직접 인라인 LocalizedString 사용 — BackHeader title, "설립", 빈 상태
- `<StoryHistoryBody>` 본문은 mock `story.history` LocalizedString 직접 사용
- 메타 그리드 라벨은 인라인 `{ko, en}`

---

## 빈/오류 상태

- **wine === null**: `notFound()` (Next.js 404)
- **story === null**: BackHeader + 중앙 muted text "이 와인의 스토리는 준비 중 / Story coming soon"

---

## 디자인 토큰 / 스타일

- StoryImage height 220
- Hero 타이틀 Playfair 28 (가장 큰 본문)
- FunFact: gold 보더 + Lightbulb 아이콘
- GlossaryTooltip: 본문 인라인 (i) 버튼 — 클릭 BottomSheet
