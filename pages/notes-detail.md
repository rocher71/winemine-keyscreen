# 노트 상세 read-only (`/notes/[noteId]`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/notes/[noteId]` (예: `/notes/note_xxxxx` 또는 `/notes/sn-xxxxx`) |
| 파일 | `src/app/notes/[noteId]/page.tsx` (881 라인 — 최대 규모) |
| 헤더 | `<BackHeader title={{ko: '테이스팅 노트', en: 'Tasting note'}}>` + 액션 (내 노트면 Edit + Share, 공유 노트면 Share만) |
| BottomNav | 표시 |
| 진입 가드 | 없음 — 못 찾으면 "노트를 찾을 수 없어요" 빈 페이지 |
| Feature flag 키 | 페이지 자체는 미등록 (긴 컨테이너) |
| 렌더 | Client Component (`'use client'`) |

---

## 진입 경로

- `/cellar` 마신 와인 탭 "노트 보기" → `/notes/{note.id}`
- `/wine/[id]` MyTastingNoteCard → 내 노트
- 홈 RecentNotesStrip 카드
- 커뮤니티 Notes 탭 공유 노트 카드 → `/notes/sn-...`
- 알림 클릭 (일부)

---

## 노트 소스 — 2가지

```ts
const data = useMemo(() => {
  /* shared note pool 우선 — 'sn-' prefix */
  const shared = getSharedNote(noteId);
  if (shared) {
    return { kind: 'shared', ... mineEditable: false }
  }
  const mine = getTastingNoteById(noteId);
  if (mine) {
    return { kind: 'mine', ... mineEditable: mine.userId === user.id }
  }
  return null;   // 못 찾음
}, [noteId, user]);
```

| Kind | ID Prefix | Edit 버튼 | 작성자 |
|---|---|---|---|
| **mine** | `note_xxx` | O (mineEditable && kind==='mine') | `user.displayName` |
| **shared** | `sn-xxx` | X | `shared.authorName` (LocalizedString) |

---

## 페이지 구성 (위→아래)

`<main>` (실제 wrapper는 `<div className="wm-scroll-area">`). 섹션이 풍부함.

### 1. BackHeader + 액션

- title `{ko: '테이스팅 노트', en: 'Tasting note'}`
- **mine + mineEditable**:
  - `<Pencil size={18}>` Edit 버튼 → `/notes/new/write?from=newEntry&wineId={wineId}&edit=1&noteId={noteId}`
  - `<Share2 size={18}>` Share 버튼 → PlaceholderToast
- **shared**: Share 버튼만 → PlaceholderToast

### 2. 와인 헤더 (Hero)

- `notePhotoUrl` 있으면 사진 배경, 없으면 라디얼 그라데이션 (`wine.bottleColor`)
- `<Link href={`/wine/${wineId}`}>` — 헤더 자체 클릭 시 와인 상세 진입
- 와인명 (Playfair 큰 글씨) + 생산자 + 빈티지 + 지역

### 3. 작성자 + 메타 카드

- 좌측 레벨 그라데이션 아바타 (LEVEL_COLORS 기반)
- 작성자 닉네임 (LocalizedString)
- LevelPill (L1~L5)
- 작성일 (LocalizedDate `dateStr = data.tastedAt.slice(0, 10)`)
- /100점 (큰 Playfair 숫자)
- 가격 (mine only, `data.note.priceKrw` 있을 때 `₩{N}`)
- 사용된 템플릿 배지 (`template?.title` 또는 `builtin-beginner`/`builtin-expert`)

### 4. 메모 본문 — Playfair italic 18px

### 5. **Beginner 모드** 차원 카드

- WSET 4축 미니 그리드 (단맛·산도·바디·타닌, 각 5칸 progress)
- 별점 (WMGlassRating)
- 메모 (LocalizedString)
- 시음 온도 `servingTempCelsius` (있을 때)

### 6. **Expert 모드** 차원 카드들

다음 카드들이 expert 모드 필드 유무에 따라 조건부 마운트:

- **WSET 차원** — 5축 미니 그리드 (sweet, acidity, body, alcohol, tannin)
- **구조** — 향 강도 + 풍미 강도 + 타닌 텍스처 + 숙성도 + 마무리 길이 (`TANNIN_TEXTURE_LABELS`, `FINISH_LENGTH_LABELS`)
- **풍미 노트** (flavorNotes) — 자유 입력 텍스트
- **버블** (sparkling 전용) — 거품 크기·지속성·무스·제조 방식·도사주
- **여운·온도** — caudalies (1~30초) + `servingTempCelsius`
- **아로마** — 카테고리별 chips 그룹 (Cherry/Citrus/Apple/Flower2/Flame/Candy/Sprout/Wheat lucide 아이콘) — `AROMA_CATEGORIES`, `AROMA_LEXICON` 매핑
- **OpeningTimeline (readOnly variant)** — 오픈 시각 / 디캔팅 분 / peak 도달 / 체크포인트 리스트
- **음용 적기 추정** — 절정 연도·신뢰도·메모 (`peakEta`)
- **결함** — 선택된 결함 리스트 (`FAULTS` 매핑)
- **재구매 의향** — `네, 다시 살 거예요 / Yes, I'd buy it again` 또는 `이번엔 한 번이면 충분 / Once was enough`

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| BackHeader Edit (mine) | 클릭 | `/notes/new/write?from=newEntry&wineId={id}&edit=1&noteId={id}` |
| BackHeader Share | 클릭 | PlaceholderToast |
| 와인 헤더 | 클릭 | `/wine/{wineId}` |
| 작성자 아바타/닉네임 (shared) | 클릭 | `/profile/{authorUserId}` (있다면) |
| 아로마 칩 | 탭 | 현재 readOnly (action 없음) |

---

## 상태 관리

| 상태 | 종류 | 출처 |
|---|---|---|
| `data` | useMemo | shared 또는 mine 노트 + wine + author + template 머지 |
| `noteId` | URL param | `use(params)` |
| `user` | mock | `useMockUser()` |
| `locale` | context | `useLocale()` |

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getSharedNote(noteId)` | `sn-` prefix 우선 검사 |
| `getTastingNoteById(noteId)` | `note_` prefix mine 노트 |
| `getWine(wineId)` | wine 정보 |
| `getTemplateById(templateId)` | 양식 정보 (builtin 또는 custom) |
| `resolveUser(authorUserId)` | shared 노트 작성자 |
| `BUILTIN_BEGINNER_ID`, `BUILTIN_EXPERT_ID` | template 분기 |
| **lexicon**: `AROMA_CATEGORIES`, `AROMA_LEXICON`, `FAULTS`, `FINISH_LENGTH_LABELS`, `TANNIN_TEXTURE_LABELS` | 라벨 lookup |

---

## i18n 키 prefix

- 페이지: BackHeader title 인라인 `{ko, en}`, "노트를 찾을 수 없어요" 인라인
- lexicon 라벨: 각 entry가 `{ko, en}` shape

---

## 빈/오류 상태

- **data === null**: "노트를 찾을 수 없어요 / Note not found" 인라인 32px padding muted text
- **wine === null**: 동일 빈 페이지 처리
- **expertFields / beginnerFields null**: 해당 차원 카드 안 렌더 (조건부)

---

## 디자인 토큰 / 스타일

- 메모 본문: Playfair italic 18px
- 차원 카드: Surface + default border + rounded
- 아로마 칩: 카테고리별 lucide 아이콘 (이모지 절대 금지 규칙)
- LEVEL_COLORS 기반 아바타 그라데이션
