# winemine — Design System

> 이 문서는 winemine 키스크린 앱의 디자인 시스템을 기술한다.  
> 다크 모드(기본)와 라이트 모드 양쪽을 포함하며, 실제 구현된 토큰·컴포넌트 패턴을 진실 소스로 삼는다.  
> 토큰 정의: `styles/tokens.css` / Tailwind 확장: `src/app/globals.css`

---

## 1. 브랜드 정체성

- **서비스명**: `winemine` (소문자, 붙여쓰기 고정 — 대문자·분리 금지)
- **핵심 감성**: 프리미엄 와인 라벨의 무게감. 어두운 밤, 와인 한 잔.
- **다크 모드**: 와인 정체성의 메인 모드. 딥 퍼플-블랙 배경 + Wine Red 강조.
- **라이트 모드**: 화이트 와인 컨셉. 크림-화이트 배경 + Gold 강조 (Wine Red 배제).

---

## 2. 색상 토큰

토큰은 CSS 커스텀 프로퍼티로 관리되며, `html[data-theme='light']` 셀렉터에서 라이트 값으로 덮어쓴다.  
Tailwind `@theme` 블록에는 다크 기본값만 정적 등록하고, 런타임 테마 전환은 CSS 변수가 담당한다.

### 2-1. Primary (테마 무관)

| 토큰 | 다크 | 라이트 | 용도 |
|------|------|------|------|
| `--color-wine-red` | `#8B1A2A` | `#B89438` | CTA, 강조, FAB (다크) / 라이트는 Gold로 통합 |
| `--color-wine-red-hover` | `#A02030` | `#9D7E2E` | hover 상태 |
| `--color-gold` | `#C9A84C` | `#B89438` | 장식선, 아이콘, 성공 상태, 라이트 메인 강조 |
| `--color-cream` | `#F5F0E8` | `#2A1A14` | **역할 분기** — 다크: 밝은 텍스트 / 라이트: 다크 브라운 텍스트 |

> **라이트 모드 핵심 원칙**: `--color-cream`이 텍스트 primary로 사용되는 컴포넌트 전반에서 라이트는 다크 와인 브라운(`#2A1A14`)으로 재정의돼 가독성을 확보한다. Gold 배경 chip의 글씨도 자연스럽게 contrast가 확보된다.

### 2-2. 배경 레이어

| 토큰 | 다크 | 라이트 | 용도 |
|------|------|------|------|
| `--color-bg-deepest` | `#251837` | `#FAF5EC` | 최하단 페이지 배경 |
| `--color-bg-deep` | `#2E1F3F` | `#F2EAD9` | 교차 섹션, 헤더 배경 |
| `--color-bg-map` | `#3A2440` | `#EDE2CC` | 지도 기본 배경, input bg |
| `--color-surface` | `#3D2A4A` | `#FFFFFF` | 카드, 모달, 시트 배경 |
| `--color-bg-sunken` | `rgba(0,0,0,0.28)` | `rgba(42,26,20,0.06)` | 카드 내부 잠긴 서브섹션 |

### 2-3. 텍스트

| 토큰 | 다크 | 라이트 | 용도 |
|------|------|------|------|
| `--color-text-primary` | `#F8F4ED` | `#2A1A14` | 주요 본문 텍스트 |
| `--color-text-secondary` | `#EBE0CB` | `#5A463C` | 보조 텍스트 |
| `--color-text-muted` | `#CABDA8` | `#8B7766` | 설명, 메타 텍스트 |
| `--color-text-disabled` | `#7E6E8E` | `#C0B0A0` | 비활성 상태 |

### 2-4. 보더

| 토큰 | 다크 | 라이트 | 용도 |
|------|------|------|------|
| `--color-border` / `--color-border-default` | `#5A3D6A` | `#E0D2BC` | 기본 구분선 |
| `--color-border-active` | `#A02030` | `#B89438` | 포커스·활성 보더 (라이트: Gold) |

### 2-5. Semantic

| 토큰 | 다크 | 라이트 | 용도 |
|------|------|------|------|
| `--color-error` | `#EF4444` | `#C92020` | 에러, 경고 |
| `--color-success` (Tailwind only) | `#22C55E` | — | 성공 상태 |

### 2-6. 그라데이션 & 특수 효과

| 토큰 | 다크 | 라이트 |
|------|------|------|
| `--gradient-page-bg` | `linear-gradient(135deg, #251837 0%, #2E1F3F 100%)` | `linear-gradient(135deg, #FAF5EC 0%, #F2EAD9 100%)` |
| `--gradient-bottom-nav` | `linear-gradient(to top, #251837 70%, rgba(37,24,55,0))` | `linear-gradient(to top, #FAF5EC 70%, rgba(250,245,236,0))` |
| `--gradient-fab` | `linear-gradient(135deg, #8B1A2A, #5b1424)` — Wine Red | `linear-gradient(135deg, #C9A84C, #A07F2E)` — Gold |
| `--shadow-fab` | `0 6px 20px rgba(139,26,42,0.45), inset 0 1px 0 rgba(255,255,255,0.12)` | `0 6px 20px rgba(184,148,56,0.32), inset 0 1px 0 rgba(255,255,255,0.18)` |

