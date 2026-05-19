# winemine — Colors

> 색상 토큰 정의: `styles/tokens.css` · Tailwind 등록: `src/app/globals.css` (`@theme` 블록).
> 런타임 테마 전환은 `:root[data-theme='light']`의 CSS 변수 오버라이드가 담당하고, Tailwind 클래스는 다크 기본값만 빌드 시 정적 평가된다.

---

## 1. 코어 브랜드 색상

테마 변수로 추상화돼 있지만 실제 코드에서 hex로도 직접 자주 쓰이는 핵심 색상.

| 색상 | Hex | 주요 용도 |
|------|-----|---------|
| **Gold** | `#C9A84C` | BottomNav 활성 탭(테마 무관 고정), WSETSlider 활성 도트, drag handle, 진행바, 맵 Today 도트, 외부 평점 뱃지 |
| **Wine Red** | `#8B1A2A` | CTA 버튼, 다크 FAB, 방문 국가 fill, Bell 알림 dot, 아바타 배경 |
| **Cream** | `#F5F0E8` | LevelPill 텍스트·배경(하드코딩), 라벨 아트, 다크 텍스트 보조 |
| **Cream (Tailwind 등록)** | `#F8F4ED` | `@theme --color-cream` — `src/app/globals.css`의 Tailwind 빌드 토큰 |
| **Deepest Dark** | `#05020A` | `viewport.themeColor` 메타, LevelPill 텍스트 대비, 와인 그라데이션 끝점 일부 |
| **Wine Red Deep** | `#5b1424` | FAB 그라데이션 끝점, Château Margaux 등 bottleColor |
| **Wine Red Hover** | `#A02030` | hover 상태, L5 마스터 `level.color` |

> **Cream 이중값 주의** — `styles/tokens.css`의 `--color-cream`은 `#F5F0E8`인데 Tailwind 빌드용 `@theme`은 `#F8F4ED`로 등록돼 있다. 두 값 모두 거의 같은 크림이지만, 정확한 텍스트 primary는 `--color-text-primary` (`#F8F4ED`)로 사용하는 것이 권장.

---

## 2. CSS 변수 토큰 — 다크 / 라이트 대조표

### 2-1. Primary

| 토큰 | 다크 | 라이트 | 용도 |
|------|------|--------|------|
| `--color-wine-red` | `#8B1A2A` | `#B89438` | CTA, 강조. 라이트는 Gold로 통합 |
| `--color-wine-red-hover` | `#A02030` | `#9D7E2E` | hover 상태 |
| `--color-gold` | `#C9A84C` | `#B89438` | 장식선, 아이콘, 성공 상태, 라이트 메인 강조 |
| `--color-cream` | `#F5F0E8` | `#2A1A14` | 역할 분기 — 다크: 밝은 텍스트 / 라이트: 다크 브라운 텍스트 |

> `--color-cream`은 텍스트 primary로 쓰이는 컴포넌트가 많아 라이트에서는 다크 와인 브라운(`#2A1A14`)으로 재정의돼 가독성을 확보한다.

### 2-2. 배경 레이어

| 토큰 | 다크 | 라이트 | 용도 |
|------|------|--------|------|
| `--color-bg-deepest` | `#251837` | `#FAF5EC` | 최하단 페이지 배경 |
| `--color-bg-deep` | `#2E1F3F` | `#F2EAD9` | 교차 섹션, AppHeader 배경 |
| `--color-bg-map` | `#3A2440` | `#EDE2CC` | 지도 기본 배경, input bg |
| `--color-surface` / `--color-bg-surface` | `#3D2A4A` | `#FFFFFF` | 카드, 모달, BottomSheet 배경 |
| `--color-bg-sunken` | `rgba(0,0,0,0.28)` | `rgba(42,26,20,0.06)` | 카드 내부 잠긴 서브섹션 |

### 2-3. 텍스트

| 토큰 | 다크 | 라이트 | 용도 |
|------|------|--------|------|
| `--color-text-primary` | `#F8F4ED` | `#2A1A14` | 주요 본문 |
| `--color-text-secondary` | `#EBE0CB` | `#5A463C` | 보조 텍스트 |
| `--color-text-muted` | `#CABDA8` | `#8B7766` | 설명, 메타 |
| `--color-text-disabled` | `#7E6E8E` | `#C0B0A0` | 비활성 |

