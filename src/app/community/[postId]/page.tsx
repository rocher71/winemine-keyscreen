'use client';

import { use } from 'react';
import Link from 'next/link';
import { Share2, Bookmark, ChevronRight, Info } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { CommUserAvatar } from '@/components/community/comm-user-avatar';
import { PostTypeBadge } from '@/components/community/post-type-badge';
import { ReactionBar } from '@/components/community/reaction-bar';
import { WineEmbedCard } from '@/components/community/wine-embed-card';
import { CommentRow } from '@/components/community/comment-row';
import { CommFeedRow } from '@/components/community/comm-feed-card';
import { getCommunityPost, getCommunityPosts, getCommunityUser } from '@/lib/mock/community-posts';
import { getWine } from '@/lib/mock/wines';
import { WINES } from '@/lib/mock/wines';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { useLocale } from '@/context/locale-context';
import { useTranslations } from 'next-intl';
import type { Route } from 'next';

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = use(params);
  const post = getCommunityPost(postId);
  const t = useTranslations('community');
  const { locale } = useLocale();
  const allPosts = getCommunityPosts();

  useRegisterFeatures(`/community/${postId}`, [
    { id: 'postDetail.body', labelKo: '포스트 본문', labelEn: 'Post body', defaultStatus: 'planned' },
    { id: 'postDetail.reactions', labelKo: '리액션', labelEn: 'Reactions', defaultStatus: 'planned' },
    { id: 'postDetail.comments', labelKo: '댓글', labelEn: 'Comments', defaultStatus: 'planned' },
  ]);

  if (!post) {
    return (
      <>
        <BackHeader title={{ ko: '포스트', en: 'Post' }} />
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>
          {locale === 'en' ? 'Post not found.' : '포스트를 찾을 수 없어요.'}
        </div>
      </>
    );
  }

  const user = getCommunityUser(post.userId);

  return (
    <>
      {/* ─── NOTE ─── */}
      {post.type === 'note' && (
        <>
          <BackHeader title="">
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
              <Share2 size={18} strokeWidth={1.75} />
            </button>
          </BackHeader>

          <div className="wm-scroll-area" style={{ paddingBottom: 90 }}>
          <article style={{ padding: '14px 20px 0' }}>
            <PostTypeBadge type={post.type} locale={locale} />
            <div style={{ marginTop: 12 }}>
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CommUserAvatar userId={post.userId} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Link
                        href={`/profile/${post.userId}` as Route}
                        style={{ fontFamily: 'var(--font-playfair)', fontSize: 13, color: 'var(--color-cream)', textDecoration: 'none' }}
                      >
                        {user.name}
                      </Link>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {post.ago}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 22,
                color: 'var(--color-cream)',
                lineHeight: 1.25,
                marginTop: 14,
              }}
            >
              {post.title}
            </div>

            {/* Rating */}
            {post.rating != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 17,
                    color: 'var(--color-gold)',
                  }}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ opacity: i < Math.round(post.rating!) ? 1 : 0.25 }}>
                      {'◆'}
                    </span>
                  ))}
                  {' '}{post.rating}
                </span>
              </div>
            )}

            <div
              style={{
                fontSize: 13.5,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.75,
                marginTop: 14,
                fontStyle: 'italic',
              }}
            >
              {post.body}
            </div>

            {post.wineId && <WineEmbedCard wineId={post.wineId} />}

            {/* Expert annotation */}
            <div
              style={{
                marginTop: 14,
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(201,168,76,0.05)',
                border: '1px solid rgba(201,168,76,0.33)',
                borderLeft: '3px solid var(--color-gold)',
                display: 'flex',
                gap: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Info size={11} strokeWidth={2} color="var(--color-gold)" />
                  <span
                    style={{
                      fontSize: 9,
                      color: 'var(--color-gold)',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    {locale === 'en' ? 'Expert note · Sommelier Ham' : '전문가 각주 · 함소믈리에'}
                  </span>
                </div>
                <div
                  style={{ fontSize: 11.5, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}
                >
                  {locale === 'en'
                    ? 'Balloon decanter + 2 hours is standard for Les Rugiens. Reduction dissipating at 30 min is typical young Burgundy behavior.'
                    : '레 루지엥은 광구 디캔터 + 2시간이 표준. 30분의 환원취 사라짐은 영(young) 부르고뉴의 전형적 행동이에요.'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <ReactionBar reactions={post.reactions} comments={post.comments} mine="glass" locale={locale} />
            </div>
          </article>

          {/* "나도 마셔봤어요" CTA */}
          <div
            style={{
              margin: '20px 16px 0',
              padding: '14px 16px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(139,26,42,0.33), var(--color-bg-surface))',
              border: '1px solid rgba(201,168,76,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 22 }}>{'|>'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--color-cream)', fontWeight: 600 }}>
                {t('alsoTriedCta')}
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {t('alsoTriedSub')}
              </div>
            </div>
            <button
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                background: 'var(--color-wine-red)',
                border: 'none',
                color: 'var(--color-cream)',
                fontSize: 11,
                fontWeight: 600,
                fontFamily: 'var(--font-inter)',
                cursor: 'pointer',
              }}
            >
              + {locale === 'en' ? 'Add' : '추가'}
            </button>
          </div>

          {/* Comments preview */}
          <div
            style={{
              padding: '20px 20px 0',
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
            }}
          >
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, color: 'var(--color-cream)' }}>
              {locale === 'en' ? 'Comments' : '댓글'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{post.comments}</span>
          </div>

          <div style={{ padding: '8px 20px 0' }}>
            <CommentRow userId="sommelier" ago="8분 전" text={locale === 'en' ? "Les Rugiens clay soil — rapid reduction is normal. Even without balloon you get it in the glass." : "레 루지엥의 진흙 토양 — 환원취 빠른 진행이 정상이에요. 굳이 광구가 아니어도 잔에서 충분."} reactions={12} expert locale={locale} />
            <CommentRow userId="duckhu" ago="15분 전" text={locale === 'en' ? "Seeing this makes me want to open a bottle. Last time was last year..." : "이거 보고 저도 한 병 꺼내야겠네요. 마지막으로 본 게 작년인데..."} reactions={4} locale={locale} />
            <CommentRow userId="mineral" ago="22분 전" text={locale === 'en' ? "2017 was a really firm vintage. Jealous." : "2017은 정말 단단한 빈티지였죠. 부럽습니다."} reactions={8} locale={locale} />
          </div>

          <div
            style={{
              padding: '12px 20px 0',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Link
              href={`/community/${post.id}/comments` as Route}
              style={{
                fontSize: 11,
                color: 'var(--color-gold)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {locale === 'en' ? `See all ${post.comments} comments` : `댓글 ${post.comments}개 전체 보기`}
            </Link>
          </div>
          </div>
        </>
      )}

      {/* ─── COLUMN ─── */}
      {post.type === 'column' && (
        <>
          <BackHeader title="">
            <button style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(5,2,10,0.6)', border: 'none', color: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bookmark size={18} strokeWidth={1.75} />
            </button>
            <button style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(5,2,10,0.6)', border: 'none', color: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Share2 size={18} strokeWidth={1.75} />
            </button>
          </BackHeader>

          <div className="wm-scroll-area" style={{ paddingBottom: 20 }}>
          {/* Cover hero */}
          <div style={{ height: 280, position: 'relative', background: 'linear-gradient(180deg, #5a1a28, var(--color-bg-deep))' }}>
            <svg width="100%" height="280" viewBox="0 0 390 280" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="vine" patternUnits="userSpaceOnUse" width="18" height="18" patternTransform="rotate(-8)">
                  <rect width="18" height="18" fill="#2a141c" />
                  <rect x="0" width="9" height="18" fill="#3a1a26" />
                </pattern>
                <linearGradient id="vgrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(5,2,10,0)" />
                  <stop offset="100%" stopColor="rgba(5,2,10,0.92)" />
                </linearGradient>
              </defs>
              <rect width="390" height="280" fill="url(#vine)" opacity="0.5" />
              <rect width="390" height="280" fill="url(#vgrad)" />
            </svg>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 22px 20px' }}>
              <PostTypeBadge type="column" locale={locale} />
              <div
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 26,
                  color: 'var(--color-cream)',
                  lineHeight: 1.15,
                  marginTop: 12,
                  fontStyle: 'italic',
                }}
              >
                {post.title}
              </div>
            </div>
          </div>

          {/* Author */}
          {user && (
            <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <CommUserAvatar userId={post.userId} />
              <div>
                <Link
                  href={`/profile/${post.userId}` as Route}
                  style={{ fontSize: 13, color: 'var(--color-cream)', fontFamily: 'var(--font-playfair)', textDecoration: 'none' }}
                >
                  {user.name}
                </Link>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {post.ago} · {locale === 'en' ? 'About 8 min read' : '약 8분 읽기'}
                </div>
              </div>
            </div>
          )}

          {/* Body */}
          <div style={{ padding: '20px 22px 0' }}>
            <p style={{ fontStyle: 'italic', fontSize: 18, color: 'var(--color-cream)', lineHeight: 1.65, marginTop: 0, marginBottom: 16 }}>
              {post.body}
            </p>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.85 }}>
              {locale === 'en'
                ? 'What struck me was the idea that the soil matters more than the label. "The same vineyard — the top five rows and the bottom five rows are different wines," she said.'
                : '이름값보다 토양값을 더 무겁게 본다는 안의 말이 인상적이었다. 같은 빈야드도 위쪽 다섯 줄과 아래쪽 다섯 줄은 다른 와인이 된다.'}
            </p>

            {/* Pull quote */}
            <div style={{ margin: '22px 0', padding: '0 0 0 18px', borderLeft: '2px solid var(--color-gold)' }}>
              <div style={{ fontStyle: 'italic', fontSize: 20, color: 'var(--color-gold)', lineHeight: 1.4 }}>
                {locale === 'en'
                  ? '"Wine is the farmer\'s time, not the winemaker\'s."'
                  : '"와인은 농부의 시간이지, 양조가의 시간이 아닙니다."'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 8, letterSpacing: '0.06em' }}>
                — Anne-Claude Leflaive
              </div>
            </div>

            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.85 }}>
              {locale === 'en'
                ? 'On the flight back I kept turning the phrase over. How different is the score we assign from the meaning the farmer saw in that year?'
                : '돌아오는 비행기에서 그 말을 계속 곱씹었다. 우리가 매기는 점수와, 농부가 본 그 해의 의미는 얼마나 다를까.'}
            </p>

            <WineEmbedCard wineId="bgy-puligny-montrachet" />
            <div style={{ marginTop: 14 }}>
              <ReactionBar reactions={post.reactions} comments={post.comments} mine="bookmark" locale={locale} />
            </div>
          </div>

          {/* Related */}
          <div style={{ padding: '20px 20px 30px' }}>
            <div style={{ fontSize: 10, color: 'var(--color-gold)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
              {locale === 'en' ? 'Related' : '관련 글'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[allPosts[5], allPosts[3]].filter(Boolean).map((rp) => (
                <CommFeedRow key={rp.id} post={rp} />
              ))}
            </div>
          </div>
          </div>
        </>
      )}

      {/* ─── QUESTION ─── */}
      {post.type === 'question' && (
        <>
          <BackHeader title="">
            <button style={{ width: 36, height: 36, borderRadius: 8, background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Share2 size={18} strokeWidth={1.75} />
            </button>
          </BackHeader>

          <div className="wm-scroll-area" style={{ paddingBottom: 90 }}>
          <article style={{ padding: '14px 20px 0' }}>
            <PostTypeBadge type="question" locale={locale} />
            {user && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <CommUserAvatar userId={post.userId} />
                <div>
                  <Link
                    href={`/profile/${post.userId}` as Route}
                    style={{ fontFamily: 'var(--font-playfair)', fontSize: 13, color: 'var(--color-cream)', textDecoration: 'none' }}
                  >
                    {user.name}
                  </Link>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>{post.ago}</div>
                </div>
              </div>
            )}
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 21, color: 'var(--color-cream)', lineHeight: 1.3, marginTop: 14 }}>
              {post.title}
            </div>
            <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.75, marginTop: 12 }}>
              {post.body}
            </div>
            {/* Tag chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
              {['#결혼식', '#예산_7-9만', '#화이트', '#미디엄레드', '#30명'].map((tag) => (
                <span key={tag} style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', color: 'var(--color-text-muted)', fontSize: 11 }}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <ReactionBar reactions={post.reactions} comments={post.comments} locale={locale} />
            </div>
          </article>

          {/* Top recommendations */}
          <div style={{ margin: '18px 16px 0', padding: 16, borderRadius: 14, background: 'var(--color-bg-surface)', border: '1px solid rgba(201,168,76,0.33)' }}>
            <div style={{ fontSize: 10, color: 'var(--color-gold)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
              {locale === 'en' ? 'Most recommended wines' : '가장 많이 추천된 와인'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {WINES.slice(2, 5).map((w, i) => (
                <div key={w.id} style={{ padding: '8px 10px', borderRadius: 10, background: 'var(--color-bg-deep)', border: '1px solid var(--color-border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 999, background: i === 0 ? 'var(--color-gold)' : 'var(--color-bg-surface)', border: `1px solid ${i === 0 ? 'var(--color-gold)' : 'var(--color-border-default)'}`, color: i === 0 ? 'var(--color-bg-deep)' : 'var(--color-text-secondary)', fontFamily: 'var(--font-playfair)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                  <div style={{ width: 18, height: 60, borderRadius: 3, background: w.bottleColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--color-cream)', fontFamily: 'var(--font-playfair)', lineHeight: 1.3 }}>{w.name}</div>
                    <div style={{ fontSize: 9, color: 'var(--color-text-muted)', marginTop: 2 }}>{[8, 6, 4][i]}{locale === 'en' ? ' recommended' : '명 추천'} · ₩{(w.averagePriceKrw / 1000).toFixed(0)}K</div>
                  </div>
                  <ChevronRight size={12} strokeWidth={1.75} color="var(--color-text-muted)" />
                </div>
              ))}
            </div>
          </div>

          {/* Comments / answers */}
          <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, color: 'var(--color-cream)' }}>
              {locale === 'en' ? 'Answers' : '답변'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{post.comments}</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: 'var(--color-gold)', fontWeight: 600 }}>
              {locale === 'en' ? 'Most helpful' : '도움 순'} ↓
            </span>
          </div>
          <div style={{ padding: '6px 20px 30px' }}>
            <CommentRow userId="sommelier" ago="20분 전" text={locale === 'en' ? "If you share the menu first that'd help, but for a typical wedding course: white — Sancerre or Pouilly-Fumé; red — young Burgundy or Chianti Classico." : "식사 메뉴를 먼저 알려주시면 더 좋겠지만, 일반적인 결혼식 코스라면 화이트는 상세르나 푸이-퓌메, 레드는 영 부르고뉴나 키안티 클라시코 추천드려요."} reactions={28} expert locale={locale} />
            <CommentRow userId="duckhu" ago="35분 전" text={locale === 'en' ? "Don't skip Crémant de Bourgogne. Perfect to open with." : "크레망 부르고뉴를 빼지 마세요. 한 잔으로 시작하기에 너무 좋아요."} reactions={14} locale={locale} />
            <CommentRow userId="mineral" ago="42분 전" text={locale === 'en' ? "Picard Bourgogne Aligoté is fantastic value." : "피카르의 부르고뉴 알리고떼 정말 좋습니다. 가격 대비 만족도 최고예요."} reactions={9} locale={locale} />
          </div>
          </div>
        </>
      )}

      {/* ─── ALBUM ─── */}
      {post.type === 'album' && (
        <>
          <BackHeader title="">
            <button style={{ width: 36, height: 36, borderRadius: 8, background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Share2 size={18} strokeWidth={1.75} />
            </button>
          </BackHeader>

          <div className="wm-scroll-area" style={{ paddingBottom: 90 }}>
          <article style={{ padding: '14px 20px 0' }}>
            <div style={{ marginBottom: 12 }}>
              <PostTypeBadge type="album" locale={locale} />
            </div>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <CommUserAvatar userId={post.userId} />
                <div>
                  <Link href={`/profile/${post.userId}` as Route} style={{ fontSize: 13, color: 'var(--color-cream)', fontFamily: 'var(--font-playfair)', textDecoration: 'none' }}>{user.name}</Link>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>{post.ago}</div>
                </div>
              </div>
            )}
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, color: 'var(--color-cream)', lineHeight: 1.25, marginTop: 0 }}>{post.title}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginTop: 8 }}>{post.body}</div>
          </article>

          {/* Photo grid */}
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{ aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', background: 'linear-gradient(135deg, #5a1a28, var(--color-bg-surface))', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 358 268" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="bottlesPat" patternUnits="userSpaceOnUse" width="60" height="200">
                    <rect width="60" height="200" fill="#1a0a1e" />
                    <rect x="22" y="20" width="16" height="160" fill="#5a1a28" opacity="0.6" rx="6" />
                    <rect x="22" y="20" width="16" height="40" fill="#0a0612" rx="2" />
                  </pattern>
                </defs>
                <rect width="358" height="268" fill="url(#bottlesPat)" />
              </svg>
              <div style={{ position: 'absolute', bottom: 12, right: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(5,2,10,0.7)', border: '1px solid var(--color-border-default)', color: 'var(--color-cream)', fontSize: 11, fontWeight: 600 }}>
                1 / {post.photoCount ?? 7}
              </div>
            </div>
            <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[2, 3, 4, 5].map((i) => (
                <div key={i} style={{ aspectRatio: '1/1', borderRadius: 8, background: ['#1a0a1e', '#2a141c', '#3a1a26', '#1a0a1e'][i - 2], border: '1px solid var(--color-border-default)', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 12, background: WINES[i - 2]?.bottleColor ?? '#6b1a2a', borderRadius: 4 }} />
                  {i === 5 && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,2,10,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-cream)', fontSize: 12, fontFamily: 'var(--font-playfair)', borderRadius: 8 }}>
                      +3
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '14px 20px 0' }}>
            <ReactionBar reactions={post.reactions} comments={post.comments} locale={locale} />
          </div>
          <div style={{ padding: '18px 20px 6px' }}>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 15, color: 'var(--color-cream)' }}>
              {locale === 'en' ? `Comments ${post.comments}` : `댓글 ${post.comments}`}
            </span>
          </div>
          <div style={{ padding: '0 20px 30px' }}>
            <CommentRow userId="suyeon" ago="2시간 전" text={locale === 'en' ? "Labels perfectly aligned. Jealous." : "라벨 정렬이 너무 깔끔하네요. 부럽다..."} reactions={6} locale={locale} />
            <CommentRow userId="jiwon" ago="3시간 전" text={locale === 'en' ? "What's going in that empty slot?" : "저 빈자리에 뭐 들어갈 예정인지 궁금"} reactions={3} locale={locale} />
          </div>
          </div>
        </>
      )}

      {/* ─── NEWS ─── */}
      {post.type === 'news' && (
        <>
          <BackHeader title="">
            <button style={{ width: 36, height: 36, borderRadius: 8, background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Share2 size={18} strokeWidth={1.75} />
            </button>
          </BackHeader>
          <div className="wm-scroll-area" style={{ paddingBottom: 90 }}>
          <article style={{ padding: '14px 20px 0' }}>
            <PostTypeBadge type="news" locale={locale} />
            {user && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <CommUserAvatar userId={post.userId} />
                <div>
                  <Link href={`/profile/${post.userId}` as Route} style={{ fontFamily: 'var(--font-playfair)', fontSize: 13, color: 'var(--color-cream)', textDecoration: 'none' }}>{user.name}</Link>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>{post.ago}</div>
                </div>
              </div>
            )}
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 21, color: 'var(--color-cream)', lineHeight: 1.3, marginTop: 14 }}>
              {post.title}
            </div>
            <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.75, marginTop: 12 }}>
              {post.body}
            </div>
            <div style={{ marginTop: 14 }}>
              <ReactionBar reactions={post.reactions} comments={post.comments} locale={locale} />
            </div>
          </article>
          <div style={{ padding: '20px 20px 30px' }}>
            <CommentRow userId="jiwon" ago="4시간 전" text={locale === 'en' ? "Already booked. The allocation goes fast." : "예약 했어요. 물량 빨리 없어지더라고요."} reactions={6} locale={locale} />
            <CommentRow userId="suyeon" ago="5시간 전" text={locale === 'en' ? "Is Ramonet included?" : "라몽네 있나요?"} reactions={3} locale={locale} />
          </div>
          </div>
        </>
      )}

      {/* Compose footer (common — column variant은 footer 없음) */}
      {post.type !== 'column' && (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '10px 16px 20px',
          background: 'linear-gradient(to top, var(--color-bg-deep) 70%, rgba(10,5,15,0))',
          borderTop: '0.5px solid var(--color-border-default)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 20,
        }}
      >
        <CommUserAvatar userId="suyeon" size={32} />
        <div
          style={{
            flex: 1,
            height: 38,
            borderRadius: 999,
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          {t('addComment')}
        </div>
        <button
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            background: 'var(--color-wine-red)',
            border: 'none',
            color: 'var(--color-cream)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>
      )}
    </>
  );
}
