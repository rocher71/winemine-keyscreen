---
name: winemine-tasting-components
description: winemine 키스크린의 테이스팅 노트 시스템 구축 스킬. docs/tasting-note-app-handover.md를 단일 진실 소스로 삼아 9개 재사용 컴포넌트(WSETSlider, AromaWheel, CaudalieMeter, FaultChecklist, OpeningTimeline, AutoDescription, BlindMode, TanninPanel, BubblePanel, BeginnerNote) + 4개 신규 컴포넌트(ServingTempInput, PeakEtaInput, RegionalAromaHints, SourcePicker) + 노트 작성 컨테이너 2개(note-write-beginner, note-write-expert)를 만든다. lib/tasting-note-lexicon.ts는 수정 없이 import. 다음 키워드에서 반드시 트리거: '테이스팅 노트 컴포넌트', 'AromaWheel 만들어', 'WSETSlider', 'CaudalieMeter', 'FaultChecklist', '오프닝 타임라인', '자동 묘사 박스', '블라인드 모드', '시음 온도 입력', 'Peak ETA', '지역 아로마 칩', '노트 작성 화면', '입문자 노트', '전문가 노트', 'handover doc 컴포넌트'. 후속 작업으로 'AromaWheel 휠 색 조정', 'OpeningTimeline 권장 디캔팅 수정'도 트리거.
---

# winemine-tasting-components — 테이스팅 노트 시스템

## 목적

랜딩 페이지에서 검증된 테이스팅 노트 시스템을 winemine 키스크린에 그대로 포팅 + 베타 피드백 4개 신규 컴포넌트 추가. `docs/tasting-note-app-handover.md`가 **유일한 진실 소스**다.

## Why handover doc을 정답으로?

랜딩에서 사용자 피드백을 받아 검증된 디자인이고, 1082줄 lexicon은 와인 도메인 전문가들의 lex/fault/impact compound 큐레이션이다. 임의로 단순화하면 도메인 신뢰도가 깨진다. 그대로 옮기되, 베타 피드백으로 명시된 4 항목(시음 온도, peak ETA, 지역 아로마, 용어 사전)만 추가.

## 작업 흐름

### Step 1 — handover doc §5 정독

`docs/tasting-note-app-handover.md` 511~526줄: 9개 컴포넌트의 props 시그니처. **정확히 그대로** 구현.

### Step 2 — 단순한 것부터

작성 순서 (의존도 + 단순도):

1. **WSETSlider** (117줄, handover §5.1)
   - props: `labelKey, value, onChange, labels, hint`
   - 5도트 슬라이더, 클릭 + 키보드 좌우 화살표
   - 활성 점은 Gold 발광
2. **FaultChecklist** (122줄, handover §5.4)
   - props: `selected, onToggle`
   - 11 카드, 각 cause/threshold/aroma 3줄
   - 자동 추론 금지 — 명시 클릭만
3. **TanninPanel / BubblePanel** (한 파일 257줄, handover §5.8)
   - 칩 그리드 + WSETSlider 조합
4. **CaudalieMeter** (199줄, handover §5.3)
   - props: `caudalies, onChange`
   - 220px 원형 progress ring + 중앙 숫자
   - `requestAnimationFrame`으로 1초당 1 카운트, 30초까지만 ring 진행
   - Tap to start → Tap to stop, Reset 별도
   - 우상단 (i) → GlossaryTooltip "caudalie"
5. **AutoDescription** (228줄, handover §5.6)
   - props: `variant, meta, aroma, palate, finish, rating, evolution, onCTA`
   - `useEffect` + 200ms debounce → `buildSentence()` 호출
   - DESCRIPTION_TEMPLATES (lexicon)에서 ko/en 양쪽 템플릿 사용
   - 골드 박스, Playfair italic 17px
6. **AromaWheel** (273줄, handover §5.2)
   - props: `variant, selected, onToggle`
   - 320×320 SVG, 12 wedge
   - 내부 state: `activeCat` (초기값 `'fruity'`), `hoveredLex` (툴팁용)
   - `AROMA_LEXICON.filter(l => l.appliesTo.includes(variant))` 양식별 어휘 필터
   - lex 칩 hover/tap → ImpactCompound 한 줄 설명 툴팁
7. **BlindMode** (270줄, handover §5.7)
   - props: `onCTA, correctAnswer?` (정답 외부 주입으로 변경)
   - 내부 state로 4 입력 (grape/region/vintage/price)
   - "정답 공개 (Reveal & Score)" 클릭 시 채점 (각 25점, 총 100점)
   - 등급 라벨 (rankMaster/rankAdvanced/rankEnthusiast/rankExploring/rankFinding)
8. **OpeningTimeline** (439줄, handover §5.5, **가장 복잡**)
   - props: `variant, meta, state, onOpenedAt, onDecant, onUpsert, onPeak`
   - 상단 컨트롤: 코르크 오픈 시각 picker + 디캔터 토글 + 라이브 타이머 chip
   - 가로 8 dot timeline (T0/15분/30분/1시간/2시간/3시간/4시간/4시간+)
   - 활성 timepoint 입력 카드 + Recommendation 카드 (`matchOpeningGuide` 활용) + SVG 라인 차트
   - `setInterval(1000)` 라이브 타이머, cleanup 필수 (`useEffect` return)
9. **BeginnerNote** (699줄, handover §5.9)
   - props: `variant, wineName, producer`
   - 내부 state로 모든 입력 (자체 단방향)
   - 7단계 흐름 (와인/인상/맛/향/여운/평점/메모)
   - 각 단계 tip 박스 (BeginnerNote 안에 인라인 + GlossaryTooltip)

