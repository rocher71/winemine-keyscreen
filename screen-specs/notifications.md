# 알림 리스트 (`/notifications`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/notifications` |
| 파일 | `src/app/notifications/page.tsx` (73 라인) |
| 헤더 | `<BackHeader title={t('title')}>` + 우측 "모두 읽음 / Mark all read" 골드 버튼 (notifs 있을 때만) |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/notifications` — `notif.list` |

---

## 진입 경로

- AppHeader Bell 클릭 (모든 페이지)
- 푸시 배너 (PushBanner) 탭 (간접)

---

## 페이지 구성

### 1. BackHeader + Mark all read 버튼

- 우측 (`notifs.length > 0`일 때만): Inter 12 weight 600 golden, padding `6px 10`, transparent
- 클릭 시: `setReadAll(true) + toast({ message: t('markedAllRead') })`

### 2. 빈 상태 (`notifs.length === 0`)

`<EmptyState illustration={<Bell size={56} strokeWidth={1.25}/>} title={t('empty')} description={t('emptySub')} />`
- "알림이 없어요 / No notifications"
- 설명

### 3. 알림 리스트

`data-feature-id="notif.list"`

`notifs.map(n => <NotificationRow notification={readAll ? {...n, read: true} : n} locale />)`

> `readAll` toggle은 mock: state만 갱신, mock에 영속화 X.

---

## NotificationRow 컴포넌트 (`src/components/notifications/notification-row.tsx`)

각 행 구조:
- **좌측 4px 컬러 바** (kind별):
  - `favoritePurchase` → 와인레드
  - `drinkWindowReached` → 골드
  - `badgeEarned` → 크림
  - `levelUp` → 골드
  - `reviewLiked` → secondary
- **아이콘** (kind별 lucide)
- **제목** (Inter weight 600)
- **본문** (Inter muted)
- **상대 시간** (`{N}분 전 / {N}m ago`)
- **미읽음 인디케이터**: 좌측 골드 도트 (`!read`일 때)

행 클릭 시 알림 종류별 라우트:
- `favoritePurchase + wineId` → `/wine/{wineId}`
- `drinkWindowReached + cellarItemId` → `/cellar/{cellarItemId}`
- `badgeEarned` → `/badges`
- `levelUp` → `/profile`
- `reviewLiked` → `/notifications` (또는 해당 노트)

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| Mark all read 버튼 | 클릭 | `setReadAll(true)` + 토스트 |
| NotificationRow | 클릭 | kind별 라우트 |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `notifs` | mock | `getNotificationsByUser(user.id)` |
| `readAll` | useState | `false` |
| `user` | mock | `useMockUser()` |
| `locale` | context | `useLocale()` |

> **영속화 없음** — readAll은 페이지 state 한정. mock notifications.ts의 `read` 필드는 그대로.

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getNotificationsByUser(userId)` | 알림 풀 (heavy: 5종 kind × N건 / first-time: 0건) |

### 알림 kind (5종)

| kind | 의미 | 연관 데이터 | 라우트 |
|---|---|---|---|
| `favoritePurchase` | 즐겨찾기 와인 누군가 구매 | wineId, storeId, priceKrw | `/wine/{wineId}` |
| `drinkWindowReached` | 셀러 와인 피크 도달 | cellarItemId | `/cellar/{cellarItemId}` |
| `badgeEarned` | 새 뱃지 획득 | badgeId | `/badges` |
| `levelUp` | 레벨 업 | newLevelId | `/profile` |
| `reviewLiked` | 내 리뷰에 좋아요 | reviewId | `/notifications` |

---

## i18n 키 prefix

- `notifications.{title, empty, emptySub, markAllRead, markedAllRead}`
- NotificationRow 안 kind별 텍스트는 자기 prefix (`notifications.kind.*`)

---

## Feature flag 등록 (1개)

```ts
useRegisterFeatures('/notifications', [
  { id: 'notif.list' },
])
```

---

## 빈/오류 상태

- **first-time 사용자**: notifs 0건 → EmptyState

---

## 디자인 토큰 / 스타일

- 좌측 4px 컬러 바 (kind별)
- 미읽음 골드 도트 (좌측)
- "모두 읽음" 골드 텍스트 버튼
