# 노트 출처 선택 (`/notes/new`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/notes/new` |
| 파일 | `src/app/notes/new/page.tsx` (305 라인) |
| 헤더 | `<BackHeader title={t('title')} />` |
| BottomNav | **숨김** (HIDDEN_PREFIXES `/notes/new` 포함) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/notes/new` — `notes.templatePicker`, `notes.sourcePicker` |

---

## 진입 경로

- 홈 QuickActions "노트 작성"
- 커뮤니티 `/community/new` "시음 노트" 카드
- `/capture` "메뉴얼 입력" 카드
- 셀러 인라인 "노트 작성"

---

## 페이지 구성 — 2단계 분기 (`selectedTemplateId` 유무)

### Stage 1: Template Picker (`selectedTemplateId === null`)

`data-feature-id="notes.templatePicker"`

**Header** (margin-bottom 14):
- Playfair 22px weight 600 cream — `어떤 양식으로 적을까요? / Choose a note style`
- Inter 13px muted line-height 1.5 — `테이스팅 노트 양식을 골라주세요. 설정에서 직접 만들 수도 있어요. / Pick a tasting note template. You can edit or create your own in Settings.`

**TemplateCard list** (flex column gap 10):
- `availableTemplates` (TastingTemplateContext) 매핑:
  - winemine 입문자 (`builtin-beginner`)
  - winemine 전문가 (`builtin-expert`)
  - 내 커스텀 양식
  - 저장한 커뮤니티 양식 (Bookmark된 것들)
- 각 카드: 양식 제목·필드 수·"기본"/"내 양식"/"커뮤니티" 배지 + ChevronRight
- 카드 클릭 → `setSelectedTemplateId(tpl.id)`

### Stage 2: Source Picker (`selectedTemplateId !== null`)

`data-feature-id="notes.sourcePicker"`

**Back link** (margin-bottom 12, gold 11px weight 600):
- `← 양식 다시 선택 / Change template` → `setSelectedTemplateId(null)`

**SourcePicker 컴포넌트** (`src/components/tasting-note/source-picker.tsx`):
- `<SourcePicker cellarCount={cellar.length} onPick={onPickSource} />`
- 3가지 카드 (각각 onPick(source) 호출):
  - **셀러에서 선택 / From Cellar** — 보유 와인 수 배지 (`cellarCount`)
  - **새로 검색 / Search new** — PlaceholderToast (시안 단계)
  - **새 항목 입력 / New entry**

**onPickSource(source)**:
```ts
const tid = selectedTemplateId ?? BUILTIN_BEGINNER_ID;
if (source === 'newEntry') {
  router.push(`/notes/new/write?from=newEntry&templateId=${tid}`);
  return;
}
setPickOpen(true);   // 셀러 BottomSheet 오픈
```

### Stage 3 (조건부): Cellar Sheet (`pickOpen === true`)

BottomSheet 오픈:
- Playfair 18px cream — `t('cellarListTitle')` ("셀러에서 와인 선택 / Pick from cellar")
- `<ul>` 스크롤 (max-height 50vh):
  - `cellar.map(it => getWine(it.wineId))` — wine 있는 항목만
  - 각 행: WMBottle (40×60) + 와인명 + 생산자·빈티지 + ChevronRight
- 행 클릭 시:
  ```ts
  router.push(`/notes/new/write?from=cellar&itemId=${it.id}&templateId=${tid}`);
  ```

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| TemplateCard | 클릭 | `setSelectedTemplateId(id)` |
| "양식 다시 선택" | 클릭 | `setSelectedTemplateId(null)` |
| SourcePicker "셀러에서 선택" | 클릭 | `setPickOpen(true)` |
| SourcePicker "새로 검색" | 클릭 | PlaceholderToast |
| SourcePicker "새 항목 입력" | 클릭 | `/notes/new/write?from=newEntry&templateId={tid}` |
| Cellar Sheet 행 | 클릭 | `/notes/new/write?from=cellar&itemId={id}&templateId={tid}` |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `selectedTemplateId` | useState | `null` |
| `pickOpen` | useState | `false` |
| `availableTemplates` | context | `useTastingTemplates()` — builtin + custom + savedCommunity |
| `cellar` | mock | `getCellarByUser(user.id)` |

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `useTastingTemplates` | 양식 picker 리스트 |
| `getCellarByUser` | 셀러 picker |
| `getWine` | 셀러 행에서 wine 정보 |
| `BUILTIN_BEGINNER_ID`, `BUILTIN_EXPERT_ID` | fallback templateId |

---

## i18n 키 prefix

- `notes.source.title`
- `notes.source.cellarListTitle`
- 나머지 헤더/서브는 인라인 `locale === 'en' ? ... : ...`
- SourcePicker는 자기 prefix (`tastingNote.source.*`)

---

## Feature flag 등록 (2개)

```ts
useRegisterFeatures('/notes/new', [
  { id: 'notes.templatePicker' },
  { id: 'notes.sourcePicker' },
])
```

---

## 빈/오류 상태

- **first-time 사용자 (cellar 0건)**: "셀러에서 선택" 카드에 cellarCount=0 표시 — UX 상 anyway 클릭하면 빈 sheet
- **availableTemplates 0개**: 발생 불가 (builtin 2개 항상 포함)

---

## 디자인 토큰 / 스타일

- BottomSheet drag handle + backdrop blur
- 양식 카드: Surface + default border + rounded
- 헤더 Playfair 22, 본문 Inter 13
