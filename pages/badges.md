# 뱃지 진열장 (`/badges`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/badges` |
| 파일 | `src/app/badges/page.tsx` (272 라인) |
| 헤더 | `<BackHeader title={t('title')}>` + 우측 `{owned}/{total} 획득` 카운트 |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/badges` — `badges.tierChips`, `badges.grid` |

---

## 진입 경로

- `/profile` QuickLinks "뱃지"
- 홈 QuickActions "뱃지"
- 알림 `badgeEarned` 클릭 → `/badges`

---

## 페이지 구성

### 1. BackHeader 우측 카운트

`<span>` Inter 12 muted weight 600:
- `t('ownedOf', { owned: owned.size, total: BADGES.length })` ("12/24 획득 / 12 of 24 earned")

`owned = new Set(user.badges)` — user.badges 배열 → Set

### 2. Tier Filter Chips (수평 스크롤)

`data-feature-id="badges.tierChips"` (padding `8px 16px 14px`, gap 8):

5개 tier 칩 (`['all', 'bronze', 'silver', 'gold', 'platinum']`):
- 활성: 와인레드 bg + cream text
- 비활성: transparent + secondary text + default border
- padding `6px 12`, rounded 16, Inter 12 weight 600
- 라벨: `tTiers(k)` ("전체 / 브론즈 / 실버 / 골드 / 플래티넘")

### 3. Badge Grid 3열 (gap 12, padding `0 16px 24px`)

`data-feature-id="badges.grid"`

`filtered = tier === 'all' ? BADGES : BADGES.filter(b => b.tier === tier)`

각 BadgeCard:
- **보유 (`owned.has(b.id)`)**:
  - 풀 컬러 (tier별 색 — bronze `#A77044` / silver `#C8C8D0` / gold `#C9A84C` / platinum `linear-gradient(135deg, gold→cream)`)
  - 뱃지 아이콘 + 이름
- **미보유**:
  - 흐림 (grayscale + opacity 0.4)
  - 중앙 `<Lock>` 아이콘 오버레이

### 4. Badge Detail BottomSheet (selected !== null일 때)

뱃지 카드 클릭 → `setSelected(badge)`:
- 큰 아이콘
- 이름 (LocalizedString)
- 설명 (LocalizedString)
- 획득 조건 (LocalizedString)
- 획득일 (있을 때, `LocalizedDate`)
- 보유 시 골드 보더

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| Tier Chip | 클릭 | `setTier(k)` |
| Badge Card | 클릭 | `setSelected(badge)` → BottomSheet 오픈 |
| BottomSheet 외부 | 클릭/드래그 | `setSelected(null)` 닫힘 |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `tier` | useState | `'all'` |
| `selected` | useState | `null` |
| `owned` | derived | `new Set(user.badges)` |
| `filtered` | useMemo | tier 필터 적용 |

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `BADGES` (`src/lib/mock/badges.ts`) | 4 tier 24개 정도 |
| `user.badges` | 보유 ID 배열 |

### Badge 타입 (예상 shape)

```ts
{
  id: string,
  tier: 'bronze' | 'silver' | 'gold' | 'platinum',
  name: LocalizedString,
  description: LocalizedString,
  criterion: LocalizedString,
  earnedAt?: string,
}
```

---

## i18n 키 prefix

- `badges.{title, ownedOf}`
- `badges.tiers.{all, bronze, silver, gold, platinum}`

---

## Feature flag 등록 (2개)

```ts
useRegisterFeatures('/badges', [
  { id: 'badges.tierChips' },
  { id: 'badges.grid' },
])
```

---

## 빈/오류 상태

- **모든 뱃지 미보유**: 모든 카드 흐림 + Lock 오버레이
- **tier 필터 결과 0개**: 그리드 빈 영역 (별도 EmptyState 없음 — 발생 가능성 낮음)

---

## 디자인 토큰 / 스타일

- Tier 색 (`tierColor(tier)`):
  - bronze `#A77044`
  - silver `#C8C8D0`
  - gold `#C9A84C`
  - platinum `linear-gradient(135deg, #C9A84C 0%, #F5F0E8 100%)`
- 미보유: `filter: grayscale(1); opacity: 0.4`
- Lock 오버레이: 중앙 absolute
