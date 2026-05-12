<project_specification>

<project_name>winemine Keyscreen Mockup — Multi-Screen iPhone Prototype for Feature Decision</project_name>

<overview>
winemine은 와인 라벨을 촬영하면 AI가 인식하고, 마신 와인을 세계 지도 위에 시각화하며, 셀러(보관 와인)·테이스팅 노트·가격 추적·커뮤니티까지 아우르는 모바일 앱이다. 이 레포(`winemine-keyscreen`)는 그 앱의 **클릭 가능한 다중 화면 시안**을 만드는 작업이다. Phase 2 의사결정용으로, 바텀 내비게이션을 통해 연결되는 모든 주요 화면을 실제로 탐색 가능한 형태로 구현해 "어떤 기능을 앱에 넣고 어떤 기능을 뺄지" 시각적으로 비교·합의할 수 있게 한다.

이 시안은 데스크톱 브라우저에서 열리지만 **항상 iPhone 390×844 목업 프레임 내부에 렌더링된다**. 데스크톱에서는 페이지 중앙에 정지된 디바이스 프레임이 떠 있고, 그 내부의 라우트만 전환된다. 모바일 viewport에서는 프레임이 사라지고 전체화면으로 동작한다. 모든 화면은 실제로 라우팅 가능하며 (`/`, `/cellar`, `/wine/[id]`, `/profile/[userId]` 등), 모든 데이터는 `src/lib/mock/`의 하드코딩된 fixture에서 가져온다. 백엔드·DB·인증·실제 카메라·실제 푸시 알림은 일체 없다.

CRITICAL: 두 가지 데모 모드(`first-time` 신규 사용자 vs `heavy` 헤비 유저)와 두 가지 와인 지식 모드(`beginner` 입문자 vs `expert` 전문가)와 두 가지 언어(`ko` 한국어 vs `en` 영어)를 항상 토글로 전환 가능해야 한다. 모드 조합에 따라 같은 화면이 완전히 다른 데이터·레이아웃·용어로 표현된다. 모든 모드는 URL 검색 파라미터 또는 localStorage에 저장하며 새로고침에도 유지된다.

CRITICAL: 영어 설정(`locale=en`)에서는 화면 어느 곳에도 한국어 글자가 노출되어서는 안 된다. 한국어 설정에서는 와인 도메인 전문 용어(아펠라시옹, 카베르네 소비뇽 등)가 영어 또는 음차로 보조 표기되는 것은 허용된다. 모든 사용자 노출 문자열은 `messages/{ko,en}.json`을 통해 i18n 처리한다.

CRITICAL: 인증·DB·실제 API 호출 없음. 회원가입·로그인·OAuth 일체 구현하지 않는다. "로그인" 버튼은 클릭 시 placeholder 토스트로 응답. 알림·푸시도 mock으로만 표시. XP 적립, 레벨업, 가격 등록, 즐겨찾기 등은 모두 클라이언트 상태(localStorage 또는 URL 파라미터)로만 동작한다.

CRITICAL: 테이스팅 노트 시스템은 랜딩 페이지에서 이미 구현·검증된 자산을 그대로 가져온다. `docs/tasting-note-app-handover.md` (이 레포 안)에 명시된 4 레이어 (L1 lexicon, L2 9개 재사용 컴포넌트, L3 페이지 컨테이너, L4 i18n+아이콘) 중 L1·L2는 그대로 포팅. 새로 만들 것은 화면 컨테이너와 신규 피드백 반영 기능(아래 단락 참고)뿐.

CRITICAL: 1차 베타(2026-05-11) 사용자 피드백을 반영해 다음 기능을 시안에 포함한다 — (a) **시음 온도** 입력 (전문가 모드), (b) **사용자 추정 음용 적기**(peak ETA) 입력 + 커뮤니티 평균 집계 시각화, (c) **와이너리/생산자 스토리** 카드, (d) **지역·품종별 시그니처 아로마** 자동 추천 칩, (e) **외부 평점 연동** (Vivino, Wine Searcher, CellarTracker, 글로벌 평균가 — mock), (f) **라벨 사진 갤러리** (스캔한 라벨을 시간순/검색 가능), (g) **용어 사전(Glossary)** — 카우달리·잔당·아펠라시옹 등 도메인 용어 툴팁/페이지.
</overview>

<scope_boundaries>
  <in_scope>
    - 다중 라우트 시안 — 바텀 내비 5탭 + 각 탭의 deep screen들
    - iPhone 390×844 디바이스 프레임 안의 모든 화면 (데스크톱), 모바일에서는 풀스크린
    - i18n: 한국어/영어 토글 (next-intl 사용), 설정 화면에서 언어 변경 가능, 영어 모드에서 한국어 글자 노출 금지
    - 두 가지 사용자 데이터 모드: `first-time`(신규, 빈 셀러·기록 0개) vs `heavy`(헤비 유저, 200+ 와인·다국가·뱃지 보유)
    - 두 가지 와인 지식 모드: `beginner`(입문자) vs `expert`(전문가) — 테이스팅 노트 UI가 완전히 다르게 표시
    - 신규 사용자 온보딩 플로우 (언어 선택 → 와인 지식 수준 선택 → 환영 및 진입)
    - 5탭 바텀 내비: 홈 / 지도 / FAB(스캔/추가) / 셀러 / 프로필
    - 화면 인벤토리: 홈, 지도(드릴다운), 셀러 리스트, 셀러 와인 상세, 와인 상세(가격 그래프 + 와이너리 스토리 + 외부 평점 + 커뮤니티 음용 적기), 내 프로필, 타 유저 프로필(취향 비교 %), 설정, 알림 리스트, 테이스팅 노트 작성(입문자/전문가 분기, handover doc의 9개 컴포넌트 활용), 새 와인 셀러 등록 플로우, 즐겨찾기 리스트, 커뮤니티 리뷰 카드(뱃지 노출), 레벨/뱃지 진열장, 라벨 사진 갤러리, 용어 사전(Glossary)
    - 테이스팅 노트 시스템: handover doc 기준 9개 재사용 컴포넌트 (WSETSlider, AromaWheel, CaudalieMeter, FaultChecklist, OpeningTimeline, AutoDescription, BlindMode, TanninPanel, BubblePanel, BeginnerNote) + 기존 lexicon.ts 그대로
    - 베타 피드백 기반 신규 모듈: WineStoryCard, ExternalRatingsCard, CommunityDrinkWindowChart, ServingTempInput, RegionalAromaHints, LabelPhotoGrid, GlossaryTooltip
    - XP·레벨·뱃지 시스템 (5단계 레벨, 8종+ 뱃지) — 헤비 유저에는 사전 채워진 상태로 노출
    - 셀러 트래커 — 스캔 등록 + 권장 음용 시점 + 알림 예약 placeholder
    - 가격 추적 — 사용자 입력 가격이 와인 상세 페이지의 추이 그래프에 누적, 매장/지점별 상세
    - 즐겨찾기 + 푸시 알림 mock (특정 와인이 가격 등록될 때 "누군가가 ___ 와인을 구매했어요" 카드)
    - 모든 버튼은 시각적으로 동작 — 라우팅 가능한 deep screen은 실제로 이동, 아직 없는 기능은 placeholder 토스트
  </in_scope>
  <out_of_scope>
    - 실제 회원가입/로그인/OAuth/비밀번호 리셋
    - Supabase/DB/API 라우트/서버 액션
    - 실제 카메라 접근, OCR/AI 라벨 인식
    - 실제 푸시 알림 (브라우저 Notification API도 사용 안 함)
    - 실제 결제·구독·인앱 구매
    - 영어/한국어 외 추가 언어
    - 다크/라이트 테마 토글 (다크 단일)
    - 와인 추천 알고리즘 실 구현 (mock 추천만)
    - 와인 가격 데이터 수집/검증 (모든 가격은 시안용 mock)
    - 위치 기반 매장 검색
    - 와인 평점 평균 자동 집계 (mock 값 사용)
    - 실제 Vivino / Wine Searcher / CellarTracker API 호출 — 시안에서는 mock 점수만 노출
    - 실제 라벨 OCR로 사진을 와인 메타에 자동 매칭 — 시안에서 사진은 placeholder
    - 데이터 영속성 — localStorage에 모드 설정만 저장, 사용자 활동(노트 작성 등)은 새로고침 시 리셋
  </out_of_scope>
  <future_considerations>
    - 시안에서 합의된 기능들을 실제 라우트·DB로 구현 (Phase 3)
    - 인증 + Supabase Postgres + RLS (Phase 3)
    - 라벨 OCR + Claude Vision API 연동 (Phase 3)
    - Web Push / FCM 통합 (Phase 3)
    - 커뮤니티 피드·팔로우·좋아요 (Phase 4)
    - 와인 추천 ML 모델 (Phase 4)
  </future_considerations>
</scope_boundaries>