### 2-7. 지도

| 토큰 | 다크 | 라이트 |
|------|------|------|
| `--color-map-country` | `#3A2440` — 딥 퍼플 | `#C8B8D8` — 더스티 라벤더 |
| `--color-map-ocean` | `transparent` | `transparent` |
| `--color-bottle-shelf` | `#1a0a1e` | `#FFFFFF` |

### 2-8. Glass 오버레이 (지도 위 칩·줌·통계 패널)

| 토큰 | 다크 | 라이트 |
|------|------|------|
| `--color-glass-bg` | `rgba(10,5,15,0.72)` | `rgba(255,255,255,0.85)` |
| `--color-glass-bg-strong` | `rgba(15,7,24,0.92)` | `rgba(255,255,255,0.95)` |
| `--color-glass-border` | `rgba(255,255,255,0.15)` | `rgba(42,26,20,0.12)` |

---

## 3. 타이포그래피

### 폰트 패밀리

| 변수 | 폰트 | 로드 방식 | 용도 |
|------|------|----------|------|
| `var(--font-playfair)` | Playfair Display (Serif) | next/font Google | 로고, 제목, 모달 타이틀, 카드 제목, 빈 상태 |
| `var(--font-inter)` | Inter (Sans-Serif) | next/font Google | 본문, 버튼, 라벨, 메타 |
| Spoqa Han Sans Neo | Sans-Serif | jsDelivr CDN | 한글 본문 fallback (Inter가 Latin 커버 후 한글에만 동작) |

### 텍스트 스케일 (CSS 유틸 클래스)

| 클래스 | Font | Size | Weight | Color 토큰 | 용도 |
|--------|------|------|--------|-----------|------|
| `.wm-page-title` | Playfair | 24px | 400 | `--color-cream` | 페이지 대제목 |
| `.wm-card-title` | Playfair | 16px | 400 | `--color-cream` | 카드 제목 (1줄 truncate) |
| `.wm-back-title` | Inter | 16px | 600 | `--color-cream` | BackHeader 페이지명 |
| `.wm-modal-title` | Playfair | 22px | 400 | `--color-cream` | 모달 타이틀 |
| `.wm-modal-desc` | Inter | 14px | 400 | `--color-text-secondary` | 모달 설명 |
| `.wm-empty-title` | Playfair | 22px | 400 | `--color-cream` | 빈 상태 타이틀 |
| `.wm-empty-desc` | Inter | 14px | 400 | `--color-text-muted` | 빈 상태 설명 (max 280px) |
| `.wm-section-title` | Inter | 14px | 500 | `--color-text-muted` | 섹션 레이블 (uppercase, 0.04em) |
| `.wm-section-link` | Inter | 12px | 500 | `--color-gold` | 섹션 "더보기" 링크 |
| `.wm-card-meta` | Inter | 12px | 400 | `--color-text-muted` | 카드 메타 정보 |
| `.wm-card-body` | Inter | 13px | 400 | `--color-text-secondary` | 카드 본문 |
| `.wm-level-name` | Inter | 13px | 600 | `--color-cream` | 레벨 이름 |
| `.wm-glossary-term` | Playfair | 16px | 400 | `--color-cream` | 용어 사전 단어 |
| `.wm-glossary-def` | Inter | 13px | 400 | `--color-text-secondary` | 용어 사전 정의 |

### 로고 워드마크

```
fontFamily: Playfair Display
fontSize: 18px
letterSpacing: -0.01em
fontWeight: 500
color: var(--color-cream)
separator "·": color #C9A84C (Gold, 고정)
```

---

## 4. 스페이싱 & 레이아웃

### 기기 프레임 (DeviceFrame)

| 항목 | 값 |
|------|---|
| 외경 (데스크톱) | 414 × 868px |
| 내경 (콘텐츠 영역) | 390 × 844px |
| 외경 border-radius | 50px |
| 내경 border-radius | 38px |
| StatusBar 높이 | 54px |
| `.wm-route-outlet` inset | top 54px (StatusBar 아래) |

### 공통 패딩

| 패턴 | 값 |
|------|---|
| `.wm-content-pad` | `16px 20px` |
| BottomNav 패딩 | `8px 12px 28px` (Safe Area 포함) |
| BottomNav spacer | `height: 84px` (모바일 fixed 보정) |
| `.wm-scroll-area` padding-bottom | `96px` (BottomNav 83px + 여유 13px) |
| AppHeader 패딩 | `12px 20px 14px` |
| BackHeader 높이 | `56px`, padding `0 16px` |

