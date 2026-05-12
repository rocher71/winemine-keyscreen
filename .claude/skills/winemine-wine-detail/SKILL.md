---
name: winemine-wine-detail
description: winemine 키스크린의 와인 상세 페이지 계열 4개 라우트(/wine/[id], /wine/[id]/story, /wine/[id]/community-peak, /wine/[id]/prices)와 복잡 카드 4종(PriceChart Recharts LineChart, ExternalRatingsCard Vivino/WineSearcher/CellarTracker, WineStoryCard 와이너리 역사, CommunityDrinkWindowCard 사용자 추정 음용 적기 히스토그램)을 구현하는 스킬. 베타 피드백 7항목 중 4항목이 집중되는 화면. 다음 키워드에서 반드시 트리거: '와인 상세 페이지', '가격 추이 그래프', 'PriceChart', 'Recharts LineChart', '외부 평점 카드', 'Vivino Wine Searcher CellarTracker', '와이너리 스토리', '커뮤니티 음용 적기', 'Community drinking window', '와인 디테일 deep page'. 후속 작업으로 '가격 차트 색 바꿔', '리뷰 카드 정렬 수정'도 트리거.
---

# winemine-wine-detail — 와인 상세 + 복잡 카드

## 목적

와인 상세 페이지 계열 4개 라우트와 복잡 카드 4종을 구현. 베타 피드백 7항목 중 4항목(외부 평점·와이너리 스토리·커뮤니티 피크·가격 추이)이 이 화면에 집중되어 별도 스킬로 분리.

## Why 별도 스킬?

- Recharts 시각화는 라이브러리 특화 (Tooltip 커스텀, ReferenceLine, dynamic import 등)
- CommunityPeakAggregate 시각화는 mock-data-architect의 community-peak-aggregator.ts와 긴밀
- 와인 스토리 본문은 GlossaryTooltip 인라인 (i)이 5~10곳 — 일관성 필요
- 4개 라우트가 같은 wineId 기반이라 헬퍼·hook 공유

## 라우트 4개

### 1. `/wine/[id]` — 메인 상세

위에서 아래 순:
- BackHeader (와인명 + 우측 즐겨찾기 Star toggle)
- WineHeader (라벨 일러 + 와인명 + 생산자 + 빈티지 + 지역/국가 + wineType/grape 칩 + 우하단 ServingTemp 칩)
- ExternalRatingsCard (Vivino + WS + CT + 글로벌 평균가) — null이면 빈 상태
- AveragePricePill (평균가 + 등록 건수)
- PriceChart (240px Recharts LineChart + 평균선 + 기간 토글)
- CommunityDrinkWindowCard (히스토그램 + 평균 + 중앙값 + 시스템 비교 + "상세보기" 링크)
- WineStoryCard (와이너리 이름 + 위치 + 본문 발췌 + Lightbulb funFact hover + "더 읽기")
- ReviewsSection (LevelPill + ReviewBadge 동반 리뷰 카드 5개)
- AddToCellarCTA (하단 고정 또는 inline)

### 2. `/wine/[id]/prices` — 가격 상세

- 큰 PriceChart (전체 기간)
- 매장별 그룹 리스트 (Store 14개 분배)
- 각 항목: 매장명 + 지점 + 가격 + 구매일 + 작성자 익명화 (Lv·뱃지만)
- 정렬 토글 (가격 낮은 순/최근 순)
- 하단 "내 구매 정보 등록" CTA → BottomSheet 폼 → +5 XP

### 3. `/wine/[id]/story` — 와이너리 스토리

- BackHeader "와이너리 이야기 / Winery story"
- Hero (producerPhotoUrl placeholder + 와이너리 이름 + 설립 + 위치)
- 히스토리 본문 (LocalizedString, 3~4문단)
  - **본문 내 도메인 용어에 GlossaryTooltip (i) 인라인** — "1855 등급 분류", "그랑크뤼", "아펠라시옹", "떼루아" 등
- FunFact 카드 (Gold 보더 + Lightbulb 아이콘)
- Philosophy 단락
- 메타 그리드 2×2 (설립년/포도밭 면적/주요 품종/연 생산량)

### 4. `/wine/[id]/community-peak` — 커뮤니티 피크 상세

- 인트로 카드 ("L3+ 사용자가 추정한 값" + 가중치 안내)
- 큰 히스토그램 (280px) — 연도별 막대 + 평균/중앙값/시스템 마커
- 추정자 리스트 (mock 30+ 명, 익명화 "Connoisseur #14")
- 정렬 토글 (최근/레벨 높은 순)
- 하단 "내 추정 추가" CTA — L3+ 사용자만 활성

