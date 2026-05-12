#!/bin/bash
# winemine 22 라우트 정합성 검증

set -e

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

echo "=== 라우트 정합성 검증 ==="
echo ""

# 스펙의 22 라우트
EXPECTED_ROUTES=(
  "src/app/page.tsx"
  "src/app/onboarding/page.tsx"
  "src/app/cellar/page.tsx"
  "src/app/cellar/[id]/page.tsx"
  "src/app/map/page.tsx"
  "src/app/wine/[id]/page.tsx"
  "src/app/wine/[id]/prices/page.tsx"
  "src/app/wine/[id]/story/page.tsx"
  "src/app/wine/[id]/community-peak/page.tsx"
  "src/app/profile/page.tsx"
  "src/app/profile/[userId]/page.tsx"
  "src/app/settings/page.tsx"
  "src/app/settings/language/page.tsx"
  "src/app/settings/experience/page.tsx"
  "src/app/settings/notifications/page.tsx"
  "src/app/notifications/page.tsx"
  "src/app/favorites/page.tsx"
  "src/app/badges/page.tsx"
  "src/app/photos/page.tsx"
  "src/app/glossary/page.tsx"
  "src/app/glossary/[term]/page.tsx"
  "src/app/capture/page.tsx"
  "src/app/notes/new/page.tsx"
  "src/app/notes/new/write/page.tsx"
)

echo "1. 라우트 파일 존재 검사..."
MISSING_COUNT=0
for route in "${EXPECTED_ROUTES[@]}"; do
  if [ ! -f "$route" ]; then
    echo "❌ 누락: $route"
    MISSING_COUNT=$((MISSING_COUNT + 1))
  fi
done

if [ $MISSING_COUNT -eq 0 ]; then
  echo "✅ ${#EXPECTED_ROUTES[@]} 라우트 모두 존재"
else
  echo "❌ $MISSING_COUNT 개 라우트 누락"
fi
echo ""

echo "2. 모든 라우트가 BackHeader 또는 AppHeader 마운트하는지 검사..."
HEADER_MISSING=""
for route in "${EXPECTED_ROUTES[@]}"; do
  if [ -f "$route" ]; then
    HAS_HEADER=$(grep -lE "AppHeader|BackHeader" "$route" 2>/dev/null || true)
    # onboarding과 capture는 헤더 없을 수 있음
    if [ -z "$HAS_HEADER" ] && [[ "$route" != *"onboarding"* ]] && [[ "$route" != *"capture"* ]]; then
      HEADER_MISSING="$HEADER_MISSING $route"
    fi
  fi
done
if [ -z "$HEADER_MISSING" ]; then
  echo "✅ 모든 페이지에 헤더 마운트"
else
  echo "⚠️  헤더 누락 의심:$HEADER_MISSING"
fi
echo ""

echo "=== 검증 완료 ==="
