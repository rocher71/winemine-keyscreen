# winemine — App Prototype Context

> 이 파일은 winemine 랜딩 페이지 레포(`Phase 1`)에서 추출한 **앱 프로토타입 개발용 컨텍스트**다.
> 랜딩 페이지 전용 내용(Supabase waitlist, Server Action, 폼/모달 컴포넌트, i18n middleware, 배포 설정 등)은 모두 제거되었다.

---

## 서비스 정체성

**winemine**은 와인 라벨을 촬영하면 AI가 와인을 인식하고, 마신 와인을 세계 지도 위에 지역별로 시각화해 기록하는 앱이다.

- 서비스명: **winemine** (소문자, 붙여쓰기 고정)
- 핵심 감성: 프리미엄 와인 라벨의 무게감. 어두운 밤, 와인 한 잔.
- 현재 단계: **Phase 2 — 앱 프로토타입 (목업 UI, 브라우저에서 동작)**

### 핵심 사용자 경험
1. 와인 라벨 촬영 → AI가 품종/빈티지/생산자/원산지 추출
2. 세계 지도 위에 자동으로 핀이 꽂힘. 마실수록 지도가 와인 컬러로 물든다
3. 지역을 누르면 드릴다운 (예: 프랑스 → 보르도 → 포므롤)
4. Flighty/YouTube Music Recap 스타일의 공유 가능한 Recap 이미지 자동 생성

---

## 디자인 시스템

### 색상 팔레트
```
Wine Red (Primary):  #8B1A2A   — CTA, 와인 국가 fill, 강조
Wine Red Hover:      #A02030
Gold (Accent):       #C9A84C   — 장식선, 아이콘, 성공 상태
Cream (Text):        #F5F0E8   — 제목, 주요 텍스트
Secondary Text:      #D4C5B0
Muted Text:          #9B8B7A   — 설명, 부제
Disabled:            #4A3D56   — placeholder, 비활성
Deepest Dark:        #05020A   — 주 배경
Deep Dark:           #0A050F   — 교차 섹션 배경
Map Dark:            #1A0A1E   — 지도 기본 국가 fill, input bg
Surface:             #0F0718   — 모달/카드 배경
Border:              #2D1540
Border Active:       #8B1A2A
Error:               #EF4444
```

### 타이포그래피
- **Playfair Display** (serif) — 로고, 제목, 모달 타이틀
- **Inter** (sans-serif) — 본문, 버튼, 입력
- **Noto Sans KR** — 한국어 본문 fallback

### 로고 규칙
- 항상 **소문자 `winemine`** (대문자/분리 금지)
- Playfair Display, letter-spacing: -0.02em

### 절대 금지 — Emoji 사용 금지
이 프로젝트는 어떠한 UI 요소에도 **emoji를 사용하지 않는다**. (예: 🍷 🍓 🤩 🙂 🤔 📸 📷 ✦ 등)

- 이모지가 들어갈 자리에는 항상 **lucide-react 아이콘**을 사용한다.
  - 별점 → `Star` (fill로 채움 상태 표현)
  - 와인 → `Wine` / `WineOff`
  - 카메라 → `Camera`
  - 체크 → `Check`
  - 경고 → `AlertTriangle`
  - 아로마 카테고리 → `Cherry`/`Citrus`/`Apple`/`Flower2`/`Flame`/`Candy`/`Sprout`/`Wheat` 등
  - 인상 → `Sparkles`/`Smile`/`HelpCircle` 등
- 텍스트 디자인 요소(`·`, `→`)는 허용. 단, variation selector(U+FE0F) 붙은 dingbat은 emoji로 렌더되므로 금지.
- mock 데이터, JSON, 코드 코멘트, 본문 텍스트 모두 동일하게 적용.
- 새 컴포넌트 작성 시 `grep -P "[\\x{1F300}-\\x{1FAFF}\\x{2600}-\\x{27BF}\\x{1F900}-\\x{1F9FF}]"`로 self-check.

