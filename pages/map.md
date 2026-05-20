# 세계 지도 (`/map`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/map` |
| 파일 | `src/app/map/page.tsx` (287 라인) + `src/components/map/full-world-map.tsx` |
| 헤더 | **없음** (풀스크린 — 지도가 viewport 전체 차지) |
| BottomNav | 표시 (지도 탭 활성) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/map` — `map.fullWorldMap`, `map.legend`, `map.countrySheet` |
| 핵심 기술 | `react-simple-maps` (dynamic import, **SSR off**), `topojson-client`, `framer-motion` |

---

## 진입 경로

- BottomNav 지도 탭
- 홈 `MapCameo` 클릭 → `/map`
- 홈 `QuickActions` 일부, 프로필 `QuickLinks` → `/map`
- 노트/와인 상세 → 일부 링크 없음 (직접 라우팅만)

---

## 페이지 구성 (풀스크린)

`<main>`은 `flex: 1, position: relative, overflow: hidden, background: var(--color-bg-map)`. 모든 요소가 absolute로 겹쳐진다.

### 1. FullWorldMap (`absolute, inset: 0`)

- `src/components/map/full-world-map.tsx`
- **동적 import**: `dynamic(() => import('@/components/map/full-world-map'), { ssr: false, loading: <빈 회색 div> })`
- 프로젝션 `geoMercator`, scale 90, center `[10, 25]`
- 줌 범위 [1.0, 12.0]
- 마우스 휠 / 터치 핀치 / 드래그 팬 지원
- TopoJSON 소스: `/world-110m.json` (174 geo.id)
- 국가 식별: `String(geo.id).padStart(3, '0')` (3자리 isoNumeric)
- Antarctica (`010`)은 바다색으로 채워 숨김 처리

#### 색상 시스템 (다크 vs 라이트 토큰 분기)

| 요소 | 다크 | 라이트 (양피지) |
|---|---|---|
| 바다 (SVG background) | `#100720` 짙은 보라 | `#C8D6E4` 청회색 |
| 빈 국가 fill | `#3A2440` 와인 보라 | `#DDD0BB` 양피지 |
| 국경선 stroke | `rgba(245,240,232,0.18)` 크림 18% | `rgba(160,140,110,0.40)` 따뜻한 갈색 40% |
| 시음 fill | `rgba(139,26,42, t)` t=0.18→1.0 heat | 동일 |
| Hover | 와인레드 + 골드 stroke 55% | 동일 |

병 수에 따라 `t = clamp(0.18 + bottles * 0.08, 0.18, 1.0)` 채도 증가.

#### heavy 모드 데이터

```ts
const tasted = getTastingNotesByUser(user.id).map(n => getWine(n.wineId)).filter(Boolean);
const cellar = getCellarByUser(user.id).map(c => getWine(c.wineId)).filter(Boolean);
wines = dedupe(...tasted, ...cellar);   // Map by wine.id
```

#### 글로벌 핀

- 골드 도트 `r=3 + black stroke`
- 핀 클릭 → 해당 국가 BottomSheet 오픈 (`setSelectedIso(iso)`)
- 프랑스 핀은 제외 (코뮌 마커로 대체)

#### 프랑스 자동 줌인 (드릴다운 1단계)

- France(`'250'`) 클릭 → ZoomableGroup `zoom: 5, center: [2.5, 46.8]`
- 좌상단 글래스 라벨 "France" 노출 (`franceFocused === true` 시)
- `franceFocused = zoom >= 4 && -6 < lon < 10 && 42 < lat < 52`

#### 부르고뉴 코뮌 마커 (드릴다운 2단계)

`franceFocused === true`일 때 11개 코뮌 마커 표시. 좌표 클러스터링(lon Δ<0.09, lat Δ<0.07)으로 시음 카운트 산출.

| ID | 한글명 | 영문명 | 타입 |
|---|---|---|---|
| `chablis` | 샤블리 | Chablis | white |
| `gevrey` | 주브레-샹베르탱 | Gevrey-Chambertin | red |
| `morey` | 모레-생-드니 | Morey-Saint-Denis | red |
| `chambolle` | 샹볼-뮈지니 | Chambolle-Musigny | red |
| `vosne` | 본-로마네 | Vosne-Romanée | red |
| `nsg` | 뉘-생-조르주 | Nuits-Saint-Georges | red |
| `beaune` | 본 | Beaune | both |
| `pommard` | 포마르 | Pommard | red |
| `volnay` | 볼네 | Volnay | red |
| `meursault` | 뫼르소 | Meursault | white |
| `puligny` | 퓔리니-몽라셰 | Puligny-Montrachet | white |

핀 색: white=`#C9A84C` / red=`#8B1A2A` / both=`#A0405A`. 시음 있으면 4.2r, 없으면 2.8r + alpha 0.22. 핀 크기 줌 보정: `counter-scale = 1 / zoom^0.6`.

시음 카운트 뱃지: 핀 우상단 `(+5, -5)` 골드 3.4r 도트 + 검정 4.2px 굵은 숫자.

