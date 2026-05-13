'use client';

import { Wine } from 'lucide-react';
import { CommUserAvatar } from './comm-user-avatar';
import { getCommunityUser } from '@/lib/mock/community-posts';

type Props = {
  userId: string;
  ago: string;
  text: string;
  reactions?: number;
  isReply?: boolean;
  expert?: boolean;
  locale?: 'ko' | 'en';
};

export function CommentRow({
  userId,
  ago,
  text,
  reactions = 0,
  isReply = false,
  expert = false,
  locale = 'ko',
}: Props) {
  const user = getCommunityUser(userId);
  if (!user) return null;

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        padding: '10px 0',
        paddingLeft: isReply ? 36 : 0,
        borderBottom: '0.5px solid var(--color-border-default)',
      }}
    >
      <CommUserAvatar userId={userId} size={isReply ? 24 : 30} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name + level + expert badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-cream)',
              fontWeight: 600,
            }}
          >
            {user.name}
          </span>

          {/* Level pill */}
          <span
            style={{
              padding: '1px 5px',
              borderRadius: 999,
              background: `${user.color}22`,
              border: `1px solid ${user.color}66`,
              color: user.color,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            L{user.level}
          </span>

          {expert && (
            <span
              style={{
                padding: '1px 6px',
                borderRadius: 999,
                background: 'rgba(201,168,76,0.2)',
                border: '1px solid rgba(201,168,76,0.4)',
                color: 'var(--color-gold)',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.06em',
              }}
            >
              {locale === 'en' ? 'Expert' : '전문가'}
            </span>
          )}
        </div>

        {/* Text */}
        <div
          style={{
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            lineHeight: 1.55,
          }}
        >
          {text}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 6,
            fontSize: 10,
            color: 'var(--color-text-muted)',
          }}
        >
          <span>{ago}</span>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: 10,
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {locale === 'en' ? 'Reply' : '답글'}
          </button>
          <span style={{ flex: 1 }} />
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: 10,
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              cursor: 'pointer',
            }}
          >
            <Wine size={11} strokeWidth={1.75} />
            {reactions}
          </button>
        </div>
      </div>
    </div>
  );
}
