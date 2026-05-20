# 커뮤니티 양식 둘러보기 (`/community/templates`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/community/templates` |
| 파일 | `src/app/community/templates/page.tsx` (170 라인) |
| 헤더 | `<BackHeader title>` ("커뮤니티 양식 / Community templates") |
| BottomNav | 표시 (커뮤니티 탭 활성) |
| 진입 가드 | 없음 |
| Feature flag 키 | (자체 등록 가능) |

---

## 진입 경로

- `/settings/tasting-template` 하단 "커뮤니티 양식 둘러보기 →" 골드 링크
- `/community` Templates 탭과 비슷한 entry

---

## 페이지 구성

### 1. 인트로 문구
- "양식을 저장하면 노트 작성 화면 picker에 등장해요 / Save a template — it will appear in your note picker"

### 2. SortToggle
- `popular` ("인기순") = `saveCount` desc
- `latest` ("최신순") = `createdAt` desc

### 3. 양식 카드 리스트 (`getCommunityTemplatesSorted(sort)`)

각 카드 (Surface + border, rounded 14):
- 제목 (Playfair 15px)
- "by {작성자명}" (12px muted)
- 필드수 · 저장수 (12px 메타)
- 우측 Bookmark 토글 (saveTemplate / unsaveTemplate)

**Bookmark 토글 시 토스트**:
- 저장 (saveTemplate) → "이제 이 양식으로도 노트를 쓸 수 있어요 / You can now write notes with this template"
- 해제 (unsaveTemplate) → "양식을 픽커에서 제거했어요 / Template removed from picker"

저장된 양식은 다음 화면들에 즉시 반영:
- `/notes/new` 양식 picker에 추가
- `/settings/tasting-template` 저장한 커뮤니티 양식 섹션

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| SortToggle popular | 클릭 | `setSort('popular')` |
| SortToggle latest | 클릭 | `setSort('latest')` |
| 양식 카드 | 탭 | 미리보기 BottomSheet 또는 정적 (시안) |
| Bookmark 토글 | 클릭 | `saveTemplate(id)` 또는 `unsaveTemplate(id)` + 토스트 |

---

## 상태 관리

| 상태 | 종류 |
|---|---|
| `sort` | useState `'popular'` |
| `isSaved`, `saveTemplate`, `unsaveTemplate` | `useTastingTemplates()` |

**localStorage 키 (Context 관리)**: `winemine.savedTemplates` (배열 of templateId)

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getCommunityTemplatesSorted(sort)` | 커뮤니티 양식 풀 (정렬된) |
| `useTastingTemplates` | 저장 상태 |

---

## i18n 키 prefix

- `community.templates.*`
- 인라인 LocalizedString 다수

---

## 빈/오류 상태

- 양식 0개: 발생 가능성 낮음 (mock 풀에 포함)

---

## 디자인 토큰 / 스타일

- Bookmark: `<Bookmark>` lucide 아이콘 (filled / outline 분기)
- 카드: 가로 row, 우측 액션
