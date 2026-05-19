# winemine — Design System

> winemine 키스크린 앱의 디자인 시스템 인덱스.
> 다크 모드(기본)와 라이트 모드 양쪽을 포함하며, 실제 구현된 토큰·컴포넌트 패턴을 진실 소스로 삼는다.

---

## 문서 구성

| 파일 | 내용 |
|------|------|
| [colors.md](./colors.md) | CSS 변수 토큰(다크/라이트), 레벨·뱃지·커뮤니티 색상, 와인 병 팔레트, Shadow, Gold/Wine Red rgba 알파, 테마 전환 메커니즘 |
| [typography.md](./typography.md) | Playfair Display / Inter / Spoqa Han Sans Neo 로드 방식, `.wm-*` 텍스트 유틸 클래스, 인라인 텍스트 패턴, 로고 규칙 |
| [components.md](./components.md) | DeviceFrame·스페이싱·반응형 분기·z-index, 컴포넌트 패턴(PrimaryButton·BottomNav·AppHeader·BottomSheet·Modal·LevelPill·ToggleRow·WSETSlider 등), 아이콘, 모션, 접근성, 라우트 가시성 |
| [legacy/design.md](./legacy/design.md) | 구 단일 파일 `design.md`의 redirect stub (보정 항목 요약) |
| [legacy/winemine-landing-design-system.md](./legacy/winemine-landing-design-system.md) | Phase 1 랜딩 페이지 디자인 시스템 (구 `DESIGN_SYSTEM.md`, 보존용) |

---

## 진실 소스 (Source of Truth)

| 위치 | 역할 |
|------|------|
| `styles/tokens.css` | CSS 변수 토큰 정의 (`:root`, `:root[data-theme='light']`), `body` 기본 폰트 스택 |
| `src/app/globals.css` | Tailwind v4 `@theme` 빌드 토큰 등록, `.wm-*` 유틸 클래스, DeviceFrame 헬퍼, 데스크톱 사이드 패널, `prefers-reduced-motion` 처리 |
| `src/app/layout.tsx` | `next/font` Playfair·Inter 로드, Spoqa CDN `<link>`, FOUC 방지 테마 부트스트랩 inline script |
| `src/lib/mock/levels.ts` | L1~L5 레벨 색상·XP 임계값 |
| `src/components/shared/level-pill.tsx` | LevelPill 색상 매핑 (하드코딩) |
| `src/components/community/post-type-badge.tsx` | 커뮤니티 포스트 타입별 색상 |
| `src/components/shared/review-badge.tsx` | Bronze/Silver/Gold/Platinum 티어 색상 |
| `src/lib/mock/wines.ts` | 와인별 `bottleColor` 팔레트 |

토큰과 다른 값을 컴포넌트가 하드코딩으로 들고 있는 경우, 해당 컴포넌트가 진실 소스이며 이 문서들은 그 값을 반영한다. 토큰을 바꿀 때는 hardcoded 사용처도 함께 grep으로 점검할 것.

---

## 브랜드 정체성

- **서비스명**: `winemine` (소문자, 붙여쓰기 고정 — 대문자·분리 금지)
- **핵심 감성**: 프리미엄 와인 라벨의 무게감. 어두운 밤, 와인 한 잔.
- **다크 모드**: 와인 정체성의 메인 모드. 딥 퍼플-블랙 배경 + Wine Red 강조.
- **라이트 모드**: 화이트 와인 컨셉. 크림-화이트 배경 + Gold 강조 (Wine Red는 칙칙해 보여 라이트에선 Gold로 통합).

---

## 빠른 참조 — 가장 자주 쓰이는 값

| 항목 | 값 |
|------|---|
| Gold (테마 무관 강조) | `#C9A84C` |
| Wine Red (다크 CTA) | `#8B1A2A` |
| Cream (텍스트 primary, 토큰) | `#F5F0E8` / `#F8F4ED` (Tailwind `@theme`) |
| 페이지 배경 (다크) | `--gradient-page-bg` = `#251837 → #2E1F3F` |
| 카드 배경 (다크) | `--color-surface` = `#3D2A4A` |
| Display 폰트 | `var(--font-playfair)` Playfair Display |
| Body 폰트 | `var(--font-inter)` Inter (+ Spoqa Han Sans Neo 한글 fallback) |
| 카드 radius | 12~16px |
| 포커스 outline | `2px solid var(--color-gold)`, offset 2px |

---

## 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-05-19 | docs/design-system/ 디렉토리로 분리 (`colors.md` · `typography.md` · `components.md` · `README.md`). 코드 대비 ocean·country light 색상, map-stroke, DeviceFrame inset, `--color-success`·`--color-gold-soft` 등 누락 항목 반영. 루트의 `design.md`·`DESIGN_SYSTEM.md`는 `legacy/` 하위로 이동. |
| 2026-05-14 | `design.md` (구 단일 파일) 최종 업데이트 |
