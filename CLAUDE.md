# winemine — App Prototype Context

> 이 파일은 winemine 랜딩 페이지 레포(`Phase 1`)에서 추출한 **앱 프로토타입 개발용 컨텍스트**다.
> 랜딩 페이지 전용 내용(Supabase waitlist, Server Action, 폼/모달 컴포넌트, i18n middleware, 배포 설정 등)은 모두 제거되었다.

---

## 서비스 정체성

**winemine**은 와인 라벨을 촬영하면 AI가 와인을 인식하고, 마신 와인을 세계 지도 위에 지역별로 시각화해 기록하는 앱이다.

- 서비스명: **winemine** (소문자, 붙여쓰기 고정)
- 핵심 감성: 프리미엄 와인 라벨의 무게감. 어두운 밤, 와인 한 잔.
- 현재 단계: **Phase 2 — 앱 프로토타입 (목업 UI, 브라우저에서 동작)**

### 핵심 사용자 경험
1. 와인 라벨 촬영 → AI가 품종/빈티지/생산자/원산지 추출
2. 세계 지도 위에 자동으로 핀이 꽂힘. 마실수록 지도가 와인 컬러로 물든다
3. 지역을 누르면 드릴다운 (예: 프랑스 → 보르도 → 포므롤)
4. Flighty/YouTube Music Recap 스타일의 공유 가능한 Recap 이미지 자동 생성

---

## 디자인 시스템

### 색상 팔레트
```
Wine Red (Primary):  #8B1A2A   — CTA, 와인 국가 fill, 강조
Wine Red Hover:      #A02030
Gold (Accent):       #C9A84C   — 장식선, 아이콘, 성공 상태
Cream (Text):        #F5F0E8   — 제목, 주요 텍스트
Secondary Text:      #D4C5B0
Muted Text:          #9B8B7A   — 설명, 부제
Disabled:            #4A3D56   — placeholder, 비활성
Deepest Dark:        #05020A   — 주 배경
Deep Dark:           #0A050F   — 교차 섹션 배경
Map Dark:            #1A0A1E   — 지도 기본 국가 fill, input bg
Surface:             #0F0718   — 모달/카드 배경
Border:              #2D1540
Border Active:       #8B1A2A
Error:               #EF4444
```

### 타이포그래피
- **Playfair Display** (serif) — 로고, 제목, 모달 타이틀
- **Inter** (sans-serif) — 본문, 버튼, 입력
- **Noto Sans KR** — 한국어 본문 fallback

### 로고 규칙
- 항상 **소문자 `winemine`** (대문자/분리 금지)
- Playfair Display, letter-spacing: -0.02em

---

## 기술 스택 권장 (Phase 1 기준)

| 레이어 | 선택 | 비고 |
|--------|------|------|
| 프레임워크 | Next.js 15 App Router | 프로토타입 단계 — 단일 페이지 SPA로도 충분 |
| 언어 | TypeScript 5.7 (strict) | |
| 스타일 | Tailwind CSS v4 | `styles/tokens.css` 참조 |
| 세계 지도 | react-simple-maps v3 + topojson-client v3 | SSR 불가 — dynamic import 필요 |
| 애니메이션 | Framer Motion v12 | |
| 아이콘 | lucide-react | |
| 폼 (필요 시) | react-hook-form v7 + zod v3 | `lib/validations.ts` 패턴 재사용 |

**프로토타입이므로 백엔드/DB/인증은 mock 데이터로 시작 권장.**

---

## 지도 구현 주의사항 (랜딩에서 학습한 것)

- `react-simple-maps`는 브라우저 API 사용 → **SSR 불가**, dynamic import 필수:
  ```ts
  dynamic(() => import('@/components/map/world-map'), { ssr: false })
  ```
- 국가 식별: `geo.id`를 3자리 숫자 문자열로 패딩 (`String(geo.id).padStart(3, '0')`) — `ISO_A3`/`ADM0_A3` **아님**
- 지도 데이터: `public/world-110m.json` (기본), `public/france-departments.json` (프랑스 데파르트망)

---

## 도메인 데이터 (재사용 가능)

| 파일 | 내용 |
|------|------|
| `lib/recommended-wines.ts` | 입문용 추천 와인 mock, `STARTING_WINE` (Margaux) + 6개 국가 대표 와인 |
| `lib/tasting-note-lexicon.ts` | UC Davis 아로마 휠, WSET 디스크립터, 결함 카탈로그 등 — 전문가 와인 어휘 |
| `lib/validations.ts` | 한국 전화번호 정규식, 이메일 검증 (가입 흐름에 재사용) |
| `lib/analytics.ts` | window.gtag 래퍼 (GA 연결 시 재사용) |
| `messages/ko.json`, `en.json` | 한·영 와인 도메인 카피 (테이스팅 노트 단계, 부르고뉴 용어, 와인 카드 톤) |
| `public/world-110m.json` | 세계 지도 (low-res) |
| `public/france-departments.json` | 프랑스 데파르트망 |

---

## 도메인 레퍼런스 문서

`docs/` 폴더 참조:

- **`burgundy-classification-research.md`** — 부르고뉴 분류 체계의 와인 덕후 관점 리서치 + 한·불 용어집. 앱에서 부르고뉴 와인 표시할 때 분류 위계 참고
- **`burgundy-section-spec.md`** — 부르고뉴 드릴다운 UX (꼬뜨→마을→등급→와인) 사양 — 앱의 지도 드릴다운 패턴 참고
- **`wine-discovery-section-spec.md`** — 초보자 친화 5단계 스크롤 스토리텔링 — 온보딩 흐름 참고
- **`tasting-note-section-spec.md`** — 테이스팅 노트 작성 흐름 (블라인드 모드 포함). 앱의 핵심 기능 중 하나

---

## 보안/품질 원칙 (랜딩에서 가져온 것)

- 입력 검증: 클라이언트(Zod) + 서버 **양쪽** 모두
- 한국 전화번호 형식: `/^010[-\s]?\d{4}[-\s]?\d{4}$/`
- `SUPABASE_SERVICE_ROLE_KEY` 같은 시크릿은 절대 `NEXT_PUBLIC_` 접두사 금지 — 클라이언트 번들 노출 X

---

## 카피 톤 & 페어링 헤더 (참고)

랜딩에서 정착된 두 가지 톤:
- **초보자**: "와인을 가볍게 즐기고 싶으신가요?" — 친근, 풀어쓰기, 비유 사용
- **전문가**: "와인을 깊게 파고드시나요?" — WSET·카우달리·아펠라시옹 같은 정식 용어 사용

앱에서도 비슷한 모드 분기(쉬운 모드/전문가 모드)를 고려할 수 있다.