### 2-4. 보더

| 토큰 | 다크 | 라이트 | 용도 |
|------|------|--------|------|
| `--color-border` / `--color-border-default` | `#5A3D6A` | `#E0D2BC` | 기본 구분선 |
| `--color-border-active` | `#A02030` | `#B89438` | 포커스·활성 보더 (라이트: Gold) |

### 2-5. Semantic

| 토큰 | 다크 | 라이트 | 용도 |
|------|------|--------|------|
| `--color-error` | `#EF4444` | `#C92020` | 에러, 경고 |
| `--color-success` (Tailwind only) | `#22C55E` | — | 성공 상태 (다크 기본값만 `@theme`에 등록) |
| `--color-gold-soft` (Tailwind only) | `#D4B85C` | — | L2 LevelPill 배경 (다크 기본값만 `@theme`에 등록) |

### 2-6. 그라데이션 & 특수 효과 토큰

| 토큰 | 다크 | 라이트 |
|------|------|--------|
| `--gradient-page-bg` | `linear-gradient(135deg, #251837 0%, #2E1F3F 100%)` | `linear-gradient(135deg, #FAF5EC 0%, #F2EAD9 100%)` |
| `--gradient-bottom-nav` | `linear-gradient(to top, #251837 70%, rgba(37,24,55,0))` | `linear-gradient(to top, #FAF5EC 70%, rgba(250,245,236,0))` |
| `--gradient-fab` | `linear-gradient(135deg, #8B1A2A, #5b1424)` | `linear-gradient(135deg, #C9A84C, #A07F2E)` |
| `--shadow-fab` | `0 6px 20px rgba(139,26,42,0.45), inset 0 1px 0 rgba(255,255,255,0.12)` | `0 6px 20px rgba(184,148,56,0.32), inset 0 1px 0 rgba(255,255,255,0.18)` |

### 2-7. 지도

| 토큰 | 다크 | 라이트 |
|------|------|--------|
| `--color-map-country` | `#3A2440` | `#DDD0BB` — 양피지 톤 |
| `--color-map-ocean` | `#100720` | `#C8D6E4` — 라이트 블루 바다 |
| `--color-map-stroke` | `rgba(245,240,232,0.18)` | `rgba(160,140,110,0.40)` |
| `--color-bottle-shelf` | `#1a0a1e` | `#FFFFFF` |

> Antarctica는 코드에서 `stroke: transparent`로 강제(소스: `src/components/map/full-world-map.tsx`).

### 2-8. Backward-compat aliases

`tokens.css`에 별칭으로 남아 있는 토큰. 신규 코드에서는 사용 금지, 기존 fallback 용도.

| 토큰 | 다크 | 라이트 | 매핑 대상 |
|------|------|--------|----------|
| `--color-deepest-dark` | `#251837` | `#FAF5EC` | `--color-bg-deepest` |
| `--color-deep-dark` | `#2E1F3F` | `#F2EAD9` | `--color-bg-deep` |
| `--color-map-dark` | `#3A2440` | `#EDE2CC` | `--color-bg-map` |
| `--color-secondary` | `#EBE0CB` | `#5A463C` | `--color-text-secondary` |

### 2-9. Glass 오버레이 (지도 위 칩·줌·통계 패널)

| 토큰 | 다크 | 라이트 |
|------|------|--------|
| `--color-glass-bg` | `rgba(10,5,15,0.72)` | `rgba(255,255,255,0.85)` |
| `--color-glass-bg-strong` | `rgba(15,7,24,0.92)` | `rgba(255,255,255,0.95)` |
| `--color-glass-border` | `rgba(255,255,255,0.15)` | `rgba(42,26,20,0.12)` |

---

## 3. 레벨 시스템 색상

소스: `src/lib/mock/levels.ts`, `src/components/shared/level-pill.tsx`, `src/components/nav/app-header.tsx`

