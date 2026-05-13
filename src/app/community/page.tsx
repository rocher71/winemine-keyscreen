'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Moon, Search, PenLine, TrendingUp, Flame, ChevronUp, ChevronRight } from 'lucide-react';
import { AppHeader } from '@/components/nav/app-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { CommFeedCard, CommFeedRow } from '@/components/community/comm-feed-card';
import { PostTypeBadge } from '@/components/community/post-type-badge';
import { getCommunityPosts, getCommunityUser } from '@/lib/mock/community-posts';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { useLocale } from '@/context/locale-context';
import { useTranslations } from 'next-intl';
import type { CommunityPostType } from '@/types';
import type { Route } from 'next';

type Tab = 'following' | 'all' | 'trending';
type TypeFilter = 'all' | CommunityPostType;

const TYPE_FILTERS: TypeFilter[] = ['all', 'note', 'question', 'column', 'news', 'album'];

export default function CommunityPage() {
  const t = useTranslations('community');
  const { locale } = useLocale();
  const [tab, setTab] = useState<Tab>('following');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const posts = getCommunityPosts();

  useRegisterFeatures('/community', [
    { id: 'community.header', labelKo: '커뮤니티 헤더', labelEn: 'Community header', defaultStatus: 'planned' },
    { id: 'community.tabs', labelKo: '탭 바', labelEn: 'Tab bar', defaultStatus: 'planned' },
    { id: 'community.tonightBanner', labelKo: '오늘 밤 배너', labelEn: 'Tonight banner', defaultStatus: 'planned' },
    { id: 'community.feedCards', labelKo: '피드 카드', labelEn: 'Feed cards', defaultStatus: 'planned' },
    { id: 'community.fab', labelKo: 'FAB 작성', labelEn: 'Compose FAB', defaultStatus: 'planned' },
    { id: 'community.typeFilter', labelKo: '타입 필터', labelEn: 'Type filter', defaultStatus: 'planned' },
    { id: 'community.trending', labelKo: '트렌딩', labelEn: 'Trending', defaultStatus: 'planned' },
  ]);

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'following', label: t('tabs.following') },
    { id: 'all',       label: t('tabs.all') },
    { id: 'trending',  label: t('tabs.trending') },
  ];

  const typeFilterLabels: Record<TypeFilter, string> = {
    all:      locale === 'en' ? 'All' : '전체',
    note:     locale === 'en' ? 'Tasting Notes' : '시음 노트',
    question: locale === 'en' ? 'Questions' : '질문',
    column:   locale === 'en' ? 'Columns' : '칼럼',
    news:     locale === 'en' ? 'News' : '소식',
    album:    locale === 'en' ? 'Albums' : '사진',
  };

  const filteredPosts =
    typeFilter === 'all' ? posts : posts.filter((p) => p.type === typeFilter);

  const trendingPosts = [posts[2], posts[5], posts[0], posts[4]].filter(Boolean);

  return (
    <>
      <AppHeader hasUnreadNotification={false} />

      <div className="wm-scroll-area" style={{ paddingBottom: 20 }}>
        {/* Title row */}
        <div
          style={{
            padding: '14px 20px 8px',
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--color-gold)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              {t('title')}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 22,
                color: 'var(--color-cream)',
                marginTop: 2,
              }}
            >
              {tab === 'following'
                ? t('pageTitle')
                : tab === 'all'
                ? locale === 'en'
                  ? 'All Stories'
                  : '모든 잔의 이야기'
                : locale === 'en'
                ? 'Most Raised Glasses'
                : '가장 많이 든 잔들'}
            </div>
          </div>
          <span style={{ flex: 1 }} />
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Search size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            gap: 22,
            padding: '6px 20px 0',
            borderBottom: '0.5px solid var(--color-border-default)',
          }}
        >
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 13,
                fontWeight: tab === tb.id ? 600 : 400,
                color: tab === tb.id ? 'var(--color-cream)' : 'var(--color-text-muted)',
                paddingBottom: 10,
                borderBottom: `2px solid ${tab === tb.id ? 'var(--color-gold)' : 'transparent'}`,
                marginBottom: -1,
                cursor: 'pointer',
                fontFamily: 'var(--font-inter)',
              }}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* ───── FOLLOWING TAB ───── */}
        {tab === 'following' && (
          <>
            {/* Tonight teaser */}
            <Link href={'/community/tonight' as Route} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  margin: '12px 16px 0',
                  padding: '12px 14px',
                  borderRadius: 12,
                  background:
                    'linear-gradient(135deg, rgba(139,26,42,0.33), var(--color-bg-surface))',
                  border: '1px solid rgba(201,168,76,0.33)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: 'var(--color-bg-deep)',
                    border: '1px solid var(--color-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Moon size={18} strokeWidth={1.75} color="var(--color-gold)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--color-cream)',
                      fontWeight: 600,
                    }}
                  >
                    {locale === 'en' ? '14 people are raising a glass' : '지금 마시는 사람들 · 14명'}
                  </div>
                  <div
                    style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}
                  >
                    {t('tonight.places')}
                  </div>
                </div>
                <ChevronRight size={16} strokeWidth={1.75} color="var(--color-gold)" />
              </div>
            </Link>

            {/* Feed */}
            <div
              style={{
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <CommFeedCard post={posts[0]} mine="glass" />
              <CommFeedCard post={posts[2]} />
              <CommFeedCard post={posts[1]} />
            </div>
          </>
        )}

        {/* ───── ALL TAB ───── */}
        {tab === 'all' && (
          <>
            {/* Type filter chips */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                padding: '10px 16px 6px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 999,
                    background: typeFilter === f ? 'rgba(201,168,76,0.13)' : 'transparent',
                    border: `1px solid ${typeFilter === f ? 'var(--color-gold)' : 'var(--color-border-default)'}`,
                    color: typeFilter === f ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  {typeFilterLabels[f]}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredPosts.map((p) => (
                <CommFeedRow key={p.id} post={p} />
              ))}
            </div>
          </>
        )}

        {/* ───── TRENDING TAB ───── */}
        {tab === 'trending' && (
          <>
            {/* Keywords */}
            <div
              style={{
                margin: '12px 16px 0',
                padding: '14px 16px',
                borderRadius: 14,
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--color-gold)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                {t('keywords')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(
                  [
                    { l: locale === 'en' ? 'Burgundy 22 vintage' : '부르고뉴 22빈티지', n: 142, c: 'var(--color-gold)' },
                    { l: locale === 'en' ? 'Les Rugiens'         : '레 루지엥',         n: 89,  c: 'var(--color-wine-red)' },
                    { l: locale === 'en' ? 'Decanting time'      : '디캔팅 시간',       n: 67,  c: 'var(--color-cream)' },
                    { l: locale === 'en' ? 'Wedding wine'        : '결혼식 와인',       n: 54,  c: undefined },
                    { l: locale === 'en' ? 'Spring drinking window': '봄 음용 적기',    n: 41,  c: undefined },
                    { l: locale === 'en' ? 'Natural'             : '내츄럴',            n: 33,  c: undefined },
                  ] as Array<{ l: string; n: number; c?: string }>
                ).map((tk, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '6px 11px',
                      borderRadius: 999,
                      background: tk.c ? `${tk.c}1a` : 'var(--color-bg-deep)',
                      border: `1px solid ${tk.c ? `${tk.c}66` : 'var(--color-border-default)'}`,
                      color: tk.c || 'var(--color-text-secondary)',
                      fontSize: 11,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>#{tk.l}</span>
                    <span style={{ fontSize: 10, opacity: 0.7 }}>{tk.n}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Ranked posts */}
            <div style={{ padding: '14px 20px 4px' }}>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--color-gold)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                {t('trending')}
              </div>
            </div>
            <div
              style={{
                padding: '0 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {trendingPosts.map((p, i) => {
                const user = getCommunityUser(p.userId);
                const rankIcon =
                  i === 0 ? (
                    <TrendingUp size={11} strokeWidth={1.75} />
                  ) : i === 1 ? (
                    <Flame size={11} strokeWidth={1.75} />
                  ) : (
                    <ChevronUp size={11} strokeWidth={1.75} />
                  );

                return (
                  <Link
                    key={p.id}
                    href={`/community/${p.id}` as Route}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        padding: 14,
                        borderRadius: 12,
                        background: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border-default)',
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          fontFamily: 'var(--font-playfair)',
                          fontSize: 22,
                          color: i < 3 ? 'var(--color-gold)' : 'var(--color-text-muted)',
                          lineHeight: 1,
                          textAlign: 'center',
                        }}
                      >
                        {i + 1}
                        <div
                          style={{
                            marginTop: 4,
                            color: i < 3 ? 'var(--color-gold)' : 'var(--color-text-muted)',
                          }}
                        >
                          {rankIcon}
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <PostTypeBadge type={p.type} locale={locale} />
                        <div
                          style={{
                            fontFamily: 'var(--font-playfair)',
                            fontSize: 13,
                            color: 'var(--color-cream)',
                            marginTop: 6,
                            lineHeight: 1.3,
                          }}
                        >
                          {p.title}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            marginTop: 6,
                            fontSize: 10,
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          <span>{user?.name}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <span style={{ color: 'var(--color-gold)' }}>
                              {p.reactions.glass}
                            </span>
                          </span>
                          <span>{p.comments}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <div style={{ height: 32 }} />
      </div>

      {/* FAB compose */}
      <Link
        href={'/community/new' as Route}
        style={{
          position: 'absolute',
          right: 18,
          bottom: 100,
          width: 56,
          height: 56,
          borderRadius: 999,
          background: 'linear-gradient(135deg, var(--color-wine-red), #6b0f1e)',
          border: '1px solid var(--color-gold)',
          color: 'var(--color-cream)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 24px rgba(139,26,42,0.45)',
          textDecoration: 'none',
          zIndex: 20,
        }}
      >
        <PenLine size={22} strokeWidth={1.75} />
      </Link>

      <BottomNav />
    </>
  );
}
