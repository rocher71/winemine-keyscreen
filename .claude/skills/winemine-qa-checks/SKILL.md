---
name: winemine-qa-checks
description: winemine 키스크린 빌드의 통합 정합성을 검증하는 QA 스킬. 단순 파일 존재 확인이 아니라 경계면 교차 비교(i18n 키 ↔ messages, mock LocalizedString shape, handover doc 컴포넌트 시그니처, 22 라우트 dead link, 베타 피드백 7항목 반영, 영어 모드 한글 누출 등)를 수행. 발견된 문제는 actionable한 형태로 담당 에이전트별 분류해서 보고. 다음 키워드/상황에서 반드시 트리거: 'QA 검증', '통합 정합성 확인', '한글 누출 검사', '라우트 dead link', 'i18n 키 검증', '베타 피드백 반영 확인', 'handover doc 시그니처 검사', '빌드 후 검증'. 마일스톤 단위로 incremental 실행 — 'Foundation QA', 'Tasting note QA', 'Final QA' 같은 후속 트리거도 받음.
---

# winemine-qa-checks — 통합 정합성 검증

## 목적

빌드된 코드와 스펙/handover doc 사이의 정합성을 경계면 교차 비교로 검증. 단일 파일 안의 정확성보다 **시스템 통합 정확성**에 집중.

## Why 경계면 교차?

빌드 통과해도 i18n 키와 messages가 불일치하면 런타임에서 키 자체가 노출된다. 페이지가 호출하는 헬퍼와 mock의 shape이 다르면 undefined 액세스로 깨진다. handover doc 컴포넌트 시그니처가 미묘하게 다르면 다른 페이지에서 import할 때 깨진다. 이런 경계면 버그는 단일 파일 리뷰로는 안 잡힌다.

## 검증 카테고리

8개 카테고리. 각각 자동 가능한 부분은 스크립트로, 시각 필요한 부분은 사용자 위임.

### 1. i18n 정합성 (자동)

- 사용된 t() 키 ↔ messages 정의 키 양방향 매칭
- messages/ko.json과 messages/en.json 키 구조 일치
- 영어 모드 한글 누출: `grep -rE '[가-힯]' src/` 결과 분석 (messages 디렉토리 + ko.* 필드 제외)
- mock LocalizedString의 en 필드에 한글 존재 여부

`scripts/check-i18n.sh`에 번들.

### 2. mock 데이터 정합성 (자동)

- currentUserHeavy stats가 mock 컬렉션 카운트와 일치
- wine.isoNumeric이 world-110m.json geo.id에 매칭 가능 (3자리 0패딩)
- community-peaks.reviewerLevel ∈ {3, 4, 5}
- regional-aromas의 lex id가 lexicon AROMA_LEXICON에 존재
- glossary 시드 12 entry 모두 존재

`scripts/check-mock.ts`에 번들.

### 3. 라우트 정합성 (자동)

- 스펙 route_definitions 22개 라우트가 app/ 트리에 모두 존재
- 모든 라우트가 BackHeader 또는 AppHeader 하나만 마운트
- BottomNav whitelist (숨김 라우트) 일관성

`scripts/check-routes.sh`에 번들.

### 4. handover doc 컴포넌트 시그니처 (반자동)

`docs/tasting-note-app-handover.md` §5에서 정의된 9개 컴포넌트의 props를 추출, 실제 `src/components/tasting-note/*.tsx`에서 추출한 props와 비교. 정확한 매칭은 reference 파일로 안내, 사용자에게 결과만 보고.

| 컴포넌트 | 필수 props |
|---|---|
| WSETSlider | labelKey, value, onChange, labels, hint? |
| AromaWheel | variant, selected, onToggle |
| CaudalieMeter | caudalies, onChange |
| FaultChecklist | selected, onToggle |
| OpeningTimeline | variant, meta, state, onOpenedAt, onDecant, onUpsert, onPeak |
| AutoDescription | variant, meta, aroma, palate, finish, rating, evolution, onCTA |
| BlindMode | onCTA, correctAnswer? |
| TanninPanel | state, onChange |
| BubblePanel | bubbles, dosage, onBubbles, onDosage |
| BeginnerNote | variant, wineName, producer |

