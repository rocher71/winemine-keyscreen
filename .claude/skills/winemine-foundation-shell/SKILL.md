---
name: winemine-foundation-shell
description: winemine 키스크린의 cross-cutting 공통 인프라(DeviceFrame iPhone 390×844 목업 + StatusBar + Dynamic Island + Home Indicator + BottomNav 5탭 + AppHeader + BackHeader + AppMode/Experience/Locale/Favorites 4개 Context + PlaceholderToast + BottomSheet + ConfirmDialog + LocaleText + GlossaryTooltip 헬퍼)를 구축하는 스킬. 모든 페이지가 의존하는 frame과 nav, 그리고 모드 컨텍스트를 만든다. 다음 키워드/상황에서 반드시 트리거할 것: 'DeviceFrame 만들어', 'iPhone 목업 프레임', 'BottomNav 셋업', 'AppHeader 만들어', '모드 컨텍스트 구축', 'i18n provider 연결', 'localStorage 동기화 context', 'BottomSheet 컴포넌트', 'PlaceholderToast 셋업'. 후속 작업으로 'BottomNav 활성색 바꿔', 'DeviceFrame 베젤 두께 조정' 같은 부분 수정도 트리거.
---

# winemine-foundation-shell — 공통 인프라

## 목적

winemine 키스크린의 모든 페이지가 의존하는 cross-cutting 인프라를 만든다. 페이지별 콘텐츠는 만들지 않는다 — 그건 `winemine-page-routing`과 `winemine-wine-detail`이 담당.

## Why 인프라를 먼저?

DeviceFrame + 컨텍스트 4개 + Nav는 거의 모든 페이지가 import한다. 이걸 페이지 빌더가 같이 만들면 페이지마다 다르게 구현될 위험이 크다. 단일 에이전트가 한 번에 만들어 일관성 보장.

## 구성

### 1. DeviceFrame 패밀리 (`src/components/device-frame/`)

| 파일 | 용도 | 핵심 스펙 |
|---|---|---|
| `device-frame.tsx` | 외관 wrapper | 외경 414×868, border-radius 50px, 베젤 색 #0A050F, 외곽 shadow `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08)` |
| `status-bar.tsx` | 상단 시계+신호+배터리 | 54px, "9:41" Inter 500 15px Cream, padding-left 28px |
| `dynamic-island.tsx` | 알약 | 120×34, top 11px, border-radius 17px, #000000 |
| `home-indicator.tsx` | 하단 바 | 134×5, bottom 8px, rgba(245,240,232,0.4) |

내부 콘텐츠 영역 390×844, border-radius 38px, overflow hidden, `--color-bg-deepest` 배경.

**반응형 분기:** `useMediaQuery('(max-width: 767px)')` 또는 CSS media query로 모바일에서는 wrapper가 투명 (모든 정밀 dimension 제거, 콘텐츠가 풀스크린).

### 2. Navigation (`src/components/nav/`)

#### bottom-nav.tsx
- 5탭: 홈/지도/FAB/셀러/프로필
- 높이 83px (탭 49 + safe area 34)
- 배경 `rgba(15,7,24,0.92)` + `backdrop-filter: blur(20px)`
- 상단 보더 1px `var(--color-border-default)`
- FAB(중앙): 56×56 원형, Wine Red, Camera 아이콘 24px Cream, 보더 4px `--color-bg-deepest`, top -16px 띄움
- 일반 탭: 아이콘 20px stroke 1.75, 라벨 10px Inter 500
- 활성 시 Gold, 비활성 Muted
- `usePathname()`으로 활성 탭 결정. 매칭:
  - `/` → 홈
  - `/map` → 지도
  - `/cellar*` → 셀러
  - `/profile*` → 프로필
  - 그 외 → 활성 탭 없음
- 노트 작성·온보딩·캡처 라우트(`/notes/new/*`, `/onboarding`, `/capture`)에서는 BottomNav 숨김 (whitelist 패턴, `shouldShowBottomNav(pathname)` 헬퍼)

#### app-header.tsx
- 56px, padding 0 20px
- 좌측: winemine 로고 (Playfair 22px, letter-spacing -0.02em, Cream)
- 우측: 알림 벨 (Bell 20px, 미읽음 시 우상단 빨간 점) + 아바타 wrap

#### back-header.tsx
- 56px, padding 0 16px
- 좌측: ChevronLeft 24px + 페이지 타이틀 (Inter 600 16px)
- 우측: 컨텍스트 액션 슬롯 (props로 받음)
- 클릭 시 `router.back()`

### 3. Context Providers (`src/context/`)

각 컨텍스트는 동일 패턴:
1. URL 검색 파라미터 우선 (`useSearchParams()`)
2. localStorage 두 번째 (`winemine.{key}`)
3. default 마지막

**Hydration 안전:** SSR 시 default 값으로 초기 렌더, `useEffect`에서 URL/localStorage 읽어 동기화. mounted 가드로 hydration mismatch 방지.