| 레벨 | 이름 | XP 범위 | `level.color` | LevelPill 배경 | LevelPill 텍스트 |
|------|------|---------|--------------|---------------|------------------|
| L1 Novice 입문자 | `0–99` | `#9B8B7A` | `#F5F0E8` Cream | `#05020A` |
| L2 Enthusiast 애호가 | `100–499` | `#C9A84C` Gold | `#D4B85C` Gold Soft | `#05020A` |
| L3 Connoisseur 감식가 | `500–1499` | `#C9A84C` Gold | `#C9A84C` Gold | `#05020A` |
| L4 Sommelier 소믈리에 | `1500–3999` | `#8B1A2A` Wine Red | `#8B1A2A` | `#F5F0E8` |
| L5 Master 마스터 | `4000+` | `#A02030` | `linear-gradient(135deg, #C9A84C, #F5F0E8)` | `#05020A` |

**AppHeader LevelChip** (레벨별 아바타 원형) — soft tint `linear-gradient(135deg, ${color}, ${color}99)` 패턴 적용. 기준 색은 위 `level.color`와 동일.

**커뮤니티 아바타 그라데이션** (`src/components/community/comm-user-avatar.tsx`):

```
L1: linear-gradient(135deg, #555560, #2a2a35)   — 무채색 다크
L2: linear-gradient(135deg, #4a6fa5, #1a2a45)   — 스틸 블루
L3: linear-gradient(135deg, #b8b8c0, #3a3a48)   — 실버
L4: linear-gradient(135deg, #C9A84C, #0F0718)   — Gold → 딥 다크
L5: linear-gradient(135deg, #8B1A2A, #3a0810)   — Wine Red → 딥 레드
```

---

## 4. 뱃지 & 외부 평점 색상

**ReviewBadge 티어** (`src/components/shared/review-badge.tsx`):

| 티어 | 색상 |
|------|------|
| Bronze | `#B87333` |
| Silver | `#C0C0C0` |
| Gold | `#C9A84C` |
| Platinum | `#E5E4E2` |

**ProfileHero / UserMapHero / Badges 페이지 아바타 그라데이션**:

```
L1–L3: linear-gradient(135deg, #C9A84C 0%, #F5F0E8 100%)   — Platinum 톤
L4:    #A77044   — Warm Bronze
L5:    linear-gradient(135deg, #C9A84C 0%, #F5F0E8 100%)   — 동일 Platinum
```

---

## 5. 커뮤니티 포스트 타입 색상

소스: `src/components/community/post-type-badge.tsx`

| 타입 | 색상 | 용도 |
|------|------|------|
| 시음 노트 (`note`) | `#C9A84C` Gold | 뱃지, 칩 |
| 질문 (`question`) | `#a08ee0` Soft Purple | 뱃지, Bookmark 반응 아이콘 |
| 칼럼 (`column`) | `#F5F0E8` Cream | 뱃지 |
| 소식 (`news`) | `#5b9ce6` Steel Blue | 뱃지 |
| 사진 앨범 (`album`) | `#e8b4d2` Rose Pink | 뱃지 |

> 각 타입 칩의 배경은 `color + '1a'` (10% opacity), 테두리는 `color + '55'` (33% opacity).

---

## 6. 와인 병 색상 팔레트 (`bottleColor`)

소스: `src/lib/mock/wines.ts` — 각 와인 오브젝트의 `bottleColor` 필드.
카드·히어로·갤러리에서 `linear-gradient(160deg, bottleColor 0%, #1a0a1e 70~80%)` 형태로 사용.

### 6-1. 레드 와인 계열 (딥 레드–버건디)

| 색상 | Hex | 대표 와인 |
|------|-----|---------|
| 딥 버건디 | `#5b1424` | Château Margaux 2018 |
| 딥 클라렛 | `#3f0f1f` | Pétrus 2015 |
| 다크 퍼플레드 | `#4a1226` | Romanée-Conti 2017 |
| 미드 클라렛 | `#56132a` | Opus One 2019 |
| 미드 버건디 | `#5a1429` | Sassicaia 2018 |
| 미드 로제 레드 | `#7a1f33` | Barolo Cannubi 2016, Vega Sicilia |
| 다크 로제 | `#6d1c2e` | Ornellaia 2018 |
| 라이트 버건디 | `#8d2238` | Brunello di Montalcino 2016 |
| 퍼플 다크 | `#671c2f` | Châteauneuf-du-Pape |
| 딥 플럼 | `#80213b` | Penfolds Grange 2018 |
| 미드 플럼 | `#6e1c33` | Caymus Special Selection 2020 |
| 딥 와인 | `#4a1027` | Screaming Eagle 2019 |
| 딥 루비 | `#791f2e` | Cos d'Estournel 2018 |
| 딥 레드 | `#7c1a2a` | Gevrey-Chambertin |
| 다크 레드 | `#3a1418` | Hermitage La Chapelle 2017 |
| 딥 레드 다크 | `#7d1c2b` | Ridge Monte Bello 2019 |

