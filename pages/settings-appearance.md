# 외관 설정 (`/settings/appearance`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/settings/appearance` |
| 파일 | `src/app/settings/appearance/page.tsx` (63 라인) |
| 헤더 | `<BackHeader title={...}>` ("외관 / Appearance") |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/settings/appearance` — `settings.appearance.radioList` |

---

## 진입 경로

- `/settings` Appearance 행

---

## 페이지 구성

`<main className="wm-scroll-area" style={paddingTop: 12}>`

### RadioList

`<RadioList<Theme> options value={theme} onChange={...} />`

옵션 2개 (description 포함):

| value | label | description |
|---|---|---|
| `dark` | 다크 / Dark | 와인 바 분위기의 짙은 보라 배경 / Original wine bar mood — deep purple background |
| `light` | 라이트 / Light | 크림 종이 배경에 와인 강조색 / Cream paper background with deep wine accents |

**onChange**:
```ts
setTheme(next);
toast({ message: { ko: '테마가 적용됐어요', en: 'Theme applied' } });
```

- 즉시 ThemeContext 반영 → localStorage `winemine.theme`
- `html[data-theme="dark"|"light"]` 속성 변경 → CSS 변수 자동 재정의 (모든 페이지 즉시 시각 분기)
- 토스트만, **back은 안 함** (사용자가 즉시 색 변화 확인 가능)

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| Dark 옵션 | 클릭 | `setTheme('dark')` + 토스트 |
| Light 옵션 | 클릭 | `setTheme('light')` + 토스트 |

---

## 상태 관리

- `theme`, `setTheme` — `useTheme()` (Context)
- `locale` — 인라인 분기용

**localStorage 키**: `winemine.theme`

---

## i18n 키 prefix

- 인라인 (`locale === 'en' ? 'Appearance' : '외관'`)
- 적용 토스트 인라인

---

## Feature flag 등록 (1개)

```ts
useRegisterFeatures('/settings/appearance', [
  { id: 'settings.appearance.radioList' },
])
```

---

## 테마 차이 (FEATURES.md §10 참조)

| 토큰 | 다크 | 라이트 |
|---|---|---|
| `--color-wine-red` | `#8B1A2A` | `#B89438` (골드 재정의) |
| `--color-gold` | `#C9A84C` | `#B89438` |
| `--color-cream` | `#F8F4ED` | `#2A1A14` |
| `--color-bg-deepest` | `#251837` | `#FAF5EC` |
| `--color-map-country` | `#3A2440` | `#DDD0BB` (양피지) |
| `--color-map-ocean` | `#100720` | `#C8D6E4` (청회색) |

라이트 모드는 화이트 와인 컨셉 — 와인레드도 골드로 재정의되어 골드 통일.

---

## 디자인 토큰 / 스타일

- RadioList description 2줄 옵션
