# files-for-context

> winemine **앱 프로토타입** 작업에 필요한 컨텍스트를 한 폴더에 모아둔 패키지.
> 새 레포에서 작업을 시작할 때 통째로 가져가면 된다.

랜딩 페이지 레포(현재 작업 중인 `winemine`)에서 추출했으며,
**랜딩 전용 코드(Server Action, Supabase 클라이언트, waitlist 컴포넌트, middleware, 배포 설정)는 모두 제외**했다.
필요한 디자인 토큰·도메인 데이터·와인 어휘·도메인 리서치만 담았다.

---

## 디렉토리 구조

```
files-for-context/
├── README.md                              ← 이 파일
├── CLAUDE.md                              ← 트리밍된 새 레포용 CLAUDE.md (그대로 옮겨 쓰기 OK)
├── DESIGN_SYSTEM.md                       ← 색상·타이포·간격·애니메이션 사양 추출본
│
├── styles/
│   └── tokens.css                         ← 디자인 토큰 + body/scrollbar 기본 (Tailwind v4 import 직후 사용)
│
├── public/
│   ├── world-110m.json                    ← 세계 지도 데이터 (low-res)
│   ├── france-departments.json            ← 프랑스 데파르트망
│   ├── logo.png                           ← winemine 로고
│   └── winemine-glass-mark.png            ← 와인잔 마크
│
├── messages/                              ← 트리밍된 i18n (랜딩 전용 키 제거, 와인 도메인 어휘만)
│   ├── ko.json
│   └── en.json
│
├── lib/                                   ← as-is 복사 (수정 없음)
│   ├── recommended-wines.ts               ← 입문용 와인 mock + STARTING_WINE (Margaux)
│   ├── tasting-note-lexicon.ts            ← UC Davis 아로마 휠 / WSET / 결함 카탈로그
│   ├── validations.ts                     ← 이메일·한국 전화번호 Zod 스키마
│   └── analytics.ts                       ← window.gtag 래퍼
│
└── docs/                                  ← 도메인 리서치 / UX 사양 (참고 자료)
    ├── burgundy-classification-research.md
    ├── burgundy-section-spec.md
    ├── wine-discovery-section-spec.md
    └── tasting-note-section-spec.md
```

---

## 새 레포에서의 권장 배치

| 이 폴더 | 새 레포 내 위치 |
|---------|----------------|
| `CLAUDE.md` | 루트 (`/CLAUDE.md`) |
| `DESIGN_SYSTEM.md` | 루트 또는 `docs/DESIGN_SYSTEM.md` |
| `styles/tokens.css` | `src/app/tokens.css` 후 `globals.css`에서 `@import` |
| `public/*` | `public/` |
| `messages/*.json` | `src/messages/` (앱에서 i18n 쓸 경우) |
| `lib/recommended-wines.ts` | `src/lib/` |
| `lib/tasting-note-lexicon.ts` | `src/lib/` |
| `lib/validations.ts` | `src/lib/` |
| `lib/analytics.ts` | `src/lib/` |
| `docs/*` | `docs/` 또는 `_workspace/` |

---

## 트리밍 내역 요약

### `CLAUDE.md` (새로 작성)
원본은 랜딩 페이지 개발 명령어, Supabase 스키마, Server Action, 컴포넌트 파일 구조, 하네스 정의 등으로 가득했다. 그 중:
- **유지**: 서비스 정체성, 디자인 시스템, 지도 구현 노하우, 도메인 데이터 인덱스
- **제거**: 랜딩 빌드 명령, DB 스키마, 환경 변수, 파일 구조, 페이지 마운트 순서, 모든 하네스 섹션

### `DESIGN_SYSTEM.md` (새로 작성)
원본 `WINEMINE_LANDING_SPEC.md`(XML 포맷 970줄 단일 파일)의 `<aesthetic_guidelines>` 블록을 추출 + 마크다운으로 재정리. 랜딩 페이지 섹션별 사양은 모두 버렸다.

### `styles/tokens.css` (트리밍)
원본 `src/app/globals.css`(105줄)에서:
- **유지**: 디자인 토큰(`--color-*`), body 폰트 스택, scrollbar 숨김, touch hover 억제
- **제거**: `mapSlideLeft`/`scanLine`/`pulseGlow`/`storyShimmer` 등 랜딩 keyframe, `.stats-4col`, 모바일에서 France 섹션 카드 숨기는 미디어쿼리

### `messages/*.json` (트리밍)
원본 `src/messages/{ko,en}.json`(약 550줄)에서:
- **유지**: `franceWine.regions`, `wineDiscovery`(온보딩 스캔/추천 흐름), `burgundy`, `tastingNote`(전체), `franceWineDetail`, `wines`(mock 와인 노트)
- **제거**: `hero`, `vineyardStrip`, `features`, `marketStats`, `howItWorks`, `instagramPreview`, `finalCta`, `floatingCta`, `storeButtons`, `waitlistModal`, `waitlistForm`, `waitlistSuccess`
- 두 파일 키 구조 동기화 유지. 추가 키는 양쪽 모두 업데이트할 것.

---

## 가져오지 않은 항목 (의도적 제외)

| 파일/모듈 | 제외 이유 |
|----------|----------|
| `src/app/actions.ts` (Server Action) | 랜딩 waitlist 전용 |
| `src/lib/supabase-server.ts` | 앱은 인증·데이터 모델이 다를 것 |
| `src/lib/slack.ts` | waitlist 알림 전용 |
| `src/components/waitlist/*` | 랜딩 전용 |
| `src/components/sections/*` | 랜딩 페이지 섹션 (앱 UI와 다름) |
| `src/components/map/world-map.tsx` | 랜딩 hero 배경용 — 앱 지도는 인터랙션이 다를 것이므로 새로 짜는 게 깔끔 |
| `src/middleware.ts` | Accept-Language 파싱 + 쿠키 — i18n 필요할 때만 다시 작성 |
| `src/app/layout.tsx` | 폰트/메타 설정은 새 레포에서 새로 |
| `src/app/opengraph-image.tsx` | OG 이미지 — 앱은 SNS 공유 흐름이 다를 것 |
| `_workspace/france-wine-research.md`, `world-wine-research.md` | 매우 큰 리서치 문서 — 필요하면 별도로 가져갈 것 |
| `_workspace/copy-edit-ko.json` | 랜딩 카피 에디트 기록 |
| `_workspace/map-done.md`, `qa-done.md`, `ui-done.md` | 랜딩 빌드 진행 보고서 |

---

## 다음 단계 (참고)

1. 새 레포 생성 후 `files-for-context/` 통째로 복사 (또는 내용물을 권장 위치로 이동)
2. `CLAUDE.md` 검토 및 앱 프로토타입 컨텍스트로 보강
3. Next.js 15 + Tailwind v4 scaffold
4. `styles/tokens.css`를 globals에서 import
5. `lib/` 파일들을 그대로 사용 시작
6. 앱 UI는 새로 디자인 — 랜딩 컴포넌트는 참고만 (이 폴더에 포함 안 됨)
