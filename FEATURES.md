# winemine 키스크린 — 현재 구현된 기능 목록

> 기준일: 2026-05-13 (최종 업데이트)
> 대상: `src/` 전체 코드 기반 실제 구현 확인

---

## 라우트 일람 (33개)

| 경로 | 설명 |
|------|------|
| `/` | 홈 |
| `/map` | 세계 지도 |
| `/cellar` | 셀러 리스트 |
| `/cellar/[id]` | 셀러 아이템 상세 |
| `/wine/[id]` | 와인 상세 |
| `/wine/[id]/story` | 와이너리 스토리 |
| `/wine/[id]/prices` | 가격 상세 |
| `/wine/[id]/community-peak` | 커뮤니티 음용 적기 상세 |
| `/notes/new` | 노트 출처 선택 |
| `/notes/new/write` | 노트 작성 |
| `/capture` | 라벨 스캔 |
| `/profile` | 내 프로필 |
| `/profile/[userId]` | 타 유저 프로필 |
| `/profile/ranking` | 랭킹 상세 (XP·레벨) |
| `/favorites` | 즐겨찾기 |
| `/badges` | 뱃지 진열장 |
| `/photos` | 라벨 사진 갤러리 |
| `/notifications` | 알림 리스트 |
| `/glossary` | 와인 용어 사전 |
| `/glossary/[term]` | 용어 상세 |
| `/onboarding` | 온보딩 (첫 실행) |
| `/settings` | 설정 홈 |
| `/settings/language` | 언어 설정 |
| `/settings/experience` | 경험 수준 설정 |
| `/settings/notifications` | 알림 설정 |
| `/community` | 커뮤니티 피드 |
| `/community/discover` | 취향 맞는 유저 발견 |
| `/community/tonight` | 지금 마시는 사람들 |
| `/community/new` | 새 글 작성 선택 |
| `/community/new/column` | 칼럼 작성 |
| `/community/new/album` | 앨범 작성 |
| `/community/[postId]` | 포스트 상세 |
| `/community/[postId]/comments` | 댓글 |

---

## 페이지별 기능 상세

### 홈 (`/`)

**heavy 모드 (기존 사용자)**
- 에디토리얼 인사말 ("오늘의 셀러" eyebrow + Playfair 개인화 인사)
- StatHero — 방문 국가 / 마신 와인 / 작성 노트 3열 카드 그리드 (아이콘 포함)
- LevelProgressBar — 골드 glow 그라데이션 진척도 바 + XP 힌트 텍스트 (클릭 시 `/badges`)
- 세계지도 cameo — 방문 국가 도트 정적 미니맵 + `/map` 링크
- NotificationFeed — 최근 알림 미리보기 스트립
- RecentNotesStrip — WMBottle + WMGlassRating 카드형 수평 스크롤
- WineFeed — 추천/트렌딩/탐험 탭 + WMBottle SVG + WMGlassRating 리스트
- CommunityShortcutCard — 커뮤니티 진입 숏컷
- QuickActions — 주요 액션 바로가기 버튼들

**first-time 모드 (신규 사용자)**
- FirstTimeGreeting — 사용자 이름 포함 환영 메시지
- EmptyStatHero — 빈 통계 (0/0/0) + 첫 스캔 유도 문구
- SuggestedActions — 첫 액션 제안 카드들
- WineFeed — 동일 (탭형 와인 피드)

**공통**
- AppHeader — WMLogoMark(와인잔 SVG) + "wine·mine" 워드마크(골드 점) + 벨 + 레벨 칩
- 온보딩 미완료 first-time 유저는 `/onboarding`으로 자동 리다이렉트

---

### 세계 지도 (`/map`)

- react-simple-maps 기반 인터랙티브 세계 지도 (dynamic import, SSR 비활성)
- heavy 모드: 마신 와인 + 셀러 와인 국가를 Wine Red로 채색
- first-time 모드: 빈 지도 + 카메라 SVG + 골드 테두리 "첫 스캔" 유도 패널
- **필터 바**: 전체 / 마신 와인 / 셀러 / 즐겨찾기 칩 + 슬라이더 아이콘 버튼
- 국가 클릭 시 CountryDetailPanel (BottomSheet):
  - 국가명 + 병 수 뱃지 + 지역 수 / 마신 수 스탯 미니 그리드
  - 지역 리스트 → 와인 리스트 드릴다운 (WMBottle 와인 행)
