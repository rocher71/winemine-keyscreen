# winemine 키스크린 — 기능 명세서

> 기준일: 2026-05-16 (라이트모드 지도 양피지 컨셉 + i18n 누출 60+곳 수정 직후)
> 대상: `src/` 전체 코드 기반, 페이지·컴포넌트·상태·상수까지 상세 기록
> 읽는 법: 모든 페이지를 코드를 열지 않고 글로만 읽어도 동작·레이아웃·인터랙션 전체를 파악할 수 있도록 작성

---

## 0. 한눈에 보는 윤곽

- **앱 형태**: iPhone 390×844 목업 안에서 동작하는 와인 라이브러리 시안
- **사용자 모드**: `first-time`(빈 컬렉션) ↔ `heavy`(풍부한 시음 이력)
- **경험 수준**: `beginner`(입문자) ↔ `expert`(전문가) — 노트 작성/리스트 표기에 분기
- **언어**: 한국어 ↔ English. 영어 모드에서 한글은 단 한 글자도 노출되지 않음
- **테마**: 다크(와인 바 짙은 보라) ↔ 라이트(크림 종이 + 골드 강조, 화이트 와인 컨셉)
- **라우트 총 39개** (스펙 22개 + 추가 라우트 17개)
- **빌드**: Next.js 15 App Router, 31 정적 + 9 동적 페이지
- **저장**: 모든 데모 상태는 localStorage + URL 쿼리(`?demo=`, `?exp=`, `?locale=`)로 영속화

---

## 1. 라우트 일람 (39개)

| 경로 | 헤더 | BottomNav | 가드 |
|------|------|-----------|------|
| `/` | AppHeader | 표시 (홈 활성) | first-time + 온보딩 미완료 시 `/onboarding`으로 redirect |
| `/map` | 없음(풀스크린) | 표시 (지도 활성) | — |
| `/cellar` | AppHeader | 표시 (셀러 활성) | — |
| `/cellar/[id]` | BackHeader | 표시 | — |
| `/wine/[id]` | BackHeader + 즐겨찾기 토글 | 표시 | — |
| `/wine/[id]/story` | BackHeader | 표시 | — |
| `/wine/[id]/prices` | BackHeader | 표시 | — |
| `/wine/[id]/community-peak` | BackHeader | 표시 | — |
| `/notes/new` | BackHeader | **숨김**(노트 작성 흐름) | — |
| `/notes/new/write` | BackHeader | **숨김** | — |
| `/notes/[noteId]` | BackHeader (내 노트면 Edit + Share, 공유 노트면 Share만) | 표시 | — |
| `/capture` | 커스텀 헤더 (X 버튼) | **숨김**(촬영 모달 흐름) | — |
| `/profile` | AppHeader | 표시(활성 탭 없음) | — |
| `/profile/[userId]` | BackHeader | 표시 | — |
| `/profile/ranking` | BackHeader | 표시 | — |
| `/favorites` | BackHeader | 표시 | — |
| `/badges` | BackHeader | 표시 | — |
| `/photos` | BackHeader | 표시 | — |
| `/notifications` | BackHeader | 표시 | — |
| `/glossary` | BackHeader | 표시 | — |
| `/glossary/[term]` | BackHeader | 표시 | — |
| `/onboarding` | 없음 | **숨김**(온보딩 흐름) | heavy 모드 또는 완료된 유저는 `/`로 redirect |
| `/settings` | BackHeader | 표시 | — |
| `/settings/language` | BackHeader | 표시 | — |
| `/settings/experience` | BackHeader | 표시 | — |
| `/settings/notifications` | BackHeader | 표시 | — |
| `/settings/appearance` | BackHeader | 표시 | — |
| `/settings/tasting-template` | BackHeader | 표시 | — |
| `/settings/tasting-template/new` | BackHeader | 표시 | — |
| `/settings/tasting-template/[templateId]/edit` | BackHeader | 표시 | — |
| `/community` | AppHeader | 표시 (커뮤니티 활성) | — |
| `/community/discover` | BackHeader | 표시 | — |
| `/community/tonight` | BackHeader | 표시 | — |
| `/community/new` | 풀스크린(modal-style) | 표시 | — |
| `/community/new/column` | 풀스크린 | 표시 | — |
| `/community/new/album` | 풀스크린 | 표시 | — |
| `/community/[postId]` | BackHeader | 표시 | — |
| `/community/[postId]/comments` | BackHeader | 표시 | — |
| `/community/templates` | BackHeader | 표시 | — |

**BottomNav 숨김 prefix**: `/onboarding`, `/capture`, `/notes/new` (그 아래 sub-route 포함)

---

## 2. 디바이스 프레임 & 시스템 UI

### DeviceFrame (`src/components/device-frame/device-frame.tsx`)

- 데스크톱(`≥768px`): 414×868 iPhone 목업 외관 — 50px 라운드 코너 + 깊은 그림자(`0 40px 100px rgba(0,0,0,0.6)`) + 골드 1px 보더 + 안쪽 2px 다크 보더. 12px 패딩 안에 390×844 inner.
- 모바일(`<768px`): wrapper 투명, 콘텐츠 풀스크린(`100dvh`).
- `wm-route-outlet`: StatusBar(54px) 아래에서 시작. Dynamic Island(top 11~45px) 회피.

### StatusBar (`status-bar.tsx`)

- 데스크톱 프레임 상단 54px 절대 배치. 좌측 시계(`HH:MM`), 우측 신호·LTE·배터리 SVG.
- 모바일에서는 숨김 (브라우저 시스템 UI 사용).

### DynamicIsland (`dynamic-island.tsx`)

- iPhone 14 Pro+ 알약 모양 노치. `top:11`, `width:120`, `height:34`, `border-radius:17`, 검정 fill.
- 데스크톱 DeviceFrame 안에만 노출, 모바일 숨김 (CSS).
- `pointer-events: none` — 클릭 방해 없음.

### HomeIndicator (`home-indicator.tsx`)

- 하단 home gesture bar. 데스크톱 DeviceFrame 안에만 노출.

### PushBanner (`push-banner.tsx`) + `use-push-banner` 훅

- iOS 스타일 푸시 알림 배너. Dynamic Island 아래 58px 지점에 슬라이드 다운.
- `framer-motion` spring (`stiffness: 380`, `damping: 32`), `initial: y=-56, scale=0.94`.
- `durationMs` 이후 자동 dismiss(기본 4000ms). 탭하면 즉시 dismiss.
- 데스크톱은 frame 내 absolute, 모바일은 화면 상단.
- 사용처: DemoControls의 "푸시 시뮬" 버튼 → `pushBanner({ title, body })` 호출.

---

## 3. 페이지별 상세 명세

### 3.1 홈 (`/`)

**상단 (둘 다 공통)**
- **AppHeader**:
  - 좌측 `WMLogoMark` (와인잔 SVG, 와인 fill `#8B1A2A`, 골드 외곽선 `#C9A84C`, 26px)
  - `WMLogoWordmark` (Playfair `wine·mine`, 골드 점, 18px)
  - 우측 `BellButton` (Bell 아이콘, unread 있을 때 골드 도트)
  - `LevelChip` (heavy 모드에서만): 24px 그라데이션 아바타 + "L{N}" 텍스트, 클릭 시 `/profile` 이동
    - L1 `#a87341` 브론즈 / L2 `#b8b8c0` 실버 / L3·L4 `#C9A84C` 골드 / L5 `#8B1A2A` 와인레드

**heavy 모드 (기존 사용자) 상단부터 순서대로**

1. **PeakGreeting** (페이드 로테이션)
   - 골드 eyebrow 텍스트(10px, letter-spacing 0.18em, UPPERCASE)
   - Playfair 22px 본문, 56px 최소 높이, AnimatePresence(framer-motion) wait 모드
   - 5초 간격으로 4개 질문(`questions.0~3`)을 페이드(`opacity 0→1, y 6→0`)하며 로테이션
   - 본문 안 와인 이름은 골드(`#C9A84C`) + italic 강조. 최근 시음 와인 4종의 appellation을 locale별로 swap

2. **DraftNoteResume** (조건부)
   - localStorage에 작성 중인 노트가 있을 때만 노출
   - "이어쓰기" CTA → `/notes/new/write?from=draft...`

3. **StatHero** (3열 카드 그리드)
   - 방문 국가(Globe2 아이콘) / 마신 와인(Wine 아이콘) / 작성 노트(Pencil 아이콘) 3개 카드
   - 각 카드 큰 숫자 + 라벨

4. **MapCameo** (정적 미니맵 카드)
   - 14px Playfair "당신의 와인 지도 / Your Wine Map"
   - 10px 서브 `{N}개국 · {M}개 지역`
   - 골드 "전체 →" 우상단
   - 320×100 SVG `MiniMapPreview`: 보라(`#2D1540`) 대륙 ellipse 6개(북미·남미·유럽·아프리카·아시아·호주) + 14개 와인 산지 도트 (강조 도트 와인레드 3.5r, 일반 골드 2.5r)
   - 좌표 하드코딩 — 프랑스·이탈리아·스페인·독일·미국·아르헨티나·칠레·호주·남아공·뉴질랜드·일본·포르투갈·헝가리
   - 클릭 시 `/map` 이동

5. **HomeCommunityPeek** (커뮤니티 dense row)
   - 팔로잉 최신 포스트 2건. 작성자 레벨 그라데이션 아바타 + 본문 한 줄 미리보기
   - `/community` 이동

6. **RecentNotesStrip** (수평 스크롤)
   - WMBottle 카드 + WMGlassRating + 와인명 + 별점

7. **WineFeed** (3탭)
   - 탭 칩: `featured`(Sparkles) / `trending`(Flame) / `explore`(Globe2)
   - **Featured**: `getFeaturedWines()` → FEATURED_WINE_IDS 12종 큐레이션
   - **Trending**: 모든 와인에 `getPurchasesByWine(w.id).length` 카운트 → 상위 8개
   - **Explore**: region 다양화 sample (`region.en` 기준 dedupe) 상위 10개
   - 카드 구조: WMBottle + 와인명 + 생산자 + 지역 + 외부 평점 칩

8. **QuickActions** (행동 단축버튼)
   - 노트 작성 / 셀러 추가 / 즐겨찾기 / 뱃지 / 설정 버튼

**first-time 모드 (신규 사용자)**

1. **FirstTimeGreeting** — 사용자 이름 포함 환영 메시지
2. **EmptyStatHero** — 0/0/0 빈 통계 + 첫 스캔 유도 문구
3. **SuggestedActions** — 첫 액션 카드들 (스캔/검색/온보딩 재실행)
4. **WineFeed** — 동일

**redirect 규칙**: `useEffect`에서 `demoMode === 'first-time' AND localStorage.winemine.onboardingComplete !== 'true'` → `router.replace('/onboarding')`.

---

### 3.2 세계 지도 (`/map`)