### 6-2. 화이트 / 로제 와인 계열 (골드–앰버)

| 색상 | Hex | 대표 와인 |
|------|-----|---------|
| 페일 골드 | `#d9c277` | Montrachet 2019 |
| 브라이트 골드 | `#e5c97a` | Puligny-Montrachet |
| 미드 골드 | `#c9b97a` | Château d'Yquem 2015 |
| 딥 골드 | `#caa84e` | Krug Grande Cuvée |
| 브론즈 골드 | `#b9923f` | Dom Pérignon 2012 |
| 라이트 골드 | `#d6c069` | Meursault Perrières |
| 앰버 골드 | `#b8983f` | Riesling Trockenbeerenauslese |
| 로제 핑크 | `#e8a5a0` | Whispering Angel Rosé |
| 미드 앰버 | `#d8b53f` | Viña Tondonia Reserva Blanco |
| 라이트 앰버 | `#e2c476` | Grüner Veltliner Smaragd |
| 페일 앰버 | `#cdba6e` | Albariño Rías Baixas |
| 골드 그린 | `#c9b86a` | Condrieu |
| 딥 앰버 | `#e1c876` | Gewürztraminer Alsace |

### 6-3. 기준 블렌드 포인트 (그라데이션 끝점)

| 용도 | 색상 | 적용처 |
|------|------|--------|
| 병 히어로 하단 (대부분) | `#1a0a1e` | 카드·노트·갤러리 병 그라데이션, `--color-bottle-shelf` 다크값 |
| 캡처 씬 하단 | `#1a0a0e` | `/capture` 라벨 스캔 배경 |
| 더 어두운 끝 | `#0e0608` | 캡처 라벨 아트 cap 아래 |

---

## 7. 컴포넌트별 하드코딩 색상 레퍼런스

### 7-1. 다크 딥 배경 계열 (SVG·그라데이션 안에서 자주 쓰임)

| Hex | 용도 |
|-----|------|
| `#1A0A1E` | `--color-bottle-shelf` alias, 맵 배경, 커뮤니티 Tonight 맵 도트 글로우 중심 |
| `#0F0718` | DeviceFrame inner 배경 (Tailwind theme 등록), L4 아바타 그라데이션 끝 |
| `#1F1428` | DeviceFrame `inset 0 0 0 2px` 외곽 베젤 내측 라인 (`src/app/globals.css`) |
| `#1B1126` | 온보딩 씬 일부 딥 배경 |
| `#2D1540` | Recap 모달 그라데이션 시작점, Tonight 맵 국경선 |

### 7-2. 커뮤니티 Tonight 지도 SVG

```
배경 그라데이션: #2a141c → #0a050f
국경선: #2D1540
지역 도트: #C9A84C (Gold, opacity 0.18 글로우 + 100% 핵심)
지역명 텍스트: #9B8B7A
도트 중심 텍스트: #05020A / #F5F0E8
```

### 7-3. Recap 모달 (`recap-modal.tsx`)

```
배경: linear-gradient(160deg, #2D1540 0%, #5b1424 40%, #8B1A2A 75%, #1A0A1E 100%)
해치 패턴: rgba(245,240,232,0.6) @ 45deg
오버레이: linear-gradient(180deg, rgba(15,7,24,0.6), rgba(45,21,64,0.2))
```

### 7-4. 셀러 상세 드링킹 윈도우 바 (`cellar/[id]/page.tsx`)

```
linear-gradient(90deg,
  rgba(155,139,122,0.3) 0%,
  var(--color-gold) 45%,
  var(--color-wine-red) 50%,
  var(--color-gold) 55%,
  rgba(155,139,122,0.3) 100%
)
```

### 7-5. 전문가 노트 Blind Mode 배경

```
linear-gradient(180deg, #5A1A24 0%, #2D0D12 100%)
```

---

## 8. Shadow 레퍼런스