- MapLegend — 색상 범례
- AppHeader 사용 (지도 페이지도 로고·알림·레벨칩 표시)

---

### 셀러 리스트 (`/cellar`)

**내 셀러 / 마신 와인 세그먼트 탭** (타이틀 바에 병 수 뱃지 포함)

**내 셀러 탭**
- 검색 입력 — 이름·생산자·지역·국가·아펠라시옹·품종·빈티지 전문 검색
- 와인 타입 필터 칩 — all / red / white / sparkling / rosé / fortified (색상 도트 포함)
- 정렬 칩 — 최근 등록 / 음용 시기 임박 / 빈티지 / 지역 / 보관 장소 / 가격
- 결과 카운트 텍스트 + "필터 초기화" 버튼 (필터 적용 시 노출)
- 2열 그리드 CellarCard — WMBottle SVG + 와인 타입 색 dot + 음용 시기 배지
- "셀러에 추가" 버튼 (PlaceholderToast)
- 빈 상태 EmptyState (보유 와인 없을 때)
- 검색·필터 결과 없음 상태 (NoResults + 초기화 버튼)

**마신 와인 탭** ← 신규
- 테이스팅 노트 기반 시음 기록 리스트 (wineId 기준 dedup, 최근 노트 1건)
- 검색 (이름·생산자·지역·빈티지)
- TastedWineRow — WMBottle + 와인 메타 + 내 테이스팅 노트 인라인 미리보기:
  - 입문자: WMGlassRating + 아로마 힌트
  - 전문가: 평점(/100) + 산도·바디·타닌·단맛 4차원 미니 그리드
- "노트 편집" (→ `/notes/new/write`) + "와인 상세" (→ `/wine/[id]`) 버튼

---

### 셀러 아이템 상세 (`/cellar/[id]`)

- 와인 헤로 (240px 그라디언트 배경 + WineLabelArt + 이름·생산자·빈티지·지역)
- 음용 적기 카드 (DrinkWindowBadge + 타임라인 바: from→peak→to + 현재 위치 점)
- 음용 최적 시기 텍스트 + "피크까지 N년" 표시
- 알림 토글 스위치 — "피크 도달 시 알림" (토스트 피드백)
- 메타 그리드 2×2 — 보관 장소 / 취득일 / 구매 가격 / 메모
- 커뮤니티 리뷰 섹션 (최대 3건 ReviewCard + "와인 상세 보기" 링크)
- 하단 고정 "마시기" CTA 버튼 (DrinkThisButton)

---

### 와인 상세 (`/wine/[id]`)

- BackHeader + 즐겨찾기 토글 버튼 (FavoriteToggle, localStorage 연동)
- WineHeader — 라디얼 그라데이션 히어로 + **WMBottle** 중앙 배치(88×290) + 와인 타입 dot + 메타
- MyTastingNoteCard — localStorage 기반 내 노트 카드 (있을 때만 노출, 커뮤니티 비교 인사이트 포함)
- **WriteNoteCta** — 내 노트 없을 때 자동 표시되는 "노트 작성" CTA 카드 ← 신규
- ExternalRatingsCard — Vivino·Wine Searcher·CellarTracker 점수 표시
- AveragePricePill — 평균 가격 (₩ 단위) 칩
- PriceChart (compact) — Recharts LineChart 가격 추이 그래프
- CommunityDrinkWindowCard — 커뮤니티 음용 적기 히스토그램 (compact)
- WineStoryCard — 와이너리 스토리 요약 카드 (full 페이지 링크 포함)
- ReviewList — 커뮤니티 리뷰 리스트
- AddToCellarCta — "내 셀러에 추가" 인라인 버튼

---

### 와이너리 스토리 (`/wine/[id]/story`)

- StoryImage 헤로 (와이너리 이름·설립 연도·위치)
- History 본문 (3~4문단, LocalizedString ko/en)
- 인라인 GlossaryTooltip 연결 (전문 용어 최소 5곳)
- FunFact 카드 (Gold 보더 + Lightbulb 아이콘)
- Philosophy 단락 (데이터 있을 때만)
- 메타 그리드 2×2 — 설립 연도 / 포도밭 면적 / 주요 품종 / 연 생산량
- "이 와인 다시 보기" CTA → `/wine/[id]`
- story 없을 때 빈 상태 페이지

