# winemine — Design System (구 단일 파일 stub)

> **이 파일은 2026-05-19부터 `docs/design-system/`의 분리 문서로 이전됐다.**
> 본래는 프로젝트 루트의 `design.md` 단일 파일이었지만, 분리 후 루트에서도 제거되어 이 legacy 폴더 안에 stub만 남겨둔다.
> 단일 파일이 너무 커져서 색상·폰트·컴포넌트 단위로 분리했고, 같은 작업에서 코드 대비 누락·오류 항목도 함께 반영했다.

## 새 위치

| 문서 | 내용 |
|------|------|
| [`../README.md`](../README.md) | 인덱스 + 브랜드 정체성 + 빠른 참조 |
| [`../colors.md`](../colors.md) | CSS 변수 토큰, 레벨·뱃지·커뮤니티 색상, 와인 병 팔레트, Shadow, Gold/Wine Red rgba 알파, 테마 전환 |
| [`../typography.md`](../typography.md) | 폰트 패밀리(Playfair·Inter·Spoqa), 텍스트 유틸 클래스, 인라인 텍스트 패턴, 로고 규칙 |
| [`../components.md`](../components.md) | DeviceFrame·스페이싱·반응형, 컴포넌트 패턴, 아이콘, 모션, 접근성, 라우트 가시성 |

## 코드 대비 보정된 주요 항목

이전 `design.md`에 있던 오류·누락:

- `--color-map-ocean` 라이트 값을 `transparent`로 표기 → 실제 `#100720` (다크) / `#C8D6E4` (라이트)
- `--color-map-country` 라이트 값을 `#C8B8D8` (라벤더)로 표기 → 실제 `#DDD0BB` (양피지 톤)
- `--color-map-stroke` 토큰 누락
- DeviceFrame `inset 0 0 0 2px #1F1428` 외곽 베젤 라인 누락
- Tailwind `@theme`의 `--color-cream`이 `#F8F4ED`로 등록돼 있어 `tokens.css`의 `#F5F0E8`과 이중값 — 새 문서에서 양쪽 명시
- `--color-success` (`#22C55E`)와 `--color-gold-soft` (`#D4B85C`)는 `@theme` 전용 토큰임을 명시

상세 변경 이력은 [`../README.md`](../README.md)의 변경 이력 섹션을 참고.
