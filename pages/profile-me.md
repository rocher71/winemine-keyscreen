# 내 프로필 (`/profile`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/profile` |
| 파일 | `src/app/profile/page.tsx` (86 라인) |
| 헤더 | `<AppHeader hasUnreadNotification avatarInitial levelId={user.levelId} />` |
| BottomNav | 표시 (활성 탭 없음 — `/profile`는 어느 4탭에도 속하지 않음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/profile` — `profile.hero`, `profile.statGrid`, `profile.quickLinks` |

---

## 진입 경로

- AppHeader LevelChip 클릭 (heavy 모드)
- AppHeader 아바타 영역 (혹은 BottomNav 우측, 디자인 따라)
- 홈 QuickActions / 프로필 QuickLinks 일부

---

## 페이지 구성 (위→아래)

`<div className="wm-scroll-area">` 안:

### 1. 페이지 타이틀

- `<h1 className="wm-page-title">` Playfair 24px, padding `8px 20px 12px`
- `t('title')` — "프로필 / Profile"

### 2. ProfileHero

`src/components/profile/profile-hero.tsx`

`data-feature-id="profile.hero"`

- 그라데이션 헤로 (LEVEL_COLORS 기반)
- 90px 레벨 그라데이션 아바타 (avatarInitial 텍스트)
- 닉네임 (Playfair 24px, `user.displayName`)
- 레벨 칩 (예: "L3 · 감식가 / Connoisseur")
- 가입일 ("YYYY.MM.DD 가입 / Joined")

### 3. StatGrid

`src/components/profile/stat-grid.tsx`

`data-feature-id="profile.statGrid"`

`<StatGrid stats={mergedStats} />` — 통계 그리드 (5열 또는 2행).

**mergedStats 계산** (`useMemo`):
```ts
const tastedWineIds = new Set(notes.map(n => n.wineId));
const countries = new Set();
const regions = new Set();
for (const id of tastedWineIds) {
  const w = getWine(id);
  countries.add(w.country.en);
  regions.add(`${w.country.en}/${w.region.en}`);
}
return {
  winesTasted: tastedWineIds.size,
  countriesExplored: countries.size,
  regionsExplored: regions.size,
  notesCount: notes.length,
  cellarCount: cellar.length,
};
```

- **마신 와인 수**
- **방문 국가**
- **탐험 지역**
- **노트 수**
- **셀러 병 수**

**머지 데이터 (`useMergedCellar`, `useMergedNotes`)**: mock 데이터 + localStorage 추가분 머지 → 사용자가 셀러/노트를 추가했으면 카운트가 즉시 올라감.

### 4. QuickLinks

`src/components/profile/quick-links.tsx`

`data-feature-id="profile.quickLinks"`

5개 카드 (각각 아이콘 + 라벨):

| 카드 | 아이콘 | 라우트 |
|---|---|---|
| 즐겨찾기 / Favorites | `<Heart>` | `/favorites` |
| 뱃지 / Badges | `<Award>` | `/badges` |
| 사진 / Photos | `<Image>` | `/photos` |
| 랭킹 / Ranking | `<Trophy>` | `/profile/ranking` |
| 지도 / Map | `<Globe>` | `/map` |

### 5. 하단 spacer (24px)

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| AppHeader Bell | 클릭 | `/notifications` (정의 따라) |
| ProfileHero 아바타 | 탭 | 향후 편집 / 현재 액션 없음 |
| StatGrid 카드 | 탭 | 일부 카드는 라우트 — 현재 정적 표시 |
| QuickLinks 5개 카드 | 클릭 | 각각 해당 라우트 push |

---

## 상태 관리

| 상태 | 종류 | 출처 |
|---|---|---|
| `user` | mock | `useMockUser()` |
| `initial` | hook | `useLocalizedText(user.avatarInitial)` |
| `unread` | mock | `getUnreadCount(user.id)` |
| `cellar` | merged | `useMergedCellar(user.id)` |
| `notes` | merged | `useMergedNotes(user.id)` |
| `mergedStats` | useMemo | 위 cellar + notes 기반 |

**localStorage 키 (간접)**: `winemine.userCellar`, `winemine.userNotes` (UserDataContext 관리)

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `useMergedCellar` | mock + localStorage 머지 |
| `useMergedNotes` | mock + localStorage 머지 |
| `getWine` | mergedStats 계산에서 wine info |
| `getUnreadCount` | AppHeader unread |

---

## i18n 키 prefix

- `profile.title`
- ProfileHero / StatGrid / QuickLinks 컴포넌트는 자기 prefix (`profile.hero.*`, `profile.stats.*`, `profile.quickLinks.*`)

---

## Feature flag 등록 (3개)

```ts
useRegisterFeatures('/profile', [
  { id: 'profile.hero' },
  { id: 'profile.statGrid' },
  { id: 'profile.quickLinks' },
])
```

---

## 빈/오류 상태

- **first-time 사용자** (notes 0건, cellar 0건): mergedStats 모두 0 → StatGrid가 0/0/0 표시
- **머지 후에도 모든 stat 0**: 컴포넌트 자체 빈 상태 처리

---

## 디자인 토큰 / 스타일

- ProfileHero: LEVEL_COLORS 그라데이션 (5단계)
- StatGrid: surface card per stat
- QuickLinks: 카드 그리드, lucide 아이콘