---

### 가격 상세 (`/wine/[id]/prices`)

- PriceChart (full, 전체 기간) — Recharts LineChart
- PriceDetailTable — 매장별 구매 기록 그룹 리스트 (작성자 익명화, LevelPill만 표시)
- "내 구매 정보 등록" 하단 고정 CTA — BottomSheet 폼 연결 (+5 XP 토스트)

---

### 커뮤니티 음용 적기 상세 (`/wine/[id]/community-peak`)

- 인트로 카드 (L3+ 참여 안내 + 가중치 설명)
- 큰 히스토그램 (280px) — PeakDistribution (시스템 추정·평균·중앙값 마커)
- 추정자 리스트 ContributorsList (익명화: "{LevelName} #{anonId}")
- "내 추정 추가" 하단 고정 CTA (L3+ 레벨만 활성)

---

### 노트 출처 선택 (`/notes/new`)

- SourcePicker — 3가지 출처 선택 카드:
  - 셀러에서 선택 (보유 병 수 배지 표시)
  - 새로 검색 (PlaceholderToast)
  - 새 항목 입력
- 셀러에서 선택 시 BottomSheet로 셀러 아이템 리스트 노출 → 선택하면 write 화면으로 이동

---

### 노트 작성 (`/notes/new/write`)

경험 모드에 따라 두 가지 폼 분기:

**입문자 모드 (BeginnerNote)**
- 와인명·생산자 표시
- 별점 (1~5 하트)
- 향 느낌 체크박스 (과일/꽃/나무/흙/기타)
- 맛 느낌 라디오 (가벼움~진함, 단맛, 신맛, 탄닌)
- 자유 메모
- 서빙 온도 입력 (ServingTempInput)
- 자동 묘사 박스 (AutoDescription) — 선택에 따라 한·영 묘사 자동 생성
- 사진 첨부 (PlaceholderToast)

**전문가 모드 (ExpertNote)**
- WSET 4축 슬라이더 — 산도·탄닌·알코올·바디 (WSETSlider)
- 아로마 휠 (AromaWheel) — UC Davis 계통 3레벨 선택
- 여운 측정기 (CaudalieMeter) — 1~30초 슬라이더
- 결함 체크리스트 (FaultChecklist)
- 오프닝 타임라인 (OpeningTimeline) — 디캔팅 권장 시간
- 탄닌 패널 (TanninPanel) — red 전용
- 기포 패널 (BubblePanel) — sparkling 전용
- 지역 아로마 힌트 (RegionalAromaHints) — 산지별 대표 아로마 칩
- 자동 묘사 박스 (AutoDescription)
- 블라인드 모드 (BlindMode) — 와인 정보 숨김 + 추측 입력
- 음용 적기 ETA 입력 (PeakEtaInput)
- 서빙 온도 입력 (ServingTempInput)
- 100점 환산 평점
- 별도 자유 메모

---

### 라벨 스캔 (`/capture`)

> 시안 단계 — 실제 카메라/파일 처리 없이 1.5초 mock 분석으로 시연

- 4개 옵션 카드 — 카메라 스캔 / 갤러리에서 / 내 라이브러리 / 메뉴얼 입력
- AI 분석 시뮬레이션 화면 (로딩 애니메이션)
- 인식 결과 카드 — 와인명·생산자·빈티지·지역·외부 평점 표시
- 결과에서 "노트 작성" → `/notes/new/write?from=newEntry&wineId=...`
- 결과에서 "셀러에 추가" → localStorage 저장 + XP 토스트
- 다시 스캔 / 직접 입력 버튼

---

### 내 프로필 (`/profile`)

- ProfileHero — 아바타·닉네임·레벨 칩·가입일
- StatGrid — 마신 와인 수·방문 국가·탐험 지역·노트 수·셀러 병 수 (localStorage 머지)
- QuickLinks — 즐겨찾기 / 뱃지 / 사진 / 랭킹 / 지도 바로가기

---

### 타 유저 프로필 (`/profile/[userId]`)

- UserMapHero — 해당 유저가 방문한 국가 미니맵 + 통계
- TasteCompatibilityCard — 나와의 취향 일치도 점수 (공유 와인·공유 지역 기반)
- 시음 와인 리스트 — 최근순 / 평점순 정렬 탭
- 팔로우 버튼 (PlaceholderToast)

---