---

## 기술 스택 권장 (Phase 1 기준)

| 레이어 | 선택 | 비고 |
|--------|------|------|
| 프레임워크 | Next.js 15 App Router | 프로토타입 단계 — 단일 페이지 SPA로도 충분 |
| 언어 | TypeScript 5.7 (strict) | |
| 스타일 | Tailwind CSS v4 | `styles/tokens.css` 참조 |
| 세계 지도 | react-simple-maps v3 + topojson-client v3 | SSR 불가 — dynamic import 필요 |
| 애니메이션 | Framer Motion v12 | |
| 아이콘 | lucide-react | |
| 폼 (필요 시) | react-hook-form v7 + zod v3 | `lib/validations.ts` 패턴 재사용 |

**프로토타입이므로 백엔드/DB/인증은 mock 데이터로 시작 권장.**

---

## 지도 구현 주의사항 (랜딩에서 학습한 것)

- `react-simple-maps`는 브라우저 API 사용 → **SSR 불가**, dynamic import 필수:
  ```ts
  dynamic(() => import('@/components/map/world-map'), { ssr: false })
  ```
- 국가 식별: `geo.id`를 3자리 숫자 문자열로 패딩 (`String(geo.id).padStart(3, '0')`) — `ISO_A3`/`ADM0_A3` **아님**
- 지도 데이터: `public/world-110m.json` (기본), `public/france-departments.json` (프랑스 데파르트망)

---

## 도메인 데이터 (재사용 가능)

| 파일 | 내용 |
|------|------|
| `lib/recommended-wines.ts` | 입문용 추천 와인 mock, `STARTING_WINE` (Margaux) + 6개 국가 대표 와인 |
| `lib/tasting-note-lexicon.ts` | UC Davis 아로마 휠, WSET 디스크립터, 결함 카탈로그 등 — 전문가 와인 어휘 |
| `lib/validations.ts` | 한국 전화번호 정규식, 이메일 검증 (가입 흐름에 재사용) |
| `lib/analytics.ts` | window.gtag 래퍼 (GA 연결 시 재사용) |
| `messages/ko.json`, `en.json` | 한·영 와인 도메인 카피 (테이스팅 노트 단계, 부르고뉴 용어, 와인 카드 톤) |
| `public/world-110m.json` | 세계 지도 (low-res) |
| `public/france-departments.json` | 프랑스 데파르트망 |

---

## 도메인 레퍼런스 문서

`docs/` 폴더 참조:

- **`burgundy-classification-research.md`** — 부르고뉴 분류 체계의 와인 덕후 관점 리서치 + 한·불 용어집. 앱에서 부르고뉴 와인 표시할 때 분류 위계 참고
- **`burgundy-section-spec.md`** — 부르고뉴 드릴다운 UX (꼬뜨→마을→등급→와인) 사양 — 앱의 지도 드릴다운 패턴 참고
- **`wine-discovery-section-spec.md`** — 초보자 친화 5단계 스크롤 스토리텔링 — 온보딩 흐름 참고
- **`tasting-note-section-spec.md`** — 테이스팅 노트 작성 흐름 (블라인드 모드 포함). 앱의 핵심 기능 중 하나

---

## 외부 와인 리서치 레포

**경로:** `/Users/yejinkim/Documents/git/wine-research/_workspace/`

구현 전 관련 주제의 리서치 문서를 반드시 참고할 것. 파일 목록:

