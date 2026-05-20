# 랭킹 상세 (`/profile/ranking`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/profile/ranking` |
| 파일 | `src/app/profile/ranking/page.tsx` (558 라인) |
| 헤더 | `<BackHeader title={{ko: '랭킹 상세', en: 'Ranking details'}} />` |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/profile/ranking` — `ranking.current`, `ranking.actions`, `ranking.tiers` |

> **혜택 정책은 시안 단계 임의 정의** — Phase 3에서 실제 정책과 동기화 필요.

---

## 진입 경로

- `/profile` QuickLinks "랭킹"
- AppHeader LevelChip (heavy 모드, 일부 흐름)
- 노트 상세 작성자 LevelPill 탭 (향후)

---

## 페이지 구성 (위→아래)

`<div className="wm-scroll-area">` padding-bottom 100.

### 1. CurrentLevelCard (margin `8px 16px 0`, padding 20, rounded 18)

`data-feature-id="ranking.current"`

- 배경 Surface + **레벨 색 1px border + 24px shadow 13%** (`box-shadow: 0 0 24px ${level.color}22`)
- 레벨 그라데이션 아바타 + 레벨명 (예: "감식가 / Connoisseur")
- 현재 XP — `user.xp`
- 다음 레벨까지 남은 XP — `currentLevel.remaining`
- 진척도 바 (`LevelProgressBar`, gold glow inner shadow)

`currentLevel = xpToLevel(user.xp)` → `{ levelId, progressPct, remaining }`

`nextLevel = LEVELS.find(l => l.id === levelId + 1)`

### 2. XP 적립 방법 섹션

`data-feature-id="ranking.actions"`

`<Section title={t('actions.heading')} subtitle={t('actions.subtitle')}>` 안에 ActionRow 리스트 (flex column gap 8):

**XP_ACTION_LIST** — XP_ACTIONS의 카드 표현, 10종:

| ID | XP | 아이콘 |
|---|---|---|
| `cellarAdd` | +5 | `<Award>` or Plus |
| `beginnerNote` | +10 | `<Pencil>` |
| `expertNote` | +20 | `<Pencil>` |
| `expertBlindNote` | +25 | `<EyeOff>` |
| `photoAttach` | +5 | `<Camera>` |
| `priceAdd` | +5 | `<Tag>` |
| `peakEstimate` | +5 | `<Calendar>` |
| `firstCountry` | +30 | `<Globe2>` |
| `firstRegion` | +15 | `<MapPin>` |
| `communityReview` | +15 | `<MessageSquare>` |

각 ActionRow: 아이콘 + 라벨 + 설명 + +XP 뱃지

### 3. 5단계 레벨 카탈로그

`data-feature-id="ranking.tiers"`

`<Section title={t('tiers.heading')} subtitle={t('tiers.subtitle')}>` 안에 LevelCard 리스트 (gap 10).

**LEVELS** (`src/lib/mock/levels.ts`):

| ID | 한글명 | 영문명 | XP 범위 | 색 | 핵심 메시지 |
|---|---|---|---|---|---|
| 1 | 입문자 | Novice | 0~99 | `#9B8B7A` 브론즈 | "한 모금이 호기심으로 바뀌는 단계" |
| 2 | 애호가 | Enthusiast | 100~499 | `#C9A84C` 골드-브론즈 | "취향이 생기기 시작" |
| 3 | 감식가 | Connoisseur | 500~1499 | `#C9A84C` 골드 | "아펠라시옹·빈티지 비교 시작" |
| 4 | 소믈리에 | Sommelier | 1500~3999 | `#8B1A2A` 와인레드 | "구조·균형·여운 언어 분해" |
| 5 | 마스터 | Master | 4000+ | `#A02030` 와인레드 그라데이션 | "한 잔에서 떼루아의 시간 흐름을 읽음" |

`BENEFITS_BY_LEVEL[level.id]` — 레벨별 혜택 리스트 (시안 임의 정의).

각 LevelCard:
- `isCurrent === true`이면 강조 보더/배경 (현재 레벨 표시)
- 레벨 색 도트 + 레벨명 + minXp~maxXp 표시
- 핵심 메시지 (한·영)
- 혜택 리스트 (체크 마크)

### 4. 푸터 안내

- padding 12, rounded 10, `rgba(74,61,86,0.18)` bg
- Inter 11px muted line-height 1.5
- `t('disclaimer')` ("혜택 정책은 시안 — 정식 출시 시 변경될 수 있어요 / Benefits policy is preview only")

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| ActionRow | 탭 | (현재) 정적 표시 |
| LevelCard | 탭 | (현재) 정적 표시 |

---

## 상태 관리

| 상태 | 종류 | 출처 |
|---|---|---|
| `user` | mock | `useMockUser()` |
| `currentLevel` | derived | `xpToLevel(user.xp)` |

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `LEVELS` | 5단계 레벨 카탈로그 |
| `XP_ACTIONS` | 적립 액션 10종 |
| `xpToLevel(xp)` | 현재 레벨 / 진척도 산출 |
| (인라인) `BENEFITS_BY_LEVEL` | 레벨별 혜택 (시안 임의) |
| (인라인) `XP_ACTION_LIST` | ActionRow 매핑용 |

---

## i18n 키 prefix

- `ranking.actions.{heading, subtitle, ...}`
- `ranking.tiers.{heading, subtitle, ...}`
- `ranking.disclaimer`
- LEVELS / XP_ACTIONS 라벨은 mock 객체 안 LocalizedString

---

## Feature flag 등록 (3개)

```ts
useRegisterFeatures('/profile/ranking', [
  { id: 'ranking.current' },
  { id: 'ranking.actions' },
  { id: 'ranking.tiers' },
])
```

---

## 빈/오류 상태

- **L5 사용자 (max)**: `nextLevel === undefined` — "마스터에 도달했어요" 표시

---

## 디자인 토큰 / 스타일

- CurrentLevelCard: surface + 레벨 색 보더 + glow shadow
- LevelProgressBar: gold glow inner shadow (`box-shadow: inset 0 0 8px gold33`)
- LevelCard 강조 보더: `border: 2px solid ${level.color}`
