# 글 작성 타입 picker (`/community/new`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/community/new` |
| 파일 | `src/app/community/new/page.tsx` (269 라인) |
| 헤더 | 풀스크린 모달-style 헤더 — 상단 hairline + 좌상단 `<X>` 닫기 (인라인) |
| BottomNav | 표시 |
| 진입 가드 | 없음 |
| Feature flag 키 | `/community/new` — `compose.typePicker`, `compose.tonightCta` |

---

## 진입 경로

- `/community` 우하단 PenLine FAB

---

## 페이지 구성

### 1. 인트로 텍스트

- "어떤 이야기를 나누고 싶으세요? / What kind of story do you want to share?"

### 2. POST_TYPES 5종 카드

각 카드 (Surface, default border, rounded 14, padding):
- 좌측 lucide 아이콘 (32px, type color):
  - `note` — `<PenLine>` `#C9A84C` 골드
  - `question` — `<HelpCircle>` `#a08ee0` 보라
  - `column` — `<BookOpen>` `#F5F0E8` 크림
  - `news` — `<Sparkles>` `#5b9ce6` 블루
  - `album` — `<Image>` `#e8b4d2` 핑크
- 라벨 (한글 / 영문 — POST_TYPES.koLabel / enLabel)
- 서브 텍스트 (koSub / enSub)
- 우측 ChevronRight + (선택적) +XP 뱃지 (note: +15 XP / column: +25 XP)

**type별 onClick (href Route)**:
- `note` — `/community/new` (시안 — 양식 picker)
- `question` — `/community/new` (시안 — placeholder)
- `column` — `/community/new/column`
- `news` — `/community/new` (시안 — placeholder)
- `album` — `/community/new/album`

### 3. Tonight CTA (배너 — 선택적)

- "오늘 밤 마시는 사람들 / Who's drinking tonight?" Moon 아이콘
- 클릭 → `/community/tonight`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| 좌상단 X | 클릭 | `router.back()` (→ `/community`) |
| `note` 카드 | 클릭 | `/notes/new` (양식 picker로) 또는 placeholder |
| `question` 카드 | 클릭 | PlaceholderToast |
| `column` 카드 | 클릭 | `/community/new/column` |
| `news` 카드 | 클릭 | PlaceholderToast |
| `album` 카드 | 클릭 | `/community/new/album` |
| Tonight CTA | 클릭 | `/community/tonight` |

---

## 상태 관리

- 라우팅 분기만, 별도 useState 없음

---

## 데이터 의존성

- POST_TYPES 배열은 인라인 정의 (`page.tsx:11-67`)

---

## i18n 키 prefix

- 대부분 인라인 (`koLabel`/`enLabel` / `koSub`/`enSub` 배열 안에 string)
- `community.*` 추가 prefix

---

## Feature flag 등록 (2개)

```ts
useRegisterFeatures('/community/new', [
  { id: 'compose.typePicker' },
  { id: 'compose.tonightCta' },
])
```

---

## 디자인 토큰 / 스타일

- 카드 색 강조: type별 컬러 (5색 팔레트)
- +XP 뱃지: 골드 텍스트
