# 라벨 사진 갤러리 (`/photos`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/photos` |
| 파일 | `src/app/photos/page.tsx` (247 라인) |
| 헤더 | `<BackHeader title={t('title')}>` + 우측 `<Search size={20}>` 검색 버튼 |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | 없음 |
| Feature flag 키 | `/photos` — `photos.filterBar`, `photos.grid` |
| 베타 피드백 #6 | 라벨 사진 갤러리 |

---

## 진입 경로

- `/profile` QuickLinks "사진"
- `/capture` "내 라이브러리" 카드
- 노트 상세 (간접)

---

## 페이지 구성

### 1. BackHeader + 우측 Search 버튼

- 우측 32×32 transparent 버튼 + `<Search size={20} strokeWidth={1.75}>`
- 클릭 시 `toast({ message: t('searchToast') })` PlaceholderToast

### 2. 빈 상태 (`all.length === 0`)

`<EmptyState illustration={<Camera size={56} strokeWidth={1.25}/>} title={t('empty.title')} description={t('empty.sub')} action={<PrimaryButton onClick={...}>}>`
- 타이틀: "사진이 없어요 / No photos yet"
- 설명: "스캔으로 라벨을 찍어 갤러리에 추가하세요 / Scan a label to add it"
- CTA: `t('empty.cta')` → `router.push('/capture')`

### 3. Filter Bar (수평 스크롤)

`data-feature-id="photos.filterBar"` (gap 8, padding `8px 16px 12px`)

`FilterKey = 'all' | 'thisYear' | 'inCellar' | 'tasted' | 'byRegion' | 'unmatched'`

칩 라벨 (`tFilters(k)`):
- 전체 / All
- 올해 / This year
- 셀러 연결됨 / In cellar
- 마신 와인 / Tasted
- 지역별 / By region
- 미매칭 / Unmatched

각 칩 활성: 와인레드 bg / 비활성: transparent + default border.

**필터 로직**:
```ts
switch (filter) {
  case 'thisYear': return all.filter(p => new Date(p.capturedAt).getFullYear() === year);
  case 'inCellar': return all.filter(p => p.linkedCellarItemId != null);
  case 'tasted':   return all.filter(p => p.linkedTastingNoteId != null);
  case 'unmatched': return all.filter(p => p.wineId == null);
  case 'byRegion':
  case 'all':       return all;
}
```

> `byRegion`은 현재 별도 그룹화 없이 all 반환 — 향후 region별 grouping 추가 가능.

### 4. Photo Grid 3열 (gap 8, padding `0 16px 24px`)

`data-feature-id="photos.grid"`

`<PhotoCard photo={p} onClick={() => setSelected(p)} />`:
- 사진 (square aspect, 라벨 이미지)
- 와인명 (있을 때)
- 날짜 `capturedAt.slice(0, 10)`

### 5. Photo Detail BottomSheet (selected !== null)

`<BottomSheet open={selected !== null} onClose={() => setSelected(null)}>`:

- **큰 사진** (max width, aspect-ratio 유지)
- **연결된 와인** (`selected.wineId` 있을 때):
  - `<Link href={`/wine/${wineId}`}>` "와인 상세 보기 →" 골드 링크
  - 와인명·생산자·빈티지·지역
- **연결된 셀러 아이템** (`linkedCellarItemId` 있을 때):
  - `<Link href={`/cellar/${linkedCellarItemId}`}>` "셀러에서 보기 →"
- **연결된 노트** (`linkedTastingNoteId` 있을 때):
  - `<Link href={`/notes/${linkedTastingNoteId}`}>` "노트 보기 →"
- 캡처 위치 (`location` LocalizedString)
- 캡처 일시

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` |
| Search 버튼 | 클릭 | PlaceholderToast |
| Filter Chip | 클릭 | `setFilter(k)` |
| PhotoCard | 클릭 | `setSelected(photo)` BottomSheet |
| BottomSheet 와인 링크 | 클릭 | `/wine/{wineId}` |
| BottomSheet 셀러 링크 | 클릭 | `/cellar/{cellarItemId}` |
| BottomSheet 노트 링크 | 클릭 | `/notes/{noteId}` |
| Empty state CTA | 클릭 | `/capture` |

---

## 상태 관리

| 상태 | 종류 | 초기값 |
|---|---|---|
| `all` | mock | `getLabelPhotosByUser(user.id)` |
| `filter` | useState | `'all'` |
| `selected` | useState | `null` |
| `items` | useMemo | filter 적용 |

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `getLabelPhotosByUser` | 사진 풀 |
| `getWine` | wineId → wine 정보 |
| `getCellarItem` | linkedCellarItemId → 셀러 아이템 정보 |

### LabelPhoto 타입 shape

```ts
{
  id: string,
  userId: string,
  photoUrl: string,
  capturedAt: string,            // ISO
  location: LocalizedString,
  wineId: string | null,
  linkedCellarItemId: string | null,
  linkedTastingNoteId: string | null,
}
```

---

## i18n 키 prefix

- `photos.{title, searchToast}`
- `photos.empty.{title, sub, cta}`
- `photos.filters.{all, thisYear, inCellar, tasted, byRegion, unmatched}`
- `photos.sheet.*`

---

## Feature flag 등록 (2개)

```ts
useRegisterFeatures('/photos', [
  { id: 'photos.filterBar' },
  { id: 'photos.grid' },
])
```

---

## 빈/오류 상태

- **all 0건**: `<EmptyState>` + `/capture` CTA
- **filter 결과 0건**: 빈 그리드 (별도 안내 없음)

---

## 디자인 토큰 / 스타일

- 3열 그리드 gap 8
- PhotoCard: aspect-ratio 1/1 또는 라벨 비율
- BottomSheet: backdrop blur + drag handle