풀스크린 인터랙티브 지도. 헤더 없음, 지도가 viewport 전체.

#### 기본 동작
- `react-simple-maps` ComposableMap + ZoomableGroup, `dynamic import` SSR 비활성
- 프로젝션 `geoMercator`, scale 90, center `[10, 25]`
- 줌 범위 1.0 ~ 12.0, 마우스 휠/터치 핀치 줌 + 드래그 팬

#### 색상 시스템 (테마 분기 — 토큰 기반)
| 요소 | 다크 | 라이트 (양피지 컨셉) |
|------|------|--------|
| 바다 (SVG background) | `#100720` 짙은 보라 | `#C8D6E4` 고지도 청회색 |
| 빈 국가 fill | `#3A2440` 와인 보라 | `#DDD0BB` 양피지 |
| 국경선 stroke | `rgba(245,240,232,0.18)` 크림 18% | `rgba(160,140,110,0.40)` 따뜻한 갈색 40% |
| 시음 1병 → 10+병 fill | `rgba(139,26,42, t)` t=0.18→1.0 | 동일 (와인레드 heat map) |
| Hover | 와인레드 + 골드 stroke 55% | 동일 |
| Antarctica(010) | 바다색으로 숨김 | 동일 |

#### heavy 모드 노출 요소
- **마신 와인 + 셀러 와인** 통합 dedupe해서 `getWine(w.id)`로 wines 배열 생성
- 시음 카운트별로 국가 fill 채도 증가 (heat map)
- **글로벌 와인 핀** — 골드 도트 (3r, 검정 stroke), 클릭 시 해당 국가 BottomSheet 열림
- **줌 컨트롤 우하단** (BottomNav 96px 위, 글래스 5px gap):
  - RotateCcw "세계 지도로 돌아가기" (zoom > 1.25일 때만 노출)
  - Plus "확대" (zoom ≥ 12에서 disabled, opacity 0.35)
  - Minus "축소" (zoom ≤ 1에서 disabled)
- **필터 바** 좌하단 (`.wm-map-filter-bar`, 글래스 backdrop-blur):
  - 칩: 전체 / 마신 와인 / 셀러 / 즐겨찾기 — 활성 칩은 골드 18% bg + 골드 보더
  - 슬라이더 아이콘 버튼 — 클릭 시 "곧 지원돼요" 토스트
- **데스크톱 위치**: bottom 100px / **모바일**: bottom 16px (CSS media query 분기)

#### 프랑스 자동 줌인 (드릴다운 1단계)
- France(isoNumeric `'250'`) 클릭 → `zoom: 5, center: [2.5, 46.8]`
- `franceFocused = zoom ≥ 4 AND center가 -6<lon<10 AND 42<lat<52` 범위
- 좌상단에 글래스 라벨 "France" (골드) 노출
- 프랑스 와인 핀은 글로벌 핀에서 제외, 코뮌 마커로 대체

#### 부르고뉴 코뮌 마커 (드릴다운 2단계)
`franceFocused = true`일 때 11개 코뮌 표시. 좌표 클러스터링(lon Δ<0.09, lat Δ<0.07)으로 시음 카운트 산출.

| ID | 한글명 | 영문명 | 타입 |
|-----|---|---|---|
| chablis | 샤블리 | Chablis | white |
| gevrey | 주브레-샹베르탱 | Gevrey-Chambertin | red |
| morey | 모레-생-드니 | Morey-Saint-Denis | red |
| chambolle | 샹볼-뮈지니 | Chambolle-Musigny | red |
| vosne | 본-로마네 | Vosne-Romanée | red |
| nsg | 뉘-생-조르주 | Nuits-Saint-Georges | red |
| beaune | 본 | Beaune | both |
| pommard | 포마르 | Pommard | red |
| volnay | 볼네 | Volnay | red |
| meursault | 뫼르소 | Meursault | white |
| puligny | 퓔리니-몽라셰 | Puligny-Montrachet | white |

- 핀 색: white = 골드 `#C9A84C` / red = 와인레드 `#8B1A2A` / both = 로제 `#A0405A`
- 시음 있으면 4.2r, 없으면 2.8r + alpha 0.22
- 시음 카운트 뱃지: 핀 우상단(+5, -5) 골드 3.4r 도트 + 검정 4.2px 굵은 숫자
- 핀 크기는 `counter-scale = 1 / zoom^0.6`으로 줌 보정 (줌해도 너무 작아지지 않음)

#### 꼬뜨 라벨 (드릴다운 3단계)
`burgFocused = zoom ≥ 6.5 AND center가 2.5<lon<6.5 AND 45<lat<49` 범위일 때:
- 코뮌 옆에 한글 라벨(`commune.ko`) 표시, 시음 있으면 크림 92% / 없으면 38%
- 3개 꼬뜨 Playfair 9.5px 텍스트:
  - **Chablis** at [3.798, 48.04] 골드 75%
  - **Côte de Nuits** at [5.06, 47.32] 와인레드 80%
  - **Côte de Beaune** at [4.65, 47.00] 와인레드 65%
- 좌상단 글래스 라벨이 "France" → "Bourgogne"로 전환

#### CountryDetailPanel (BottomSheet)
국가 클릭 시 (또는 핀 클릭 시) 오픈:
- 헤더: 국가명 + `{N}병` 뱃지(와인레드)
- 미니 그리드 2열: `지역 {count}` / `마신 {count}`
- 지역 리스트 — 클릭 시 드릴다운으로 그 지역의 와인 리스트 표시
- 와인 행: WMBottle + 와인명 + 생산자·빈티지 → 클릭 시 `/wine/[id]` 이동

#### MapLegend
색상 범례 — "1병~10+병" 그라데이션 바, 좌상단 작은 글래스 카드.

#### Recap Modal — 와인 리포트 (`recap-modal.tsx`)
heavy 모드에서 `notes.length > 0`이면 우상단에 진입 버튼 노출:
- **버튼**: Sparkles 아이콘 + "와인 리포트 생성하기 / Generate Wine Report", 와인레드→골드 그라데이션, 글래스 backdrop blur
- 클릭 시 풀스크린 backdrop(`rgba(5,2,10,0.85)` + blur 6px) + 중앙 패스포트 카드 슬라이드업 (Flighty Passport 스타일)

**패스포트 카드 구성**:
- 사용자 이름 (영문 대문자, MRZ-style은 `<`로 공백 치환: `KIM<YEJIN`)
- 가입일(`YYYY.MM.DD`) + 현재 년도
- **통계 그리드**:
  - `totalBottles` 총 시음 병 수
  - `uniqueWines` 유니크 와인 수
  - `countries` 시음 국가 수
  - `regions` 시음 지역 수
  - `topGrape` 최다 시음 품종
  - `topRegion` 최다 시음 지역
  - `highestRating` 최고 평점 (`expertFields.rating` 또는 `beginnerFields.rating × 20`)
  - `avgRating` 평균 평점
- **미니 세계지도**: isoSet에 포함된 국가 와인색 강조, 나머지 매우 흐린 톤
- **국기 row**: ISO numeric → Alpha-2 매핑 후 Unicode flag emoji 변환 (최대 8개)
  - 매핑된 코드: FR/IT/ES/DE/AT/PT/GR/HU/CZ/US/CA/CL/AR/UY/BR/AU/NZ/ZA/KR/JP/CN/RU/SK/SI/HR/MD/GB/NL/CH/TR/LB/IL
- **와인 타입 범례**: 레드 / 화이트 / 기타 카운트 (locale 분기)
- **MRZ-style decoration** 하단 띠

**액션 버튼 (하단)**:
- "이미지 저장 / Save image": `html-to-image`의 `toPng()` → `winemine-recap-${year}.png` 다운로드, pixelRatio 2x, 배경 `#1a0a1e`
- "공유 / Share": "공유 시트는 곧 지원돼요" 토스트 (PlaceholderToast)
- "닫기 / Close" X 버튼 (우상단)

#### first-time 모드 (빈 지도)
빈 지도 중앙에 글래스 패널:
- 골드 카메라 SVG (28px, `1.6` stroke)
- Playfair 18px "지도가 비어 있어요" 같은 안내
- "사진 한 장이면 와인 정보가 자동 채워지고, 마신 국가가 지도에 칠해집니다 / One photo auto-fills the wine info..."
- PrimaryButton "첫 스캔하기" → `/capture`

---

### 3.3 셀러 리스트 (`/cellar`)

**세그먼트 탭** (타이틀 바 아래): `내 셀러` / `마신 와인` (각 탭에 병 수 뱃지)

#### 내 셀러 탭
- **검색 입력** (`최근 등록`, placeholder `이름·생산자·지역·빈티지 / Name · Producer · Region · Vintage`)
  - 전문 검색 필드: 이름, 생산자(producer.ko/en), 지역(region.ko/en), 국가(country.ko/en), 아펠라시옹(appellation.ko/en), 품종(grapes[].ko/en), 빈티지
- **와인 타입 필터 칩**: all / red(`#8B1A2A`) / white(`#F2E9C8`) / sparkling(`#E8D7B5`) / rosé(`#D86E84`) / fortified(`#5A2A3D`)
  - 칩 좌측에 색 도트(7px)
- **정렬 칩** (가로 스크롤): 최근 등록 / 음용 시기 임박 / 빈티지 / 지역 / 보관 장소 / 가격
- **결과 카운트** + "필터 초기화" 버튼 (필터 적용 시 노출, 골드 텍스트)
- **2열 그리드 CellarCard**:
  - WMBottle SVG (와인 타입별 보틀 색, 라벨 텍스트)
  - 좌상단 와인 타입 색 도트
  - 우상단 DrinkWindowBadge (`peakSoon` / `inPeak` / `tooEarly` / `pastPeak` — 색 분기)
  - 와인명 (Playfair 14px)
  - 생산자·빈티지·지역
  - 클릭 시 `/cellar/[id]` 이동
- "셀러에 추가" 인라인 버튼 → "곧 추가 기능을 지원해요" 토스트
- 빈 상태: `EmptyState` — 와인 SVG + "셀러가 비어있어요" + CTA
- 검색 결과 없음: 별도 NoResults + "필터 초기화"

#### 마신 와인 탭
- 테이스팅 노트 기반, `wineId` 기준 dedup, 최근 노트 1건만 표시
- 검색 (이름·생산자·지역·빈티지)
- **TastedWineRow** 리스트:
  - 좌측 WMBottle (와인 타입 색)
  - 와인명·생산자·빈티지 + 와인 타입 도트
  - **노트 인라인 미리보기** (experience에 따라):
    - **beginner**: WMGlassRating(별점) + 아로마 힌트 칩 1~2개
    - **expert**: 우상단 점수(`{rating}/100`) + WSET 4차원 미니 그리드 (산도·바디·타닌·단맛, 각 5칸 progress, locale별 라벨)
  - 우측 액션 3종 (라벨, locale 분기): `노트 보기 / View Note` → `/notes/[noteId]` · `편집 / Edit` → `/notes/new/write?edit=1` · `와인 상세 / Wine Details` → `/wine/[id]`
