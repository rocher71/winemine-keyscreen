# 포스트 상세 (`/community/[postId]`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/community/[postId]` |
| 파일 | `src/app/community/[postId]/page.tsx` (636 라인) |
| 헤더 | `<BackHeader title>` (title 인라인 또는 동적) |
| BottomNav | 표시 (커뮤니티 탭 활성) |
| 진입 가드 | post 못 찾으면 빈 페이지 |
| Feature flag 키 | (자체 등록 가능) |

---

## 진입 경로

- `/community` Following/All 피드 카드
- 알림 (정의 따라)

---

## 페이지 구성

### 1. 작성자 + 메타 헤더
- 레벨 그라데이션 아바타 + 닉네임 + LevelChip ("L{N}")
- 상대 시간 (`{N}분 전 / {N}m ago`)
- PostType 배지 (color-coded — note/question/column/news/album)

### 2. 포스트 타이틀 (Playfair 22px)

### 3. 본문 (LocalizedString)
- type별 본문 form:
  - `note` — 시음 노트 카드 + 와인 ref
  - `question` — 질문 본문 + 추천 wines
  - `column` — 긴 글 markdown (시안)
  - `news` — 짧은 본문 + 외부 링크
  - `album` — 사진 그리드 + 캡션

### 4. 연결된 와인 (WineEmbedCard)
- 클릭 시 `/wine/{wineId}`

### 5. 좋아요 / 댓글 수 + ReactionBar

### 6. 하단 "댓글 보기 →" → `/community/[postId]/comments`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| 작성자 클릭 | 탭 | `/profile/{userId}` |
| WineEmbedCard | 클릭 | `/wine/{wineId}` |
| ReactionBar 아이콘 | 클릭 | useState (영속 X) |
| 댓글 보기 → | 클릭 | `/community/[postId]/comments` |

---

## 상태 관리

- post lookup: `getCommunityPosts().find(p => p.id === postId)` 또는 helper
- ReactionBar local state

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getCommunityPosts` / `getPostById` | post lookup |
| `getCommunityUser` | 작성자 |
| `getWine` | embed 와인 |

---

## i18n 키 prefix

- `community.post.*` 및 인라인 LocalizedString

---

## 빈/오류 상태

- post === null: "포스트를 찾을 수 없어요 / Post not found"
