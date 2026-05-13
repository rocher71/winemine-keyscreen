'use client';

import { Wine, Sparkles, Bookmark, Bot, MessageSquare } from 'lucide-react';
import type { CommunityReactions } from '@/types';

type ReactionId = 'glass' | 'sparkle' | 'bookmark' | 'drank';

const REACTION_ITEMS: Array<{
  id: ReactionId;
  labelKo: string;
  labelEn: string;
  color: string;
  Icon: typeof Wine;
}> = [
  { id: 'glass',    labelKo: '잔 들기', labelEn: 'Toast',    color: '#C9A84C', Icon: Wine      },
  { id: 'sparkle',  labelKo: '통찰',    labelEn: 'Insight',  color: '#F5F0E8', Icon: Sparkles  },
  { id: 'bookmark', labelKo: '저장',    labelEn: 'Save',     color: '#a08ee0', Icon: Bookmark  },
  { id: 'drank',    labelKo: '나도',    labelEn: 'Me too',   color: '#8B1A2A', Icon: Bot       },
];

type Props = {
  reactions?: Partial<CommunityReactions>;
  comments?: number;
  /** 현재 사용자가 누른 리액션 ID */
  mine?: ReactionId | null;
  locale?: 'ko' | 'en';
};

export function ReactionBar({ reactions = {}, comments = 0, mine = null, locale = 'ko' }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 4 }}>
      {REACTION_ITEMS.map((item) => {
        const on = mine === item.id;
        const count = reactions[item.id] ?? 0;
        const { Icon, color } = item;
        const label = locale === 'en' ? item.labelEn : item.labelKo;

        return (
          <button
            key={item.id}
            title={label}
            style={{
              padding: '6px 10px 6px 8px',
              borderRadius: 999,
              background: on ? `${color}22` : 'transparent',
              border: `1px solid ${on ? color : 'var(--color-border-default)'}`,
              color: on ? color : 'var(--color-text-secondary)',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'var(--font-inter)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
            }}
          >
            <Icon size={13} strokeWidth={1.75} />
            {count > 0 && <span style={{ fontSize: 11 }}>{count}</span>}
          </button>
        );
      })}

      <span style={{ flex: 1 }} />

      <button
        style={{
          padding: '6px 10px',
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-muted)',
          fontSize: 11,
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          cursor: 'pointer',
        }}
      >
        <MessageSquare size={12} strokeWidth={1.75} />
        {locale === 'en' ? `${comments} comments` : `댓글 ${comments}`}
      </button>
    </div>
  );
}