### 5. 베타 피드백 반영 (반자동)

7항목 모두 코드에 존재 + 동작:
- [ ] ServingTempInput 마운트 + 권장 범위 비교 동작
- [ ] PeakEtaInput L3+ 가드 동작
- [ ] WineStoryCard + /wine/[id]/story 라우트
- [ ] RegionalAromaHints 칩 노출
- [ ] ExternalRatingsCard Vivino/WS/CT 표시
- [ ] /photos 그리드 작동
- [ ] /glossary 12 entry + GlossaryTooltip 최소 5곳 사용

### 6. 컴포넌트 노출 규칙 (자동)

LevelPill과 ReviewBadge가 모든 review-card, community-peak reviewer에서 동반 표시:
```bash
grep -l 'ReviewCard\|review-card' src/components | xargs grep -L 'LevelPill\|ReviewBadge'
# 결과 0이어야 함 (둘 다 import 안 한 카드는 위반)
```

### 7. 빌드/런타임 (자동)

- `npm run build` exit 0 + 경고 0
- TypeScript: `npx tsc --noEmit` exit 0
- 콘솔 hydration mismatch 경고: dev 서버 시작 후 한 페이지 진입 → 콘솔 로그 검사

### 8. 모드 토글 (반자동)

URL `?demo=heavy&exp=expert&locale=en` 직접 접근 → 즉시 반영. 새로고침 시 유지. 자동 검증은 mock-data-architect의 useMockUser 훅과 컨텍스트 코드 비교, 시각 검증은 사용자 위임.

## 보고 형식

`_workspace/D_qa_report.md`:

```markdown
# QA Report — {milestone}

## ✅ Passed (X/Y)
- i18n 정합성: 247/247 키 매칭, 0 누락
- ...

## ❌ Failed (N)

### Issue 1: messages/en.json `cellar.empty.body` 한글 누출
- **위치:** messages/en.json:42
- **현재:** "아직 와인이 없어요"
- **예상:** "No wines yet"
- **담당:** page-builder
- **재현:** `grep -E '[가-힯]' messages/en.json`

### Issue 2: ServingTempInput onChange 누락
- **위치:** src/components/tasting-note/serving-temp-input.tsx
- **현재:** props 인터페이스에 onChange 없음
- **예상:** handover doc 패턴대로 controlled component
- **담당:** tasting-note-engineer

## 🔍 Manual Verification Needed (M)
- DemoControls URL 동기화 — 데스크톱에서 직접 확인 필요
- Recharts 다크 Tooltip 가독성 — 시각 검수

## 다음 액션
1. page-builder 재호출: i18n 누락 키 N개 수정
2. tasting-note-engineer 재호출: ServingTempInput props 수정
3. 위 수정 후 QA 재실행
```

## 점진적 QA 패턴

마일스톤 단위로 검증:
- **Foundation QA** (Phase B 후): 카테고리 1, 2, 7 위주
- **Tasting note QA** (Phase C 중간): 카테고리 4 위주
- **Final QA** (Phase D): 모든 카테고리

각 QA 후 발견된 문제는 해당 에이전트 재호출로 수정, QA 재실행.

## Edge Cases

- **빌드 실패 시:** 정확한 파일+라인 보고. 가능하면 가장 가까운 담당 에이전트 식별.
- **한글 정규식 false positive:** 와인명에 한글 음차 ("샤또 마고")가 있을 수 있음 → ko 필드 또는 LocalizedString의 ko 키 안에서는 허용.
- **검증 스크립트 자체 오류:** 검증 누락으로 보고 + 사용자 확인 요청.

## 스킬 종료 조건

- 8 카테고리 모두 검증 완료
- `_workspace/D_qa_report.md` 작성
- 실패 항목별 담당 에이전트 + actionable 수정 지침 명시
