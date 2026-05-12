---
name: winemine-page-routing
description: winemine 키스크린의 일반 페이지 16개 라우트(홈/지도/셀러 리스트·상세/내 프로필/타 유저 프로필/설정 4종/알림/즐겨찾기/뱃지/사진/용어 사전 2종/온보딩 4단계/캡처 chooser/노트 source picker)를 구현하고 messages/{ko,en}.json의 모든 i18n 키를 양쪽 동기 관리. DemoControls(데스크톱 좌측), FeatureFlagPanel(데스크톱 우측)도 담당. 와인 상세 계열 4개 라우트는 별도 스킬(winemine-wine-detail)이 담당. 다음 키워드에서 반드시 트리거: '홈 페이지 만들어', '셀러 페이지', '온보딩 화면', '지도 페이지', '프로필 페이지', '설정 화면', '뱃지 진열장', '라벨 사진 갤러리', '용어 사전', 'DemoControls', 'FeatureFlagPanel', 'messages 파일 동기', 'i18n 키 추가'. 후속 작업으로 '홈 카드 순서 바꿔', '설정에 다크모드 토글 추가'도 트리거.
---

# winemine-page-routing — 일반 페이지 + i18n 매니저

## 목적

WINEMINE_KEYSCREEN_SPEC.md `pages_and_interfaces`의 16개 페이지를 모두 구현하고, `messages/{ko,en}.json`의 모든 i18n 키를 양쪽 동기 관리. 와인 상세 계열(/wine/[id]*)은 `winemine-wine-detail` 스킬 담당.

## Why 페이지를 한 에이전트가?

22개 라우트 중 16개는 비교적 단순한 페이지 + 섹션 컴포넌트 조합이라 단일 에이전트가 일관된 패턴으로 빠르게 만든다. i18n 키 매니징도 한 곳에 모으는 게 동기 깨짐을 막는다.

## 페이지 인벤토리 (16개)

| 라우트 | 헤더 | BottomNav | 모드 분기 |
|---|---|---|---|
| `/` | AppHeader | 표시 (홈 활성) | heavy/first-time 차이 큼 |
| `/onboarding` | 없음 (풀스크린) | 숨김 | first-time 전용 |
| `/map` | BackHeader | 표시 (지도 활성) | first-time → empty state |
| `/cellar` | AppHeader | 표시 (셀러 활성) | first-time → empty state |
| `/cellar/[id]` | BackHeader | 표시 | (헤비만 유효) |
| `/profile` | AppHeader | 표시 (프로필 활성) | 모드별 stats 다름 |
| `/profile/[userId]` | BackHeader | 표시 (프로필 활성 유지) | other user mock 3명 |
| `/settings` | BackHeader | 숨김 | - |
| `/settings/language` | BackHeader | 숨김 | - |
| `/settings/experience` | BackHeader | 숨김 | - |
| `/settings/notifications` | BackHeader | 숨김 | - |
| `/notifications` | BackHeader | 숨김 | first-time → empty |
| `/favorites` | BackHeader | 숨김 | first-time → empty |
| `/badges` | BackHeader | 숨김 | first-time → 모두 잠금 |
| `/photos` | BackHeader | 표시 (셀러 활성 유지) | first-time → empty |
| `/glossary` | BackHeader | 숨김 | - |
| `/glossary/[term]` | BackHeader | 숨김 | - |
| `/capture` | 닫기 X | 숨김 | - |
| `/notes/new` | BackHeader | 숨김 | first-time → 셀러 카드 disabled |
| `/notes/new/write` | BackHeader | 숨김 | tasting-note-engineer의 컨테이너 import |

> /notes/new/write는 본 스킬이 만드는 페이지지만 안은 tasting-note-engineer의 NoteWriteBeginner/Expert 컴포넌트를 import한 얇은 wrapper.

## 작업 흐름

### Step 1 — i18n 흡수

tasting-note-engineer의 `_workspace/C_tasting_note_i18n_keys.json` 읽고, 기존 `messages/{ko,en}.json` + 본 스킬이 추가하는 키를 모두 모아 양쪽 동기 갱신.