## 복잡 카드 4종 상세

### PriceChart (Recharts)

```tsx
'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('./price-chart-inner'), { ssr: false });

// inner:
<LineChart data={purchases}>
  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" opacity={0.4} />
  <XAxis dataKey="purchasedAt" tick={{ fill: 'var(--color-text-muted)' }} />
  <YAxis tick={{ fill: 'var(--color-text-muted)' }} />
  <Tooltip content={<CustomTooltip />} />
  <ReferenceLine y={avgPrice} stroke="var(--color-gold)" strokeDasharray="4 4" />
  <Line type="monotone" dataKey="priceKrw" stroke="var(--color-wine-red)" strokeWidth={2} dot={{ fill: 'var(--color-gold)', r: 4 }} />
</LineChart>
```

CustomTooltip은 매장명·일자·작성자(익명화) 노출.

### ExternalRatingsCard

3개 RatingPill 가로 배치:
- Vivino: ★4.5 + "12,450 reviews"
- WineSearcher: 93/100 + priceRank
- CellarTracker: 92/100 + reviewCount
- 우측 끝 글로벌 평균가 $480

null 와인: 빈 상태 텍스트 "외부 평점 없음 / No external ratings".

### WineStoryCard

240px 카드, 좌상단 "와이너리 이야기" 라벨, 큰 제목, 위치, 본문 2~3문장 발췌. Lightbulb 아이콘 hover 시 funFact 미리보기. "더 읽기" 우하단 → /wine/[id]/story.

### CommunityDrinkWindowCard

```tsx
// 가로 막대 히스토그램 (Recharts BarChart 또는 SVG)
<BarChart data={aggregate.distribution}>
  <XAxis dataKey="year" />
  <YAxis />
  <Bar dataKey="count" fill="var(--color-wine-red)" />
  <ReferenceLine x={aggregate.systemPeakYear} stroke="var(--color-gold)" strokeDasharray="4 4" />
  <ReferenceLine x={aggregate.meanPeakYear} stroke="var(--color-wine-red)" />
  <ReferenceLine x={aggregate.medianPeakYear} stroke="var(--color-cream)" strokeDasharray="2 2" />
</BarChart>

상단 텍스트: "평균 {meanPeakYear} · 중앙값 {medianPeakYear}"
응답 카피: "{count}명 중 {pct}%가 {minYear}~{maxYear} 사이 추천"
```

`aggregate`는 `lib/community-peak-aggregator.ts`의 `aggregateCommunityPeaks(communityPeaks.filter(wineId === ...))` 호출.

## 익명화 정책

community-peak의 reviewer 표시 형식:
- 닉네임 → `{LevelName} #{anonId}` (예: "Connoisseur #14")
- anonId는 userId의 hash 또는 mock 시드
- 클릭 시 /profile/[userId]로 이동 가능 (시안에서는 익명 표기만 유지)

reviews_section과 price-detail의 작성자도 동일 정책 (단, reviews는 review-card의 LevelPill + ReviewBadge 표시 유지).

## i18n 키 export

신규 키 `wineDetail.*`, `wineStory.*`, `externalRatings.*`, `communityPeak.*`를 `_workspace/C_wine_detail_i18n_keys.json`에 ko/en 양쪽 채워서 저장. page-builder가 흡수.

## Edge Cases

- **wine.id가 fixture에 없음:** /wine/[bad-id] 접근 시 404 안내 페이지 + "홈으로" 버튼
- **wine.externalRatingsId === null:** ExternalRatingsCard에 빈 상태
- **wine.storyId === null:** WineStoryCard 자체 숨김 또는 "Coming soon"
- **community-peaks 데이터 0건:** "아직 추정 데이터가 부족해요" 안내
- **Recharts dark theme:** Tooltip 배경이 흰색 default → 커스텀 Tooltip 컴포넌트 필수
- **L3 미만 사용자 "내 추정 추가":** 버튼 disabled + 안내, /wine/[id]에서도 PeakEtaInput Step 7 비활성 동기화

## 스킬 종료 조건

- 4 라우트 + 4 카드 모두 동작
- Recharts SSR 안전 (dynamic import + ssr:false)
- LevelPill + ReviewBadge 동반 표시 규칙 준수
- 신규 i18n 키 ko/en 양쪽 export
- `_workspace/C_wine_detail_report.md` 작성