<technology_stack>
  <frontend_application>
    <framework>Next.js 15.x App Router (React 19)</framework>
    <language>TypeScript 5.7 strict mode</language>
    <build_tool>Turbopack (dev), Next.js default (prod)</build_tool>
    <styling>Tailwind CSS v4 (`@import "tailwindcss"`) + CSS 변수 토큰 (`styles/tokens.css`)</styling>
    <routing>App Router — 다중 라우트, DeviceFrame을 루트 레이아웃으로 사용</routing>
    <state_management>
      - 로컬 컴포넌트: `useState`
      - 페이지 간 공유 (locale, mode, level): `React Context` + `localStorage` 동기화
      - URL 파라미터로도 모드 토글 가능 (`?demo=heavy&exp=expert&locale=en`)
    </state_management>
  </frontend_application>
  <i18n>
    <library>next-intl v3.x — App Router 호환, 정적 메시지 로딩</library>
    <strategy>
      - locale prefix 없는 라우팅 (`/cellar` 단일 URL, locale은 컨텍스트로 전달)
      - 모든 사용자 노출 문자열은 `messages/{ko,en}.json` 키 참조 — 인라인 한국어 문자열 금지
      - 와인 데이터(`recommended-wines.ts`의 `country.ko`/`country.en`, `styleHint.ko`/`styleHint.en`)는 LocalizedString 패턴 유지
      - 신규 추가 mock 데이터(셀러, 노트, 매장, 뱃지 등)도 모두 LocalizedString 패턴으로 작성
    </strategy>
  </i18n>
  <data_layer>
    <note>CRITICAL: DB·네트워크 호출 일체 없음. 모든 데이터는 `src/lib/mock/*.ts`의 하드코딩된 fixture</note>
    <fixtures>
      - `mock/users.ts` — currentUserFirst, currentUserHeavy, otherUsers (3명)
      - `mock/wines.ts` — 와인 카탈로그 60종 (기존 recommended-wines + 확장)
      - `mock/cellar.ts` — currentUserHeavy의 셀러 항목 28개
      - `mock/tasting-notes.ts` — currentUserHeavy의 노트 47개
      - `mock/purchases.ts` — 와인별 가격 등록 이력 (12종 와인, 각 4~9건)
      - `mock/notifications.ts` — currentUserHeavy의 알림 12개
      - `mock/favorites.ts` — currentUserHeavy의 즐겨찾기 7개
      - `mock/badges.ts` — 뱃지 카탈로그 12종 + currentUserHeavy 보유 7개
      - `mock/levels.ts` — 5레벨 정의 + 임계 XP
      - `mock/reviews.ts` — 와인별 커뮤니티 리뷰 mock (뱃지·레벨 표시용)
      - `mock/stores.ts` — 매장/지점 mock 14개
    </fixtures>
  </data_layer>
  <libraries>
    <maps>react-simple-maps v3.0.0 — 미니/풀 월드맵 (SSR 불가, dynamic import 필수)</maps>
    <topojson>topojson-client v3.1.0 — 지도 데이터 파서</topojson>
    <motion>framer-motion v12.x — 페이지 전환, 카드 hover, 모달 시트, 토스트, 그래프 진입</motion>
    <icons>lucide-react v0.475+ — 아이콘 전반</icons>
    <i18n_lib>next-intl v3.x</i18n_lib>
    <charts>Recharts v2.15 — 가격 추이 그래프 (LineChart + 평균/추세선)</charts>
    <fonts>next/font — Playfair Display(영문 디스플레이), Inter(영문 본문), Noto Sans KR(한글)</fonts>
  </libraries>
  <build_output>
    <build_command>npm run build → `.next/`</build_command>
    <dev_command>npm run dev (Turbopack, http://localhost:3000)</dev_command>
  </build_output>
</technology_stack>

<prerequisites>
  <environment_setup>
    - Node.js 20.x 이상
    - npm 10.x 이상
    - 모던 브라우저 (Chrome/Safari 최신) — DevTools mobile emulation으로 검수
  </environment_setup>
  <build_configuration>
    - `tsconfig.json`: strict, target ES2022, moduleResolution bundler, paths `@/*` → `src/*`
    - `next.config.ts`: 기본값, reactStrictMode true, `experimental.serverActions` 미사용
    - Tailwind v4: `@import "tailwindcss"` + `@theme` 블록에서 CSS 변수를 utility로 노출
    - `app/globals.css`에서 `styles/tokens.css` import
    - `next-intl` 설정: `i18n/request.ts`에서 동적 로케일 메시지 로딩
  </build_configuration>
</prerequisites>

<environment_variables>
  <note>환경 변수 없음. `.env` 파일 만들지 말 것. 모드 토글은 URL 파라미터 + localStorage로 처리.</note>
</environment_variables>

<file_structure>
winemine-keyscreen/
├── CLAUDE.md                          # (이미 존재)
├── DESIGN_SYSTEM.md                   # (이미 존재)
├── WINEMINE_KEYSCREEN_SPEC.md         # 이 스펙
├── README.md
├── next.config.ts
├── tsconfig.json
├── package.json
├── postcss.config.mjs
├── i18n/
│   └── request.ts                     # next-intl 동적 메시지 로더
├── public/
│   ├── world-110m.json                # (이미 존재)
│   ├── france-departments.json        # (이미 존재)
│   ├── logo.png                       # (이미 존재)
│   ├── winemine-glass-mark.png        # (이미 존재)
│   └── badges/                        # 뱃지 아이콘 12종 (SVG, Gold/Wine Red)
├── messages/
│   ├── ko.json                        # (이미 존재 + 키스크린 추가 키 확장)
│   └── en.json                        # (이미 존재 + 키스크린 추가 키 확장)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # 폰트, <html>, 다크 bg, DeviceFrame, AppContext provider
│   │   ├── globals.css                # @import "tailwindcss" + tokens.css
│   │   ├── page.tsx                   # Home 탭 (/)
│   │   ├── (onboarding)/
│   │   │   └── onboarding/
│   │   │       └── page.tsx           # 첫 진입 시 라우트 (언어→경험→완료)
│   │   ├── cellar/
│   │   │   ├── page.tsx               # 셀러 리스트
│   │   │   └── [id]/
│   │   │       └── page.tsx           # 셀러 와인 상세 + "이 와인 마시기"
│   │   ├── map/
│   │   │   └── page.tsx               # 풀 월드맵 + 드릴다운
│   │   ├── wine/
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # 와인 상세 (가격 그래프, 리뷰)
│   │   │       └── prices/
│   │   │           └── page.tsx       # 가격 추이 상세 (매장/지점 리스트)
│   │   ├── profile/
│   │   │   ├── page.tsx               # 내 프로필
│   │   │   └── [userId]/
│   │   │       └── page.tsx           # 타 유저 프로필 (지도 + 와인 + 취향 %)
│   │   ├── settings/
│   │   │   ├── page.tsx               # 설정 루트
│   │   │   ├── language/page.tsx      # 언어 선택
│   │   │   ├── experience/page.tsx    # 입문자/전문가 토글
│   │   │   └── notifications/page.tsx # 알림 설정
│   │   ├── notifications/
│   │   │   └── page.tsx               # 알림 리스트
    │   ├── notes/
│   │   │   └── new/
│   │   │       ├── page.tsx           # 출처 선택 (셀러 / 새 와인)
│   │   │       └── write/page.tsx     # 작성 (입문자/전문가 UI 분기)
│   │   ├── favorites/
│   │   │   └── page.tsx               # 즐겨찾기 리스트
│   │   ├── badges/
│   │   │   └── page.tsx               # 뱃지 진열장
│   │   ├── photos/
│   │   │   └── page.tsx               # 라벨 사진 갤러리 (시간순/지역별 필터)
│   │   ├── glossary/
│   │   │   ├── page.tsx               # 용어 사전 루트
│   │   │   └── [term]/page.tsx        # 단일 용어 상세
│   │   └── capture/
│   │       └── page.tsx               # FAB 진입 — 라벨 스캔/셀러 추가/노트 작성 선택
│   ├── components/
│   │   ├── device-frame/
│   │   │   ├── device-frame.tsx       # iPhone 390×844 외관
│   │   │   ├── status-bar.tsx         # 시계, 신호, 배터리
│   │   │   ├── home-indicator.tsx
│   │   │   └── dynamic-island.tsx
│   │   ├── nav/
│   │   │   ├── bottom-nav.tsx         # 5탭 + 중앙 FAB
│   │   │   ├── app-header.tsx         # 로고, 알림 벨, 아바타+레벨 배지
│   │   │   └── back-header.tsx        # 깊이 있는 화면용 (< 뒤로)
│   │   ├── feature-flag-panel/
│   │   │   └── feature-flag-panel.tsx # 데스크톱 ≥1280px 우측 의사결정 패널
│   │   ├── demo-controls/
│   │   │   └── demo-controls.tsx      # 데스크톱에서 mode/locale/experience 즉시 토글
│   │   ├── home/
│   │   │   ├── stat-hero.tsx          # 미니 월드맵 + 통계
│   │   │   ├── mini-world-map.tsx
│   │   │   ├── notification-feed.tsx  # 가격 알림 + 음용 시점 알림
│   │   │   ├── recent-notes-strip.tsx
│   │   │   ├── quick-actions.tsx
│   │   │   └── first-time-greeting.tsx # first-time 모드용 큰 환영 카드
│   │   ├── cellar/
│   │   │   ├── cellar-list.tsx        # 카드 그리드 또는 리스트
│   │   │   ├── cellar-card.tsx        # 와인 사진 + 라벨 + 음용 시점 표시
│   │   │   ├── cellar-empty-state.tsx # first-time 모드
│   │   │   ├── cellar-detail-header.tsx
│   │   │   ├── drink-window-badge.tsx # "지금 마시기 좋아요" / "2027년부터"
│   │   │   └── drink-this-button.tsx
│   │   ├── map/
│   │   │   ├── full-world-map.tsx
│   │   │   ├── country-detail-panel.tsx # 드릴다운
│   │   │   └── map-legend.tsx
│   │   ├── wine-detail/
│   │   │   ├── wine-header.tsx        # 와인 정보 + 라벨 일러
│   │   │   ├── price-chart.tsx        # Recharts LineChart
│   │   │   ├── price-detail-table.tsx # 매장/지점 리스트
│   │   │   ├── review-card.tsx        # 리뷰어 뱃지 + 레벨 표시
│   │   │   ├── review-list.tsx
│   │   │   ├── add-to-cellar-cta.tsx
│   │   │   └── favorite-toggle.tsx
│   │   ├── profile/
│   │   │   ├── profile-hero.tsx       # 아바타 + 닉네임 + 레벨 + 뱃지 row
│   │   │   ├── level-progress-bar.tsx
│   │   │   ├── badge-shelf.tsx
│   │   │   ├── taste-compatibility.tsx # 타 유저 화면에서만 사용
│   │   │   └── stat-grid.tsx
│   │   ├── tasting-note/              # handover doc의 9개 재사용 컴포넌트 — 그대로 포팅
│   │   │   ├── wset-slider.tsx        # 5-dot 강도 슬라이더 (당도/산도/바디/타닌/향 강도)
│   │   │   ├── aroma-wheel.tsx        # 320×320 SVG 12-wedge UC Davis 휠 + 어휘 칩
│   │   │   ├── caudalie-meter.tsx     # 220px 원형 progress ring + Tap to start/stop
│   │   │   ├── fault-checklist.tsx    # 11종 결함 카드 그리드
│   │   │   ├── opening-timeline.tsx   # 8 dot 타임라인 + 시점별 입력 + 권장 디캔팅 비교
│   │   │   ├── auto-description.tsx   # 자동 묘사 문장 생성 박스 (실시간 buildSentence)
│   │   │   ├── blind-mode.tsx         # 4입력 + 정답 채점
│   │   │   ├── tannin-panel.tsx       # 타닌 강도 + 21 texture + 성숙도
│   │   │   ├── bubble-panel.tsx       # 기포 크기/지속성/무쎄/압력/제조방식/도사주
│   │   │   ├── beginner-note.tsx      # 입문자 5분 노트 (단순화)
│   │   │   ├── serving-temp-input.tsx # NEW — 시음 온도 입력 (베타 피드백)
│   │   │   ├── peak-eta-input.tsx     # NEW — 사용자 추정 음용 적기 입력 (베타 피드백)
│   │   │   ├── regional-aroma-hints.tsx # NEW — 지역/품종 기반 시그니처 향 자동 칩
│   │   │   ├── source-picker.tsx      # 셀러 / 새 와인 선택
│   │   │   ├── note-write-beginner.tsx # 입문자 컨테이너 (BeginnerNote 래핑)
│   │   │   └── note-write-expert.tsx  # 전문가 컨테이너 (Step 1~7 흐름)
│   │   ├── wine-icons/                # handover doc 인용 — 60+ 커스텀 SVG 아이콘
│   │   │   └── wine-icons.tsx
│   │   ├── wine-story/                # NEW — 베타 피드백 반영
│   │   │   ├── wine-story-card.tsx    # 와이너리 역사·재밌는 이야기 카드
│   │   │   └── story-image.tsx
│   │   ├── external-ratings/          # NEW — Vivino/WS/CT 평점 카드
│   │   │   ├── external-ratings-card.tsx
│   │   │   └── rating-pill.tsx
│   │   ├── community-drink-window/    # NEW — 사용자 추정 음용 적기 집계
│   │   │   ├── community-drink-window-chart.tsx
│   │   │   └── peak-distribution.tsx
│   │   ├── photo-archive/             # NEW — 라벨 사진 갤러리
│   │   │   ├── photo-grid.tsx
│   │   │   ├── photo-card.tsx
│   │   │   └── photo-filter-bar.tsx
│   │   ├── glossary/                  # NEW — 용어 사전
│   │   │   ├── glossary-tooltip.tsx   # 인라인 (i) 아이콘 클릭 시 팝오버
│   │   │   ├── glossary-entry.tsx
│   │   │   └── glossary-list.tsx
│   │   ├── community/
│   │   │   ├── review-badge.tsx       # 인라인 뱃지 표시 (이름 옆)
│   │   │   └── level-pill.tsx
│   │   ├── shared/
│   │   │   ├── placeholder-toast.tsx
│   │   │   ├── bottom-sheet.tsx       # 모달 시트
│   │   │   ├── modal.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   ├── locale-text.tsx        # LocalizedString 렌더 헬퍼
│   │   │   └── empty-state.tsx
│   │   └── notifications/
│   │       ├── notification-list.tsx
│   │       └── notification-row.tsx   # "누군가가 X 와인을 구매했어요"
│   ├── context/
│   │   ├── app-mode-context.tsx       # demoMode (first-time/heavy)
│   │   ├── experience-context.tsx     # beginner/expert
│   │   └── locale-context.tsx         # 보조 — next-intl과 동기화
│   ├── hooks/
│   │   ├── use-mock-user.ts           # 현재 demoMode 기반 user 반환
│   │   ├── use-cellar.ts
│   │   ├── use-wine-detail.ts
│   │   ├── use-purchases.ts
│   │   ├── use-notifications.ts
│   │   ├── use-favorites.ts
│   │   └── use-taste-compatibility.ts # 두 사용자의 와인 교집합 % 계산
│   ├── lib/
│   │   ├── analytics.ts               # (이미 존재) 보존, 사용 안 함
│   │   ├── recommended-wines.ts       # (이미 존재) wines.ts에서 재export
│   │   ├── tasting-note-lexicon.ts    # (이미 존재) expert UI에서 사용
│   │   ├── validations.ts             # (이미 존재) 보존, 사용 안 함
│   │   ├── mock/
│   │   │   ├── users.ts
│   │   │   ├── wines.ts
│   │   │   ├── cellar.ts
│   │   │   ├── tasting-notes.ts
│   │   │   ├── purchases.ts
│   │   │   ├── stores.ts
│   │   │   ├── notifications.ts
│   │   │   ├── favorites.ts
│   │   │   ├── badges.ts
│   │   │   ├── levels.ts
│   │   │   ├── reviews.ts
│   │   │   ├── wine-stories.ts        # NEW — 와이너리/생산자 역사 mock
│   │   │   ├── external-ratings.ts    # NEW — Vivino/WS/CT 점수 mock
│   │   │   ├── community-peaks.ts     # NEW — 와인별 사용자 추정 peak 데이터 (수십 건)
│   │   │   ├── label-photos.ts        # NEW — 라벨 사진 mock (placeholder URL + 메타)
│   │   │   └── glossary.ts            # NEW — 용어 사전 항목 (카우달리/잔당/아펠라시옹 등)
│   │   ├── xp.ts                      # XP 계산 + 레벨 산출 + 다음 레벨까지 진척 %
│   │   ├── drink-window.ts            # 와인 음용 시점 추천 로직 (vintage + grape 기반)
│   │   ├── compatibility.ts           # 두 사용자 와인 교집합 % 알고리즘
│   │   ├── community-peak-aggregator.ts # NEW — 사용자 peak 입력들을 평균/중앙값/분포로 집계
│   │   └── regional-aromas.ts         # NEW — 지역·품종 → 시그니처 향 lex id 매핑 (Champagne/BDM/Barolo/Beaujolais 등)
│   └── types/
│       └── index.ts                   # 공유 TypeScript 타입
└── styles/
    └── tokens.css                     # (이미 존재)
</file_structure>

<core_data_entities>

  <User>
    - id: string
    - displayName: string
    - avatarInitial: string (한 글자)
    - locale: enum (ko, en)
    - experience: enum (beginner, expert)
    - xp: number (현재 누적 XP)
    - levelId: number (1~5)
    - joinedAt: string (ISO date)
    - badges: string[] (보유한 BadgeId 배열)
    - stats: { winesTasted: number, countriesExplored: number, regionsExplored: number, notesCount: number, cellarCount: number }
  </User>

  <Wine>
    - id: string
    - name: string (예: "Château Margaux")
    - producer: LocalizedString (생산자 — 영문 표기 우선)
    - vintage: number
    - country: LocalizedString
    - region: LocalizedString
    - appellation: LocalizedString
    - coords: [number, number] (lon, lat)
    - isoNumeric: string (3자리, 지도 매칭용)
    - grapes: LocalizedString[] (품종 배열)
    - wineType: enum (red, white, rosé, sparkling, fortified, dessert)
    - bottleColor: string (hex, 라벨 일러용)
    - drinkWindow: { from: number, peak: number, to: number } (vintage 기준 +n년, 시스템 추정)
    - servingTempCelsius: { min: number, max: number } (권장 시음 온도 — 베타 피드백)
    - signatureAromaLexIds: string[] (해당 와인 타입의 시그니처 향 lex id — regional-aromas.ts에서 자동 유도 가능)
    - averagePriceKrw: number (사용자 등록 평균, 캐시값)
    - description: LocalizedString
    - storyId: string | null (WineStory 참조)
    - externalRatingsId: string | null (ExternalRating 참조)
  </Wine>

  <WineStory>
    - id: string
    - wineryName: LocalizedString
    - foundedYear: number
    - location: LocalizedString
    - history: LocalizedString (3~4문단)
    - funFact: LocalizedString (한 줄 흥미로운 이야기)
    - producerPhotoUrl: string | null (placeholder)
    - vineyardArea: string | null (예: "85 ha")
    - philosophy: LocalizedString | null (양조 철학 한 단락)
  </WineStory>

  <ExternalRating>
    - id: string
    - wineId: string
    - vivino: { score: number(1~5), reviewCount: number } | null
    - wineSearcher: { score: number(0~100), priceRank: string } | null
    - cellarTracker: { score: number(50~100), reviewCount: number } | null
    - globalAvgPriceUsd: number | null
    - lastSyncedAt: string (ISO date — 시안에서는 고정)
  </ExternalRating>

  <CommunityPeakEstimate>
    - id: string
    - wineId: string
    - userId: string (작성자 — 익명화해서 Level만 노출)
    - estimatedPeakYear: number (사용자가 추정한 절정 연도)
    - confidence: enum (low, medium, high) — 사용자 본인 확신도
    - note: LocalizedString | null (한 줄 메모: "아직 타닌이 너무 강함")
    - createdAt: string
    - reviewerLevel: number (집계 신뢰도 가중치 — L4·L5는 가중치 높음)
  </CommunityPeakEstimate>

  <CommunityPeakAggregate>
    - wineId: string (캐시 키)
    - count: number (몇 명이 입력했나)
    - meanPeakYear: number (가중 평균)
    - medianPeakYear: number
    - distribution: Array<{ year: number, count: number }> (히스토그램용)
    - systemPeakYear: number (Wine.drinkWindow.peak — 비교용)
  </CommunityPeakAggregate>

  <LabelPhoto>
    - id: string
    - userId: string
    - wineId: string | null (매칭된 와인 — null이면 미매칭)
    - photoUrl: string (placeholder URL, 시안에서는 SVG 라벨 일러)
    - capturedAt: string (ISO date)
    - location: LocalizedString | null (촬영 장소 — 식당명 등)
    - tags: string[] (자유 태그)
    - linkedTastingNoteId: string | null
    - linkedCellarItemId: string | null
  </LabelPhoto>

  <GlossaryEntry>
    - id: string (예: "caudalie", "residual-sugar", "appellation", "wset", "brett", "bouchonne")
    - term: LocalizedString
    - definition: LocalizedString (2~4문장)
    - examples: LocalizedString | null (사용 예시)
    - relatedTermIds: string[] (다른 용어 참조)
    - source: LocalizedString | null (출처 — WSET, Peynaud, AWRI 등)
    - category: enum (sensory, fault, classification, technique, unit) — 필터용
  </GlossaryEntry>

  <ServingTemperature>
    <usage>TastingNote.expertFields에 신규 필드로 추가</usage>
    - servingTempCelsius: number | null (실제 시음 시 측정 또는 추정)
    - servingTempIdealMatch: boolean | null (Wine.servingTempCelsius 범위와 비교 결과)
  </ServingTemperature>

  <CellarItem>
    - id: string
    - userId: string (소유자)
    - wineId: string (Wine.id 참조)
    - acquiredAt: string (ISO date)
    - storage: enum (cellar, fridge, room, offsite) — LocalizedString 라벨
    - notes: LocalizedString | null (메모)
    - purchasePriceKrw: number | null
    - notifyAtPeak: boolean (음용 시점 알림 예약 여부)
    - photoUrl: string | null
  </CellarItem>

  <TastingNote>
    - id: string
    - userId: string
    - wineId: string
    - source: enum (cellar, newEntry) — 셀러에서 마신 것인지, 새로 등록한 와인인지
    - cellarItemId: string | null
    - tastedAt: string (ISO date)
    - mode: enum (beginner, expert)
    - beginnerFields: { impression: enum, sweetness: 1~5, acidity: 1~5, body: 1~5, tannin: 1~5, aromas: string[], finish: enum, rating: number(0~5), memo: LocalizedString } | null
    - expertFields: { sweetness: WSETScale, acidity: WSETScale, body: WSETScale, tannin: WSETScale, tanninTexture: string, intensity: WSETScale, flavorIntensity: WSETScale, finishLength: FinishLength, aromaWheel: { categoryId: string, terms: string[] }[], faults: Fault[], evolution: { openedAt: string, decant: boolean, timepoints: Array<{ minutes: number, deltaAroma: Delta, deltaTannin: Delta, deltaBody: Delta, score: number }>, peakAt: number }, caudalies: number, rating: number(0~100), memo: LocalizedString, servingTempCelsius: number | null, peakEstimateYear: number | null, peakEstimateConfidence: enum (low, medium, high) | null, peakEstimateNote: LocalizedString | null } | null
    - photoUrl: string | null
    - priceKrw: number | null (이 자리에서 가격 입력 시 Purchase로도 등록)
    - isPublic: boolean (커뮤니티 노출 여부 — 시안에서는 true 고정)
    - createdAt: string
  </TastingNote>

  <Purchase>
    - id: string
    - userId: string
    - wineId: string
    - priceKrw: number
    - currency: string ('KRW' 단일)
    - storeId: string (Store.id 참조)
    - purchasedAt: string (ISO date)
    - source: enum (cellarRegistration, tastingNote) — 어느 흐름에서 입력됐는지
  </Purchase>

  <Store>
    - id: string
    - name: LocalizedString
    - branch: LocalizedString | null (지점명)
    - kind: enum (offline, online)
    - location: LocalizedString | null
  </Store>

  <FavoriteWine>
    - id: string
    - userId: string
    - wineId: string
    - notifyOnPurchase: boolean (누군가가 가격 등록 시 알림 받기)
    - addedAt: string
  </FavoriteWine>

  <Notification>
    - id: string
    - userId: string
    - kind: enum (favoritePurchase, drinkWindowReached, badgeEarned, levelUp, reviewLiked)
    - wineId: string | null (favoritePurchase, drinkWindowReached에 사용)
    - cellarItemId: string | null (drinkWindowReached에 사용)
    - badgeId: string | null (badgeEarned에 사용)
    - actorUserId: string | null (favoritePurchase의 구매자 — 익명화)
    - title: LocalizedString
    - body: LocalizedString
    - createdAt: string (ISO date — 상대 시간 표시: "3시간 전" / "3 hours ago")
    - read: boolean
  </Notification>

  <Badge>
    - id: string
    - name: LocalizedString
    - description: LocalizedString
    - iconPath: string (`/badges/*.svg`)
    - tier: enum (bronze, silver, gold, platinum)
    - earnedCondition: LocalizedString (예: "10개국에서 와인 마시기")
  </Badge>

  <Level>
    - id: number (1~5)
    - name: LocalizedString
    - minXp: number
    - maxXp: number | null (5단계는 null)
    - color: string (hex, 레벨 배지 색)
    - description: LocalizedString
  </Level>

  <Review>
    - id: string
    - userId: string (작성자)
    - wineId: string
    - body: LocalizedString
    - rating: number (0~100, 전문가 모드) | number (0~5, 입문자 모드)
    - mode: enum (beginner, expert)
    - createdAt: string
    - likesCount: number
  </Review>

  <indexes_for_querying>
    - CellarItem [userId+drinkWindow.peak] for "soon drinkable" sort
    - TastingNote [userId+tastedAt desc] for recent feed
    - Purchase [wineId+purchasedAt desc] for price chart
    - Notification [userId+createdAt desc] for feed
    - FavoriteWine [userId, wineId] for toggle lookup
  </indexes_for_querying>
</core_data_entities>

<authentication>
  <note>해당 없음. 인증 미구현. "로그인" 버튼은 placeholder 토스트 응답. 데모 모드 토글로 currentUser를 swap.</note>
</authentication>

<route_definitions>
  <public_routes>
    <route path="/" page="HomePage" />
    <route path="/onboarding" page="OnboardingPage" guard="firstTimeOnly" />
    <route path="/cellar" page="CellarListPage" />
    <route path="/cellar/:id" page="CellarItemDetailPage" />
    <route path="/map" page="MapPage" />
    <route path="/wine/:id" page="WineDetailPage" />
    <route path="/wine/:id/prices" page="WinePriceDetailPage" />
    <route path="/profile" page="MyProfilePage" />
    <route path="/profile/:userId" page="OtherProfilePage" />
    <route path="/settings" page="SettingsPage" />
    <route path="/settings/language" page="LanguageSettingsPage" />
    <route path="/settings/experience" page="ExperienceSettingsPage" />
    <route path="/settings/notifications" page="NotificationSettingsPage" />
    <route path="/notifications" page="NotificationListPage" />
    <route path="/notes/new" page="NoteSourcePickerPage" />
    <route path="/notes/new/write" page="NoteWritePage" />
    <route path="/favorites" page="FavoritesListPage" />
    <route path="/badges" page="BadgeShelfPage" />
    <route path="/capture" page="CaptureChooserPage" />
    <route path="/photos" page="LabelPhotoArchivePage" />
    <route path="/glossary" page="GlossaryListPage" />
    <route path="/glossary/:term" page="GlossaryEntryPage" />
    <route path="/wine/:id/story" page="WineStoryPage" />
    <route path="/wine/:id/community-peak" page="CommunityPeakDetailPage" />
  </public_routes>
  <guards>
    <firstTimeOnly>
      - demoMode === 'first-time' AND onboardingComplete === false면 어떤 경로로 들어와도 `/onboarding`으로 redirect
      - 시안에서는 localStorage `onboardingComplete=true`로 두면 더는 redirect 안 함
    </firstTimeOnly>
  </guards>
  <query_params>
    - `?demo=first-time|heavy` — 데모 모드 (localStorage `demoMode` 동기화)
    - `?exp=beginner|expert` — 경험 수준 (localStorage `experience` 동기화)
    - `?locale=ko|en` — 언어 (localStorage `locale` 동기화)
    - 위 3개는 어떤 라우트에서도 인식. URL에 있으면 우선, 없으면 localStorage, 둘 다 없으면 default(first-time / beginner / ko)
  </query_params>
</route_definitions>

<component_hierarchy>
  <app_shell>
    <providers>
      <NextIntlClientProvider>
        <AppModeProvider>          <!-- demoMode -->
          <ExperienceProvider>     <!-- beginner/expert -->
            <FavoritesProvider>    <!-- 즐겨찾기 토글 상태 -->
              <ToastProvider>
                <PageBackground />
                <DeviceFrame>      <!-- 데스크톱: 중앙 고정 / 모바일: 투명 wrapper -->
                  <StatusBar />
                  <RouteOutlet>    <!-- 라우트 변경 시 이 영역만 교체 -->
                    <AppHeader />  <!-- 또는 BackHeader (deep screen) -->
                    <PageContent />
                    <BottomNav />  <!-- 일부 화면(노트 작성, 온보딩)에서는 숨김 -->
                  </RouteOutlet>
                  <HomeIndicator />
                </DeviceFrame>
                <DemoControls />   <!-- 데스크톱 ≥1024px, 좌측 사이드 -->
                <FeatureFlagPanel />  <!-- 데스크톱 ≥1280px, 우측 사이드 -->
                <PlaceholderToast />
              </ToastProvider>
            </FavoritesProvider>
          </ExperienceProvider>
        </AppModeProvider>
      </NextIntlClientProvider>
    </providers>
  </app_shell>

  <shared_components>
    <PlaceholderToast />
    <BottomSheet />            <!-- 캡처 진입, 음용 알림 예약 등 -->
    <ConfirmDialog />          <!-- 셀러에서 마시기, 즐겨찾기 해제 -->
    <LocaleText />             <!-- LocalizedString 렌더 -->
    <EmptyState />             <!-- 셀러 비었을 때, 노트 0개 등 -->
    <LevelPill />              <!-- 이름 옆 작은 레벨 표시 -->
    <ReviewBadge />            <!-- 이름 옆 뱃지 아이콘 -->
  </shared_components>
</component_hierarchy>

<pages_and_interfaces>

  <global_layout>
    <browser_viewport>
      - 데스크톱(≥1024px): 페이지 중앙에 DeviceFrame, 좌측에 DemoControls(320px), 우측에 FeatureFlagPanel(320px)
      - 태블릿(768~1023px): DeviceFrame 중앙, 사이드 패널 숨김
      - 모바일(<768px): DeviceFrame wrapper 투명 — 콘텐츠가 전체 화면, 콘텐츠 max-width 390px
      - 페이지 배경: deepest dark → deep dark 대각선 그라데이션
    </browser_viewport>
    <device_frame>
      - 외경 414×868, border-radius 50px
      - 베젤 색 #0A050F, stroke 2px solid #1F1428
      - shadow `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08)`
      - 내부 콘텐츠 영역 390×844, border-radius 38px, overflow hidden
      - Dynamic Island 120×34 top 11px, border-radius 17px, #000000
      - Home Indicator 134×5 bottom 8px, rgba(245,240,232,0.4)
    </device_frame>
    <status_bar>
      - 높이 54px, 상단 padding 18px
      - 좌측 시계 "9:41" (Inter 500 15px Cream), padding-left 28px
      - 우측 신호+Wi-Fi+배터리 인디케이터 (lucide-react, 16px stroke 2)
    </status_bar>
    <app_header_standard>
      - 높이 56px
      - 좌측: winemine 로고 (Playfair 22px, letter-spacing -0.02em, Cream)
      - 우측: 알림 벨 (Bell 20px, 미읽음 시 우상단 빨간 점 8px, Wine Red #8B1A2A) + 아바타 wrap(36×36 원형 Wine Red, Cream 글자, 좌상단에 레벨 미니 뱃지 16×16 Gold)
      - padding 0 20px
    </app_header_standard>
    <back_header>
      - 높이 56px
      - 좌측: ChevronLeft 24px + 페이지 타이틀 (Inter 600 16px)
      - 우측: 컨텍스트 액션 (공유, 더보기 등) — 페이지별로 다름
      - padding 0 16px
    </back_header>
    <bottom_nav>
      - 높이 83px (탭 49px + 홈 safe area 34px)
      - 배경 rgba(15,7,24,0.92) + backdrop-filter blur(20px)
      - 상단 보더 1px solid #2D1540
      - 5탭 (홈/지도/FAB/셀러/프로필):
        - 일반 탭: 아이콘 20px stroke 1.75, 라벨 10px Inter 500, gap 4px
        - 활성 시 Gold (#C9A84C), 비활성 Muted (#9B8B7A)
        - FAB(중앙): 56×56 원형, Wine Red, Camera 아이콘 24px Cream, 보더 4px Deepest Dark, top -16px 띄움
      - 화면별 활성 탭이 다름. 노트 작성·온보딩 화면에서는 BottomNav 숨김
    </bottom_nav>
  </global_layout>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- ONBOARDING                                                  -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <onboarding_page>
    <description>
      - 라우트: `/onboarding`. demoMode=first-time 이고 `onboardingComplete=false`일 때만 접근
      - BottomNav, AppHeader 숨김. 풀스크린 시안
      - 4단계 (스와이프 또는 다음 버튼)
    </description>
    <step_welcome>
      - 화면 중앙에 winemine 로고 (Playfair 56px Cream)
      - 아래 태그라인 (i18n key `onboarding.tagline`):
        ko: "한 잔의 와인, 한 점의 지도"
        en: "A glass of wine, a pin on the map"
      - 하단 60% 위치에 와인잔 마크 (`/winemine-glass-mark.png`) 90px
      - 화면 하단 80px: "시작하기 / Get started" CTA (PrimaryCTA 스타일)
      - 진입 애니메이션: 로고 fade-up 600ms delay 200ms, 태그라인 delay 500ms, CTA delay 800ms
    </step_welcome>
    <step_language>
      - 제목 "언어를 선택하세요" / "Choose your language" (Playfair 28px Cream)
      - 부제 (i18n): "이 설정은 언제든 변경 가능해요" / "You can change this anytime"
      - 카드 2개 (큰 카드, 각 96px 높이):
        - 한국어 (Inter 600 18px) / 國 아이콘
        - English (Inter 600 18px) / EN 아이콘
      - 선택 시 1px Gold 보더 + Wine Red 1px 라이트 글로우, 다른 카드 dim
      - 하단 다음 버튼 (선택 안 하면 disabled)
    </step_language>
    <step_experience>
      - 제목 (i18n `onboarding.experience.title`): "와인 경험을 알려주세요" / "Tell us about your wine experience"
      - 부제: "이에 따라 테이스팅 노트가 다르게 표시돼요" / "We'll tailor the tasting note experience"
      - 카드 2개 (큰 카드, 각 120px 높이, 세로 스택):
        - **입문자 (Beginner)** — 좌측 GlassWater 아이콘 24px Gold, 라벨 "와인을 가볍게 즐기시나요?" / "Just getting started with wine?", sublabel "단맛·신맛·향을 풀어쓴 5분짜리 기록" / "5-minute notes in everyday words"
        - **전문가 (Expert)** — 좌측 Award 아이콘 24px Gold, 라벨 "와인을 깊게 파고드시나요?" / "Diving deep into wine?", sublabel "WSET SAT · 카우달리 · 결함 점검" / "WSET SAT · Caudalies · fault checks"
      - 선택 시 동일 보더 효과
      - 하단 "다음 / Next" CTA
      - 푸터 텍스트 (Inter 12px Muted): "설정에서 언제든 변경할 수 있어요" / "Change anytime in settings"
    </step_experience>
    <step_done>
      - 중앙 큰 체크 아이콘 (CheckCircle2 80px Gold), 진입 시 scale 0.5→1.0 spring
      - 제목: "환영해요, 와인 여정이 시작돼요" / "Welcome — your wine journey begins"
      - 부제: "첫 한 병을 스캔하거나 둘러보세요" / "Scan your first bottle or take a tour"
      - 하단 두 버튼:
        - "라벨 스캔 (Camera 아이콘)" — PrimaryCTA, 클릭 시 /capture
        - "둘러보기 (ArrowRight 아이콘)" — Secondary 버튼, 클릭 시 /
      - 완료 시 localStorage `onboardingComplete=true` 저장
    </step_done>
  </onboarding_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- HOME (/)                                                    -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <home_page_heavy>
    <description>demoMode=heavy 일 때의 / 화면</description>
    <header>AppHeader (로고 + 알림벨 + 아바타-레벨)</header>
    <stat_hero>
      - 200px 높이, 좌우 마진 16px, border-radius 20px
      - 배경 Surface + 하단 Wine Red 0.25 그라데이션
      - 좌측 텍스트: 인사말 "안녕하세요, {displayName}님" / "Welcome back, {displayName}"
      - 큰 숫자 "{winesTasted}병" / "{winesTasted} bottles" (Playfair 44px)
      - 부가 "{countriesExplored}개국 · {regionsExplored}개 지역" / "{n} countries · {n} regions"
      - 우측 MiniWorldMap (히트맵 필 + 핀 28개)
    </stat_hero>
    <level_progress_bar>
      - 위치 stat_hero 아래 12px
      - 좌우 마진 16px
      - 좌측 레벨 배지 미니 (24×24 Gold)
      - 우측 라벨 "Level 3 Connoisseur · {currentXp}/{nextLevelXp} XP" (Inter 13px Cream)
      - 아래 진행 바 6px 높이, 트랙 #2D1540, fill Gold, border-radius 3px
      - 클릭 시 /badges로 이동
    </level_progress_bar>
    <notification_feed>
      - 제목 "알림 / Notifications" (Inter 500 14px Muted, 좌측 정렬, padding 16px 20px 8px)
      - 우측 "모두 보기 / See all" (Inter 500 12px Gold, /notifications 링크)
      - 최근 3개 알림 카드 (90px 높이):
        1. favoritePurchase — Wine Red 좌측 4px 바, "누군가가 Château Margaux를 ₩680,000에 구매했어요" / "Someone bought Château Margaux for ₩680,000", 우측 ChevronRight (클릭 시 /wine/[id])
        2. drinkWindowReached — Gold 좌측 4px 바, "셀러의 Chianti Classico가 지금이 마시기 좋아요" / "Your Chianti Classico is at peak now", 우측 "마시기 / Drink" 버튼 (클릭 시 /cellar/[id])
        3. badgeEarned — Cream 좌측 바, "10개국 뱃지를 획득했어요" / "Earned: Globe Trotter", 우측 뱃지 아이콘
      - 각 카드 클릭 시 해당 deep route로 이동, hover 시 보더 Wine Red
    </notification_feed>
    <recent_notes_strip>
      - 제목 "최근 마신 와인 / Recently tasted"
      - 가로 스크롤 카드 (각 140×180px): 라벨 일러 + 와인명 + 빈티지 + 별점
      - 카드 클릭 시 /wine/[id]
      - 헤비 유저: 8개 노출
    </recent_notes_strip>
    <quick_actions>
      - 2×2 그리드:
        - "셀러 / Cellar" (TrendingUp 아이콘, "23병 보관 중 / 23 in storage")
        - "지도 / Map" (Globe2, "14개 지역 / 14 regions")
        - "즐겨찾기 / Favorites" (Star, "7개 / 7 wines")
        - "뱃지 / Badges" (Award, "7/12")
      - 각각 해당 route로 이동
    </quick_actions>
    <bottom_nav>홈 탭 활성</bottom_nav>
  </home_page_heavy>

  <home_page_first_time>
    <description>demoMode=first-time 일 때의 / 화면 (온보딩 완료 후)</description>
    <first_time_greeting>
      - 화면 상단 1/3 영역, Surface 배경 + Wine Red 글로우
      - 큰 제목 "안녕하세요, {displayName}님 / Hello, {displayName}"
      - 부제 "첫 와인을 등록해보세요 / Add your first bottle to begin"
      - 큰 CTA "라벨 스캔하기 / Scan a label" (Camera 아이콘) → /capture
    </first_time_greeting>
    <empty_stat_hero>
      - "아직 마신 와인이 없어요 / No wines tasted yet"
      - 흐릿한 미니 월드맵 (opacity 0.15), 핀 0개
      - "당신의 와인 지도를 만들어보세요 / Start building your wine map"
    </empty_stat_hero>
    <suggested_actions>
      - 3개 카드 세로 스택:
        - "둘러보기 — winemine은 어떤 앱인가요?" / "Take a tour" → 토스트 (시안)
        - "추천 입문 와인 보기" / "See starter recommendations" → 임시 모달 with `RECOMMENDED_WINES`
        - "와인 경험 모드 바꾸기" / "Change experience level" → /settings/experience
    </suggested_actions>
    <bottom_nav>홈 탭 활성, 다른 탭들도 클릭 가능하지만 셀러·노트는 빈 상태로</bottom_nav>
  </home_page_first_time>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- MAP (/map)                                                  -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <map_page>
    <header>BackHeader "내 와인 지도 / My wine map", 우측 Filter 아이콘 (필터 시트 placeholder)</header>
    <full_world_map>
      - 콘텐츠 영역의 거의 전부 (약 580px 높이)
      - 다크 배경 Map Dark, 국가 fill 마신 와인 있는 국가는 Wine Red graduated (1병=0.3 opacity, 5+병=1.0)
      - 모든 와인 핀 (heavy 28개, first-time 0개)
      - 핀 클릭 시 country_detail_panel slide-up bottom sheet
      - 인터랙션: 핀치 줌은 시안에서는 disabled, 핀 탭만 동작
    </full_world_map>
    <country_detail_panel>
      - bottom sheet (BottomSheet 컴포넌트), 높이 콘텐츠의 60%
      - 헤더: 국가명 + 마신 병 수 (예: "프랑스 · 14병 / France · 14 bottles")
      - 지역 리스트 (drillable): "보르도 5병", "부르고뉴 6병", "샹파뉴 3병"
      - 지역 클릭 시 와인 리스트로 전환
      - 와인 리스트: 작은 카드 (라벨 일러 + 이름 + 빈티지 + 별점), 클릭 시 /wine/[id]
    </country_detail_panel>
    <map_legend>
      - 우상단 작은 패널 (120×80, Surface 배경)
      - 그라데이션 바 + "1병" "5+병" 라벨
      - 클릭 시 토스트 "히트맵은 마신 와인 수 / Heatmap by bottles tasted"
    </map_legend>
    <empty_state_first_time>
      - 지도는 모두 Map Dark fill, 핀 0
      - 중앙 오버레이: "아직 와인 기록이 없어요 / No wine records yet" + "시작하기 / Get started" CTA → /capture
    </empty_state_first_time>
    <bottom_nav>지도 탭 활성</bottom_nav>
  </map_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- CAPTURE FLOW (/capture, /notes/new, etc.)                  -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <capture_chooser_page>
    <description>FAB 클릭 시 진입. 라우트 `/capture`. BottomNav 숨김, 상단 X 닫기 버튼만 (router.back).</description>
    <header>닫기 X 버튼 (좌상단), 타이틀 "와인 추가 / Add a wine" (중앙 Inter 600 17px)</header>
    <three_option_cards>
      - 세로 스택 큰 카드 3개 (각 120px 높이):
        1. **라벨 스캔 / Scan a label** — Camera 아이콘 32px Wine Red, "AI가 자동 인식해요 / AI auto-recognition" → 클릭 시 토스트 "카메라 권한이 필요해요 (시안) / Camera permission needed (mock)"
        2. **셀러에 보관 / Store in cellar** — Library 아이콘 32px Gold, "오늘 마실 게 아니면 보관 / Store for later" → /cellar/new (이 화면도 mock으로 작성)
        3. **테이스팅 노트 작성 / Write a tasting note** — BookOpen 아이콘 32px Cream, "지금 마시는 와인 기록 / Record what you're drinking now" → /notes/new
      - 카드 hover/tap 동일 패턴
    </three_option_cards>
  </capture_chooser_page>

  <note_source_picker_page>
    <description>라우트 `/notes/new`. 노트 작성 전 출처 선택.</description>
    <header>BackHeader "출처 선택 / Choose source"</header>
    <question>"이 와인은 어디서 왔나요? / Where did this wine come from?"</question>
    <option_cards>
      - 2개 큰 카드:
        1. **내 셀러에서 / From my cellar** — Library 아이콘, "{cellarCount}병 보관 중 / {n} stored", 클릭 시 모달로 셀러 와인 리스트 (선택 시 /notes/new/write?from=cellar&itemId=X)
        2. **새 와인 / A new wine** — Sparkles 아이콘, "라벨 스캔 또는 직접 입력 / Scan or manual entry", 클릭 시 /notes/new/write?from=newEntry
    </option_cards>
    <first_time_note>
      - first-time 모드: 첫 카드는 disabled, "셀러가 비어있어요 / Cellar is empty" 표시
      - 두 번째 카드는 활성
    </first_time_note>
  </note_source_picker_page>

  <note_write_page>
    <description>
      라우트 `/notes/new/write`. ExperienceContext에 따라 분기.
      구현 베이스는 랜딩 페이지의 `/tasting-note-playground` (handover doc §2.2). useReducer로 모든 입력 보유, 페이지 이탈 시 React Context에 누적되되 새로고침 시 리셋.
    </description>
    <header>BackHeader "테이스팅 노트 / Tasting note" + 우측 "저장 / Save" 버튼 (placeholder, 클릭 시 +XP 토스트)</header>
    <variant_tabs>
      - White / Red / Sparkling / Blind (4탭, i18n `tastingNote.tabs.*`)
      - 탭 변경 시 form variant가 바뀌고 일부 컴포넌트 swap (Red→TanninPanel, Sparkling→BubblePanel, Blind→BlindMode 단일)
      - 입문자 모드에서는 Blind 탭이 disabled되고 white로 fallback (handover doc §2.2)
    </variant_tabs>

    <wine_meta_card>
      - 상단 카드: 와인 라벨 일러 (60×80) + 이름 (Playfair) + 생산자/빈티지/지역/아펠라시옹
      - `from=cellar`면 셀러 항목 자동 채움, `from=newEntry`면 빈 폼
      - 좌상단 작은 (i) 버튼 클릭 시 GlossaryTooltip "아펠라시옹이 뭐예요? / What is Appellation?" 팝오버
    </wine_meta_card>

    <beginner_layout>
      <intro>i18n `tastingNote.beginner.intro` — "와인 한 잔, 5분이면 끝나는 짧은 기록. 어려운 용어는 잠시 잊고 느낀대로 적어보세요."</intro>
      <component>
        - 단일 컴포넌트 `<BeginnerNote variant producer wineName />` (handover doc §5.9, 699줄)
        - 자체 state로 모든 입력 보유 (부모에 props 단방향)
        - 7단계 세로 흐름:
          1. 와인 (자동/수동)
          2. 첫 모금 인상 — 칩 3개 (StarEyesFaceIcon / SmileFaceIcon / ThinkingFaceIcon 활용)
          3. 맛 5차원 슬라이더 (단맛/신맛/무게감/떫은맛/기포) — 3단계 라벨 (low/mid/high)
          4. 향 8 카테고리 카드 (StrawberryIcon, LemonIcon, PeachIcon, PinkRoseIcon, ChiliIcon, HoneyJarIcon, SproutIcon, BreadIcon)
          5. 여운 — 3 옵션 (short/medium/long)
          6. 평점 — 5 star
          7. 한 줄 메모
        - 각 단계 옆 GlossaryTooltip — i18n `tastingNote.beginner.tip.*` ("단맛의 정도는 '잔당(Residual Sugar)'이라고 하며…")
      </component>
      <auto_summary>화면 하단 고정 카드 "오늘의 한 잔 / Today's glass" — 입력 변경 시 실시간 요약 문장 자동 생성</auto_summary>
    </beginner_layout>

    <expert_layout>
      <intro>i18n `tastingNote.playground.expert.intro` — "WSET SAT 호환 정밀 도구. 어휘 칩·슬라이더·결함 체크리스트가 모두 포함됩니다."</intro>
      <step_flow_white_red_sparkling>
        Playground (handover doc §2.2) 패턴을 그대로 따르되 모바일 viewport에 맞게 세로 흐름:

        **Step 1 — Capture (라벨 인식 / 메타)**
        - 와인 메타 카드 (위 wine_meta_card 재사용)
        - "사진 추가 / Add photo" 버튼 — 시안 placeholder, 클릭 시 LabelPhoto mock entry 추가
        - 시음 장소·일자·서빙 포맷 (병/잔/디캔터) 입력
        - **NEW** ServingTempInput — 시음 온도 (i18n `tastingNote.expert.servingTemp.title` "시음 온도 / Serving temperature"):
          - 슬라이더 4~22°C, 0.5°C 스텝
          - 좌측에 Wine.servingTempCelsius 권장 범위 표시 (예: "권장 16~18°C / Recommended 16-18°C")
          - 사용자 입력이 권장 범위면 Gold 체크, 벗어나면 Wine Red 경고 + "조금 차게 / Slightly cold" 등 한 줄 안내
          - 베타 피드백 직접 반영 — 디자인 결정의 근거를 i18n footnote로 명시

        **Step 2 — Aroma**
        - `<WSETSlider labelKey="tastingNote.dimensions.intensity" value={aromaIntensity} ... />` — 향 강도
        - `<AromaWheel variant={state.variant} selected={state.aromaSelected} onToggle={...} />` — 320×320 SVG 휠
        - 휠 옆에 **NEW** `<RegionalAromaHints wineId={meta.wineId} />`:
          - 와인의 region·grape에서 자동 유도된 시그니처 향 칩 3~6개 노출 (예: Champagne → 브리오슈/이스트/사과/헤이즐넛, Brunello → 체리·가죽·담배·말린 허브, Barolo → 장미·타르·트러플·체리, Beaujolais → 바나나·체리·풍선껌)
          - "이 지역에서 자주 나타나는 향 / Typical for this region" 헤더
          - 칩 클릭 시 AromaWheel selected에 추가 + 사용자에게 즉시 시각적 피드백
          - 와이너리 시그니처 + 품종 시그니처 둘 다 표시 가능
          - 베타 피드백("샴페인/BDM/바롤로/보졸레 차이에 맞게 노트가 뜨면 좋겠어요") 직접 반영
        - 휠 어휘 칩 hover/tap 시 ImpactCompound 한 줄 설명 툴팁 (handover doc §4.3)

        **Step 3 — Palate**
        - WSETSlider 4개: sweetness / acidity / body / alcohol
        - Red variant: `<TanninPanel state={state.tannin} ... />` (handover doc §5.8) — 강도 슬라이더 + 21 texture 칩 4 그룹(soft/fine/grippy/harsh) + 성숙도 3택
        - Sparkling variant: `<BubblePanel bubbles={state.bubbles} dosage={state.dosage} ... />` — 기포 크기/지속성/무쎄/압력/제조방식/EU 도사주 7택
        - White variant: TanninPanel/BubblePanel 둘 다 생략
        - Flavor Intensity WSETSlider + flavor notes 자유 입력 (handover doc §3.2)

        **Step 4 — Finish (Caudalie)**
        - `<CaudalieMeter caudalies={state.caudalies} onChange={...} />` (handover doc §5.3) — 220px 원형 progress ring, RAF 1초당 1 카운트, 30초까지 ring 진행
        - 우상단 (i) 버튼 → GlossaryTooltip "카우달리가 뭐예요? / What is a Caudalie?":
          - 정의: "Émile Peynaud가 보르도 와인 학교에서 정립한 단위. 1 카우달리 = 1초. 와인을 삼킨 직후 향과 풍미가 지속되는 시간을 측정."
          - 분류: <3 short / 3-5 medium / 5-10 long / 10+ very long
          - "더 알아보기 / Learn more" → /glossary/caudalie
          - 베타 피드백("카우달리가 머에요") 직접 반영
        - 측정 종료 시 `caudalieCategory()` + `caudalieComparison()` 비교 카피 노출 (handover doc §4.9)
        - manual override toggle (i18n `tastingNote.caudalie.manualToggle`)
        - FinishQuality 18종 칩 다중 선택 (clean, persistent, complex, mineral, hot, hollow 등)

        **Step 5 — Faults**
        - `<FaultChecklist selected={state.faults} onToggle={...} />` (handover doc §5.4) — 11 카드 그리드, 각 카드 cause/threshold/aroma 3줄
        - 명시적 체크만 기록 (자동 추론 금지 푸터 카피)
        - 각 카드 (i) 버튼 → GlossaryTooltip (예: brett → "Brettanomyces 효모. 농장 마구간 향, 가죽 뉘앙스. 역치 200µg/L 4-에틸페놀. 일부는 매력으로 받아들임")

        **Step 6 — Evolution (Opening Timeline)**
        - `<OpeningTimeline variant meta state={state.evolution} ... />` (handover doc §5.5, 439줄 컴포넌트)
        - 상단: 코르크 오픈 시각 picker + 디캔터 토글 + 라이브 타이머 chip
        - 가로 8 dot 타임라인 (T0/15분/30분/1시간/2시간/3시간/4시간/4시간+ 또는 사용자 임의)
        - 활성 timepoint 입력 카드: deltaAroma/deltaTannin/deltaBody (각 -2~+2 Delta), reductionPresent, newAromasEmerged (lex id 선택), overallScore (1-5), note
        - Peak 시점 ★ 토글 (한 번에 하나)
        - 권장 디캔팅 카드 — `matchOpeningGuide()` (handover doc §4.5)로 자동 카테고리 추정 후 권장 min/peak/max 표시 + 사용자 peak와 비교 카피
        - SVG 라인 차트로 시점별 점수 시각화

        **Step 7 — Peak ETA & Rating**
        - **NEW** PeakEtaInput — 사용자 추정 음용 적기 (베타 피드백 직접 반영):
          - 질문 i18n `tastingNote.expert.peakEta.title` — "이 와인, 언제가 가장 좋을까요? / When will this wine peak?"
          - 옵션: "지금이 절정 / Peaking now" + "+N년 후" 슬라이더 (현재 빈티지 기준 0~20년)
          - 확신도 라디오: low/medium/high (i18n `tastingNote.expert.peakEta.confidence.*`)
          - 한 줄 메모 텍스트 입력 (선택)
          - 푸터 텍스트 i18n `tastingNote.expert.peakEta.footnote` — "다른 사용자들의 추정과 함께 와인 상세 페이지에 집계됩니다 / Aggregated with other users on the wine page"
          - 사용자 레벨이 L3+ 일 때만 노출 (입력 신뢰도 확보) — L1·L2는 "더 마셔보고 다시 / Come back after more bottles" 표시
        - Rating 별점 (0-5) 또는 100점
        - "다시 사시겠어요? / Would buy again?" 토글
        - `<AutoDescription ... />` (handover doc §5.6) — 입력 변경 시 200ms 디바운스로 자동 묘사 문장 갱신, Playfair italic 17px Gold 박스
      </step_flow_white_red_sparkling>

      <blind_variant>
        - Blind 탭 선택 시 모든 step 대신 `<BlindMode />` 단독 (handover doc §5.7)
        - 내부 state로 4 입력 보유: grape, region, vintage, priceRange
        - "정답 공개 (Reveal & Score) / Reveal & Score" 버튼 클릭 시 채점 (각 25점, 총 100점)
        - 등급 라벨: rankMaster / rankAdvanced / rankEnthusiast / rankExploring / rankFinding (i18n `tastingNote.blind.rank*`)
        - 정답은 wine props로 외부 주입 (handover doc §5.7 — 랜딩 하드코드를 변경)
        - 완료 시 +25 XP, BlindMaster 뱃지 진척
      </blind_variant>
    </expert_layout>

    <price_capture>
      - 두 모드 공통 하단에 "가격 입력 / Add price" 토글
      - 활성 시 가격 + 매장 선택 (드롭다운, stores mock) + 구매일
      - 저장 시 Purchase mock에 추가되어 WineDetail의 PriceChart에 즉시 반영 (시안 메모리)
      - i18n `tastingNote.priceCapture.*`
    </price_capture>

    <save_action>
      - "저장 / Save" 클릭 시 다음 처리 동시 진행:
        - TastingNote 추가
        - 가격 입력 시 Purchase 추가
        - peakEstimateYear 입력 시 CommunityPeakEstimate 추가 (해당 와인의 CommunityPeakAggregate가 즉시 갱신되어 와인 상세에서 확인 가능)
        - 사진 추가 시 LabelPhoto 추가 (라벨 사진 갤러리에 즉시 반영)
        - XP 적립 토스트 "+{xpEarned} XP"
          - beginner: +10
          - expert white/red/sparkling: +20
          - expert blind: +25
          - 사진 첨부: +5
          - 가격 입력: +5
          - peakEstimateYear 입력 (L3+): +5
        - 1초 뒤 router.back to home
      - 누적된 XP는 React Context로 보유 (새로고침 시 리셋, 시연용)
    </save_action>

    <bottom_nav>숨김 (작성 중)</bottom_nav>
  </note_write_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- CELLAR (/cellar, /cellar/[id])                              -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <cellar_list_page>
    <header>AppHeader 또는 BackHeader 두 가지 다 호환 (탭에서 진입 시 AppHeader)</header>
    <title_bar>"내 셀러 / My cellar" (Playfair 24px Cream, padding 16px 20px) + 우측 "+ 등록 / + Add" 버튼</title_bar>
    <sort_filter_chip_row>
      - 가로 스크롤 칩 6개: "최근 / Recent", "마시기 좋은 시점 / Drink soon", "빈티지 / Vintage", "지역 / Region", "보관 위치 / Storage", "가격대 / Price"
      - 칩 클릭 시 정렬 변경 (시안에서는 mock 데이터를 정렬해 보여주기만)
    </sort_filter_chip_row>
    <cellar_card_grid>
      - 2열 그리드, gap 12px, 좌우 마진 16px
      - 헤비 유저: 28개 카드, first-time: 0개 (empty state)
      - 각 카드 168×220px:
        - 상단: 와인 라벨 일러 (160×140, bottleColor 기반 그라데이션)
        - 중단: 와인명 (Playfair 14px Cream, 1줄 truncate) + 빈티지 (Inter 12px Muted)
        - 하단: drink_window_badge (작은 칩) — "지금 마시기 좋아요 / Drink now" (Gold) / "2027년부터 / From 2027" (Muted) / "절정 / Peak" (Wine Red)
      - 카드 클릭 시 /cellar/[id]
    </cellar_card_grid>
    <empty_state_first_time>
      - 큰 일러 (와인잔 마크 흐릿)
      - "셀러가 비어있어요 / Your cellar is empty"
      - "와인을 등록하면 보관·음용 시점 알림을 받을 수 있어요 / Add wines to get drinking-time alerts"
      - CTA "첫 와인 등록 / Add first wine" → /capture
    </empty_state_first_time>
    <bottom_nav>셀러 탭 활성</bottom_nav>
  </cellar_list_page>

  <cellar_item_detail_page>
    <header>BackHeader 와인명 (truncate)</header>
    <wine_hero>
      - 상단 240px 영역: 라벨 일러 + bottleColor 그라데이션 배경
      - 와인명 (Playfair 24px Cream), 생산자, 빈티지
      - 지역 + 국가 (i18n LocalizedString)
    </wine_hero>
    <drink_window_card>
      - Surface 카드, padding 16px
      - 시각화: 가로 타임라인 바 (drinkWindow.from ~ to)
      - 현재 시점 마커 (수직선 + 점)
      - 우측 상태 라벨 "지금 마시기 좋아요 / Drink now" + 보조 "절정 까지 +2년 / +2 years to peak"
      - 하단 텍스트 (i18n `cellar.drinkWindow.tip`): "이 와인은 ___년에 절정에 도달합니다 / This wine peaks in ___"
    </drink_window_card>
    <notify_toggle>
      - "절정 시점에 알림받기 / Notify me at peak" 스위치 (notifyAtPeak)
      - 토글 시 BottomSheet 열림 "{peakYear}년에 푸시 알림을 보내드릴게요 / We'll send a push in {peakYear}" + "확인 / Confirm" + "다른 시점 / Different time" 옵션
    </notify_toggle>
    <meta_grid>
      - 2×2 그리드: 보관 위치, 구매일, 구매가, 메모 (편집 가능 placeholder)
    </meta_grid>
    <drink_this_button>
      - 화면 하단 고정 (위 콘텐츠는 스크롤), 풀폭 PrimaryCTA 변형
      - "이 와인 마시기 / Drink this wine" + 우측 GlassWater 아이콘
      - 클릭 시 ConfirmDialog "셀러에서 이 와인을 마셨다고 기록할까요? / Mark as consumed?" — 확인 시 /notes/new/write?from=cellar&itemId={id} (셀러 자동 prefill)
    </drink_this_button>
    <community_reviews_section>
      - 와인 카탈로그의 다른 사용자 리뷰 3개 노출 (review-card)
      - 각 리뷰 카드: 리뷰어 닉네임 + LevelPill + 보유 뱃지 1~2개 (ReviewBadge) + 본문 + 평점
      - "와인 상세 보기 / See wine details" 링크 → /wine/{wineId}
    </community_reviews_section>
  </cellar_item_detail_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- WINE DETAIL (/wine/[id])                                    -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <wine_detail_page>
    <header>BackHeader "{wineName}" + 우측 즐겨찾기 토글 (Star, 채워지면 Gold fill)</header>
    <wine_header>
      - 상단 240px: 라벨 일러 + 그라데이션
      - 와인명, 생산자, 빈티지, 지역/국가
      - 칩 행: wineType, grapes (LocalizedString)
      - 우하단 ServingTemp 미니 칩 "16-18°C 권장" (클릭 시 GlossaryTooltip "시음 온도 / Serving temperature")
    </wine_header>

    <external_ratings_card>
      - 베타 피드백 반영 — Vivino / Wine Searcher / CellarTracker 점수 한 줄 노출
      - 240px 가로 카드, padding 16px, Surface 배경
      - 좌→우 3개 RatingPill:
        - Vivino: 큰 별점 (예: ★4.5/5) + 작은 리뷰 카운트 ("12,450 reviews")
        - Wine Searcher: 점수 (예: 93/100) + priceRank ("Top 10% of Bordeaux")
        - CellarTracker: 점수 (예: 92/100) + reviewCount
      - 우측 끝에 "글로벌 평균가 / Global avg" $480 USD
      - 카드 푸터 "마지막 동기화: 2026-04-30 / Last synced: 2026-04-30" + 작은 (i) 버튼 → 시안 mock임을 알리는 토스트
      - 베타 피드백("Vivino/WS/CT 점수 연동") 직접 반영
    </external_ratings_card>

    <average_price_pill>
      - Surface 카드 mini
      - 좌측 "평균 구매가 / Average price" (Inter 12px Muted)
      - 우측 "₩{averagePriceKrw} / ${usd}" (Playfair 20px Cream)
      - 하단 "{n}건 등록 / {n} entries" (Inter 11px Muted)
    </average_price_pill>
    <price_chart>
      - 240px 높이, padding 16px, Surface 배경, border-radius 16px
      - 제목 "가격 추이 / Price history" + 우측 기간 토글 (3M / 1Y / All)
      - Recharts LineChart:
        - X축: 날짜 (월/연도)
        - Y축: 가격 (₩)
        - 라인: Wine Red 2px stroke + Gold dot
        - 그리드: 1px dashed #2D1540, opacity 0.4
        - 평균선: 1px dashed Gold
        - 추세선 (선택, 시안에서는 단순 평균만)
      - 점 hover (데스크톱)/tap (모바일) 시 툴팁: "₩680,000 · 신세계 백화점 본점 · 2025-08 / ₩680,000 · Shinsegae Main · 2025-08"
      - 하단 우측 "상세보기 / View details" 버튼 → /wine/[id]/prices
      - first-time 모드에서도 이 페이지는 동일하게 mock 데이터로 노출 (가격 데이터는 공용)
    </price_chart>
    <community_drink_window_card>
      - 베타 피드백 반영 — 와진사 의견: "전문가 노팅에서 사용자들이 각자 추정한 음용 적기를 집계해 보여주기"
      - Surface 카드, padding 16px, border-radius 16px
      - 제목 "커뮤니티 음용 적기 / Community drinking window" + 좌측 Users 아이콘 (lucide)
      - 부제 "전문가 {count}명이 추정한 절정 시점 / Estimated by {count} experts (L3+)"
      - 시각화:
        - 가로 분포 히스토그램 (연도 X축, 응답 수 Y축, 막대 차트)
        - 시스템 추정 peak를 점선 마커로 (예: 2028)
        - 커뮤니티 가중 평균을 실선 마커로 (예: 2030 — 사용자들은 시스템보다 2년 늦게 봄)
        - 상단 큰 텍스트 "평균 2030 · 중앙값 2029 / Mean 2030 · Median 2029" (Playfair 20px Cream)
        - 응답 분포 한 줄 카피 (i18n): "32명 중 78%가 2028~2032 사이를 추천 / 78% of 32 reviewers suggest 2028-2032"
      - 우하단 "상세 보기 / Details" 버튼 → /wine/[id]/community-peak
      - 데이터 0건일 때 빈 상태: "아직 추정 데이터가 부족해요. 전문가 노트에서 입력해주세요 / Not enough data. Add an estimate in your expert note."
    </community_drink_window_card>

    <wine_story_card>
      - 베타 피드백 반영 — 와진사 의견: "와이너리, 생산자의 역사나 재밌는 이야기"
      - 240px 높이 카드, Surface 배경, border-radius 16px
      - 좌상단 작은 라벨 "와이너리 이야기 / Winery story" (Inter 500 12px Gold)
      - 큰 제목 (Playfair 22px Cream) — wineryName + foundedYear (예: "Château Margaux · 1572")
      - 위치 (Inter 13px Muted) — "보르도, 메독, 마고 / Bordeaux, Médoc, Margaux"
      - 본문 2~3문장 발췌 (LocalizedString — 시안 mock):
        - 한국어 예시: "16세기 마고 영지에서 시작된 보르도 1등급 샤또. 1855년 등급 분류에서 5개 1등급 와인 중 하나로 지정됐다."
        - 영어 예시: "A First Growth Bordeaux estate dating to the 16th century. One of five Premier Cru Classé in the 1855 Classification."
      - 좌상단 호버 시 funFact 미리보기 (Lightbulb 아이콘) — "재미있는 이야기 / Fun fact" 한 줄
      - 우하단 "더 읽기 / Read more" 버튼 → /wine/[id]/story
    </wine_story_card>

    <reviews_section>
      - 제목 "리뷰 / Reviews" + 정렬 토글 (최근 / 평점 높은 순)
      - 카드 5개 (헤비 모드), 각 카드:
        - 상단 행: 닉네임 + LevelPill (예: "L3 Connoisseur" Gold) + ReviewBadge × up to 2 (작은 아이콘)
        - 본문 (LocalizedString)
        - 우하단 평점 (별점 또는 100점)
        - 작성일 (상대 시간)
      - 클릭 시 /profile/{userId}
    </reviews_section>
    <add_to_cellar_cta>
      - 화면 하단 고정 (or page 하단)
      - "셀러에 추가 / Add to cellar" → /capture로 이동 (셀러 등록 흐름 mock)
    </add_to_cellar_cta>
  </wine_detail_page>

  <wine_price_detail_page>
    <header>BackHeader "가격 상세 / Price details"</header>
    <chart_full>
      - 화면 상단 1/3에 더 큰 price_chart (전체 기간)
    </chart_full>
    <store_list>
      - 제목 "매장별 등록 / By store"
      - 리스트 (purchases 모두 펼침, store별 그룹):
        - 매장명 (LocalizedString) + 지점
        - 가격 + 구매일
        - 작성자 익명화 (예: "Wine Master Lv.4" / "Beginner Lv.1" — 레벨/뱃지만 노출, 닉네임은 마스킹)
        - 우측 ChevronRight (작성자 프로필로 이동 → /profile/[userId])
      - 정렬 토글: 가격 낮은 순 / 최근 순 / 평점 높은 매장
    </store_list>
    <add_my_price>
      - 화면 하단 고정 "내 구매 정보 등록 / Add my purchase info"
      - 클릭 시 BottomSheet 폼 (가격 + 매장 + 일자) — 저장 시 +5 XP 토스트
    </add_my_price>
  </wine_price_detail_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- PROFILE (/profile, /profile/[userId])                       -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <my_profile_page>
    <header>AppHeader (탭 진입 시) 또는 BackHeader</header>
    <profile_hero>
      - 상단 200px Surface 카드
      - 좌측 아바타 80×80 원형 Wine Red, 첫 글자
      - 우측 위에서 아래:
        - 닉네임 (Playfair 22px)
        - LevelPill + 보유 뱃지 row (최대 5개 인라인, 더 있으면 "+n")
        - 가입일 "함께한 지 8개월 / 8 months together"
      - 하단 LevelProgressBar (현재 XP/다음 레벨까지)
    </profile_hero>
    <stat_grid>
      - 4 칸: 마신 와인, 국가, 지역, 노트 수
    </stat_grid>
    <quick_links>
      - 리스트 행 5개:
        - 즐겨찾기 / Favorites → /favorites
        - 뱃지 진열장 / Badges → /badges
        - 알림 / Notifications → /notifications
        - 설정 / Settings → /settings
        - 로그아웃 / Sign out → 토스트 placeholder
    </quick_links>
    <bottom_nav>프로필 탭 활성</bottom_nav>
  </my_profile_page>

  <other_profile_page>
    <description>라우트 `/profile/[userId]`. 와인 지도가 최상단.</description>
    <header>BackHeader "{otherUser.displayName}" + 우측 팔로우 버튼 (placeholder)</header>
    <user_map_hero>
      - 화면 상단 280px
      - MiniWorldMap (그 사용자의 와인 핀들로 그려짐 — mock)
      - 좌하단 오버레이: 닉네임 + LevelPill + 보유 뱃지 row (3개 인라인)
    </user_map_hero>
    <taste_compatibility_card>
      - Surface 카드, padding 20px
      - 좌측 큰 원형 진행 표시 (60×60, Gold/Cream): "nn%"
      - 우측 텍스트:
        - "취향 일치도 / Taste match" (Inter 500 13px Muted)
        - "{matchPercent}%" 큰 숫자 (Playfair 28px Cream)
        - 설명 "둘 다 마신 와인: {sharedCount}병 · 비슷한 산지: {sharedRegions}개 / Shared wines: {sharedCount} · Shared regions: {sharedRegions}" (Inter 12px Muted)
      - 진행 표시는 0~100%로 동적 (lib/compatibility.ts에서 계산)
      - 클릭 시 상세 모달: 어떤 와인이 겹치는지 리스트 노출
    </taste_compatibility_card>
    <other_user_wine_list>
      - 제목 "마신 와인 / Wines tasted" + 정렬 토글
      - 카드 리스트 (헤비 모드 다른 유저: 50+ 와인, 가로 스크롤 또는 세로 스크롤)
      - 각 카드: 라벨 일러 + 와인명 + 빈티지 + 별점 + (있다면 메모 1줄)
      - 클릭 시 /wine/[id]
    </other_user_wine_list>
    <bottom_nav>유지 (없는 게 더 깔끔하면 숨김 — 시안 결정: 유지)</bottom_nav>
  </other_profile_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- SETTINGS                                                    -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <settings_page>
    <header>BackHeader "설정 / Settings"</header>
    <sections>
      - **앱 / App**
        - 언어 / Language — 현재 값 표시 ("한국어" / "English") → /settings/language
        - 와인 경험 / Wine experience — 현재 값 ("입문자" / "Beginner") → /settings/experience
      - **알림 / Notifications**
        - 알림 설정 / Notification settings → /settings/notifications
      - **계정 / Account**
        - 닉네임 변경 → 토스트 placeholder
        - 로그아웃 → 토스트 placeholder
      - **정보 / About**
        - 버전 1.0.0 (시안)
        - 이용약관 / Terms (i18n)
        - 개인정보처리방침 / Privacy (i18n)
    </sections>
  </settings_page>

  <language_settings_page>
    <header>BackHeader "언어 / Language"</header>
    <radio_list>
      - 한국어 / Korean (체크 상태)
      - English (체크 상태)
    </radio_list>
    <note>선택 즉시 적용 + 토스트 "언어가 변경되었어요 / Language updated", router.back</note>
  </language_settings_page>

  <experience_settings_page>
    <header>BackHeader "와인 경험 / Wine experience"</header>
    <radio_list>
      - 입문자 / Beginner — 부가설명 카드
      - 전문가 / Expert — 부가설명 카드
    </radio_list>
    <note>변경 즉시 적용 + 토스트, router.back. 다음에 작성하는 노트부터 새 UI</note>
  </experience_settings_page>

  <notification_settings_page>
    <header>BackHeader "알림 / Notifications"</header>
    <toggles>
      - 즐겨찾기 와인 가격 알림 (FavoriteWine.notifyOnPurchase 그룹 기본값)
      - 셀러 음용 시점 알림
      - 뱃지·레벨업 알림
      - 커뮤니티 알림 (좋아요 등)
    </toggles>
    <note>토글 변경 시 localStorage에 저장만 (시안). 실제 푸시 미연결.</note>
  </notification_settings_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- NOTIFICATIONS / FAVORITES / BADGES                          -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <notification_list_page>
    <header>BackHeader "알림 / Notifications" + 우측 "모두 읽음 / Mark all read"</header>
    <list>
      - mock 12개 알림 (read/unread mix)
      - 각 행 90px:
        - 좌측 kind에 따른 아이콘 색 바 (favoritePurchase Wine Red, drinkWindowReached Gold, badgeEarned Cream, levelUp Gold gradient)
        - 제목 (LocalizedString)
        - 본문 한 줄 (LocalizedString, truncate)
        - 우측 시간 (상대) + 미읽음 점
      - 클릭 시 kind별 deep route 이동
        - favoritePurchase → /wine/[id]
        - drinkWindowReached → /cellar/[id]
        - badgeEarned → /badges
        - levelUp → /profile
    </list>
  </notification_list_page>

  <favorites_list_page>
    <header>BackHeader "즐겨찾기 / Favorites"</header>
    <list>
      - 즐겨찾기 와인 카드 (헤비 유저 7개)
      - 각 카드: 라벨 일러 + 와인명 + 빈티지 + 평균가 + notifyOnPurchase 스위치
      - 카드 클릭 시 /wine/[id], 스위치 토글 시 토스트
    </list>
    <empty>first-time: "즐겨찾기한 와인이 없어요 / No favorites yet"</empty>
  </favorites_list_page>

  <badge_shelf_page>
    <header>BackHeader "뱃지 / Badges" + 우측 "{owned}/{total}"</header>
    <tier_filter_chips>전체 / Bronze / Silver / Gold / Platinum</tier_filter_chips>
    <grid>
      - 3열 그리드, gap 16px
      - 각 셀: 뱃지 아이콘 80×80 (보유면 컬러, 미보유는 흑백+lock 오버레이) + 이름 (LocalizedString) + tier 색 점
      - 클릭 시 BottomSheet: 획득 조건 (i18n LocalizedString), 보유 시 획득일
    </grid>
    <badge_catalog>
      - badge_001 first-bottle (Bronze) — "첫 한 병 / First Bottle"
      - badge_002 globe-trotter-5 (Silver) — "5개국 여행자 / 5-Country Trotter"
      - badge_003 globe-trotter-10 (Gold) — "10개국 여행자 / Globe Trotter"
      - badge_004 burgundy-pilgrim (Silver) — "부르고뉴 순례자 / Burgundy Pilgrim" — 부르고뉴 5병
      - badge_005 bordeaux-baron (Silver) — "보르도 남작 / Bordeaux Baron" — 보르도 5병
      - badge_006 blind-master (Gold) — "블라인드 마스터 / Blind Master" — 10번 블라인드
      - badge_007 cellar-curator (Silver) — "셀러 큐레이터 / Cellar Curator" — 50병 보관
      - badge_008 sommelier-tongue (Gold) — "소믈리에의 혀 / Sommelier's Tongue" — 100 노트
      - badge_009 price-hunter (Bronze) — "가격 추적자 / Price Hunter" — 20 가격 등록
      - badge_010 fault-finder (Bronze) — "결함 발견자 / Fault Finder" — 결함 5회 기록
      - badge_011 caudalie-keeper (Bronze) — "카우달리 키퍼 / Caudalie Keeper" — 카우달리 측정 10회
      - badge_012 grand-cru-collector (Platinum) — "그랑 크뤼 수집가 / Grand Cru Collector" — 그랑크뤼 5병
    </badge_catalog>
  </badge_shelf_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- WINE STORY (/wine/[id]/story)                               -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <wine_story_page>
    <description>라우트 `/wine/[id]/story`. 와이너리/생산자의 역사·재밌는 이야기. 베타 피드백 직접 반영.</description>
    <header>BackHeader "와이너리 이야기 / Winery story"</header>
    <story_hero>
      - 상단 240px: producerPhotoUrl placeholder (시안에서는 그라데이션 + WineryIcon) + 어두운 오버레이
      - 와이너리 이름 (Playfair 32px Cream)
      - 설립년도 + 위치 (Inter 14px Secondary)
    </story_hero>
    <history_section>
      - 제목 "역사 / History"
      - 본문: WineStory.history (LocalizedString, 3~4문단)
      - 모든 와인 도메인 용어에 GlossaryTooltip 인라인 (아펠라시옹, 그랑크뤼, 1855 등급 분류 등)
    </history_section>
    <fun_fact_card>
      - Gold 보더 박스 (Surface 배경 + Wine Red 1px 글로우)
      - 좌측 Lightbulb 아이콘 20px Gold
      - "재미있는 이야기 / Fun fact" (Inter 600 13px Gold)
      - 본문: WineStory.funFact (LocalizedString, 1~2문장)
    </fun_fact_card>
    <philosophy_section>
      - 제목 "양조 철학 / Winemaking philosophy"
      - 본문: WineStory.philosophy (있을 때만)
    </philosophy_section>
    <meta_grid>
      - 2×2: 설립년도 / 포도밭 면적 / 주요 품종 / 연 생산량 (시안 mock)
    </meta_grid>
    <bottom_cta>"이 와인 다시 보기 / Back to wine" → /wine/[id]</bottom_cta>
  </wine_story_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- COMMUNITY PEAK DETAIL (/wine/[id]/community-peak)           -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <community_peak_detail_page>
    <description>라우트 `/wine/[id]/community-peak`. 사용자들의 음용 적기 추정 분포 상세. 베타 피드백 직접 반영.</description>
    <header>BackHeader "커뮤니티 음용 적기 / Community drinking window"</header>
    <intro_card>
      - 한 문단 안내 (i18n): "다른 사용자들이 추정한 절정 시점입니다. 시스템 추정과 비교해 보세요. / Estimates from other users (L3+ only). Compare with system suggestion."
      - 신뢰도 안내: "L4/L5 사용자의 추정은 가중치 1.5배가 적용됩니다 / L4/L5 estimates are weighted 1.5x"
    </intro_card>
    <comparison_chart>
      - 큰 히스토그램 (높이 280px) — 연도별 응답 수 막대
      - 위쪽 시스템 추정 peak 점선 (Gold)
      - 위쪽 커뮤니티 가중 평균 실선 (Wine Red)
      - 위쪽 중앙값 점선 (Cream)
      - 막대 위 마우스 hover/tap 시 해당 연도 응답자 수 + 응답자 레벨 분포
    </comparison_chart>
    <reviewer_list>
      - 제목 "추정자 목록 / Contributors" + 정렬 토글 (최근 / 레벨 높은 순)
      - 카드 리스트 (헤비 mock 32개):
        - 좌측: 익명화 이름 ("Connoisseur #14" 형식 — 닉네임 마스킹) + LevelPill
        - 우측: 추정 연도 + 확신도 칩 (low/medium/high, 색상 다름)
        - 본문 한 줄 메모 (있으면)
      - 카드 클릭 시 /profile/[userId] (시안에서는 익명화 유지)
    </reviewer_list>
    <add_my_estimate_cta>
      - 화면 하단 고정 "내 추정 추가 / Add my estimate"
      - 클릭 시 /notes/new/write 또는 BottomSheet 폼 (사용자가 이 와인의 노트를 가지고 있으면 그 노트 편집, 없으면 새 노트로 유도)
      - L3 미만 사용자: 버튼 disabled + "L3 Connoisseur부터 추정 입력 가능 / Available from L3 Connoisseur" 안내
    </add_my_estimate_cta>
  </community_peak_detail_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- LABEL PHOTO ARCHIVE (/photos)                               -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <label_photo_archive_page>
    <description>
      라우트 `/photos`. 사용자가 스캔하거나 첨부한 모든 와인 라벨 사진을 시간순/지역별로 모아보는 갤러리.
      베타 피드백 ("옛날에 먹은거 뭔지 찾아 볼라면 갤러리 저 밑에있는거 끄집어 내야되는데") 직접 반영.
    </description>
    <header>BackHeader "라벨 사진 / Label photos" + 우측 검색 아이콘</header>
    <photo_filter_bar>
      - 가로 스크롤 칩 6개:
        - "전체 / All"
        - "올해 / This year"
        - "셀러 / In cellar"
        - "마신 / Tasted"
        - "지역별 / By region" (드릴다운)
        - "미매칭 / Unmatched" (와인 정보가 자동 매칭 안 된 사진)
      - 칩 클릭 시 그리드 필터링
    </photo_filter_bar>
    <photo_grid>
      - 3열 그리드, gap 4px, 좌우 마진 0 (edge-to-edge)
      - 각 셀 정사각형 (약 130×130, viewport 기반):
        - photoUrl placeholder (시안: bottleColor 그라데이션 + 와인 이니셜)
        - 우상단 라벨: 매칭된 와인이면 별 아이콘, 미매칭이면 ? 아이콘
        - 우하단 작은 날짜 (relative time)
      - 클릭 시 BottomSheet — 큰 사진 + 와인 정보 + 액션 (와인 상세로 이동 / 와인 정보 수동 매칭 / 삭제)
      - 길게 누름: 선택 모드 진입 (다중 선택 + 일괄 삭제 placeholder)
    </photo_grid>
    <empty_state_first_time>
      - 큰 일러 (와인잔 마크 + 카메라 아이콘 조합)
      - "아직 라벨 사진이 없어요 / No labels yet"
      - "와인을 스캔하면 여기에 모입니다 / Scanned labels show up here"
      - CTA "스캔하기 / Scan" → /capture
    </empty_state_first_time>
    <bottom_nav>유지 (셀러 탭 활성으로 진입했을 경우)</bottom_nav>
  </label_photo_archive_page>

  <!-- ─────────────────────────────────────────────────────────── -->
  <!-- GLOSSARY (/glossary, /glossary/[term])                       -->
  <!-- ─────────────────────────────────────────────────────────── -->

  <glossary_list_page>
    <description>
      라우트 `/glossary`. 와인 도메인 용어 사전.
      베타 피드백 ("카우달리가 머에요") 직접 반영 — 입문자가 곧바로 용어 의미를 찾을 수 있도록.
    </description>
    <header>BackHeader "용어 사전 / Glossary" + 우측 검색 아이콘</header>
    <category_chips>
      - 5개 칩: 전체 / 감각 (sensory) / 결함 (fault) / 분류 (classification) / 기법 (technique) / 단위 (unit)
    </category_chips>
    <search_input>"용어 검색 / Search terms" — 한국어/영어 모두 검색</search_input>
    <entry_list>
      - 가나다순 / A~Z 정렬
      - 각 행 (72px 높이):
        - 좌측 카테고리 아이콘 (sensory→Sparkles, fault→AlertTriangle, classification→Award, technique→Beaker, unit→Ruler)
        - 용어 (LocalizedString, Playfair 16px)
        - 한 줄 미리보기 (Inter 12px Muted, definition truncate)
      - 행 클릭 시 /glossary/[term]
    </entry_list>
    <entries_seed>
      최소 12개 시드 항목:
      - caudalie (단위) — Peynaud, 보르도 와인 학교
      - residual-sugar / 잔당 (감각)
      - appellation / 아펠라시옹 (분류)
      - wset / WSET SAT (분류)
      - brett / 브렛 (결함)
      - bouchonne / 코르키 (결함)
      - tdn (감각·임팩트 화합물)
      - rotundone / 로툰돈 (감각)
      - decanting / 디캔팅 (기법)
      - terroir / 떼루아 (분류)
      - tannin-texture / 타닌 질감 (감각)
      - dosage / 도사주 (분류·스파클링)
    </entries_seed>
  </glossary_list_page>

  <glossary_entry_page>
    <description>라우트 `/glossary/[term]`. 단일 용어 상세.</description>
    <header>BackHeader 용어명</header>
    <hero>
      - 카테고리 칩 (color-coded)
      - 큰 제목 (Playfair 32px Cream) — LocalizedString
      - 부제 — 원어 (예: "한국어 발음: 카우달리 / French: Caudalie")
    </hero>
    <definition_section>
      - 본문 2~4문장 (LocalizedString)
      - 출처 (있으면 작은 인용 박스)
    </definition_section>
    <examples_section>
      - "사용 예시 / Examples" — LocalizedString
      - 예시 본문 위에 따옴표 그래픽
    </examples_section>
    <related_terms>
      - 가로 스크롤 칩 — 관련 용어들 (relatedTermIds)
      - 클릭 시 해당 /glossary/[term]로 이동
    </related_terms>
    <bottom_cta>"용어 사전 더 보기 / More terms" → /glossary</bottom_cta>
  </glossary_entry_page>

  <community_review_inline>
    <description>리뷰 카드 (wine_detail_page, cellar_item_detail_page에서 inline 사용)</description>
    <layout>
      - 상단 행: 닉네임 (Inter 600 14px Cream) + LevelPill (배경 색은 Level.color, 패딩 4px 8px, border-radius 12px, 텍스트 11px Inter 600) + ReviewBadge × 1~2 (16×16 아이콘만)
      - 본문: Inter 13px Cream, line-height 1.5
      - 하단: 별점 또는 점수, 작성일 (Muted)
      - 카드 클릭 시 /profile/[reviewerUserId]
    </layout>
    <critical_rule>
      - CRITICAL: 모든 커뮤니티 노출 위치에서 LevelPill과 ReviewBadge가 함께 표시되어야 한다. 닉네임 단독 노출 금지.
    </critical_rule>
  </community_review_inline>

  <keyboard_shortcuts_reference>
    - 본 시안은 모바일 시안이므로 키보드 단축키 미제공
    - 검수 편의: `Esc` 토스트 dismiss, `Tab` 포커스 순환
  </keyboard_shortcuts_reference>

</pages_and_interfaces>

<core_functionality>

  <i18n_switching>
    - locale 변경 시 즉시 모든 텍스트 재렌더 (next-intl 클라이언트 provider 활용)
    - LocalizedString은 항상 `<LocaleText value={item.field} />` 헬퍼로 렌더
    - CRITICAL: 영어 모드에서 한국어 글자(가나다 범위) 노출 시 ESLint custom 룰 또는 dev 검수로 잡는다
    - 와인명 같은 고유명사(Château Margaux)는 두 locale 공통으로 영어 유지
    - 한국어 모드에서 영어 보조 표기(아펠라시옹 — Appellation)는 i18n 키 자체에 "한국어 (영어)" 형태로 작성
  </i18n_switching>

  <mode_switching>
    - demoMode (first-time / heavy):
      - useMockUser 훅이 mode에 따라 다른 currentUser 반환
      - 모든 mock 데이터 fetch가 currentUser.id로 필터링 — heavy 사용자에는 풍부한 데이터, first-time 사용자에는 빈 컬렉션
      - 변경 시 즉시 페이지 리렌더, 일부 화면(/cellar, /map)은 empty state로 swap
    - experience (beginner / expert):
      - 테이스팅 노트 작성 화면(/notes/new/write)이 분기
      - 다른 화면에서도 일부 카피·툴팁이 다르게 (예: 와인 상세에서 "WSET 디스크립터" 섹션은 expert에서만)
  </mode_switching>

  <xp_and_level_system>
    - XP 적립 액션 (mock으로 시뮬레이션):
      - 셀러 등록: +5
      - 입문자 노트: +10
      - 전문가 노트: +20
      - 사진 첨부: +5
      - 가격 등록: +5
      - 새 국가 첫 와인: +30
      - 새 지역 첫 와인: +15
      - 커뮤니티 리뷰 작성: +15
      - 블라인드 완료: +25
    - 레벨 5단계:
      - L1 Novice (와인 입문자 / Novice) — 0~99 XP — Cream #F5F0E8
      - L2 Enthusiast (와인 애호가 / Enthusiast) — 100~499 — Gold soft #D4B85C
      - L3 Connoisseur (와인 감별사 / Connoisseur) — 500~1499 — Gold #C9A84C
      - L4 Sommelier (소믈리에 / Sommelier) — 1500~3999 — Wine Red #8B1A2A
      - L5 Master (마스터 / Master) — 4000+ — Platinum gradient (Gold→Cream)
    - 헤비 유저 시작 상태: XP 1280, L3 Connoisseur, 다음 레벨까지 219 XP
    - 시안 동작: 노트 작성 등 액션 시 +XP 토스트 + LevelProgressBar 애니메이션. localStorage에 저장 X (새로고침 시 리셋)
  </xp_and_level_system>

  <cellar_tracking>
    - 셀러 등록 흐름: /capture → "셀러에 보관" → 라벨 스캔(placeholder) → 와인 정보 채움 → 보관 위치/구매가/구매일 → "절정 시점에 알림받기?" 토글 → 저장
    - 음용 시점 계산 (`lib/drink-window.ts`):
      - vintage + grape/region별 기본 숙성 곡선
      - 예: Bordeaux Cab 블렌드 = +5~15년, Burgundy Pinot = +3~10년, Champagne NV = 즉시~5년
      - 절정 = (from + to) / 2 또는 region별 평균 peak offset
    - 셀러 카드의 drink_window_badge:
      - 현재 < drinkWindow.from: "{from-currentYear}년 후 / In {n} years" Muted
      - drinkWindow.from <= 현재 <= drinkWindow.to: "지금 마시기 좋아요 / Drink now" Gold
      - 절정 ±1년: "절정 / At peak" Wine Red
      - 현재 > drinkWindow.to: "꼭 빨리 마시세요 / Drink soon!" 빨강 강조
    - "이 와인 마시기" 클릭 시 ConfirmDialog → /notes/new/write?from=cellar&itemId=X — 노트 작성 후 저장 시 CellarItem mock에서 제거 (시안 메모리)
  </cellar_tracking>

  <price_tracking>
    - Purchase 등록 진입점 2곳: (a) 셀러 등록 시 가격 입력, (b) 노트 작성 시 가격 토글
    - 등록된 Purchase는 `mock/purchases.ts`에 누적되어 와인 상세 페이지의 PriceChart에 즉시 반영 (시안 메모리)
    - PriceChart는 X축 시간, Y축 가격으로 점·선·평균선 표시
    - 점 hover/tap 시 작성자(익명화 — Lv·뱃지만)·매장·일자 툴팁
    - 상세보기 → /wine/[id]/prices에서 매장별 그룹 리스트
  </price_tracking>

  <favorites_and_notifications>
    - 즐겨찾기 토글: 와인 상세 페이지 우상단 Star, FavoritesContext에 wineId 저장 (localStorage 동기화)
    - 푸시 알림 mock 시뮬레이션:
      - FeatureFlagPanel 또는 DemoControls에 "푸시 알림 시뮬 / Trigger push" 버튼
      - 누르면 즐겨찾기 와인 중 랜덤 한 개에 대해 새 Notification mock 추가 + 화면 우상단 토스트 슬라이드인
      - 토스트 클릭 시 /wine/[id]로 이동, 즉시 PriceChart 새 데이터 포인트 노출
    - 알림 권한 등 실제 OS API는 미사용
  </favorites_and_notifications>

  <tasting_note_engine>
    - handover doc (docs/tasting-note-app-handover.md)에 명시된 4 레이어를 본 프로젝트에 그대로 적용:
      - L1 lexicon (`lib/tasting-note-lexicon.ts`) — 그대로 import
      - L2 9개 재사용 컴포넌트 — `components/tasting-note/`에 신규 포팅 (입력 state는 부모 useReducer)
      - L3 페이지 컨테이너 — playground 패턴 따라 새로 작성 (Step 1~7 expert / 단일 BeginnerNote beginner)
      - L4 i18n + wine-icons — 키 구조 동기 + 60+ SVG 인라인
    - reducer state 형태는 handover doc §3.1 그대로 + servingTempCelsius/peakEstimateYear/peakEstimateConfidence/peakEstimateNote 추가
    - 영구 저장 모델은 `TastingNote` (handover doc §3.2) 그대로 채택
    - 헬퍼 함수 `matchOpeningGuide(meta)`, `caudalieComparison(c, locale)`, `caudalieCategory(c)` 그대로 사용
    - 자동 묘사 문장 생성 `buildSentence()` (auto-description.tsx)는 servingTemp/peakEta 토큰을 placeholder에 추가
  </tasting_note_engine>

  <regional_aroma_recommendation>
    - 베타 피드백 반영 — DC 와인갤러리 의견: "샴페인/BDM/바롤로/보졸레 차이에 맞게 노트가 뜨면 좋겠어요"
    - `lib/regional-aromas.ts`에서 region+grape → 시그니처 lex id 배열 매핑
    - 시드 매핑 (확장 가능):
      - Champagne — brioche, yeast, apple, hazelnut, citrus, biscuit (lex id)
      - Brunello di Montalcino (Sangiovese) — cherry, leather, tobacco, dried-herb, balsamic
      - Barolo (Nebbiolo) — rose, tar, truffle, cherry, dried-rose, licorice
      - Beaujolais (Gamay) — banana, cherry, bubblegum, violet, fresh-red-berry
      - Bordeaux Left Bank (Cab Sauv blend) — cassis, cedar, pencil-shaving, graphite, blackcurrant
      - Burgundy Côte de Nuits (Pinot Noir) — strawberry, raspberry, mushroom, forest-floor, violet
      - Burgundy Côte de Beaune (Chardonnay) — hazelnut, butter, citrus, mineral, white-flower
      - Mosel Riesling — petrol, lime, slate, white-peach, apricot
    - `<RegionalAromaHints />` 컴포넌트가 와인 메타 받아 자동 표시
  </regional_aroma_recommendation>

  <community_peak_aggregation>
    - 베타 피드백 반영 — 와진사 의견: "전문가 노팅에서 각자 추정한 적기를 데이터 수집해 보여주기"
    - 사용자가 expert note 작성 시 peakEstimateYear 입력 (L3+ 사용자만)
    - 저장 시 CommunityPeakEstimate에 push (시안에서는 메모리)
    - `lib/community-peak-aggregator.ts`:
      - 가중치: L3 = 1.0, L4 = 1.5, L5 = 2.0
      - 평균: 가중 산술 평균
      - 중앙값: 가중치 적용 분포의 중앙값
      - 분포: 연도별 가중 응답 수 (히스토그램용)
    - 와인 상세 페이지의 CommunityDrinkWindowCard와 /wine/[id]/community-peak에서 시각화
    - 사용자 입력 즉시 집계가 갱신되어 데모 효과 — "내가 방금 입력한 게 분포에 추가됐어요" 시연
  </community_peak_aggregation>

  <external_ratings_display>
    - 베타 피드백 반영 — Vivino, Wine Searcher, CellarTracker 점수 + 글로벌 평균가
    - `mock/external-ratings.ts`에 와인 60개 중 12개에 점수 시드 (나머지는 null → 카드 자리에 "외부 평점 없음" 표시)
    - 카드 푸터에 "시안 mock 데이터 / Mock data only" 명확히 표기 (실제 API 미연동)
    - 추후 Phase 3에서 실제 API 키 연동
  </external_ratings_display>

  <label_photo_capture>
    - 베타 피드백 반영 — 지인 의견: "라벨 사진 모아놓을 곳"
    - 사진 추가 진입점:
      - /capture에서 "라벨 스캔" 클릭 시
      - 노트 작성 Step 1에서 "사진 추가" 클릭 시
      - 셀러 등록 시
    - 시안에서 실제 카메라/파일 업로드는 placeholder — 클릭 시 mock LabelPhoto 자동 추가 (랜덤 photoUrl 자리에 SVG 라벨 일러)
    - LabelPhoto는 와인 ID와 자동 연결 (노트에서 추가 시) 또는 미매칭으로 등록
    - /photos에서 시간순/지역별로 갤러리 노출, 미매칭 사진은 "와인 정보 매칭" 액션
  </label_photo_capture>

  <glossary_inline_tooltips>
    - 베타 피드백 반영 — DC 의견: "카우달리가 뭐예요"
    - 인라인 (i) 아이콘 패턴을 모든 도메인 용어 옆에 배치:
      - 카우달리 (CaudalieMeter 우상단)
      - 잔당 (Beginner 단맛 슬라이더)
      - 아펠라시옹 (와인 메타 카드)
      - WSET SAT (전문가 모드 intro)
      - 결함 11종 각각 (FaultChecklist 카드)
      - 도사주 (BubblePanel)
      - 떼루아·그랑크뤼 (와인 스토리)
    - 클릭 시 작은 팝오버 (max-width 280px) + 본문 2~3문장 + "더 알아보기 / Learn more" 링크 → /glossary/[term]
    - `<GlossaryTooltip termId="caudalie" />` 헬퍼 컴포넌트로 일관 처리
  </glossary_inline_tooltips>

  <taste_compatibility>
    - 알고리즘 (`lib/compatibility.ts`):
      - currentUser와 otherUser 둘 다 마신 와인의 교집합 비율
      - 보너스: 같은 지역 와인 다수, 같은 grape 선호도, 비슷한 평점 분포
      - 결과 0~100% 정수
      - 시안: 단순화하여 `sharedWines.length / max(myWines, theirWines) * 100` + 지역 가중치
    - 헤비 유저 ↔ otherUser 3명에 대해 각각 다른 % (예: 67%, 42%, 89%)
  </taste_compatibility>

  <feature_flag_panel_decision>
    - 패널은 키스크린뿐 아니라 모든 deep screen에도 표시 (데스크톱 ≥1280px)
    - 화면별로 표시 항목 다르게: 현재 화면의 주요 컴포넌트들을 planned/considering/dropped로 토글
    - 토글이 considering/dropped면 해당 컴포넌트에 `data-feature-status` 속성 부여, Tailwind selector로 opacity/grayscale
    - 새로고침 시 모든 flag는 considering으로 리셋
  </feature_flag_panel_decision>

  <demo_controls>
    - 데스크톱 ≥1024px에서 DeviceFrame 좌측에 320px 사이드 패널
    - 토글 3개 (라디오):
      - 데모 모드: first-time / heavy
      - 와인 경험: beginner / expert
      - 언어: ko / en
    - 추가 버튼:
      - "온보딩 다시 보기 / Replay onboarding" — onboardingComplete=false 후 /onboarding
      - "푸시 시뮬 / Trigger push" (위 favorites_and_notifications 참고)
      - "+50 XP 추가" — 디버그용
      - "셀러 항목 1개 추가" — 디버그용
    - 모든 변경은 URL 파라미터에도 반영해 URL을 복사하면 동일한 상태가 재현 가능
  </demo_controls>

</core_functionality>

<error_handling>
  <user_facing>
    <toast_notifications>
      - 단일 종류: 정보성 placeholder (Gold 보더 또는 Wine Red 강조)
      - 2.5s 자동 dismiss, 동시 최대 1개
      - XP 적립 시 별도 variant: 좌측 Sparkles Gold + "+10 XP" 라벨
    </toast_notifications>
    <form_validation>
      - 입력 검증 없음 (시안). 폼은 시각적으로만.
    </form_validation>
    <error_pages>
      - 404: /[anything]가 매칭 안 되면 "이 화면은 시안에 없어요 / Not in mockup" + "홈으로 / Home" 버튼
      - 500/throw: ErrorBoundary fallback "시안 로딩 실패. 새로고침해주세요 / Mockup failed to load"
    </error_pages>
  </user_facing>
  <error_boundaries>
    - 각 라우트 page에 React Error Boundary 권장. 최소한 app/layout.tsx에 1개
  </error_boundaries>
  <map_failures>
    - world-110m.json 로드 실패 시 silent fallback (지도 자리 비움, 콘솔 경고)
  </map_failures>
</error_handling>

<third_party_integrations>
  <next_intl>
    <purpose>i18n 메시지 로딩 + 클라이언트 로케일 컨텍스트</purpose>
    <sdk>next-intl v3.x</sdk>
    <setup>
      - `i18n/request.ts`에서 locale별 messages 동적 import
      - layout.tsx에서 `<NextIntlClientProvider>` 마운트
      - locale은 AppMode/Experience와 같은 컨텍스트로 동기화 (URL 우선, localStorage fallback)
    </setup>
  </next_intl>
  <recharts>
    <purpose>가격 추이 그래프</purpose>
    <sdk>recharts v2.15</sdk>
    <usage>
      - LineChart with CartesianGrid, XAxis, YAxis, Line, Tooltip, ReferenceLine(평균)
      - 다크 테마 호환 — stroke·fill 모두 CSS 변수에서
    </usage>
  </recharts>
  <no_others>실제 인증/결제/SDK 통합 없음</no_others>
</third_party_integrations>

<aesthetic_guidelines>

  <design_fusion>
    프리미엄 와인 라벨의 무게감을 모바일 앱 전 화면에 일관되게. 어두운 밤(deepest dark) 위에 깊은 와인 레드와 골드 액센트. Playfair Display 영문 디스플레이 폰트의 우아함과 Inter/Noto Sans KR의 깔끔한 본문. 데이터 시각화(미니맵·가격 그래프·취향 매치)는 미니멀 — 와인 정보가 주역.
  </design_fusion>

  <color_palette>
    <primary_colors>
      - Wine Red: #8B1A2A — Primary CTA, FAB, 활성 강조, drink-window peak 칩
      - Wine Red Hover: #A02030
      - Gold: #C9A84C — 아이콘, 활성 탭, 뱃지 트림, 음용 가능 칩, 진행 바
      - Cream: #F5F0E8 — 본문, 카드 텍스트
    </primary_colors>
    <background_colors>
      - Deepest Dark: #05020A — 페이지·프레임 콘텐츠 배경
      - Deep Dark: #0A050F — 프레임 베젤, 그라데이션 끝
      - Surface: #0F0718 — 카드, 모달, 패널, 토스트
      - Map Dark: #1A0A1E — 지도 국가 fill
    </background_colors>
    <text_colors>
      - Primary: #F5F0E8 (Cream)
      - Secondary: #D4C5B0
      - Muted: #9B8B7A
      - Disabled: #4A3D56
    </text_colors>
    <semantic_colors>
      - Border Default: #2D1540
      - Border Active: #8B1A2A
      - Error: #EF4444
      - Success: #22C55E (배지·드물게)
    </semantic_colors>
    <level_colors>
      - L1: #F5F0E8 (Cream)
      - L2: #D4B85C (Gold soft)
      - L3: #C9A84C (Gold)
      - L4: #8B1A2A (Wine Red)
      - L5: linear-gradient(135deg, #C9A84C, #F5F0E8) (Platinum)
    </level_colors>
    <badge_tier_colors>
      - Bronze: #B87333
      - Silver: #C0C0C0
      - Gold: #C9A84C
      - Platinum: linear-gradient(135deg, #E5E4E2, #C9A84C)
    </badge_tier_colors>
  </color_palette>

  <typography>
    <font_families>
      - Display: "Playfair Display", Georgia, serif — 로고, 큰 숫자, 카드 라벨, 페이지 타이틀
      - Body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif
      - Korean: "Noto Sans KR" — 자동 글리프 fallback
    </font_families>
    <font_sizes>
      - Logo: 22px Playfair 400 (헤더), 56px (온보딩)
      - Page title (Playfair): 24~28px 400
      - Big stat number: 44px Playfair 400 line-height 1.0
      - Section title: 14px Inter 500 (Muted, sub-section)
      - Body: 13~15px Inter 400 line-height 1.5
      - Caption: 11~12px Inter 400
      - Button: 14~16px Inter 600
      - Level pill: 11px Inter 600
      - Toast: 13px Inter 500
      - Bottom nav label: 10px Inter 500
    </font_sizes>
    <line_heights>
      - 큰 숫자 1.0
      - 본문 1.5
      - 캡션 1.4
      - 버튼 1.0
    </line_heights>
  </typography>

  <spacing>
    - Base unit 4px, scale 4/6/8/10/12/14/16/20/24/32/40/56/72
    - Section vertical gap: 16~24px
    - Card internal padding: 14~16px
    - Grid gap: 12px
    - DeviceFrame inner horizontal padding: 16px
  </spacing>

  <borders_and_shadows>
    <borders>
      - Card: 1px solid #2D1540, hover Wine Red, radius 14~16px
      - CTA: radius 16px
      - Bottom sheet: radius top 24px
      - Avatar: 원형
      - Chip: radius 999px
    </borders>
    <shadows>
      - DeviceFrame: 0 40px 100px rgba(0,0,0,0.6) + 0 0 0 1px rgba(201,168,76,0.08)
      - CTA hover: 0 0 20px rgba(139,26,42,0.4)
      - Card hover: 0 8px 24px rgba(139,26,42,0.15)
      - FAB: 0 8px 24px rgba(139,26,42,0.35)
      - Modal: 0 25px 80px rgba(0,0,0,0.8)
      - Toast: 0 10px 30px rgba(0,0,0,0.5)
    </shadows>
  </borders_and_shadows>

  <component_styling>
    <buttons>
      - PrimaryCTA: 56px 높이, Wine Red, Cream, 16px radius, scale 0.97 active
      - SecondaryCTA: 56px, 보더 1px Gold, Cream 텍스트
      - GhostButton: 보더 없음, Gold 텍스트
      - FAB: 56×56 원형, Wine Red, Cream 아이콘
    </buttons>
    <inputs>
      - 시안에서는 미니멀: Surface 배경, 1px border, 14px padding, focus 시 Wine Red border
    </inputs>
    <cards>
      - Feature card: 96~120px, Surface bg, 14px radius, hover translateY -2px
      - Cellar card: 168×220, 라벨 일러 + 메타
      - Wine card: 라벨 일러 dominant, 메타 하단
    </cards>
    <chips>
      - 패딩 6px 12px, radius 999, Surface bg, 11~13px Inter 500
      - 활성: Wine Red bg + Cream 텍스트
    </chips>
    <pills>
      - LevelPill: 패딩 4px 10px, radius 12, bg Level.color (또는 그라데이션), 11px Inter 600 Cream
    </pills>
    <avatars>
      - 36×36 헤더, 80×80 프로필, 24×24 인라인
      - Wine Red bg, Cream 글자, 좌상단 레벨 미니 뱃지 (헤더 시)
    </avatars>
    <modals>
      - Bottom sheet 우선 — radius top 24, drag handle 36×4 Gold
      - 일반 모달: 중앙 정렬, max-width 320px (DeviceFrame 안 기준)
    </modals>
  </component_styling>

  <animations>
    <micro_interactions>
      - 카드 hover: translateY -2px + border color 200ms ease-out
      - 버튼 active: scale 0.97~0.98, 100ms ease-in
      - 토글 스위치: 200ms ease
      - 핀 pulse (active wine): opacity 0.6↔1.0, 2s infinite
    </micro_interactions>
    <page_transitions>
      - 라우트 전환: 새 페이지 fade-up (translateY 8→0, opacity 0→1, 250ms ease-out)
      - 깊은 화면(/wine/[id], /cellar/[id]) 진입: 우→좌 slide (-100%→0, 300ms ease-out)
      - 뒤로가기: 좌→우 slide
    </page_transitions>
    <modal_motion>
      - Bottom sheet: translateY 100%→0, 350ms ease-out, backdrop fade 200ms
      - Confirm dialog: scale 0.95→1, 250ms ease-out
    </modal_motion>
    <chart_entrance>
      - PriceChart: 라인 stroke draw 800ms ease-out, dots fade-in stagger 50ms
    </chart_entrance>
    <orchestrated_entrance>
      - Home: AppHeader → StatHero → LevelProgressBar → NotificationFeed → RecentNotesStrip → QuickActions, stagger 80ms, fade-up 350ms
    </orchestrated_entrance>
    <reduced_motion>
      - useReducedMotion(): 모든 transition 즉시 완료 또는 opacity만 유지
      - pulse 핀 정지
    </reduced_motion>
  </animations>

  <responsive_design>
    <breakpoints>
      - mobile: 0~767px — DeviceFrame wrapper 투명, 콘텐츠 풀스크린, max-width 390px 중앙, DemoControls/FeatureFlagPanel 숨김
      - tablet: 768~1023px — DeviceFrame 단독 중앙, 사이드 패널 숨김
      - desktop_compact: 1024~1279px — DeviceFrame + DemoControls(좌)
      - desktop_wide: 1280px+ — DeviceFrame + DemoControls(좌) + FeatureFlagPanel(우)
    </breakpoints>
    <mobile_adaptations>
      - DeviceFrame 베젤·노치·홈 인디케이터 숨김
      - BottomNav fixed bottom + safe-area-inset-bottom
      - 모든 화면의 컨테이너 좌우 패딩 16px 유지
      - 모달은 항상 BottomSheet 형태
    </mobile_adaptations>
    <touch_interactions>
      - hover 효과는 `@media (hover: hover)`로 가둔다
      - 모든 인터랙티브 요소 최소 44×44px
      - Cellar card 좌측 스와이프 → 빠른 액션 ("마시기" / "삭제") — 시안 단계에서는 placeholder
    </touch_interactions>
  </responsive_design>

  <icons>
    - Library: lucide-react v0.475+
    - 기본 stroke 1.75, 사이즈 16/20/24
    - Color: 활성 Gold, 비활성 Muted, CTA 내부 Cream
    - 자주 쓰는 아이콘: Home, Globe2, Camera, BookOpen, Library, User, Bell, Star, Sparkles, Wine, Share2, Award, ChevronLeft, ChevronRight, X, Filter, GlassWater, MapPin, TrendingUp, CheckCircle2
  </icons>

  <accessibility>
    - DeviceFrame `role="img" aria-label="winemine 키스크린 시안 — iPhone 목업"`
    - 라우트 변경 시 page title 변경, screen reader 안내 (`aria-live="polite"`)
    - 모든 인터랙티브 요소에 보이는 라벨 또는 aria-label
    - 색상 대비 WCAG AA (Cream on Surface, Cream on Wine Red 모두 충족)
    - 포커스: 2px Gold outline, offset 2px
    - prefers-reduced-motion 존중
  </accessibility>

</aesthetic_guidelines>

<security_considerations>
  <input_validation>
    - 사용자 입력은 시각적으로만 처리, 서버 전송 없음
    - 새 와인 정보 입력 시 client-side 검증도 생략 가능 (시안 단계)
  </input_validation>
  <client_security>
    - CRITICAL: 시크릿·API 키 일체 없음. `.env.local` 생성 금지
    - 외부 스크립트 로드 없음 — analytics.ts는 보존하되 어디서도 import 금지
    - 모든 정적 자산은 동일 origin에서
  </client_security>
  <localStorage>
    - 저장 키 명세:
      - `winemine.demoMode` (first-time | heavy)
      - `winemine.experience` (beginner | expert)
      - `winemine.locale` (ko | en)
      - `winemine.onboardingComplete` (boolean)
      - `winemine.favorites` (wineId 배열)
      - `winemine.featureFlags` (시안 한정 — 새로고침 시 리셋 가능)
    - 민감 정보 저장 없음, 사용자 PII 없음
  </localStorage>
  <static_assets>public/* 정적 자산, 외부 fetch 없음</static_assets>
</security_considerations>

<advanced_functionality>

  <demo_controls_developer_panel>
    - 좌측 320px (데스크톱 ≥1024px). 콘텐츠:
      - 데모 모드 라디오 (first-time / heavy)
      - 와인 경험 라디오 (beginner / expert)
      - 언어 라디오 (ko / en)
      - "온보딩 다시 보기" 버튼
      - "푸시 시뮬" 버튼 — 헤비 모드에서 즐겨찾기 와인 중 랜덤 1개에 새 Purchase mock 추가 + 알림 토스트
      - "+50 XP" 디버그
      - "셀러 항목 추가" 디버그
      - URL 미리보기 (현재 모드 조합 URL을 표시, 복사 버튼)
  </demo_controls_developer_panel>

  <feature_flag_panel_per_screen>
    - 우측 320px. 현재 라우트의 주요 컴포넌트 목록을 자동 추출 (각 페이지가 자기 자신의 컴포넌트 inventory를 export하면 panel이 읽는 구조)
    - 항목별 상태: planned (Gold) / considering (Cream) / dropped (Disabled)
    - dropped 토글 시 해당 컴포넌트가 즉시 opacity 0.25 + grayscale
    - 패널 하단에 "이 화면 결정 메모 / Decision note" 자유 텍스트 (localStorage 저장)
  </feature_flag_panel_per_screen>

  <screenshot_friendliness>
    - DeviceFrame 외부 80px 여백으로 데스크톱 캡처 시 시각적으로 깔끔
    - 캡처 후 시안 공유에 바로 사용
  </screenshot_friendliness>

  <mock_state_mutability>
    - 노트 작성 저장, 가격 등록, 즐겨찾기 토글, 푸시 시뮬 등은 React Context 메모리에 변경 누적
    - 새로고침 시 모든 메모리 변경은 리셋 (단, 모드 토글 3종은 localStorage로 영속)
    - 이렇게 두면 동일 시안을 다양한 시나리오로 빠르게 시연 가능
  </mock_state_mutability>

</advanced_functionality>

<final_integration_test>

  <test_scenario_1>
    <description>온보딩 풀 플로우 (first-time + 영어)</description>
    <steps>
      1. localStorage 초기화 후 http://localhost:3000 접속
      2. DemoControls에서 demo=first-time, locale=en 선택
      3. /onboarding으로 자동 redirect되는지 확인
      4. Welcome 단계: 로고·태그라인·CTA 영어로 표시, 한국어 글자 0
      5. "Get started" 클릭 → Language step
      6. English 카드 선택 → Next
      7. Experience step → Beginner 선택 → Next
      8. Done step → CheckCircle2 spring 애니메이션, "Welcome — your wine journey begins"
      9. "Take a tour" 클릭 → / (HomePage)
      10. localStorage `onboardingComplete=true` 확인
      11. 새로고침 → /onboarding으로 리다이렉트 안 되고 / 머무는지 확인
    </steps>
  </test_scenario_1>

  <test_scenario_2>
    <description>헤비 유저 홈 + 알림 + 와인 상세 진입</description>
    <steps>
      1. DemoControls에서 demo=heavy, locale=ko 전환
      2. /로 이동 — StatHero에 "32병 · 8개국 · 14개 지역", LevelProgressBar "Level 3 Connoisseur"
      3. NotificationFeed 첫 항목 "누군가가 Château Margaux를 ₩680,000에 구매했어요" 표시
      4. 첫 항목 클릭 → /wine/bdx-margaux 로 이동
      5. WineHeader에 와인 정보, PriceChart에 8개 가격 포인트 표시
      6. PriceChart의 점 hover → 툴팁에 매장·일자·작성자(Lv·뱃지) 노출
      7. "상세보기" 클릭 → /wine/bdx-margaux/prices, 매장별 그룹 리스트
      8. 뒤로가기 → /wine/bdx-margaux, 다시 뒤로 → /
    </steps>
  </test_scenario_2>

  <test_scenario_3>
    <description>셀러 → "이 와인 마시기" → 노트 작성 (전문가)</description>
    <steps>
      1. demo=heavy, exp=expert로 설정
      2. 바텀 내비 "셀러 / Cellar" 탭 클릭 → /cellar
      3. 셀러 카드 28개 표시 — 그 중 "지금 마시기 좋아요" 칩이 있는 카드 확인
      4. 해당 카드 클릭 → /cellar/[id]
      5. DrinkWindowCard에 타임라인 + 현재 시점 마커
      6. NotifyToggle 클릭 → BottomSheet "2027년에 알림을 보내드릴게요" + Confirm
      7. "이 와인 마시기" 클릭 → ConfirmDialog → 확인
      8. /notes/new/write?from=cellar&itemId=X 로 이동
      9. expert UI 표시 — White/Red/Sparkling/Blind 탭, 아로마 휠, WSET 슬라이더, 카우달리 타이머, 결함 체크리스트
      10. 가격 토글 → 가격 입력 → 저장 클릭
      11. 토스트 "+25 XP", LevelProgressBar 변경 애니메이션
      12. 자동으로 /로 복귀, 셀러에서 해당 항목 제거 확인
    </steps>
  </test_scenario_3>

  <test_scenario_4>
    <description>비기너 노트 작성 + 자동 요약</description>
    <steps>
      1. exp=beginner로 변경
      2. /notes/new → "새 와인" 선택 → /notes/new/write?from=newEntry
      3. beginner UI 표시 — 7단계 (와인/인상/맛 슬라이더/향 카드/여운/평점/메모)
      4. 슬라이더와 향 카드를 토글하면 하단 "오늘의 한 잔" 요약이 실시간 갱신되는지 확인
      5. 각 단계 옆 i18n tip 박스 노출 ("단맛의 정도는 '잔당'이라고 하며…") 확인
      6. 저장 → +10 XP 토스트, /로 복귀
    </steps>
  </test_scenario_4>

  <test_scenario_5>
    <description>지도 드릴다운</description>
    <steps>
      1. demo=heavy, /map 접속
      2. 풀 월드맵에 28개 핀, 히트맵 fill (병 수 많은 국가는 진한 Wine Red)
      3. 프랑스 핀 클릭 → BottomSheet "프랑스 · 14병" + 지역 리스트
      4. "보르도" 클릭 → 와인 카드 5개 노출
      5. 카드 클릭 → /wine/[id]
    </steps>
  </test_scenario_5>

  <test_scenario_6>
    <description>타 유저 프로필 + 취향 매치 + 리뷰 카드 뱃지/레벨</description>
    <steps>
      1. /wine/bdx-margaux 페이지의 reviews_section에서 첫 리뷰 카드 닉네임 클릭
      2. /profile/[otherUserId]로 이동
      3. UserMapHero 상단에 그 유저의 와인 지도 (mock 핀 다수)
      4. 좌하단 닉네임 + LevelPill ("L4 Sommelier") + 보유 뱃지 3개 인라인
      5. TasteCompatibilityCard에 "67%" 큰 숫자 + 원형 진행 표시
      6. "둘 다 마신 와인: 12병 · 비슷한 산지: 5개" 텍스트 확인
      7. 카드 클릭 → 모달 "겹치는 와인 12개" 리스트
      8. 와인 리스트 스크롤 → 카드 50+개
    </steps>
  </test_scenario_6>

  <test_scenario_7>
    <description>즐겨찾기 + 푸시 시뮬</description>
    <steps>
      1. /wine/bdx-margaux 우상단 Star 클릭 → Gold fill, 토스트 "즐겨찾기에 추가됨"
      2. 바텀 내비 프로필 탭 → /profile → "즐겨찾기" 클릭 → /favorites에 표시
      3. DemoControls "푸시 시뮬" 클릭 → 화면 우상단 토스트 "누군가가 Château Margaux를 ₩720,000에 구매했어요" 슬라이드인
      4. 토스트 클릭 → /wine/bdx-margaux, PriceChart에 새 데이터 포인트 추가 확인
      5. /notifications 진입 → 새 알림이 리스트 최상단에 미읽음으로 표시
    </steps>
  </test_scenario_7>

  <test_scenario_8>
    <description>i18n — 영어 모드에서 한국어 글자 없음 검증</description>
    <steps>
      1. DemoControls에서 locale=en 전환
      2. 모든 탭(/, /map, /cellar, /profile)을 순회
      3. 각 deep screen 1개씩 진입 (/wine/[id], /cellar/[id], /profile/[userId], /settings)
      4. 노트 작성 화면도 진입 (beginner + expert 둘 다)
      5. DevTools에서 Cmd+F로 한글 정규식 검색 ([가-힯]) → 일치 0건
      6. 와인명(Château Margaux)은 영어로 유지되어 표시
    </steps>
  </test_scenario_8>

  <test_scenario_9>
    <description>설정에서 모드 변경</description>
    <steps>
      1. /settings 진입
      2. "와인 경험" 클릭 → /settings/experience
      3. Expert 선택 → 토스트 "변경되었어요", router.back
      4. /notes/new/write 진입 → expert UI 표시 확인
      5. /settings/language → English 선택 → 모든 텍스트 영어로 즉시 전환
      6. 새로고침 → locale=en 유지 (localStorage)
    </steps>
  </test_scenario_9>

  <test_scenario_10>
    <description>FeatureFlagPanel 토글로 화면 비교</description>
    <steps>
      1. 데스크톱 1440px 뷰포트에서 / 진입
      2. 우측 FeatureFlagPanel에 현재 화면 컴포넌트 항목 표시 (StatHero, LevelProgressBar, NotificationFeed, RecentNotesStrip, QuickActions, BottomNav)
      3. "NotificationFeed" dropped 토글 → 키스크린에서 해당 섹션 opacity 0.25 + grayscale
      4. "메모" 필드에 "신규 사용자는 알림이 적어 동기부여 부족" 입력 → localStorage 저장
      5. 새로고침 후에도 메모 유지 (단, 플래그는 considering 리셋)
    </steps>
  </test_scenario_10>

  <test_scenario_11>
    <description>모바일 viewport 검증</description>
    <steps>
      1. DevTools mobile emulation iPhone 14 (390×844)
      2. DeviceFrame wrapper가 투명/숨김 — 콘텐츠가 viewport 풀스크린
      3. 바텀 내비가 safe-area-inset-bottom 적용된 위치에 fixed
      4. 모든 탭/deep screen 정상 동작
      5. DemoControls·FeatureFlagPanel 모두 숨김
    </steps>
  </test_scenario_11>

  <test_scenario_12>
    <description>레벨업 시뮬</description>
    <steps>
      1. demo=heavy, 현재 XP 1280 (L3 Connoisseur)
      2. DemoControls "+50 XP" 3번 클릭 → XP 1430
      3. 전문가 노트 작성 (+20) → 1450
      4. 추가 노트 작성으로 1500 도달 시 LevelProgressBar 가득 차고 "L4 Sommelier 달성!" 토스트 + 모달
      5. LevelPill 색상이 Wine Red로 변경
      6. /notifications에 levelUp 알림 추가 확인
    </steps>
  </test_scenario_12>

  <test_scenario_13>
    <description>지역별 시그니처 아로마 자동 추천 (베타 피드백 반영 검증)</description>
    <steps>
      1. demo=heavy, exp=expert, locale=ko
      2. /notes/new → "새 와인" 선택
      3. 와인 메타에 Champagne / Krug Grande Cuvée 설정
      4. Step 2 (Aroma) 진입 → AromaWheel 옆에 RegionalAromaHints 노출
      5. 칩 4~6개 확인: 브리오슈, 이스트, 사과, 헤이즐넛 (i18n 한국어)
      6. "브리오슈" 칩 클릭 → AromaWheel selected 배열에 추가, 시각적 활성 상태 확인
      7. 와인 메타를 Barolo / Nebbiolo로 변경 → 칩이 자동 갱신: 장미, 타르, 트러플, 체리
      8. locale=en으로 변경 → 같은 칩이 영어로 표시 (rose, tar, truffle, cherry)
    </steps>
  </test_scenario_13>

  <test_scenario_14>
    <description>사용자 추정 음용 적기 + 커뮤니티 집계 시각화 (베타 피드백 반영)</description>
    <steps>
      1. demo=heavy (L3 Connoisseur), exp=expert
      2. /wine/bdx-margaux 진입
      3. CommunityDrinkWindowCard에 히스토그램 + "평균 2030 · 중앙값 2029" 확인
      4. "상세 보기" 클릭 → /wine/bdx-margaux/community-peak
      5. 추정자 리스트 32명 (익명화, LevelPill 노출) 확인
      6. "내 추정 추가" CTA 클릭 → /notes/new/write로 이동
      7. Step 7 (Peak ETA & Rating)에서 PeakEtaInput 노출 확인 (L3+이므로 활성)
      8. "+5년 후 (2031)" + 확신도 medium + 메모 입력
      9. 저장 → "+25 XP +5 XP" 토스트
      10. /wine/bdx-margaux로 돌아와 CommunityDrinkWindowCard 갱신 확인 (count 33으로 증가, 평균이 살짝 변동)
      11. demo=first-time으로 변경 (L1) → 같은 노트 작성 시 Step 7의 PeakEtaInput이 disabled + "더 마셔보고 다시" 메시지
    </steps>
  </test_scenario_14>

  <test_scenario_15>
    <description>시음 온도 입력 + 권장 비교 (베타 피드백)</description>
    <steps>
      1. exp=expert, /notes/new/write 진입
      2. Step 1 (Capture)에서 ServingTempInput 노출 확인
      3. 와인의 권장 범위 "16~18°C" 표시
      4. 슬라이더를 12°C로 → "조금 차게 / Slightly cold" Wine Red 경고
      5. 17°C로 변경 → Gold 체크 + "권장 범위 / In range"
      6. 25°C로 → "너무 따뜻해요 / Too warm" Wine Red 경고
      7. 저장 시 servingTempCelsius 값이 TastingNote에 기록 (메모리)
    </steps>
  </test_scenario_15>

  <test_scenario_16>
    <description>와이너리 스토리 카드 + 상세 페이지 (베타 피드백)</description>
    <steps>
      1. /wine/bdx-margaux 진입
      2. WineStoryCard 노출 확인 — "Château Margaux · 1572" + 위치 + 본문 2문장
      3. Lightbulb 아이콘 hover → funFact 미리보기
      4. "더 읽기" 클릭 → /wine/bdx-margaux/story
      5. 히스토리 본문 3~4문단 + funFact 카드 + 양조 철학 + 메타 그리드 확인
      6. 본문 내 도메인 용어("1855 등급 분류", "1등급")에 GlossaryTooltip (i) 아이콘 확인
      7. (i) 클릭 → "1855년 보르도 등급 분류" 한 단락 설명 팝오버
    </steps>
  </test_scenario_16>

  <test_scenario_17>
    <description>외부 평점 카드 표시 (베타 피드백)</description>
    <steps>
      1. /wine/bdx-margaux 진입
      2. ExternalRatingsCard 확인:
         - Vivino ★4.5 / 12,450 reviews
         - Wine Searcher 93/100 · "Top 10% of Bordeaux"
         - CellarTracker 92/100 · 3,210 reviews
         - 글로벌 평균가 $480 USD
      3. (i) 버튼 클릭 → "시안 mock 데이터입니다" 토스트
      4. /wine/[id]에서 externalRatings가 null인 와인(40개) 진입 시 카드가 "외부 평점 없음" 빈 상태로 표시
    </steps>
  </test_scenario_17>

  <test_scenario_18>
    <description>라벨 사진 갤러리 (베타 피드백)</description>
    <steps>
      1. demo=heavy, /photos 진입 (또는 /profile → "라벨 사진" 링크)
      2. 3열 그리드 라벨 사진 mock 24개 표시
      3. PhotoFilterBar에서 "올해" 클릭 → 2026 년 사진만 필터링
      4. "미매칭" 칩 클릭 → 와인 정보 없는 사진 3개 표시
      5. 미매칭 사진 클릭 → BottomSheet "와인 매칭 / Match wine" 액션 노출
      6. /notes/new/write에서 "사진 추가" 클릭 → mock LabelPhoto 추가
      7. /photos 재진입 → 새 사진이 그리드 최상단에 추가됨
      8. demo=first-time으로 변경 → /photos에 빈 상태 표시
    </steps>
  </test_scenario_18>

  <test_scenario_19>
    <description>용어 사전 진입 + 인라인 툴팁 (베타 피드백)</description>
    <steps>
      1. exp=expert, /notes/new/write 진입 → Step 4 (Finish/Caudalie)
      2. CaudalieMeter 우상단 (i) 버튼 클릭 → 팝오버 "카우달리가 뭐예요?"
      3. 본문 2~3문장 + "더 알아보기" 링크 → /glossary/caudalie
      4. GlossaryEntryPage 진입 — 큰 제목 "카우달리 / Caudalie", 정의, 출처 (Peynaud), 사용 예시
      5. 관련 용어 칩에서 "PAI" 클릭 → /glossary/pai (없으면 추가하거나 caudalie와 함께 정의)
      6. /glossary 진입 → 12개 시드 entry 가나다순 표시
      7. "결함" 칩 필터 → 결함 관련 용어만 (brett, bouchonne)
      8. locale=en으로 변경 → 모든 용어가 영문 (Caudalie, Brettanomyces, Cork Taint…)
    </steps>
  </test_scenario_19>

  <test_scenario_20>
    <description>전문가 노트 — handover doc 9개 컴포넌트 모두 동작</description>
    <steps>
      1. exp=expert, /notes/new/write, variant=red
      2. Step 1: WineMetaCard + ServingTempInput 확인
      3. Step 2: AromaWheel 12 wedge 클릭 펼침 + 어휘 칩 토글 + RegionalAromaHints + ImpactCompound 툴팁
      4. Step 3: WSETSlider 4개 + TanninPanel (강도+21 texture 4그룹+성숙도)
      5. Step 4: CaudalieMeter Tap to start → 5초 카운트 → Tap to stop → "5 caudalies — long" 분류 표시
      6. Step 5: FaultChecklist에서 "Brettanomyces" 체크 → 카드 활성 + 푸터 명시 카피
      7. Step 6: OpeningTimeline에 코르크 오픈 시각 설정 → 라이브 타이머 chip → dot timeline 클릭으로 timepoint 추가 → Peak ★ 토글 → 권장 디캔팅 비교 카드
      8. Step 7: PeakEtaInput + Rating + AutoDescription 박스가 입력 변경에 따라 실시간 갱신 (200ms debounce)
      9. variant=sparkling으로 변경 → TanninPanel이 사라지고 BubblePanel + DosagePicker 등장
      10. variant=blind → 모든 step 사라지고 BlindMode 단독 (4입력 + Reveal & Score)
    </steps>
  </test_scenario_20>

</final_integration_test>

<success_criteria>

  <functionality>
    - 22개 라우트 모두 정상 진입 및 뒤로가기 정상 (기존 17 + wine story + community-peak + photos + glossary list + glossary entry)
    - 3종 모드 토글(demo/experience/locale) 모두 즉시 반영 + localStorage 유지
    - 영어 모드에서 한국어 글자 노출 0건 (test_scenario_8 통과)
    - 모든 인터랙티브 요소가 deep route 이동 또는 placeholder 토스트로 응답
    - XP 적립·레벨업·푸시 시뮬·즐겨찾기 토글·셀러 추가/제거 모두 mock 메모리에서 정상 동작
    - PriceChart에 새 데이터 포인트가 실시간 추가됨
    - 온보딩이 first-time + onboardingComplete=false 조합에서만 강제됨
    - **테이스팅 노트 9개 재사용 컴포넌트가 handover doc §5와 동일한 인터페이스로 동작** (controlled component, props 형식 동일)
    - **베타 피드백 7항목 모두 시각적으로 검증 가능** (test_scenario 13~19 통과): 시음 온도, peak ETA 커뮤니티 집계, 와이너리 스토리, 지역 아로마 자동 추천, 외부 평점, 라벨 사진 갤러리, 용어 사전 + 인라인 툴팁
    - 사용자가 expert 노트에서 peakEstimateYear 입력 시 CommunityPeakAggregate가 즉시 갱신되어 와인 상세에서 확인
    - 라벨 사진 추가 시 /photos에 실시간 등장
  </functionality>

  <user_experience>
    - 페이지 로드 LCP 2.5s 이내 (정적 자산만)
    - 라우트 전환 250~300ms slide 애니메이션 부드러움
    - 모든 클릭 응답 100ms 이내
    - 가로 스크롤 없음 (모든 화면 390px 안에 적정)
    - prefers-reduced-motion 시 모션 즉시 완료
  </user_experience>

  <technical_quality>
    - TypeScript strict 통과, any 0
    - next-intl 메시지 키 누락 0 (빌드 시 검증)
    - 모든 LocalizedString 필드가 ko/en 양쪽 채워짐
    - react-simple-maps는 dynamic import + ssr:false
    - Recharts는 클라이언트 컴포넌트로만 사용
    - ESLint 경고 0
    - 메인 번들 250KB 이내 (gzip, Recharts 포함)
  </technical_quality>

  <visual_design>
    - 모든 색상 CSS 변수 참조 (hex 직접 작성 0건)
    - 폰트 로딩 FOUT 최소화 (next/font display swap)
    - DeviceFrame 안 콘텐츠 392px 미만에서 가로 스크롤 없음
    - LevelPill·ReviewBadge가 모든 커뮤니티 노출 위치에 함께 표시
    - DESIGN_SYSTEM.md 명세 100% 일치
  </visual_design>

  <build>
    - `npm run build` 무경고 통과
    - `npm run dev` 핫리로드 정상
    - 빌드 산출물 Vercel 또는 정적 호스팅 가능
  </build>

</success_criteria>

<build_output>
  <build_command>npm run build</build_command>
  <output_directory>.next/</output_directory>
  <contents>
    - 17개 정적/SSG 페이지 + 다이내믹 라우트 page generators
    - 자산: `public/world-110m.json`, `public/france-departments.json`, 12개 뱃지 SVG, 로고/마크 PNG
    - 폰트 self-hosted
    - i18n 메시지 번들 — locale별 분리 청크
  </contents>
  <deployment>
    - 로컬 dev 서버 검수가 1차 목적
    - Vercel deploy 가능 (선택)
  </deployment>
</build_output>

<key_implementation_notes>

  <critical_paths>
    - **i18n 우선**: layout.tsx에서 NextIntlClientProvider를 가장 바깥쪽 provider로 둔다. 이후 모든 컴포넌트가 useTranslations 또는 LocaleText로 텍스트 렌더. 한국어 인라인 문자열 금지.
    - **DeviceFrame as Layout**: app/layout.tsx에서 DeviceFrame을 마운트하고 그 안에 {children}을 둔다. 라우트 변경 시 DeviceFrame 외관은 유지되고 내용만 fade-up/slide. 모바일에서는 DeviceFrame wrapper가 투명.
    - **Mode contexts**: AppModeProvider, ExperienceProvider, LocaleProvider 모두 URL 파라미터 → localStorage → default 순서로 초기값 결정. 변경 시 URL과 localStorage 동시 갱신.
    - **react-simple-maps SSR**: dynamic import + ssr:false 누락 시 빌드 실패. world-110m.json의 `geo.id`는 `String(geo.id).padStart(3, '0')`로 매칭.
    - **Recharts 클라이언트 전용**: PriceChart는 `"use client"`, dynamic import 권장.
    - **데모 상태 불변/가변 분리**: localStorage에는 토글 3종 + onboardingComplete + favorites만 저장. 노트·셀러·XP·라벨 사진·peak 추정은 React Context로만 보유해 새로고침 시 리셋.
    - **Tasting Note은 handover doc을 단일 소스로**: 구현 시 `docs/tasting-note-app-handover.md`를 1차 참조. lexicon.ts는 수정 없이 그대로 import. 9개 컴포넌트는 controlled component 패턴 유지 (입력 state는 부모 useReducer). 새로 추가하는 컴포넌트 (ServingTempInput, PeakEtaInput, RegionalAromaHints, GlossaryTooltip)는 기존 컴포넌트와 동일한 패턴 따를 것.
    - **베타 피드백 추적**: 시안에 반영된 7개 피드백 항목 (시음 온도, peak ETA 집계, 와이너리 스토리, 지역 아로마, 외부 평점, 라벨 사진, 용어 사전)은 각각 `<!-- 베타 피드백 반영 -->` 주석으로 코드에 마킹해 결정 메모와 연결.
    - **OpeningTimeline 라이브 타이머**: 코르크 오픈 시각 설정 후 setInterval 1초 갱신. cleanup 처리 누락 시 메모리 누수. 페이지 이탈 시 setInterval clear 필수.
    - **AromaWheel SVG**: 320×320 정사각, viewBox 정확히 맞추기. 활성 wedge `activeCat` 초기값 `'fruity'` (handover doc §10 — 이건 의도된 UX). variant 변경 시 `appliesTo` 필터로 어휘 칩 갱신.
  </critical_paths>

  <recommended_implementation_order>
    1. Next.js 15 + Tailwind v4 + next-intl 초기 scaffold
    2. styles/tokens.css를 app/globals.css에서 import, @theme 블록 작성
    3. app/layout.tsx: next/font, html lang attribute는 LocaleContext에서 동적 설정
    4. NextIntlClientProvider + i18n/request.ts 동적 메시지 로딩
    5. DeviceFrame + StatusBar + DynamicIsland + HomeIndicator (정확한 dimensions)
    6. AppModeContext, ExperienceContext, FavoritesContext (URL ↔ localStorage 동기화)
    7. Mock 데이터 모듈 작성 (lib/mock/*.ts — users, wines, cellar, tasting-notes, purchases, stores, notifications, favorites, badges, levels, reviews)
    8. AppHeader + BackHeader + BottomNav
    9. MiniWorldMap (dynamic import) + StatHero
    10. Home 페이지 (heavy + first-time 두 변형)
    11. Onboarding 4단계 + firstTimeOnly guard
    12. Cellar 리스트 + 셀러 카드 + drink-window 계산
    13. Cellar 상세 + DrinkThisButton → 노트 작성 prefill
    14. **테이스팅 노트 lexicon 포팅** — `lib/tasting-note-lexicon.ts` 그대로 + handover doc §4 명세대로 라벨 맵·헬퍼 확보
    15. **9개 재사용 컴포넌트 포팅** (handover doc §5):
        a. WSETSlider (가장 단순) → b. FaultChecklist → c. TanninPanel/BubblePanel → d. AromaWheel (가장 큰 SVG) → e. CaudalieMeter (RAF) → f. AutoDescription (debounce) → g. OpeningTimeline (가장 복잡, setInterval 라이브 타이머) → h. BlindMode (정답 prop 외부 주입) → i. BeginnerNote (입문자 단독)
    16. **베타 피드백 신규 컴포넌트**:
        - `ServingTempInput` (Step 1)
        - `RegionalAromaHints` (Step 2 — `lib/regional-aromas.ts` 매핑 활용)
        - `PeakEtaInput` (Step 7)
        - `GlossaryTooltip` (인라인 (i) 버튼 헬퍼)
    17. Note 작성 — beginner UI 컨테이너 (BeginnerNote 래핑)
    18. Note 작성 — expert UI 컨테이너 (Step 1~7 흐름, variant 분기, Blind 단독)
    19. Wine 상세 + Recharts PriceChart
    20. **Wine 상세 신규 카드들** (베타 피드백):
        - WineStoryCard + /wine/[id]/story 페이지
        - ExternalRatingsCard
        - CommunityDrinkWindowCard + /wine/[id]/community-peak 페이지 (`lib/community-peak-aggregator.ts`)
    21. Wine 가격 상세 + 매장 리스트
    22. Map 풀스크린 + 드릴다운 BottomSheet
    23. Profile — 내 프로필
    24. Profile — 타 유저 + 취향 매치
    25. Settings 4개 페이지
    26. Notifications 리스트
    27. Favorites 리스트
    28. Badges 진열장
    29. **LabelPhotoArchive (/photos)** + photo-archive 컴포넌트들
    30. **Glossary (/glossary, /glossary/[term])** + 12개 시드 entry + GlossaryTooltip 헬퍼 + 도메인 용어 위치마다 (i) 아이콘 삽입
    31. XP·레벨 시스템 + 토스트 + 모달
    32. DemoControls (좌측 사이드, 데스크톱)
    33. FeatureFlagPanel (우측 사이드, 데스크톱)
    34. PlaceholderToast + BottomSheet + ConfirmDialog + LocaleText 공용 컴포넌트
    35. 라우트 전환 애니메이션 (slide/fade)
    36. 반응형 분기 (모바일 viewport에서 DeviceFrame 투명)
    37. 접근성 마무리 (focus, aria, reduced-motion)
    38. 통합 테스트 20종 수행 (베타 피드백 검증 시나리오 13~19 포함)
  </recommended_implementation_order>

  <i18n_strategy>
    - messages/{ko,en}.json에 키 구조 동기 유지
    - 키 그룹 추가: `keyscreen.*`, `onboarding.*`, `cellar.*`, `profile.*`, `wineDetail.*`, `settings.*`, `notifications.*`, `xp.*`, `badges.*`, `levels.*`, `reviews.*`, `community.*`, `wineStory.*`, `externalRatings.*`, `communityPeak.*`, `servingTemp.*`, `peakEta.*`, `regionalAromas.*`, `photos.*`, `glossary.*`
    - 기존 키 그룹 (랜딩에서 가져옴, 그대로 유지): `tastingNote.*` (eyebrow/heading/subhead/tabs/steps/scale/dimensions/aroma/caudalie/faults/evolution/beginner/blind/mockup/playground/autoDescription) — handover doc §7 참고
    - 와인 메타(country.ko/en, region.ko/en)는 wines 모듈 자체에 LocalizedString으로 작성 — messages.json 외부
    - 동적 보간 (`{displayName}`, `{wineName}`, `{n}`)은 ICU MessageFormat 활용
    - lint 룰: src/** 안에서 정규식 `/[가-힯]/`에 매치되는 인라인 문자열 발견 시 경고 (영어 모드 안전 보장)
  </i18n_strategy>

  <mock_data_setup>
    - heavy currentUser (예시):
      ```ts
      {
        id: 'me-heavy',
        displayName: { ko: '예진', en: 'Yejin' }.locale,
        avatarInitial: { ko: '예', en: 'Y' },
        locale: 'ko',
        experience: 'expert',
        xp: 1280,
        levelId: 3,
        joinedAt: '2025-09-12',
        badges: ['badge_001', 'badge_002', 'badge_004', 'badge_007', 'badge_008', 'badge_009', 'badge_011'],
        stats: { winesTasted: 32, countriesExplored: 8, regionsExplored: 14, notesCount: 47, cellarCount: 28 },
      }
      ```
    - first-time currentUser: xp=0, levelId=1, badges=[], stats 모두 0
    - 와인 카탈로그: 기존 recommended-wines.ts 8종 + 추가 52종 작성 (Champagne, Burgundy, Italy, Spain, Germany, Portugal, USA, Australia, Chile, Argentina, South Africa)
    - Purchase mock: 12종 와인 × 4~9건 = 약 70건, 매장은 stores.ts의 14개에서 분배
    - Notifications mock: heavy 사용자에 12개 (favoritePurchase 5, drinkWindowReached 4, badgeEarned 2, levelUp 1)
    - Other users: otherUser1 (L4 Sommelier, 50 wines, match 67%), otherUser2 (L2 Enthusiast, 18 wines, match 42%), otherUser3 (L5 Master, 200 wines, match 89%)
  </mock_data_setup>

  <performance_considerations>
    - Recharts와 react-simple-maps 모두 dynamic import — 초기 번들 제외
    - world-110m.json 107KB — Map 페이지에서만 fetch
    - 와인 라벨 일러는 CSS gradient(bottleColor) + 인라인 SVG로 가볍게 (외부 이미지 없음)
    - Framer Motion은 필요한 컴포넌트만 (motion.div, AnimatePresence)
  </performance_considerations>

  <testing_strategy>
    - 단위 테스트 불필요 (시안)
    - 수동 통합 테스트 12종 (위 final_integration_test) — Chrome + Safari + DevTools mobile emulation
    - 영어 모드 한글 누락 검증은 정규식 grep으로 src/** 검사 (`grep -rE '[가-힯]' src/components src/app | grep -v messages`)
  </testing_strategy>

  <tool_usage>
    - 디자인 검수: Chrome DevTools에서 mobile/desktop 둘 다
    - 데스크톱 캡처로 시안 공유 — DeviceFrame이 정확히 1:1
    - 색상 대비: WebAIM Contrast Checker로 Cream-on-Surface, Cream-on-Wine-Red, Cream-on-Gold 검증
  </tool_usage>

</key_implementation_notes>

</project_specification>
