# 와인 용어 사전 (`/glossary`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/glossary` |
| 파일 | `src/app/glossary/page.tsx` (193 라인) |
| 헤더 | `<BackHeader title={t('title')} />` ("용어 사전 / Glossary") |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/glossary` — `glossary.categoryChips`, `glossary.search`, `glossary.list` |
| 베타 피드백 #7 | 용어 사전 |

---

## 진입 경로

- 설정 또는 프로필 (정의 따라)
- `<GlossaryTooltip>` (i) 버튼 → BottomSheet 상세 → "용어 사전 전체 보기" 링크 (있다면)

---

## 페이지 구성

### 1. Category Filter Chips (수평 스크롤)

`data-feature-id="glossary.categoryChips"` (gap 8, padding `8px 16px 12px`)

`Cat = 'all' | GlossaryCategory`

5종 카테고리 + all = 6칩:

| Key | 아이콘 | 색 |
|---|---|---|
| `all` | (없음) | — |
| `sensory` | `<Sparkles>` 16px | gold |
| `fault` | `<AlertTriangle>` 16px | error |
| `classification` | `<Award>` 16px | gold |
| `technique` | `<Beaker>` 16px | cream |
| `unit` | `<Ruler>` 16px | secondary |

칩 활성: 와인레드 bg + cream / 비활성: transparent + default border + secondary. 라벨 `tCats(k)`.

### 2. 검색 입력

`data-feature-id="glossary.search"`

`<SearchInput placeholder={t('searchPlaceholder')} value={q} onChange={setQ} />`

검색 필드 (4): `g.term.ko`, `g.term.en`, `g.definition.ko`, `g.definition.en` — lowercase haystack contains.

### 3. 용어 리스트 (`<ul>`)

`data-feature-id="glossary.list"`

`filtered = GLOSSARY.filter(...).sort(by term.en localeCompare)` — 알파벳 영문명 기준 정렬.

각 행 `<Link href={`/glossary/${g.id}`}>` (padding `14px 20`, border-bottom default, minHeight 72):
- 좌측 28×28 원형 (rounded 14, `rgba(201,168,76,0.08)` bg) + 카테고리 아이콘
- 한글명 (Inter weight 600) + 영문명 (Inter muted) 병기
- 1줄 정의 미리보기 (LocalizedString)

### 4. 결과 0건

`filtered.length === 0`일 때:
- padding 32, 중앙, muted text 13px — `t('noResults')` ("결과가 없어요 / No results")

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| Category Chip | 클릭 | `setCat(k)` |
| 검색 input | 타이핑 | `setQ(value)` |
| 용어 행 | 클릭 | `/glossary/{g.id}` |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `cat` | useState | `'all'` |
| `q` | useState | `''` |
| `filtered` | useMemo | category + lowercase search 필터 + sort |

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `GLOSSARY` (`src/lib/mock/glossary.ts`) | 12 entry |

### 12 entry (term ID, 카테고리)

| ID | 카테고리 |
|---|---|
| `caudalie` | sensory |
| `residual-sugar` | sensory |
| `appellation` | classification |
| `wset` | classification |
| `brett` | fault |
| `bouchonne` | fault (코르키 / TCA) |
| `tdn` | sensory |
| `rotundone` | sensory |
| `decanting` | technique |
| `terroir` | classification |
| `tannin-texture` | sensory |
| `dosage` | technique |

---

## i18n 키 prefix

- `glossary.{title, searchPlaceholder, noResults}`
- `glossary.categories.{all, sensory, fault, classification, technique, unit}`

---

## Feature flag 등록 (3개)

```ts
useRegisterFeatures('/glossary', [
  { id: 'glossary.categoryChips' },
  { id: 'glossary.search' },
  { id: 'glossary.list' },
])
```

---

## 빈/오류 상태

- **검색 결과 0건**: 중앙 muted text
- **카테고리 결과 0건**: 동일

---

## 디자인 토큰 / 스타일

- 카테고리 아이콘: 28×28 원형 + 골드 8% bg
- 칩 활성: 와인레드 bg
- 행: minHeight 72, border-bottom hairline
