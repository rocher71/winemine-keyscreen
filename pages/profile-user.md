# 타 유저 프로필 (`/profile/[userId]`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/profile/[userId]` |
| 파일 | `src/app/profile/[userId]/page.tsx` (380 라인) |
| 헤더 | `<BackHeader title={other.displayName}>` + 우측 "팔로우 / Follow" 버튼 |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | `resolveUser(userId) == null`이면 "사용자를 찾을 수 없어요" 빈 페이지 |
| Feature flag 키 | `/profile/[userId]` — 4개 |

---

## 진입 경로

- 커뮤니티 포스트 작성자 클릭
- `/community/discover` 유저 카드
- `/community/tonight` 유저 카드
- 노트 상세 작성자 영역 클릭

---

## 페이지 구성 (위→아래)

`<main>` flex column gap 14, padding-bottom 20.

### 1. BackHeader (other.displayName) + 우측 팔로우 버튼

- 우측 버튼 (padding `6px 12`, transparent + gold border, gold text, 12px weight 600):
  - `t('follow')` ("팔로우 / Follow")
  - 클릭 시 `toast({ message: t('followToast') })` PlaceholderToast ("팔로우 기능은 곧 지원돼요")

### 2. UserMapHero

`src/components/profile/user-map-hero.tsx`

`data-feature-id="otherProfile.userMapHero"`

- 해당 유저의 방문 국가만 빨갛게 채색된 미니맵
- 통계: 시음 와인 수 / 방문 국가 / 탐험 지역

### 3. TasteCompatibilityCard

`src/components/profile/taste-compatibility-card.tsx`

`data-feature-id="otherProfile.compat"`

- 나와의 취향 일치도 (`compatibility.ts`의 `getMatchPctVsMe(other.id)`)
- 점수 (0~100%, 큰 골드 숫자)
- 공유 와인 수 (`sharedStats.sharedWines`)
- 공유 지역 수 (`sharedStats.sharedRegions`)
- 공통 품종 칩

**sharedStats 계산**:
```ts
const myNotes = getProfileNotes(currentUserHeavy.id);
const otherNotes = getProfileNotes(other.id);
const myWineIds = new Set(myNotes.map(n => n.wineId));
const sharedWineIds = otherNotes.filter(n => myWineIds.has(n.wineId));
// region intersection 계산
return { sharedWines, sharedRegions };
```

### 4. 시음 와인 리스트 — 정렬 탭 + 그리드/리스트

`data-feature-id="otherProfile.wineList"`

**정렬 탭**:
- `recent` ("최근순")
- `rating` ("평점순")

**sortedWines 정렬**:
```ts
if (sort === 'rating') {
  sort by (expertFields.rating ?? beginnerFields.rating * 20) desc
} else {
  sort by new Date(tastedAt) desc
}
```

각 카드: 와인 헤로 (`wineHeroWines = sortedWines.map(x => x.wine)`) + 평점

### 5. 공개 노트 미리보기 (최근 4개)

`data-feature-id="otherProfile.publicNotes"`

- `publicNotes = sortedWines.slice(0, 4)`
- 각 카드 클릭 → `/notes/{note.id}`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| 팔로우 버튼 | 클릭 | PlaceholderToast |
| TasteCompatibilityCard | 탭 | (현재) 정적 표시 |
| 정렬 탭 | 클릭 | `setSort('recent' | 'rating')` |
| 와인 카드 | 클릭 | `/wine/{wine.id}` |
| 공개 노트 카드 | 클릭 | `/notes/{note.id}` |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `params.userId` | URL | `useParams()` |
| `sort` | useState | `'recent'` |
| `other` | mock | `resolveUser(params.userId)` |
| `sortedWines` | useMemo | sort 적용된 노트+와인 join |
| `sharedStats` | useMemo | `currentUserHeavy` 기준 교집합 |
| `matchPct` | derived | `getMatchPctVsMe(other.id)` |

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `resolveUser(userId)` | other lookup |
| `getProfileNotes(userId)` | 노트 리스트 |
| `WINES_BY_ID` | 와인 lookup |
| `getMatchPctVsMe(userId)` | 취향 일치도 (`compatibility.ts`) |
| `currentUserHeavy` | "나" 기준 (sharedStats 계산용) |

---

## i18n 키 prefix

- `profile.other.{follow, followToast}`
- TasteCompatibilityCard / UserMapHero / 정렬 탭 등은 자기 prefix

---

## Feature flag 등록 (4개)

```ts
useRegisterFeatures('/profile/[userId]', [
  { id: 'otherProfile.userMapHero' },
  { id: 'otherProfile.compat' },
  { id: 'otherProfile.wineList' },
  { id: 'otherProfile.publicNotes' },
])
```

---

## 빈/오류 상태

- **other === null**: BackHeader + "사용자를 찾을 수 없어요 / User not found" muted text + BottomNav
- **other의 notes 0건**: 와인 리스트 빈 상태

---

## 디자인 토큰 / 스타일

- 일치도 % 큰 골드 숫자
- 공유 메타 칩
- 정렬 탭: 세그먼트 스타일
