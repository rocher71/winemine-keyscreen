/**
 * winemine — Shared TypeScript types
 *
 * SPEC `core_data_entities` 기준의 전체 엔티티 타입. mock-data-architect가
 * 작성한 모든 fixture가 이 타입을 참조한다.
 *
 * 사용자 노출 문자열은 LocalizedString { ko, en } — `<LocaleText>`가 받아
 * 영어/한국어 모드에서 분기 렌더한다. 한국어 인라인 문자열 금지.
 */

/* ─────────────────────────── 기본 공용 타입 ─────────────────────────── */

export type LocalizedString = {
  ko: string;
  en: string;
};

export type Locale = 'ko' | 'en';
export type DemoMode = 'first-time' | 'heavy';
export type Experience = 'beginner' | 'expert';

export type LocalizedStringOrPlain = LocalizedString | string;

/* ─────────────────────────── 도메인 enum ─────────────────────────── */

export type WineType = 'red' | 'white' | 'rosé' | 'sparkling' | 'fortified' | 'dessert';

export type WSETScale = 'low' | 'mediumMinus' | 'medium' | 'mediumPlus' | 'high';

export type FinishLength = 'short' | 'medium' | 'long' | 'veryLong';

export type FaultId =
  | 'corked'
  | 'brett'
  | 'volatileAcidity'
  | 'reduction'
  | 'oxidation'
  | 'heat'
  | 'mercaptan'
  | 'lightstruck'
  | 'geranium'
  | 'mousy'
  | 'cork';

export type Delta = -2 | -1 | 0 | 1 | 2;

export type StorageKind = 'cellar' | 'fridge' | 'room' | 'offsite';

export type StoreKind = 'offline' | 'online';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type BeginnerImpression = 'good' | 'okay' | 'meh' | 'bad';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type GlossaryCategory = 'sensory' | 'fault' | 'classification' | 'technique' | 'unit';

export type PurchaseSource = 'cellarRegistration' | 'tastingNote';

export type TastingNoteSource = 'cellar' | 'newEntry';
export type TastingNoteMode = 'beginner' | 'expert';

export type NotificationKind =
  | 'favoritePurchase'
  | 'drinkWindowReached'
  | 'badgeEarned'
  | 'levelUp'
  | 'reviewLiked';

/* ─────────────────────────── User ─────────────────────────── */

export interface UserStats {
  winesTasted: number;
  countriesExplored: number;
  regionsExplored: number;
  notesCount: number;
  cellarCount: number;
}

export interface User {
  id: string;
  displayName: LocalizedString;
  avatarInitial: LocalizedString;
  locale: Locale;
  experience: Experience;
  xp: number;
  levelId: number;
  joinedAt: string;
  badges: string[];
  stats: UserStats;
}

/* ─────────────────────────── Wine ─────────────────────────── */

export interface DrinkWindow {
  /** 시음 가능 시작 연도 (vintage + n) */
  from: number;
  /** 절정 연도 */
  peak: number;
  /** 시음 마감 권장 연도 */
  to: number;
}

export interface ServingTempRange {
  min: number;
  max: number;
}

export interface Wine {
  id: string;
  /** 영문/원어 와인명. 두 locale에서 그대로 노출되는 경우가 많으나
   *  통일을 위해 plain string으로 두고, 페이지에서 그대로 렌더. */
  name: string;
  producer: LocalizedString;
  vintage: number;
  country: LocalizedString;
  region: LocalizedString;
  appellation: LocalizedString;
  /** [lon, lat] */
  coords: [number, number];
  /** ISO 3166-1 numeric 3자리 zero-padded (world-110m.json geo.id와 매칭) */
  isoNumeric: string;
  grapes: LocalizedString[];
  wineType: WineType;
  /** 라벨 일러스트용 hex */
  bottleColor: string;
  drinkWindow: DrinkWindow;
  servingTempCelsius: ServingTempRange;
  /** lib/tasting-note-lexicon.ts AROMA_LEXICON id */
  signatureAromaLexIds: string[];
  averagePriceKrw: number;
  description: LocalizedString;
  storyId: string | null;
  externalRatingsId: string | null;
}

/* ─────────────────────── WineStory / ExternalRating ─────────────────────── */

export interface WineStory {
  id: string;
  wineId: string;
  wineryName: LocalizedString;
  foundedYear: number;
  location: LocalizedString;
  history: LocalizedString;
  funFact: LocalizedString;
  producerPhotoUrl: string | null;
  vineyardArea: string | null;
  philosophy: LocalizedString | null;
}

export interface VivinoRating {
  score: number;
  reviewCount: number;
}

export interface WineSearcherRating {
  score: number;
  priceRank: LocalizedString;
}

export interface CellarTrackerRating {
  score: number;
  reviewCount: number;
}