### 랭킹 상세 (`/profile/ranking`)

- 현재 레벨 카드 — 레벨명·XP·다음 레벨까지 진척도 바
- XP 적립 방법 전체 목록 — 노트 작성·셀러 추가·스캔·국가 첫 방문 등 아이콘+XP량 표시
- 5단계 레벨 카탈로그 — 브론즈~플래티넘 각 혜택 카드

---

### 즐겨찾기 (`/favorites`)

- 즐겨찾기 와인 리스트 — 와인명·지역·평점 표시
- "구매 시 알림" 토글 (아이템별)
- 와인 상세 링크
- 빈 상태 EmptyState

---

### 뱃지 진열장 (`/badges`)

- 등급 필터 칩 — all / bronze / silver / gold / platinum
- 뱃지 그리드 — 보유/미보유 상태 시각화 (미보유는 Lock 아이콘 흐림 처리)
- 뱃지 클릭 → BottomSheet 상세 (이름·설명·획득 조건·획득일)
- 보유 수 / 전체 수 카운트 표시

---

### 라벨 사진 갤러리 (`/photos`)

- 필터 바 — all / 올해 / 셀러 연결됨 / 마신 와인 / 미매칭
- 사진 그리드 (PhotoCard) — 와인명·날짜 표시
- 사진 클릭 → BottomSheet 상세 (와인 링크·셀러/노트 연결 정보)
- "스캔 추가" 버튼 → `/capture`
- 빈 상태 EmptyState

---

### 알림 리스트 (`/notifications`)

- 알림 타입별 NotificationRow — 아이콘·제목·시간 상대 표시
- "모두 읽음 처리" 버튼 (토스트 피드백)
- 읽음/미읽음 상태 시각 구분
- 빈 상태 EmptyState

---

### 와인 용어 사전 (`/glossary`)

- 카테고리 필터 칩 — all / sensory / fault / classification / technique / unit (카테고리별 아이콘)
- 텍스트 검색 — 한·영 용어명 + 정의 전문 검색
- 알파벳 정렬 용어 리스트 (카테고리 아이콘 + 한·영 병기)
- 용어 클릭 → `/glossary/[term]`

---

### 용어 상세 (`/glossary/[term]`)

- 용어명 (한·영) + 카테고리 배지
- 정의 본문
- 관련 용어 링크

---

### 온보딩 (`/onboarding`)

4단계 스텝 플로우:
1. **Welcome** — 서비스 소개 + 시작 버튼
2. **Language** — 한국어 / English 선택 (locale-context 즉시 반영)
3. **Experience** — 입문자 / 전문가 선택 (experience-context 즉시 반영)
4. **Done** — 완료 화면 + "시작하기" 버튼

- 완료 후 `localStorage.winemine.onboardingComplete = 'true'` 저장 → 홈으로 이동
- heavy 모드 또는 완료된 유저 접근 시 `/`로 리다이렉트

---

### 설정 (`/settings`, `/settings/*`)

**설정 홈**
- 앱 섹션: 언어 설정 / 경험 수준 설정 (현재 값 표시)
- 알림 섹션: 알림 설정 링크
- 계정 섹션: 닉네임 변경 (PlaceholderToast) / 로그아웃 (PlaceholderToast) / 계정 삭제 (PlaceholderToast)
- 정보 섹션: 버전·약관·개인정보처리방침

**언어 설정 (`/settings/language`)**
- RadioList — 한국어 / English
- 선택 즉시 locale-context 반영 + 토스트

**경험 수준 설정 (`/settings/experience`)**
- RadioList — 입문자 / 전문가 (설명 포함)
- 선택 즉시 experience-context 반영 + 토스트

**알림 설정 (`/settings/notifications`)**
- ToggleRow 목록 — 음용 적기 알림 / 가격 변동 / 커뮤니티 활동 등

---

## 크로스커팅 동작 규칙

### 언어 (Locale)

- 앱 언어는 **한국어 / English** 두 가지이며, 온보딩 및 `/settings/language`에서 전환 가능
- 전환은 즉시 적용 (페이지 새로고침 없이 locale-context 반영)
- **영어 모드에서 한글은 단 한 글자도 화면에 노출되지 않아야 한다** — 와인명·생산자·지역·알림 문구·뱃지 설명·용어 정의 등 모든 사용자 노출 문자열에 적용. 한국어 모드에서 영어 병기(예: 지역명 병기)는 허용.
- LocalizedString `{ ko, en }` 패턴으로 모든 도메인 데이터 이중화. `LocaleText` 컴포넌트가 locale에 따라 분기 렌더.

