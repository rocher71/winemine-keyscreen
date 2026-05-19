# winemine-keyscreen — 인계 문서

> 새 환경(또는 새 세션)에서 이 레포로 들어와 작업을 이어갈 때 30초 안에 컨텍스트를 잡기 위한 문서.

---

## 1. 한눈에

- **무엇:** winemine 앱의 **키스크린 클릭형 시안**. Phase 2 프로토타입.
- **어떻게:** Next.js 15 + Tailwind v4 + iPhone 390×844 목업 안에서 모든 라우트가 동작
- **목적:** 33개 화면을 실제로 클릭해보며 "이 기능 넣을지 뺄지" 결정하는 시각적 의사결정 도구
- **현재 단계:** 디자인 개선 + 커뮤니티 섹션 + 폰트 교체 완료, main 반영 (2026-05-13)
- **백엔드/DB/인증:** 없음. 모든 데이터는 `src/lib/mock/*.ts` 하드코딩

---

## 2. 빠른 시작

```bash
git clone https://github.com/team-skyjs/winemine-keyscreen.git
cd winemine-keyscreen
npm install
npm run dev     # http://localhost:3000
```

> **데스크톱 ≥1280px 권장** — 좌측 DemoControls(모드 토글), 우측 FeatureFlagPanel(dim 토글)이 나타남.

### node_modules 문제 발생 시 (파일 손상 오류)

```bash
rm -rf node_modules package-lock.json
npm install
```

### URL 파라미터로 즉시 모드 전환

```
?demo=heavy&exp=expert&locale=ko        # 헤비 유저 · 전문가 · 한국어
?demo=first-time&exp=beginner&locale=en # 신규 · 입문자 · 영어
```

---

## 3. 진실 소스 (어디 보면 다 있나)

| 파일 | 내용 |
|---|---|
| `WINEMINE_KEYSCREEN_SPEC.md` | 2500줄 스펙 — 라우트·Context·베타 피드백·디자인 시스템·통합 테스트 시나리오 |
| `FEATURES.md` | 현재 구현된 기능 상세 목록 (라우트 33개 기준) |
| `README.md` | 프로젝트 개요, 기술 스택, 라우트 구성, 커밋 히스토리 |
| `docs/design-system/` | 색상·타이포·컴포넌트 디자인 시스템 (`README.md` · `colors.md` · `typography.md` · `components.md`) |
| `docs/tasting-note-app-handover.md` | 테이스팅 노트 시스템 9개 컴포넌트 시그니처 |
| `data/raw/2026-05-12_review.md` | 1차 베타 사용자 피드백 |
| `CLAUDE.md` | 프로젝트 컨벤션 + 하네스 포인터 + 변경 이력 |
| `_workspace/*.md` (gitignore) | 하네스 각 Phase 보고서 — 작업 산출물 추적용 |

---

## 4. 디렉토리 트리

```
winemine-keyscreen/
├── src/
│   ├── app/                    ← 33 라우트
│   │   ├── page.tsx            (홈 — heavy/first-time 분기)
│   │   ├── onboarding/         (4 step)
│   │   ├── cellar/, cellar/[id]/
│   │   ├── map/
│   │   ├── wine/[id]/          + prices/ + story/ + community-peak/
│   │   ├── community/          + discover/ + tonight/ + new/ + [postId]/comments/
│   │   ├── profile/, profile/[userId]/, profile/ranking/
│   │   ├── settings/           + language/ + experience/ + notifications/
│   │   ├── notifications/, favorites/, badges/, photos/
│   │   ├── glossary/, glossary/[term]/
│   │   ├── capture/
│   │   └── notes/new/, notes/new/write/
│   ├── components/
│   │   ├── device-frame/       (iPhone 390×844 외관)
│   │   ├── nav/                (BottomNav, AppHeader, BackHeader)
│   │   ├── shared/             (Toast, BottomSheet, Modal, WMBottle, WMGlassRating, ...)
│   │   ├── tasting-note/       (16 컴포넌트)
│   │   ├── wine-detail/        (PriceChart, ExternalRatings, WriteNoteCta, ...)
│   │   ├── community/          (CommFeedCard, PostTypeBadge, CommUserAvatar, ...)
│   │   ├── wine-story/, community-drink-window/
│   │   ├── home/, cellar/, map/, profile/, settings/, notifications/, photos/, glossary/
│   │   ├── demo-controls/      (데스크톱 좌, 모드 토글)
│   │   └── feature-flag-panel/ (데스크톱 우, planned/considering/dropped)
│   ├── context/                (4 Context: AppMode, Experience, Locale, Favorites)
│   ├── hooks/
│   ├── lib/
│   │   ├── mock/               (17 fixture: wines, users, cellar, notes, community-posts, ...)
│   │   ├── tasting-note-lexicon.ts  (1082줄, 수정 금지)
│   │   ├── xp.ts, drink-window.ts, compatibility.ts
│   │   ├── regional-aromas.ts, community-peak-aggregator.ts
│   │   └── recommended-wines.ts
│   └── types/
├── messages/                   (ko.json + en.json — 키 양쪽 동기)
├── public/                     (world-110m.json, logo.png, ...)
├── i18n/request.ts             (next-intl 설정)
├── .claude/
│   ├── agents/                 (7 에이전트 정의)
│   └── skills/                 (8 스킬)
├── docs/                       (handover docs)
└── styles/tokens.css           (CSS 변수)
```

