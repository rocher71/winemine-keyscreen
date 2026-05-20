# 칼럼 작성 (`/community/new/column`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/community/new/column` |
| 파일 | `src/app/community/new/column/page.tsx` (225 라인) |
| 헤더 | 풀스크린 헤더 — 좌상단 `<X>` + 우상단 "등록" 버튼 |
| BottomNav | 표시 |
| 진입 가드 | 없음 |
| Feature flag 키 | (자체 등록 가능) |

---

## 진입 경로

- `/community/new` "긴 글 · 칼럼" 카드

---

## 페이지 구성

### 1. 헤더
- 좌상단 `<X>` 닫기 → ConfirmDialog ("저장 안 한 글 버릴까요?") 또는 즉시 back
- 우상단 "등록 / Publish" 버튼 — disabled if (title empty || body empty)

### 2. 제목 입력
- `<input>` 큰 폰트 (Playfair 22px) placeholder "제목 / Title"

### 3. 본문 textarea
- 멀티라인 입력, placeholder "내용을 적어주세요 (마크다운 지원) / Write your content (Markdown supported)"
- 안내 텍스트: "와이너리 방문기, 빈티지 분석 등 자유롭게 / Winery visits, vintage analysis, etc."

### 4. 태그 입력
- 칩 형태 입력 — Enter 또는 콤마로 칩 생성
- 각 태그 우측 X로 삭제

### 5. 연결 와인 선택 (선택)
- "와인 연결 / Link a wine" 버튼 → BottomSheet (와인 검색)
- 선택된 와인 WineEmbedCard 미리보기

### 6. 저장
- "등록" 클릭 시 → PlaceholderToast ("글이 등록됐어요 / Published") + `router.push('/community')`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| 좌상단 X | 클릭 | ConfirmDialog 또는 back |
| 제목 input | 타이핑 | local state |
| 본문 textarea | 타이핑 | local state |
| 태그 input | Enter | tag push |
| 태그 X | 클릭 | tag splice |
| 와인 연결 버튼 | 클릭 | BottomSheet 와인 picker |
| 등록 | 클릭 | PlaceholderToast + back |

---

## 상태 관리

- `title`, `body`, `tags[]`, `linkedWineId` — useState

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getWine` / 와인 검색 helper | 와인 picker |

---

## i18n 키 prefix

- `community.column.*` 또는 인라인