| 용도 | 값 |
|------|---|
| Modal | `0 25px 80px rgba(0,0,0,0.8)` |
| BottomSheet | `0 -10px 30px rgba(0,0,0,0.5)` |
| 카드 호버 / 포커스 | `0 8px 22px rgba(0,0,0,0.5~0.6)` |
| Gold 글로우 (활성 슬라이더) | `0 0 12px rgba(201,168,76,0.5)` |
| Gold 글로우 (진행바) | `0 0 12px rgba(201,168,76,0.5)` |
| Gold 글로우 (약한) | `0 0 24px rgba(201,168,76,0.10)` |
| Wine Red 글로우 (카드) | `0 4px 12px rgba(139,26,42,0.35)` |
| Wine Red 링 (포커스) | `0 0 0 1px rgba(139,26,42,0.4)` |
| 데스크톱 사이드 패널 | `0 24px 64px rgba(0,0,0,0.5)` |
| 사이드 패널 + inset | `0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)` |
| DeviceFrame (≥768px) | `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08), inset 0 0 0 2px #1F1428` |
| FAB (다크) | `0 6px 20px rgba(139,26,42,0.45), inset 0 1px 0 rgba(255,255,255,0.12)` |
| FAB (라이트) | `0 6px 20px rgba(184,148,56,0.32), inset 0 1px 0 rgba(255,255,255,0.18)` |

---

## 9. Gold / Wine Red rgba 알파 팔레트

### 9-1. Gold (`rgb(201,168,76)`)

| 알파 | 값 | 주요 용도 |
|------|-----|---------|
| 0.05 | `rgba(201,168,76,0.05)` | 매우 약한 Gold 틴트 배경 |
| 0.06 | `rgba(201,168,76,0.06)` | 라이트모드 sunken bg |
| 0.08 | `rgba(201,168,76,0.08)` | 카드 테두리 미세 틴트, DeviceFrame outer ring |
| 0.10 | `rgba(201,168,76,0.10)` | AutoDescription 배경 시작점 |
| 0.12 | `rgba(201,168,76,0.12)` | 구분선·보더 |
| 0.13 | `rgba(201,168,76,0.13)` | 칩 hover 배경 |
| 0.15 | `rgba(201,168,76,0.15)` | Story 이미지 라디얼 틴트 |
| 0.18 | `rgba(201,168,76,0.18)` | WSETSlider 활성 도트 글로우 링, Tonight 도트 글로우 |
| 0.30 | `rgba(201,168,76,0.30)` | 중간 강도 골드 배경 |
| 0.33 | `rgba(201,168,76,0.33)` | 칩 강조 배경 |
| 0.35 | `rgba(201,168,76,0.35)` | 활성 필터 칩 배경 |
| 0.40 | `rgba(201,168,76,0.40)` | 진한 Gold 오버레이 |

### 9-2. Wine Red (`rgb(139,26,42)`)

| 알파 | 주요 용도 |
|------|---------|
| 0.08 | 미세 배경 틴트 |
| 0.18 | FirstTimeGreeting 배경, 온보딩 radial |
| 0.25 | 중간 강도 |
| 0.33–0.35 | 커뮤니티 Today's Pick 배경 |
| 0.40–0.45 | DraftNoteResume 배경, push banner 그라데이션 |
| 0.7–0.8 | MapLegend 끝 stop |
| 1.0 | `rgba(139,26,42,1)` = solid |

---

## 10. 테마 전환 메커니즘

| 단계 | 방법 |
|------|------|
| 저장소 | `localStorage.getItem('winemine.theme')` → `'light'` 또는 `'dark'` |
| FOUC 방지 | `<head>` inline script — DOMContentLoaded 이전에 `html[data-theme]` 적용 |
| 런타임 전환 | `html[data-theme='light']` → CSS 변수 오버라이드 (`styles/tokens.css`) |
| 기본값 | `dark` |
| `viewport.themeColor` | `#05020A` (고정, `src/app/layout.tsx`) |

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

## 11. 금지 사항

- 테마 미적용 하드코딩 색상 (CSS 변수 대신 hex 직접 사용) — bottleColor·SVG·Recap처럼 의도적으로 다크 톤을 고정해야 하는 경우 외 금지
- `SUPABASE_SERVICE_ROLE_KEY` 등 시크릿을 `NEXT_PUBLIC_` 접두사로 노출
- UI 요소·mock 데이터·JSON 값에 Emoji 사용 (variation selector U+FE0F 포함)