---

## 5. 모드 시스템 (3 토글 × 2 옵션 = 8 조합)

| Context | 옵션 | 효과 |
|---|---|---|
| `AppModeContext` | `first-time` / `heavy` | mock 사용자 swap. heavy = 87병 시음/셀러 32병/노트 64건/L4 골드 |
| `ExperienceContext` | `beginner` / `expert` | 노트 작성 UI 분기. beginner = 단순 7-step, expert = WSET SAT 풀 흐름 |
| `LocaleContext` | `ko` / `en` | next-intl 로케일. **영어 모드에서 한글 노출 0건 strict** |

세 컨텍스트 모두 URL → localStorage → default 우선순위.

---

## 6. 핵심 컨벤션 (위반 시 QA 실패)

- ✅ 모든 사용자 노출 문자열 = `LocalizedString { ko: string; en: string }`
- ✅ 영어 모드 한글 누출 0건 → `grep -rE '[가-힯]' src/app src/components` 결과 0
- ✅ `messages/ko.json` ↔ `messages/en.json` 키 동기, 비대칭 0
- ✅ review-card에 `LevelPill` + `ReviewBadge` **동반 표시**
- ✅ `react-simple-maps`, `Recharts`는 `dynamic(() => ..., { ssr: false })`
- ✅ TypeScript strict, `any` 사용 0
- ✅ `lib/tasting-note-lexicon.ts` 수정 금지 (랜딩에서 검증된 1082줄)

---

## 7. 이번 세션 주요 변경 이력

| 커밋 | 내용 |
|------|------|
| `e1fd2b5` | 지도 렌더 안정화, react-simple-maps 타입 정의 |
| `94e2bb4` | **WMBottle** SVG 병 일러스트 + **WMGlassRating** 와인잔 평점 공유 컴포넌트 신규 |
| `a70ff83` | **AppHeader** 와인잔 로고마크 + "wine·mine" 워드마크, **BottomNav** FAB 골드 테두리 |
| `21713c6` | 홈 에디토리얼 인사말, **StatHero 3열 카드**, 세계지도 cameo, 피드 WMBottle·WMGlassRating 적용 |
| `45cfbc6` | 지도 **필터 바** (전체/마신/셀러/즐겨찾기), **CountryDetailPanel** WMBottle 적용 |
| `68e29ce` | 와인 상세 **WMBottle 히어로**, **WriteNoteCta** (노트 없을 때 CTA 카드) |
| `9cb403f` | 셀러 **마신 와인 탭** + 테이스팅 노트 **인라인 미리보기** (평점·아로마·WSET 차원) |
| `c6f8bfd` | 커뮤니티 섹션 **8 라우트** + 7 컴포넌트 전체 구현 |
| `da347dc` | 한글 폰트 Noto Sans KR → **Spoqa Han Sans Neo** 교체 |

---

## 8. 하네스 구성 (.claude/)

| 트리거 예시 | 호출되는 스킬 |
|---|---|
| "키스크린 다시 빌드" | winemine-build-orchestrator |
| "scaffold 재실행" / "패키지 버전 업데이트" | winemine-scaffold |
| "DeviceFrame 조정" / "BottomNav 색 변경" | winemine-foundation-shell |
| "mock 데이터 수정" / "와인 추가" | winemine-mock-fixtures |
| "AromaWheel 색 조정" / "전문가 노트 수정" | winemine-tasting-components |
| "홈 카드 순서 변경" / "설정 토글 추가" | winemine-page-routing |
| "가격 차트 색 변경" / "와이너리 스토리 추가" | winemine-wine-detail |
| "QA 다시 돌려" / "한글 누출 검사" | winemine-qa-checks |

---

## 9. 알려진 이슈 / 주의사항

- `.npmrc`에 `legacy-peer-deps=true` 영구 설정 (react-simple-maps + React 19 호환)
- Tailwind **v4.3.0** 사용 — `@theme` 블록으로 CSS 변수를 utility로 노출
- `npm i` 반복 실행 시 패키지 파일 손상 가능 → 문제 발생 시 `rm -rf node_modules package-lock.json && npm install`
- `_workspace/`는 gitignore — 하네스 산출물 (재빌드 시 새로 생성)
- 데모 상태(노트·XP·즐겨찾기)는 React Context 메모리 — 새로고침 시 리셋. 모드 토글 3종 + onboardingComplete만 localStorage 영속

---

## 10. 다음 세션 작업 재개 패턴

```bash
git pull origin main
npm install
npm run dev
```

이후 자연어 트리거:
- 명확한 부분 수정 → 해당 도메인 스킬 트리거 ("AromaWheel 수정해줘")
- 광범위 변경 → 오케스트레이터 트리거 ("키스크린 X 기능 추가해줘")
- 검증만 → QA 스킬 트리거 ("한글 누출 검사", "QA 다시 돌려")

---

## 11. 다음 단계 후보

1. **시각 검수** — 커뮤니티 피드 UX, Recharts 다크 Tooltip 가독성, BottomSheet 모바일 슬라이드
2. **베타 사용자 2차 검수** — 추가 피드백을 `data/raw/`에 적재
3. **추가 기능 결정** — FeatureFlagPanel의 dropped 항목 정리, 스펙 업데이트
4. **Phase 3 실제 개발 진입** — Supabase + 인증 + OCR + 푸시 (시안에서 합의된 기능만)