- **WSET 차원 라벨** (한·영):
  - sweet→`단맛`/`Sweetness`, acidity→`산도`/`Acidity`, body→`바디`/`Body`, tannin→`타닌`/`Tannin`, alcohol→`알코올`/`Alcohol`
- **WineType 라벨 맵**: red→`레드`/`Red`, white→`화이트`/`White`, sparkling→`스파클링`/`Sparkling`, rosé→`로제`/`Rosé`, fortified→`주정강화`/`Fortified`, dessert→`디저트`/`Dessert`

---

### 3.4 셀러 아이템 상세 (`/cellar/[id]`)

순서대로:

1. **와인 헤로** (240px high)
   - 라디얼 그라데이션 배경 `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 70%)`
   - 중앙에 `WineLabelArt` (100×150, 와인 라벨 SVG)
   - 18px 라운드 + 보더
   - 하단: Playfair 24px 와인명 / 13px 생산자·빈티지 / 12px 지역·국가
2. **음용 적기 카드** (Surface 16px 라운드)
   - 헤더: `DrinkWindowBadge` (peakSoon / inPeak / tooEarly / pastPeak) + 11px `{from}–{to}` 텍스트
   - `DrinkWindowTimeline` — 타임라인 바 (from→peak→to 마커 3개 + 현재 위치 점, gold pulse)
   - 12px 본문 `"피크: {year}년"` + 골드 `· 피크까지 {N}년 / Peak in {N}y` (yearsToPeak > 0일 때)
3. **알림 토글** (Surface 14px 라운드)
   - "피크 도달 시 알림 / Notify when drink window starts"
   - 44×26 토글 (gold ON / border gray OFF), 노브 20×20 cream
   - 토글 시 토스트 피드백 (`toggledOn` / `toggledOff` 메시지)
4. **메타 그리드 2×2** (MetaCard)
   - `보관 / Storage` ← `storageCellar / Cellar`, `storageFridge / Fridge`, `storageRoom / Room`, `storageOffsite / Off-site`
   - `취득일 / Acquired` ← `acquiredAt.slice(0, 10)` (YYYY-MM-DD)
   - `구매 가격 / Price` ← `₩{toLocaleString()}` 또는 `—`
   - `메모 / Memo` ← LocalizedString 또는 `메모 없음`
5. **커뮤니티 리뷰** (3건 슬라이스)
   - `ReviewCard` (작성자 레벨 칩 + 별점 + 메모) ×3
   - "와인 상세 보기 →" 골드 링크 → `/wine/[id]`
6. **하단 고정 CTA**: `DrinkThisButton` — 90px 높이 와인레드 버튼 "마시기 / Drink this"
   - 클릭 시 localStorage 노트 draft 시작 → `/notes/new/write?wineId={id}&fromCellar={id}` 이동

---

### 3.5 와인 상세 (`/wine/[id]`)

**헤더**: BackHeader + 우측 `FavoriteToggle` (Heart 토글, localStorage `winemine.favorites`)

**본문 순서**:

1. **WineHeader** (라디얼 그라데이션 히어로)
   - 88×290 WMBottle 중앙 배치 (와인 타입별 보틀 색)
   - 와인 타입 도트 + 와인명·생산자·빈티지·지역·국가
   - 아펠라시옹 칩 (해당 시)
2. **MyTastingNoteCard** (조건부 — 내 노트가 있을 때만)
   - 내 평점/100 + 메모 일부
   - "커뮤니티는 평균 {N}/100점" 비교 인사이트
   - 노트 클릭 시 `/notes/[noteId]` 이동
3. **WriteNoteCta** (조건부 — 내 노트 없을 때)
   - "아직 노트가 없어요 / No notes yet"
   - "이 와인의 시음 경험을 기록해보세요 / Record your tasting experience"
   - 골드 보더 카드 + "노트 작성 / Write Note" 버튼 → `/notes/new/write?wineId={id}&from=newEntry`
4. **ExternalRatingsCard** (외부 평점 3소스)
   - **Vivino**: 4.X / 5 별점 + 리뷰 수 + 로고
   - **Wine Searcher**: WS 평균가 `$XXX` + 매칭 매장 수
   - **CellarTracker**: CT 평점 95/100 + 시음 노트 수
   - 각 행: 로고 + 점수 + 메타 + 외부 링크 아이콘(External Link → placeholder toast)
5. **AveragePricePill** — 평균 가격 칩 `₩{N}` (gold 보더)
6. **PriceChart (compact)** — Recharts LineChart 200×120 + "가격 추이 상세보기 →" 링크 → `/wine/[id]/prices`
7. **CommunityDrinkWindowCard** (compact) — 커뮤니티 음용 적기 미니 히스토그램 + "{N}명 추정 · 평균 {year}년 / N estimates · avg {year}" + 상세 링크 → `/wine/[id]/community-peak`
8. **WineStoryCard** — 와이너리 스토리 요약 (full 페이지 링크)
9. **ReviewList** — 최근 리뷰 ~3개 + "더 보기"
10. **AddToCellarCta** (하단 고정 또는 인라인) — "내 셀러에 추가" → localStorage `userCellar` 추가 + XP 토스트

---

### 3.6 와이너리 스토리 (`/wine/[id]/story`)

1. **StoryImage 헤로** (240px, 와이너리 이름 오버레이 + 설립 연도 + 위치)
2. **History 본문** — 3~4문단, LocalizedString ko/en
   - 인라인 `GlossaryTooltip` 연결 — 최소 5곳 (terroir, appellation, brett, decanting, tannin-texture 등)
3. **FunFact 카드** — Gold 보더 + Lightbulb 아이콘 + 한 줄 사실
4. **Philosophy 단락** (데이터 있을 때만)
5. **메타 그리드 2×2**: 설립 연도 / 포도밭 면적(ha) / 주요 품종 / 연 생산량(병)
6. "이 와인 다시 보기 / Back to this wine" CTA → `/wine/[id]`

스토리 없을 때: EmptyState "아직 와이너리 정보가 없어요 / No winery story yet" + 와인 페이지 링크.

---

### 3.7 가격 상세 (`/wine/[id]/prices`)

1. **PriceChart (full)** — Recharts LineChart 전체 기간, 320×200, X축 월별 라벨, Y축 ₩ 단위
2. **PriceDetailTable** — 매장별 구매 기록 그룹:
   - 매장명·지점
   - 작성자 익명화 — `LevelPill` + `{LevelName} #{anonId}` (해시: `anonIdFor()`)
   - 가격·날짜
3. **AddMyPriceCta** (하단 고정) — "내 구매 정보 등록" 버튼
   - BottomSheet 폼: 매장 입력, 가격 입력, 날짜 picker
   - 제출 시 "+5 XP" 토스트 + 시트 닫힘

---

### 3.8 커뮤니티 음용 적기 상세 (`/wine/[id]/community-peak`)

1. **인트로 카드** — "L3+ 감식가 이상의 추정을 가중치 반영해요 / Estimates from Connoisseur (L3+) carry more weight" 안내
2. **큰 히스토그램 (280px)** — `PeakDistribution` (Recharts BarChart)
   - X축: 년도 (peak year ±5)
   - Y축: 추정 수
   - 마커 3종: 시스템 추정(골드), 평균(크림), 중앙값(와인레드 점선)
3. **ContributorsList** — 익명화 추정자 리스트:
   - 각 행: `{LevelName} #{anonId}` (예: "감식가 #a1b2") + 추정 년도 + 신뢰도 메타
   - `reviewerLevel ∈ {3, 4, 5}` 강제 (L1/L2 발생 불가)
4. **하단 고정 CTA**: "내 추정 추가 / Add my estimate"
   - L3+ 레벨만 활성. L1/L2는 disabled + "L3에 도달하면 활성화 / Unlocks at Connoisseur (L3)" 텍스트

---

### 3.9 노트 출처 선택 (`/notes/new`) — SourcePicker

3가지 카드:
1. **셀러에서 선택 / From Cellar** — 보유 와인 수 배지 표시
   - 클릭 시 BottomSheet 열림 → 셀러 아이템 리스트 → 와인 선택 → `/notes/new/write?wineId={id}&source=cellar`
2. **새로 검색 / Search new** — "곧 추가 기능을 지원해요" 토스트 (PlaceholderToast)
3. **새 항목 입력 / New entry** → `/notes/new/write?source=newEntry`

---

### 3.10 노트 작성 (`/notes/new/write`)

쿼리스트링 `templateId`로 폼이 분기:
- 명시 없음 + `experience === 'beginner'` → **BeginnerNote** (입문자 모드)
- 명시 없음 + `experience === 'expert'` → **ExpertNote** (전문가 모드)
- `templateId=builtin-beginner` / `builtin-expert` → 위와 동일
- `templateId=tpl-...` (커스텀/커뮤니티) → **DynamicTemplateForm** (필드 정의에 따라 동적 렌더)

수정 모드: `?edit=1&templateId=...&noteId=...` → 원본 노트의 모드/템플릿 그대로 재현 + 기존 값 prefill

#### BeginnerNote 입력 필드
- 와인명·생산자 표시 (read-only)
- **별점**: 1~5 하트 (WMGlassRating 또는 Heart 아이콘)
- **향 느낌 체크박스**: 과일 / 꽃 / 나무 / 흙 / 기타
- **맛 느낌 라디오**: 가벼움~진함 / 단맛 / 신맛 / 탄닌 (각 1~5 슬라이더 또는 칩)
- **자유 메모** (textarea, LocalizedString 의도)
- **ServingTempInput** — 시음 온도 °C 입력 (권장 범위와 비교, 빨강 경고)
- **AutoDescription** (입문자 변형)
  - 선택값에 기반해 한·영 자동 문장 생성
  - 예: "가볍고 산뜻한 화이트로 시트러스 향이 도드라져요 / A light, crisp white with prominent citrus notes"
- 사진 첨부 (PlaceholderToast)
- 제출 시 +10 XP 토스트

#### ExpertNote 입력 필드

**WSET 5축 슬라이더**: `sweet` / `acidity` / `body` / `alcohol` / `tannin`
- 각 슬라이더: 5단계 (`low` / `mediumMinus` / `medium` / `mediumPlus` / `high`)
- `WSETSlider` 컴포넌트: labelKey, value, onChange, labels(5개 라벨), hint(선택)

**향·풍미 강도** (intensity): WSET 스케일
**타닌 텍스처** (TanninPanel — red 전용): grippy / fine / silky / harsh
**숙성도**: youthful / developing / mature / oxidative
**마무리 길이** (`FinishLength`): short / medium / long / veryLong