### Step 3 — 4개 신규 컴포넌트 (베타 피드백)

10. **ServingTempInput** (Step 1 — Capture)
    - 슬라이더 4~22°C, 0.5°C step
    - 와인의 `servingTempCelsius` 권장 범위와 비교 → Gold/Wine Red 시각 피드백
    - 안 단계별 카피: 권장보다 4°C+ 차가움 → "너무 차가워요 / Too cold", 1~3°C 차가움 → "조금 차게 / Slightly cold", 범위 안 → "권장 범위 / In range", 1~3°C 따뜻함 → "조금 따뜻해요 / Slightly warm", 4°C+ → "너무 따뜻해요 / Too warm"
11. **PeakEtaInput** (Step 7 — Peak ETA & Rating)
    - 슬라이더: 현재 빈티지부터 +0~+20년
    - 확신도 라디오: low / medium / high
    - 한 줄 메모 (선택)
    - **L3+ 가드**: currentUser.levelId < 3이면 disabled + "더 마셔보고 다시 / Come back after more bottles"
    - 푸터: "다른 사용자들의 추정과 함께 와인 상세 페이지에 집계됩니다"
12. **RegionalAromaHints** (Step 2 — Aroma)
    - props: `wineMeta`
    - `lib/regional-aromas.ts`의 `getRegionalAromasForWine(wineMeta)` 호출
    - 시그니처 lex id 3~6개를 칩으로 노출 (LEX_BY_ID로 ko/en 라벨 매칭)
    - 칩 클릭 시 부모(note-write-expert)의 AromaWheel selected에 추가 → 시각적 활성
    - 헤더: "이 지역에서 자주 나타나는 향 / Typical for this region"
13. **SourcePicker** (라우트 /notes/new)
    - 2 큰 카드: "내 셀러에서" / "새 와인"
    - 셀러 카드는 cellar.ts 헬퍼로 cellarCount 표시. first-time이면 disabled.

### Step 4 — 컨테이너 컴포넌트

#### note-write-beginner.tsx
- `<BeginnerNote variant wineName producer />` 단독 마운트
- Blind 탭 비활성 (white로 fallback)
- 하단 가격 capture 토글 + 저장 버튼

#### note-write-expert.tsx
- variant tabs (White/Red/Sparkling/Blind)
- variant === 'blind' → `<BlindMode />` 단독
- 그 외 → Step 1~7 세로 흐름:
  - Step 1: WineMetaCard + ServingTempInput
  - Step 2: WSETSlider(intensity) + AromaWheel + RegionalAromaHints
  - Step 3: WSETSlider × 4 + (Red→TanninPanel | Sparkling→BubblePanel | White→none) + flavorIntensity + flavorNotes
  - Step 4: CaudalieMeter + FinishQuality 칩 + manual override
  - Step 5: FaultChecklist
  - Step 6: OpeningTimeline
  - Step 7: PeakEtaInput + Rating star + WouldBuyAgain toggle + AutoDescription
- 하단 가격 capture + 저장
- 저장 시 +XP 토스트 + Purchase/LabelPhoto/CommunityPeakEstimate mock에 추가 + 1초 후 `router.back()`

### Step 5 — i18n 키 export

신규 키 (`tastingNote.expert.servingTemp.*`, `tastingNote.expert.peakEta.*`, `regionalAromas.*`)를 `_workspace/C_tasting_note_i18n_keys.json`에 ko/en 양쪽 채워서 저장. page-builder가 흡수해 messages 파일에 추가.

## 컴포넌트 패턴 — controlled component

```tsx
// 부모 (note-write-expert.tsx):
const [state, dispatch] = useReducer(reducer, initialState);

<WSETSlider
  labelKey="tastingNote.dimensions.acidity"
  value={state.acidity}
  onChange={(v) => dispatch({ type: 'SET_ACIDITY', value: v })}
  labels={ACIDITY_LABELS}
/>
```

State shape는 handover doc §3.1을 따르되 신규 필드 추가:
- `servingTempCelsius: number | null`
- `peakEstimateYear: number | null`
- `peakEstimateConfidence: 'low' | 'medium' | 'high' | null`
- `peakEstimateNote: LocalizedString | null`

## Edge Cases

- **`setInterval` cleanup:** OpeningTimeline에서 페이지 이탈 시 `clearInterval` 안 하면 메모리 누수 + 라우트 변경 후 콘솔 에러. `useEffect` return 함수 필수.
- **AromaWheel `appliesTo` 누락:** 일부 lex에 `appliesTo` 필드가 없을 수 있음 → 모든 variant에 노출되도록 default `['white', 'red', 'sparkling', 'blind']`.
- **BlindMode 정답 없음:** correctAnswer prop이 없으면 "Reveal & Score" 비활성 + "정답 데이터 없음" 시안 안내.
- **PeakEtaInput L3 검사:** mock에서 currentUserHeavy.levelId가 3이므로 활성. first-time(L1)은 disabled.
- **RegionalAromas의 lex id가 lexicon에 없음:** 콘솔 경고 + skip (해당 칩 표시 X).

## 스킬 종료 조건

- 9개 재사용 + 4개 신규 = 13개 컴포넌트 + 2개 컨테이너 + 1개 SourcePicker 작성 완료
- 모든 컴포넌트가 handover doc §5 props 시그니처 일치 (QA 에이전트가 검증)
- TypeScript strict 통과
- `_workspace/C_tasting_note_report.md` 작성 (시그니처 매핑 표, reducer state, 누락 lex id 등)
- `_workspace/C_tasting_note_i18n_keys.json` 신규 키 export
