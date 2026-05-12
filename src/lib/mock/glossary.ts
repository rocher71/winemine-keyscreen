/**
 * Glossary — 12개 시드 entry
 *
 * 베타 피드백 §glossary — "카우달리가 뭐예요" UX. 도메인 용어 위치마다
 * GlossaryTooltip이 (i) 아이콘으로 노출, 클릭 시 이 entry를 모달로 표시.
 *
 * 출처는 가능한 한 명시 — WSET, Peynaud, AWRI, EU Reg 607/2009 등.
 *
 * 12 시드 (스킬 체크리스트):
 *   caudalie · residual-sugar · appellation · wset · brett · bouchonne
 *   tdn · rotundone · decanting · terroir · tannin-texture · dosage
 */

import type { GlossaryEntry } from '@/types';

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'caudalie',
    term: { ko: '카우달리 (Caudalie)', en: 'Caudalie' },
    definition: {
      ko: '와인을 삼킨 후 입안에 남는 향과 맛의 길이를 측정하는 단위. 1 카우달리 = 1초의 지속 잔향. 12 카우달리 이상이면 보르도 그랑 크뤼 클라세에 준하는 길이로 평가된다.',
      en: 'A unit measuring the length of aromas and flavours that linger after swallowing. 1 caudalie = 1 second of finish. A wine reaching 12+ caudalies is considered comparable in length to a Bordeaux Grand Cru Classé.',
    },
    examples: {
      ko: '"이 와인의 여운은 14 카우달리야" = 14초 동안 입안에 향이 남았다는 뜻.',
      en: "\"This wine has a 14-caudalie finish\" means the aromas linger for 14 seconds after swallowing.",
    },
    relatedTermIds: ['finish-length'],
    source: { ko: 'Peynaud, Le Goût du Vin (1980)', en: 'Peynaud, Le Goût du Vin (1980)' },
    category: 'sensory',
  },
  {
    id: 'residual-sugar',
    term: { ko: '잔당 (Residual Sugar)', en: 'Residual Sugar' },
    definition: {
      ko: '발효 후 와인에 남아 있는 발효되지 않은 포도당·과당의 합계. g/L 단위로 표시. 본 드라이 < 1 g/L, 드라이 < 4 g/L, 오프 드라이 4~12 g/L, 미디엄 12~45 g/L, 스위트 > 45 g/L.',
      en: 'Sugars (glucose and fructose) remaining after fermentation, expressed in g/L. Bone dry < 1 g/L; dry < 4 g/L; off-dry 4–12 g/L; medium 12–45 g/L; sweet > 45 g/L.',
    },
    examples: {
      ko: '독일 카비넷 리슬링은 보통 8~25 g/L 잔당으로 오프 드라이~미디엄 영역에 위치.',
      en: 'A typical German Kabinett Riesling sits at 8–25 g/L — off-dry to medium.',
    },
    relatedTermIds: ['dosage'],
    source: { ko: 'WSET Level 3', en: 'WSET Level 3' },
    category: 'unit',
  },
  {
    id: 'appellation',
    term: { ko: '아펠라시옹 (Appellation)', en: 'Appellation' },
    definition: {
      ko: '법적으로 정의된 와인 산지 명칭과 그에 따른 양조 규정. 프랑스 AOC, 이탈리아 DOCG, 스페인 DOC 등이 해당. 라벨에 표기된 아펠라시옹은 떼루아·품종·양조 방법의 보증 역할.',
      en: 'A legally defined wine-region name and the production rules tied to it — e.g., French AOC, Italian DOCG, Spanish DOC. The appellation on a label is a guarantee of terroir, grapes, and winemaking method.',
    },
    examples: {
      ko: '"Pauillac AOC"는 보르도 메독 좌안의 정해진 구역에서 정해진 품종으로만 양조 가능.',
      en: 'A "Pauillac AOC" label means the wine was made from approved grapes inside the defined Pauillac zone on the Bordeaux Left Bank.',
    },
    relatedTermIds: ['terroir'],
    source: { ko: 'EU Regulation 607/2009', en: 'EU Regulation 607/2009' },
    category: 'classification',
  },
  {
    id: 'wset',
    term: { ko: 'WSET (Wine & Spirit Education Trust)', en: 'WSET (Wine & Spirit Education Trust)' },
    definition: {
      ko: '런던에 본부를 둔 와인·증류주 교육 기관. 4단계의 자격증 체계(Level 1~Diploma)와 표준화된 테이스팅 노트 시스템(Systematic Approach to Tasting, SAT)을 운영. 본 앱의 전문가 모드 슬라이더 5단계 평가는 SAT를 기반으로 한다.',
      en: 'A London-based wine and spirits education body. It runs a four-level certification system (Level 1 to Diploma) and the standardised Systematic Approach to Tasting (SAT). The 5-point WSET sliders in expert mode are based on SAT.',
    },
    examples: {
      ko: '"WSET Level 3"는 산미·바디·타닌 등을 low/medium-/medium/medium+/high의 5단계로 평가하도록 권장.',
      en: 'WSET Level 3 evaluates acidity, body, tannin, etc. on a 5-point scale: low / medium- / medium / medium+ / high.',
    },
    relatedTermIds: ['caudalie'],
    source: { ko: 'WSET Systematic Approach to Tasting', en: 'WSET Systematic Approach to Tasting' },
    category: 'technique',
  },
  {
    id: 'brett',
    term: { ko: '브렛 (Brettanomyces)', en: 'Brett (Brettanomyces)' },
    definition: {
      ko: '와인에서 발생하는 야생 효모. 4-에틸페놀과 4-에틸과이아콜을 생산해 마구간·말 안장·반창고·훈제 베이컨 같은 향을 부여한다. 저농도에서는 복합성으로 평가되지만 고농도에서는 결함으로 본다.',
      en: 'A wild yeast that contaminates wine, producing 4-ethylphenol and 4-ethylguaiacol — yielding aromas of stable, saddle, band-aid, and smoked bacon. At low concentrations it is considered complexity; at high levels, a fault.',
    },
    examples: {
      ko: '4-EP 약 600 µg/L 이상부터 결함으로 평가.',
      en: 'Generally classified as a fault above ~600 µg/L of 4-EP.',
    },
    relatedTermIds: ['bouchonne'],
    source: { ko: 'AWRI Technical Review', en: 'AWRI Technical Review' },
    category: 'fault',
  },
  {
    id: 'bouchonne',
    term: { ko: '부쇼네 (Bouchonné · Cork Taint)', en: 'Bouchonné (Cork Taint)' },
    definition: {
      ko: 'TCA(2,4,6-Trichloroanisole)에 의해 발생하는 와인 결함. 코르크에 미량(약 1.5 ng/L) 존재해도 와인의 과일 향을 죽이고 젖은 골판지·곰팡이·눅눅한 지하실 향을 유발한다.',
      en: 'A wine fault caused by TCA (2,4,6-Trichloroanisole). Even ~1.5 ng/L on the cork suppresses fruit and produces aromas of wet cardboard, mould, and damp basement.',
    },
    examples: {
      ko: '"이 병은 부쇼네야 — 다른 병으로 바꿔 달라."',
      en: '"This bottle is bouchonné — please bring a different one."',
    },
    relatedTermIds: ['brett'],
    source: { ko: 'AWRI Technical Review', en: 'AWRI Technical Review' },
    category: 'fault',
  },
  {
    id: 'tdn',
    term: { ko: 'TDN (1,1,6-Trimethyl-1,2-Dihydronaphthalene)', en: 'TDN (1,1,6-Trimethyl-1,2-Dihydronaphthalene)' },
    definition: {
      ko: '리슬링 등 일부 화이트 와인이 숙성되며 발달하는 임팩트 화합물. 휘발유·등유 같은 향을 부여. 리슬링 숙성의 상징.',
      en: 'An impact compound that develops with age in Rieslings and certain other white wines. Produces petrol and kerosene aromas — a hallmark of aged Riesling.',
    },
    examples: {
      ko: '10년 이상 숙성한 모젤 리슬링은 거의 항상 휘발유 노트를 보인다.',
      en: 'A Mosel Riesling aged 10+ years almost always shows a petrol note.',
    },
    relatedTermIds: [],
    source: { ko: 'Eggers et al., 2006', en: 'Eggers et al., 2006' },
    category: 'sensory',
  },
  {
    id: 'rotundone',
    term: { ko: '로툰돈 (Rotundone)', en: 'Rotundone' },
    definition: {
      ko: '시라/시라즈, 그뤼너 펠트리너 등의 와인에서 발견되는 세스퀴테르펜. 흑후추·흰후추 향을 직접 부여. 인간 인지 임계치는 약 16 ng/L.',
      en: 'A sesquiterpene found in Syrah/Shiraz and Grüner Veltliner. Directly responsible for black-pepper and white-pepper aromas. Human perception threshold around 16 ng/L.',
    },
    examples: {
      ko: '북부 론 꼬뜨 로띠의 흑후추 노트는 로툰돈의 직접적 결과.',
      en: 'The black-pepper note in Northern Rhône Côte-Rôtie is a direct result of rotundone.',
    },
    relatedTermIds: [],
    source: { ko: 'Wood et al., 2008 (AWRI)', en: 'Wood et al., 2008 (AWRI)' },
    category: 'sensory',
  },
  {
    id: 'decanting',
    term: { ko: '디캔팅 (Decanting)', en: 'Decanting' },
    definition: {
      ko: '와인을 본 병에서 디캔터로 옮겨 산소와 접촉시키거나 침전물을 분리하는 행위. 어린 풀바디 레드는 향의 발현을 위해, 오래된 와인은 침전물 분리만을 위해 진행. 어린 바롤로·바르바레스코는 60~120분, 어린 보르도 그랑 크뤼는 90~120분이 권장.',
      en: 'Pouring wine from its bottle into a decanter — either to expose it to oxygen or to separate sediment. Young full-bodied reds benefit from aromatic opening; older wines decant mainly for sediment. Young Barolo/Barbaresco needs 60–120 min, young Bordeaux Grand Cru 90–120 min.',
    },
    examples: {
      ko: '"이 마고는 2시간 디캔팅 후에 향이 깨어났다."',
      en: '"The aromatics of this Margaux woke up after a two-hour decant."',
    },
    relatedTermIds: ['tannin-texture'],
    source: { ko: 'WSET Diploma', en: 'WSET Diploma' },
    category: 'technique',
  },
  {
    id: 'terroir',
    term: { ko: '떼루아 (Terroir)', en: 'Terroir' },
    definition: {
      ko: '와인 산지의 토양·기후·고도·인간 양조 전통 등 모든 환경적 요소의 종합. 같은 품종이라도 떼루아가 다르면 다른 와인이 된다는 부르고뉴식 사고의 핵심 개념.',
      en: 'The total environmental context — soil, climate, altitude, and human winemaking tradition — of a wine region. The core Burgundian idea that the same grape produces different wines in different terroirs.',
    },
    examples: {
      ko: '"이 와인의 떼루아는 갈렛(자갈) 위 모래 토양이다."',
      en: '"The terroir of this wine is sand soil over galets (large pebbles)."',
    },
    relatedTermIds: ['appellation'],
    source: { ko: 'Wilson, Terroir (1998)', en: 'Wilson, Terroir (1998)' },
    category: 'classification',
  },
  {
    id: 'tannin-texture',
    term: { ko: '타닌 텍스처 (Tannin Texture)', en: 'Tannin Texture' },
    definition: {
      ko: '입안에서 느껴지는 타닌의 질감. 강도(intensity)와는 별개의 차원. silky, fine-grained, velvety, grippy, drying, harsh 등으로 표현. 동일 강도의 타닌도 어린 와인은 grippy, 숙성된 와인은 silky로 변환된다.',
      en: 'The mouthfeel quality of tannin, distinct from intensity. Described as silky, fine-grained, velvety, grippy, drying, or harsh. The same tannin intensity is often "grippy" when young and "silky" when aged.',
    },
    examples: {
      ko: '"타닌은 강하지만 텍스처는 비단결 같다" — 어린 그랑 크뤼 보르도의 흔한 평가.',
      en: '"Tannins are firm but the texture is silky" — a common reading of a young Bordeaux Grand Cru.',
    },
    relatedTermIds: ['decanting'],
    source: { ko: 'Gawel et al., 2000', en: 'Gawel et al., 2000' },
    category: 'sensory',
  },
  {
    id: 'dosage',
    term: { ko: '도사주 (Dosage)', en: 'Dosage' },
    definition: {
      ko: '샴페인 양조의 마지막 단계에서 추가하는 와인+설탕 혼합 시럽. g/L로 측정. Brut Nature < 3, Extra Brut < 6, Brut < 12, Extra Dry 12~17, Dry 17~32, Demi-Sec 32~50 g/L.',
      en: 'A sugar-and-wine liqueur added at the final stage of Champagne production. Measured in g/L: Brut Nature < 3; Extra Brut < 6; Brut < 12; Extra Dry 12–17; Dry 17–32; Demi-Sec 32–50.',
    },
    examples: {
      ko: '"이 샴페인은 도사주 6 g/L의 Extra Brut" = 거의 단맛이 느껴지지 않는 영역.',
      en: '"This Champagne has a dosage of 6 g/L — Extra Brut" — almost no perceptible sweetness.',
    },
    relatedTermIds: ['residual-sugar'],
    source: { ko: 'CIVC (Comité Champagne) Regulation', en: 'CIVC (Comité Champagne) Regulation' },
    category: 'unit',
  },
];

export const GLOSSARY_BY_ID: Record<string, GlossaryEntry> = GLOSSARY.reduce<
  Record<string, GlossaryEntry>
>((acc, e) => {
  acc[e.id] = e;
  return acc;
}, {});

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return GLOSSARY_BY_ID[id];
}

/**
 * default export — infrastructure-builder의 `glossary-tooltip.tsx`가 시도하는 세 가지
 * 호출 형태 (getGlossaryEntry, GLOSSARY 배열, 기본 record) 중 하나로 record 매핑을
 * 노출. 외부 코드는 가능하면 named export를 사용.
 */
export default GLOSSARY_BY_ID;
