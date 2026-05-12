# winemine-keyscreen — 인계 문서

> 새 환경(또는 새 세션)에서 이 레포로 들어와 작업을 이어갈 때 30초 안에 컨텍스트를 잡기 위한 문서.

---

## 1. 한눈에

- **무엇:** winemine 앱의 **키스크린 클릭형 시안**. Phase 2 프로토타입.
- **어떻게:** Next.js 15 + Tailwind v4 + iPhone 390×844 목업 안에서 모든 라우트가 동작
- **목적:** 22+ 화면을 실제로 클릭해보며 "이 기능 넣을지 뺄지" 결정하는 시각적 의사결정 도구
- **현재 단계:** Phase A~D 모두 완료, main 푸시 완료 (커밋 `d5a6974`, 2026-05-13)
- **백엔드/DB/인증:** 없음. 모든 데이터는 `src/lib/mock/*.ts` 하드코딩

---

## 2. 빠른 시작

```bash
git clone https://github.com/team-skyjs/winemine-keyscreen.git
cd winemine-keyscreen
npm install     # .npmrc에 legacy-peer-deps=true 자동 적용
npm run dev     # http://localhost:3000
```

**데스크톱 ≥1280px 권장** — 좌측에 DemoControls(모드 토글), 우측에 FeatureFlagPanel(컴포넌트 dim 토글)이 나타남.

### URL 파라미터로 즉시 모드 전환

```
?demo=heavy&exp=expert&locale=ko       # 헤비 유저 · 전문가 · 한국어
?demo=first-time&exp=beginner&locale=en # 신규 · 입문자 · 영어
```

---

## 3. 진실 소스 (어디 보면 다 있나)

| 파일 | 내용 |
|---|---|
| `WINEMINE_KEYSCREEN_SPEC.md` | 2500줄 스펙 — 22 라우트 · 4 Context · 7 베타 피드백 · 디자인 시스템 · 통합 테스트 시나리오 20개 |
| `docs/tasting-note-app-handover.md` | 테이스팅 노트 시스템 9개 컴포넌트 시그니처 (랜딩에서 검증된 것) |
| `data/raw/2026-05-12_review.md` | 1차 베타 사용자 피드백 (와진사 + DC 와인갤러리 + 지인) |
| `CLAUDE.md` | 프로젝트 컨벤션 + 하네스 포인터 + 변경 이력 |
| `_workspace/*.md` (gitignore) | 하네스 각 Phase 보고서 (A/B/C/D) — 작업 산출물 추적용 |

---

## 4. 디렉토리 트리

```
winemine-keyscreen/
├── src/
│   ├── app/                  ← 24 라우트
│   │   ├── page.tsx          (홈 — heavy/first-time 분기)
│   │   ├── onboarding/       (4 step)
│   │   ├── cellar/, cellar/[id]/
│   │   ├── map/
│   │   ├── wine/[id]/        + prices/ + story/ + community-peak/
│   │   ├── profile/, profile/[userId]/
│   │   ├── settings/         + language/ + experience/ + notifications/
│   │   ├── notifications/, favorites/, badges/, photos/
│   │   ├── glossary/, glossary/[term]/
│   │   ├── capture/
│   │   └── notes/new/, notes/new/write/
│   ├── components/
│   │   ├── device-frame/     (iPhone 390×844 외관)
│   │   ├── nav/              (BottomNav, AppHeader, BackHeader)
│   │   ├── shared/           (Toast, BottomSheet, Modal, LocaleText, LevelPill, ReviewBadge)
│   │   ├── tasting-note/     (16 컴포넌트 — handover doc 기반 9 + 신규 4 + 컨테이너 2 + source-picker)
│   │   ├── wine-detail/      (PriceChart Recharts + ExternalRatings + review-card)
│   │   ├── wine-story/, community-drink-window/
│   │   ├── home/, cellar/, map/, profile/, settings/, notifications/, photos/, glossary/
│   │   ├── demo-controls/    (데스크톱 좌, 모드 토글)
│   │   └── feature-flag-panel/ (데스크톱 우, planned/considering/dropped)
│   ├── context/              (4 Context: AppMode, Experience, Locale, Favorites)
│   ├── hooks/
│   ├── lib/
│   │   ├── mock/             (16 fixture)
│   │   ├── tasting-note-lexicon.ts  (1082줄, 수정 금지)
│   │   ├── xp.ts, drink-window.ts, compatibility.ts
│   │   ├── regional-aromas.ts, community-peak-aggregator.ts
│   │   └── recommended-wines.ts (랜딩에서 가져온 8종)
│   └── types/
├── messages/                 (ko.json + en.json — 537키 양쪽 동기)
├── public/                   (world-110m.json, logo.png, ...)
├── i18n/request.ts           (next-intl 설정)
├── .claude/
│   ├── agents/               (7 에이전트 정의)
│   └── skills/               (8 스킬 — 1 오케스트레이터 + 7 도메인)
├── docs/                     (handover docs)
└── styles/tokens.css         (CSS 변수)
```

