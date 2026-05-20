# 양식 편집 (`/settings/tasting-template/[templateId]/edit`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/settings/tasting-template/[templateId]/edit` |
| 파일 | `src/app/settings/tasting-template/[templateId]/edit/page.tsx` (40 라인 — 컨테이너만) |
| 헤더 | `<BackHeader>` (TemplateBuilder가 자체 노출) |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | template ID 못 찾으면 빈 상태 |
| Feature flag 키 | (미확인) |
| 실제 폼 | `<TemplateBuilder mode="edit" template={...} />` |

---

## 진입 경로

- `/settings/tasting-template` 내 양식 카드 `<Pencil>` 편집 버튼

---

## 페이지 구성 — TemplateBuilder (편집 모드)

[settings-tasting-template-new.md](./settings-tasting-template-new.md)와 동일한 빌더 UI, **편집 모드 차이**:

- **기존 템플릿 로드**: `getTemplateById(templateId)` 또는 `myCustomTemplates.find(m => m.id === templateId)` → 제목·설명·fields·isPublic 모두 prefill
- **저장 토스트**: "양식이 업데이트됐어요 / Template updated"
- **삭제 액션 추가**: 헤더 또는 푸터에 Trash 버튼 → ConfirmDialog → `deleteCustomTemplate(id)` + back

---

## 인터랙션 매트릭스

new 페이지와 동일 + 다음 추가:

| 위치 | 액션 | 결과 |
|---|---|---|
| 삭제 버튼 | 클릭 | ConfirmDialog → 삭제 + back |

---

## 상태 관리 (TemplateBuilder 내부)

- 동일 — 차이는 mount 시 `template` prop으로 초기값 채움

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `useTastingTemplates` | `myCustomTemplates`, `updateCustomTemplate`, `deleteCustomTemplate` |
| `getTemplateById` | 커뮤니티 풀에서 로드 (저장한 커뮤니티 양식 편집 시 — 보통 read-only) |

---

## 빈/오류 상태

- **templateId 미존재**: "양식을 찾을 수 없어요 / Template not found" 빈 페이지
- **read-only 커뮤니티 양식**: 편집 비활성 또는 fork (시안 임의)
