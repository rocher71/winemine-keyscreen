<project_specification>

<project_name>winemine Keyscreen — Clickable Feature Shopping Mockup</project_name>

<overview>
winemine은 와인 라벨을 촬영하면 AI가 인식하고, 마신 와인을 세계 지도 위에 지역별로 시각화하는 모바일 앱이다. 이 레포(`winemine-keyscreen`)는 그 앱의 **키스크린(첫 진입 후 메인 허브 화면) 클릭형 시안**을 만드는 작업이다. Phase 2(앱 프로토타입) 의사결정용 단일 화면 MVP — "어떤 기능을 앱에 넣고 어떤 기능을 뺄지" 시각적으로 비교·합의하기 위한 도구다.

키스크린은 데스크톱 브라우저에서 열리지만 **항상 iPhone 390×844 목업 프레임 내부에 렌더링된다**. 사용자가 모바일 앱 사이즈로 화면을 미리 체험할 수 있도록 페이지 가운데에 정지된 디바이스 프레임을 두고 그 안에서만 모든 인터랙션이 일어난다. 화면 안에는 후보 기능 8종이 카드·CTA·바텀 내비 형태로 배치되며, **모든 버튼은 시각적으로만 동작하고 실제 라우팅·저장·네트워크 호출은 없다**. 통계, 와인 목록, 사용자 이름은 전부 하드코딩된 mock 데이터로 채운다.

CRITICAL: 백엔드 없음, 데이터베이스 없음, 인증 없음. 회원가입·로그인·서버 액션 일체 구현하지 않는다. 버튼 클릭 시 동작은 `console.log` 또는 단순 토스트 정도로 placeholder 처리한다. 진짜로 기능을 구현하는 것이 아니라 **앱의 정보 구조와 우선순위를 결정하는 시안**이다.

CRITICAL: 디자인 토큰(`styles/tokens.css`)과 mock 데이터(`lib/recommended-wines.ts`, `messages/ko.json`)는 랜딩 페이지에서 검증된 자산이므로 그대로 재사용한다. 새로 색을 정의하지 말고 CSS 변수 참조.
</overview>

<scope_boundaries>
  <in_scope>
    - 단일 페이지(`/`) 키스크린 — iPhone 390×844 프레임 안에 렌더링
    - 데스크톱 브라우저에서 페이지 중앙에 디바이스 프레임 표시 (모바일 브라우저에서는 프레임 없이 전체화면)
    - 후보 기능 8종을 카드/CTA/탭 형태로 시각화 (스캔, 지도, 테이스팅 노트, 추천, 드릴다운, Recap, 라이브러리, 프로필)
    - 하드코딩된 사용자 mock — 닉네임, 마신 와인 수, 방문 국가 수
    - 미니 월드맵 시각화 (정적, react-simple-maps + `public/world-110m.json`)
    - 버튼 클릭 시 시각적 피드백(active state, 토스트 또는 임시 모달) — 실제 라우팅 X
    - 다크 와인 미감(Wine Red + Gold + Cream)을 그대로 적용
    - 한국어 단일 로케일 (랜딩 i18n 키 중 키스크린에 필요한 것만 가져와 사용)
  </in_scope>
  <out_of_scope>
    - 회원가입·로그인·OAuth·비밀번호 리셋
    - Supabase·DB·API 라우트·서버 액션
    - 실제 카메라 접근, 이미지 업로드, AI 인식
    - 테이스팅 노트 작성·저장·불러오기 (버튼만 존재)
    - Recap 이미지 생성 (버튼만 존재)
    - 와인 지역 드릴다운 페이지 (버튼만 존재)
    - 알림·푸시·소셜 공유 SDK
    - 영어 로케일·i18n middleware (한국어 단일)
    - 다크/라이트 테마 토글 (다크 단일)
    - 결제·구독·온보딩 튜토리얼
    - 데스크톱용 별도 레이아웃 (모바일 viewport를 프레임 안에 가둘 뿐)
  </out_of_scope>
  <future_considerations>
    - 키스크린에서 합의된 기능들을 실제 라우트로 구현 (Phase 2 본 개발)
    - 인증 흐름과 사용자 데이터 영구 저장 (Phase 2)
    - 라벨 OCR/AI 인식 백엔드 (Phase 3)
    - Recap 이미지 자동 생성 + SNS 공유 (Phase 3)
  </future_considerations>
</scope_boundaries>

