# 라벨 스캔 (`/capture`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/capture` |
| 파일 | `src/app/capture/page.tsx` (588 라인) |
| 헤더 | 커스텀 — 좌상단 `<X size={22}>` 닫기 + 중앙 `t('title')` + 우측 spacer |
| BottomNav | **숨김** (HIDDEN_PREFIXES에 `/capture` 포함) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/capture` — `capture.options`, `capture.simulation` |

> **시안 단계**: 실제 카메라/파일 업로드는 동작하지 않는다. 두 진입(카메라/갤러리) 모두 1.5초 mock 분석 후 동일한 와인(`tus-brunello-terralsole-riserva` — Terralsole Brunello Riserva 2006)을 인식한 것처럼 노출.

---

## 진입 경로

- BottomNav 중앙 카메라 FAB (52×52 골드 그라데이션, 모든 페이지)
- 홈 first-time `SuggestedActions` "첫 스캔하기" 버튼
- 지도 first-time 빈 패널 "첫 스캔하기" CTA
- 노트 `/notes/new` → "검색으로 추가" (placeholder만)
- 갤러리 `/photos` "스캔 추가" FAB

---

## 페이지 구성 — Stage Machine

`type Stage = 'choose' | 'simulating' | 'recognized'`

### Stage 1: `choose` — 4개 옵션 카드

`<main>` padding `24px 20px`, flex column gap 14. 헤더 닫기 X 버튼은 `stage === 'choose'`면 `router.back()`, 아니면 `setStage('choose')`로 분기.

각 카드: 높이 104, padding 18, gap 16, rounded 16, `var(--color-surface)` + default border.

| ID | 아이콘 (32px, strokeWidth 1.5) | 타이틀 (Playfair 18px) | onClick |
|---|---|---|---|
| `scan` | `<Camera color="var(--color-wine-red)">` | `t('scan.title')` ("카메라 스캔 / Camera") | `startSimulation('scan')` |
| `gallery` | `<ImageIcon color="var(--color-gold)">` | `t('gallery.title')` ("갤러리에서 / From Gallery") | `startSimulation('gallery')` |
| `cellar` | `<Library color="var(--color-cream)">` | `t('cellar.title')` ("내 라이브러리 / My Library") | `router.push('/cellar')` |
| `note` | `<BookOpen color="var(--color-text-secondary)">` | `t('note.title')` ("메뉴얼 입력 / Manual Entry") | `router.push('/notes/new')` |

`startSimulation(src)`:
```ts
setSource(src);
setStage('simulating');
setPhotoLoadFailed(false);
window.setTimeout(() => setStage('recognized'), 1500);
```

### Stage 2: `simulating` — 1.5초 mock 분석 화면

`<SimulatingView source={source} message={...} />` — `marginTop: 40, padding: 40px 20px, flex column align center gap 24`.

**240×320 검은 사각 + 가이드** (rounded 20, default border):

- **scan 모드**:
  - `absolute inset:32` 골드 보더 12 라운드 (opacity 0.6) — 카메라 가이드 박스
  - 중앙 `<Loader2 size={32} color="var(--color-gold)">` — `wm-pulse` 1.5s ease-in-out infinite 애니메이션 (scale + opacity)

- **gallery 모드**:
  - 3×3 그리드 (gap 2, padding 8) — 9개 셀
  - 4번째(중앙) 셀만 골드 2px 보더 + 18% 채도 (선택 mock)
  - 나머지: 4% 채도 + 6% 보더
  - 하단 중앙 `<Loader2 size={28} color="var(--color-gold)">` pulse

**메시지** (그 아래):
- Inter 14px cream, gap 8, 좌측 `<Sparkles size={14} color="var(--color-gold)">`
- 텍스트: `source === 'scan' ? t('simulating.scan') : t('simulating.gallery')`

### Stage 3: `recognized` — 인식 결과 카드

`<RecognizedView wine={wine} locale photoLoadFailed onPhotoError onConfirmNote onConfirmCellar onRetry onEdit t />`.

#### (3-1) AI 인식 헤더

- padding `10px 14px`, rounded 12
- 배경: `rgba(201, 168, 76, 0.08)` 골드 8%
- 보더: 1px `var(--color-gold)`
- 좌측 `<Sparkles size={16} color="var(--color-gold)">`
- 타이틀: Inter 13px weight 600 cream — `t('recognized.title')` ("AI가 라벨을 인식했어요 / AI recognized the label")
- 서브: Inter 11px muted — `t('recognized.subtitle')` ("아래 정보를 확인하고 노트를 작성하세요 / Check the info and write a note")

#### (3-2) 와인 카드 (Surface 16 rounded)

`display: flex; gap: 14; align: flex-start`:

**좌측 사진** (90×130, rounded 8):
- 배경: `linear-gradient(180deg, ${wine.bottleColor} 0%, #1a0a0e 100%)` + default border
- `<img src={SAMPLE_PHOTO_PATH = '/sample-labels/terralsole-brunello-riserva-2006.jpg'} onError={onPhotoError}>`
- 이미지 로드 실패 시 `<FallbackLabel>` SVG 와인병 + 라벨 텍스트 (Playfair `producer` 첫 단어 + `wineName` + 빈티지 골드)

**우측 메타** (flex 1):
- Playfair 17px cream `wine.name`
- Inter 12px secondary `wine.producer[locale]`
- **MetaRow ×5** — label minWidth 48 + value cream:
  - `t('recognized.vintage')` → `wine.vintage`
  - `t('recognized.region')` → `wine.region[locale], wine.country[locale]`
  - `t('recognized.appellation')` → `wine.appellation[locale]`
  - `t('recognized.grape')` → `wine.grapes.map(g => g[locale]).join(', ')`
  - `t('recognized.drinkWindow')` → `${wine.drinkWindow.from}–${wine.drinkWindow.to}`

**`photoLoadFailed === true`일 때 추가 박스** (padding 10, rounded 8, 보라 그레이 bg, Inter 11px muted):
- `<strong>` `t('fileNotFound.title')` ("이미지 파일 없음 / Sample image missing")
- `t('fileNotFound.body')` 본문
- `<span opacity 0.7>` `t('fileNotFound.hint')` (개발용 힌트)

#### (3-3) 주요 액션 2개 (flex column gap 10)

| 버튼 | 스타일 | onClick |
|---|---|---|
| `t('recognized.confirmNote')` ("노트 작성 / Write Note") | bg 와인레드, cream text, padding `14px 20`, weight 600 | `router.push(`/notes/new/write?from=newEntry&wineId=${wine.id}`)` |
| `t('recognized.confirmCellar')` ("셀러에 추가 / Add to Cellar") | transparent, 골드 보더, 골드 text | `addCellarItem({...}) + toast("셀러에 추가됨 / Added to cellar") + router.push('/cellar')` |

**셀러 추가 페이로드**:
```ts
addCellarItem({
  id: `user-cellar-${Date.now()}`,
  userId: user.id,
  wineId: wine.id,
  acquiredAt: new Date().toISOString().slice(0, 10),  // YYYY-MM-DD
  storage: 'cellar',
  notes: null,
  purchasePriceKrw: wine.averagePriceKrw ?? null,
  notifyAtPeak: false,
  photoUrl: null,
});
```

#### (3-4) 보조 액션 2개 (flex row gap 10)

`SecondaryButton`(flex 1, padding `10px 14`, transparent, default border, secondary text, gap 6):

| 버튼 | 아이콘 | onClick |
|---|---|---|
| `t('recognized.retry')` ("다시 스캔 / Re-scan") | `<RotateCcw size={14}>` | `setStage('choose')` |
| `t('recognized.edit')` ("직접 입력 / Manual Input") | `<Pencil size={14}>` | `router.push(`/notes/new/write?from=newEntry&wineId=${wine.id}&edit=1`)` |

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| 헤더 X (stage='choose') | 클릭 | `router.back()` |
| 헤더 X (stage≠'choose') | 클릭 | `setStage('choose')` |
| 카메라 카드 | 클릭 | `startSimulation('scan')` → 1.5s → recognized |
| 갤러리 카드 | 클릭 | `startSimulation('gallery')` → 1.5s → recognized |
| 내 라이브러리 카드 | 클릭 | `router.push('/cellar')` |
| 메뉴얼 입력 카드 | 클릭 | `router.push('/notes/new')` |
| 노트 작성 버튼 | 클릭 | `/notes/new/write?from=newEntry&wineId={id}` |
| 셀러에 추가 버튼 | 클릭 | localStorage 저장 + 토스트 + `/cellar` |
| 다시 스캔 | 클릭 | `setStage('choose')` |
| 직접 입력 | 클릭 | `/notes/new/write?from=newEntry&wineId={id}&edit=1` |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `stage` | useState | `'choose'` |
| `source` | useState | `'scan'` |
| `photoLoadFailed` | useState | `false` |
| `user` | mock | `useMockUser()` |
| `locale` | context | `useLocale()` |
| `addCellarItem` | context method | `useUserData()` |

**localStorage 키 쓰기**: `winemine.userCellar`(UserDataContext가 관리)

**Provider 의존**: Locale / UserData

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getWine(SAMPLE_WINE_ID='tus-brunello-terralsole-riserva')` | 인식 결과 와인 객체 |
| `/sample-labels/terralsole-brunello-riserva-2006.jpg` | 정적 라벨 이미지 (없으면 FallbackLabel SVG) |

---

## i18n 키 prefix

`messages/{ko,en}.json`의 `capture.*`:
- `capture.title`
- `capture.{scan,gallery,cellar,note}.{title,sub}` ×4 카드
- `capture.simulating.{scan,gallery}`
- `capture.recognized.{title,subtitle,vintage,region,appellation,grape,drinkWindow,confirmNote,confirmCellar,retry,edit}`
- `capture.fileNotFound.{title,body,hint}`

---

## Feature flag 등록

```ts
useRegisterFeatures('/capture', [
  { id: 'capture.options', labelKo: '4개 옵션 카드', labelEn: 'Four option cards', defaultStatus: 'planned' },
  { id: 'capture.simulation', labelKo: 'AI 인식 시뮬', labelEn: 'AI recognition sim', defaultStatus: 'planned' },
])
```

---

## 빈/오류 상태

- **이미지 파일 없을 때**: `FallbackLabel` SVG (와인병 + 라벨 텍스트 그리기) + 안내 박스
- **wine === null**: stage가 `recognized`여도 `{stage === 'recognized' && wine && ...}` 가드라 안 노출 (`SAMPLE_WINE_ID`는 mock 카탈로그에 항상 존재)

---

## 디자인 토큰 / 스타일

- 카드 surface: `var(--color-surface)` + `var(--color-border-default)`
- 골드 강조: `var(--color-gold)`
- 와인레드: `var(--color-wine-red)` (확인 노트 버튼)
- pulse 애니메이션 `wm-pulse` 1.5s ease-in-out infinite (inline `<style>` 태그)
- 카메라 가이드 박스: `2px solid var(--color-gold)` + opacity 0.6
- 갤러리 그리드: aspect-ratio 1/1, gap 2, 9개 셀
