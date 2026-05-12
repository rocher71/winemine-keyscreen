#!/bin/bash
# winemine i18n 정합성 검증 스크립트
# 사용: bash .claude/skills/winemine-qa-checks/scripts/check-i18n.sh

set -e

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

echo "=== i18n 정합성 검증 ==="
echo ""

# 1. 영어 모드 한글 누출 검사
echo "1. src/ 코드에서 한글 인라인 문자열 검사..."
KO_INLINE=$(grep -rE "[가-힯]" src/app src/components 2>/dev/null | grep -v "ko:" | grep -v "// " | grep -v "/\*" || true)
if [ -n "$KO_INLINE" ]; then
  echo "❌ 한글 인라인 발견:"
  echo "$KO_INLINE"
  echo ""
else
  echo "✅ src/ 한글 인라인 0건"
  echo ""
fi

# 2. messages 양쪽 키 구조 비교
echo "2. messages/ko.json ↔ messages/en.json 키 구조 비교..."
node -e "
const ko = require('./messages/ko.json');
const en = require('./messages/en.json');

function getKeys(obj, prefix = '') {
  const keys = [];
  for (const k in obj) {
    if (k === '_note') continue;
    const full = prefix ? prefix + '.' + k : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys.push(...getKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const koKeys = new Set(getKeys(ko));
const enKeys = new Set(getKeys(en));

const onlyKo = [...koKeys].filter(k => !enKeys.has(k));
const onlyEn = [...enKeys].filter(k => !koKeys.has(k));

if (onlyKo.length === 0 && onlyEn.length === 0) {
  console.log('✅ 키 구조 양쪽 동기');
} else {
  if (onlyKo.length) console.log('❌ ko에만 있는 키:', onlyKo.length, onlyKo.slice(0, 10));
  if (onlyEn.length) console.log('❌ en에만 있는 키:', onlyEn.length, onlyEn.slice(0, 10));
}
"
echo ""

# 3. en.json의 한글 누출
echo "3. messages/en.json 한글 누출 검사..."
EN_KO=$(grep -E "[가-힯]" messages/en.json || true)
if [ -n "$EN_KO" ]; then
  echo "❌ en.json에 한글 누출:"
  echo "$EN_KO"
else
  echo "✅ en.json 한글 0건"
fi
echo ""

# 4. mock fixture의 LocalizedString.en 한글 누출
echo "4. mock LocalizedString en 필드 한글 검사..."
if [ -d "src/lib/mock" ]; then
  # 간단 grep — en: 로 시작하는 줄에 한글이 있는지
  EN_FIELD_KO=$(grep -rEn "en: ['\"].*[가-힯]" src/lib/mock/ || true)
  if [ -n "$EN_FIELD_KO" ]; then
    echo "❌ mock en 필드에 한글 누출:"
    echo "$EN_FIELD_KO"
  else
    echo "✅ mock en 필드 한글 0건"
  fi
else
  echo "⏭️  src/lib/mock/ 디렉토리 미존재 — skip"
fi
echo ""

# 5. 사용된 t() 키 vs 정의된 키
echo "5. 사용된 t() 키와 정의된 키 비교..."
USED_KEYS=$(grep -rhE "t\(['\"]([^'\"]+)['\"]" src/app src/components 2>/dev/null | sed -E "s/.*t\(['\"]([^'\"]+)['\"].*/\1/" | sort -u || true)
echo "사용된 키 수: $(echo "$USED_KEYS" | wc -l | tr -d ' ')"

if [ -f "messages/ko.json" ]; then
  MISSING=""
  for KEY in $USED_KEYS; do
    EXISTS=$(node -e "
      const ko = require('./messages/ko.json');
      const parts = '$KEY'.split('.');
      let cur = ko;
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
        else { console.log('MISSING'); process.exit(0); }
      }
      console.log('OK');
    " 2>/dev/null || echo "ERR")
    if [ "$EXISTS" = "MISSING" ]; then
      MISSING="$MISSING $KEY"
    fi
  done

  if [ -n "$MISSING" ]; then
    echo "❌ messages에 없는 키:$MISSING"
  else
    echo "✅ 모든 t() 키가 messages에 존재"
  fi
fi
echo ""

echo "=== 검증 완료 ==="