### 반응형 분기

| 브레이크포인트 | 동작 |
|--------------|------|
| `< 768px` | DeviceFrame 투명, 콘텐츠 풀스크린, StatusBar·Island·Indicator 숨김, BottomNav position:fixed |
| `≥ 768px` | DeviceFrame 목업 프레임, StatusBar·Island·Indicator 노출, BottomNav position:absolute |
| `≥ 1024px` | DemoControls (좌측 패널, width 320px) 노출 |
| `≥ 1280px` | FeatureFlagPanel (우측 패널, width 320px) 노출 |

### z-index 레이어

| 값 | 요소 |
|----|------|
| 20 | StatusBar |
| 25 | BottomNav |
| 30 | 사이드 패널 (DemoControls, FeatureFlagPanel) |
| 40 | BottomSheet backdrop |
| 41 | BottomSheet sheet |
| 50 | Modal |

---

## 5. 컴포넌트 패턴

### 5-1. PrimaryButton

4가지 variant, 3가지 size. 모두 `border-radius: 12px`, `font-weight: 600`.

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

### 5-2. BottomNav

- 높이: `padding 8px 12px 28px`
- 배경: `var(--gradient-bottom-nav)` (fade)
- 구분선: `0.5px solid var(--color-border-default)`
- 탭 아이콘: 22px monoline SVG, `strokeWidth: 1.6`
- 탭 레이블: 10px Inter, 활성 600 / 비활성 400
- 활성 색: **`#C9A84C` (Gold 고정)** — 테마에 관계없이 Gold
- 비활성 색: `var(--color-text-muted)`

**중앙 FAB (카메라)**:
- 52 × 52px, `border-radius: 999`
- 다크: `var(--gradient-fab)` (Wine Red), 라이트: `var(--gradient-fab)` (Gold)
- 테두리: `1px solid var(--color-gold)`
- 그림자: `var(--shadow-fab)`
- `marginTop: -24px` (상단 돌출)

### 5-3. AppHeader

- 패딩: `12px 20px 14px`
- 배경: `var(--color-bg-deep)`
- 구분선: `0.5px solid var(--color-border-default)`
- 좌측: WMLogoMark (26px 와인잔 SVG) + 워드마크 18px
- 우측: Bell 버튼 36px + LevelChip(heavy) 또는 아바타 원형 36px

**LevelChip**: height 32px, `background: --color-surface`, `border: 1px solid --color-border-default`, `border-radius: 999`.

**Bell 알림 뱃지**: Wine Red 원형 (`#8B1A2A` fill), 벨 SVG 우상단 `cx=18 cy=6 r=2.5`.

### 5-4. BackHeader

- 높이: 56px, padding `0 16px`
- 좌측: ChevronLeft 24px + 페이지 타이틀 (`.wm-back-title`)
- 우측: 컨텍스트 액션 슬롯 (Share2, MoreHorizontal 등)

### 5-5. BottomSheet

- `background: var(--color-surface)`
- `borderTopLeftRadius: 24px`, `borderTopRightRadius: 24px`
- `padding: 12px 16px 24px`
- Drag handle: 36×4px, `background: var(--color-gold)`, `border-radius: 2px`
- `boxShadow: 0 -10px 30px rgba(0,0,0,0.5)`
- Backdrop: `rgba(0,0,0,0.6)`

### 5-6. Modal

- `background: var(--color-surface)`
- `border-radius: 16px`, `padding: 24px`
- `border: 1px solid var(--color-border-default)`
- `boxShadow: 0 25px 80px rgba(0,0,0,0.8)`
- `maxWidth: 320px`
- Backdrop: `rgba(0,0,0,0.7)`
- 닫기 버튼: X 20px, `color: --color-text-muted`

### 5-7. EmptyState

- illustration: `color: --color-gold`, `opacity: 0.7`
- 타이틀: `.wm-empty-title` (Playfair 22px)
- 설명: `.wm-empty-desc` (Inter 14px, max-width 280px)

### 5-8. LevelPill (인라인 레벨 뱃지)

| Level | Background | Text |
|-------|-----------|------|
| L1 Cream | `#F5F0E8` | `#05020A` |
| L2 Silver | `#D4B85C` | `#05020A` |
| L3 Gold | `#C9A84C` | `#05020A` |
| L4 Wine Red | `#8B1A2A` | `#F5F0E8` |
| L5 Platinum | `linear-gradient(135deg, #C9A84C, #F5F0E8)` | `#05020A` |

