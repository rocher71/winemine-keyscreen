'use client';

import { useTranslations } from 'next-intl';
import { xpToLevel } from '@/lib/xp';
import { getLevel } from '@/lib/mock/levels';
import { LocaleText } from './locale-text';

type Props = {
  xp: number;
  /** 클릭 핸들러 (예: /badges로 이동) */
  onClick?: () => void;
};

/**
 * 레벨 진행 바. 라벨 + 진행 게이지 6px.
 */
export function LevelProgressBar({ xp, onClick }: Props) {
  const t = useTranslations('levels');
  const { levelId, progressPct } = xpToLevel(xp);
  const level = getLevel(levelId);
  const next = levelId < 5 ? getLevel(levelId + 1) : null;
  const isMax = level.maxXp === null;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        display: 'block',
        width: '100%',
        cursor: onClick ? 'pointer' : 'default',
        padding: '4px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              background: level.color,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--color-bg-deepest)',
              flexShrink: 0,
            }}
          >
            {levelId}
          </span>
          <LocaleText
            value={level.name}
            as="span"
            className="wm-level-name"
          />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          {isMax
            ? t('maxed')
            : t('progress', { current: xp, next: next?.minXp ?? xp })}
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: 6,
          background: 'var(--color-border-default)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-gold), var(--color-cream))',
            borderRadius: 3,
            transition: 'width 400ms ease-out',
            boxShadow: '0 0 12px rgba(201,168,76,0.5)',
          }}
        />
      </div>
    </button>
  );
}
