# 커뮤니티 (`/community`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/community` |
| 파일 | `src/app/community/page.tsx` (749 라인) |
| 헤더 | `<AppHeader hasUnreadNotification={false} />` |
| BottomNav | 표시 (커뮤니티 탭 활성) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/community` — 7개 (header/tabs/tonightBanner/feedCards/fab/typeFilter/trending) |

---

## 진입 경로

- BottomNav 커뮤니티 탭
- 홈 HomeCommunityPeek 카드

---

## 페이지 구성

`<div className="wm-scroll-area" style={paddingBottom: 20}>`

### 1. Title Row (padding `14px 20px 8px`)

- 좌측 eyebrow: 10px golden letter-spacing 0.18em UPPERCASE — `t('title')` ("커뮤니티")
- Playfair 22px cream 페이지 타이틀 (탭별 동적):
  - `following` → `t('pageTitle')` ("커뮤니티 / Community")
  - `all` → "모든 잔의 이야기 / All Stories"
  - `trending` → "가장 많이 든 잔들 / Most Toasted"
  - `notes` / `templates` → (정의 따라)
- 우측 36×36 `<Search size={18}>` 버튼 (시안 — onClick 미바인딩)

### 2. Tab Bar (5탭, 가로 스크롤, padding `6px 20px 0`, gap 22)

- `following` / `all` / `trending` / `notes` / `templates`
- bottom hairline `0.5px solid border-default`
- 활성 탭: golden underline / 비활성: 무지

### 3-A. Following 탭 (`tab === 'following'`)

#### Tonight Banner (Moon 아이콘)
- "오늘 밤 누가 마실까요? / Who's drinking tonight?" → `/community/tonight`

#### 팔로잉 피드 — `CommFeedCard` 리스트
- PostType 배지 (note/question/column/news/album)
- 작성자 아바타 (LEVEL_COLORS 그라데이션) + 닉네임 + LevelChip ("L{N}")
- 상대 시간 (`{N}분 전`)
- 본문 제목 (Playfair 16px)
- 본문 미리보기
- 연결된 와인 WineEmbedCard (있을 때)
- ReactionBar: 좋아요(Heart) / 잔(Glass) / 반짝(Sparkles) / 저장(Bookmark) — 각 카운트
- "mine" indicator: 자기 글에 표시

### 3-B. All 탭

- **타입 필터 칩** (`TYPE_FILTERS = ['all', 'note', 'question', 'column', 'news', 'album']`)
  - 라벨: 한글 / 영문 ("전체 / All", "시음 노트 / Tasting Notes", "질문 / Questions", "칼럼 / Columns", "소식 / News", "사진 / Albums")
- `CommFeedRow` 컴팩트 리스트 — 좌측 작은 아이콘 + 한 줄 제목 + 카운트

### 3-C. Trending 탭

- **키워드 hash 칩** — 부르고뉴 22빈티지·레 루지엥·디캔팅 시간 등 + 빈도
- 랭킹 카드 (1~4위) — `trendingPosts = [posts[2], posts[5], posts[0], posts[4]]`:
  - `<TrendingUp>` / `<Flame>` / `<ChevronUp>` 아이콘으로 순위
  - 1위 카드: 골드 보더 강조

### 3-D. Notes 탭

- 인기/최신 SortToggle (`noteSort` — popular / latest)
- `getSharedNotesSorted(sort)` 호출:
  - popular = 좋아요 합산 sort
  - latest = sharedAt desc
- 공유 시음 노트 카드:
  - 작성자 큰 레벨 그라데이션 아바타
  - 와인명 + 평점 큰 숫자 `/100`
  - 메모 본문 (Playfair italic)
  - 하단: ♥ / Bookmark / 날짜
- 카드 클릭 → `/notes/{sn-...}`

### 3-E. Templates 탭

- 인기/최신 SortToggle (`tplSort`)
- `getCommunityTemplatesSorted(sort)`:
  - popular = saveCount desc
  - latest = createdAt desc
- 양식 카드:
  - 제목 (Playfair 15px)
  - "by {작성자명}"
  - 필드수 / 저장수 (12px 메타)
  - **Bookmark 토글** (saveTemplate / unsaveTemplate)
    - 저장 시 토스트: "이제 이 양식으로도 노트를 쓸 수 있어요 / You can now write notes with this template"
    - 해제 시 토스트: "양식을 픽커에서 제거했어요 / Template removed from picker"

### 4. 우하단 PenLine FAB

- 모바일: `position: fixed; bottom: 80; right: 16` (BottomNav 위)
- 데스크톱: DeviceFrame 내 absolute
- 52×52 골드 그라데이션 (`linear-gradient(135deg, #C9A84C, #A07F2E)`) + 골드 보더
- `<PenLine size={24} stroke="cream">`
- 클릭 → `/community/new`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| 탭 (following/all/trending/notes/templates) | 클릭 | `setTab(id)` |
| Search 버튼 | 클릭 | (미바인딩 시안) |
| Tonight Banner | 클릭 | `/community/tonight` |
| CommFeedCard | 클릭 | `/community/{postId}` |
| 타입 필터 칩 | 클릭 | `setTypeFilter(tf)` |
| ReactionBar | 클릭 | useState (시안 — 영속 X) |
| Notes 정렬 토글 | 클릭 | `setNoteSort` |
| Notes 카드 | 클릭 | `/notes/{sn-id}` |
| Templates 정렬 토글 | 클릭 | `setTplSort` |
| Templates Bookmark | 클릭 | saveTemplate/unsaveTemplate + 토스트 |
| PenLine FAB | 클릭 | `/community/new` |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `tab` | useState | `'following'` |
| `typeFilter` | useState | `'all'` |
| `noteSort` | useState | `'popular'` |
| `tplSort` | useState | `'popular'` |
| `isSaved`, `saveTemplate`, `unsaveTemplate` | context | `useTastingTemplates()` |
| `posts` | mock | `getCommunityPosts()` |
| `filteredPosts` | derived | typeFilter 적용 |

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getCommunityPosts` | 포스트 풀 |
| `getCommunityUser` | 작성자 정보 |
| `getSharedNotesSorted(sort)` | Notes 탭 |
| `getCommunityTemplatesSorted(sort)` | Templates 탭 |
| `useTastingTemplates` | Bookmark 상태 |
| `getWine` | WineEmbedCard 데이터 |

---

## i18n 키 prefix

- `community.{title, pageTitle, tabs.{following, all, trending}, tonight, sort.{popular, latest}, ...}`
- 일부 인라인 locale 분기 (notes/templates 탭 라벨)

---

## Feature flag 등록 (7개)

```ts
useRegisterFeatures('/community', [
  { id: 'community.header' },
  { id: 'community.tabs' },
  { id: 'community.tonightBanner' },
  { id: 'community.feedCards' },
  { id: 'community.fab' },
  { id: 'community.typeFilter' },
  { id: 'community.trending' },
])
```

---

## 빈/오류 상태

- **first-time**: 팔로잉 0 → 빈 상태 텍스트
- **타입 필터 결과 0**: 컴팩트 안내

---

## 디자인 토큰 / 스타일

- PenLine FAB: 골드 그라데이션 + 골드 보더
- 1위 트렌딩 카드: 골드 보더 강조
- CommFeedCard: surface + border, 모든 카드 동일 스펙