**AromaWheel** — UC Davis 계통 3레벨 트리 (`tasting-note-lexicon.ts` AROMA_LEXICON)
- variant: aroma / palate / finish
- 카테고리: fruit / floral / spice / earth / oak / chemical / microbial / pungent / nutty / vegetal
- forcedCategory (선택): 특정 카테고리만 표시

**CaudalieMeter** — 1~30초 슬라이더 (1 caudalie = 1초, 여운 측정)

**FaultChecklist** — 결함 체크리스트
- FaultId: tca(bouchonné/코르키), brett, vinegar(VA), oxidation, reduction, heat-damage, refermentation, mousy 등

**OpeningTimeline** — 오프닝 타임라인
- 변형: full(작성), readOnly(상세)
- 입력: `openedAt` (타임스탬프), `decant` (디캔팅 분), `checkpoints` (시간대별 변화 메모), `peakAt` (절정 도달 시간)

**BubblePanel** (sparkling 전용)
- 거품 크기: fine / medium / coarse
- 지속성: short / medium / long
- 무스 (texture)
- 제조 방식: traditional / charmat / ancestral / pet-nat
- 도사주 (dosage): brut nature / extra brut / brut / extra dry / sec / demi-sec / doux

**RegionalAromaHints** — 산지별 대표 아로마 칩 (`regional-aromas.ts`)
- 와인의 region에 매칭되는 아로마 칩 자동 제안
- 클릭 시 AromaWheel에 toggle

**AutoDescription** (전문가 변형)
- aroma / palate / finish / rating / evolution 입력에 기반한 자동 문장 생성

**BlindMode** (선택 토글)
- 와인 정보 숨김 + 추측 입력 (variety / region / vintage 추측)
- 정답 prop으로 외부 주입 (`correctAnswer?: { variety, region, vintage }`)
- 제출 후 정답 공개 → `getRankLabel(score, locale)`:
  - ≥90: "Master Sommelier 수준 / Master Sommelier level"
  - ≥75: "Advanced Sommelier 후보 / Advanced Sommelier candidate"
  - ≥50: "탐험 단계 — 더 마셔보세요 / Explorer — keep tasting"
  - else: "재미있는 발견 — 와인의 다양성을 즐기세요 / Fun discovery — enjoy the variety"

**PeakEtaInput** — 음용 적기 ETA 입력
- 절정 연도 입력
- 신뢰도(`ConfidenceLevel`): low / medium / high
- 메모 (LocalizedString)
- L3+ 레벨만 활성

**ServingTempInput** — 시음 온도 °C 입력
- 와인 타입별 권장 범위와 비교 (예: red 16~18°C)
- 범위 밖이면 빨강 경고 + 권장 범위 표시

**100점 환산 평점** + **재구매 의향** (boolean) — `네, 다시 살 거예요 / Yes, I'd buy it again` / `이번엔 한 번이면 충분 / Once was enough`

별도 자유 메모 (LocalizedString)

#### DynamicTemplateForm 지원 필드 타입
- `slider` (1~5)
- `wsetScale` (low~high)
- `rating` (별점 0~5, half 지원)
- `chipsSingle` (단일 선택 칩)
- `chipsMulti` (다중 선택 칩)
- `text` (긴 메모)
- `number` (숫자 입력)
- `checkbox` (boolean)

제출 시 XP 토스트 — `calcNoteXp(mode, blind)`:
- beginner → 10 XP
- expert → 20 XP
- expert + blind → 25 XP

---

### 3.11 노트 상세 read-only (`/notes/[noteId]`)

내 노트(`note_…`) 와 공유 노트(`sn-…`) 양쪽 지원.

- **와인 헤더**: 사진(있을 때) 또는 그라데이션 → `/wine/[id]` 진입
- **작성자 + 메타 카드**:
  - 레벨 그라데이션 아바타 (LEVEL_COLORS 기반)
  - 작성일 (LocalizedDate)
  - /100점 (큰 숫자)
  - 가격 (있을 때, `₩{N}`)
  - 사용된 템플릿 배지 (builtin-beginner / builtin-expert / 커스텀명)
- **메모 본문** — Playfair italic, 18px
- **헤더 액션**:
  - 내 노트일 때: BackHeader 우측에 Edit 버튼 + Share 버튼
  - 공유 노트일 때: Share 버튼만
- **노트 차원 요약 카드** (Expert 모드):
  - **WSET 차원** — 5축 미니 그리드 (단맛·산도·바디·알코올·타닌, 각 5칸 progress)
  - **구조** — 향 강도 + 풍미 강도 + 타닌 텍스처 + 숙성도 + 마무리 길이
  - **풍미 노트** (flavorNotes) — 자유 입력 텍스트
  - **버블** (sparkling 전용) — 거품 크기·지속성·무스·제조 방식·도사주
  - **여운·온도** — caudalies + 시음 온도(`servingTempCelsius`)
  - **아로마** — 카테고리별 chips 그룹 (Cherry/Citrus/Apple/Flower2/Flame/Candy/Sprout/Wheat lucide 아이콘)
  - **OpeningTimeline (readOnly)** — 오픈 시각 / 디캔팅 분 / peak 도달 / 체크포인트 리스트
  - **음용 적기 추정** — 절정 연도·신뢰도·메모
  - **결함** — 선택된 결함 리스트
  - **재구매 의향**: `네, 다시 살 거예요 / Yes, I'd buy it again` 또는 `이번엔 한 번이면 충분 / Once was enough`
- **Beginner 노트 차원**: 4차원 미니 그리드(단맛·산도·바디·타닌, 각 /5) + 별점 + 메모 + 시음 온도

---

### 3.12 라벨 스캔 (`/capture`)

> 시안 단계 — 실제 카메라/파일 처리 없이 1.5초 mock 분석으로 시연

- **헤더**: X 닫기 버튼 (좌상단) + "와인 라벨 인식 / Scan label" 타이틀
- **4개 옵션 카드**:
  1. **카메라 스캔 / Camera** — 카메라 SVG → 분석 시뮬레이션 진입
  2. **갤러리에서 / From Gallery** → 분석 시뮬레이션 진입
  3. **내 라이브러리 / My Library** → 라벨 사진 갤러리 진입
  4. **메뉴얼 입력 / Manual Entry** → `/notes/new/write?source=newEntry` 이동

- **AI 분석 시뮬레이션 화면**:
  - 로딩 애니메이션 (회전 골드 링)
  - 1.5초 후 자동 결과
- **인식 결과 카드**:
  - 와인명·생산자·빈티지·지역
  - 외부 평점 (Vivino 4.X 별점)
  - 신뢰도 % 표시
- **결과 액션**:
  - "노트 작성 / Write Note" → `/notes/new/write?from=newEntry&wineId={id}`
  - "셀러에 추가 / Add to Cellar" → localStorage 저장 + "+5 XP" 토스트
  - "다시 스캔 / Re-scan" → 옵션 카드로 복귀
  - "직접 입력 / Manual Input" → manual entry

---

### 3.13 내 프로필 (`/profile`)

1. **ProfileHero** — 그라데이션 헤로
   - 90px 레벨 그라데이션 아바타 (avatarInitial 표시)
   - 닉네임 (Playfair 24px)
   - 레벨 칩 (예: "L3 · 감식가 / Connoisseur")
   - 가입일 ("YYYY.MM.DD 가입 / Joined")
2. **StatGrid** (5열 그리드 또는 2행)
   - 마신 와인 수 / 방문 국가 / 탐험 지역 / 노트 수 / 셀러 병 수
   - localStorage 추가 데이터와 mock 머지(`useMergedData`)
3. **QuickLinks** (5개 카드)
   - 즐겨찾기 / 뱃지 / 사진 / 랭킹 / 지도
   - 각 카드 아이콘(Heart/Award/Image/Trophy/Globe) + 라벨

---

### 3.14 타 유저 프로필 (`/profile/[userId]`)

1. **UserMapHero** — 해당 유저의 방문 국가만 빨갛게 채색된 미니맵 + 통계
2. **TasteCompatibilityCard** — 나와의 취향 일치도 (`compatibility.ts`)
   - 점수 (0~100%)
   - 공유 와인 수 / 공유 지역 수 / 공통 품종 칩
3. **시음 와인 리스트** — 정렬 탭 (최근순 / 평점순)
4. **팔로우 버튼** (우상단) — "팔로우 / Follow" 클릭 시 "곧 지원돼요" PlaceholderToast

---

### 3.15 랭킹 상세 (`/profile/ranking`)

1. **현재 레벨 카드**
   - 레벨 그라데이션 아바타 + 레벨명 (예: "감식가 / Connoisseur")
   - 현재 XP / 다음 레벨까지 남은 XP / 진척도 바 (LevelProgressBar, gold glow)
2. **XP 적립 방법** 전체 목록 (`xp.ts` XP_ACTIONS):
   - 셀러 추가 +5 XP (Plus 아이콘)
   - 입문자 노트 작성 +10 XP (Pencil)
   - 전문가 노트 작성 +20 XP (Pencil)
   - 블라인드 모드 노트 작성 +25 XP (EyeOff)
   - 사진 첨부 +5 XP (Image)
   - 가격 등록 +5 XP (Tag)
   - 음용 적기 추정 +5 XP (Calendar)
   - 첫 방문 국가 +30 XP (Globe2)
   - 첫 방문 지역 +15 XP (MapPin)
   - 커뮤니티 리뷰 +15 XP (MessageSquare)
3. **5단계 레벨 카탈로그** (LEVELS):

| ID | 한글명 | 영문명 | XP | 색 | 핵심 |
|---|---|---|---|---|---|
| 1 | 입문자 | Novice | 0~99 | `#9B8B7A` 브론즈 | "한 모금이 호기심으로 바뀌는 단계" |
| 2 | 애호가 | Enthusiast | 100~499 | `#C9A84C` 골드-브론즈 | "취향이 생기기 시작" |
| 3 | 감식가 | Connoisseur | 500~1499 | `#C9A84C` 골드 (헤비 유저 현재 위치) | "아펠라시옹·빈티지 비교 시작" |
| 4 | 소믈리에 | Sommelier | 1500~3999 | `#8B1A2A` 와인레드 | "구조·균형·여운 언어 분해" |
| 5 | 마스터 | Master | 4000+ | `#A02030` 와인레드 그라데이션 | "한 잔에서 떼루아의 시간 흐름을 읽음" |

---

### 3.16 즐겨찾기 (`/favorites`)

- 즐겨찾기 와인 행 리스트 — 와인명·지역·평점 표시
- 행마다 "구매 시 알림 / Notify on purchase" 토글 (gold ON / border-default OFF)
- 클릭 시 `/wine/[id]` 이동
- 빈 상태: EmptyState "즐겨찾기 와인이 없어요 / No favorites yet"
- 상태: `FavoritesContext` localStorage `winemine.favorites`

---

### 3.17 뱃지 진열장 (`/badges`)

- **등급 필터 칩**: all / bronze / silver / gold / platinum
- **뱃지 그리드 3열**
  - 보유: 컬러 아이콘 + 이름
  - 미보유: 흐림(grayscale + opacity 0.4) + Lock 오버레이
