import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { BottomNav } from '@/components/nav/bottom-nav';
import { LocaleText } from '@/components/shared/locale-text';
import { StoryImage } from '@/components/wine-story/story-image';
import { StoryHistoryBody } from './story-history-body';
import { getWine } from '@/lib/mock/wines';
import { getWineStory } from '@/lib/mock/wine-stories';

type Params = Promise<{ id: string }>;

/**
 * /wine/[id]/story — 와이너리 스토리
 *
 * - Hero (StoryImage placeholder + 와이너리 이름 + 설립 + 위치)
 * - History 본문 (LocalizedString, 3~4문단) + GlossaryTooltip 인라인 (i) 최소 5곳
 * - FunFact 카드 (Gold 보더 + Lightbulb 아이콘)
 * - Philosophy 단락 (있을 때만)
 * - 메타 그리드 2×2 (설립년/포도밭 면적/주요 품종/연 생산량)
 * - Bottom CTA "이 와인 다시 보기" → /wine/[id]
 *
 * story 없으면 빈 상태 페이지.
 */
export default async function WineStoryPage({ params }: { params: Params }) {
  const { id } = await params;
  const wine = getWine(id);
  if (!wine) notFound();

  const story = getWineStory(wine.id);

  if (!story) {
    return (
      <>
        <BackHeader title={{ ko: '와이너리 이야기', en: 'Winery story' }} />
        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            padding: '0 16px',
          }}
        >
          <LocaleText
            value={{
              ko: '이 와인의 스토리는 준비 중',
              en: 'Story coming soon',
            }}
          />
        </main>
        <BottomNav />
      </>
    );
  }

  const grapeSummary = wine.grapes
    .slice(0, 2)
    .map((g) => g.ko)
    .join(', ');
  const grapeSummaryEn = wine.grapes
    .slice(0, 2)
    .map((g) => g.en)
    .join(', ');

  return (
    <>
      <BackHeader title={{ ko: '와이너리 이야기', en: 'Winery story' }} />

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Hero */}
        <section style={{ padding: '0 16px' }}>
          <StoryImage bottleColor={wine.bottleColor} height={220} />
          <div style={{ marginTop: 14 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--font-playfair)',
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--color-cream)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              <LocaleText value={story.wineryName} />
            </h1>
            <p
              style={{
                margin: '6px 0 0',
                fontFamily: 'var(--font-inter)',
                fontSize: 13,
                color: 'var(--color-text-secondary)',
              }}
            >
              <LocaleText
                value={{
                  ko: `설립 ${story.foundedYear} · `,
                  en: `Founded ${story.foundedYear} · `,
                }}
              />
              <LocaleText value={story.location} />
            </p>
          </div>
        </section>

        {/* History 본문 + GlossaryTooltip 인라인 (i) */}
        <section style={{ padding: '0 16px' }}>
          <h2
            style={{
              margin: '0 0 12px',
              fontFamily: 'var(--font-inter)',
              fontWeight: 600,
              fontSize: 14,
              color: 'var(--color-gold)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <LocaleText value={{ ko: '역사', en: 'History' }} />
          </h2>
          <StoryHistoryBody history={story.history} />
        </section>

        {/* FunFact 카드 — Gold 보더 + Lightbulb */}
        <section style={{ padding: '0 16px' }}>
          <div
            style={{
              padding: 16,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-gold)',
              borderRadius: 14,
              boxShadow: '0 0 0 1px rgba(139, 26, 42, 0.18)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <Lightbulb size={20} strokeWidth={1.75} color="var(--color-gold)" />
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 600,
                  fontSize: 13,
                  color: 'var(--color-gold)',
                  letterSpacing: '0.04em',
                }}
              >
                <LocaleText value={{ ko: '재미있는 이야기', en: 'Fun fact' }} />
              </span>
            </div>
            <LocaleText
              value={story.funFact}
              as="p"
              className="wm-story-funfact-body"
            />
          </div>
        </section>

        {/* Philosophy (있을 때만) */}
        {story.philosophy && (
          <section style={{ padding: '0 16px' }}>
            <h2
              style={{
                margin: '0 0 12px',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: 14,
                color: 'var(--color-gold)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <LocaleText value={{ ko: '양조 철학', en: 'Winemaking philosophy' }} />
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-inter)',
                fontSize: 14,
                lineHeight: 1.65,
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
              }}
            >
              <LocaleText value={story.philosophy} as="span" />
            </p>
          </section>
        )}

        {/* Meta grid 2×2 */}
        <section style={{ padding: '0 16px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            <MetaCell
              label={{ ko: '설립년도', en: 'Founded' }}
              value={String(story.foundedYear)}
            />
            <MetaCell
              label={{ ko: '포도밭 면적', en: 'Vineyard area' }}
              value={story.vineyardArea ?? '—'}
            />
            <MetaCell
              label={{ ko: '주요 품종', en: 'Main grapes' }}
              valueLocalized={{ ko: grapeSummary, en: grapeSummaryEn }}
            />
            <MetaCell
              label={{ ko: '평균 시판가', en: 'Avg price' }}
              value={`₩${wine.averagePriceKrw.toLocaleString()}`}
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ padding: '8px 16px 0' }}>
          <Link
            href={`/wine/${wine.id}` as Route}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              height: 48,
              borderRadius: 12,
              background: 'transparent',
              border: '1px solid var(--color-gold)',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-inter)',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <LocaleText value={{ ko: '이 와인 다시 보기', en: 'Back to wine' }} />
          </Link>
        </section>
      </main>

      <BottomNav />
    </>
  );
}

function MetaCell({
  label,
  value,
  valueLocalized,
}: {
  label: import('@/types').LocalizedString;
  value?: string;
  valueLocalized?: import('@/types').LocalizedString;
}) {
  return (
    <div
      style={{
        padding: 12,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 10,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 10,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        <LocaleText value={label} />
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: 'var(--font-playfair)',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--color-cream)',
        }}
      >
        {valueLocalized ? <LocaleText value={valueLocalized} /> : value}
      </div>
    </div>
  );
}
