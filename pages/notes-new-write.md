# 노트 작성 (`/notes/new/write`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/notes/new/write` |
| 파일 | `src/app/notes/new/write/page.tsx` (118 라인) — 컨테이너만, 실제 폼은 별도 컴포넌트 |
| 헤더 | `<BackHeader title={t('title')} />` ("테이스팅 노트 작성 / Write tasting note") |
| BottomNav | **숨김** (HIDDEN_PREFIXES `/notes/new` 포함) |
| 진입 가드 | 없음 — Suspense fallback `null` |
| Feature flag 키 | `/notes/new/write` — `noteWrite.modeContainer` |

---

## URL 쿼리 파라미터

| 쿼리 | 의미 |
|---|---|
| `from` | `'cellar'` / `'newEntry'` / `'draft'` |
| `itemId` | 셀러 item id (from=cellar 시) |
| `wineId` | 와인 id (capture 결과·즐겨찾기 등 newEntry 시) |
| `templateId` | 양식 id — `builtin-beginner` / `builtin-expert` / `tpl-...` 커스텀 |
| `edit` | `'1'` (편집 모드 — 기존 노트 prefill) |
| `noteId` | 편집 대상 노트 id |
| `fromCellar` | 셀러 → 마시기 흐름 마커 |

---

## 진입 경로

| 출처 | 쿼리 |
|---|---|
| 셀러 BottomSheet 선택 | `?from=cellar&itemId={id}&templateId={tid}` |
| `/capture` 인식 결과 "노트 작성" | `?from=newEntry&wineId={id}` |
| `/cellar` TastedWineRow "편집" | `?from=newEntry&wineId={id}&edit=1` |
| `/wine/[id]` WriteNoteCta | `?wineId={id}&from=newEntry` |
| `/cellar/[id]` DrinkThisButton | `?wineId={id}&fromCellar={id}` |
| 홈 DraftNoteResume | `?from=draft&wineId={id}&templateId={tid}` |
| `/notes/new` SourcePicker "새 항목 입력" | `?from=newEntry&templateId={tid}` |

---

## 페이지 구성 — 3-way 분기

`<main className="wm-scroll-area" data-feature-id="noteWrite.modeContainer" style={padding: '12px 16px 24px'}>` 안에 단 하나의 폼만 마운트.

### 분기 로직 (page.tsx:67~86)

```ts
const customTemplate = useMemo(() => {
  if (!templateIdParam) return null;
  if (templateIdParam === BUILTIN_BEGINNER_ID || templateIdParam === BUILTIN_EXPERT_ID) return null;
  return myCustomTemplates.find(m => m.id === templateIdParam)
       ?? getTemplateById(templateIdParam)
       ?? null;
}, [templateIdParam, myCustomTemplates]);

const useExpertBuiltin =
  templateIdParam === BUILTIN_EXPERT_ID ||
  (!templateIdParam && experience === 'expert');
```

| 우선순위 | 조건 | 렌더 컴포넌트 |
|---|---|---|
| 1 | `customTemplate && customTemplate.kind === 'custom'` | `<DynamicTemplateForm template wine />` |
| 2 | `useExpertBuiltin === true` | `<NoteWriteExpert initialVariant wine userLevelId blindAnswer={null} />` |
| 3 | else | `<NoteWriteBeginner variant wineName producer wine />` |

### Variant 산출 (`variantFromWineType`)

```ts
function variantFromWineType(t) {
  if (t === 'white') return 'white';
  if (t === 'sparkling') return 'sparkling';
  return 'red';
}
```

### Wine 객체 lookup

```ts
if (from === 'cellar' && itemId) {
  const item = getCellarItem(itemId);
  wine = item ? getWine(item.wineId) : null;
} else if (wineIdParam) {
  wine = getWine(wineIdParam);
} else {
  wine = null;          // 빈 노트 (직접 입력)
}
```

---

## NoteWriteBeginner — 입문자 모드

`src/components/tasting-note/note-write-beginner.tsx`

(BeginnerNote 컴포넌트로 위임)

