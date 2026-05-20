# 온보딩 (`/onboarding`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/onboarding` |
| 파일 | `src/app/onboarding/page.tsx` (452 라인) |
| 헤더 | **없음** (풀 페이지 — `<main>` 직접 그라데이션 배경) |
| BottomNav | **숨김** (HIDDEN_PREFIXES `/onboarding` 포함) |
| 진입 가드 | heavy 모드 또는 `localStorage.winemine.onboardingComplete === 'true'`이면 `router.replace('/')` |
| Feature flag 키 | (등록 가능, 미확인) |

---

## 진입 경로

- `/` 자동 리다이렉트 (first-time + 온보딩 미완료)
- DemoControls "온보딩 다시 보기" 버튼 → localStorage 키 삭제 + setDemoMode('first-time') + push('/onboarding')

---

## 가드 useEffect

```ts
useEffect(() => {
  if (demoMode !== 'first-time') {
    router.replace('/');
    return;
  }
  const done = localStorage.getItem('winemine.onboardingComplete');
  if (done === 'true') router.replace('/');
}, [demoMode, router]);
```

---

## 페이지 구성 — 4단계 Step Machine

`type Step = 'welcome' | 'language' | 'experience' | 'done'`

`<main>` flex column, padding `32px 24px 40px`, gap 24, bg `var(--color-bg-deepest)`.

전환: framer-motion (각 step 자체 진입 애니메이션, motion.h1 / motion.div).

### Step 1: Welcome (`<StepWelcome onNext={() => setStep('language')} t />`)

- Playfair 56px cream `winemine` 로고 (motion.h1, `initial: {opacity:0, y:16}`, `transition: {delay: 0.2, duration: 0.6}`)
- 환영 메시지 (`t('welcome.title')`)
- 본문 안내 (`t('welcome.body')`)
- `<PrimaryButton onClick={onNext}>` "시작하기 / Get started"

### Step 2: Language (`<StepLanguage picked onPick onNext t />`)

- 제목: `t('language.title')` ("언어를 선택해주세요 / Pick your language")
- 2개 라디오 카드:
  - 한국어 (`ko`) — 선택 시 `setLocale('ko')` 즉시 반영
  - English (`en`) — 선택 시 `setLocale('en')`
- 다음 버튼: `picked` 선택 시 활성 → `onNext()` `setStep('experience')`

### Step 3: Experience (`<StepExperience picked onPick onNext t />`)

- 제목: `t('experience.title')`
- 2개 라디오 카드:
  - **beginner** — "와인을 가볍게 즐기고 싶어요 / I want to enjoy wine casually"
  - **expert** — "와인을 깊게 파고들고 싶어요 / I want to dive deep into wine"
- 선택 시 `setExperience(v)` 즉시 반영
- 다음 버튼: `picked` 시 활성 → `setStep('done')`

### Step 4: Done (`<StepDone onScan onTour t />`)

- 큰 체크 아이콘 또는 GlassWater 아이콘
- "준비 완료! / You're all set!"
- 2개 버튼:
  - **첫 스캔하기 / Scan first label** → `finish() + router.push('/capture')`
  - **둘러보기 / Just browse** → `finish()` ( → `/`)

`finish()`:
```ts
localStorage.setItem('winemine.onboardingComplete', 'true');
router.replace('/');
```

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| Welcome "시작하기" | 클릭 | `setStep('language')` |
| Language 라디오 | 선택 | `setPickedLocale + setLocale` |
| Language 다음 | 클릭 | `setStep('experience')` |
| Experience 라디오 | 선택 | `setPickedExp + setExperience` |
| Experience 다음 | 클릭 | `setStep('done')` |
| Done "첫 스캔하기" | 클릭 | `finish() + router.push('/capture')` |
| Done "둘러보기" | 클릭 | `finish()` → `/` |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `step` | useState | `'welcome'` |
| `pickedLocale` | useState | `null` |
| `pickedExp` | useState | `null` |
| `demoMode` | URL+LS | `useAppMode()` |
| `setLocale` | context | `useLocale()` |
| `setExperience` | context | `useExperience()` |

**localStorage 키 쓰기**: `winemine.onboardingComplete = 'true'` (finish 시)

**Context side-effects**: LocaleContext / ExperienceContext의 setter는 즉시 URL `?locale=`, `?exp=` + localStorage 반영

---

## 데이터 의존성

- 없음 — 순수 UI 흐름

---

## i18n 키 prefix

- `onboarding.welcome.{title, body}`
- `onboarding.language.{title, options.ko, options.en, next}`
- `onboarding.experience.{title, options.beginner, options.expert, next}`
- `onboarding.done.{title, body, scan, tour}`

---

## Feature flag 등록

(미확인 — `useRegisterFeatures('/onboarding', [...])` 가능)

---

## 빈/오류 상태

- 사용자가 첫 step에서 뒤로 가기: `router.back()` → 가드 useEffect로 `/`로 튕김
- 다국어 선택 안 하고 다음 누름: 버튼 disabled (구현에 따라)

---

## 디자인 토큰 / 스타일

- 풀스크린, 배경 `var(--color-bg-deepest)`
- Welcome 타이틀 Playfair 56px (가장 큰 텍스트)
- motion 진입 spring/ease-out
- PrimaryButton 와인레드 또는 골드
