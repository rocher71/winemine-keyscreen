'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Wine, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CommUserAvatar } from '@/components/community/comm-user-avatar';
import { PostTypeBadge } from '@/components/community/post-type-badge';
import { getCommunityPosts, getCommunityUser } from '@/lib/mock/community-posts';
import { getWine } from '@/lib/mock/wines';
import { useLocale } from '@/context/locale-context';

/**
 * 홈 커뮤니티 peek — E 변형의 "팔로잉의 새 노트" 섹션.
 * 최근 커뮤니티 포스트 2개를 dense row로 카드 안에 보여준다.
 * 전체 보기는 /community로.
 */
export function HomeCommunityPeek() {
  const t = useTranslations('home.communityPeek');
  const { locale } = useLocale();
  const posts = getCommunityPosts().slice(0, 2);

  return (
    <section style={{ marginTop: 22 }} data-feature-id="home.communityPeek">
      <SectionTitle
        eyebrow={t('eyebrow')}
        title={t('title')}
        actionLabel={t('viewAll')}
        actionHref="/community"
      />
      <div
        style={{
          margin: '0 16px',
          padding: '4px 14px',
          borderRadius: 14,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
        }}
      >
        {posts.map((post, i) => {
          const user = getCommunityUser(post.userId);
          const wine = post.wineId ? getWine(post.wineId) : null;
          if (!user) return null;
          const wineLabel = wine
            ? locale === 'ko'
              ? wine.appellation.ko
              : wine.appellation.en
            : null;
          return (
            <Link
              key={post.id}
              href={`/community/${post.id}` as Route}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  padding: '10px 0',
                  display: 'flex',
                  gap: 10,
                  borderBottom:
                    i < posts.length - 1
                      ? '0.5px solid var(--color-border-default)'
                      : 'none',
                }}
              >
                <CommUserAvatar userId={post.userId} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 3,
                    }}
                  >
                    <PostTypeBadge type={post.type} locale={locale} />
                    <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                      {user.name} · {post.ago}
                    </span>
                  </div>
                  <div
                    style={
                      {
                        fontFamily: 'var(--font-playfair)',
                        fontSize: 13,
                        color: 'var(--color-cream)',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      } as CSSProperties
                    }
                  >
                    {post.title}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontSize: 10,
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <Wine size={10} strokeWidth={1.75} color="var(--color-gold)" />
                      {post.reactions.glass}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <MessageSquare size={10} strokeWidth={1.75} />
                      {post.comments}
                    </span>
                    {wineLabel && (
                      <span
                        style={{
                          color: 'var(--color-gold)',
                          fontSize: 9,
                          letterSpacing: '0.06em',
                        }}
                      >
                        · {wineLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  actionLabel,
  actionHref,
}: {
  eyebrow: string;
  title: string;
  actionLabel?: string;
  actionHref?: Route | string;
}) {
  return (
    <div
      style={{
        padding: '0 20px 8px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 10,
            color: 'var(--color-gold)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 2,
            fontWeight: 500,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 17,
            color: 'var(--color-cream)',
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref as Route}
          style={{
            fontSize: 11,
            color: 'var(--color-gold)',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