키 그룹 (스펙 i18n_strategy 인용):
- `keyscreen.*`
- `onboarding.*`
- `cellar.*`
- `profile.*`
- `wineDetail.*` (wine-detail-specialist가 따로 추가)
- `settings.*`
- `notifications.*`
- `xp.*`
- `badges.*`
- `levels.*`
- `reviews.*`
- `community.*`
- `wineStory.*` (wine-detail-specialist)
- `externalRatings.*` (wine-detail-specialist)
- `communityPeak.*` (wine-detail-specialist)
- `servingTemp.*` (tasting-note-engineer)
- `peakEta.*` (tasting-note-engineer)
- `regionalAromas.*` (tasting-note-engineer)
- `photos.*`
- `glossary.*`
- `tastingNote.*` (기존, 그대로 유지)

### Step 2 — 페이지 작성 (의존 순)

#### 1. /onboarding (가장 독립적)

4 step 컴포넌트 + step state. `localStorage.winemine.onboardingComplete=true` 저장.

#### 2. /capture, /notes/new (단순 chooser)

option 카드 2~3개.

#### 3. /settings, /settings/{language,experience,notifications}

라디오 리스트. 변경 즉시 컨텍스트 + localStorage 갱신.

#### 4. /favorites, /notifications, /badges, /photos

리스트/그리드. mock-data-architect의 fixture 헬퍼 사용.

#### 5. /glossary, /glossary/[term]

검색 + 필터 + entry detail.

#### 6. /cellar, /cellar/[id]

셀러 카드 그리드, drink-window-badge, drink-this-button (→ /notes/new/write?from=cellar&itemId=X).

#### 7. /map (react-simple-maps dynamic import)

전체 월드맵 + country-detail-panel BottomSheet. drilldown.

#### 8. /profile, /profile/[userId]

profile-hero + level-progress-bar + stat-grid. 타 유저는 user-map-hero가 가장 위 + taste-compatibility-card.

#### 9. / (Home)

heavy: stat-hero + level-progress-bar + notification-feed + recent-notes-strip + quick-actions
first-time: first-time-greeting + empty-stat-hero + suggested-actions

### Step 3 — DemoControls + FeatureFlagPanel

데스크톱 ≥1024px: DemoControls 좌측 320px
데스크톱 ≥1280px: FeatureFlagPanel 우측 320px

DemoControls는 데모 모드/경험/언어 3종 라디오 + 부가 버튼(온보딩 다시 보기, 푸시 시뮬, +50 XP, 셀러 추가, URL 복사).

FeatureFlagPanel은 현재 라우트의 컴포넌트 inventory 자동 표시 + planned/considering/dropped 토글. dropped 토글 시 해당 컴포넌트에 `data-feature-status="dropped"` 부여, Tailwind 선택자로 `opacity-25 grayscale`.

## i18n 누락 검증 패턴

페이지 빌드 후 자체 검증:
```bash
# 모든 t() 호출 추출
grep -rhE "t\(['\"]([^'\"]+)['\"]" src/app src/components | sed -E "s/.*t\(['\"]([^'\"]+)['\"].*/\\1/" | sort -u > /tmp/used-keys.txt

# messages 파일의 키
node -e "const k=Object.keys(require('./messages/ko.json')); ..." > /tmp/defined-keys.txt

# 차집합 → 누락
comm -23 /tmp/used-keys.txt /tmp/defined-keys.txt
```

## 모드 분기 패턴

```tsx
const { user } = useMockUser(); // demoMode 기반 currentUser
const { experience } = useExperience();

if (user.stats.cellarCount === 0) {
  return <CellarEmptyState />;
}

return <CellarList items={cellar} />;
```

## Edge Cases

- **react-simple-maps SSR:** 반드시 `dynamic(() => import('@/components/map/full-world-map'), { ssr: false })`. SSR 빌드 실패 방지.
- **검색 입력 i18n:** placeholder도 i18n 키로. 인라인 한국어 금지.
- **모달과 BottomSheet 차이:** 데스크톱은 모달, 모바일은 BottomSheet — 현재 viewport로 분기. infrastructure-builder의 BottomSheet 컴포넌트 활용.
- **빈 상태:** 첫인상이 중요하므로 빈 상태도 일러 + CTA + 안내 카피 풀세트.
- **DemoControls URL 미리보기:** 현재 모드 조합 URL을 표시 + 복사 버튼. 검수자가 동일 시안 상태를 공유하기 좋게.

## 스킬 종료 조건

- 16개 라우트 모두 빌드 통과 + 클릭 가능
- messages/{ko,en}.json 키 구조 양쪽 일치 (한쪽에만 있는 키 0)
- 영어 모드 가상 순회 시 `/[가-힯]/` 매치 0
- DemoControls와 FeatureFlagPanel 데스크톱에서 정상 동작
- `_workspace/C_page_builder_report.md` 작성