### 레벨·뱃지 표시 규칙 (커뮤니티 콘텐츠)

모든 사용자 생성 콘텐츠에는 작성자의 레벨 칩(LevelPill)이 함께 노출된다. 적용 범위:

| 콘텐츠 유형 | 표시 위치 |
|-------------|-----------|
| 커뮤니티 리뷰 (ReviewCard) | 작성자 행 우측 |
| 가격 구매 기록 (PriceDetailTable) | 작성자 익명화 행 (`LevelName #anonId`) |
| 커뮤니티 음용 적기 추정 (ContributorsList) | 추정자 행 |
| 테이스팅 노트 공개 시 (향후 Phase 3) | 피드 카드 작성자 영역 |

→ 전문성이 높은 레벨의 리뷰·추정값이 시각적으로 구분되어 신뢰도 맥락 제공.

### 즐겨찾기 구매 알림 플로우

즐겨찾기한 와인에 다른 유저의 구매 정보가 축적되면 알림이 발송되는 엔드투엔드 플로우:

```
즐겨찾기 등록 (/favorites에서 "구매 시 알림" 토글 ON)
      ↓
다른 유저가 해당 와인 구매 정보 등록 (셀러 추가/노트 작성 시 가격 입력)
      ↓
구매 기록 수 임계치 도달 시 → 푸시 알림 발송
    알림 문구: "누군가 [와인명]을 [가격]에 구매했어요!"
      ↓
알림 탭 → NotificationRow 클릭
      ↓
/wine/[id] — 와인 상세 페이지
      ↓
PriceChart(compact) 또는 "가격 추이 상세보기" 버튼
      ↓
/wine/[id]/prices — PriceDetailTable (매장명·지점·가격·날짜·작성자 레벨)
```

- 알림은 `/notifications` 리스트에도 수신함에 쌓임
- 빈티지·희소성 높은 와인일수록 가격 추이 모니터링 용도로 활용

---

## 공통 인프라 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| DeviceFrame | iPhone 390×844 목업 프레임 + Dynamic Island + Home Indicator |
| StatusBar | 상단 상태바 (시간·신호·배터리) |
| AppHeader | 홈 계열 상단 헤더 (로고·알림·아바타) |
| BackHeader | 서브 페이지 뒤로가기 헤더 |
| BottomNav | 하단 5탭 네비게이션 (홈·지도·스캔·프로필·셀러) |
| BottomSheet | 슬라이드업 모달 |
| ConfirmDialog | 확인/취소 다이얼로그 |
| PlaceholderToast | 미구현 기능 토스트 피드백 |
| Modal | 범용 모달 |
| EmptyState | 빈 상태 일러스트 + 텍스트 + 액션 |
| LocaleText | LocalizedString ko/en 분기 렌더 |
| GlossaryTooltip | 인라인 (i) 버튼 → 용어 정의 팝업 |
| LevelPill | 레벨 배지 칩 |
| LevelProgressBar | XP 진척도 바 |
| WineLabelArt | SVG 와인 라벨 아트 플레이스홀더 |
| **WMBottle** | 와인 병 SVG 일러스트 (포일캡·골드칼라·라벨 텍스트·빈티지) ← 신규 |
| **WMGlassRating** | 와인잔 5개 아이콘 평점 (half 지원, Star 대체) ← 신규 |
| ReviewBadge | 외부 평점 배지 |
| PrimaryButton | 주요 CTA 버튼 |
| PageBackground | 페이지 배경 그라디언트 |

---

### 커뮤니티 (`/community`)

**피드 (`/community`)**
- 탭: 팔로잉 / 전체 / 트렌딩
- 타입 필터 칩: all / note / question / column / news / album
- CommFeedCard — 포스트 카드 (타입 배지·작성자 아바타·좋아요)
- CommFeedRow — 컴팩트 행 뷰
- 상단 Today's Pick 카드 (골드 테두리 하이라이트)
- CommunityShortcutCard — 홈에서 진입하는 커뮤니티 숏컷 카드