<technology_stack>
  <frontend_application>
    <framework>Next.js 15.x App Router (React 19)</framework>
    <language>TypeScript 5.7 (strict mode)</language>
    <build_tool>Turbopack (dev), Next.js default (prod)</build_tool>
    <styling>Tailwind CSS v4 (`@import "tailwindcss"`) + CSS 변수 토큰 (`styles/tokens.css`)</styling>
    <routing>App Router — 단일 페이지 `/`만 사용</routing>
    <state_management>로컬 컴포넌트 상태(`useState`)만 사용. 전역 store 불필요</state_management>
  </frontend_application>
  <data_layer>
    <note>CRITICAL: 데이터베이스·네트워크 호출 일체 없음. 모든 데이터는 `lib/*.ts` 모듈에 하드코딩된 mock</note>
  </data_layer>
  <libraries>
    <maps>react-simple-maps v3.0.0 — 미니 월드맵 (SSR 불가, dynamic import 필수)</maps>
    <topojson>topojson-client v3.1.0 — 지도 데이터 파서</topojson>
    <motion>framer-motion v12.x — 페이지 로드, 카드 hover/tap, 토스트 진입</motion>
    <icons>lucide-react v0.475+ — 아이콘 (Camera, MapPin, Wine, Sparkles, Share2, BookOpen, User, Home)</icons>
    <fonts>next/font — Playfair Display(로고/제목), Inter(본문), Noto Sans KR(한글 fallback)</fonts>
  </libraries>
  <build_output>
    <build_command>npm run build → `.next/`</build_command>
    <dev_command>npm run dev (Turbopack, http://localhost:3000)</dev_command>
    <note>정적 export 불필요 — Vercel 또는 로컬 dev 서버에서만 확인</note>
  </build_output>
</technology_stack>

<prerequisites>
  <environment_setup>
    - Node.js 20.x 이상
    - npm 10.x 이상 (또는 pnpm 9.x)
    - 모던 브라우저 (Chrome/Safari 최신) — DevTools mobile emulation으로 검수
  </environment_setup>
  <build_configuration>
    - `tsconfig.json`: strict, `"target": "ES2022"`, `"moduleResolution": "bundler"`
    - `next.config.ts`: 기본값. `reactStrictMode: true`
    - Tailwind v4: `@import "tailwindcss"` + `@theme` 블록에서 CSS 변수 노출
    - `app/globals.css`에서 `styles/tokens.css` import
  </build_configuration>
</prerequisites>

<environment_variables>
  <note>이 프로젝트는 환경 변수가 필요하지 않다. `.env` 파일을 만들지 말 것. 모든 데이터는 컴파일 타임 하드코딩.</note>
</environment_variables>

<file_structure>
winemine-keyscreen/
├── CLAUDE.md                          # 프로젝트 컨벤션 (이미 존재)
├── DESIGN_SYSTEM.md                   # 디자인 시스템 가이드 (이미 존재)
├── WINEMINE_KEYSCREEN_SPEC.md         # 이 스펙 문서
├── README.md
├── next.config.ts
├── tsconfig.json
├── package.json
├── postcss.config.mjs                 # Tailwind v4 PostCSS
├── public/
│   ├── world-110m.json                # 세계 지도 (이미 존재)
│   ├── france-departments.json        # (이미 존재, 키스크린에서는 사용 안 함)
│   ├── logo.png                       # winemine 로고 (이미 존재)
│   └── winemine-glass-mark.png        # 와인잔 마크 (이미 존재)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # 폰트 로드, <html lang="ko">, 다크 bg
│   │   ├── globals.css                # @import "tailwindcss" + tokens.css
│   │   └── page.tsx                   # 키스크린 진입점 — DeviceFrame 래퍼만 마운트
│   ├── components/
│   │   ├── device-frame.tsx           # iPhone 390×844 외관 프레임 (상태바, 노치, 베젤)
│   │   ├── keyscreen.tsx              # 프레임 내부의 메인 화면 컴포넌트
│   │   ├── keyscreen/
│   │   │   ├── status-bar.tsx         # mock 상태바 (시간, 신호, 배터리)
│   │   │   ├── app-header.tsx         # 로고 + 프로필 아바타
│   │   │   ├── stat-hero.tsx          # "32병 · 8개국" 히어로 + 미니 월드맵 배경
│   │   │   ├── mini-world-map.tsx     # react-simple-maps (dynamic import, ssr:false)
│   │   │   ├── primary-cta.tsx        # "와인 라벨 스캔" 빅 CTA
│   │   │   ├── feature-grid.tsx       # 2×3 기능 카드 그리드
│   │   │   ├── feature-card.tsx       # 단일 카드 (아이콘 + 라벨 + sublabel)
│   │   │   ├── bottom-nav.tsx         # 5탭 바텀 내비 (FAB 중앙)
│   │   │   └── placeholder-toast.tsx  # 버튼 클릭 시 "곧 도착해요" 토스트
│   │   └── feature-flag-panel.tsx     # 화면 옆 (프레임 외부) 기능 ON/OFF 체크리스트 (의사결정용)
│   ├── lib/
│   │   ├── analytics.ts               # (이미 존재) gtag 래퍼 — 사용 안 함, 보존만
│   │   ├── recommended-wines.ts       # (이미 존재) STARTING_WINE 핀으로 사용
│   │   ├── tasting-note-lexicon.ts    # (이미 존재) 본 시안에선 사용 안 함, 보존만
│   │   ├── validations.ts             # (이미 존재) 사용 안 함, 보존만
│   │   └── keyscreen-mock.ts          # 새로 작성 — 사용자 닉네임, 통계, 최근 와인 mock
│   └── messages/
│       └── ko.json                    # (이미 존재) 키스크린에 필요한 키만 골라 import
└── styles/
    └── tokens.css                     # (이미 존재) 디자인 토큰 — globals.css에서 import
</file_structure>

<core_data_entities>
  <UserMock>
    - displayName: string (예: "예진")
    - winesTasted: number (예: 32)
    - countriesExplored: number (예: 8)
    - regionsExplored: number (예: 14)
    - joinedAt: string (ISO date, 예: "2025-09-12")
    - avatarInitial: string (한 글자, displayName 첫 자)
  </UserMock>

  <FeatureEntry>
    - id: string (kebab-case, 예: "scan-label")
    - label: string (한국어, 카드 제목)
    - sublabel: string (한 줄 설명, 12자 내외)
    - icon: lucide-react 아이콘 컴포넌트 이름
    - status: enum (planned, considering, dropped) — 의사결정 상태
    - ctaKind: enum (primary, card, navTab, fab) — 화면에서의 배치 형태
    - placeholderMessage: string (클릭 시 토스트 메시지)
  </FeatureEntry>

  <MapPinMock>
    - wineId: string (`recommended-wines.ts`의 id 재사용)
    - coords: [number, number] (lon, lat)
    - color: string (hex, Wine Red 또는 Gold)
    - size: number (px, 6~10)
  </MapPinMock>
</core_data_entities>

<authentication>
  <note>해당 없음. 이 프로젝트는 인증을 구현하지 않는다. "로그인" 버튼이 화면에 있더라도 클릭 시 토스트만 띄운다.</note>
</authentication>

<route_definitions>
  <public_routes>
    <route path="/" page="KeyscreenPage" />
  </public_routes>
  <note>단일 페이지. 그 외 모든 라우트는 정의하지 않는다. 키스크린 내부 버튼은 라우팅하지 않고 토스트/placeholder로 응답.</note>
</route_definitions>

<component_hierarchy>
  <app_shell>
    <providers>
      <!-- next/font 변수 주입은 layout.tsx <html>에 직접 -->
      <router>
        <KeyscreenPage> <!-- src/app/page.tsx -->
          <PageBackground />            <!-- 다크 그라데이션 풀스크린 -->
          <DeviceFrame>                 <!-- 390×844 + 베젤 + 노치, 중앙 정렬 -->
            <StatusBar />               <!-- 9:41, 신호·와이파이·배터리 (정적) -->
            <Keyscreen>
              <AppHeader />             <!-- winemine 로고 + 우측 프로필 아바타 -->
              <StatHero>                <!-- 200px 높이, 미니 월드맵 배경 -->
                <MiniWorldMap />        <!-- dynamic import, opacity 0.35 -->
                <StatHeroOverlay />     <!-- 텍스트 오버레이 -->
              </StatHero>
              <PrimaryCTA />            <!-- "와인 라벨 스캔" 풀폭 버튼 -->
              <FeatureGrid>             <!-- 2×3 카드 그리드 -->
                <FeatureCard />*6
              </FeatureGrid>
              <BottomNav />             <!-- 5탭 + 중앙 FAB -->
            </Keyscreen>
          </DeviceFrame>
          <FeatureFlagPanel />          <!-- 프레임 외부 (데스크톱에서만 보임), 우측 사이드 -->
          <PlaceholderToast />          <!-- 페이지 루트에 마운트, AnimatePresence로 토글 -->
        </KeyscreenPage>
      </router>
    </providers>
  </app_shell>

  <shared>
    <PlaceholderToast />                <!-- 모든 버튼이 공통으로 호출 -->
  </shared>
</component_hierarchy>

<pages_and_interfaces>

  <browser_layout>
    <viewport>
      - 전체 페이지 배경: `--color-bg-deepest` (#05020A)에서 `--color-bg-deep` (#0A050F)로 대각선 그라데이션
      - 데스크톱(≥768px): 페이지 중앙에 `DeviceFrame` 단독 배치, 좌측 또는 우측에 `FeatureFlagPanel` 패널 (320px 폭)
      - 모바일(<768px): 프레임 없이 키스크린 콘텐츠를 전체화면으로 렌더링 — 단, 콘텐츠 max-width는 390px로 제한
      - 데스크톱에서 프레임 상하 여백: 40px (가능하면 한 화면에 다 들어오게)
    </viewport>
  </browser_layout>

  <device_frame>
    <dimensions>
      - 외경: 414×868 (콘텐츠 390×844 + 12px 좌우 베젤 + 12px 상하 베젤)
      - border-radius: 50px
      - 베젤 색상: `#0A050F` (deep bg와 동일해서 프레임이 떠 있는 듯한 효과)
      - 외곽 stroke: 2px solid #1F1428 (살짝 밝은 보더)
      - 외곽 shadow: `0 40px 100px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(201, 168, 76, 0.08)` (Gold 살짝 발광)
      - 내부 콘텐츠 영역: 390×844 px, `--color-bg-deepest` 배경, border-radius 38px (베젤 안쪽)
      - overflow: hidden
    </dimensions>
    <dynamic_island>
      - 위치: 콘텐츠 영역 상단 중앙, top 11px
      - 크기: 120×34, border-radius 17px, 색상 #000000
      - 정적 (인터랙션 없음)
    </dynamic_island>
    <home_indicator>
      - 위치: 콘텐츠 영역 하단 중앙, bottom 8px
      - 크기: 134×5, border-radius 3px, 색상 rgba(245, 240, 232, 0.4)
    </home_indicator>
  </device_frame>

  <status_bar>
    - 높이: 54px (상단 safe area + 시계 행)
    - 좌측 시계: "9:41", Inter Medium 15px, `--color-text-primary`, padding-left 28px, baseline은 Dynamic Island 중앙
    - 우측 인디케이터: 신호 4칸 + Wi-Fi + 배터리 100% (정적, lucide-react 또는 inline SVG), padding-right 22px
    - 배경: 투명 (콘텐츠 위에 겹침)
  </status_bar>

  <app_header>
    - 높이: 56px
    - 좌측: "winemine" 로고 (Playfair Display 22px, letter-spacing -0.02em, `--color-text-primary`)
    - 우측: 프로필 아바타 — 36×36 원형, 배경 `--color-wine-red`, 중앙에 `displayName`의 첫 글자 (Inter 600 14px `--color-cream`)
    - 좌우 패딩: 20px
    - 아바타 hover: scale 1.05, 150ms ease-out — 클릭 시 "프로필 — 곧 도착해요" 토스트
  </app_header>

  <stat_hero>
    - 높이: 200px
    - 좌우 마진: 16px (콘텐츠 영역 기준)
    - border-radius: 20px
    - 배경: `--color-surface` (#0F0718) + 하단 그라데이션 오버레이 `linear-gradient(180deg, transparent 0%, rgba(139,26,42,0.25) 100%)`
    - 보더: 1px solid `--color-border` (#2D1540)
    - 내부 레이아웃:
      - 상단 우측에 미니 월드맵 배경 (opacity 0.4, 절대 위치, 좌측은 마스킹으로 페이드)
      - 좌측 정렬 텍스트:
        - "안녕하세요, {displayName}님" — Inter 500 13px, `--color-text-muted`, padding-top 20px
        - "{winesTasted}병" — Playfair Display 44px, `--color-cream`, line-height 1.0, 8px gap below
        - "{countriesExplored}개국 · {regionsExplored}개 지역" — Inter 400 13px, `--color-text-secondary`
        - 하단 Gold 장식선 (1px × 32px, `--color-gold`)
      - 텍스트 컨테이너 패딩: 20px (top/left), 0 (right) — 텍스트는 좌측 60%만 차지, 우측은 지도용
    - mini world map:
      - 절대 위치: top 0, right 0, width 240px, height 200px
      - geographies fill: `--color-bg-map` (#1A0A1E)
      - stroke: rgba(201, 168, 76, 0.1) (Gold 0.1)
      - 핀 6개: `lib/recommended-wines.ts`의 `coords` + STARTING_WINE
        - 핀 1개(STARTING_WINE, Margaux): `--color-wine-red`, 8px 원, 부드러운 pulse 애니메이션 (2s ease-in-out infinite, opacity 0.6→1.0)
        - 나머지 5개: `--color-gold`, 5px 원, 정적
      - 좌측에서 우측으로 페이드 마스크 적용 (`mask-image: linear-gradient(to right, transparent 0%, black 30%)`)
  </stat_hero>

  <primary_cta>
    - 위치: stat_hero 아래 16px 간격
    - 좌우 마진: 16px
    - 높이: 56px
    - border-radius: 16px
    - 배경: `--color-wine-red` (#8B1A2A)
    - 콘텐츠: 좌측에 Camera 아이콘(lucide, 20px stroke 2, `--color-cream`) + "와인 라벨 스캔" (Inter 600 16px, `--color-cream`)
    - 콘텐츠 정렬: 중앙 정렬, 아이콘과 텍스트 사이 10px gap
    - hover (touch device 제외): 배경 `--color-wine-red-hover` (#A02030), shadow `0 0 20px rgba(139,26,42,0.4)`
    - active (tap): scale 0.97, 100ms ease-in
    - 클릭 시: PlaceholderToast — "라벨 스캔 — 카메라 권한이 필요해요 (시안)"
  </primary_cta>

  <feature_grid>
    - 위치: primary_cta 아래 20px 간격
    - 좌우 마진: 16px
    - 그리드: 2열, gap 12px, 3행
    - 카드 6개 (순서대로):
      1. 내 와인 지도 (icon: Globe2, sublabel: "전 세계 14개 지역")
      2. 테이스팅 노트 (icon: BookOpen, sublabel: "4종 양식 · 블라인드")
      3. 추천 와인 (icon: Sparkles, sublabel: "마신 산지 기반")
      4. 부르고뉴 가이드 (icon: Wine, sublabel: "꼬뜨→마을→등급")
      5. Recap 만들기 (icon: Share2, sublabel: "올해의 한 잔")
      6. 컬렉션 (icon: Library, sublabel: "32병 · 정렬 가능")
  </feature_grid>

  <feature_card>
    - 너비: 그리드 셀 너비 (대략 169px)
    - 높이: 96px
    - border-radius: 14px
    - 배경: `--color-surface` (#0F0718)
    - 보더: 1px solid `--color-border` (#2D1540)
    - 내부 패딩: 14px
    - 콘텐츠 (세로 스택, gap 6px):
      - 상단: 아이콘 (lucide 20px, stroke 1.75, `--color-gold` #C9A84C)
      - 라벨: Playfair Display 16px, `--color-cream`
      - sublabel: Inter 400 11px, `--color-text-muted` (#9B8B7A), line-height 1.4
    - hover: 보더 → `--color-border-active` (#8B1A2A), translateY -2px, 200ms ease-out, shadow `0 8px 24px rgba(139,26,42,0.15)`
    - active (tap): scale 0.98
    - 클릭 시: PlaceholderToast — feature.placeholderMessage (예: "내 와인 지도 — 곧 도착해요")
  </feature_card>

  <bottom_nav>
    - 위치: 콘텐츠 영역 하단에 fixed
    - 높이: 83px (탭 영역 49px + 홈 인디케이터 safe area 34px)
    - 배경: rgba(15, 7, 24, 0.92) + backdrop-filter blur(20px) — `--color-surface` 약간 투명
    - 상단 보더: 1px solid `--color-border`
    - 5탭 구성 (좌→우):
      1. 홈 (icon: Home, label: "홈") — 활성 탭 (선택 상태)
      2. 지도 (icon: MapPin, label: "지도")
      3. 스캔 FAB — 중앙 (icon: Camera, 56×56 원형, `--color-wine-red` 배경, 흰 아이콘 24px, 보더 4px solid `--color-bg-deepest`, top -16px로 살짝 튀어나옴)
      4. 노트 (icon: BookOpen, label: "노트")
      5. 프로필 (icon: User, label: "프로필")
    - 일반 탭: 아이콘 20px (stroke 1.75, 비활성은 `--color-text-muted`, 활성은 `--color-gold`), 라벨 Inter 500 10px (동일 색 규칙), 아이콘-라벨 gap 4px
    - 탭 클릭 시: 시각적 활성 상태만 토글, 라우팅 X — 토스트로 "{탭명} — 곧 도착해요"
    - FAB 클릭 시: PrimaryCTA와 동일한 토스트
  </bottom_nav>

  <placeholder_toast>
    - 위치: DeviceFrame 외부, 페이지 중앙 상단에서 24px 아래 (데스크톱) / 콘텐츠 상단 (모바일)
    - 너비: max 320px, padding 14px 20px
    - 배경: `--color-surface`, 보더 1px solid `--color-gold`, border-radius 12px
    - shadow: `0 10px 30px rgba(0,0,0,0.5)`
    - 콘텐츠: 아이콘(Sparkles, 16px, `--color-gold`) + 메시지 (Inter 500 13px, `--color-cream`)
    - 동작: 클릭 → 진입 (opacity 0→1, translateY -8→0, 200ms ease-out), 2.5s 후 자동 dismiss (opacity 1→0, 200ms ease-in)
    - 한 번에 1개만 표시, 새 호출이 오면 기존 토스트는 즉시 교체
    - Framer Motion `AnimatePresence` 사용
  </placeholder_toast>

  <feature_flag_panel>
    - 위치: 데스크톱 ≥1280px에서만 표시 (그 미만에서는 숨김)
    - DeviceFrame 우측 32px 간격, top 정렬, 폭 320px
    - 패널 배경: `--color-surface`, 보더 1px solid `--color-border`, border-radius 16px, padding 20px
    - 제목: "이 화면에 무엇을 남길까?" (Playfair Display 18px, `--color-cream`)
    - 부제: "결정해야 하는 기능 — 체크해서 in/out 확인" (Inter 400 12px, `--color-text-muted`)
    - 항목: FeatureEntry 6개 (feature-grid와 동일) + PrimaryCTA(스캔) + BottomNav(5탭) = 12개 항목
    - 각 항목: 좌측 체크박스 (24×24, 보더 1px `--color-border`, 체크 시 `--color-wine-red` fill + Cream 체크 아이콘), 라벨 (Inter 500 13px), 우측 상태 배지 (planned=Gold, considering=Cream, dropped=muted)
    - 체크 토글 시: 키스크린 안에서 해당 카드/CTA의 시각적 표현 변경 — `dropped`면 카드 opacity 0.25 + 위에 strike-through 라인
    - 패널은 의사결정을 시각적으로 비교하기 위한 도구. 실제로 기능을 활성/비활성하는 것이 아니라 "이 항목을 뺀다면 화면이 이렇게 보임"을 즉시 보여준다.
  </feature_flag_panel>

  <empty_state>
    - 본 시안은 데이터가 항상 채워져 있으므로 빈 상태가 필요한 화면은 없다. 단, MiniWorldMap이 로드 중일 때는 200×240 영역에 dotted 그리드 placeholder (rgba(245,240,232,0.04)) 표시.
  </empty_state>

  <keyboard_shortcuts_reference>
    - 본 시안은 키보드 단축키를 제공하지 않는다 (모바일 시안). 단, 데스크톱 검수 편의를 위해:
      - `?` — 핫키 가이드 모달 토글 (있다면)
      - `Esc` — 토스트 즉시 dismiss
  </keyboard_shortcuts_reference>

</pages_and_interfaces>

<core_functionality>
  <feature_shopping>
    - 6개 기능 카드 + 1개 primary CTA + 5개 바텀 내비 탭이 모두 클릭 가능
    - 클릭 시 토스트 메시지로 placeholder 응답
    - 활성/비활성 탭 시각적 상태 표시 (홈이 기본 활성)
    - FeatureFlagPanel에서 항목을 dropped로 토글하면 키스크린의 해당 요소가 즉시 시각적으로 흐려짐 — 의사결정 비교용
  </feature_shopping>

  <mini_map_visualization>
    - react-simple-maps + topojson-client로 `public/world-110m.json` 로드
    - dynamic import + ssr:false 필수
    - 7개 핀 (STARTING_WINE + 6 RECOMMENDED_WINES) 좌표 렌더링
    - STARTING_WINE 핀만 pulse 애니메이션, 나머지는 정적
    - 인터랙션 없음 (정적 배경)
  </mini_map_visualization>

  <toast_feedback>
    - 모든 placeholder 동작은 PlaceholderToast로 응답
    - 토스트 큐 길이는 1 — 새 호출은 기존 토스트를 즉시 대체
    - 토스트는 DeviceFrame 외부 (데스크톱) 또는 콘텐츠 상단(모바일)에 렌더
  </toast_feedback>

  <responsive_frame_strategy>
    - 데스크톱: 페이지 중앙에 DeviceFrame, 우측에 FeatureFlagPanel
    - 태블릿: DeviceFrame 단독 중앙, FeatureFlagPanel 숨김
    - 모바일: 프레임 제거, 키스크린 콘텐츠를 전체화면으로 (단 max-width 390px)
  </responsive_frame_strategy>
</core_functionality>

<error_handling>
  <user_facing>
    <toast_notifications>
      - 단일 토스트 종류만 사용: 정보성 placeholder (Gold 보더, Cream 텍스트)
      - 2.5s 자동 dismiss
      - 동시 최대 1개
    </toast_notifications>
    <map_load_failure>
      - MiniWorldMap이 로드에 실패하면 (404 등) stat_hero 우측은 빈 영역으로 두고 좌측 텍스트만 표시 (silent fallback)
      - 콘솔에 `[mini-map] failed to load world-110m.json` 경고
    </map_load_failure>
  </user_facing>
  <error_boundaries>
    - `app/page.tsx`에 단일 React Error Boundary — 오류 시 "시안 로딩 실패. 새로고침 해주세요" 텍스트만 표시
  </error_boundaries>
  <network_errors>
    - 해당 없음 (네트워크 호출 없음)
  </network_errors>
</error_handling>

<third_party_integrations>
  <note>외부 서비스 통합 없음. 본 프로젝트는 정적 시안이며, 분석·인증·이메일·결제 SDK를 일체 포함하지 않는다.</note>
</third_party_integrations>

<aesthetic_guidelines>

  <design_fusion>
    프리미엄 와인 라벨의 무게감을 모바일 앱 첫 화면에 압축한다. 어두운 밤(deepest dark)에 깊은 와인 레드와 골드 액센트가 떠 있다. 과한 글로우·그라데이션을 자제하고 타이포그래피(Playfair Display의 우아한 serif)와 여백으로 고급감을 전달한다. 데이터 시각화는 미니멀 — 미니 월드맵의 핀과 통계 숫자가 주역이다.
  </design_fusion>

  <color_palette>
    <primary_colors>
      - Wine Red: #8B1A2A — PrimaryCTA, 프로필 아바타, FAB, STARTING_WINE 핀
      - Wine Red Hover: #A02030 — CTA hover
      - Gold: #C9A84C — 아이콘, 장식선, 추천 와인 핀, 활성 탭, FeatureFlagPanel 보더
      - Cream: #F5F0E8 — 모든 본문 텍스트와 라벨
    </primary_colors>
    <background_colors>
      - Deepest Dark: #05020A — 페이지 배경, DeviceFrame 콘텐츠 배경
      - Deep Dark: #0A050F — DeviceFrame 베젤, 페이지 그라데이션 끝
      - Surface: #0F0718 — Stat hero, 기능 카드, 토스트, FeatureFlagPanel
      - Map Dark: #1A0A1E — 미니 월드맵의 국가 fill
    </background_colors>
    <text_colors>
      - Primary: #F5F0E8 — 큰 숫자, CTA, 카드 라벨
      - Secondary: #D4C5B0 — 국가·지역 부가 정보
      - Muted: #9B8B7A — 인사말, sublabel, 비활성 탭
      - Disabled: #4A3D56 — 사용 안 함 (참고용)
    </text_colors>
    <status_colors>
      - Border Default: #2D1540 — 카드·토스트·패널 보더
      - Border Active: #8B1A2A — 카드 hover, 활성 강조
      - Error: #EF4444 — 본 시안에서 미사용 (보존)
    </status_colors>
    <feature_flag_states>
      - planned: #C9A84C (Gold) — 확정된 기능
      - considering: #F5F0E8 (Cream) — 검토 중
      - dropped: #4A3D56 (Disabled) — 제거 후보, 키스크린에서 opacity 0.25
    </feature_flag_states>
  </color_palette>

  <typography>
    <font_families>
      - Display: "Playfair Display", Georgia, serif — 로고, 통계 큰 숫자, 카드 라벨, 토스트 제목
      - Body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif — 본문, 버튼, sublabel
      - Korean fallback: "Noto Sans KR" — 자동 글리프 fallback
    </font_families>
    <font_sizes>
      - Logo (winemine): 22px, weight 400, letter-spacing -0.02em (Playfair Display)
      - Stat Hero 큰 숫자: 44px, weight 400 (Playfair Display)
      - Stat Hero 라벨/부가: 13px, weight 400 (Inter / Noto Sans KR)
      - Stat Hero 인사말: 13px, weight 500
      - PrimaryCTA 텍스트: 16px, weight 600
      - 카드 라벨: 16px, weight 400 (Playfair Display)
      - 카드 sublabel: 11px, weight 400, line-height 1.4 (Inter)
      - 바텀 내비 라벨: 10px, weight 500
      - 상태바 시계: 15px, weight 500
      - 토스트 메시지: 13px, weight 500
      - FeatureFlagPanel 제목: 18px (Playfair)
      - FeatureFlagPanel 부제: 12px
      - FeatureFlagPanel 항목 라벨: 13px, weight 500
    </font_sizes>
    <line_heights>
      - 큰 숫자: 1.0
      - 본문: 1.5
      - sublabel: 1.4
      - 버튼: 1.0
    </line_heights>
  </typography>

  <spacing>
    - Base unit: 4px
    - Scale: 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 56
    - DeviceFrame 콘텐츠 좌우 패딩: 16px
    - 섹션 사이 수직 간격: 16~20px
    - 카드 내부 패딩: 14px
    - 그리드 gap: 12px
  </spacing>

  <borders_and_shadows>
    <borders>
      - Default card border: 1px solid #2D1540
      - Active/hover: 1px solid #8B1A2A
      - FeatureFlagPanel: 1px solid #2D1540
      - 바텀 내비 상단: 1px solid #2D1540
      - border-radius: 카드 14px, CTA 16px, 패널 16px, 토스트 12px, DeviceFrame 50px(외부)/38px(내부 콘텐츠)
    </borders>
    <shadows>
      - DeviceFrame: `0 40px 100px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(201, 168, 76, 0.08)`
      - CTA hover: `0 0 20px rgba(139, 26, 42, 0.4)`
      - 카드 hover: `0 8px 24px rgba(139, 26, 42, 0.15)`
      - 토스트: `0 10px 30px rgba(0, 0, 0, 0.5)`
      - FAB: `0 8px 24px rgba(139, 26, 42, 0.35)`
    </shadows>
  </borders_and_shadows>

  <component_styling>
    <buttons>
      - PrimaryCTA: 풀폭(좌우 마진 16px), 56px 높이, border-radius 16px, Wine Red 배경, Cream 텍스트
      - 카드: 96px 높이, 14px radius, Surface 배경
      - FAB: 56×56 원형, Wine Red, 4px Deepest Dark 보더, 중앙 정렬
      - 모든 버튼 active: scale 0.97 또는 0.98, 100ms ease-in
    </buttons>
    <inputs>
      - 해당 없음 (입력 필드 없음)
    </inputs>
    <cards>
      - 위 feature_card 사양 참고
    </cards>
    <avatars>
      - 36×36 원형, Wine Red 배경, Cream 첫 글자 텍스트, 14px Inter 600
    </avatars>
    <toasts>
      - 위 placeholder_toast 사양 참고
    </toasts>
    <badges>
      - FeatureFlagPanel 상태 배지: 16px 높이, 8px 좌우 패딩, 8px radius, 11px Inter 500, 상태별 색상
    </badges>
  </component_styling>

  <animations>
    <micro_interactions>
      - 카드 hover: translateY -2px + 보더 컬러 전환, 200ms ease-out
      - 버튼 active: scale 0.97~0.98, 100ms ease-in
      - 아바타 hover: scale 1.05, 150ms ease-out
      - STARTING_WINE 핀 pulse: opacity 0.6 ↔ 1.0, 2s ease-in-out, infinite
    </micro_interactions>
    <page_load>
      - 페이지 전체: opacity 0→1, 400ms ease-out
      - 키스크린 내부 섹션 stagger: AppHeader → StatHero → PrimaryCTA → FeatureGrid → BottomNav, 각 100ms delay, translateY 12→0, opacity 0→1, 350ms ease-out
      - useReducedMotion 존중 — 모션 비활성 시 모든 트랜지션은 즉시 완료
    </page_load>
    <toast_lifecycle>
      - enter: opacity 0→1, translateY -8→0, 200ms ease-out
      - exit: opacity 1→0, 200ms ease-in
      - 자동 dismiss: 2500ms 후 exit
    </toast_lifecycle>
  </animations>

  <responsive_design>
    <breakpoints>
      - mobile: 0–767px (DeviceFrame 숨김, 콘텐츠 전체화면, max-width 390px 중앙)
      - tablet: 768–1279px (DeviceFrame 단독 중앙, FeatureFlagPanel 숨김)
      - desktop: 1280px+ (DeviceFrame 중앙 + FeatureFlagPanel 우측)
    </breakpoints>
    <mobile_adaptations>
      - DeviceFrame 컴포넌트는 `display: none` (또는 wrapper 분기)
      - 상태바·노치·홈 인디케이터 숨김
      - 콘텐츠는 viewport에 직접 — 단, body 좌우 패딩 0, 내부 콘텐츠 영역 좌우 16px 유지
      - 바텀 내비는 fixed bottom, safe-area-inset-bottom 적용
    </mobile_adaptations>
    <touch_interactions>
      - hover 효과는 `@media (hover: hover)`로 가두어 터치 디바이스에서 부작용 방지
      - 최소 tap target: 44×44px (바텀 내비 탭, 카드 모두 충족)
      - 카드 tap 응답: 100ms 이내 scale 0.98 시각 피드백
    </touch_interactions>
  </responsive_design>

  <icons>
    - 라이브러리: lucide-react v0.475+
    - 기본 크기: 20px (탭 아이콘), 24px (FAB), 16px (토스트)
    - 기본 stroke: 1.75
    - 색상: 활성 `--color-gold`, 비활성 `--color-text-muted`, CTA 내부 `--color-cream`
  </icons>

  <accessibility>
    - DeviceFrame `role="img"` `aria-label="winemine 키스크린 시안 — iPhone 목업"`
    - 키스크린 내부는 일반 문서 구조 (`<header>`, `<main>`, `<nav>`)
    - 모든 인터랙티브 요소에 `aria-label` 또는 보이는 텍스트 라벨
    - 색상 대비: Cream on Surface, Cream on Wine Red 모두 WCAG AA 충족
    - `prefers-reduced-motion` 존중 — useReducedMotion()으로 분기, 모션 비활성 시 opacity transition만 유지
    - 키보드 포커스: 모든 버튼에 focus-visible outline 2px solid `--color-gold`, offset 2px
  </accessibility>

</aesthetic_guidelines>

<security_considerations>
  <input_validation>
    - 사용자 입력 없음. 외부 데이터 받지 않음.
  </input_validation>
  <client_security>
    - CRITICAL: 시크릿·API 키 일체 없음. `.env.local` 만들지 말 것.
    - 외부 스크립트 로드 없음 — 분석 코드(`window.gtag`)도 비활성화 상태로 둔다 (analytics.ts는 보존하되 layout에서 import 금지).
  </client_security>
  <static_assets>
    - `public/world-110m.json`은 정적 자산 — Next.js가 자동으로 캐시 헤더 부착
  </static_assets>
</security_considerations>

<advanced_functionality>
  <feature_flag_panel_behavior>
    - 패널의 체크박스는 로컬 컴포넌트 상태(`useState<Record<string, FeatureStatus>>`)에 보관
    - 새로고침하면 초기값으로 리셋 (저장 X)
    - 상태가 변하면 키스크린 내부 해당 노드에 `data-feature-status="dropped"` 속성 부여, Tailwind 선택자로 opacity 0.25 + grayscale 적용
    - 키스크린은 항상 모든 요소를 렌더링한다 — flag는 시각적 dim만 결정. "어떤 것을 빼면 화면이 어떻게 보이는지" 즉시 비교용.
  </feature_flag_panel_behavior>
  <screenshot_friendliness>
    - DeviceFrame은 정확한 1:1 비율로 렌더되므로 데스크톱 검수자가 화면 캡처해서 그대로 시안 공유 가능
    - 페이지 배경의 그라데이션은 캡처 시 잘리지 않도록 DeviceFrame 둘레 80px 이상 여백 유지
  </screenshot_friendliness>
</advanced_functionality>

<final_integration_test>

  <test_scenario_1>
    <description>데스크톱에서 키스크린 첫 로드</description>
    <steps>
      1. `npm run dev` 후 Chrome에서 http://localhost:3000 접속 (뷰포트 1440×900)
      2. 페이지 중앙에 iPhone 390×844 프레임이 단독으로 나타나는지 확인
      3. 프레임 상단에 Dynamic Island, 하단에 홈 인디케이터가 보이는지 확인
      4. 상태바에 "9:41"이 표시되는지 확인
      5. winemine 로고가 Playfair Display로 렌더되는지 확인
      6. Stat Hero에 "32병", "8개국 · 14개 지역" 텍스트가 보이는지 확인
      7. 미니 월드맵이 stat hero 우측에 페이드되며 표시, STARTING_WINE 핀이 pulse 애니메이션 되는지 확인
      8. 우측 320px 패널(FeatureFlagPanel)이 표시되는지 확인
      9. 페이지 로드 stagger 애니메이션이 350ms 간격으로 위→아래 순서로 진입하는지 확인
    </steps>
  </test_scenario_1>

  <test_scenario_2>
    <description>모든 인터랙티브 요소 클릭 시 토스트 응답</description>
    <steps>
      1. PrimaryCTA "와인 라벨 스캔" 클릭 → 토스트 "라벨 스캔 — 카메라 권한이 필요해요 (시안)" 노출
      2. FeatureCard 6개를 순차 클릭 → 각각 해당 placeholderMessage 토스트
      3. 토스트는 한 번에 1개만 보이고, 새 클릭이 발생하면 즉시 교체되는지 확인
      4. 토스트는 2.5초 후 자동으로 사라지는지 확인
      5. 바텀 내비 5탭 (홈/지도/FAB/노트/프로필) 클릭 → 각각 토스트, FAB 클릭은 PrimaryCTA와 동일 메시지
      6. 프로필 아바타 클릭 → "프로필 — 곧 도착해요" 토스트
      7. 페이지 어디서도 라우팅이나 새로고침이 발생하지 않는지 확인
    </steps>
  </test_scenario_2>

  <test_scenario_3>
    <description>FeatureFlagPanel 토글로 키스크린 비교</description>
    <steps>
      1. FeatureFlagPanel에서 "Recap 만들기" 항목의 상태를 dropped로 변경
      2. 키스크린 내 5번째 카드(Recap)가 opacity 0.25 + 흐려진 상태로 변경되는지 확인
      3. 다시 considering 또는 planned로 토글 → 원상 복귀
      4. "테이스팅 노트" 항목을 dropped로 변경 → 2번째 카드 + 바텀 내비 "노트" 탭이 동시에 흐려지는지 확인
      5. 페이지 새로고침 → 모든 flag가 초기값으로 리셋되는지 확인
    </steps>
  </test_scenario_3>

  <test_scenario_4>
    <description>모바일 viewport에서 프레임 제거 확인</description>
    <steps>
      1. Chrome DevTools에서 모바일 에뮬레이션 (iPhone 14, 390×844)
      2. DeviceFrame이 렌더되지 않고 키스크린 콘텐츠가 viewport 풀스크린으로 표시되는지 확인
      3. 상태바·노치·홈 인디케이터 비활성 (또는 숨김)
      4. 바텀 내비가 safe-area-inset-bottom을 고려해 fixed bottom에 정상 위치
      5. FeatureFlagPanel은 숨김
      6. 콘텐츠 좌우 16px 패딩 유지
    </steps>
  </test_scenario_4>

  <test_scenario_5>
    <description>접근성 — 키보드 + 모션 감소</description>
    <steps>
      1. 데스크톱에서 Tab 키로 PrimaryCTA → FeatureCard 6개 → BottomNav 5탭 순서 포커스 순환
      2. 포커스 시 2px Gold outline이 보이는지 확인
      3. Enter/Space 키로 활성 → 토스트가 동일하게 노출되는지 확인
      4. OS 설정에서 모션 줄이기 활성화 후 페이지 새로고침
      5. 페이지 로드 stagger 애니메이션이 즉시 완료(또는 opacity만 fade)되는지 확인
      6. STARTING_WINE 핀의 pulse 애니메이션이 정지되는지 확인
    </steps>
  </test_scenario_5>

</final_integration_test>

<success_criteria>

  <functionality>
    - 키스크린이 데스크톱·태블릿·모바일 viewport에서 모두 정상 렌더
    - 12개 인터랙티브 요소 (PrimaryCTA + 6 card + 5 tab) 모두 클릭 가능, 모두 토스트로 응답
    - FeatureFlagPanel 토글이 키스크린 내 시각 표현을 즉시 반영 (300ms 이내)
    - 페이지 새로고침 시 panel 상태가 초기화됨
  </functionality>

  <user_experience>
    - 페이지 로드 (LCP) 2.5초 이내 (정적 자산만 사용하므로 1초 이내가 목표)
    - 모든 클릭 응답 100ms 이내
    - DeviceFrame 안의 콘텐츠가 정확히 390×844 안에 들어가고 가로 스크롤 없음
    - 페이지 어디서도 라우팅 발생 안 함
  </user_experience>

  <technical_quality>
    - TypeScript strict 통과 (any 사용 0)
    - 모든 컴포넌트가 클라이언트 컴포넌트인지 서버 컴포넌트인지 명시 (`"use client"` 적절히 사용)
    - react-simple-maps는 dynamic import + ssr:false로 안전하게 로드
    - ESLint 경고 0
    - 빌드 시 코드 분할로 메인 번들 200KB 이내 (gzip)
  </technical_quality>

  <visual_design>
    - 모든 색상은 `tokens.css`의 CSS 변수만 사용 (hex 직접 작성 금지)
    - Playfair Display / Inter / Noto Sans KR 폰트가 정확히 로드 (FOUT 최소화)
    - 디자인 시스템 (DESIGN_SYSTEM.md) 명세와 100% 일치
    - 다크 모드 단일 — 라이트 모드 누락 X
  </visual_design>

  <build>
    - `npm run build` 무경고 통과
    - `npm run dev`에서 핫리로드 정상
    - Vercel deploy 가능 (선택) — 본 시안 검수용으로만
  </build>

</success_criteria>

<build_output>
  <build_command>npm run build</build_command>
  <output_directory>.next/</output_directory>
  <contents>
    - 정적 페이지 1개 (`/`)
    - 자산: `public/world-110m.json` (107KB), `public/logo.png`, `public/winemine-glass-mark.png`
    - 폰트: Next.js가 self-hosted로 번들
  </contents>
  <deployment>
    - 로컬 dev 서버에서 검수가 1차 목적
    - Vercel 또는 GitHub Pages export 시 추가 설정 없음 (단, Pages용 정적 export가 필요하면 `output: "export"` 추가)
  </deployment>
</build_output>

<key_implementation_notes>

  <critical_paths>
    - DeviceFrame 컴포넌트가 시안의 핵심 — 정확한 390×844 비율, Dynamic Island/홈 인디케이터 위치, 베젤 두께를 최우선으로 맞춘다.
    - MiniWorldMap의 SSR 이슈: `dynamic(() => import('@/components/keyscreen/mini-world-map'), { ssr: false })` 누락하면 빌드 실패. world-110m.json의 `geo.id`는 `String(geo.id).padStart(3, '0')`로 isoNumeric 매칭.
    - FeatureFlagPanel은 키스크린 내부 요소의 시각 표현만 바꾼다 — 실제 마운트를 토글하지 말 것 (애니메이션 깨짐). Tailwind selector + data 속성으로 dim 처리.
    - 모든 색상은 CSS 변수로만 — hex 하드코딩 금지.
  </critical_paths>

  <recommended_implementation_order>
    1. Next.js 15 scaffold (App Router, TS strict, Tailwind v4)
    2. `styles/tokens.css`를 `app/globals.css`에서 import + Tailwind v4 `@theme` 블록 작성 (CSS 변수 → Tailwind utility 매핑)
    3. `app/layout.tsx`: next/font로 Playfair Display + Inter + Noto Sans KR 로드, `<html lang="ko">`, 다크 배경
    4. DeviceFrame 컴포넌트 — 정확한 dimensions, Dynamic Island, 홈 인디케이터, shadow, border-radius
    5. PageBackground (다크 그라데이션)와 DeviceFrame을 `app/page.tsx`에서 합성
    6. StatusBar (정적)
    7. AppHeader (로고 + 아바타)
    8. MiniWorldMap (dynamic import) — react-simple-maps + topojson-client로 7개 핀 렌더
    9. StatHero — MiniWorldMap을 배경으로 텍스트 오버레이
    10. PrimaryCTA
    11. FeatureCard 컴포넌트 → FeatureGrid (2×3)
    12. BottomNav (5탭 + FAB)
    13. PlaceholderToast + AnimatePresence
    14. 모든 버튼에 onClick 연결, 토스트 호출
    15. FeatureFlagPanel (데스크톱 ≥1280px만) + data 속성 기반 시각 토글
    16. Framer Motion 페이지 로드 stagger 애니메이션
    17. 반응형 분기 (mobile에서 프레임 숨김, FeatureFlagPanel 숨김)
    18. 접근성 마무리 (focus outline, aria 속성, reduced-motion 분기)
    19. 통합 테스트 5종 수행
    20. (선택) Vercel deploy
  </recommended_implementation_order>

  <data_setup>
    - `src/lib/keyscreen-mock.ts`:
      ```ts
      export const USER_MOCK = {
        displayName: '예진',
        winesTasted: 32,
        countriesExplored: 8,
        regionsExplored: 14,
        joinedAt: '2025-09-12',
        avatarInitial: '예',
      } as const;

      export const FEATURE_ENTRIES = [
        { id: 'my-map',       label: '내 와인 지도',   sublabel: '전 세계 14개 지역',    icon: 'Globe2',   status: 'planned',     ctaKind: 'card',    placeholderMessage: '내 와인 지도 — 곧 도착해요' },
        { id: 'tasting-note', label: '테이스팅 노트',  sublabel: '4종 양식 · 블라인드',  icon: 'BookOpen', status: 'planned',     ctaKind: 'card',    placeholderMessage: '테이스팅 노트 — 4종 양식 준비 중' },
        { id: 'recommend',    label: '추천 와인',      sublabel: '마신 산지 기반',       icon: 'Sparkles', status: 'planned',     ctaKind: 'card',    placeholderMessage: '추천 와인 — 곧 도착해요' },
        { id: 'burgundy',     label: '부르고뉴 가이드',sublabel: '꼬뜨→마을→등급',       icon: 'Wine',     status: 'considering', ctaKind: 'card',    placeholderMessage: '부르고뉴 드릴다운 — 검토 중' },
        { id: 'recap',        label: 'Recap 만들기',   sublabel: '올해의 한 잔',         icon: 'Share2',   status: 'considering', ctaKind: 'card',    placeholderMessage: 'Recap — 검토 중' },
        { id: 'library',      label: '컬렉션',         sublabel: '32병 · 정렬 가능',     icon: 'Library',  status: 'planned',     ctaKind: 'card',    placeholderMessage: '컬렉션 — 곧 도착해요' },
      ] as const;
      ```
  </data_setup>

  <performance_considerations>
    - MiniWorldMap만 동적 로드되므로 초기 번들이 가볍다. Framer Motion은 트리쉐이킹이 안 되므로 import는 필요한 컴포넌트만 (`AnimatePresence`, `motion.div` 등 부분).
    - world-110m.json은 107KB — 그대로 fetch. 필요 시 mini 영역에만 보여주므로 가능하면 사전 simplify(요지화)된 더 작은 topology를 만들어 교체 가능 (향후 최적화).
  </performance_considerations>

  <testing_strategy>
    - 단위 테스트 불필요 (시안 단계)
    - 수동 통합 테스트만 — 위 5개 시나리오를 Chrome + Safari + DevTools mobile emulation에서 수행
    - Lighthouse는 참고용으로만 (성능·접근성 점수 90+ 목표)
  </testing_strategy>

  <tool_usage>
    - 디자인 검수: Chrome DevTools mobile emulation (iPhone 14)에서 1:1 확인
    - 스크린샷: 페이지 풀스크린 캡처 후 시안 공유에 활용 — DeviceFrame이 항상 보이도록 데스크톱 뷰포트 사용
    - 색상 대비 검증: `tokens.css`의 색상 조합을 WebAIM Contrast Checker로 검수 (Cream on Surface, Cream on Wine Red)
  </tool_usage>

</key_implementation_notes>

</project_specification>
