# 홈 (`/`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/` |
| 파일 | `src/app/page.tsx` (344 라인) |
| 헤더 | `<AppHeader hasUnreadNotification levelId={heavy ? user.levelId : null} avatarInitial={user.avatarInitial} />` |
| BottomNav | 표시 (홈 탭 활성) |
| 진입 가드 | `useEffect`: `demoMode === 'first-time' && localStorage.winemine.onboardingComplete !== 'true'` → `router.replace('/onboarding')` |
| Feature flag 키 | `/` (heavy: 8개 / first-time: 4개 등록) |

---

## 진입 경로

- BottomNav 홈 탭 (모든 페이지에서 도달 가능)
- 온보딩 마지막 스텝 "시작하기" → `router.push('/')`
- LevelChip 클릭 → 헤더의 LevelChip은 `/profile`로 이동하므로 홈에는 안 옴
- 알림 클릭 중 일부 (`favoritePurchase` 등) → 와인 상세로 이동, 홈은 직접 X

---

## 페이지 구성 (heavy 모드, 위→아래)

heavy 모드는 `demoMode === 'heavy'`일 때 노출. 8개 섹션이 순서대로 스택된다.

### 1. PeakGreeting — 정점 인사말 (페이드 로테이션)

- 위치: 컴포넌트 인라인 정의 (`page.tsx:148-224`)
- 외부 wrapper `padding: 18px 20px 0`
- **eyebrow**: 10px Inter, 골드 `#C9A84C`, letter-spacing `0.18em`, UPPERCASE, weight 500, key `home.peakGreeting.eyebrow`
- **본문**: Playfair 22px, 크림, line-height 1.25, min-height 56px
- **로테이션**: `useEffect`에서 `setInterval(PEAK_ROTATE_MS = 5000ms)`로 idx 증가. cycleLength = `Math.max(PEAK_QUESTION_COUNT=4, wines.length)`
- **questionKey**: `home.peakGreeting.questions.{0..3}` 4개 메시지 순환
- **wine prop**: 최근 시음 와인 4종의 appellation을 dedupe(`wineId` 기준) 후 locale별로 ko/en 추출 (`useMemo`)
- **wine 강조**: i18n `t.rich(questionKey, { name, wine: chunks => <span style="color:#C9A84C; fontStyle:italic">{wineName}{chunks}</span> })`
- **AnimatePresence**: `mode="wait"`, framer-motion spring (`initial: {opacity:0, y:6}`, `animate: {opacity:1, y:0}`, `exit: {opacity:0, y:-6}`, duration 0.45 easeOut)
- **fallback**: `wines.length === 0`이면 `home.peakGreeting.fallback`에 `{name}`만 보간

### 2. DraftNoteResume — 작성 중인 노트 이어쓰기 CTA

- `src/components/home/draft-note-resume.tsx`
- 조건부: localStorage `winemine.noteDraft`(JSON)가 있을 때만 노출
- "이어쓰기 / Continue draft" CTA → `/notes/new/write?from=draft&wineId={id}&templateId={id}`

### 3. StatHero — 3열 통계 카드

- `src/components/home/stat-hero.tsx`
- 카드: `Globe2` 방문 국가 / `Wine` 마신 와인 / `Pencil` 작성 노트
- 큰 숫자(Playfair) + 라벨(Inter)
- 값: `user.stats.countriesExplored`, `user.stats.winesTasted`, `user.stats.notesCount`

### 4. MapCameo — 와인 지도 미리보기

- 인라인 컴포넌트 (`page.tsx:227-275`)
- `<Link href="/map">` wrap, 14px 라운드, `var(--color-bg-map)` 배경, default border
- 헤더: Playfair 14px "당신의 와인 지도 / Your Wine Map" + 10px muted `${countries}개국 · ${regions}개 지역` + 우상단 골드 "전체 →"
- **MiniMapPreview SVG**: viewBox 320×100
  - 대륙 ellipse 6개 (fill `#2D1540`, opacity 0.8): 북미·남미·유럽·아프리카·아시아·호주
  - 14개 와인 산지 도트 — strong(`#8B1A2A`, 3.5r, opacity 0.9) 3개 / 일반(`#C9A84C`, 2.5r, opacity 0.7) 11개
  - 좌표는 하드코딩 — 프랑스·이탈리아·스페인·독일·오스트리아·미국·아르헨티나·칠레·호주·남아공·뉴질랜드·일본·포르투갈·헝가리

### 5. HomeCommunityPeek — 커뮤니티 dense row

- `src/components/home/home-community-peek.tsx`
- 팔로잉 최근 포스트 2건. 작성자 레벨 그라데이션 아바타 + 본문 한 줄
- 카드/행 클릭 → `/community`

### 6. RecentNotesStrip — 최근 노트 수평 스크롤

- `src/components/home/recent-notes-strip.tsx`
- `notes`(=`getTastingNotesByUser(user.id)`) prop
- 카드: WMBottle + 와인명 + WMGlassRating
- 카드 클릭 → `/notes/[noteId]`

### 7. WineFeed — 3탭 와인 피드

- `src/components/home/wine-feed.tsx`
- 탭 칩 (한·영): `featured`(Sparkles) / `trending`(Flame) / `explore`(Globe2)
- **Featured**: `getFeaturedWines()` — FEATURED_WINE_IDS 12종 큐레이션
- **Trending**: `wines.map(w => ({ w, count: getPurchasesByWine(w.id).length }))`.sort.slice(0,8)
- **Explore**: region.en 기준 dedupe sample 10
- 카드 클릭 → `/wine/[id]`

### 8. QuickActions — 빠른 액션 버튼

- `src/components/home/quick-actions.tsx`
- 노트 작성(→ `/notes/new`) / 셀러 추가(→ `/cellar`) / 즐겨찾기(→ `/favorites`) / 뱃지(→ `/badges`) / 설정(→ `/settings`)