---

## 5. 모드 시스템 (3 토글 × 2 옵션 = 8 조합)

| Context | 옵션 | 효과 |
|---|---|---|
| `AppModeContext` | `first-time` / `heavy` | mock 사용자 swap. heavy = 32병/28셀러/47노트/L3, first-time = 0/0/0/L1 |
| `ExperienceContext` | `beginner` / `expert` | 노트 작성 UI 분기. beginner = 7-step 단순화, expert = WSET SAT 풀 흐름 |
| `LocaleContext` | `ko` / `en` | next-intl 로케일. **영어 모드에서 한글 노출 0건 strict** |

세 컨텍스트 모두 URL → localStorage → default 우선순위.

---

## 6. 핵심 컨벤션 (위반 시 QA 실패)

- ✅ 모든 사용자 노출 문자열 = `LocalizedString { ko: string; en: string }`
- ✅ 영어 모드 한글 누출 0건 → `grep -rE '[가-힯]' src/app src/components` 결과 0 (LocalizedString의 ko 필드와 코드 주석은 예외)
- ✅ `messages/ko.json` ↔ `messages/en.json` 키 동기, 비대칭 0
- ✅ review-card에 `LevelPill` + `ReviewBadge` **동반 표시** (한쪽만 X)
- ✅ `react-simple-maps`, `Recharts`는 `dynamic(() => ..., { ssr: false })`
- ✅ TypeScript strict, `any` 사용 0
- ✅ `lib/tasting-note-lexicon.ts` 수정 금지 (랜딩에서 검증된 1082줄)

---

## 7. 하네스 구성 (.claude/)

7 에이전트 + 8 스킬로 단계 구축. 다음 세션에서 자연어 트리거로 작동:

| 트리거 예시 | 호출되는 스킬 |
|---|---|
| "키스크린 다시 빌드" / "특정 페이지만 다시" | winemine-build-orchestrator (Phase 0에서 _workspace 확인 후 분기) |
| "Next.js 패키지 버전 업데이트" / "scaffold 재실행" | winemine-scaffold |
| "DeviceFrame 베젤 조정" / "BottomNav 활성색 변경" | winemine-foundation-shell |
| "신규 와인 추가" / "mock 데이터 정합 수정" | winemine-mock-fixtures |
| "AromaWheel 휠 색 조정" / "전문가 노트 단계 추가" | winemine-tasting-components |
| "홈 카드 순서 변경" / "설정에 토글 추가" | winemine-page-routing |
| "가격 차트 색 변경" / "와이너리 스토리 추가" | winemine-wine-detail |
| "QA 다시 돌려" / "한글 누출 검사" | winemine-qa-checks |

전체 재빌드는 winemine-build-orchestrator가 Phase A→B→C→D 순으로 진행. 부분 수정은 해당 스킬 직접 호출.

---

## 8. 11항목 + 7 베타 피드백 매핑

