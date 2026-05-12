/**
 * Regional Aromas — 지역·품종 → 시그니처 lex id 매핑
 *
 * 베타 피드백 §regionalAromas. lib/tasting-note-lexicon.ts의 AROMA_LEXICON에
 * 실제 존재하는 lex id만 사용. 존재하지 않는 id는 콘솔 경고 + skip.
 *
 * 사용처: 테이스팅 노트 작성 Step 2(어휘 선택)에서 와인 메타 기반 힌트 제공.
 */

import { AROMA_LEXICON } from '../../lib/tasting-note-lexicon';
import type { Wine } from '@/types';

const VALID_LEX_IDS = new Set<string>(AROMA_LEXICON.map((entry) => entry.id));

/**
 * 지역 키 → 시그니처 lex id 배열
 *
 * 키 명명:
 *   `<country-code>-<region-or-style>`  (예: 'fr-champagne', 'fr-bgy-nuits')
 *   country-code는 ISO 3166-1 alpha-2 소문자.
 *   region 슬러그는 'bdx-left' (Bordeaux Left Bank), 'bgy-nuits' (Côte de Nuits) 등.
 */
export const REGIONAL_AROMAS_RAW: Record<string, string[]> = {
  'fr-champagne': ['brioche', 'yeast', 'apple', 'hazelnut', 'lemon', 'bread-dough'],
  'fr-bdx-left': ['cassis', 'cedar', 'pencil-lead', 'graphite', 'tobacco', 'black-cherry'],
  'fr-bdx-right': ['black-cherry', 'cassis', 'leather', 'tobacco', 'truffle'],
  'fr-bgy-nuits': ['strawberry', 'raspberry', 'rose', 'forest-floor', 'mushroom', 'violet'],
  'fr-bgy-beaune': ['hazelnut', 'butter', 'apple', 'chalk', 'lemon', 'acacia'],
  'fr-bgy-chablis': ['lemon', 'oyster-shell', 'chalk', 'flint', 'apple'],
  'fr-rhone-north': ['black-pepper', 'violet', 'leather', 'black-cherry', 'smoke'],
  'fr-rhone-south': ['raspberry', 'black-cherry', 'lavender', 'licorice', 'leather'],
  'fr-loire-sauvignon': ['grapefruit', 'grass', 'flint', 'lime', 'chalk'],
  'fr-loire-cabernet-franc': ['raspberry', 'bell-pepper', 'graphite', 'violet'],
  'fr-loire-chenin': ['apple', 'honey', 'apricot', 'chamomile'],
  'fr-alsace-riesling': ['lime', 'apple', 'petrol', 'wet-stone'],

  'it-brunello': ['red-cherry', 'leather', 'tobacco', 'forest-floor', 'tar', 'fig'],
  'it-chianti': ['red-cherry', 'tomato-leaf', 'leather', 'tobacco'],
  'it-barolo': ['rose', 'tar', 'truffle', 'red-cherry', 'licorice'],
  'it-barbaresco': ['rose', 'tar', 'red-cherry', 'leather', 'truffle'],
  'it-bolgheri': ['cassis', 'cedar', 'tobacco', 'black-cherry'],
  'it-amarone': ['prune', 'fig', 'dark-chocolate', 'leather', 'licorice', 'raisin'],
  'it-prosecco': ['apple', 'pear', 'acacia', 'honeysuckle'],

  'es-rioja': ['leather', 'tobacco', 'red-cherry', 'cedar', 'dill', 'vanilla'],
  'es-ribera': ['cassis', 'leather', 'tobacco', 'cedar', 'black-cherry'],
  'es-priorat': ['blackberry', 'graphite', 'licorice', 'leather'],

  'de-mosel': ['lime', 'apricot', 'petrol', 'wet-stone', 'apple'],
  'de-rheingau': ['apple', 'apricot', 'wet-stone', 'lime', 'honey'],

  'pt-douro': ['blackberry', 'violet', 'licorice', 'graphite'],
  'pt-port': ['blackberry', 'fig', 'dark-chocolate', 'licorice', 'prune'],

  'us-napa-cab': ['cassis', 'blackberry', 'cedar', 'vanilla', 'graphite'],
  'us-sonoma-chardonnay': ['hazelnut', 'butter', 'apple', 'lemon'],
  'us-sonoma-pinot': ['raspberry', 'strawberry', 'rose', 'forest-floor'],

  'au-barossa-shiraz': ['blackberry', 'black-pepper', 'mocha', 'leather', 'eucalyptus'],
  'au-margaret-river-chardonnay': ['hazelnut', 'butter', 'lemon', 'apple', 'wet-stone'],

  'cl-maipo-cab': ['cassis', 'bell-pepper', 'cedar', 'tobacco', 'graphite'],

  'ar-mendoza-malbec': ['blackberry', 'violet', 'graphite', 'black-pepper'],

  'za-stellenbosch': ['blackberry', 'smoke', 'coffee', 'leather'],
  'za-swartland-syrah': ['black-pepper', 'blackberry', 'violet', 'smoke'],

  'nz-marlborough-sb': ['grapefruit', 'passion-fruit', 'grass', 'lime'],
};