#### 꼬뜨 라벨 (드릴다운 3단계)

`burgFocused = zoom >= 6.5 && 2.5 < lon < 6.5 && 45 < lat < 49`일 때:
- 코뮌 옆 한글 라벨(`commune.ko`) — 시음 있으면 크림 92% / 없으면 38%
- Playfair 9.5px 꼬뜨 라벨 3개:
  - **Chablis** at `[3.798, 48.04]` 골드 75%
  - **Côte de Nuits** at `[5.06, 47.32]` 와인레드 80%
  - **Côte de Beaune** at `[4.65, 47.00]` 와인레드 65%
- 좌상단 글래스 라벨 "France" → "Bourgogne"로 전환

### 2. MapLegend (좌상단 작은 글래스)

- `src/components/map/map-legend.tsx`
- 색상 범례 — "1병~10+병" 그라데이션 바
- `data-feature-id="map.legend"`

### 3. 필터 바 (좌하단, glass + backdrop-blur 8px)

- 클래스 `wm-map-filter-bar` (CSS에서 데스크톱 `bottom:100px` / 모바일 `bottom:16px`)
- 칩 4종 (`FILTER_KEYS`): `all` / `tasted` / `cellar` / `favorite`
  - 활성: 골드 18% bg + 골드 border + 골드 text
  - 비활성: glass bg + 흰색 border + secondary text
  - **활성 토글 시 "all" 이외에는 `t('filterToast')` placeholder 토스트 발사** ("곧 지원돼요")
- 슬라이더 아이콘 버튼 (`32×32` 원형, glass, SVG 자체 그림)
  - 클릭 시 `filterToast` placeholder

### 4. first-time 모드 빈 패널 (중앙 38% 위치)

조건: `isFirstTime = demoMode !== 'heavy'`

- `position: absolute; top: 38%; left/right: 20`, padding 24, rounded 16
- `var(--color-glass-bg-strong)` + 골드 35% 1px border + backdrop-blur 10
- **카메라 SVG** (28px, golden stroke 1.6): 카메라 + 렌즈
- Playfair 18px: `t('emptyTitle')` ("지도가 비어 있어요" / "Your map is empty")
- Inter 11px muted: `사진 한 장이면 와인 정보가 자동 채워지고, 마신 국가가 지도에 칠해집니다 / One photo auto-fills the wine info, and the country you drank from gets painted on the map`
- `<PrimaryButton variant="primary">` — `t('emptyCta')` → `router.push('/capture')`

### 5. CountryDetailPanel (BottomSheet — 국가 클릭 시)

- `src/components/map/country-detail-panel.tsx`
- `open={selectedIso !== null}`, `isoNumeric={selectedIso}`, `wines`, `onClose`
- 헤더: 국가명 (locale 분기) + `{N}병` 와인레드 뱃지
- 미니 그리드 2열: `지역 {count}` / `마신 {count}`
- 지역 리스트 — 클릭 시 드릴다운 (지역의 와인 리스트)
- 와인 행: WMBottle + 와인명 + 생산자·빈티지 → 클릭 시 `/wine/[id]` 이동

### 6. Recap 버튼 — 우상단 (heavy + notes.length > 0)

- `position: absolute; top: 14; right: 14`, padding `8px 12px`, border-radius 999
- 배경: `linear-gradient(135deg, var(--color-wine-red), var(--color-gold))`
- 아이콘: `<Sparkles size={13} strokeWidth={2.2} />`
- 텍스트: `와인 리포트 생성하기 / Generate Wine Report` (Inter 11px weight 700)
- `box-shadow: 0 6px 16px rgba(0,0,0,0.45)`, backdrop-blur 8, z-index 15
- 클릭 → `setRecapOpen(true)`

### 7. RecapModal (Flighty Passport 스타일)

- `src/components/map/recap-modal.tsx`
- `open={recapOpen}`, `user`, `notes`, `wines`, `onClose`
- 풀스크린 backdrop `rgba(5,2,10,0.85)` + blur 6px → 중앙 패스포트 카드 슬라이드업

**패스포트 카드 구성**:
- 사용자 이름 (영문 대문자, MRZ-style: 공백을 `<`로 치환, 예: `KIM<YEJIN`)
- 가입일 (`YYYY.MM.DD`) + 현재 년도
- 통계 그리드:
  - `totalBottles` 총 시음 병 수
  - `uniqueWines` 유니크 와인 수
  - `countries` 시음 국가 수
  - `regions` 시음 지역 수
  - `topGrape` 최다 시음 품종
  - `topRegion` 최다 시음 지역
  - `highestRating` 최고 평점 (`expertFields.rating` 또는 `beginnerFields.rating × 20`)
  - `avgRating` 평균 평점