**필드** (handover doc + 베타 피드백 #1):
- 와인명·생산자 read-only 표시
- **별점**: 1~5 하트 (WMGlassRating)
- **향 느낌 체크박스**: 과일 / 꽃 / 나무 / 흙 / 기타
- **맛 느낌**: 가벼움~진함 / 단맛 / 신맛 / 탄닌 (각 1~5)
- **자유 메모** (textarea, LocalizedString 의도)
- **ServingTempInput** — 시음 온도 °C 입력
- **AutoDescription** (변형 beginner) — 선택값 기반 한·영 자동 문장 생성
- 사진 첨부 (PlaceholderToast)
- 제출 → +10 XP 토스트 (`XP_ACTIONS.beginnerNote`)

---

## NoteWriteExpert — 전문가 모드

`src/components/tasting-note/note-write-expert.tsx`

**WSET 5축 슬라이더** (각 5단계 low/mediumMinus/medium/mediumPlus/high):
- `sweet` / `acidity` / `body` / `alcohol` / `tannin`
- `<WSETSlider labelKey value onChange labels={5} hint? />`

**향·풍미 강도** (intensity): WSET 스케일 (별도 슬라이더)

**TanninPanel** (`variant === 'red'` 전용):
- grippy / fine / silky / harsh

**숙성도**: youthful / developing / mature / oxidative

**마무리 길이** (`FinishLength`): short / medium / long / veryLong

**AromaWheel** — UC Davis 계통 3레벨 트리 (`AROMA_LEXICON`):
- variant: aroma / palate / finish
- 카테고리 10종: fruit / floral / spice / earth / oak / chemical / microbial / pungent / nutty / vegetal
- forcedCategory? 옵션

**CaudalieMeter** — 1~30초 슬라이더 (1 caudalie = 1초)

**FaultChecklist** — 결함:
- FaultId: tca(bouchonné/코르키), brett, vinegar(VA), oxidation, reduction, heat-damage, refermentation, mousy 등

**OpeningTimeline** — full 변형:
- `openedAt` (타임스탬프), `decant` (디캔팅 분), `checkpoints` (시간대별 변화), `peakAt`

**BubblePanel** (`variant === 'sparkling'` 전용):
- 거품 크기: fine / medium / coarse
- 지속성: short / medium / long
- 무스 (texture)
- 제조 방식: traditional / charmat / ancestral / pet-nat
- 도사주: brut nature / extra brut / brut / extra dry / sec / demi-sec / doux

**RegionalAromaHints** — 산지별 대표 아로마 칩 (`regional-aromas.ts`):
- wine.region에 매칭되는 아로마 자동 제안
- 클릭 시 AromaWheel에 toggle

**AutoDescription** (variant=expert) — aroma/palate/finish/rating/evolution 기반 한·영 자동 문장

**BlindMode** (선택 토글):
- 정답 prop으로 외부 주입 (`correctAnswer?: { variety, region, vintage }`)
- 제출 후 정답 공개 → `getRankLabel(score, locale)`:
  - ≥90: "Master Sommelier 수준 / Master Sommelier level"
  - ≥75: "Advanced Sommelier 후보"
  - ≥50: "탐험 단계 — 더 마셔보세요"
  - else: "재미있는 발견"

**PeakEtaInput** — 음용 적기 ETA (베타 피드백 #2):
- 절정 연도 입력
- 신뢰도: low / medium / high
- 메모 (LocalizedString)
- **L3+ 가드** — L1/L2는 disabled

**ServingTempInput** (베타 피드백 #1):
- °C 입력
- 와인 타입별 권장 범위와 비교 (예: red 16~18°C)
- 범위 밖이면 빨강 경고 + 권장 범위 표시

**100점 환산 평점** + **재구매 의향** (boolean):
- `네, 다시 살 거예요 / Yes, I'd buy it again`
- `이번엔 한 번이면 충분 / Once was enough`

**자유 메모** (LocalizedString)

**제출 XP**:
- expert → +20 XP
- expert + blind → +25 XP (`calcNoteXp('expert', true)`)

---

## DynamicTemplateForm — 커스텀 양식

`src/components/tasting-note/dynamic-template-form.tsx`

`<DynamicTemplateForm template wine />`

**지원 필드 타입** (template.fields[]):
- `slider` (1~5)
- `wsetScale` (low~high)
- `rating` (별점 0~5, half 지원)
- `chipsSingle` (단일 선택 칩)
- `chipsMulti` (다중 선택 칩)
- `text` (긴 메모)
- `number` (숫자 입력)
- `checkbox` (boolean)

제출 → 토스트 (XP 액션 추정 — 시안)

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` (작성 중 데이터 손실 경고는 시안에서 미구현) |
| 각 필드 input | 변경 | 컴포넌트 내부 state |
| 제출 버튼 | 클릭 | XP 토스트 + `router.back()` 또는 노트 상세 이동 |
| 사진 첨부 | 클릭 | PlaceholderToast |
| BlindMode 토글 | 클릭 | 와인 정보 숨김 / 공개 |
| GlossaryTooltip (i) | 클릭 | 용어 BottomSheet |

---

## 상태 관리

페이지 자체는 라우팅 분기만. 실제 폼 state는 하위 컴포넌트:

| 컴포넌트 | 주요 state |
|---|---|
| NoteWriteBeginner | rating, aromas[], wsetScales{}, memo, servingTemp, autoDescAccepted |
| NoteWriteExpert | wsetSliders{}, tanninTexture, evolution, finishLength, aroma[], caudalies, faults[], opening{}, bubble{}, peakEta{}, servingTemp, rating100, buyAgain, memo, blindEnabled |
| DynamicTemplateForm | values: Record<fieldId, any> |

**Context 의존**: `useExperience`, `useMockUser`, `useLocale`, `useTastingTemplates`

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getCellarItem` | from=cellar 시 |
| `getWine` | wine 객체 |
| `getTemplateById` | 커뮤니티 풀에서 양식 |
| `BUILTIN_BEGINNER_ID`, `BUILTIN_EXPERT_ID` | 분기 |

---

## i18n 키 prefix

- `notes.write.title`
- 하위 컴포넌트는 `tastingNote.*` prefix (`tastingNote.wset.*`, `tastingNote.aroma.*`, `tastingNote.fault.*`, `tastingNote.bubble.*` 등)

---

## Feature flag 등록

```ts
useRegisterFeatures('/notes/new/write', [
  { id: 'noteWrite.modeContainer' },
])
```

---

## 빈/오류 상태

- **wine === null** (직접 입력 흐름): 와인명·생산자가 사용자 입력 필드로 노출 (또는 컴포넌트가 빈 placeholder)
- **templateId가 존재하지 않는 ID**: customTemplate null fallback → experience 기반 builtin 선택
- **Suspense fallback**: `null` (rendering이 시작되기 전까지 빈 화면)

---

## 디자인 토큰 / 스타일

- 하위 컴포넌트들이 각자 디자인 정의 (handover doc 참조)
- 페이지 컨테이너만 padding `12px 16px 24px`
