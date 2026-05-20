# 설정 (`/settings`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/settings` |
| 파일 | `src/app/settings/page.tsx` (166 라인) |
| 헤더 | `<BackHeader title={t('title')} />` ("설정 / Settings") |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/settings` — `settings.appSection`, `settings.notifSection`, `settings.accountSection`, `settings.aboutSection` |

---

## 진입 경로

- 홈 QuickActions "설정"
- DemoControls (간접)
- 프로필 (간접)

---

## 페이지 구성 — 4섹션 (SectionDivider로 구분)

각 행은 `<SettingRow>` (Surface, default border, rounded 12, margin `4px 16`, padding `14px 20`, Inter 14 weight 500 cream):
- 좌측 라벨 (flex 1)
- 우측 value (있을 때, muted 13)
- 우측 ChevronRight (href 또는 onClick 있을 때)

### Section 1: App (`data-feature-id="settings.appSection"`)

`<SectionDivider title={t('sections.app')} />` UPPERCASE 라벨

| 행 | 라우트 | value 표시 |
|---|---|---|
| `t('items.language')` | `/settings/language` | `localeLabel = locale === 'en' ? t('values.en') : t('values.ko')` ("한국어" / "English") |
| `t('items.experience')` | `/settings/experience` | `expLabel = experience === 'expert' ? t('values.expert') : t('values.beginner')` ("입문자" / "전문가") |
| 테이스팅 노트 양식 / Tasting note templates (인라인 locale) | `/settings/tasting-template` | — |
| 외관 / Appearance (인라인 locale) | `/settings/appearance` | theme 분기 ("다크 / 라이트" 또는 "Dark / Light") |

### Section 2: Notifications (`settings.notifSection`)

| 행 | 라우트 |
|---|---|
| `t('items.notifSettings')` | `/settings/notifications` |

### Section 3: Account (`settings.accountSection`)

| 행 | onClick |
|---|---|
| `t('items.changeNickname')` | `toast({ message: t('nicknameToast') })` PlaceholderToast |
| `t('items.signOut')` | 동일 (`nicknameToast` 재사용) |

### Section 4: About (`settings.aboutSection`)

| 행 | 동작 |
|---|---|
| `t('items.version')` | static value `"1.0.0"` |
| `t('items.terms')` | `toast({ message: t('termsToast') })` |
| `t('items.privacy')` | `toast({ message: t('privacyToast') })` |

### 하단 spacer (32px)

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| Language 행 | 클릭 | `/settings/language` |
| Experience 행 | 클릭 | `/settings/experience` |
| Tasting Template 행 | 클릭 | `/settings/tasting-template` |
| Appearance 행 | 클릭 | `/settings/appearance` |
| Notification Settings 행 | 클릭 | `/settings/notifications` |
| 닉네임 변경 | 클릭 | PlaceholderToast |
| 로그아웃 | 클릭 | PlaceholderToast |
| 약관 | 클릭 | PlaceholderToast |
| 개인정보처리방침 | 클릭 | PlaceholderToast |

---

## 상태 관리

| 상태 | 종류 |
|---|---|
| `locale` | `useLocale()` |
| `experience` | `useExperience()` |
| `theme` | `useTheme()` |

---

## 데이터 의존성

없음 — 순수 메타 페이지.

---

## i18n 키 prefix

- `settings.{title, sections.{app, notifications, account, about}}`
- `settings.items.{language, experience, notifSettings, changeNickname, signOut, version, terms, privacy}`
- `settings.values.{ko, en, beginner, expert, expert}`
- `settings.{nicknameToast, termsToast, privacyToast}`

테이스팅 노트 양식 / 외관은 인라인 (`locale === 'en' ? ... : ...`).

---

## Feature flag 등록 (4개)

```ts
useRegisterFeatures('/settings', [
  { id: 'settings.appSection' },
  { id: 'settings.notifSection' },
  { id: 'settings.accountSection' },
  { id: 'settings.aboutSection' },
])
```

---

## 디자인 토큰 / 스타일

- 모든 행: `SETTING_ROW_STYLE` 상수 — 14px 폰트, 라운드 12, surface bg, default border
- SectionDivider: UPPERCASE 라벨 (Inter weight 700 letter-spacing wide)