| 컨텍스트 | 값 | localStorage 키 | URL 파라미터 |
|---|---|---|---|
| `AppModeContext` | `'first-time' \| 'heavy'` | `winemine.demoMode` | `?demo=` |
| `ExperienceContext` | `'beginner' \| 'expert'` | `winemine.experience` | `?exp=` |
| `LocaleContext` | `'ko' \| 'en'` | `winemine.locale` | `?locale=` |
| `FavoritesContext` | `wineId[]` | `winemine.favorites` | (URL X) |

값 변경 시 URL과 localStorage 동시 갱신 (`router.replace(newSearchParams)` + `localStorage.setItem`).

추가 항목 (Onboarding):
- `localStorage.winemine.onboardingComplete` (boolean) — first-time 가드용

### 4. Shared 컴포넌트 (`src/components/shared/`)

- `placeholder-toast.tsx` — 단일 인스턴스, queue 길이 1, `useToast()` 훅으로 호출
  - 위치: DeviceFrame 외부 (데스크톱) / 콘텐츠 상단 (모바일)
  - max-width 320px, padding 14px 20px
  - 배경 Surface, 보더 1px Gold, border-radius 12px
  - 진입 opacity 0→1 + translateY -8→0 200ms ease-out
  - 2.5s 자동 dismiss
  - Sparkles 아이콘 + 메시지
  - XP variant: 좌측 "+N XP" 라벨 Gold
- `bottom-sheet.tsx` — Framer Motion `translateY` 100%→0, 350ms ease-out, drag handle 36×4 Gold
- `modal.tsx` — 중앙 정렬, max-width 320px (DeviceFrame 안 기준)
- `confirm-dialog.tsx` — modal 변형, 확인/취소
- `locale-text.tsx` — LocalizedString 렌더 헬퍼: `<LocaleText value={{ ko: '...', en: '...' }} />`
- `empty-state.tsx` — 일러스트 + 메시지 + CTA 슬롯
- `level-pill.tsx` — `<LevelPill level={3} />` 작은 칩
- `review-badge.tsx` — `<ReviewBadge badgeId="..." />` 작은 아이콘

### 5. GlossaryTooltip (`src/components/glossary/glossary-tooltip.tsx`)

```tsx
<GlossaryTooltip termId="caudalie" placement="bottom">
  {/* 인라인 (i) 버튼이 자동 삽입됨 */}
</GlossaryTooltip>
```

클릭 시 max-width 280px popover, 본문 2~3문장 + "더 알아보기 / Learn more" → `/glossary/[termId]`. mock-data-architect가 만든 `mock/glossary.ts`에서 lazy load.

### 6. Page Background

`src/components/shared/page-background.tsx`:
```tsx
// 다크 그라데이션 풀스크린. 페이지 어디서나 위에 DeviceFrame이 올라감.
```

## 최종 layout 통합

`src/app/layout.tsx` 갱신:

```tsx
<html>
  <body>
    <NextIntlClientProvider messages={messages}>
      <AppModeProvider>
        <ExperienceProvider>
          <LocaleProvider>
            <FavoritesProvider>
              <ToastProvider>
                <PageBackground />
                <DeviceFrame>
                  <StatusBar />
                  {children}
                  <HomeIndicator />
                </DeviceFrame>
                <PlaceholderToast />
              </ToastProvider>
            </FavoritesProvider>
          </LocaleProvider>
        </ExperienceProvider>
      </AppModeProvider>
    </NextIntlClientProvider>
  </body>
</html>
```

**BottomNav는 layout이 아닌 각 페이지 또는 layout group에서 마운트.** Onboarding/노트작성 등 숨겨야 할 화면에서 BottomNav 마운트 자체를 안 하면 깔끔.

## Edge Cases

- **Hydration mismatch:** 모드 컨텍스트는 SSR 시 default로 초기화. 클라이언트에서만 localStorage 접근. `useMounted()` 가드로 mismatch 방지.
- **URL 파라미터 변경 시 router.replace:** `router.push`는 새 history entry 생성 → 뒤로가기 이상해짐. 반드시 `replace` 사용.
- **모바일 viewport 분기:** CSS만으로 분기하면 SSR 일관성 유지. JS `useMediaQuery`는 mounted 후에만 사용.
- **next/font 변수:** `<html className={font.variable}>`에 모두 첨부. 일부만 첨부하면 일부 폰트 미적용.

## 스킬 종료 조건

- DeviceFrame, BottomNav, AppHeader, BackHeader 모두 정확한 dimension으로 렌더
- 4개 Context가 URL ↔ localStorage 동기화 정상
- 모바일 viewport에서 DeviceFrame 투명 처리
- 콘솔 hydration 경고 0
- `_workspace/B_infrastructure_report.md` 작성 (컴포넌트 export 경로, Context 사용 예시 포함)