- 뱃지 클릭 → BottomSheet 상세
  - 큰 아이콘 + 이름·설명·획득 조건·획득일(있을 때)
  - 보유 시 골드 보더
- **보유 수 / 전체 수** 카운트 표시 (예: "12/24 획득")

---

### 3.18 라벨 사진 갤러리 (`/photos`)

- **필터 바**: all / 올해 / 셀러 연결됨 / 마신 와인 / 미매칭
- **사진 그리드 3열** (PhotoCard)
  - 사진 + 와인명 + 날짜
- 사진 클릭 → BottomSheet 상세:
  - 큰 사진
  - 와인 링크 (`/wine/[id]`)
  - 연결된 셀러 아이템 / 노트 정보 (있을 때 링크)
- **"스캔 추가 / Add scan"** FAB (또는 헤더 액션) → `/capture`
- 빈 상태: EmptyState "사진이 없어요"

---

### 3.19 알림 리스트 (`/notifications`)

- **NotificationRow** — 각 행:
  - 좌측 4px 컬러 바 (kind별 색):
    - favoritePurchase → 와인레드
    - drinkWindowReached → 골드
    - badgeEarned → 크림
    - levelUp → 골드
    - reviewLiked → secondary
  - 아이콘 + 제목 + 본문 + 상대 시간(`{N}분 전 / {N}m ago`)
  - 미읽음: 좌측 골드 도트
- **"모두 읽음 처리 / Mark all read"** 우상단 버튼 → 토스트
- 클릭 시 알림 종류별 라우트:
  - favoritePurchase + wineId → `/wine/{wineId}`
  - drinkWindowReached + cellarItemId → `/cellar/{cellarItemId}`
  - badgeEarned → `/badges`
  - levelUp → `/profile`
  - reviewLiked → `/notifications`
- 빈 상태: EmptyState

---

### 3.20 와인 용어 사전 (`/glossary`)

- **카테고리 필터 칩** (각 카테고리별 lucide 아이콘):
  - all / `sensory` (코) / `fault` (경고) / `classification` (배지) / `technique` (도구) / `unit` (자)
- **텍스트 검색** — 한·영 용어명 + 정의 전문 검색
- **알파벳 정렬 용어 리스트**:
  - 카테고리 아이콘 + 한글명 / 영문명 병기 + 1줄 정의 미리보기
  - 클릭 시 `/glossary/[term]`
- 12개 entry (glossary.ts): caudalie, residual-sugar, appellation, wset, brett, bouchonne, tdn, rotundone, decanting, terroir, tannin-texture, dosage

---

### 3.21 용어 상세 (`/glossary/[term]`)

- 용어명 한·영 병기 (Playfair 28px)
- 카테고리 배지
- 정의 본문 (한·영 분리, 12px 본문)
- 관련 용어 링크 (있을 때) — `/glossary/{relatedTerm}`
- 인라인 GlossaryTooltip 헬퍼와 동일 데이터 소스 사용

---

### 3.22 온보딩 (`/onboarding`)

4단계 스텝 플로우. Framer Motion 슬라이드 전환.

1. **Welcome** — winemine 로고 + "와인의 세계에 오신 걸 환영해요" + 시작 버튼
2. **Language** — RadioList 2개 (한국어 / English) → 선택 즉시 `LocaleContext.setLocale()` 반영
3. **Experience** — RadioList 2개:
   - `beginner` — "와인을 가볍게 즐기고 싶어요 / I want to enjoy wine casually"
   - `expert` — "와인을 깊게 파고들고 싶어요 / I want to dive deep into wine"
   - 선택 즉시 `ExperienceContext.setExperience()` 반영
4. **Done** — "준비 완료!" + 시작하기 버튼
   - 완료 시 `localStorage.setItem('winemine.onboardingComplete', 'true')` + `router.push('/')`

**가드**: heavy 모드 또는 이미 완료된 유저가 진입하면 `router.replace('/')`.

---

### 3.23 설정 (`/settings`)

**설정 홈 섹션 구성**:

1. **앱 섹션**
   - **언어 설정** — 현재 값 (한국어 / English) 표시 + ChevronRight
   - **경험 수준 설정** — 입문자 / 전문가 표시
   - **테이스팅 노트 양식** — 현재 사용 중 양식 이름 표시
   - **외관 (테마)** — 다크 / 라이트 표시
2. **알림 섹션**
   - 알림 설정 링크
3. **계정 섹션**
   - 닉네임 변경 → PlaceholderToast
   - 로그아웃 → PlaceholderToast
4. **정보 섹션**
   - 버전 (예: v0.1.0)
   - 약관 / 개인정보처리방침 — PlaceholderToast

#### `/settings/language`
- RadioList: 한국어 / English
- 선택 즉시 `LocaleContext.setLocale()` 반영 + 토스트

#### `/settings/experience`
- RadioList:
  - 입문자 — "와인의 첫 발을 떼는 중이에요"
  - 전문가 — "WSET, 아펠라시옹, 카우달리 같은 용어가 익숙해요"
- 선택 즉시 `ExperienceContext.setExperience()` + 토스트

#### `/settings/notifications`
- ToggleRow 목록:
  - 음용 적기 알림 (Calendar)
  - 가격 변동 알림 (TrendingUp)
  - 커뮤니티 활동 (MessageSquare)
  - 친구 활동 (UserPlus)
- 각 토글 변경 시 PlaceholderToast

#### `/settings/appearance`
- RadioList:
  - **다크 / Dark** — "와인 바 짙은 보라 톤"
  - **라이트 / Light** — "화이트 와인 컨셉 — 크림 종이 + 골드 강조"
- 즉시 `ThemeContext` 반영 + 토스트 + `html[data-theme]` 속성 변경 → CSS 변수 재정의

#### `/settings/tasting-template`
4섹션 구성:
1. **winemine 제공** (read-only)
   - builtin-beginner — "입문자 양식"
   - builtin-expert — "전문가 양식"
   - 각 카드: 제목 / 필드 수 / "기본" 배지
2. **내가 만든 양식**
   - 각 카드: 제목 / 필드 수 / 우측 액션 (Pencil 편집 → `/edit`, Trash 삭제 → ConfirmDialog, Globe 공개 토글)
3. **저장한 커뮤니티 양식**
   - 작성자 표시 + Bookmark 토글 (저장 해제 시 picker에서 제거)
4. **+ 새 양식 만들기** 카드 → `/settings/tasting-template/new`
5. **"커뮤니티 양식 둘러보기 →"** 골드 링크 → `/community/templates`

#### `/settings/tasting-template/new` 및 `/[templateId]/edit` — TemplateBuilder
- 제목 (ko / en 양쪽 입력 필수)
- 설명 (ko / en)
- **필드 단위 빌더**:
  - + 필드 추가 (필드 타입 선택 BottomSheet)
  - 각 필드 카드:
    - 위↑ / 아래↓ 이동
    - 라벨 입력 (ko / en)
    - 필드 타입별 옵션 (chipsSingle/Multi는 옵션 라벨 ko/en 추가/삭제)
    - Trash 삭제
  - 지원 타입: `slider` / `wsetScale` / `rating` / `chipsSingle` / `chipsMulti` / `text` / `number` / `checkbox`
- **"커뮤니티에 공유 / Share to community"** isPublic 토글
- 저장 시 토스트 (변형):
  - 신규 + isPublic → "양식이 커뮤니티에 공유됐어요 / Template shared to community"
  - 신규 + private → "내 양식이 추가됐어요 / Template added"
  - 편집 모드 → "양식이 업데이트됐어요 / Template updated"
- 편집 모드: `?templateId={id}` → 기존 템플릿 로드 → 수정/삭제

---

### 3.24 커뮤니티 (`/community`)

**5탭 헤더**: Following / All / Trending / Notes / Templates

**페이지 타이틀** (탭별 동적):
- following → "커뮤니티 / Community"
- all → "모든 잔의 이야기 / All Stories"
- trending → "가장 많이 든 잔들 / Most Toasted"

#### Following 탭
- **Tonight 배너** (Moon 아이콘): "오늘 밤 누가 마실까요? / Who's drinking tonight?" → `/community/tonight`
- 팔로잉 피드 — `CommFeedCard` 리스트
  - PostType 배지 (note/question/column/news/album, 타입별 색)
  - 작성자 아바타 + 닉네임 + 레벨 칩 ("L{N}")
  - 상대 시간 (`{N}분 전`)
  - 본문 제목 (Playfair 16px)
  - 본문 미리보기
  - 연결된 와인 WineEmbedCard (있을 때)
  - **ReactionBar**: 좋아요(Heart) / 잔(Glass) / 반짝(Sparkles) / 저장(Bookmark) — 각 카운트 표시
  - "mine" indicator: 자기 글에 표시 (glass/sparkle/bookmark/drank 중 하나)

#### All 탭
- **타입 필터 칩** (전체/시음 노트/질문/칼럼/소식/사진)
- `CommFeedRow` 컴팩트 리스트 (왼쪽 작은 아이콘 + 한 줄 제목 + 카운트)

#### Trending 탭
- **키워드 hash 칩** — 부르고뉴 22빈티지·레 루지엥·디캔팅 시간 등 + 빈도 카운트
- 랭킹 카드 (1위~4위)
  - TrendingUp / Flame / ChevronUp 아이콘으로 순위 표현
  - 카드: 1위는 골드 보더 강조

#### Notes 탭
- 인기/최신 SortToggle (popular / latest)
- 공유 시음 노트 카드:
  - 작성자 레벨 그라데이션 아바타 (큰 사이즈)
  - 와인명 + 평점/100 (큰 숫자)
  - 메모 본문 (Playfair italic)
  - 하단: 좋아요(♥) / 저장(Bookmark) / 날짜
- 정렬: 인기순 = 좋아요 합산, 최신순 = sharedAt 내림차순

#### Templates 탭
- 인기/최신 SortToggle
- 양식 카드:
  - 제목 (Playfair 15px)
  - "by {작성자명}"
  - 필드수 / 저장수 (12px 메타)
  - Bookmark 토글 (저장/해제) — 토글 시 토스트 "이제 이 양식으로도 노트를 쓸 수 있어요 / You can now write notes with this template"

#### 우하단 PenLine FAB
- 모바일 viewport 우하단 고정 (`position: fixed; bottom: 80px; right: 16px`)
- 데스크톱: DeviceFrame 내 absolute
- 52×52 골드 그라데이션 (`linear-gradient(135deg, #C9A84C, #A07F2E)`) + 골드 보더
- PenLine 아이콘 (24px, cream stroke)
- 클릭 시 `/community/new` 이동

---

### 3.25 오늘 밤 마시는 사람들 (`/community/tonight`)