/** lexicon에 없는 id를 콘솔 경고 + 자동 필터. */
function sanitize(key: string, ids: string[]): string[] {
  const ok: string[] = [];
  for (const id of ids) {
    if (VALID_LEX_IDS.has(id)) {
      ok.push(id);
    } else if (typeof console !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn(`[regional-aromas] '${key}' contains unknown lex id '${id}' — skipped`);
    }
  }
  return ok;
}

export const REGIONAL_AROMAS: Record<string, string[]> = Object.keys(REGIONAL_AROMAS_RAW).reduce<
  Record<string, string[]>
>((acc, key) => {
  acc[key] = sanitize(key, REGIONAL_AROMAS_RAW[key]);
  return acc;
}, {});

/* ────────────────────────────────────────────────────────────────────────── */
/* Wine → regional key 유추                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Wine의 country/region/grapes에서 regional key를 1순위 후보로 반환.
 * 매칭 불가 시 빈 배열.
 */
export function inferRegionalKey(wine: Wine): string | null {
  const country = wine.country.en.toLowerCase();
  const region = wine.region.en.toLowerCase();
  const appel = wine.appellation.en.toLowerCase();
  const grapeNames = wine.grapes.map((g) => g.en.toLowerCase());

  // France
  if (country === 'france') {
    if (region.includes('champagne')) return 'fr-champagne';
    if (region.includes('alsace')) return 'fr-alsace-riesling';
    if (region.includes('bordeaux')) {
      if (appel.includes('saint-émilion') || appel.includes('pomerol')) return 'fr-bdx-right';
      return 'fr-bdx-left';
    }
    if (region.includes('burgundy')) {
      if (appel.includes('chablis')) return 'fr-bgy-chablis';
      if (
        appel.includes('puligny') ||
        appel.includes('meursault') ||
        appel.includes('chassagne') ||
        appel.includes('beaune') ||
        appel.includes('pommard')
      )
        return 'fr-bgy-beaune';
      return 'fr-bgy-nuits';
    }
    if (region.includes('rhône') || region.includes('rhone')) {
      if (
        appel.includes('côte-rôtie') ||
        appel.includes('cote-rotie') ||
        appel.includes('hermitage') ||
        appel.includes('condrieu')
      )
        return 'fr-rhone-north';
      return 'fr-rhone-south';
    }
    if (region.includes('loire')) {
      if (grapeNames.some((g) => g.includes('sauvignon blanc'))) return 'fr-loire-sauvignon';
      if (grapeNames.some((g) => g.includes('cabernet franc'))) return 'fr-loire-cabernet-franc';
      if (grapeNames.some((g) => g.includes('chenin'))) return 'fr-loire-chenin';
      return null;
    }
  }

  // Italy
  if (country === 'italy') {
    if (appel.includes('brunello')) return 'it-brunello';
    if (appel.includes('chianti')) return 'it-chianti';
    if (appel.includes('barolo')) return 'it-barolo';
    if (appel.includes('barbaresco')) return 'it-barbaresco';
    if (appel.includes('bolgheri')) return 'it-bolgheri';
    if (appel.includes('amarone')) return 'it-amarone';
    if (appel.includes('valdobbiadene') || appel.includes('prosecco')) return 'it-prosecco';
    return null;
  }

  // Spain
  if (country === 'spain') {
    if (region.includes('rioja')) return 'es-rioja';
    if (region.includes('ribera')) return 'es-ribera';
    if (region.includes('priorat')) return 'es-priorat';
    return null;
  }

  // Germany
  if (country === 'germany') {
    if (region.includes('mosel')) return 'de-mosel';
    if (region.includes('rheingau')) return 'de-rheingau';
    return null;
  }

  // Portugal
  if (country === 'portugal') {
    if (appel.includes('port')) return 'pt-port';
    if (region.includes('douro')) return 'pt-douro';
    return null;
  }

  // USA
  if (country === 'usa' || country === 'united states') {
    if (region.includes('napa')) return 'us-napa-cab';
    if (region.includes('sonoma')) {
      if (grapeNames.some((g) => g.includes('chardonnay'))) return 'us-sonoma-chardonnay';
      if (grapeNames.some((g) => g.includes('pinot noir'))) return 'us-sonoma-pinot';
      return null;
    }
  }

  // Australia
  if (country === 'australia') {
    if (region.includes('barossa')) return 'au-barossa-shiraz';
    if (region.includes('margaret river')) return 'au-margaret-river-chardonnay';
    return null;
  }

  // Chile
  if (country === 'chile') return 'cl-maipo-cab';

  // Argentina
  if (country === 'argentina') return 'ar-mendoza-malbec';

  // South Africa
  if (country === 'south africa') {
    if (region.includes('stellenbosch')) return 'za-stellenbosch';
    if (region.includes('swartland')) return 'za-swartland-syrah';
    return null;
  }

  // New Zealand
  if (country === 'new zealand') return 'nz-marlborough-sb';

  return null;
}

/**
 * Wine → 시그니처 lex id 배열 (regional 매핑 + wine.signatureAromaLexIds 합집합).
 * 매칭 없으면 wine.signatureAromaLexIds 그대로 반환.
 */
export function getRegionalAromasForWine(wine: Wine): string[] {
  const key = inferRegionalKey(wine);
  const regional = key ? REGIONAL_AROMAS[key] ?? [] : [];
  const merged = new Set<string>([...wine.signatureAromaLexIds, ...regional]);
  // lexicon에 존재하는 id만
  return Array.from(merged).filter((id) => VALID_LEX_IDS.has(id));
}
