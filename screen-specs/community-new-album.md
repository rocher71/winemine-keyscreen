# 앨범 작성 (`/community/new/album`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/community/new/album` |
| 파일 | `src/app/community/new/album/page.tsx` (303 라인) |
| 헤더 | 풀스크린 헤더 — 좌상단 `<X>` + 우상단 "등록" 버튼 |
| BottomNav | 표시 |
| 진입 가드 | 없음 |
| Feature flag 키 | (자체 등록 가능) |

---

## 진입 경로

- `/community/new` "사진 앨범" 카드

---

## 페이지 구성

### 1. 헤더
- 좌상단 `<X>` → back
- 우상단 "등록 / Publish" 버튼 — disabled if (photos.length === 0)

### 2. 사진 업로드 영역
- 큰 점선 카드 (rounded 16) — `<Plus size={32}>` + "사진 추가 / Add photo"
- 클릭 → placeholder (시안)
- 추가된 사진들 그리드 (각 사진 + X 삭제 버튼)

### 3. 캡션 입력 (사진별 또는 전체)
- 각 사진 아래 짧은 캡션 입력
- 또는 전체 앨범 캡션

### 4. 연결 와인 선택 (선택)
- "와인 연결" → BottomSheet

### 5. 등록
- PlaceholderToast + `/community`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| 좌상단 X | 클릭 | back |
| + 사진 추가 | 클릭 | placeholder |
| 사진 X | 클릭 | photos splice |
| 캡션 input | 타이핑 | local state |
| 와인 연결 | 클릭 | BottomSheet |
| 등록 | 클릭 | PlaceholderToast + `/community` |

---

## 상태 관리

- `photos[]`, `captions[]`, `linkedWineId` — useState

---

## 데이터 의존성

- 와인 picker용 `getWine` / 검색 helper

---

## i18n 키 prefix

- `community.album.*` 또는 인라인