export interface ExternalRating {
  id: string;
  wineId: string;
  vivino: VivinoRating | null;
  wineSearcher: WineSearcherRating | null;
  cellarTracker: CellarTrackerRating | null;
  globalAvgPriceUsd: number | null;
  lastSyncedAt: string;
}

/* ─────────────────────── CommunityPeak ─────────────────────── */

export interface CommunityPeakEstimate {
  id: string;
  wineId: string;
  userId: string;
  estimatedPeakYear: number;
  confidence: ConfidenceLevel;
  note: LocalizedString | null;
  createdAt: string;
  /** L3~L5만 (베타 피드백 정책) */
  reviewerLevel: 3 | 4 | 5;
}

export interface CommunityPeakDistributionPoint {
  year: number;
  /** 가중 응답 수 */
  count: number;
}

export interface CommunityPeakAggregate {
  wineId: string;
  /** 응답자 수 */
  count: number;
  meanPeakYear: number;
  medianPeakYear: number;
  distribution: CommunityPeakDistributionPoint[];
  /** Wine.drinkWindow.peak (비교용) */
  systemPeakYear: number;
}

/* ─────────────────────── LabelPhoto ─────────────────────── */

export interface LabelPhoto {
  id: string;
  userId: string;
  wineId: string | null;
  photoUrl: string;
  capturedAt: string;
  location: LocalizedString | null;
  tags: string[];
  linkedTastingNoteId: string | null;
  linkedCellarItemId: string | null;
}

/* ─────────────────────── Glossary ─────────────────────── */

export interface GlossaryEntry {
  id: string;
  term: LocalizedString;
  definition: LocalizedString;
  examples: LocalizedString | null;
  relatedTermIds: string[];
  source: LocalizedString | null;
  category: GlossaryCategory;
}

/* ─────────────────────── CellarItem ─────────────────────── */

export interface CellarItem {
  id: string;
  userId: string;
  wineId: string;
  acquiredAt: string;
  storage: StorageKind;
  notes: LocalizedString | null;
  purchasePriceKrw: number | null;
  notifyAtPeak: boolean;
  photoUrl: string | null;
}

/* ─────────────────────── TastingNote ─────────────────────── */

export interface BeginnerFields {
  impression: BeginnerImpression;
  sweetness: 1 | 2 | 3 | 4 | 5;
  acidity: 1 | 2 | 3 | 4 | 5;
  body: 1 | 2 | 3 | 4 | 5;
  tannin: 1 | 2 | 3 | 4 | 5;
  /** AROMA_LEXICON id 배열 */
  aromas: string[];
  finish: 'short' | 'medium' | 'long';
  /** 0~5 */
  rating: number;
  memo: LocalizedString;
}

export interface AromaWheelSelection {
  /** 12 wedge category id (fruity, floral...) */
  categoryId: string;
  /** AROMA_LEXICON id 배열 */
  terms: string[];
}

export interface EvolutionTimepoint {
  minutes: number;
  deltaAroma: Delta;
  deltaTannin: Delta;
  deltaBody: Delta;
  /** 0~100 */
  score: number;
}

export interface EvolutionRecord {
  openedAt: string;
  decant: boolean;
  timepoints: EvolutionTimepoint[];
  /** 절정까지 걸린 분 */
  peakAt: number;
}

export type TanninRipeness = 'ripe' | 'unripe' | 'overripe';

/** 스파클링 전용 — note-write-expert의 BubblePanel/DOSAGE 입력 매핑 */
export interface BubbleFields {
  /** lexicon BubbleSize */
  size: string;
  /** lexicon BubblePersistence */
  persistence: string;
  /** lexicon MousseTexture */
  mousse: string;
  /** lexicon SparklingMethod */
  method: string;
}

export interface ExpertFields {
  sweetness: WSETScale;
  acidity: WSETScale;
  body: WSETScale;
  /** 알코올 강도 (작성 폼 step 3) */
  alcohol: WSETScale;
  tannin: WSETScale;
  /** TanninTexture id (lexicon.ts) */
  tanninTexture: string;
  /** 타닌 숙성도 — 레드만 의미 있음, 화이트/스파클링은 null */
  tanninRipeness: TanninRipeness | null;
  intensity: WSETScale;
  flavorIntensity: WSETScale;
  finishLength: FinishLength;
  aromaWheel: AromaWheelSelection[];
  faults: FaultId[];
  evolution: EvolutionRecord;
  /** 카우달리 (1 caudalie = 1초 잔향) */
  caudalies: number;
  /** 0~100 */
  rating: number;
  memo: LocalizedString;
  /** 작성 폼 step 3의 자유 입력 풍미 노트 (memo와 분리) */
  flavorNotes: LocalizedString;
  /** 작성 폼 마지막의 재구매 의향 토글 */
  wouldBuyAgain: boolean | null;
  /** 스파클링 와인일 때만 채움 */
  bubbles: BubbleFields | null;
  /** SparklingDosage id (lexicon) — 스파클링만 */
  dosage: string | null;
  /** 베타 피드백 — 시음 온도 */
  servingTempCelsius: number | null;
  /** 베타 피드백 — peak ETA */
  peakEstimateYear: number | null;
  peakEstimateConfidence: ConfidenceLevel | null;
  peakEstimateNote: LocalizedString | null;
}

