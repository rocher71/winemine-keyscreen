# winemine — 앱 키스크린 시안

> **Phase 2** — 클릭형 앱 프로토타입. iPhone 390×844 목업 안에서 모든 라우트가 실제로 동작한다.

와인 라벨을 촬영하면 AI가 와인을 인식하고, 마신 와인을 세계 지도 위에 지역별로 시각화해 기록하는 앱 **winemine**의 UI 프로토타입.

---

## 빠른 시작

```bash
git clone https://github.com/team-skyjs/winemine-keyscreen.git
cd winemine-keyscreen
npm install
npm run dev     # http://localhost:3000
```

> **권장 환경:** 데스크톱 ≥1280px. 좌측 DemoControls(모드 토글), 우측 FeatureFlagPanel(컴포넌트 dim 토글) 패널이 표시됩니다.

### URL 파라미터로 즉시 모드 전환

```
?demo=heavy&exp=expert&locale=ko        # 헤비 유저 · 전문가 모드 · 한국어
?demo=first-time&exp=beginner&locale=en # 신규 유저 · 입문자 모드 · 영어
```

---

## 기술 스택

| 레이어 | 선택 |
|--------|------|
| 프레임워크 | Next.js 15 App Router (Turbopack) |
| 언어 | TypeScript 5 (strict) |
| 스타일 | Tailwind CSS v4 + CSS 변수 토큰 |
| i18n | next-intl (한국어 / 영어) |
| 지도 | react-simple-maps v3 + topojson-client |
| 차트 | Recharts (가격 추이 LineChart) |
| 애니메이션 | Framer Motion v12 |
| 아이콘 | lucide-react |
| 폰트 | Playfair Display · Spoqa Han Sans Neo · Inter |
| 데이터 | 모두 `src/lib/mock/*.ts` 하드코딩 (백엔드 없음) |

---

## 라우트 구성 (33개)

### 핵심 플로우

| 경로 | 설명 |
|------|------|
| `/` | 홈 — heavy/first-time 모드 분기 |
| `/map` | 인터랙티브 세계 지도 |
| `/capture` | 라벨 스캔 (mock 분석 시뮬레이션) |
| `/cellar` | 셀러 리스트 (내 셀러 / 마신 와인 탭) |
| `/cellar/[id]` | 셀러 아이템 상세 |
| `/wine/[id]` | 와인 상세 |
| `/wine/[id]/story` | 와이너리 스토리 |
| `/wine/[id]/prices` | 가격 추이 상세 |
| `/wine/[id]/community-peak` | 커뮤니티 음용 적기 상세 |

### 노트 작성

| 경로 | 설명 |
|------|------|
| `/notes/new` | 출처 선택 (셀러 / 새 와인) |
| `/notes/new/write` | 노트 작성 (입문자 / 전문가 모드 자동 분기) |

### 커뮤니티

| 경로 | 설명 |
|------|------|
| `/community` | 커뮤니티 피드 (following / 전체 / 트렌딩 탭) |
| `/community/discover` | 취향 맞는 유저 발견 |
| `/community/tonight` | 지금 마시는 사람들 |
| `/community/new` | 새 글 작성 선택 |
| `/community/new/column` | 칼럼 작성 |
| `/community/new/album` | 앨범 작성 |
| `/community/[postId]` | 포스트 상세 |
| `/community/[postId]/comments` | 댓글 |

### 프로필 & 소셜

| 경로 | 설명 |
|------|------|
| `/profile` | 내 프로필 |
| `/profile/[userId]` | 타 유저 프로필 + 취향 일치도 |
| `/profile/ranking` | 레벨 · XP 랭킹 |
| `/favorites` | 즐겨찾기 |
| `/badges` | 뱃지 진열장 |
| `/photos` | 라벨 사진 갤러리 |
| `/notifications` | 알림 리스트 |

### 유틸리티

| 경로 | 설명 |
|------|------|
| `/glossary` | 와인 용어 사전 |
| `/glossary/[term]` | 용어 상세 |
| `/onboarding` | 온보딩 4단계 (첫 실행) |
| `/settings` | 설정 홈 |
| `/settings/language` | 언어 설정 |
| `/settings/experience` | 경험 수준 설정 |
| `/settings/notifications` | 알림 설정 |

---

## 디자인 시스템

### 색상 토큰

```css
--color-wine-red:      #8B1A2A   /* CTA, 강조 */
--color-gold:          #C9A84C   /* 아이콘, 장식, 활성 탭 */
--color-cream:         #F5F0E8   /* 주요 텍스트 */
--color-bg-deepest:    #05020A   /* 주 배경 */
--color-bg-deep:       #0A050F   /* 헤더 배경 */
--color-bg-map:        #1A0A1E   /* 지도 배경 */
--color-surface:       #0F0718   /* 카드 배경 */
--color-border-default:#2D1540
```

### 폰트

- **Playfair Display** — 제목, 와인명, 워드마크 (serif)
- **Spoqa Han Sans Neo** — 한국어 본문 (sans-serif)
- **Inter** — 영문 본문, UI 레이블 (sans-serif)

### 주요 공유 컴포넌트

| 컴포넌트 | 위치 | 설명 |
|----------|------|------|
| `WMBottle` | `shared/wm-bottle.tsx` | 와인 병 SVG 일러스트 (포일캡·라벨·빈티지) |
| `WMGlassRating` | `shared/wm-glass-rating.tsx` | 와인잔 5개 아이콘 평점 (half 지원) |
| `AppHeader` | `nav/app-header.tsx` | 와인잔 로고마크 + "wine·mine" 워드마크 + 레벨칩 |
| `BottomNav` | `nav/bottom-nav.tsx` | 5탭 + 중앙 카메라 FAB (골드 테두리) |
| `LevelProgressBar` | `shared/level-progress-bar.tsx` | XP 진척도 바 (골드 glow) |
| `DeviceFrame` | `device-frame/device-frame.tsx` | iPhone 목업 프레임 |

