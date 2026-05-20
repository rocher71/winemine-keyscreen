# 댓글 (`/community/[postId]/comments`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/community/[postId]/comments` |
| 파일 | `src/app/community/[postId]/comments/page.tsx` (183 라인) |
| 헤더 | `<BackHeader title>` ("댓글 / Comments") |
| BottomNav | 표시 (커뮤니티 탭 활성) |
| 진입 가드 | post 못 찾으면 빈 페이지 |
| Feature flag 키 | (자체 등록 가능) |

---

## 진입 경로

- `/community/[postId]` 하단 "댓글 보기 →"

---

## 페이지 구성

### 1. 댓글 리스트 (`<ul>`)

각 `<CommentRow>` (`src/components/community/comment-row.tsx`):
- 작성자 아바타 + LevelChip + 타임스탬프
- 본문 (LocalizedString)
- 좋아요 카운트 (Heart 아이콘 + 숫자)

### 2. 하단 고정 입력 폼

- `position: absolute; bottom: 0`, padding `12px 16`, surface bg + 상단 hairline
- `<input>` placeholder "댓글 입력 / Add comment"
- 우측 전송 버튼 (Send 아이콘 또는 텍스트)
- 제출 시 → PlaceholderToast ("댓글 기능은 곧 지원돼요 / Comments coming soon")

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` (→ 포스트 상세) |
| 작성자 클릭 | 탭 | `/profile/{userId}` |
| 좋아요 아이콘 | 클릭 | useState (영속 X) |
| 댓글 input | 타이핑 | local state |
| 전송 버튼 | 클릭 | PlaceholderToast |

---

## 상태 관리

- `comments` — mock 또는 `getCommentsByPost(postId)`
- `draft` — useState (입력 텍스트)
- `liked` — useState (좋아요 토글)

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getCommentsByPost` (mock) | 댓글 풀 |
| `getCommunityUser` | 작성자 |

---

## i18n 키 prefix

- `community.comments.*`

---

## 빈/오류 상태

- 댓글 0건: EmptyState ("아직 댓글이 없어요 / No comments yet")
