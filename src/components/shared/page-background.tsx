/**
 * 페이지 전체 배경 — deepest dark → deep dark 대각선 그라데이션.
 * DeviceFrame이 그 위에 떠 있는 형태.
 * 데스크톱에서는 사이드 패널 영역도 같은 배경을 공유.
 * (모바일에서는 콘텐츠가 풀스크린이므로 단순한 배경색만 보임.)
 */
export function PageBackground() {
  return <div className="wm-page-bg" aria-hidden />;
}
