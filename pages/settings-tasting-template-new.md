# 새 양식 만들기 (`/settings/tasting-template/new`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/settings/tasting-template/new` |
| 파일 | `src/app/settings/tasting-template/new/page.tsx` (15 라인 — 컨테이너만) |
| 헤더 | `<BackHeader>` (TemplateBuilder 컴포넌트가 자체 헤더 노출 가능) |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | (미확인) |
| 실제 폼 | `<TemplateBuilder mode="new" />` 컴포넌트로 위임 |

---

## 진입 경로

- `/settings/tasting-template` "+ 새 양식 만들기" 카드

---

## 페이지 구성 — TemplateBuilder (`src/components/tasting-template/template-builder.tsx`)

### 1. 양식 메타 입력

- **제목 (ko / en 양쪽 입력 필수)**: 2개 input
- **설명 (ko / en)**: textarea

### 2. 필드 단위 빌더

- **+ 필드 추가** 버튼 → BottomSheet (필드 타입 선택)
- 각 필드 카드:
  - 좌측 ↑ / ↓ 이동 버튼 (필드 순서 변경)
  - 라벨 입력 (ko / en)
  - **필드 타입별 옵션**:
    - `chipsSingle`, `chipsMulti` — 옵션 라벨 ko/en 추가/삭제 리스트
    - `slider`, `wsetScale`, `rating`, `text`, `number`, `checkbox` — 추가 옵션 적음
  - 우측 `<Trash2>` 삭제 (ConfirmDialog)

**지원 필드 타입 8종**:
- `slider` (1~5)
- `wsetScale` (low~high)
- `rating` (별점 0~5, half 지원)
- `chipsSingle` (단일 선택 칩)
- `chipsMulti` (다중 선택 칩)
- `text` (긴 메모)
- `number` (숫자 입력)
- `checkbox` (boolean)

### 3. "커뮤니티에 공유 / Share to community" 토글

- `isPublic` 토글

### 4. 저장 버튼

- 저장 → 토스트 (변형):
  - 신규 + isPublic === true → "양식이 커뮤니티에 공유됐어요 / Template shared to community"
  - 신규 + private → "내 양식이 추가됐어요 / Template added"
- 저장 후 `/settings/tasting-template` 또는 `/notes/new` 라우팅 (구현 따라)

저장 시 TastingTemplateContext `createCustomTemplate({title, description, fields, isPublic})` 호출 → localStorage `winemine.tastingTemplates`에 push.

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` (입력 손실 경고 시안 미구현) |
| 제목/설명 input | 타이핑 | local state |
| + 필드 추가 | 클릭 | BottomSheet 오픈 → 타입 선택 |
| 필드 ↑ / ↓ | 클릭 | 배열 swap |
| 필드 라벨 input | 타이핑 | local state |
| chipsSingle/Multi 옵션 + 추가 | 클릭 | option 배열 push |
| chipsSingle/Multi 옵션 삭제 | 클릭 | option 배열 splice |
| 필드 Trash | 클릭 | ConfirmDialog → 배열 splice |
| 공유 토글 | 클릭 | `setIsPublic(!isPublic)` |
| 저장 | 클릭 | `createCustomTemplate` + 토스트 + 라우팅 |

---

## 상태 관리 (TemplateBuilder 내부)

- `title: { ko, en }`
- `description: { ko, en }`
- `fields: TemplateField[]`
- `isPublic: boolean`
- `createCustomTemplate` — `useTastingTemplates()` method

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `useTastingTemplates` | createCustomTemplate |
| 필드 타입 정의 (lexicon 또는 types) | 필드 옵션 |

---

## i18n 키 prefix

- TemplateBuilder는 `tasting-template.builder.*` (또는 인라인)

---

## 빈/오류 상태

- 제목 빈 상태에서 저장: 검증 (시안 임의)
- 필드 0개 저장: 가능 또는 검증 (시안 임의)
