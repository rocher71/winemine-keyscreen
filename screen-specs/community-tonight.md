# 오늘 밤 마시는 사람들 (`/community/tonight`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/community/tonight` |
| 파일 | `src/app/community/tonight/page.tsx` (295 라인) |
| 헤더 | `<BackHeader title={...}>` |
| BottomNav | 표시 (커뮤니티 탭 활성) |
| 진입 가드 | 없음 |
| Feature flag 키 | (자체 등록 가능) |

---

## 진입 경로

- `/community` Following 탭 Tonight 배너 (Moon 아이콘)

---

## 페이지 구성

### 1. 인트로 텍스트

- `${N}명이 한 잔을 들고 있어요 / ${N} people are holding a glass`

### 2. 미니 한국 지도 (320×240 SVG)

- 지역 도트 (LocalizedString 라벨):
  - 청담 / Cheongdam
  - 한남 / Hannam
  - 판교 / Pangyo
  - 강남 / Gangnam
  - 성수 / Seongsu
- 도트 클릭 시 해당 지역 유저 카드로 스크롤 (scrollIntoView)

### 3. 유저 카드 리스트 (TONIGHT_ENTRIES)

각 카드:
- 레벨 그라데이션 아바타 + 닉네임 + LevelChip
- "마시는 중: {와인명} / Drinking {wineName}"
- 장소 (예: "청담 / Cheongdam") + 세부 (예: "와인바 르팡 / Wine Bar Le Pain")
- 시간 (예: "20분 전 / 20m ago")
- 분위기 (예: "이 친구 진심이에요 / Seriously into it tonight") — LocalizedString

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `/community` |
| 지도 도트 | 클릭 | 해당 지역 유저 카드로 스크롤 |
| 유저 카드 | 클릭 | `/profile/{userId}` (or placeholder) |

---

## 상태 관리

- `selectedRegion` — useState (지도 도트 클릭 강조)
- TONIGHT_ENTRIES — mock fixture (page 인라인 또는 별도)

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| TONIGHT_ENTRIES (인라인 fixture) | 유저 카드 풀 |
| `getWine` | 와인 정보 |

---

## i18n 키 prefix

- 인라인 locale 분기 다수

---

## 빈/오류 상태

- TONIGHT_ENTRIES 0개: 안내 메시지