**오늘 밤 마시는 사람들 (`/community/tonight`)**
- 지금 와인 마시는 유저 실시간 피드
- 미니 지도 위 지역 도트 (청담·한남·판교 등)
- 유저 아바타 + 와인명 + 장소 + 시간 + 분위기

**취향 맞는 유저 발견 (`/community/discover`)**
- 취향 일치도 % 상위 유저 리스트
- 공통 산지·품종 태그 미리보기

**포스트 상세 (`/community/[postId]`)**
- 포스트 본문 + 작성자 정보 + 연결 와인 카드
- 좋아요 / 댓글 수

**댓글 (`/community/[postId]/comments`)**
- 댓글 리스트 (작성자 레벨 칩 + 타임스탬프)
- 댓글 입력 폼 (PlaceholderToast)

**글 작성 (`/community/new`)**
- 글 타입 선택: 시음 노트 / 질문 / 칼럼 / 뉴스 / 앨범
- 칼럼 작성 (`/community/new/column`) — 제목·본문·태그·와인 연결
- 앨범 작성 (`/community/new/album`) — 사진 업로드 + 캡션

---

## 데모 개발 도구

| 컴포넌트 | 역할 |
|----------|------|
| DemoControls | 데스크톱 좌측 — demo 모드(first-time / heavy) 전환 |
| FeatureFlagPanel | 데스크톱 우측 — 현재 라우트의 기능별 status 토글 |

---

## 앱 전역 상태 (Context)

| 컨텍스트 | 저장소 | 역할 |
|----------|--------|------|
| AppModeContext | localStorage + URL param `?demo=` | first-time / heavy 모드 전환 |
| ExperienceContext | localStorage | beginner / expert 경험 수준 |
| LocaleContext | localStorage | ko / en 언어 |
| FavoritesContext | localStorage | 즐겨찾기 와인 목록 |
| UserDataContext | localStorage | 사용자 추가 셀러·노트 (mock 머지) |
| FeatureFlagContext | in-memory | 라우트별 기능 status 관리 |

---

## Mock 데이터 (src/lib/mock/)

| 파일 | 데이터 |
|------|--------|
| wines.ts | 와인 카탈로그 (30종+, LocalizedString) |
| users.ts | 사용자 2명 — heavy(풍부) / first-time(빈 컬렉션) |
| cellar.ts | 셀러 아이템 목록 |
| tasting-notes.ts | 테이스팅 노트 |
| purchases.ts | 구매 기록 (가격 추이 데이터) |
| stores.ts | 와인 판매점 14개 |
| notifications.ts | 알림 목록 |
| favorites.ts | 즐겨찾기 목록 |
| badges.ts | 뱃지 카탈로그 |
| levels.ts | 5단계 레벨 정의 |
| reviews.ts | 커뮤니티 리뷰 |
| wine-stories.ts | 와이너리 스토리 본문 |
| external-ratings.ts | Vivino·WS·CT 외부 평점 |
| community-peaks.ts | 커뮤니티 음용 적기 추정 데이터 |
| label-photos.ts | 라벨 사진 메타데이터 |
| glossary.ts | 와인 용어 사전 |

---

## 보조 라이브러리 (src/lib/)

| 파일 | 역할 |
|------|------|
| drink-window.ts | 와인별 음용 적기 계산 (from·peak·to·status) |
| xp.ts | XP 적립 액션 정의 + 레벨 계산 함수 |
| compatibility.ts | 두 유저 간 취향 일치도 점수 계산 |
| regional-aromas.ts | 산지별 대표 아로마 칩 매핑 |
| community-peak-aggregator.ts | 커뮤니티 추정 → 히스토그램 집계 |
| tasting-note-lexicon.ts | UC Davis 아로마 휠·WSET 디스크립터·결함 카탈로그 |
| recommended-wines.ts | 입문용 추천 와인 (STARTING_WINE + 6개국) |

---

## 기술 스택

- **Next.js 15** App Router (TypeScript strict)
- **Tailwind CSS v4**
- **next-intl** — 한/영 i18n (`messages/ko.json`, `messages/en.json`)
- **react-simple-maps v3** — 세계 지도 (dynamic import, SSR 비활성)
- **Recharts** — PriceChart LineChart
- **Framer Motion** — 온보딩·트랜지션 애니메이션
- **lucide-react** — 아이콘
- **localStorage** — 데모 상태 영속화 (demo 모드·locale·experience·즐겨찾기·사용자 추가 데이터)