| 파일 | 내용 |
|------|------|
| `01_sensory_research.md` | 와인 감각(색·향·맛) 과학적 분석 |
| `02_flavor_research.md` | 풍미 화합물, 아로마 계통 |
| `03_temporal_research.md` | 숙성·빈티지·음용 적기(drinking window) |
| `04_consumer_research.md` | 와인 소비자 행동 리서치 |
| `06_world_regions_research.md` | 세계 와인 산지 개요 |
| `07_france_regions_research.md` | 프랑스 와인 산지 상세 |
| `08_burgundy_classification_research.md` | 부르고뉴 분류 체계 리서치 |
| `09_burgundy_tiers_detailed.md` | 부르고뉴 등급 상세 (Grand Cru~Régionale) |
| `10_vivino_korea_analysis.md` | 비비노 한국 시장 분석 |
| `11_korean_app_competitors.md` | 한국 와인 앱 경쟁사 분석 |
| `12_strategy_features.md` | winemine 전략·기능 방향 |
| `13_launch_report_2026_05_11.md` | 론치 리포트 |
| `14_wine_database_providers.md` | 와인 DB 제공사 비교 |
| `15_wine_database_bulk_acquisition.md` | 와인 DB 대량 확보 전략 |
| `16_winemine_feedback.md` | winemine 베타 피드백 모음 |
| `30_tasting_note_section_spec.md` | 테이스팅 노트 섹션 스펙 |
| `31_burgundy_section_spec.md` | 부르고뉴 섹션 스펙 |
| `32_wine_discovery_section_spec.md` | 와인 디스커버리 섹션 스펙 |
| `50_label_recognition_research.md` | 라벨 인식 AI 리서치 |

---

## 보안/품질 원칙 (랜딩에서 가져온 것)

- 입력 검증: 클라이언트(Zod) + 서버 **양쪽** 모두
- 한국 전화번호 형식: `/^010[-\s]?\d{4}[-\s]?\d{4}$/`
- `SUPABASE_SERVICE_ROLE_KEY` 같은 시크릿은 절대 `NEXT_PUBLIC_` 접두사 금지 — 클라이언트 번들 노출 X

---

## 카피 톤 & 페어링 헤더 (참고)

랜딩에서 정착된 두 가지 톤:
- **초보자**: "와인을 가볍게 즐기고 싶으신가요?" — 친근, 풀어쓰기, 비유 사용
- **전문가**: "와인을 깊게 파고드시나요?" — WSET·카우달리·아펠라시옹 같은 정식 용어 사용

앱에서도 비슷한 모드 분기(쉬운 모드/전문가 모드)를 고려할 수 있다.

---

## 하네스: winemine 키스크린 개발

**목표:** `WINEMINE_KEYSCREEN_SPEC.md` (2462줄) 기반으로 iPhone 390×844 목업 안에서 동작하는 winemine 키스크린 시안 앱을 단계적으로 구축. 22개 라우트, 한/영 i18n, beginner/expert·first-time/heavy 모드 토글, 베타 피드백 7항목 반영.

**트리거:** 키스크린 개발·페이지 추가·QA·mock 데이터 변경 관련 요청 시 `winemine-build-orchestrator` 스킬을 사용하라. 단일 페이지 단순 수정은 해당 스킬(winemine-page-routing, winemine-tasting-components, winemine-wine-detail, winemine-mock-fixtures 등)을 직접 호출해도 됨. 단순 질문은 직접 응답 가능.

**진실 소스:**
- 스펙: `WINEMINE_KEYSCREEN_SPEC.md`
- 테이스팅 노트: `docs/tasting-note-app-handover.md` (9개 컴포넌트 시그니처)
- 베타 피드백: `data/raw/2026-05-12_review.md`

**중간 산출물:** `_workspace/` (gitignore — 보고서·i18n 키 export)

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-05-12 | 초기 구성 (에이전트 7 + 스킬 8) | 전체 | 키스크린 시안 단계적 구축 위한 하네스 신규 설계 |
| 2026-05-17 | Phase 3 기술 계획서 작성 (`wine-research/_workspace/70`–`76`) | RN+Expo 앱·Spring Boot·PostgreSQL·AWS Seoul·익명 인증·라벨 인식 | 키스크린 시안 → 실제 모바일 앱+백엔드 전환 전 단일 진실 소스 확보 |

