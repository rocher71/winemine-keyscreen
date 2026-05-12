/**
 * Re-export shim — 기존 `lib/recommended-wines.ts` (랜딩에서 가져온 자산)을
 * `@/lib/...` 경로로 접근 가능하게 한다. 별도 복제 없음, 단일 출처 유지.
 *
 * Phase A 산출물(_workspace/A_scaffolder_report.md §5)에 명시된 "lib/*.ts →
 * re-export 래퍼" 결정에 따른 구현.
 */

export {
  STARTING_WINE,
  RECOMMENDED_WINES,
  ALL_WINES as LEGACY_RECOMMENDED_WINES,
  formatKrw,
} from '../../lib/recommended-wines';

export type { WineType as LegacyWineType, LocalizedString as LegacyLocalizedString, RecommendedWine } from '../../lib/recommended-wines';
