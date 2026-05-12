/**
 * Re-export shim — 기존 `lib/tasting-note-lexicon.ts` (1082줄 원본)을
 * `@/lib/tasting-note-lexicon` 경로로 접근 가능하게 한다. 단일 출처 유지.
 *
 * Phase A 산출물(_workspace/A_scaffolder_report.md §5)에 명시된
 * "lib/*.ts → re-export 래퍼" 결정에 따른 구현.
 *
 * 원본 lexicon은 수정 금지 — 본 파일은 export 표면만 옮긴다.
 */

export * from '../../lib/tasting-note-lexicon';