- **인트로 텍스트**: "{N}명이 한 잔을 들고 있어요 / {N} people are holding a glass"
- **미니 지도**: 320×240 SVG 한국 지도 + 지역 도트
  - 도트 좌표 라벨: 청담 / 한남 / 판교 / 강남 / 성수 (LocalizedString shape)
  - 도트 클릭 시 해당 지역 유저 카드로 스크롤
- **유저 카드 리스트** (TONIGHT_ENTRIES):
  - 레벨 그라데이션 아바타 + 닉네임 + 레벨 칩
  - "마시는 중: {와인명} / Drinking {wineName}"
  - 장소 (예: "청담 / Cheongdam") + 세부 (예: "와인바 르팡 / Wine Bar Le Pain")
  - 시간 (예: "20분 전")
  - 분위기 (예: "이 친구 진심이에요 / Seriously into it tonight")

---

### 3.26 취향 맞는 유저 발견 (`/community/discover`)

- **취향 일치도 % 상위 유저 리스트**:
  - 큰 아바타 + 닉네임
  - 일치도 % (예: 84%) — 골드 큰 숫자
  - 공통 산지 칩 (예: "보르도", "토스카나")
  - 공통 품종 칩
  - 서브 텍스트 (LocalizedString) — 예: "당신처럼 부르고뉴 화이트를 좋아해요 / Also loves Burgundy whites"
- 클릭 시 `/profile/[userId]` 이동

---

### 3.27 포스트 상세 (`/community/[postId]`)

- 작성자 정보 + 레벨 칩 + 상대 시간
- 포스트 타이틀 (Playfair 22px)
- 본문 (LocalizedString)
- 연결된 와인 카드 (WineEmbedCard) — 클릭 시 `/wine/[id]`
- 좋아요 / 댓글 수 + ReactionBar
- 하단 "댓글 보기 →" → `/community/[postId]/comments`

### 3.28 댓글 (`/community/[postId]/comments`)

- 댓글 리스트:
  - 작성자 아바타 + 레벨 칩 + 타임스탬프
  - 본문 + 좋아요 카운트
- 하단 고정 입력 폼 — "댓글 입력 / Add comment" placeholder
- 제출 → PlaceholderToast

---

### 3.29 글 작성 (`/community/new`)

- 모달 스타일 풀스크린
- 인트로 텍스트: "어떤 이야기를 나누고 싶으세요? / What kind of story do you want to share?"
- 5종 글 타입 카드 (각 타입별 아이콘):
  - **시음 노트** → `/notes/new` (양식 picker로)
  - **질문** → PlaceholderToast (시안)
  - **칼럼** → `/community/new/column`
  - **소식** → PlaceholderToast
  - **앨범** → `/community/new/album`

#### `/community/new/column` (칼럼 작성)
- 제목 입력
- 본문 textarea (Markdown 안내)
- 태그 입력
- 연결 와인 선택 (BottomSheet)
- 저장 → PlaceholderToast

#### `/community/new/album` (앨범 작성)
- 사진 업로드 placeholder
- 캡션 입력
- 저장 → PlaceholderToast

---

### 3.30 커뮤니티 양식 둘러보기 (`/community/templates`)

- 인트로: "양식을 저장하면 노트 작성 화면 picker에 등장해요 / Save a template — it will appear in your note picker"
- 인기/최신 SortToggle (popular = saveCount, latest = createdAt)
- 양식 카드 (Template card) + Bookmark 토글
- 토글 시 토스트:
  - 저장: "이제 이 양식으로도 노트를 쓸 수 있어요 / You can now write notes with this template"
  - 해제: "양식을 픽커에서 제거했어요 / Template removed from picker"

---

## 4. 공통 인프라 컴포넌트

### Navigation

| 컴포넌트 | 역할 |
|---|---|
| **AppHeader** | 로고(WMLogoMark+Wordmark) + BellButton(unread dot) + LevelChip(heavy only) — 홈 계열에만 사용 |
| **BackHeader** | ChevronLeft + title (LocalizedString) + action 슬롯 (Edit/Share/즐겨찾기 등) |
| **BottomNav** | **4탭 + 중앙 카메라 FAB** 구조 — 홈/지도/[FAB]/셀러/커뮤니티. HIDDEN_PREFIXES에 해당하면 숨김 |

**BottomNav 상세**:
- 4탭 (각 22px 아이콘 + 10px 라벨, 활성 시 골드 `#C9A84C`):
  - 홈 (집 아이콘)
  - 지도 (지구본 아이콘)
  - 셀러 (책장 아이콘)
  - 커뮤니티 (인물 그룹 아이콘)
- **중앙 카메라 FAB**: 52×52 골드 그라데이션 + 골드 1px 보더 + `margin-top: -24px`로 떠 있음 → `/capture` 이동
- `border-top: 0.5px var(--color-border-default)` 상단 hairline
- 모바일: in-flow spacer로 마지막 콘텐츠가 nav에 가려지지 않게 처리
- 활성 탭 결정 로직: `/` → home, `/map*` → map, `/cellar*` → cellar, `/community*` → community, `/profile|favorites|badges|photos|notifications|settings` → null (어느 탭도 활성 아님)

### Frame
| 컴포넌트 | 역할 |
|---|---|
| **DeviceFrame** | iPhone 414×868 mockup wrapper (데스크톱 한정) — 라운드 50px + 보더 + shadow |
| **StatusBar** | 시계·신호·LTE·배터리 |
| **DynamicIsland** | iPhone 14 Pro+ 알약 노치 (120×34) |
| **HomeIndicator** | 하단 home gesture bar |
| **PushBanner** | iOS 푸시 — Dynamic Island 아래 58px, framer-motion spring |

### Shared UI

| 컴포넌트 | 역할 |
|---|---|
| **BottomSheet** | 슬라이드업 모달 (backdrop blur + drag handle) |
| **Modal** | 범용 모달 (backdrop click 닫힘, X 닫기 버튼) |
| **ConfirmDialog** | 확인/취소 다이얼로그 (destructive 변형 — 와인레드 확인 버튼) |
| **PlaceholderToast** | 미구현 기능 토스트 ("곧 지원돼요 / Coming soon"), 변형 default/xp |
| **EmptyState** | 와인 SVG + Playfair 22px 제목 + 12px 설명 + CTA |
| **LocaleText** | LocalizedString → locale에 따라 분기 렌더 |
| **GlossaryTooltip** | 인라인 (i) 버튼 → 클릭 시 BottomSheet에 용어 정의 (12개 entry 풀에서 lookup) |
| **LevelPill** | 레벨 색·이름 칩 (locale 반영) |
| **LevelProgressBar** | XP 진척도 (gold glow inner shadow, 5% remaining marker) |
| **WineLabelArt** | SVG 와인 라벨 플레이스홀더 (initial + bottleColor 기반 그라데이션) |
| **WMBottle** | 와인병 SVG — 포일캡·골드 칼라·라벨 텍스트·빈티지, 88/100/120 size 변형 |
| **WMGlassRating** | 와인잔 5개 아이콘 평점 (half 지원, Star 대체) |
| **ReviewBadge** | 외부 평점 배지 (V/WS/CT 로고 + 점수) |
| **PrimaryButton** | 주요 CTA — primary(와인레드) / secondary(border) / ghost(transparent) 변형 |
| **PageBackground** | `.wm-page-bg` 페이지 배경 그라데이션 (135deg deepest→deep) |

### Tasting Note 9 핵심 컴포넌트 (handover doc §5 일치)

| 컴포넌트 | Props |
|---|---|
| **WSETSlider** | labelKey/labelText, value, onChange, labels[5], hint? |
| **AromaWheel** | variant, selected, onToggle, forcedCategory? |
| **CaudalieMeter** | caudalies (1~30), onChange |
| **FaultChecklist** | selected (Fault[]), onToggle |
| **OpeningTimeline** | variant(full/readOnly), meta, state, onOpenedAt, onDecant, onUpsert, onPeak |
| **AutoDescription** | variant(beginner/expert), meta, aroma, palate, finish, rating, evolution?, onCTA? |
| **BlindMode** | correctAnswer?, onCTA? |
| **TanninPanel** | state, onChange |
| **BubblePanel** | bubbles, dosage, onBubbles, onDosage |
| **BeginnerNote** | variant, wineName, producer |

### Tasting Note 신규 4 컴포넌트 (베타 피드백 반영)

| 컴포넌트 | 역할 |
|---|---|
| **ServingTempInput** | 시음 온도 °C 입력 + 권장 범위와 비교 + 빨강 경고 |
| **PeakEtaInput** | 절정 연도·신뢰도·메모 (L3+ 가드) |
| **RegionalAromaHints** | region별 대표 아로마 칩 자동 제안 |
| **SourcePicker** | 노트 출처 선택 (셀러/검색/새 항목) |

### Community

| 컴포넌트 | 역할 |
|---|---|
| **CommFeedCard** | 큰 카드 (Following 탭) — 작성자·타이틀·본문·WineEmbed·ReactionBar |
| **CommFeedRow** | 컴팩트 행 (All 탭) |
| **PostTypeBadge** | 글 타입 색 배지 (note/question/column/news/album) |
| **CommUserAvatar** | 레벨 색 그라데이션 아바타 (initial 표시) |
| **ReactionBar** | 좋아요·잔·반짝·저장 4종 |
| **WineEmbedCard** | 포스트에 인용된 와인 미니 카드 |
| **CommentRow** | 댓글 한 행 |
| **CommunityShortcutCard** | 홈 등에서 사용 가능한 와인레드 그라데이션 단축 카드 |

### Cellar / Wine Detail / Wine Story

| 컴포넌트 | 역할 |
|---|---|
| **CellarCard** | 셀러 카드 (WMBottle + 타입 도트 + DrinkWindowBadge) |
| **CellarEmptyState** | 셀러 빈 상태 (히어로 + CTA) |
| **DrinkThisButton** | "마시기" 하단 고정 CTA |
| **DrinkWindowBadge** | 음용 시점 상태 배지 (peakSoon / inPeak / tooEarly / pastPeak) |
| **WineHeader** | 와인 상세 헤로 (라디얼 그라데이션 + WMBottle) |
| **MyTastingNoteCard** | 내 노트가 있을 때 노출 (평점 + 메모 + 커뮤니티 비교) |
| **WriteNoteCta** | 내 노트 없을 때 노출 (CTA 카드) |
| **ExternalRatingsCard** | Vivino / Wine Searcher / CellarTracker 3소스 |
| **AveragePricePill** | 평균 가격 칩 |
| **PriceChart** + **PriceChartInner** | Recharts LineChart (compact / full, dynamic SSR off) |
| **PriceDetailTable** | 매장별 구매 기록 표 |
| **ReviewCard** / **ReviewList** | 커뮤니티 리뷰 표시 |
| **ServingTempPill** | 시음 온도 권장 범위 칩 (with GlossaryTooltip) |
| **FavoriteToggle** | Heart 토글 (localStorage `winemine.favorites`) |
| **AddToCellarCta** | "셀러에 추가" 인라인 또는 하단 고정 |
| **WineStoryCard** | 와이너리 스토리 요약 카드 + full 페이지 링크 |
| **StoryImage** | 와이너리 헤로 이미지 (이름·연도·위치 오버레이) |