| # | 사용자 요구사항 | 구현 진입점 |
|---|---|---|
| 1 | 다중 화면 + BottomNav | 24 라우트, `src/components/nav/bottom-nav.tsx` |
| 2 | 한/영 토글 + 영어 모드 한글 0 | `/settings/language`, `LocaleContext`, next-intl |
| 3 | first-time / heavy 토글 | `DemoControls` + `AppModeContext` |
| 4 | 온보딩 + 입문자/전문가 → 노트 분기 | `/onboarding`, `note-write-beginner.tsx`, `note-write-expert.tsx` |
| 5 | XP/레벨/뱃지 + 커뮤니티 노출 | `xp.ts`, `mock/badges.ts`, `LevelPill` + `ReviewBadge` |
| 6 | 타 유저: 지도+와인+취향 % | `/profile/[userId]`, `taste-compatibility-card.tsx` |
| 7 | 셀러 트래커 + 음용 시점 + 알림 | `/cellar`, `drink-window-badge.tsx`, `notifyAtPeak` |
| 8 | 노트 — 셀러/새 와인 선택 | `/notes/new`, `source-picker.tsx` |
| 9 | "이 와인 마시기" → 노트 | `drink-this-button.tsx` → `?from=cellar&itemId=...` |
| 10 | 가격 그래프 + 매장 상세 | `price-chart.tsx`, `/wine/[id]/prices` |
| 11 | 즐겨찾기 + 푸시 알림 | `FavoritesContext`, DemoControls 푸시 시뮬, `/notifications` |

| 베타 피드백 | 구현 위치 |
|---|---|
| 시음 온도 (DC) | `serving-temp-input.tsx` Step 1 |
| Peak ETA 커뮤니티 집계 (와진사) | `peak-eta-input.tsx` Step 7 + `community-peak-aggregator.ts` |
| 와이너리 스토리 (와진사) | `wine-story-card.tsx` + `/wine/[id]/story` |
| 지역 시그니처 아로마 (와진사) | `regional-aroma-hints.tsx` + `regional-aromas.ts` |
| 외부 평점 (DC) | `external-ratings-card.tsx` Vivino/WS/CT |
| 라벨 사진 갤러리 (지인) | `/photos` + `mock/label-photos.ts` |
| 용어 사전 (DC "카우달리가 뭐예요") | `glossary-tooltip.tsx` + `/glossary` |

---

## 9. 알려진 이슈 / 주의사항

- `.npmrc`에 `legacy-peer-deps=true` 영구 설정 (react-simple-maps + React 19 호환)
- Tailwind **v4.3.0** 정식 사용 — `@theme` 블록으로 CSS 변수를 utility로 노출
- next-intl@3.26.5의 `experimental.turbo` deprecation 경고 (무영향)
- `_workspace/`는 gitignore — 하네스 산출물, 시안 진행 보고서 (재빌드 시 새로 생성됨)
- `data/raw/`도 gitignore — 베타 피드백 raw (필요 시 사용자가 직접 push)
- 데모 상태 가변 (노트 작성·XP 적립·즐겨찾기)은 React Context 메모리 — 새로고침 시 리셋. 모드 토글 3종과 onboardingComplete만 localStorage 영속

---

## 10. 다음 세션 작업 재개 패턴

```bash
git pull origin main
npm install
npm run dev
```

이후 자연어 트리거:
- 변경하고 싶은 부분이 명확 → 해당 도메인 스킬 트리거 ("AromaWheel 수정해줘")
- 광범위 변경 → 오케스트레이터 트리거 ("키스크린 X 기능 추가해줘")
- 검증만 → QA 스킬 트리거 ("한글 누출 검사", "QA 다시 돌려")

수동 검증 도구:
```bash
bash .claude/skills/winemine-qa-checks/scripts/check-i18n.sh   # i18n 정합성
bash .claude/skills/winemine-qa-checks/scripts/check-routes.sh # 라우트 정합성
npx tsc --noEmit                                                # 타입
npm run build                                                   # 빌드
```

---

## 11. 다음 단계 후보 (시안 검수 시작점)

1. **시각 검수** — DemoControls/FeatureFlagPanel 데스크톱 동작, Recharts 다크 Tooltip 가독성, BottomSheet 모바일 슬라이드, 페이지 진입 stagger 애니메이션
2. **베타 사용자 2차 검수** — 시안 받아본 사용자들의 추가 피드백을 `data/raw/`에 적재
3. **추가 기능 결정** — FeatureFlagPanel의 dropped로 표시된 항목들을 정리, 스펙 update
4. **Phase 3 실제 개발 진입** — Supabase + 인증 + OCR + 푸시 (시안에서 합의된 기능만)

문의·피드백은 변경 이력과 함께 `CLAUDE.md`의 변경 이력 테이블에 기록.
