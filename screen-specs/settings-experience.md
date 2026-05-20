# 경험 수준 설정 (`/settings/experience`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/settings/experience` |
| 파일 | `src/app/settings/experience/page.tsx` (43 라인) |
| 헤더 | `<BackHeader title={t('title')} />` ("경험 수준 / Experience level") |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/settings/experience` — `settings.experience.radioList` |

---

## 진입 경로

- `/settings` Experience 행
- 온보딩 Step 3과 동일한 의미

---

## 페이지 구성

`<main className="wm-scroll-area" style={paddingTop: 12}>`

### RadioList

`<RadioList<Experience> options value={experience} onChange={...} />`

옵션 2개:

| value | label | description |
|---|---|---|
| `beginner` | "입문자 / Beginner" | "와인의 첫 발을 떼는 중이에요 / Just starting out with wine" |
| `expert` | "전문가 / Expert" | "WSET, 아펠라시옹, 카우달리 같은 용어가 익숙해요 / Familiar with WSET, appellation, caudalies, etc." |

**onChange**:
```ts
setExperience(next);
toast({ message: t('appliedToast') });
setTimeout(() => router.back(), 250);
```

- 즉시 ExperienceContext 반영 → URL `?exp=` + localStorage `winemine.experience`
- 토스트 + 250ms 후 자동 back
- **노트 작성 분기에 즉시 영향**: 다음 `/notes/new/write` 진입 시 적용

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| 라디오 옵션 | 클릭 | `setExperience(v)` + 토스트 + 250ms 후 back |

---

## 상태 관리

- `experience`, `setExperience` — `useExperience()`

---

## i18n 키 prefix

- `settings.experiencePage.{title, appliedToast, ...descriptions}`

---

## Feature flag 등록 (1개)

```ts
useRegisterFeatures('/settings/experience', [
  { id: 'settings.experience.radioList' },
])
```

---

## 디자인 토큰 / 스타일

- RadioList: description 포함 라디오 (2줄)