---

## 페이지 구성 (first-time 모드)

heavy가 아닐 때 노출. **3섹션만**.

### 1. FirstTimeGreeting

- `src/components/home/first-time-greeting.tsx`
- `user.displayName` 포함 환영 문구

### 2. EmptyStatHero

- `src/components/home/empty-stat-hero.tsx`
- 0/0/0 빈 통계 + "첫 스캔으로 시작" 안내

### 3. SuggestedActions

- `src/components/home/suggested-actions.tsx`
- 첫 스캔(→ `/capture`) / 검색(→ `/cellar`) / 온보딩 재실행(→ localStorage 키 삭제 후 `/onboarding`)

### 4. WineFeed (동일)

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| AppHeader Bell | 클릭 | (정의 따라) `/notifications` 또는 placeholder |
| AppHeader LevelChip (heavy) | 클릭 | `/profile` |
| MapCameo 전체 | 클릭 | `/map` |
| MapCameo 우상단 "전체 →" | 클릭 | `/map` (Link wrap) |
| DraftNoteResume CTA | 클릭 | `/notes/new/write?from=draft...` |
| RecentNotesStrip 카드 | 클릭 | `/notes/[noteId]` |
| WineFeed 카드 | 클릭 | `/wine/[id]` |
| WineFeed 탭 칩 | 클릭 | tab state 변경 (페이지 내 fetch 없음) |
| QuickActions 버튼 5종 | 각각 | 해당 라우트 push |
| HomeCommunityPeek 카드 | 클릭 | `/community` |

---

## 상태 관리

| 상태 | 종류 | 출처 |
|---|---|---|
| `user` | mock | `useMockUser()` — `me-heavy` 또는 `me-first-time` |
| `demoMode` | URL `?demo=` + localStorage | `useAppMode()` |
| `notes` | mock 계산 | `getTastingNotesByUser(user.id)` |
| `unread` | mock 계산 | `getUnreadCount(user.id)` |
| `locale` | URL `?locale=` + localStorage | `useLocale()` |
| `recentWineLabels` | `useMemo` | notes 중 최근 4개의 appellation locale별 추출 |
| `idx` (PeakGreeting) | `useState` 0 | setInterval 5초 |

**localStorage 키 읽기**: `winemine.onboardingComplete`

**Provider 의존**: NextIntl / Locale / Theme / AppMode / Experience / Favorites / UserData / TastingTemplate / FeatureFlag

---

## 모드 분기 정리

| 모드 | PeakGreeting | DraftNoteResume | StatHero | MapCameo | HomeCommunityPeek | RecentNotes | WineFeed | QuickActions | FirstTimeGreeting | EmptyStat | SuggestedActions |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **heavy** | O | O (조건부) | O | O | O | O | O | O | X | X | X |
| **first-time** | X | X | X | X | X | X | O | X | O | O | O |

`beginner` vs `expert`는 홈 자체에 분기 없음 (피드/카드 안에서도 분기 없음 — 노트 작성에서만 분기). `ko` vs `en`은 모든 텍스트가 locale별 분기됨.

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getTastingNotesByUser` | `useMemo` 두 곳에서 호출 (recentWineLabels, RecentNotesStrip prop) |
| `getWine` | recentWineLabels — `appellation.{ko,en}` 추출 |
| `getUnreadCount` | AppHeader unread 도트 |
| `getFeaturedWines`, `getPurchasesByWine` | WineFeed (간접) |

---

## i18n 키 prefix

- `home.peakGreeting.eyebrow`
- `home.peakGreeting.questions.0` ~ `.3`
- `home.peakGreeting.fallback`
- (기타 컴포넌트는 자기 prefix 사용: `home.statHero.*`, `home.firstTimeGreeting.*`, `home.suggestedActions.*`, `home.draftNoteResume.*`, `home.wineFeed.*`, `home.communityPeek.*`, `home.recentNotes.*`, `home.quickActions.*`)

영어 모드에서 와인명·생산자·아펠라시옹은 `wine.{producer,appellation,region}.en` 사용. **한글이 한 글자도 노출되지 않도록 `useLocalizedText` 또는 `LocaleText` 사용**.

---

## Feature flag 등록

`useRegisterFeatures('/', defs)` — heavy/first-time별 다른 defs.

**heavy 8개**:
- `home.peakGreeting` / `home.draftResume` / `home.statHero` / `home.mapCameo` / `home.communityPeek` / `home.recentNotesStrip` / `home.wineFeed` / `home.quickActions`

**first-time 4개**:
- `home.firstTimeGreeting` / `home.emptyStatHero` / `home.suggestedActions` / `home.wineFeed`

각 섹션 wrapper에 `data-feature-id` 부여되어 FeatureFlagPanel(`≥1280px` 데스크톱 우측)에서 `dropped` 토글 시 opacity 0.25 + grayscale.

---

## 빈/오류 상태

- **first-time**: 위 first-time 모드 섹션이 정상 분기. 별도 빈 상태 처리 없음
- **heavy인데 노트 0건**: PeakGreeting이 `fallback` 메시지로 대체. RecentNotesStrip은 props로 빈 배열 받아 컴포넌트 내부에서 처리
- **localStorage 비활성**: 가드 useEffect의 `typeof window === 'undefined'` 체크로 SSR 안전

---

## 디자인 토큰 / 스타일

- 페이지 배경: 부모(layout) `.wm-page-bg` 그라데이션
- 골드 강조 색 inline 하드코딩 `#C9A84C` (다크 기준 — 라이트 모드 토큰 `--color-gold`로 통일 필요한 경우 있음)
- 와인레드 inline `#2D1540` (MiniMapPreview 대륙)
