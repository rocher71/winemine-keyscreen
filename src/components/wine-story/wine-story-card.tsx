'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { LocaleText, useLocalizedText } from '@/components/shared/locale-text';
import type { WineStory } from '@/types';

type Props = {
  wineId: string;
  story: WineStory | null | undefined;
};

/**
 * 와이너리 스토리 카드 — 와인 상세 페이지 inline.
 * - 240px 카드, Surface 배경
 * - 와이너리 이름 + foundedYear + 위치
 * - 본문 발췌 2~3문장
 * - Lightbulb hover/tap 시 funFact 미리보기
 * - 우하단 "더 읽기" → /wine/[id]/story
 *
 * story가 null/undefined인 경우: 빈 상태 — "Coming soon".
 */
export function WineStoryCard({ wineId, story }: Props) {
  const [showFunFact, setShowFunFact] = useState(false);
  const funFactLabel = useLocalizedText({ ko: '재미있는 이야기', en: 'Fun fact' });

  if (!story) {
    return (
      <section
        style={{
          margin: '0 16px',
          padding: 16,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 16,
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        <LocaleText
          value={{
            ko: '이 와인의 스토리는 준비 중',
            en: 'Story coming soon',
          }}
        />
      </section>
    );
  }

  // 본문 발췌 — 첫 문단의 앞 2~3문장.
  const excerpt = (text: string): string => {
    const firstPara = text.split('\n\n')[0];
    // 문장 분리: . / 다.\n / 다. 처리. 영어/한국어 모두.
    const sentences = firstPara
      .replace(/\n/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .slice(0, 2);
    return sentences.join(' ');
  };

  return (
    <section
      style={{
        position: 'relative',
        margin: '0 16px',
        padding: 16,
        minHeight: 220,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 라벨 + funFact 트리거 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontWeight: 500,
            fontSize: 12,
            color: 'var(--color-gold)',
            letterSpacing: '0.04em',
          }}
        >
          <LocaleText value={{ ko: '와이너리 이야기', en: 'Winery story' }} />
        </span>
        <button
          type="button"
          aria-label={funFactLabel}
          onMouseEnter={() => setShowFunFact(true)}
          onMouseLeave={() => setShowFunFact(false)}
          onClick={() => setShowFunFact((p) => !p)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: 4,
            background: 'transparent',
            border: '1px solid var(--color-gold)',
            borderRadius: 999,
            color: 'var(--color-gold)',
            cursor: 'pointer',
          }}
        >
          <Lightbulb size={14} strokeWidth={1.75} />
        </button>
      </div>

      {/* funFact popover */}
      {showFunFact && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            top: 48,
            right: 12,
            maxWidth: 260,
            padding: 12,
            background: 'var(--color-bg-map)',
            border: '1px solid var(--color-gold)',
            borderRadius: 12,
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            lineHeight: 1.5,
            zIndex: 20,
            boxShadow: '0 8px 22px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: 'var(--color-gold)',
              fontSize: 11,
              marginBottom: 4,
            }}
          >
            <LocaleText value={{ ko: '재미있는 이야기', en: 'Fun fact' }} />
          </div>
          <LocaleText value={story.funFact} as="div" />
        </div>
      )}

      {/* 제목 */}
      <h2
        style={{
          margin: '12px 0 4px',
          fontFamily: 'var(--font-playfair)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--color-cream)',
          lineHeight: 1.2,
        }}
      >
        <LocaleText value={story.wineryName} as="span" /> · {story.foundedYear}
      </h2>

      {/* 위치 */}
      <LocaleText
        value={story.location}
        as="div"
        className="wm-story-loc"
      />

      {/* 발췌 본문 */}
      <p
        style={{
          margin: '12px 0 0',
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
          lineHeight: 1.55,
          color: 'var(--color-text-secondary)',
          flex: 1,
        }}
      >
        {(() => {
          const text = story.history.ko; // fallback before client hydration
          // 둘 다 LocaleText로 처리해야 하지만 excerpt 가공이 필요해 직접 호출
          // 두 locale을 모두 미리 발췌
          return null;
        })()}
        <StoryExcerpt story={story} />
      </p>

      {/* 더 읽기 */}
      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <Link
          href={`/wine/${wineId}/story` as Route}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 10px',
            color: 'var(--color-gold)',
            fontFamily: 'var(--font-inter)',
            fontSize: 12,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <LocaleText value={{ ko: '더 읽기', en: 'Read more' }} />
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}

/**
 * 본문 발췌 — locale에 맞게 첫 2문장만.
 */
function StoryExcerpt({ story }: { story: WineStory }) {
  const text = useLocalizedText(story.history);
  const firstPara = text.split('\n\n')[0];
  const sentences = firstPara
    .replace(/\n/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 2);
  return <>{sentences.join(' ')}</>;
}
