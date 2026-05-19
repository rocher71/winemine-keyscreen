# winemine — Layout & Components

> 색상은 [colors.md](./colors.md), 폰트는 [typography.md](./typography.md). 이 문서는 레이아웃·간격·컴포넌트 패턴·모션·접근성·라우트 가시성을 다룬다.

---

## 1. 스페이싱 & 레이아웃

### 1-1. 기기 프레임 (DeviceFrame)

| 항목 | 값 | 소스 |
|------|---|------|
| 외경 (데스크톱) | 414 × 868px | `.wm-device-frame` (`globals.css`) |
| 내경 (콘텐츠 영역) | 390 × 844px | `.wm-device-frame-inner` |
| 외경 border-radius | 50px | |
| 내경 border-radius | 38px | |
| StatusBar 높이 | 54px | |
| `.wm-route-outlet` inset | top 54px (StatusBar 아래) | |
| DeviceFrame 외부 그림자 | `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08), inset 0 0 0 2px #1F1428` | |

### 1-2. 공통 패딩

| 패턴 | 값 |
|------|---|
| `.wm-content-pad` | `16px 20px` |
| BottomNav 패딩 | `8px 12px 28px` (Safe Area 포함) |
| BottomNav spacer | `height: 84px` (모바일 fixed 보정) |
| `.wm-scroll-area` padding-bottom | `96px` (BottomNav 83px + 여유 13px) |
| AppHeader 패딩 | `12px 20px 14px` |
| BackHeader 높이 | `56px`, padding `0 16px` |

### 1-3. 반응형 분기

| 브레이크포인트 | 동작 |
|--------------|------|
| `< 768px` | DeviceFrame 투명, 콘텐츠 풀스크린, StatusBar·Island·Indicator 숨김, BottomNav `position: fixed` |
| `≥ 768px` | DeviceFrame 목업 프레임, StatusBar·Island·Indicator 노출, BottomNav `position: absolute` (frame 내부) |
| `≥ 1024px` | DemoControls (좌측 패널, width 320px) 노출 |
| `≥ 1280px` | FeatureFlagPanel (우측 패널, width 320px) 노출 |

### 1-4. z-index 레이어

| 값 | 요소 |
|----|------|
| 20 | StatusBar |
| 25 | BottomNav |
| 30 | 사이드 패널 (DemoControls, FeatureFlagPanel) |
| 40 | BottomSheet backdrop |
| 41 | BottomSheet sheet |
| 50 | Modal |

---

## 2. 컴포넌트 패턴

### 2-1. PrimaryButton (`src/components/shared/primary-button.tsx`)

4가지 variant, 3가지 size. 모두 `border-radius: 12px`, `font-weight: 600`, `letter-spacing: -0.01em`.

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `primary` | `--color-wine-red` | `--color-cream` | 1px `--color-wine-red` |
| `secondary` | transparent | `--color-cream` | 1px `--color-border-default` |
| `ghost` | transparent | `--color-text-secondary` | transparent |
| `danger` | transparent | `--color-error` | 1px `--color-error` |
| disabled | `--color-text-disabled` | `--color-text-muted` | transparent |

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `sm` | 32px | `6px 12px` | 13px |
| `md` | 40px | `10px 16px` | 14px |
| `lg` | 48px | `14px 20px` | 15px |

### 2-2. BottomNav (`src/components/nav/bottom-nav.tsx`)

- 높이: `padding 8px 12px 28px`
- 배경: `var(--gradient-bottom-nav)` (fade)
- 구분선: `0.5px solid var(--color-border-default)`
- 탭 아이콘: 22px monoline SVG, `strokeWidth: 1.6`, `strokeLinecap: round`, `strokeLinejoin: round`
- 탭 레이블: 10px Inter, 활성 600 / 비활성 400, letter-spacing 0.02em
- 활성 색: **`#C9A84C` (Gold 고정)** — 테마에 관계없이 Gold
- 비활성 색: `var(--color-text-muted)`
- 탭 구성: home / map / **(중앙 FAB)** / cellar / community

**중앙 FAB (카메라)**:
- 52 × 52px, `border-radius: 999`
- 다크: `var(--gradient-fab)` (Wine Red), 라이트: `var(--gradient-fab)` (Gold)
- 테두리: `1px solid var(--color-gold)`
- 그림자: `var(--shadow-fab)`
- `marginTop: -24px` (상단 돌출)

### 2-3. AppHeader (`src/components/nav/app-header.tsx`)

- 패딩: `12px 20px 14px`
- 배경: `var(--color-bg-deep)`
- 구분선: `0.5px solid var(--color-border-default)`
- 좌측: WMLogoMark (26px 와인잔 SVG) + 워드마크 18px
- 우측: Bell 버튼 36px + LevelChip(heavy) 또는 아바타 원형 36px

