# pages/ — winemine 키스크린 화면별 명세서

> 기준일: 2026-05-19
> 대상: `src/app/**/page.tsx`의 모든 라우트(39개)
> 목적: 한 화면 = 한 파일 단위로, 코드를 보지 않고도 동작·인터랙션·상태·데이터 의존성·i18n·모드 분기를 완벽히 파악할 수 있는 명세서

이 폴더는 [FEATURES.md](../FEATURES.md)를 보조하며, **각 화면을 단위로** 더 deep한 코드 레벨 정보(파일 경로·import·useState/useEffect·localStorage 키·라우팅 동작)를 정리한다.

---

## 0. 어떻게 읽으면 좋은가

각 `.md` 파일은 공통 구조를 따른다:

1. **메타 정보** — URL 경로 · 소스 파일 · 헤더 종류 · BottomNav 노출 · 진입 가드
2. **진입 경로** — 어떤 페이지에서 이리로 navigate 되는가
3. **페이지 구성** — 위에서 아래로 모든 섹션
4. **인터랙션 매트릭스** — 모든 탭/버튼/스와이프 → 결과
5. **상태 관리** — useState / Context / localStorage 키
6. **모드 분기** — first-time vs heavy · beginner vs expert · 다크 vs 라이트 · ko vs en
7. **데이터 의존성** — mock fixture · 헬퍼 함수
8. **i18n 키** — `messages/{ko,en}.json` 사용 prefix
9. **Feature flag 등록** — `useRegisterFeatures(routeKey, defs)`
10. **빈/오류 상태** — empty state · loading

---

## 1. 화면 인덱스 (39 라우트)

### Top-level (BottomNav 4탭)

| 파일 | 라우트 | 한 줄 설명 |
|---|---|---|
| [home.md](./home.md) | `/` | 홈 — heavy(peak greeting·통계·맵 cameo·커뮤니티 peek·피드) vs first-time(빈 통계+CTA) |
| [map.md](./map.md) | `/map` | 풀스크린 인터랙티브 세계 지도 + 프랑스/부르고뉴 드릴다운 + Recap PNG export |
| [cellar-list.md](./cellar-list.md) | `/cellar` | 셀러/마신 와인 2탭 + 검색·필터·정렬 + 2열 카드 그리드 |
| [community.md](./community.md) | `/community` | 5탭(Following/All/Trending/Notes/Templates) + 우하단 PenLine FAB |

### Detail (BottomNav 표시)

| 파일 | 라우트 | 한 줄 설명 |
|---|---|---|
| [cellar-detail.md](./cellar-detail.md) | `/cellar/[id]` | 셀러 아이템 상세 — 와인 헤로 + 음용 적기 + 메타 + 리뷰 + 마시기 CTA |
| [wine-detail.md](./wine-detail.md) | `/wine/[id]` | 와인 카탈로그 상세 — 내 노트·외부 평점·가격·커뮤니티 음용 적기·스토리·리뷰 |
| [wine-story.md](./wine-story.md) | `/wine/[id]/story` | 와이너리 스토리 — 헤로 + 본문 + funFact + 메타 그리드 |
| [wine-prices.md](./wine-prices.md) | `/wine/[id]/prices` | 가격 추이 차트 + 매장별 구매 기록 + "내 구매 등록" BottomSheet |
| [wine-community-peak.md](./wine-community-peak.md) | `/wine/[id]/community-peak` | 커뮤니티 음용 적기 히스토그램 + 추정자 리스트 + L3+ 가드 CTA |
| [notes-detail.md](./notes-detail.md) | `/notes/[noteId]` | 노트 read-only — 작성자/메타/WSET·아로마·여운·결함 등 차원 카드 |

### 프로필 / 자료

| 파일 | 라우트 | 한 줄 설명 |
|---|---|---|
| [profile-me.md](./profile-me.md) | `/profile` | 내 프로필 — 헤로 + StatGrid + 5개 QuickLinks |
| [profile-user.md](./profile-user.md) | `/profile/[userId]` | 타 유저 프로필 — UserMapHero + 취향 일치도 + 시음 와인 |
| [profile-ranking.md](./profile-ranking.md) | `/profile/ranking` | 현재 레벨/XP + 10종 적립 액션 + 5단계 레벨 카탈로그 |
| [favorites.md](./favorites.md) | `/favorites` | 즐겨찾기 와인 리스트 + 구매 알림 토글 |
| [badges.md](./badges.md) | `/badges` | 등급 필터 + 3열 뱃지 그리드 + 상세 BottomSheet |
| [photos.md](./photos.md) | `/photos` | 필터 + 3열 라벨 사진 그리드 + 상세 BottomSheet + 스캔 FAB |
| [notifications.md](./notifications.md) | `/notifications` | 알림 리스트 + 5종 kind 컬러바 + 모두 읽음 처리 |
| [glossary-list.md](./glossary-list.md) | `/glossary` | 카테고리 필터 + 검색 + 알파벳 정렬 용어 12종 |
| [glossary-detail.md](./glossary-detail.md) | `/glossary/[term]` | 용어 한·영 정의 + 관련 용어 |

### 노트 작성 흐름 (BottomNav 숨김)

