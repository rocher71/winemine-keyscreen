# 테이스팅 노트 양식 (`/settings/tasting-template`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/settings/tasting-template` |
| 파일 | `src/app/settings/tasting-template/page.tsx` (382 라인) |
| 헤더 | `<BackHeader title={{ko: '테이스팅 노트 양식', en: 'Tasting templates'}} />` |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | (미확인 — 자체 등록 가능) |

---

## 진입 경로

- `/settings` "테이스팅 노트 양식" 행

---

## 페이지 구성 — 4섹션

`<div className="wm-scroll-area" style={paddingBottom: 40}>`

### 0. 인트로 문구 (margin `8px 20px 18px`, 12px muted)

- `내가 기록할 필드를 자유롭게 추가·삭제·재배열하세요. 직접 만든 양식은 커뮤니티에 공유할 수도 있어요. / Edit the structure of your tasting notes. Add fields, remove what you do not use, or create your own template and share it.`

### 1. winemine 제공 (read-only)

`<SectionLabel>` "winemine 제공 / Provided by winemine"

- `<BuiltinRow template={BUILTIN_BEGINNER} locale />` — 입문자 양식
- `<BuiltinRow template={BUILTIN_EXPERT} locale />` — 전문가 양식

각 BuiltinRow 카드: 제목 + 필드 수 + "기본 / Default" 배지 (수정 X)

### 2. 내가 만든 양식 (`myCustomTemplates`)

`<SectionLabel>` "내가 만든 양식 / My templates"

`myCustomTemplates.length === 0`이면 `<EmptyHint>`:
- "아직 만든 양식이 없어요. 아래 버튼으로 새로 만들어보세요. / No custom templates yet. Tap below to create one."

있으면 각 카드 (margin `6px 16`, padding `12px 14`, Surface, default border, rounded 12, flex row):
- 좌측: 제목 (LocalizedString) + 필드 수
- 우측 액션:
  - `<Pencil>` 편집 버튼 → `/settings/tasting-template/[templateId]/edit`
  - `<Trash2>` 삭제 → ConfirmDialog → `deleteCustomTemplate(id)`
  - `<Globe>` 공개 토글 (시안)

### 3. 저장한 커뮤니티 양식 (`savedFromCommunity`)

`<SectionLabel>` "저장한 커뮤니티 양식 / Saved community templates"

`savedFromCommunity = COMMUNITY_TEMPLATES.filter(t => savedTemplateIds.includes(t.id))`

각 카드:
- 제목 + by {작성자명}
- `<Bookmark>` 토글 (저장 해제) → `unsaveTemplate(id)` + 토스트

### 4. + 새 양식 만들기 카드

- 점선 또는 골드 보더, 중앙 `<Plus>` 아이콘
- 클릭 시 `/settings/tasting-template/new`

### 5. 커뮤니티 양식 둘러보기 링크

- 골드 텍스트 "커뮤니티 양식 둘러보기 → / Browse community templates →"
- 클릭 시 `/community/templates`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| BuiltinRow | 탭 | (현재) 정적 표시 |
| 내 양식 편집 (Pencil) | 클릭 | `/settings/tasting-template/[id]/edit` |
| 내 양식 삭제 (Trash) | 클릭 | ConfirmDialog → `deleteCustomTemplate` |
| 내 양식 공개 토글 (Globe) | 클릭 | 토스트 (시안) |
| 저장한 양식 Bookmark | 클릭 | `unsaveTemplate(id)` + 토스트 |
| + 새 양식 카드 | 클릭 | `/settings/tasting-template/new` |
| 커뮤니티 양식 둘러보기 | 클릭 | `/community/templates` |

---

## 상태 관리

| 상태 | 종류 | 출처 |
|---|---|---|
| `myCustomTemplates` | context | `useTastingTemplates()` |
| `savedTemplateIds` | context | `useTastingTemplates()` |
| `unsaveTemplate`, `deleteCustomTemplate` | context methods | 동일 |
| `savedFromCommunity` | derived | filter |

**localStorage 키 (TastingTemplateContext 관리)**:
- `winemine.tastingTemplates` (내 커스텀)
- `winemine.savedTemplates` (저장한 커뮤니티 ID 배열)

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `BUILTIN_BEGINNER`, `BUILTIN_EXPERT` | 고정 양식 2종 |
| `COMMUNITY_TEMPLATES` | 커뮤니티 풀 |
| `useTastingTemplates` | context state + methods |

---

## i18n 키 prefix

- 페이지: 인라인 `locale === 'en' ? ... : ...` 다수
- BackHeader title 인라인 `{ko, en}`

---

## 빈/오류 상태

- **내가 만든 양식 0개**: `<EmptyHint>` 안내
- **저장한 커뮤니티 양식 0개**: (정의 따라 빈 영역 또는 안내)

---

## 디자인 토큰 / 스타일

- BuiltinRow: 카드 + "기본" 배지
- 내 양식 카드: 액션 3종 (Pencil/Trash/Globe)
- 새 양식 카드: 점선 또는 골드 보더 + Plus 아이콘