---

## 데이터 구조

### Mock 데이터 (`src/lib/mock/`)

| 파일 | 내용 |
|------|------|
| `wines.ts` | 와인 카탈로그 (40+ 종, 국제 산지 커버) |
| `users.ts` | heavy / first-time 두 유저 프로필 |
| `cellar.ts` | heavy 유저 셀러 32병 |
| `tasting-notes.ts` | heavy 유저 테이스팅 노트 40건 |
| `purchases.ts` | 가격 구매 기록 |
| `external-ratings.ts` | Vivino / Wine Searcher / CellarTracker 점수 |
| `notifications.ts` | 알림 데이터 |
| `badges.ts` | 뱃지 카탈로그 |
| `levels.ts` | 5단계 레벨 (Bronze → Master) |
| `reviews.ts` | 커뮤니티 리뷰 |
| `wine-stories.ts` | 와이너리 스토리 |
| `community-peaks.ts` | 음용 적기 추정 데이터 |
| `community-posts.ts` | 커뮤니티 포스트 |

### 유저 모드 분기

```
demo=heavy      → 87병 시음, 셀러 32병, 노트 64건, 레벨 4(골드)
demo=first-time → 빈 셀러, 온보딩 유도
exp=expert      → WSET 4축 슬라이더, 아로마 휠, 카우달리 미터
exp=beginner    → 별점, 향/맛 체크박스, 자동 묘사
locale=ko|en    → 전 UI 즉시 전환 (한글 0 누출 원칙)
```

---

## 주요 기능 하이라이트

### 세계 지도 (`/map`)
- react-simple-maps + TopoJSON 기반 실제 세계 지도
- 마신 국가를 Wine Red로 채색, 밀도에 따라 진하기 4단계
- 국가 클릭 → BottomSheet 드릴다운 (지역 → 와인 리스트)
- 필터 바: 전체 / 마신 와인 / 셀러 / 즐겨찾기

### 테이스팅 노트 (`/notes/new/write`)
- **입문자**: 별점·향·맛 체크박스·자동 묘사 박스
- **전문가**: WSET 4축·아로마 휠·카우달리 미터·결함 체크·오프닝 타임라인·블라인드 모드
- 와인 상세 페이지에서 내 노트 카드 즉시 확인 + 편집
- 노트 없는 와인엔 "노트 작성" CTA 카드 자동 표시

### 셀러 (`/cellar`)
- **내 셀러** 탭: 2열 그리드, 음용 적기 배지, 정렬/필터/검색
- **마신 와인** 탭: 테이스팅 노트 인라인 미리보기 (평점·아로마·WSET 4차원) + "노트 편집" 버튼

### 커뮤니티 (`/community`)
- 피드 타입: note / question / column / news / album
- 탭: 팔로잉 / 전체 / 트렌딩
- 오늘 밤 마시는 사람들 (`/community/tonight`)
- 취향 맞는 유저 발견 (`/community/discover`)

---

## 프로젝트 문서

| 파일 | 내용 |
|------|------|
| `WINEMINE_KEYSCREEN_SPEC.md` | 2500줄 전체 스펙 (라우트·컨텍스트·디자인·테스트 시나리오) |
| `FEATURES.md` | 현재 구현된 기능 상세 목록 |
| `DESIGN_SYSTEM.md` | 색상·타이포·간격 디자인 시스템 |
| `ONBOARDING.md` | 새 세션 진입용 인계 문서 |
| `CLAUDE.md` | Claude Code 작업 컨벤션 + 하네스 정의 |
| `docs/tasting-note-app-handover.md` | 테이스팅 노트 컴포넌트 9개 시그니처 |
| `data/raw/2026-05-12_review.md` | 1차 베타 피드백 |

---

## 커밋 히스토리 요약

| 날짜 | 주요 작업 |
|------|----------|
| 2026-05-13 | 초기 스캐폴드 + 인프라 + 22 라우트 전체 구현 |
| 2026-05-13 | 지도 렌더 안정화, react-simple-maps 타입 정의 |
| 2026-05-13 | WMBottle SVG 병 일러스트 + WMGlassRating 와인잔 평점 공유 컴포넌트 |
| 2026-05-13 | AppHeader 로고마크 + BottomNav FAB 골드 테두리 디자인 개선 |
| 2026-05-13 | 홈 에디토리얼 인사말 · 3열 통계 카드 · 세계지도 cameo |
| 2026-05-13 | 지도 필터 바 + 국가 패널 WMBottle 개선 |
| 2026-05-13 | 와인 상세 WMBottle 히어로 + "노트 작성" CTA |
| 2026-05-13 | 셀러 마신 와인 탭 + 테이스팅 노트 인라인 미리보기 |
| 2026-05-13 | 커뮤니티 섹션 8 라우트 + 7 컴포넌트 전체 구현 |
| 2026-05-13 | 한글 폰트 Noto Sans KR → Spoqa Han Sans Neo 교체 |

---

## 개발 참고

```bash
npm run dev      # Turbopack 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드 (타입 체크 포함)
npm run lint     # ESLint
```

### node_modules 문제 발생 시

패키지가 부분 손상되면 다음 순서로 클린 재설치:

```bash
rm -rf node_modules package-lock.json
npm install
```