**LevelChip**: height 32px, `background: --color-surface`, `border: 1px solid --color-border-default`, `border-radius: 999`. 아바타 원형은 `linear-gradient(135deg, ${level.color}, ${level.color}99)`.

**Bell 알림 뱃지**: Wine Red 원형 (`#8B1A2A` fill), 벨 SVG 우상단 `cx=18 cy=6 r=2.5`.

### 2-4. BackHeader (`src/components/nav/back-header.tsx`)

- 높이: 56px, padding `0 16px`
- 좌측: ChevronLeft 24px + 페이지 타이틀 (`.wm-back-title`)
- 우측: 컨텍스트 액션 슬롯 (Share2, MoreHorizontal 등)

### 2-5. BottomSheet (`src/components/shared/bottom-sheet.tsx`)

- `background: var(--color-surface)`
- `borderTopLeftRadius: 24px`, `borderTopRightRadius: 24px`
- `padding: 12px 16px 24px`
- Drag handle: 36×4px, `background: var(--color-gold)`, `border-radius: 2px`, `alignSelf: center`
- `boxShadow: 0 -10px 30px rgba(0,0,0,0.5)`
- Backdrop: `rgba(0,0,0,0.6)`, opacity 0→1 200ms

### 2-6. Modal (`src/components/shared/modal.tsx`)

- `background: var(--color-surface)`
- `border-radius: 16px`, `padding: 24px`
- `border: 1px solid var(--color-border-default)`
- `boxShadow: 0 25px 80px rgba(0,0,0,0.8)`
- `maxWidth: 320px`
- Backdrop: `rgba(0,0,0,0.7)`, padding 16px
- 닫기 버튼: X 20px (`strokeWidth: 1.75`), `color: --color-text-muted`, 상단 우측 `top: 10 right: 10`

### 2-7. EmptyState

- illustration: `color: --color-gold`, `opacity: 0.7`
- 타이틀: `.wm-empty-title` (Playfair 22px)
- 설명: `.wm-empty-desc` (Inter 14px, max-width 280px)

### 2-8. LevelPill (`src/components/shared/level-pill.tsx`)

| Level | Background | Text |
|-------|-----------|------|
| L1 Cream | `#F5F0E8` | `#05020A` |
| L2 Gold Soft | `#D4B85C` | `#05020A` |
| L3 Gold | `#C9A84C` | `#05020A` |
| L4 Wine Red | `#8B1A2A` | `#F5F0E8` |
| L5 Platinum | `linear-gradient(135deg, #C9A84C, #F5F0E8)` | `#05020A` |

- size `sm`: `2px 8px`, 10px / size `md`: `4px 10px`, 11px
- `border-radius: 12px`, `font-weight: 600`, `line-height: 1`

### 2-9. LevelProgressBar

- 게이지 높이: 6px, `background: --color-border-default`, `border-radius: 3px`
- 채움: `linear-gradient(90deg, --color-gold, --color-cream)`, `boxShadow: 0 0 12px rgba(201,168,76,0.5)`
- 레벨 원형 뱃지: 24×24px, `border-radius: 12px`, 해당 `level.color`

### 2-10. ToggleRow (`src/components/settings/toggle-row.tsx`)

- `background: var(--color-surface)`, `border: 1px solid --color-border-default`
- `border-radius: 12px`, `padding: 14px 16px`, `margin: 6px 16px`
- 레이블: Inter 14px **500**, `color: --color-cream`
- 설명: Inter 11px, `color: --color-text-muted`, line-height 1.4
- 토글: 44×26px, 활성 `--color-gold` / 비활성 `--color-border-default`
- Thumb: 20×20px, `background: --color-cream`, left 3↔21px transition 200ms

### 2-11. WSETSlider (테이스팅 노트)

- 5단계: `low / mediumMinus / medium / mediumPlus / high`
- 활성 도트: Gold 채움 + `box-shadow: 0 0 0 4px rgba(201,168,76,0.18), 0 0 12px rgba(201,168,76,0.45)`
- 현재 도트: 18px, 나머지: 12px
- 연결선: 2px, 활성 Gold / 비활성 `--color-border`
- 현재 값 라벨: 12px Gold 오른쪽 정렬
- transition: `all 160ms ease`

### 2-12. 카드 패턴 (공통)

| 속성 | 값 |
|------|---|
| background | `var(--color-surface)` |
| border | `1px solid var(--color-border-default)` |
| border-radius | 12~16px (컨텍스트별) |
| 내부 잠긴 영역 | `background: var(--color-bg-sunken)` |
| 카드 제목 | `.wm-card-title` (Playfair 16px, 1줄 truncate) |
| 카드 메타 | `.wm-card-meta` (Inter 12px muted) |

---

## 3. 아이콘 시스템

**lucide-react**를 단일 아이콘 소스로 사용. **Emoji 사용 절대 금지.**

