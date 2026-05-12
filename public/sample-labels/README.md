# Sample Labels — 시안 카메라/갤러리 시뮬레이션용

`/capture` 페이지의 "라벨 스캔" / "갤러리에서 선택" 옵션은 시안 단계라 실제 카메라/파일 입력이 동작하지 않는다. 대신 1.5초 mock 분석 후 항상 동일한 인식 결과(Terralsole Brunello di Montalcino Riserva 2006)를 노출한다.

## 사진 추가 방법

이 디렉토리에 다음 파일명으로 와인 사진을 두면 자동으로 `/capture`의 인식 결과 카드에 표시된다:

```
public/sample-labels/terralsole-brunello-riserva-2006.jpg
```

지원 포맷: JPEG / PNG / WebP (확장자는 `.jpg` 고정 — 다른 포맷이면 코드의 SAMPLE_PHOTO_PATH 상수도 같이 바꿔야 함)

권장 사양:
- 세로 비율 (병 사진 형태), 최소 300×400 px
- 라벨이 잘 보이는 정면 샷
- 파일 크기 500KB 이하 (네트워크 빠르게)

## 파일 없을 때

코드는 `<img onError>`로 fallback을 처리한다. 사진 파일이 없으면:
- SVG로 그린 가짜 와인병 + 라벨 placeholder가 표시됨
- "샘플 사진이 없어요" 안내 박스에서 파일 경로를 알려줌
- 인식 결과 자체는 정상 진행 (Terralsole Brunello 메타 데이터)

## 다른 와인으로 바꾸기

다른 와인을 시뮬 결과로 쓰려면:
1. `src/lib/mock/wines.ts`에 새 와인 추가 (또는 기존 ID 사용)
2. `src/app/capture/page.tsx`의 `SAMPLE_WINE_ID` 상수 변경
3. `SAMPLE_PHOTO_PATH`도 새 파일명으로

## 시안 단계 가정

Phase 3 실제 개발 시:
- 카메라 → `getUserMedia()` 또는 React Native Camera
- 갤러리 → `<input type="file">` 또는 native picker
- AI 인식 → Claude Vision API 또는 Google Cloud Vision
- 인식 후 후보 와인 N개 중 사용자가 선택

지금은 모두 mock — UX 흐름만 시연.
