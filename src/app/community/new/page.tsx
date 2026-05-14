'use client';

import Link from 'next/link';
import { PenLine, HelpCircle, BookOpen, Sparkles, Image, X, Moon, ChevronRight } from 'lucide-react';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { useLocale } from '@/context/locale-context';
import { useTranslations } from 'next-intl';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';

const POST_TYPES = [
  {
    type: 'note' as const,
    koLabel: '시음 노트 공유',
    enLabel: 'Share Tasting Note',
    koSub: '내 노트를 골라 공개해요',
    enSub: 'Pick a note from your collection',
    Icon: PenLine,
    color: '#C9A84C',
    badge: '+15 XP',
    href: '/community/new' as Route,
  },
  {
    type: 'question' as const,
    koLabel: '질문 · 추천 요청',
    enLabel: 'Question / Recommendation',
    koSub: '"··· 궁금해요" 또는 "··· 추천해주세요"',
    enSub: '"I wonder about..." or "Please recommend..."',
    Icon: HelpCircle,
    color: '#a08ee0',
    badge: undefined,
    href: '/community/new' as Route,
  },
  {
    type: 'column' as const,
    koLabel: '긴 글 · 칼럼',
    enLabel: 'Long-form Column',
    koSub: '와이너리 방문기, 빈티지 분석',
    enSub: 'Winery visits, vintage analysis',
    Icon: BookOpen,
    color: '#F5F0E8',
    badge: '+25 XP',
    href: '/community/new/column' as Route,
  },
  {
    type: 'news' as const,
    koLabel: '업계 소식',
    enLabel: 'Industry News',
    koSub: '출시·이벤트·시음회 알림',
    enSub: 'Releases, events, tastings',
    Icon: Sparkles,
    color: '#5b9ce6',
    badge: undefined,
    href: '/community/new' as Route,
  },
  {
    type: 'album' as const,
    koLabel: '사진 앨범',
    enLabel: 'Photo Album',
    koSub: '여러 장 + 캡션',
    enSub: 'Multiple photos + captions',
    Icon: Image,
    color: '#e8b4d2',
    badge: undefined,
    href: '/community/new/album' as Route,
  },
];

export default function NewPostPage() {
  const t = useTranslations('community');
  const { locale } = useLocale();
  const router = useRouter();

  useRegisterFeatures('/community/new', [
    { id: 'compose.typePicker', labelKo: '타입 선택', labelEn: 'Type picker', defaultStatus: 'planned' },
    { id: 'compose.tonightCta', labelKo: '오늘 밤 CTA', labelEn: 'Tonight CTA', defaultStatus: 'planned' },
  ]);

  return (
    <>
      {/* Header */}
      <div
        style={{
          padding: '8px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '0.5px solid var(--color-border-default)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.back()}
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
          <X size={18} strokeWidth={1.75} />
        </button>
        <div
          style={{
            flex: 1,
            fontFamily: 'var(--font-playfair)',
            fontSize: 16,
            color: 'var(--color-cream)',
            textAlign: 'center',
          }}
        >
          {t('newPost')}
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div className="wm-scroll-area" style={{ paddingBottom: 40 }}>
      <div style={{ padding: '24px 20px 0' }}>
        <div
          style={{
            fontSize: 10,
            color: 'var(--color-gold)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {t('compose.todayIs')}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 24,
            color: 'var(--color-cream)',
            lineHeight: 1.2,
            marginTop: 6,
          }}
        >
          {locale === 'en' ? (
            <>
              What story do you<br />want to share?
            </>
          ) : (
            <>
              어떤 이야기를<br />나누고 싶으세요?
            </>
          )}
        </div>
      </div>

      <div
        style={{
          padding: '24px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {POST_TYPES.map((opt) => {
          const { Icon } = opt;
          const label = locale === 'en' ? opt.enLabel : opt.koLabel;
          const sub = locale === 'en' ? opt.enSub : opt.koSub;

          return (
            <Link key={opt.type} href={opt.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: 14,
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${opt.color}1a`,
                    border: `1px solid ${opt.color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} strokeWidth={1.75} color={opt.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: 15,
                        color: 'var(--color-cream)',
                      }}
                    >
                      {label}
                    </span>
                    {opt.badge && (
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: 999,
                          background: 'rgba(201,168,76,0.13)',
                          color: 'var(--color-gold)',
                          fontSize: 9,
                          fontWeight: 600,
                        }}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--color-text-muted)',
                      marginTop: 3,
                    }}
                  >
                    {sub}
                  </div>
                </div>
                <ChevronRight size={16} strokeWidth={1.75} color="var(--color-text-muted)" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Tonight CTA */}
      <Link href={'/community/tonight' as Route} style={{ textDecoration: 'none' }}>
        <div
          style={{
            margin: '24px 16px 0',
            padding: '14px 16px',
            borderRadius: 12,
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Moon size={20} strokeWidth={1.75} color="var(--color-gold)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-cream)', fontWeight: 600 }}>
              {locale === 'en' ? "I'm drinking now" : '지금 마시고 있어요'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
              {locale === 'en' ? 'Put a dot on tonight\'s map' : '오늘 밤 지도에 점 하나 찍기'}
            </div>
          </div>
          <ChevronRight size={16} strokeWidth={1.75} color="var(--color-gold)" />
        </div>
      </Link>
      </div>
    </>
  );
}