- 미니 세계지도 — isoSet 포함 국가 와인색 강조
- 국기 row — ISO numeric → Alpha-2 매핑 후 Unicode flag emoji 변환 (최대 8개)
  - 매핑된 코드: FR/IT/ES/DE/AT/PT/GR/HU/CZ/US/CA/CL/AR/UY/BR/AU/NZ/ZA/KR/JP/CN/RU/SK/SI/HR/MD/GB/NL/CH/TR/LB/IL
- 와인 타입 범례 — 레드 / 화이트 / 기타 카운트 (locale 분기)
- MRZ-style decoration 하단 띠

**액션 버튼 (하단)**:
- **"이미지 저장 / Save image"**: `html-to-image`의 `toPng()` → `winemine-recap-${year}.png` 다운로드, pixelRatio 2x, 배경 `#1a0a1e`
- **"공유 / Share"**: PlaceholderToast "공유 시트는 곧 지원돼요 / Share sheet coming soon"
- **"닫기 / Close"**: X 버튼 (우상단)

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| 국가 fill | 클릭 | `setSelectedIso(iso)` → BottomSheet 오픈 |
| 국가 fill (France) | 클릭 | ZoomableGroup `zoom:5, center:[2.5, 46.8]` |
| 글로벌 핀 | 클릭 | BottomSheet 오픈 |
| 코뮌 핀 | 클릭 | (현재) 시각만 — 향후 코뮌 상세 |
| 빈 영역 드래그 | 팬 | 지도 이동 |
| 마우스 휠 / 핀치 | 줌 | zoom 1.0~12.0 |
| 줌 컨트롤 (RotateCcw / Plus / Minus) | 클릭 | 리셋·확대·축소 |
| 필터 칩 `all` | 클릭 | `setActiveFilter('all')` |
| 필터 칩 (`tasted`/`cellar`/`favorite`) | 클릭 | `setActiveFilter(key)` + `filterToast` ("곧 지원돼요") |
| 슬라이더 버튼 | 클릭 | `filterToast` |
| first-time CTA | 클릭 | `router.push('/capture')` |
| Recap 버튼 | 클릭 | `setRecapOpen(true)` |
| BottomSheet 와인 행 | 클릭 | `/wine/[id]` |
| RecapModal 이미지 저장 | 클릭 | `toPng()` → 다운로드 |
| RecapModal 공유 | 클릭 | placeholder toast |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `selectedIso` | useState | `null` |
| `activeFilter` | useState | `'all'` |
| `recapOpen` | useState | `false` |
| `user` | mock | `useMockUser()` |
| `demoMode` | URL+LS | `useAppMode()` |
| `locale` | URL+LS | `useLocale()` |
| `notes` | useMemo | heavy면 `getTastingNotesByUser(user.id)`, 아니면 `[]` |
| `wines` | useMemo | heavy면 노트+셀러 dedupe, 아니면 `[]` |
| `unread` | mock | `getUnreadCount(user.id)` |
| `avatar` | hook | `useLocalizedText(user.avatarInitial)` |

---

## 모드 분기 정리

| 모드 | FullWorldMap heat | 글로벌 핀 | 코뮌 마커 | first-time 패널 | Recap 버튼 |
|---|---|---|---|---|---|
| heavy + notes 1+ | O | O | O (franceFocused 시) | X | O |
| heavy + notes 0 | X | X | X (시음 카운트 0) | X | X |
| first-time | X | X | X | O | X |

다크/라이트 테마는 토큰 기반으로 즉시 분기. 한글/영어 모두 모든 라벨에 적용.

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getTastingNotesByUser` | wines 산출 + Recap |
| `getCellarByUser` | wines 산출 |
| `getWine` | wineId → wine 객체 lookup |
| `getUnreadCount` | unread (현재 사용 안 함, import만) |
| `/world-110m.json` | TopoJSON (FullWorldMap 내부 fetch) |

---

## i18n 키 prefix

- `map.filterToast`, `map.filterLabel`
- `map.emptyTitle`, `map.emptyCta`
- (RecapModal은 `map.recap.*` 추정)
- (CountryDetailPanel은 `map.countryPanel.*` 추정)

---

## Feature flag 등록

```ts
useRegisterFeatures('/map', [
  { id: 'map.fullWorldMap', ... },
  { id: 'map.legend', ... },
  { id: 'map.countrySheet', ... },
])
```

---

## 빈/오류 상태

- **first-time**: 중앙 글래스 패널 + "첫 스캔하기" CTA
- **heavy인데 wines.length === 0**: heat/핀 없이 빈 보라 지도. Recap 버튼은 `notes.length > 0` 가드라 안 노출
- **TopoJSON 로딩 중**: dynamic import loading prop으로 빈 회색 div

---

## 디자인 토큰 / 스타일

- 페이지 배경: `var(--color-bg-map)`
- glass 토큰: `--color-glass-bg`, `--color-glass-bg-strong`, `--color-glass-border`
- 필터 바 모바일/데스크톱 위치 분기 (BottomNav 96px 위)
- Recap 버튼 그라데이션 `linear-gradient(135deg, var(--color-wine-red), var(--color-gold))`
