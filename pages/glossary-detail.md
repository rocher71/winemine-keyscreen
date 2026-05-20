# 용어 상세 (`/glossary/[term]`)

## 메타 정보

| 항목 | 값 |
|---|---|
| URL | `/glossary/[term]` (예: `/glossary/caudalie`) |
| 파일 | `src/app/glossary/[term]/page.tsx` (243 라인) |
| 헤더 | `<BackHeader title={term 한글명} />` 또는 BackHeader 빈 |
| BottomNav | 표시 (활성 탭 없음) |
| 진입 가드 | term 못 찾으면 "용어를 찾을 수 없어요" 빈 페이지 |
| Feature flag 키 | (등록 가능, 미확인 — 일부 컴포넌트로 위임) |

---

## 진입 경로

- `/glossary` 용어 행 클릭
- 본문 인라인 `<GlossaryTooltip>` (i) 버튼 → "전체 보기 →" 링크 (있다면)
- 와이너리 스토리·노트 작성에서 관련 용어 참조

---

## 페이지 구성

### 1. 용어 헤더

- 한글명 / 영문명 병기 (Playfair 28px, weight 700, line-height 1.15, letter-spacing -0.01em)
- 카테고리 배지 (`{category}` — sensory / fault / classification / technique / unit, 라벨 색상 분기)

### 2. 정의 본문

- **한국어 정의** (LocalizedString.ko, Inter 12~13px)
- **영어 정의** (LocalizedString.en, Inter 12~13px)
- 두 언어 모두 노출 (locale에 무관하게 양쪽 표시) 또는 LocaleText로 분기 (구현에 따라)

### 3. 관련 용어 링크 (있을 때)

- `relatedTerms` 배열 매핑
- 각 링크 → `/glossary/{relatedTerm}`

### 4. 인라인 컨텍스트 (해당 용어가 사용된 와인/노트 등)

- 일부 entry는 예시 사진/도식 (예: caudalie의 시간 vs 향 곡선 SVG)

---

## 인터랙션 매트릭스

| 위치 | 액션 | 결과 |
|---|---|---|
| BackHeader < | 클릭 | `router.back()` (보통 `/glossary` 또는 BottomSheet 부모) |
| 관련 용어 링크 | 클릭 | `/glossary/{relatedTerm}` |

---

## 상태 관리

- mock GLOSSARY에서 `term` ID로 lookup
- term === undefined → 빈 페이지 분기

---

## 데이터 의존성

| 모듈 | 사용 |
|---|---|
| `GLOSSARY` (`src/lib/mock/glossary.ts`) | term lookup |
| 인라인 `<GlossaryTooltip>` 헬퍼와 동일 데이터 소스 |

### GlossaryEntry shape (예상)

```ts
{
  id: string,
  category: 'sensory' | 'fault' | 'classification' | 'technique' | 'unit',
  term: LocalizedString,
  definition: LocalizedString,
  relatedTerms?: string[],
  context?: LocalizedString,    // 예시 사용 맥락
}
```

---

## i18n 키 prefix

- 카테고리 라벨: `glossary.categories.*`
- 페이지 컨테이너: `glossary.detail.*` (있을 경우)

---

## 빈/오류 상태

- **term ID 미존재**: 인라인 또는 빈 페이지로 처리

---

## 디자인 토큰 / 스타일

- Playfair 28 용어명
- 카테고리 배지: 카테고리별 색
- 관련 용어 링크: gold underline 또는 chip