### Map / Community Drink Window

| 컴포넌트 | 역할 |
|---|---|
| **FullWorldMap** | react-simple-maps 인터랙티브 지도 (부르고뉴 줌 드릴다운 포함) |
| **CountryDetailPanel** | 국가 클릭 시 BottomSheet 상세 |
| **MapLegend** | 색상 범례 |
| **RecapModal** | Flighty Passport 스타일 와인 리포트 + PNG export |
| **CommunityDrinkWindowCard** | 와인 상세에 mount되는 compact 히스토그램 |
| **PeakDistribution** / **PeakDistributionInner** | Recharts BarChart (시스템·평균·중앙값 마커 3종) |
| **ContributorsList** | 익명화 추정자 리스트 ("{LevelName} #{anonId}") |

### Profile

| 컴포넌트 | 역할 |
|---|---|
| **ProfileHero** | 큰 그라데이션 아바타 + 닉네임 + 레벨 + 가입일 |
| **StatGrid** | 통계 그리드 (localStorage 머지) |
| **QuickLinks** | 5개 quick action 카드 (즐겨찾기/뱃지/사진/랭킹/지도) |
| **TasteCompatibilityCard** | 취향 일치도 % + 공유 메타 |
| **UserMapHero** | 타 유저 방문 국가 미니맵 |

### Notifications / Photos / Glossary

| 컴포넌트 | 역할 |
|---|---|
| **NotificationRow** | 알림 행 (좌측 컬러 바 + 아이콘 + 텍스트 + 상대 시간) |
| **NotificationFeed** | 홈에 mount 가능한 상위 3건 알림 strip |
| **PhotoCard** | 라벨 사진 카드 (3열 그리드용) |
| **GlossaryTooltip** | (i) 버튼 — 클릭 시 용어 BottomSheet 노출 |

### Settings / Template builder

| 컴포넌트 | 역할 |
|---|---|
| **RadioList** | 설정 라디오 리스트 (1개 선택, 토스트 피드백) |
| **ToggleRow** | 라벨 + 토글 행 |
| **SectionDivider** | 설정 섹션 구분선 (UPPERCASE 라벨) |
| **TemplateBuilder** | 양식 빌더 (필드 추가/삭제/순서 변경) |
| **DynamicTemplateForm** | 양식 필드 정의에 따라 동적 렌더 |

---

## 5. 데모 개발 도구

### DemoControls (`/components/demo-controls/demo-controls.tsx`)

- **데스크톱 ≥1024px만 노출** (좌측 사이드 패널, `.wm-side-panel-left`)
- 모바일·태블릿에서는 숨김

**구성**:
1. **데모 모드 라디오** — first-time / heavy
2. **경험 수준 라디오** — beginner / expert
3. **언어 라디오** — 한국어 / English
4. **부가 액션 4종**:
   - "온보딩 다시 보기" → `localStorage.removeItem('winemine.onboardingComplete')` + setDemoMode('first-time') + `router.push('/onboarding')`
   - "푸시 시뮬" → mock notifications의 `favoritePurchase` 풀에서 랜덤 픽 → `pushBanner({ title, body })` 호출
   - "+50 XP" → XP 토스트 발사 (variant: xp)
   - "셀러 항목 추가" → 토스트 "셀러에 추가됐어요"
5. **현재 URL 미리보기 + Copy**
   - `{pathname}{search}` 텍스트 (예: `/?demo=heavy&exp=expert&locale=en`)
   - Copy 버튼 → `navigator.clipboard.writeText(window.location.href)` + 토스트

각 모드 변경은 LocaleContext / AppMode / Experience 컨텍스트의 setter를 호출하여 URL + localStorage 동기화.

### FeatureFlagPanel (`/components/feature-flag-panel/feature-flag-panel.tsx`)

- **데스크톱 ≥1280px만 노출** (우측 사이드 패널, `.wm-side-panel-right`)

**구성**:
- 현재 라우트가 `useRegisterFeatures(routeKey, definitions)`로 등록한 컴포넌트 inventory 자동 표시
- 각 항목: 라벨(ko/en) + **3-state 토글**:
  - `planned` (계획됨, 초록)
  - `considering` (고려중, 골드)
  - `dropped` (제외, 회색)
- `dropped` 선택 시 → 해당 컴포넌트에 `data-feature-status="dropped"` 속성 부여 → CSS로 `opacity: 0.25 + grayscale(1)` 적용
- 하단에 라우트별 결정 메모 textarea — localStorage에 저장
- 상태 변경 즉시 시각 반영, 새로고침 후에도 유지

---

## 6. 크로스커팅 동작 규칙

### Locale (한국어 / English)

- **즉시 전환** — 페이지 새로고침 없이 LocaleContext 반영
- **영어 모드에서 한글은 단 한 글자도 노출되지 않음** — 와인명·생산자·지역·알림 문구·뱃지 설명·용어 정의·UI 라벨·aria-label·title 속성·placeholder까지 적용
- **한국어 모드에서 영어 병기 허용** (예: 지역명 "보르도 (Bordeaux)")
- **LocalizedString `{ ko, en }` 패턴**으로 모든 도메인 데이터 이중화
- **`LocaleText` 컴포넌트** + **`useLocalizedText()` 훅** 두 가지 분기 방법
- **`useUrlStorageSync('locale', 'winemine.locale', 'ko')` 훅**: URL `?locale=` → localStorage → defaultValue 순으로 hydration-safe 초기화

### Theme (다크 / 라이트)

- `html[data-theme="dark"|"light"]` 속성으로 CSS 변수 재정의
- **다크 (기본)**:
  - 배경: deepest `#251837` → deep `#2E1F3F` 그라데이션
  - 메인 강조: 와인레드 `#8B1A2A`
  - 텍스트: 크림 `#F8F4ED`
  - 지도: 와인 보라 `#3A2440` 빈 국가 / `#100720` 바다
- **라이트 (화이트 와인 컨셉)**:
  - 배경: cream `#FAF5EC` → `#F2EAD9` 그라데이션
  - 메인 강조: **골드 `#B89438`로 통일** (와인레드도 골드로 재정의)
  - 텍스트: 다크 와인 브라운 `#2A1A14`
  - 지도: 양피지 `#DDD0BB` 빈 국가 / 청회색 `#C8D6E4` 바다 / 갈색 국경선
  - 카메라 FAB: 골드 그라데이션
  - 카드: 화이트 `#FFFFFF` surface
- ThemeContext + localStorage 즉시 전환
- 지도 글래스 오버레이는 라이트 모드 별도 분기 (`--color-glass-bg: rgba(255,255,255,0.85)`)

### 레벨·뱃지 표시 규칙 (커뮤니티 콘텐츠 신뢰도 시각화)

모든 사용자 생성 콘텐츠에는 작성자의 레벨 칩(`LevelPill`)이 동반된다:

| 콘텐츠 유형 | 표시 위치 | 함께 노출 |
|---|---|---|
| **ReviewCard** (커뮤니티 리뷰) | 작성자 행 우측 | LevelPill + ReviewBadge 동반 강제 |
| **PriceDetailTable** (구매 기록) | 익명화 행 `{LevelName} #{anonId}` | LevelPill만 (닉네임 노출 X, anonIdFor 해시) |
| **ContributorsList** (음용 적기 추정) | 추정자 행 | LevelPill만 (익명화) |
| **공유 시음 노트** (Community Notes 탭) | 작성자 큰 그라데이션 아바타 | LevelPill |
| **CommentRow** (댓글) | 작성자 행 | LevelPill |

→ 전문성이 높은 레벨의 추정·리뷰가 시각적으로 구분되어 신뢰도 맥락 제공.

### 즐겨찾기 구매 알림 end-to-end 플로우

```
1. 즐겨찾기 등록 (/favorites에서 "구매 시 알림" 토글 ON)
       ↓
2. 다른 유저가 해당 와인 구매 정보 등록 (셀러 추가 또는 노트 작성 시 가격 입력)
       ↓
3. 구매 기록 수 임계치 도달 시 → 푸시 알림 발송
   알림 문구: "누군가 {와인명}을 {가격}에 구매했어요! / Someone bought {wineName} for {price}!"
       ↓
4. 알림 탭 → NotificationRow 클릭
       ↓
5. /wine/[id] — 와인 상세 페이지
       ↓
6. PriceChart(compact) 또는 "가격 추이 상세보기" 버튼
       ↓
7. /wine/[id]/prices — PriceDetailTable (매장명·지점·가격·날짜·작성자 레벨)
```

알림은 `/notifications` 리스트에도 수신함에 쌓임. 빈티지·희소성 높은 와인일수록 가격 추이 모니터링 용도로 활용.

### 노트 공유 / 저장 / 편집

- **내 노트**(`note_…`): 본인만 Edit 버튼 노출 + Share 노출. localStorage `userNotes` 머지.
- **공유 노트**(`sn-…`): 작성자 read-only 카드 + 평점·메모만. mock `shared-notes.ts` 풀.
- **모든 노트**: Share 버튼 노출 (PlaceholderToast)
- **양식 ID**: `TastingTemplateContext` localStorage `winemine.tastingTemplates`에 저장/관리

### XP 적립 액션 (10종)

```ts
XP_ACTIONS = {
  cellarAdd:        5,
  beginnerNote:    10,
  expertNote:      20,
  expertBlindNote: 25,  // blind mode 추가 +5
  photoAttach:      5,
  priceAdd:         5,
  peakEstimate:     5,
  firstCountry:    30,
  firstRegion:     15,
  communityReview: 15,
}
```

각 액션 후 토스트 노출(`variant: xp`). `detectLevelUp(prevXp, nextXp)` 호출하여 레벨업 시 LevelUpModal 노출(시안).

---

## 7. 앱 전역 상태 (Context)

| 컨텍스트 | 저장소 | URL key | localStorage key | 역할 |
|---|---|---|---|---|
| **AppModeContext** | URL + localStorage | `demo` | `winemine.demoMode` | first-time / heavy 모드 |
| **ExperienceContext** | URL + localStorage | `exp` | `winemine.experience` | beginner / expert 경험 수준 |
| **LocaleContext** | URL + localStorage | `locale` | `winemine.locale` | ko / en 언어 |
| **ThemeContext** | localStorage | — | `winemine.theme` | dark / light 테마 |
| **FavoritesContext** | localStorage | — | `winemine.favorites` | 즐겨찾기 와인 ID 배열 |
| **UserDataContext** | localStorage | — | `winemine.userCellar`, `winemine.userNotes` 등 | 사용자 추가 셀러·노트 (mock과 머지) |
| **TastingTemplateContext** | localStorage | — | `winemine.tastingTemplates`, `winemine.savedTemplates` | 커스텀 양식 + 저장한 커뮤니티 양식 |
| **FeatureFlagContext** | in-memory + localStorage | — | `winemine.featureFlags` | 라우트별 컴포넌트 status + 메모 |

