# 알림 설정 (`/settings/notifications`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/settings/notifications` |
| 파일 | `src/app/settings/notifications/page.tsx` (85 라인) |
| 헤더 | `<BackHeader title={t('title')} />` ("알림 설정 / Notification settings") |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/settings/notifications` — `settings.notif.toggles` |

---

## 진입 경로

- `/settings` "알림 설정" 행

---

## 페이지 구성

`<main className="wm-scroll-area" style={paddingTop: 12}>`

### 4개 ToggleRow

`type Toggles = { favoritePurchase, drinkWindow, badgeLevel, community }`

**DEFAULTS**:
```ts
{ favoritePurchase: true, drinkWindow: true, badgeLevel: true, community: false }
```

| 라벨 | key | default |
|---|---|---|
| `t('favoritePurchase')` ("즐겨찾기 구매 알림 / Favorite purchase") | favoritePurchase | true |
| `t('drinkWindow')` ("음용 적기 알림 / Drink window") | drinkWindow | true |
| `t('badgeLevel')` ("뱃지 · 레벨업 / Badges & level-up") | badgeLevel | true |
| `t('community')` ("커뮤니티 활동 / Community activity") | community | false |

각 ToggleRow — 라벨 + 토글 스위치.

**`setOne(key, next)`**:
```ts
const updated = { ...toggles, [key]: next };
setToggles(updated);
localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
toast({ message: t('toggleSaved') });
```

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| ToggleRow 각각 | 클릭 | `setOne(key, !current)` + 토스트 |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `toggles` | useState | `DEFAULTS` |

**useEffect (mount)**:
```ts
const raw = localStorage.getItem('winemine.notifSettings');
if (raw) setToggles({ ...DEFAULTS, ...JSON.parse(raw) });
```

**localStorage 키**: `winemine.notifSettings` (값은 JSON Toggles)

> **시안 단계**: 토글 상태는 영속화되지만 실제 알림 발송에는 영향 X. mock notifications.ts 그대로 노출.

---

## i18n 키 prefix

- `settings.notifPage.{title, favoritePurchase, drinkWindow, badgeLevel, community, toggleSaved}`

---

## Feature flag 등록 (1개)

```ts
useRegisterFeatures('/settings/notifications', [
  { id: 'settings.notif.toggles' },
])
```

---

## 디자인 토큰 / 스타일

- ToggleRow: 행 padding + 라벨 + 토글 (gold ON / border-default OFF, 노브 cream)
