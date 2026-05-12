'use client';

import { useMemo, useState } from 'react';
import { LocaleText } from '@/components/shared/locale-text';
import { LevelPill } from '@/components/shared/level-pill';
import { getLevel } from '@/lib/mock/levels';
import type { CommunityPeakEstimate, ConfidenceLevel, LocalizedString } from '@/types';

type SortKey = 'recent' | 'levelDesc';

type Props = {
  estimates: CommunityPeakEstimate[];
};

/**
 * 추정자 리스트 — 익명화 정책.
 *
 * SPEC 정책: "{LevelName} #{anonId}" 형식 (예: "Connoisseur #14").
 * 닉네임은 절대 노출 X. anonId는 userId의 결정적 해시.
 */
export function ContributorsList({ estimates }: Props) {
  const [sort, setSort] = useState<SortKey>('recent');

  const sorted = useMemo(() => {
    const arr = [...estimates];
    if (sort === 'recent') {
      arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      arr.sort((a, b) => b.reviewerLevel - a.reviewerLevel);
    }
    return arr;
  }, [estimates, sort]);

  if (estimates.length === 0) return null;

  return (
    <section style={{ padding: '0 16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--color-cream)',
          }}
        >
          <LocaleText value={{ ko: '추정자 목록', en: 'Contributors' }} />
          <span
            style={{ color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 6 }}
          >
            {estimates.length}
          </span>
        </h2>
        <div style={{ display: 'flex', gap: 4 }}>
          <SortBtn
            label={{ ko: '최근', en: 'Recent' }}
            active={sort === 'recent'}
            onClick={() => setSort('recent')}
          />
          <SortBtn
            label={{ ko: '레벨 높은 순', en: 'Top level' }}
            active={sort === 'levelDesc'}
            onClick={() => setSort('levelDesc')}
          />
        </div>
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {sorted.map((e) => (
          <li key={e.id}>
            <ContributorRow estimate={e} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SortBtn({
  label,
  active,
  onClick,
}: {
  label: LocalizedString;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '4px 10px',
        background: active ? 'var(--color-wine-red)' : 'var(--color-bg-map)',
        color: active ? 'var(--color-cream)' : 'var(--color-text-muted)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 8,
        fontFamily: 'var(--font-inter)',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      <LocaleText value={label} />
    </button>
  );
}

const CONFIDENCE_COLOR: Record<ConfidenceLevel, { bg: string; fg: string; label: LocalizedString }> = {
  low: {
    bg: 'rgba(155,139,122,0.18)',
    fg: 'var(--color-text-muted)',
    label: { ko: '낮음', en: 'Low' },
  },
  medium: {
    bg: 'rgba(201,168,76,0.18)',
    fg: 'var(--color-gold)',
    label: { ko: '보통', en: 'Medium' },
  },
  high: {
    bg: 'rgba(139,26,42,0.25)',
    fg: 'var(--color-wine-red-hover)',
    label: { ko: '높음', en: 'High' },
  },
};

/**
 * 결정적 anonId — userId 해시 기반.
 */
function anonIdFor(userId: string): number {
  let h = 0;
  for (let i = 0; i < userId.length; i++) {
    h = (h * 31 + userId.charCodeAt(i)) | 0;
  }
  // 1~99 범위
  return Math.abs(h) % 99 + 1;
}

function ContributorRow({ estimate }: { estimate: CommunityPeakEstimate }) {
  const lvl = estimate.reviewerLevel;
  const level = getLevel(lvl);
  const anon = anonIdFor(estimate.userId);
  const conf = CONFIDENCE_COLOR[estimate.confidence];

  return (
    <div
      style={{
        padding: 12,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <LevelPill level={lvl} />
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--color-cream)',
            }}
          >
            <LocaleText value={level.name} />
            <span style={{ color: 'var(--color-text-muted)', marginLeft: 4, fontWeight: 400 }}>
              #{anon}
            </span>
          </span>
        </div>
        {estimate.note && (
          <LocaleText
            value={estimate.note}
            as="p"
            className="wm-contributor-note"
          />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-gold)',
          }}
        >
          {estimate.estimatedPeakYear}
        </span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 999,
            background: conf.bg,
            color: conf.fg,
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          <LocaleText value={conf.label} />
        </span>
      </div>
    </div>
  );
}