**핵심 훅** `useUrlStorageSync(key, storageKey, defaultValue)`:
- mount 후 URL → localStorage → defaultValue 순으로 초기화 (hydration-safe)
- 값 변경 시 localStorage + URL `?<key>=` 동시 갱신 (`router.replace`)

**Provider 트리** (`app-providers.tsx`):
```
<NextIntlClientProvider>
  <LocaleProvider>
    <ThemeProvider>
      <AppModeProvider>
        <ExperienceProvider>
          <FavoritesProvider>
            <UserDataProvider>
              <TastingTemplateProvider>
                <FeatureFlagProvider>
                  {children}
```

---

## 8. Mock 데이터 (src/lib/mock/)

| 파일 | 내용 | 특징 |
|---|---|---|
| **wines.ts** | 와인 카탈로그 (30종+) | LocalizedString shape, isoNumeric 3자리 0패딩 (11개 unique 코드: 032 AR / 036 AU / 152 CL / 250 FR / 276 DE / 380 IT / 554 NZ / 620 PT / 710 ZA / 724 ES / 840 US) |
| **users.ts** | 사용자 2명 | `me-heavy` (xp 1280, L3, 풍부) / `me-first-time` (xp 0, L1, 빈 컬렉션) |
| **cellar.ts** | 셀러 아이템 | `me-heavy` 55건 / `me-first-time` 0건 |
| **tasting-notes.ts** | 내 테이스팅 노트 | `me-heavy` 65건(=notesCount), 50개 unique wineId(=winesTasted) |
| **shared-notes.ts** | 커뮤니티 공개 노트 풀 | 작성자 익명, sn- 접두사 |
| **purchases.ts** | 구매 기록 (가격 추이) | source: cellarRegistration / tastingNote |
| **stores.ts** | 와인 판매점 | 14개 (오프라인/온라인 혼합) |
| **notifications.ts** | 알림 목록 | 5종 kind (favoritePurchase/drinkWindowReached/badgeEarned/levelUp/reviewLiked) |
| **favorites.ts** | 즐겨찾기 목록 | localStorage 데이터와 머지 |
| **badges.ts** | 뱃지 카탈로그 | 4 tier (bronze/silver/gold/platinum) |
| **levels.ts** | 5단계 레벨 정의 | minXp/maxXp/color/한·영 이름·설명 |
| **reviews.ts** | 커뮤니티 리뷰 | 와인별 풀 |
| **wine-stories.ts** | 와이너리 스토리 본문 | history/funFact/philosophy LocalizedString |
| **external-ratings.ts** | Vivino·WS·CT 외부 평점 | 와인별 매칭 |
| **community-peaks.ts** | 커뮤니티 음용 적기 추정 | reviewerLevel ∈ {3,4,5} 강제 (gaussian 시드) |
| **community-posts.ts** | 커뮤니티 포스트 풀 | 5종 type, 작성자 정보 포함 |
| **label-photos.ts** | 라벨 사진 메타데이터 | location LocalizedString |
| **glossary.ts** | 와인 용어 사전 | 12 entry (caudalie, residual-sugar, appellation, wset, brett, bouchonne, tdn, rotundone, decanting, terroir, tannin-texture, dosage) |
| **tasting-templates.ts** | builtin + 커뮤니티 양식 풀 | popular/latest 정렬 헬퍼 포함 |

---

## 9. 보조 라이브러리 (src/lib/)

| 파일 | 역할 |
|---|---|
| **drink-window.ts** | `getDrinkWindow(wine)`, `getDrinkWindowStatus(wine)` — peakSoon / inPeak / tooEarly / pastPeak 상태 분기 |
| **xp.ts** | XP_ACTIONS 10종 정의, `xpToLevel(xp)`, `detectLevelUp(prev, next)`, `calcNoteXp(mode, blind)` |
| **compatibility.ts** | 두 유저 간 취향 일치도 점수 (공유 와인·공유 지역·공통 품종 기반) |
| **regional-aromas.ts** | region별 대표 아로마 칩 매핑 (54개 unique lex id, AROMA_LEXICON에 모두 존재) |
| **community-peak-aggregator.ts** | 커뮤니티 추정 → 히스토그램 집계 (시스템·평균·중앙값 산출, L3+ 가중치) |
| **tasting-note-lexicon.ts** | UC Davis 아로마 휠 + WSET 디스크립터 + 결함 카탈로그 (단일 진실 소스) |
| **recommended-wines.ts** | 입문용 추천 와인 (STARTING_WINE + 6개국 대표) |
| **profile-helpers.ts** | 사용자 resolve 유틸 (mock + localStorage 추가 데이터 머지) |

---

## 10. 디자인 시스템

### 색상 토큰 (CSS 변수)

| 토큰 | 다크 | 라이트 |
|---|---|---|
| `--color-wine-red` | `#8B1A2A` | `#B89438` (골드 재정의) |
| `--color-gold` | `#C9A84C` | `#B89438` |
| `--color-cream` | `#F8F4ED` | `#2A1A14` (다크 브라운 — 텍스트 primary로 사용) |
| `--color-bg-deepest` | `#251837` | `#FAF5EC` |
| `--color-bg-deep` | `#2E1F3F` | `#F2EAD9` |
| `--color-bg-map` | `#3A2440` | `#EDE2CC` |
| `--color-surface` | `#3D2A4A` | `#FFFFFF` |
| `--color-text-primary` | `#F8F4ED` | `#2A1A14` |
| `--color-text-secondary` | `#EBE0CB` | `#5A463C` |
| `--color-text-muted` | `#CABDA8` | `#8B7766` |
| `--color-text-disabled` | `#7E6E8E` | `#C0B0A0` |
| `--color-border-default` | `#5A3D6A` | `#E0D2BC` |
| `--color-border-active` | `#A02030` | `#B89438` |
| `--color-map-country` | `#3A2440` | `#DDD0BB` (양피지) |
| `--color-map-ocean` | `#100720` | `#C8D6E4` (청회색) |
| `--color-map-stroke` | `rgba(245,240,232,0.18)` | `rgba(160,140,110,0.40)` |
| `--color-glass-bg` | `rgba(10,5,15,0.72)` | `rgba(255,255,255,0.85)` |
| `--color-glass-bg-strong` | `rgba(15,7,24,0.92)` | `rgba(255,255,255,0.95)` |
| `--color-bottle-shelf` | `#1a0a1e` | `#FFFFFF` |
| `--gradient-fab` | `linear-gradient(135deg, #8B1A2A, #5b1424)` | `linear-gradient(135deg, #C9A84C, #A07F2E)` |
| `--gradient-page-bg` | `linear-gradient(135deg, #251837 0%, #2E1F3F 100%)` | `linear-gradient(135deg, #FAF5EC 0%, #F2EAD9 100%)` |

### 타이포그래피

- **Playfair Display** (serif) — 로고·제목·모달 타이틀·와인명
- **Inter** (sans-serif) — 본문·버튼·입력
- **Spoqa Han Sans Neo** (CDN) — 한글 fallback (Inter가 Latin만 커버)

### 아이콘

- **lucide-react** 단일 라이브러리 — **이모지 사용 절대 금지**
- 별점 → `Star` / 와인 → `Wine` / 카메라 → `Camera` / 체크 → `Check` / 경고 → `AlertTriangle`
- 아로마 카테고리 → `Cherry`/`Citrus`/`Apple`/`Flower2`/`Flame`/`Candy`/`Sprout`/`Wheat`

### 디바이스 프레임 분기

- **데스크톱 ≥768px**: 414×868 mockup with rounded corners + shadow + DemoControls(좌, ≥1024px) + FeatureFlagPanel(우, ≥1280px)
- **모바일 <768px**: 풀스크린, DeviceFrame wrapper 투명, 사이드 패널 숨김

---

## 11. 베타 피드백 반영 7항목

| # | 항목 | 컴포넌트 | 마운트 위치 |
|---|---|---|---|
| 1 | 시음 온도 입력 | ServingTempInput | note-write-expert.tsx, beginner-note.tsx |
| 2 | Peak ETA 입력 (L3+ 가드) | PeakEtaInput | note-write-expert.tsx |
| 3 | 와이너리 스토리 | WineStoryCard + `/wine/[id]/story` | wine 상세 + 풀 페이지 |
| 4 | 지역 아로마 힌트 | RegionalAromaHints | note-write-expert.tsx |
| 5 | 외부 평점 카드 | ExternalRatingsCard | `/wine/[id]` (Vivino + WS + CT) |
| 6 | 라벨 사진 갤러리 | `/photos` 라우트 | BottomNav 미숨김, BackHeader |
| 7 | 용어 사전 | `/glossary` + `/glossary/[term]` + GlossaryTooltip | GlossaryTooltip 7곳 마운트 (스펙 최소 5곳 초과): story-history-body, story page, serving-temp-pill, caudalie-meter, beginner-note, note-write-expert, fault-checklist |

---

## 12. 기술 스택

- **Next.js 15.5.18** App Router (TypeScript strict)
- **Tailwind CSS v4** + CSS 변수 토큰 (다크/라이트 분기는 `:root[data-theme='light']`)
- **next-intl** — 한/영 i18n (`messages/ko.json`, `messages/en.json`, 각 576 키)
- **react-simple-maps v3** — 세계 지도 (dynamic import, SSR 비활성)
- **topojson-client v3** — TopoJSON 파싱
- **Recharts** — PriceChart LineChart, PeakDistribution BarChart (dynamic SSR off)
- **Framer Motion v12** — PeakGreeting 페이드, 온보딩 전환, PushBanner spring
- **html-to-image** — Recap PNG export
- **lucide-react** — 아이콘 단일 라이브러리
- **localStorage** — 데모 상태 영속화 (8종 컨텍스트)
- **next/dynamic** — react-simple-maps / Recharts 브라우저 한정 렌더 SSR off

---

## 13. 정적 자산 (public/)

- `world-110m.json` — TopoJSON 세계 지도 (174 geo.id)
- `france-departments.json` — 프랑스 데파르트망 (드릴다운용)
- `bottle-textures/` — WMBottle SVG 텍스처
- `winery-stories/` — 와이너리 스토리 헤로 이미지

---

## 14. 빌드 결과 (2026-05-16 기준)

- `npm run build`: **exit 0, 경고 0건**
- `npx tsc --noEmit`: **exit 0, 타입 오류 0건**
- 빌드 산출: 31 정적 + 9 동적 페이지 = **40 페이지** (스펙 22 + 추가 18)
- 빌드 시간: 약 17초 (Turbopack)
- First Load JS shared by all: 102 kB (max 페이지: `/map` 254 kB Recharts 포함)
