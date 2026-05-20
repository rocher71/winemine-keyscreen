# 취향 맞는 유저 발견 (`/community/discover`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/community/discover` |
| 파일 | `src/app/community/discover/page.tsx` (220 라인) |
| 헤더 | `<BackHeader title={...}>` ("취향 맞는 유저 / Discover taste matches") |
| BottomNav | 표시 (커뮤니티 탭 활성) |
| 진입 가드 | 없음 |
| Feature flag 키 | (자체 등록 가능) |

---

## 진입 경로

- `/community` 일부 진입 (Discover 카드 또는 메뉴)
- 홈 일부 entry

---

## 페이지 구성

### 유저 리스트 (취향 일치도 % 상위)

각 카드 (Surface, default border, rounded 14):
- 큰 아바타 (LEVEL_COLORS 그라데이션)
- 닉네임 (Playfair)
- **일치도 %** — 큰 골드 숫자 (예: "84%")
- 공통 산지 칩 (예: "보르도", "토스카나")
- 공통 품종 칩
- 서브 텍스트 (LocalizedString) — "당신처럼 부르고뉴 화이트를 좋아해요 / Also loves Burgundy whites"
- 카드 클릭 → `/profile/{userId}`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| 유저 카드 | 클릭 | `/profile/{userId}` |

---

## 상태 관리

- 정렬 / 필터 (선택적, 시안에서는 정적 정렬)
- mock USERS 풀에서 currentUser 제외한 후 compatibility로 정렬

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getMatchPctVsMe` (compatibility.ts) | 일치도 % |
| USERS / `resolveUser` | 유저 풀 |
| `getProfileNotes` | 공통 산지/품종 산출 |

---

## i18n 키 prefix

- `community.discover.*` 또는 인라인 LocalizedString