export interface TastingNote {
  id: string;
  userId: string;
  wineId: string;
  source: TastingNoteSource;
  cellarItemId: string | null;
  tastedAt: string;
  mode: TastingNoteMode;
  beginnerFields: BeginnerFields | null;
  expertFields: ExpertFields | null;
  /** custom template으로 작성된 경우 templateId + customFields 채움 (mode === 'custom') */
  templateId?: string | null;
  customFields?: Record<string, CustomFieldValue> | null;
  photoUrl: string | null;
  priceKrw: number | null;
  isPublic: boolean;
  createdAt: string;
}

/* ─────────────────────── Tasting Template (커스텀 노트 양식) ─────────────────────── */

export type CustomFieldValue =
  | { kind: 'slider'; value: number }
  | { kind: 'wsetScale'; value: WSETScale }
  | { kind: 'chipsSingle'; value: string }
  | { kind: 'chipsMulti'; value: string[] }
  | { kind: 'text'; value: string }
  | { kind: 'number'; value: number }
  | { kind: 'rating'; value: number }
  | { kind: 'checkbox'; value: boolean };

export type TemplateFieldType =
  | 'slider'        // 1~max (default 5)
  | 'wsetScale'     // low | mediumMinus | medium | mediumPlus | high
  | 'chipsSingle'   // pick one from options
  | 'chipsMulti'    // pick multiple from options
  | 'text'          // memo
  | 'number'        // raw number
  | 'rating'        // 0~5 star
  | 'checkbox';     // boolean

export interface TemplateFieldOption {
  id: string;
  label: LocalizedString;
}

export interface TemplateField {
  id: string;
  type: TemplateFieldType;
  label: LocalizedString;
  description?: LocalizedString;
  options?: TemplateFieldOption[];
  min?: number;
  max?: number;
}

export type TastingTemplateKind = 'builtinBeginner' | 'builtinExpert' | 'custom';

export interface TastingTemplate {
  id: string;
  kind: TastingTemplateKind;
  title: LocalizedString;
  description: LocalizedString | null;
  /** custom 템플릿 작성자 (builtin은 null) */
  authorUserId: string | null;
  authorName: LocalizedString | null;
  /** 커뮤니티 공유 여부 */
  isPublic: boolean;
  savesCount: number;
  createdAt: string;
  fields: TemplateField[];
}

/* ─────────────────────── Purchase / Store ─────────────────────── */

export interface Purchase {
  id: string;
  userId: string;
  wineId: string;
  priceKrw: number;
  currency: 'KRW';
  storeId: string;
  purchasedAt: string;
  source: PurchaseSource;
}

export interface Store {
  id: string;
  name: LocalizedString;
  branch: LocalizedString | null;
  kind: StoreKind;
  location: LocalizedString | null;
}

/* ─────────────────────── FavoriteWine / Notification ─────────────────────── */

export interface FavoriteWine {
  id: string;
  userId: string;
  wineId: string;
  notifyOnPurchase: boolean;
  addedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  kind: NotificationKind;
  wineId: string | null;
  cellarItemId: string | null;
  badgeId: string | null;
  actorUserId: string | null;
  title: LocalizedString;
  body: LocalizedString;
  createdAt: string;
  read: boolean;
}

/* ─────────────────────── Badge / Level / Review ─────────────────────── */

export interface Badge {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  iconPath: string;
  tier: BadgeTier;
  earnedCondition: LocalizedString;
}

export interface Level {
  id: number;
  name: LocalizedString;
  minXp: number;
  maxXp: number | null;
  color: string;
  description: LocalizedString;
}

export interface Review {
  id: string;
  userId: string;
  wineId: string;
  body: LocalizedString;
  /** beginner: 0~5, expert: 0~100 */
  rating: number;
  mode: TastingNoteMode;
  createdAt: string;
  likesCount: number;
}

/* ─────────────────────── Community ─────────────────────── */

export type CommunityPostType = 'note' | 'column' | 'question' | 'news' | 'album';

export interface CommunityReactions {
  glass: number;
  sparkle: number;
  bookmark: number;
  drank: number;
}

export interface CommunityUser {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  levelLabel: string;
  color: string;
  initial: string;
}

export interface CommunityPost {
  id: string;
  type: CommunityPostType;
  userId: string;
  ago: string;
  wineId?: string;
  rating?: number;
  title: string;
  body: string;
  cover?: 'vineyard';
  reactions: CommunityReactions;
  comments: number;
  photoCount?: number;
}