| 의미 | 아이콘 |
|------|--------|
| 별점 | `Star` (fill로 채움 상태 표현) |
| 와인 | `Wine` / `WineOff` |
| 카메라 | `Camera` |
| 체크 | `Check` |
| 경고 | `AlertTriangle` |
| 뒤로 | `ChevronLeft` |
| 닫기 | `X` |
| 베리 아로마 | `Cherry` |
| 시트러스 | `Citrus` |
| 핵과류 | `Apple` |
| 꽃 | `Flower2` |
| 향신료 | `Flame` |
| 꿀/캐러멜 | `Candy` |
| 흙/허브 | `Sprout` |
| 빵/이스트 | `Wheat` |
| 인상 - 좋음 | `Sparkles` |
| 인상 - 보통 | `Smile` |
| 인상 - 모름 | `HelpCircle` |

**BottomNav 아이콘**: Lucide 대신 인라인 monoline SVG 사용 (같은 스타일 유지).
`strokeWidth: 1.6`, `strokeLinecap: round`, `strokeLinejoin: round`

**기본 strokeWidth**: 1.75 (BackHeader ChevronLeft, Modal X, ReviewBadge Award)

---

## 4. 모션 & 애니메이션

**Framer Motion** 기반. `prefers-reduced-motion: reduce` 환경에서는 CSS transition을 `0.001ms`로 일괄 제거.

| 요소 | 진입 | 퇴장 | duration | easing |
|------|------|------|----------|--------|
| Modal | `scale 0.95→1, opacity 0→1` | 역방향 | 250ms | easeOut |
| Modal backdrop | `opacity 0→1` | 역방향 | 200ms | easeOut |
| BottomSheet | `translateY 100%→0` | 역방향 | 350ms | easeOut |
| BottomSheet backdrop | `opacity 0→1` | 역방향 | 200ms | easeOut |

**CSS transition 기본값**:

- Button: `background 200ms ease-out, transform 100ms ease-out`
- Toggle: `background 200ms`, thumb `left 200ms`
- WSETSlider dot: `all 160ms ease`
- LevelProgressBar: `width 400ms ease-out`

---

## 5. 포커스 & 접근성

```css
:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- 터치 디바이스(`hover: none`)에서 button hover 효과 억제
- `aria-current="page"` — BottomNav 활성 탭
- `aria-label` — 모든 아이콘 전용 버튼
- `role="dialog" aria-modal="true"` — Modal, BottomSheet
- `role="switch" aria-checked` — ToggleRow
- `role="slider"` — WSETSlider

---

## 6. 스크롤 & 오버플로

```css
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }
```

모든 스크롤바 숨김 (가로 스크롤 캐러셀 포함).

`.wm-scroll-area`: `overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 96px`

---

## 7. 데스크톱 사이드 패널

| 패널 | 클래스 | 브레이크포인트 | 위치 | 색상 |
|------|--------|--------------|------|------|
| DemoControls | `.wm-side-panel-left` | `≥ 1024px` | fixed, 좌측 | `rgba(15,7,24,0.95)`, border `--color-border-default` |
| FeatureFlagPanel | `.wm-side-panel-right` | `≥ 1280px` | fixed, 우측 | 동일 |

공통: `width 320px`, `border-radius 16px`, `padding 16px`, `boxShadow 0 24px 64px rgba(0,0,0,0.5)`, `top: clamp(20px, 4vh, 40px)`.

Feature-status dropped: `opacity: 0.25; filter: grayscale(1); pointer-events: none`

---

## 8. 라우트별 네비게이션 가시성

| 라우트 prefix | BottomNav |
|--------------|-----------|
| `/` | 표시 (home 활성) |
| `/map` | 표시 (map 활성) |
| `/cellar` | 표시 (cellar 활성) |
| `/community` | 표시 (community 활성) |
| `/onboarding` | **숨김** |
| `/capture` | **숨김** |
| `/notes/new` | **숨김** |
| 그 외 (`/profile`, `/favorites`, `/badges`, `/photos`, `/notifications`, `/settings`) | 표시 (탭 모두 비활성) |

판정 로직은 `shouldShowBottomNav()`와 `pickActiveTab()`에 있다 (`src/components/nav/bottom-nav.tsx`).

---

## 9. 금지 사항 체크리스트

- [ ] UI 요소에 Emoji 사용 (`🍷 🍓 ✦` 등) — variation selector U+FE0F 포함
- [ ] `winemine` 대문자 사용 또는 분리 표기
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 등 시크릿을 `NEXT_PUBLIC_` 접두사로 노출
- [ ] 테마 미적용 하드코딩 색상 (CSS 변수 대신 hex 직접 사용)
- [ ] Emoji 를 mock 데이터나 JSON 값에 포함
- [ ] Playfair Display로 본문 작성 (16px 이하 가독성 저하)
- [ ] 한글 본문에 letter-spacing > 0.02em
