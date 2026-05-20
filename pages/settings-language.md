# 언어 설정 (`/settings/language`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/settings/language` |
| 파일 | `src/app/settings/language/page.tsx` (43 라인) |
| 헤더 | `<BackHeader title={t('title')} />` ("언어 설정 / Language") |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/settings/language` — `settings.language.radioList` |

---

## 진입 경로

- `/settings` Language 행
- DemoControls 언어 라디오는 별도 (사이드 패널)

---

## 페이지 구성

`<main className="wm-scroll-area" style={paddingTop: 12}>`

### RadioList

`<RadioList<Locale> options value={locale} onChange={...} />`

옵션 2개:
- `{ value: 'ko', label: tSettings('ko') }` → "한국어"
- `{ value: 'en', label: tSettings('en') }` → "English"

**onChange**:
```ts
setLocale(next);
toast({ message: t('appliedToast') });
setTimeout(() => router.back(), 250);
```

- 즉시 LocaleContext 반영 → URL `?locale=` + localStorage `winemine.locale`
- 토스트 노출 ("언어가 변경됐어요 / Language changed")
- 250ms 후 `router.back()` (자동 뒤로가기)

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| RadioList 옵션 | 클릭 | setLocale + 토스트 + 250ms 후 back |

---

## 상태 관리

- `locale`, `setLocale` — `useLocale()` (Context)

---

## i18n 키 prefix

- `settings.languagePage.{title, appliedToast}`
- `settings.values.{ko, en}`

---

## Feature flag 등록 (1개)

```ts
useRegisterFeatures('/settings/language', [
  { id: 'settings.language.radioList' },
])
```

---

## 디자인 토큰 / 스타일

- RadioList: 각 옵션 (대형 라디오, 선택 시 골드 보더 + 와인레드 dot)
