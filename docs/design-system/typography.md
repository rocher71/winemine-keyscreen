# winemine — Typography

> 폰트 패밀리 로드: `src/app/layout.tsx` (`next/font/google`) + `<head>` Spoqa Han Sans Neo `<link>`.
> CSS 유틸 클래스: `src/app/globals.css`.

---

## 1. 폰트 패밀리

| 변수 | 폰트 | 로드 방식 | 용도 |
|------|------|----------|------|
| `var(--font-playfair)` | Playfair Display (Serif) | `next/font/google` (Latin subset) | 로고, 페이지·카드·모달 타이틀, 빈 상태 |
| `var(--font-inter)` | Inter (Sans-Serif) | `next/font/google` (Latin subset) | 본문, 버튼, 라벨, 메타 |
| Spoqa Han Sans Neo | Sans-Serif | jsDelivr CDN `<link>` | 한글 본문 fallback (Inter가 Latin 커버 후 한글에만 동작) |

```ts
// src/app/layout.tsx
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter    = Inter({ subsets: ['latin'], variable: '--font-inter' });
```

```html
<!-- 한글 전용 fallback -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@latest/css/SpoqaHanSansNeo.css"
/>
```

`body`의 `font-family` 스택:

```css
font-family: var(--font-inter), 'Spoqa Han Sans Neo', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
```

Inter가 Latin 자형을 모두 커버하므로 Spoqa는 한글 글리프에만 작동한다.

---

## 2. 텍스트 스케일 (CSS 유틸 클래스)

전부 `src/app/globals.css`에 정의돼 있다. 모든 height·줄 간격·색상 토큰을 한 묶음으로 관리.

| 클래스 | Font | Size | Weight | line-height | Color 토큰 | 용도 |
|--------|------|------|--------|-------------|-----------|------|
| `.wm-page-title` | Playfair | 24px | 400 | 1.2 (letter-spacing -0.01em) | `--color-cream` | 페이지 대제목 |
| `.wm-card-title` | Playfair | 16px | 400 | 1.3 | `--color-cream` | 카드 제목 (1줄 truncate) |
| `.wm-back-title` | Inter | 16px | 600 | 1.2 | `--color-cream` | BackHeader 페이지명 |
| `.wm-modal-title` | Playfair | 22px | 400 | 1.2 | `--color-cream` | 모달 타이틀 |
| `.wm-modal-desc` | Inter | 14px | 400 | 1.5 | `--color-text-secondary` | 모달 설명 |
| `.wm-empty-title` | Playfair | 22px | 400 | 1.3 | `--color-cream` | 빈 상태 타이틀 |
| `.wm-empty-desc` | Inter | 14px | 400 | 1.6 | `--color-text-muted` | 빈 상태 설명 (max 280px) |
| `.wm-section-title` | Inter | 14px | 500 | 1 (uppercase, letter-spacing 0.04em) | `--color-text-muted` | 섹션 레이블 |
| `.wm-section-link` | Inter | 12px | 500 | 1 | `--color-gold` | 섹션 "더보기" 링크 |
| `.wm-card-meta` | Inter | 12px | 400 | 1.2 | `--color-text-muted` | 카드 메타 정보 |
| `.wm-card-body` | Inter | 13px | 400 | 1.5 | `--color-text-secondary` | 카드 본문 |
| `.wm-level-name` | Inter | 13px | 600 | 1.2 | `--color-cream` | 레벨 이름 |
| `.wm-glossary-term` | Playfair | 16px | 400 | — | `--color-cream` | 용어 사전 단어 |
| `.wm-glossary-def` | Inter | 13px | 400 | 1.5 | `--color-text-secondary` | 용어 사전 정의 |

---

## 3. 인라인 스타일에서 자주 쓰이는 텍스트 패턴

CSS 유틸 클래스로 빠지지 않은 케이스. 컴포넌트별 인라인 스타일이 진실 소스.

| 위치 | Font | Size | Weight | letter-spacing |
|------|------|------|--------|----------------|
| 로고 워드마크 (`WMLogoMark` 옆) | Playfair Display | 18px | 500 | -0.01em |
| BottomNav 탭 라벨 | Inter | 10px | 600 (active) / 400 (idle) | 0.02em |
| PrimaryButton sm | Inter | 13px | 600 | -0.01em |
| PrimaryButton md | Inter | 14px | 600 | -0.01em |
| PrimaryButton lg | Inter | 15px | 600 | -0.01em |
| LevelPill sm | Inter | 10px | 600 | — |
| LevelPill md | Inter | 11px | 600 | — |
| PostTypeBadge | Inter (inherits) | 10px | 600 | 0.04em |
| ToggleRow 레이블 | Inter | 14px | 500 | — |
| ToggleRow 설명 | Inter | 11px | 400 | — (line-height 1.4) |

---

## 4. 로고 규칙

- 항상 **소문자 `winemine`** (대문자 사용 또는 분리 표기 금지)
- 워드마크 옆에는 와인잔 SVG (`WMLogoMark`, 26px)와 함께 사용
- 워드마크 사이 separator로 들어가는 `·`는 **Gold (`#C9A84C`) 고정** — 테마 무관

```
fontFamily: Playfair Display
fontSize: 18px
letterSpacing: -0.01em
fontWeight: 500
color: var(--color-cream)
separator "·": color #C9A84C (Gold, 고정)
```

---

## 5. 가독성·접근성 기본값

`body`에 적용된 글로벌 텍스트 설정 (`styles/tokens.css`):

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
word-break: keep-all;            /* 한글 어절 단위 줄바꿈 */
```

`word-break: keep-all`은 한글 텍스트가 단어 중간에서 끊기지 않게 한다. 영문 긴 토큰은 자연스럽게 wrap된다.

---

## 6. 폰트 사용 시 금지 사항

- 시스템 emoji 또는 dingbat 사용 — 모든 아이콘은 lucide-react 또는 인라인 monoline SVG ([components.md](./components.md) 참조)
- Playfair Display를 본문에 사용하지 말 것 — 16px 이하의 본문 가독성이 떨어진다. 본문은 항상 Inter.
- Inter를 페이지 대제목에 사용하지 말 것 — 브랜드 톤(Playfair)이 깨진다. BackHeader 페이지명만 예외(16px Inter 600).
- 한글 컨텐츠에 letter-spacing > 0.02em — 한글 자형이 어색해진다. 영문 uppercase 레이블에만 0.04em 허용.