| 파일 | 라우트 | 한 줄 설명 |
|---|---|---|
| [notes-new-source.md](./notes-new-source.md) | `/notes/new` | 노트 출처 picker (셀러/검색/새 항목) + 양식 picker |
| [notes-new-write.md](./notes-new-write.md) | `/notes/new/write` | 노트 작성 — beginner/expert/dynamic template 분기 |
| [capture.md](./capture.md) | `/capture` | 라벨 스캔 — 4 옵션 → 1.5초 mock 인식 → 노트/셀러 CTA |

### 온보딩 / 설정 / 글 쓰기

| 파일 | 라우트 | 한 줄 설명 |
|---|---|---|
| [onboarding.md](./onboarding.md) | `/onboarding` | 4스텝 (Welcome → Language → Experience → Done) |
| [settings-home.md](./settings-home.md) | `/settings` | 설정 홈 — 앱/알림/계정/정보 4섹션 |
| [settings-language.md](./settings-language.md) | `/settings/language` | 한국어 / English RadioList |
| [settings-experience.md](./settings-experience.md) | `/settings/experience` | 입문자 / 전문가 RadioList |
| [settings-notifications.md](./settings-notifications.md) | `/settings/notifications` | 4종 알림 토글 (placeholder) |
| [settings-appearance.md](./settings-appearance.md) | `/settings/appearance` | 다크 / 라이트 RadioList |
| [settings-tasting-template-list.md](./settings-tasting-template-list.md) | `/settings/tasting-template` | builtin + 내 양식 + 저장한 커뮤니티 양식 + 새 양식 카드 |
| [settings-tasting-template-new.md](./settings-tasting-template-new.md) | `/settings/tasting-template/new` | TemplateBuilder — 필드 추가/순서/삭제 |
| [settings-tasting-template-edit.md](./settings-tasting-template-edit.md) | `/settings/tasting-template/[templateId]/edit` | 편집 모드 TemplateBuilder |

### 커뮤니티 서브

| 파일 | 라우트 | 한 줄 설명 |
|---|---|---|
| [community-tonight.md](./community-tonight.md) | `/community/tonight` | 오늘 밤 마시는 사람들 — 미니 한국 지도 + 유저 카드 |
| [community-discover.md](./community-discover.md) | `/community/discover` | 취향 일치도 % 상위 유저 발견 |
| [community-post.md](./community-post.md) | `/community/[postId]` | 포스트 상세 — 본문 + 인용 와인 + ReactionBar |
| [community-post-comments.md](./community-post-comments.md) | `/community/[postId]/comments` | 댓글 리스트 + 입력 폼 (placeholder) |
| [community-new.md](./community-new.md) | `/community/new` | 글 타입 picker (5종 카드) |
| [community-new-column.md](./community-new-column.md) | `/community/new/column` | 칼럼 작성 — 제목·본문·태그·연결 와인 |
| [community-new-album.md](./community-new-album.md) | `/community/new/album` | 앨범 작성 — 사진 업로드 + 캡션 |
| [community-templates.md](./community-templates.md) | `/community/templates` | 커뮤니티 양식 둘러보기 + Bookmark 토글 |

---

## 2. 공통 인프라 (모든 페이지가 의존)

| 항목 | 파일 / 위치 |
|---|---|
| DeviceFrame · StatusBar · DynamicIsland · HomeIndicator · PushBanner | `src/components/device-frame/`, `src/components/shared/push-banner.tsx` |
| AppHeader / BackHeader / BottomNav | `src/components/nav/` |
| BottomSheet · Modal · ConfirmDialog · PlaceholderToast · EmptyState · LocaleText · GlossaryTooltip · WMBottle · WMGlassRating · LevelPill · PrimaryButton | `src/components/shared/`, `src/components/glossary/` |
| AppMode · Experience · Locale · Theme · Favorites · UserData · TastingTemplate · FeatureFlag 컨텍스트 | `src/context/` |
| Mock 데이터 19개 fixture | `src/lib/mock/` |
| 보조 라이브러리 (drink-window·xp·compatibility·regional-aromas·community-peak-aggregator·tasting-note-lexicon·recommended-wines·profile-helpers) | `src/lib/` |
| i18n 메시지 (576키 × 2 locale) | `messages/ko.json`, `messages/en.json` |

자세한 인벤토리는 [FEATURES.md §4·§7·§8·§9](../FEATURES.md)를 참조한다.

---

## 3. 라우트 가드 / BottomNav 정책

- **BottomNav 자동 숨김 prefix**: `/onboarding`, `/capture`, `/notes/new` (`/notes/new/write` 포함)
- **활성 탭 결정 로직** (BottomNav 내부):
  - `/` → home / `/map*` → map / `/cellar*` → cellar / `/community*` → community
  - `/profile`, `/favorites`, `/badges`, `/photos`, `/notifications`, `/settings*`, `/wine/*`, `/notes/[noteId]` → **활성 탭 없음**
- **자동 리다이렉트**:
  - `/` 진입 시 `demoMode==='first-time' && !localStorage.winemine.onboardingComplete` → `/onboarding`
  - `/onboarding` 진입 시 `demoMode==='heavy'` 또는 완료 플래그 true → `/`
