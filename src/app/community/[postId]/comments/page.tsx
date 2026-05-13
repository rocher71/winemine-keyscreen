'use client';

import { use } from 'react';
import { ChevronRight } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { CommUserAvatar } from '@/components/community/comm-user-avatar';
import { CommentRow } from '@/components/community/comment-row';
import { getCommunityPost, getCommunityUser } from '@/lib/mock/community-posts';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { useLocale } from '@/context/locale-context';
import { useTranslations } from 'next-intl';

export default function CommentsPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = use(params);
  const post = getCommunityPost(postId);
  const t = useTranslations('community');
  const { locale } = useLocale();

  useRegisterFeatures(`/community/${postId}/comments`, [
    { id: 'comments.list', labelKo: '댓글 리스트', labelEn: 'Comment list', defaultStatus: 'planned' },
    { id: 'comments.compose', labelKo: '댓글 입력창', labelEn: 'Compose bar', defaultStatus: 'planned' },
  ]);

  const user = post ? getCommunityUser(post.userId) : null;

  return (
    <div style={{ position: 'relative', paddingBottom: 100 }}>
      <BackHeader
        title={{
          ko: `댓글 ${post?.comments ?? 0}`,
          en: `${post?.comments ?? 0} Comments`,
        }}
      />

      {/* Compact post header */}
      {post && user && (
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '0.5px solid var(--color-border-default)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CommUserAvatar userId={post.userId} size={24} />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              {user.name} · {post.ago}
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 13,
              color: 'var(--color-cream)',
              marginTop: 6,
              lineHeight: 1.3,
            }}
          >
            {post.title}
          </div>
        </div>
      )}

      {/* Sort */}
      <div
        style={{
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          borderBottom: '0.5px solid var(--color-border-default)',
        }}
      >
        <button
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: 11,
            color: 'var(--color-gold)',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-inter)',
          }}
        >
          {locale === 'en' ? 'Most helpful' : '도움 순'}
        </button>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-inter)',
          }}
        >
          {locale === 'en' ? 'Most recent' : '최신 순'}
        </button>
        <span style={{ flex: 1 }} />
        <button
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-inter)',
          }}
        >
          {locale === 'en' ? 'Experts only' : '전문가만'}
        </button>
      </div>

      {/* All comments */}
      <div style={{ padding: '0 20px 30px' }}>
        <CommentRow userId="sommelier" ago="20분 전" text={locale === 'en' ? "If you share the menu first that'd help, but for a typical wedding course: white — Sancerre or Pouilly-Fumé; red — young Burgundy or Chianti Classico." : "식사 메뉴를 먼저 알려주시면 더 좋겠지만, 일반적인 결혼식 코스라면 화이트는 상세르나 푸이-퓌메, 레드는 영 부르고뉴(예: 자크 까샤르 부르고뉴 루즈)나 토스카나 산조베제(키안티 클라시코) 추천드려요."} reactions={28} expert locale={locale} />
        <CommentRow userId="jiwon" ago="22분 전" text={locale === 'en' ? "I agree. Chianti Classico is almost universally good." : "저도 동의합니다. 키안티 클라시코는 거의 만능이에요."} reactions={11} isReply locale={locale} />
        <CommentRow userId="haerin" ago="25분 전" text={locale === 'en' ? "Thank you! The menu is Korean course." : "감사합니다! 식사는 한식 코스예요."} reactions={2} isReply locale={locale} />
        <CommentRow userId="duckhu" ago="35분 전" text={locale === 'en' ? "Don't skip Crémant de Bourgogne. Perfect to open with." : "크레망 부르고뉴를 빼지 마세요. 한 잔으로 시작하기에 너무 좋아요."} reactions={14} locale={locale} />
        <CommentRow userId="mineral" ago="42분 전" text={locale === 'en' ? "Picard Bourgogne Aligoté is fantastic value." : "피카르의 부르고뉴 알리고떼 정말 좋습니다. 가격 대비 만족도 최고예요."} reactions={9} locale={locale} />
        <CommentRow userId="minho" ago="48분 전" text={locale === 'en' ? "Alsace Riesling goes well with Korean food too." : "알자스 리슬링도 한식과 좋아요. 단맛이 살짝 도는 게 잘 어울려요."} reactions={6} locale={locale} />
        <CommentRow userId="suyeon" ago="1시간 전" text={locale === 'en' ? "Congratulations on the wedding!" : "결혼식 정말 축하드려요"} reactions={3} locale={locale} />
      </div>

      {/* Compose footer */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '10px 16px 30px',
          background: 'var(--color-bg-deep)',
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
          {locale === 'en' ? 'Leave a reply...' : '답글 남기기...'}
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
    </div>
  );
}
