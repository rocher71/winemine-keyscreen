'use client';

import Link from 'next/link';
import { MoreHorizontal, Wine, MessageSquare } from 'lucide-react';
import { CommUserAvatar } from './comm-user-avatar';
import { PostTypeBadge } from './post-type-badge';
import { ReactionBar } from './reaction-bar';
import { WineEmbedCard } from './wine-embed-card';
import { getCommunityUser } from '@/lib/mock/community-posts';
import { useLocale } from '@/context/locale-context';
import type { CommunityPost } from '@/types';
import type { Route } from 'next';

type Props = {
  post: CommunityPost;
  mine?: 'glass' | 'sparkle' | 'bookmark' | 'drank' | null;
};

export function CommFeedCard({ post, mine = null }: Props) {
  const user = getCommunityUser(post.userId);
  const { locale } = useLocale();
  if (!user) return null;

  return (
    <Link
      href={`/community/${post.id}` as Route}
      style={{ textDecoration: 'none' }}
    >
      <article
        style={{
          padding: '14px 16px 12px',
          borderRadius: 14,
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
        }}
      >
        {/* Type badge */}
        <div style={{ marginBottom: 10 }}>
          <PostTypeBadge type={post.type} locale={locale} />
        </div>

        {/* User row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CommUserAvatar userId={post.userId} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 13,
                  color: 'var(--color-cream)',
                }}
              >
                {user.name}
              </span>
              <span
                style={{
                  padding: '1px 5px',
                  borderRadius: 999,
                  background: `${user.color}22`,
                  border: `1px solid ${user.color}66`,
                  color: user.color,
                  fontSize: 9,
                  fontWeight: 600,
                }}
              >
                L{user.level}
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
              {post.ago}
            </div>
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <MoreHorizontal size={14} strokeWidth={1.75} />
          </button>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 16,
            color: 'var(--color-cream)',
            lineHeight: 1.3,
            marginTop: 10,
          }}
        >
          {post.title}
        </div>

        {/* Body */}
        <div
          style={{
            fontSize: 12.5,
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
            marginTop: 6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as React.CSSProperties}
        >
          {post.body}
        </div>

        {/* Wine embed for note posts */}
        {post.type === 'note' && post.wineId && (
          <div onClick={(e) => e.preventDefault()}>
            <WineEmbedCard wineId={post.wineId} />
          </div>
        )}

        {/* Reaction bar */}
        <div onClick={(e) => e.preventDefault()}>
          <ReactionBar
            reactions={post.reactions}
            comments={post.comments}
            mine={mine}
            locale={locale}
          />
        </div>
      </article>
    </Link>
  );
}

/** 전체 탭용 밀도 높은 리스트 행 */
export function CommFeedRow({ post }: { post: CommunityPost }) {
  const user = getCommunityUser(post.userId);
  const { locale } = useLocale();
  if (!user) return null;

  return (
    <Link
      href={`/community/${post.id}` as Route}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '0.5px solid var(--color-border-default)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CommUserAvatar userId={post.userId} size={26} />
          <span
            style={{ fontSize: 11, color: 'var(--color-cream)', fontWeight: 600 }}
          >
            {user.name}
          </span>
          <PostTypeBadge type={post.type} locale={locale} />
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{post.ago}</span>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 14,
            color: 'var(--color-cream)',
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </div>

        <div
          style={{
            fontSize: 11.5,
            color: 'var(--color-text-secondary)',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as React.CSSProperties}
        >
          {post.body}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 10,
            color: 'var(--color-text-muted)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Wine size={11} strokeWidth={1.75} color="var(--color-gold)" />
            {post.reactions.glass}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <MessageSquare size={11} strokeWidth={1.75} />
            {post.comments}
          </span>
          {post.reactions.drank > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                color: 'var(--color-wine-red)',
              }}
            >
              <Wine size={11} strokeWidth={1.75} color="var(--color-wine-red)" />
              {locale === 'en' ? `Me too ${post.reactions.drank}` : `나도 ${post.reactions.drank}`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
