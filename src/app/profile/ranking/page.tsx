'use client';

import { useTranslations } from 'next-intl';
import { BackHeader } from '@/components/nav/back-header';
import { useMockUser } from '@/hooks/use-mock-user';
import { LEVELS } from '@/lib/mock/levels';
import { XP_ACTIONS, xpToLevel } from '@/lib/xp';
import { LocaleText } from '@/components/shared/locale-text';
import { Sparkles, TrendingUp, Award, Camera, BookOpen, Wine, Tag, MapPin, Globe2, MessageSquare } from 'lucide-react';
import type { ReactNode } from 'react';
import { useRegisterFeatures } from '@/context/feature-flag-context';

/**
 * 랭킹 상세 페이지 — /profile/ranking
 *
 * 사용자에게 노출:
 *  (1) 현재 레벨과 다음 레벨까지의 진척도
 *  (2) XP 적립 방법 — XP_ACTIONS 전체를 카드 리스트로
 *  (3) 5단계 레벨 카탈로그 + 각 레벨의 혜택 (정책 임의 정의)
 *
 * 혜택 정책은 시안 단계 임의 정의 — Phase 3에서 실제 정책과 동기화 필요.
 */
export default function RankingPage() {
  const t = useTranslations('ranking');
  const { user } = useMockUser();
  const currentLevel = xpToLevel(user.xp);

  useRegisterFeatures('/profile/ranking', [
    { id: 'ranking.current', labelKo: '현재 레벨 카드', labelEn: 'Current level card', defaultStatus: 'planned' },
    { id: 'ranking.actions', labelKo: 'XP 적립 액션', labelEn: 'XP earning actions', defaultStatus: 'planned' },
    { id: 'ranking.tiers', labelKo: '5 레벨 카탈로그', labelEn: '5 level catalog', defaultStatus: 'planned' },
  ]);

  return (
    <>
      <BackHeader title={{ ko: '랭킹 상세', en: 'Ranking details' }} />
      <div className="wm-scroll-area" style={{ paddingBottom: 100 }}>
        {/* (1) 현재 레벨 카드 */}
        <CurrentLevelCard
          levelId={currentLevel.levelId}
          xp={user.xp}
          progressPct={currentLevel.progressPct}
          remaining={currentLevel.remaining}
        />

        {/* (2) XP 적립 방법 */}
        <Section title={t('actions.heading')} subtitle={t('actions.subtitle')}>
          <div data-feature-id="ranking.actions" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {XP_ACTION_LIST.map((action) => (
              <ActionRow key={action.id} action={action} t={t} />
            ))}
          </div>
        </Section>

        {/* (3) 5단계 레벨 카탈로그 + 혜택 */}
        <Section title={t('tiers.heading')} subtitle={t('tiers.subtitle')}>
          <div data-feature-id="ranking.tiers" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LEVELS.map((level) => (
              <LevelCard
                key={level.id}
                level={level}
                benefits={BENEFITS_BY_LEVEL[level.id]}
                isCurrent={level.id === currentLevel.levelId}
              />
            ))}
          </div>
        </Section>

        {/* 푸터 안내 */}
        <div
          style={{
            margin: '16px 16px 0',
            padding: 12,
            borderRadius: 10,
            background: 'rgba(74, 61, 86, 0.18)',
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
          }}
        >
          {t('disclaimer')}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────── Current Level Card ─────────────────────── */

function CurrentLevelCard({
  levelId,
  xp,
  progressPct,
  remaining,
}: {
  levelId: number;
  xp: number;
  progressPct: number;
  remaining: number;
}) {
  const t = useTranslations('ranking');
  const level = LEVELS.find((l) => l.id === levelId)!;
  const nextLevel = LEVELS.find((l) => l.id === levelId + 1);

  return (
    <section
      data-feature-id="ranking.current"
      style={{
        margin: '8px 16px 0',
        padding: 20,
        borderRadius: 18,
        background: 'var(--color-surface)',
        border: `1px solid ${level.color}`,
        boxShadow: `0 0 24px ${level.color}22`,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          aria-hidden
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: level.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-cream)',
            flexShrink: 0,
          }}
        >
          <Award size={26} strokeWidth={1.75} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              marginBottom: 2,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {t('current.label')}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 22,
              color: 'var(--color-cream)',
              lineHeight: 1.1,
            }}
          >
            L{level.id} · <LocaleText value={level.name} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              marginTop: 4,
            }}
          >
            {t('current.xp', { xp })}
          </div>
        </div>
      </div>

      {nextLevel && (
        <>
          {/* Progress bar */}
          <div
            style={{
              width: '100%',
              height: 8,
              borderRadius: 4,
              background: 'rgba(45, 21, 64, 0.6)',
              overflow: 'hidden',
            }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPct}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${level.color}, var(--color-gold))`,
                transition: 'width 600ms ease-out',
              }}
            />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              {t('current.toNext', { count: remaining })}
            </span>
            <span style={{ color: 'var(--color-gold)' }}>
              L{nextLevel.id} <LocaleText value={nextLevel.name} as="span" />
            </span>
          </div>
        </>
      )}

      {!nextLevel && (
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            color: 'var(--color-gold)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Sparkles size={14} />
          {t('current.maxLevel')}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────── Section Wrapper ─────────────────────── */

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 24 }}>
      <div style={{ padding: '0 20px 10px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 18,
            color: 'var(--color-cream)',
            margin: 0,
            marginBottom: subtitle ? 4 : 0,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ padding: '0 16px' }}>{children}</div>
    </section>
  );
}

/* ─────────────────────── Action Row ─────────────────────── */

type ActionMeta = {
  id: keyof typeof XP_ACTIONS;
  icon: ReactNode;
  i18nKey: string;
};

const XP_ACTION_LIST: ActionMeta[] = [
  { id: 'cellarAdd', icon: <Wine size={18} />, i18nKey: 'actions.cellarAdd' },
  { id: 'beginnerNote', icon: <BookOpen size={18} />, i18nKey: 'actions.beginnerNote' },
  { id: 'expertNote', icon: <BookOpen size={18} />, i18nKey: 'actions.expertNote' },
  { id: 'expertBlindNote', icon: <Sparkles size={18} />, i18nKey: 'actions.expertBlindNote' },
  { id: 'photoAttach', icon: <Camera size={18} />, i18nKey: 'actions.photoAttach' },
  { id: 'priceAdd', icon: <Tag size={18} />, i18nKey: 'actions.priceAdd' },
  { id: 'peakEstimate', icon: <TrendingUp size={18} />, i18nKey: 'actions.peakEstimate' },
  { id: 'firstCountry', icon: <Globe2 size={18} />, i18nKey: 'actions.firstCountry' },
  { id: 'firstRegion', icon: <MapPin size={18} />, i18nKey: 'actions.firstRegion' },
  { id: 'communityReview', icon: <MessageSquare size={18} />, i18nKey: 'actions.communityReview' },
];

function ActionRow({ action, t }: { action: ActionMeta; t: ReturnType<typeof useTranslations> }) {
  const xp = XP_ACTIONS[action.id];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 12,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          background: 'rgba(201, 168, 76, 0.12)',
          color: 'var(--color-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {action.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-cream)',
            marginBottom: 2,
          }}
        >
          {t(`${action.i18nKey}.title`)}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            lineHeight: 1.4,
          }}
        >
          {t(`${action.i18nKey}.sub`)}
        </div>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 18,
          color: 'var(--color-gold)',
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        +{xp}
      </div>
    </div>
  );
}

/* ─────────────────────── Level Card ─────────────────────── */

const BENEFITS_BY_LEVEL: Record<number, Array<{ ko: string; en: string }>> = {
  1: [
    { ko: '기본 기능 — 스캔·셀러·노트·세계 지도', en: 'Core features — scan, cellar, notes, world map' },
    { ko: '입문자 모드 7단계 노트 작성', en: 'Beginner 7-step note writing' },
  ],
  2: [
    { ko: 'L1의 모든 기능', en: 'Everything in L1' },
    { ko: '추천 와인 알고리즘 활성화', en: 'Recommended wines unlocked' },
    { ko: '가격 추적 기능 사용 가능', en: 'Price tracking enabled' },
  ],
  3: [
    { ko: 'L2의 모든 기능', en: 'Everything in L2' },
    { ko: '커뮤니티 음용 적기(Peak ETA) 입력 권한 — 가중치 1.0×', en: 'Community peak ETA submission — weight 1.0×' },
    { ko: '외부 평점 카드 표시 (Vivino · Wine-Searcher · CellarTracker)', en: 'External ratings (Vivino · Wine-Searcher · CellarTracker)' },
    { ko: 'WSET SAT 호환 전문가 노트 추천', en: 'WSET SAT expert note recommended' },
  ],
  4: [
    { ko: 'L3의 모든 기능', en: 'Everything in L3' },
    { ko: 'Peak ETA 추정 가중치 1.5× (커뮤니티 영향력 증가)', en: 'Peak ETA weight 1.5× (greater community influence)' },
    { ko: '와이너리 스토리 상세 — 양조 철학·역사·메타 풀세트', en: 'Winery story in-depth — philosophy, history, full metadata' },
    { ko: '블라인드 마스터 도전 (정답 채점 + 등급)', en: 'Blind Master challenge (scoring + rank)' },
  ],
  5: [
    { ko: 'L4의 모든 기능', en: 'Everything in L4' },
    { ko: 'Peak ETA 추정 가중치 2.0× (최대 영향력)', en: 'Peak ETA weight 2.0× (maximum influence)' },
    { ko: '큐레이션 이벤트 사전 초대 — 새 와인 시음회·테이스팅 클래스', en: 'Early invites to curated events — new wine tastings, classes' },
    { ko: '"Master" 뱃지 자동 부여 + 커뮤니티 노출 우선순위', en: 'Auto "Master" badge + community visibility priority' },
  ],
};

function LevelCard({
  level,
  benefits,
  isCurrent,
}: {
  level: (typeof LEVELS)[number];
  benefits: Array<{ ko: string; en: string }>;
  isCurrent: boolean;
}) {
  const t = useTranslations('ranking');
  const xpRange = level.maxXp === null ? `${level.minXp.toLocaleString()}+` : `${level.minXp.toLocaleString()}–${level.maxXp.toLocaleString()}`;

  return (
    <div
      style={{
        padding: 16,
        background: 'var(--color-surface)',
        border: isCurrent ? `2px solid ${level.color}` : '1px solid var(--color-border-default)',
        borderRadius: 14,
        position: 'relative',
      }}
    >
      {isCurrent && (
        <span
          style={{
            position: 'absolute',
            top: -10,
            right: 14,
            padding: '3px 10px',
            background: level.color,
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 10,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {t('tiers.youAreHere')}
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div
          aria-hidden
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            background: level.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-playfair)',
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {level.id}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 17,
              color: 'var(--color-cream)',
              lineHeight: 1.1,
            }}
          >
            <LocaleText value={level.name} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              marginTop: 2,
            }}
          >
            {xpRange} XP
          </div>
        </div>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          lineHeight: 1.55,
          marginBottom: 12,
        }}
      >
        <LocaleText value={level.description} />
      </div>

      <div
        style={{
          padding: 12,
          background: 'rgba(201, 168, 76, 0.06)',
          borderRadius: 10,
          border: '1px solid rgba(201, 168, 76, 0.18)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-gold)',
            fontWeight: 600,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Sparkles size={12} />
          {t('tiers.benefits')}
        </div>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {benefits.map((b, i) => (
            <li
              key={i}
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 12,
                color: 'var(--color-cream)',
                lineHeight: 1.5,
                paddingLeft: 14,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 7,
                  width: 4,
                  height: 4,
                  background: 'var(--color-gold)',
                  borderRadius: 2,
                }}
                aria-hidden
              />
              <LocaleText value={b} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
