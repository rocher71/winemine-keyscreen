# winemine — Design System

> 랜딩 페이지 빌드(`Phase 1`)에서 검증된 디자인 시스템.
> 색상, 타이포, 간격, 애니메이션은 앱 프로토타입에 그대로 가져와 일관성을 유지한다.

---

## 디자인 철학

어두운 밤, 와인 한 잔. 프리미엄 와인 라벨의 무게감과 우아함. 깊은 버건디와 골드, 크림으로 구성된 팔레트. 과한 장식 없이 타이포그래피와 여백으로 고급스러움을 표현한다.

---

## 색상 팔레트

### Primary
| 토큰 | HEX | 용도 |
|------|-----|------|
| Wine Red | `#8B1A2A` | CTA 버튼, 와인 국가 fill, active 강조 |
| Wine Red Hover | `#A02030` | 버튼 hover |
| Gold | `#C9A84C` | 장식선, 아이콘, 성공 상태 |
| Cream | `#F5F0E8` | 제목, 주요 텍스트 |

### Background
| 토큰 | HEX | 용도 |
|------|-----|------|
| Deepest Dark | `#05020A` | 주 배경 |
| Deep Dark | `#0A050F` | 교차 섹션 배경 |
| Map Dark | `#1A0A1E` | 지도 기본 국가, input bg |
| Surface | `#0F0718` | 모달/카드 배경 |
| Footer | `#030106` | 최하단 |

### Text
| 토큰 | HEX | 용도 |
|------|-----|------|
| Primary | `#F5F0E8` | 로고, 섹션 제목 |
| Secondary | `#D4C5B0` | 메인 태그라인 |
| Muted | `#9B8B7A` | 본문 설명, 부제 |
| Disabled | `#4A3D56` | placeholder, 비활성 |

### Semantic
| 토큰 | HEX | 용도 |
|------|-----|------|
| Error | `#EF4444` | 에러 메시지, 에러 border |
| Border Default | `#2D1540` | |
| Border Active | `#8B1A2A` | focus, hover, active 탭 |

---

## 타이포그래피

### Font Families
- **Display**: `"Playfair Display", Georgia, serif`
  - 용도: 로고, 모든 섹션 제목, 모달 제목, step 번호
- **Body**: `"Inter", -apple-system, BlinkMacSystemFont, sans-serif`
  - 용도: 본문, 버튼, 입력 필드, 캡션
- **Korean Fallback**: `"Noto Sans KR"` — 한글 글리프 자동 fallback

### Font Sizes
| 요소 | Desktop | Mobile | Weight |
|------|---------|--------|--------|
| Logo | 72px | 48px | 400 (letter-spacing: -0.02em) |
| Section Title | 40px | 28px | 400 |
| Final CTA Title | 48px | 32px | 400 |
| Modal Title | 32px | — | 400 |
| Feature Card Title | 24px | — | 400 |
| Step Title | 20px | — | 600 |
| Body | 15px | — | 400 (line-height 1.7) |
| Small | 13px | — | 400 |
| Caption | 11–12px | — | 400 |
| CTA Button | 16px | — | 600 |
| Step Number (Display) | 64px | — | 400 (color: #2D1540, 장식용) |

---

## 간격 (Spacing)

- Base unit: **4px**
- Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120`
- Section padding: `120px` (desktop) / `80px` (mobile) top·bottom
- Max content width: `1100px` (와이드), `900px` (좁게), `480px` (모달)
- Page horizontal padding: `24px` (mobile/tablet)

---

## Borders & Shadows

### Borders
- Default: `1px solid #2D1540`
- Active/Focus/Hover accent: `1px solid #8B1A2A`
- Card separator: `2px solid #2D1540` → hover `#8B1A2A`

### Shadows
- Modal: `0 25px 80px rgba(0,0,0,0.8)`
- CTA Button hover glow: `0 0 20px rgba(139,26,42,0.4)`

---

## 애니메이션 (Framer Motion 기준)

### Page Load
- 로고+태그라인: `opacity 0→1, translateY 20px→0, 600ms ease-out, delay 300ms`
- CTA: `opacity 0→1, translateY 20px→0, 400ms ease-out, delay 700ms`

### Scroll Reveal
- `whileInView`: `opacity 0→1, translateY 30px→0, 500ms ease-out`
- Stagger: `0.15s` per item
- `once: true`

### Modal
- 열기: backdrop `opacity 0→1` 200ms ease-out, modal `scale 0.95→1.0 + opacity 0→1` 250ms ease-out
- 닫기: 위 역순 150ms ease-in

### Reduced Motion
- `prefers-reduced-motion` 존중 — `useReducedMotion()`으로 분기

---

## 반응형 Breakpoints

| 이름 | 범위 |
|------|------|
| Mobile | 0–767px |
| Tablet | 768–1023px |
| Desktop | 1024px+ |

### Mobile 적응 패턴
- 다중 열 → 1열 세로 스택
- 연결 화살표/장식 요소 제거
- 모달 → bottom sheet (slide-up, top-only border-radius 16px)
- Hover 상태 → tap으로 토글
- 최소 tap target: 44×44px

---

## 아이콘

Lucide React (`lucide-react@^0.475`)
- 지구/지도: `Globe2`
- 카메라/스캔: `Camera`
- 공유: `Share2`
- 성공: `CheckCircle2`
- 로딩: `Loader2` (animate-spin)
- 닫기: `X`
- 스크롤 인디케이터: `ChevronDown`

---

## 접근성

- 모달: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Focus trap, Escape 키로 닫기, body scroll lock
- 색상 대비: WCAG AA (4.5:1) 이상
- 지도: `role="img"`, `aria-label` 제공