- size `sm`: `2px 8px`, 10px / size `md`: `4px 10px`, 11px
- `border-radius: 12px`, `font-weight: 600`

### 5-9. LevelProgressBar

- 게이지 높이: 6px, `background: --color-border-default`, `border-radius: 3px`
- 채움: `linear-gradient(90deg, --color-gold, --color-cream)`, `boxShadow: 0 0 12px rgba(201,168,76,0.5)`
- 레벨 원형 뱃지: 24×24px, `border-radius: 12px`, 해당 레벨 color

### 5-10. ToggleRow (설정 항목)

- `background: var(--color-surface)`, `border: 1px solid --color-border-default`
- `border-radius: 12px`, `padding: 14px 16px`
- 레이블: Inter 14px, `color: --color-cream`
- 설명: Inter 11px, `color: --color-text-muted`
- 토글: 44×26px, 활성 `--color-gold` / 비활성 `--color-border-default`
- Thumb: 20×20px, `background: --color-cream`

### 5-11. WSETSlider (테이스팅 노트)

- 5단계: `low / mediumMinus / medium / mediumPlus / high`
- 활성 도트: Gold 채움 + `box-shadow: 0 0 0 4px rgba(201,168,76,0.18), 0 0 12px rgba(201,168,76,0.45)`
- 현재 도트: 18px, 나머지: 12px
- 연결선: 2px, 활성 Gold / 비활성 `--color-border`
- 현재 값 라벨: 12px Gold 오른쪽 정렬

### 5-12. 카드 패턴

| 속성 | 값 |
|------|---|
| background | `var(--color-surface)` |
| border | `1px solid var(--color-border-default)` |
| border-radius | 12~16px (컨텍스트별) |
| 내부 잠긴 영역 | `background: var(--color-bg-sunken)` |
| 카드 제목 | `.wm-card-title` (Playfair 16px, 1줄 truncate) |
| 카드 메타 | `.wm-card-meta` (Inter 12px muted) |

---

## 6. 아이콘 시스템

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

**기본 strokeWidth**: 1.75 (BackHeader ChevronLeft, Modal X)

---

## 7. 모션 & 애니메이션

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

## 8. 포커스 & 접근성

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

## 9. 테마 전환 메커니즘

| 단계 | 방법 |
|------|------|
| 저장소 | `localStorage.getItem('winemine.theme')` → `'light'` 또는 `'dark'` |
| FOUC 방지 | `<head>` inline script — DOMContentLoaded 이전에 `html[data-theme]` 적용 |
| 런타임 전환 | `html[data-theme='light']` → CSS 변수 오버라이드 (`styles/tokens.css`) |
| 기본값 | dark |

```js
// FOUC 방지 bootstrap (layout.tsx에서 inline script로 주입)
(function(){
  try {
    var t = localStorage.getItem('winemine.theme');
    document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
```

---

## 10. 스크롤 & 오버플로

```css
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }
```

모든 스크롤바 숨김. 가로 스크롤 캐러셀 포함.

`.wm-scroll-area`: `overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 96px`

---

## 11. 데스크톱 사이드 패널

| 패널 | 클래스 | 브레이크포인트 | 위치 | 색상 |
|------|--------|--------------|------|------|
| DemoControls | `.wm-side-panel-left` | `≥ 1024px` | fixed, 좌측 | `rgba(15,7,24,0.95)`, border `--color-border-default` |
| FeatureFlagPanel | `.wm-side-panel-right` | `≥ 1280px` | fixed, 우측 | 동일 |

공통: `width 320px`, `border-radius 16px`, `padding 16px`, `boxShadow 0 24px 64px rgba(0,0,0,0.5)`.

Feature-status dropped: `opacity: 0.25; filter: grayscale(1); pointer-events: none`

---

## 12. 라우트별 네비게이션 가시성

| 라우트 prefix | BottomNav |
|--------------|-----------|
| `/` | 표시 (home 활성) |
| `/map` | 표시 (map 활성) |
| `/cellar` | 표시 (cellar 활성) |
| `/community` | 표시 (community 활성) |
| `/onboarding` | **숨김** |
| `/capture` | **숨김** |
| `/notes/new` | **숨김** |
| 그 외 | 표시 (탭 비활성) |

---

## 13. 금지 사항 체크리스트

- [ ] UI 요소에 Emoji 사용 (`🍷 🍓 ✦` 등) — variation selector U+FE0F 포함
- [ ] `winemine` 대문자 사용 또는 분리 표기
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 등 시크릿을 `NEXT_PUBLIC_` 접두사로 노출
- [ ] 테마 미적용 하드코딩 색상 (CSS 변수 대신 hex 직접 사용)
- [ ] Emoji 를 mock 데이터나 JSON 값에 포함

---

*최종 업데이트: 2026-05-14*
