'use client';

import { ChevronLeft, Image, Wine, MapPin, List, BookOpen, ChevronDown, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { useLocale } from '@/context/locale-context';
import { WineEmbedCard } from '@/components/community/wine-embed-card';

export default function NewColumnPage() {
  const { locale } = useLocale();
  const router = useRouter();

  useRegisterFeatures('/community/new/column', [
    { id: 'column.cover', labelKo: '커버 슬롯', labelEn: 'Cover slot', defaultStatus: 'planned' },
    { id: 'column.editor', labelKo: '본문 에디터', labelEn: 'Body editor', defaultStatus: 'planned' },
    { id: 'column.toolbar', labelKo: '포맷 툴바', labelEn: 'Format toolbar', defaultStatus: 'planned' },
  ]);

  const toolbarItems = [
    { Icon: Image,    koLabel: '사진', enLabel: 'Photo' },
    { Icon: Wine,     koLabel: '와인', enLabel: 'Wine' },
    { Icon: MapPin,   koLabel: '장소', enLabel: 'Place' },
    { Icon: List,     koLabel: '인용', enLabel: 'Quote' },
    { Icon: BookOpen, koLabel: '소제목', enLabel: 'Heading' },
  ];

  return (
    <div style={{ position: 'relative', paddingBottom: 70 }}>
      {/* Header */}
      <div
        style={{
          padding: '8px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '0.5px solid var(--color-border-default)',
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
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>
        <div
          style={{
            flex: 1,
            fontFamily: 'var(--font-playfair)',
            fontSize: 15,
            color: 'var(--color-cream)',
            textAlign: 'center',
          }}
        >
          {locale === 'en' ? 'Write Column' : '긴 글 작성'}
        </div>
        <button
          style={{
            padding: '7px 14px',
            borderRadius: 999,
            background: 'var(--color-wine-red)',
            border: 'none',
            color: 'var(--color-cream)',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'var(--font-inter)',
            cursor: 'pointer',
          }}
        >
          {locale === 'en' ? 'Publish' : '게시'}
        </button>
      </div>

      {/* Cover image slot */}
      <div
        style={{
          margin: '14px 16px 0',
          height: 140,
          borderRadius: 14,
          background: 'var(--color-bg-surface)',
          border: '1.5px dashed var(--color-border-default)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Image size={20} strokeWidth={1.5} color="var(--color-text-muted)" />
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          {locale === 'en' ? 'Add cover image (optional)' : '커버 이미지 추가 (선택)'}
        </div>
      </div>

      {/* Title field */}
      <div style={{ padding: '20px 22px 0' }}>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 24,
            color: 'var(--color-cream)',
            lineHeight: 1.25,
          }}
        >
          {locale === 'en'
            ? 'Domaine Leflaive Visit — First Harvest of September'
            : '부르고뉴 도멘 르플레브 방문기 — 9월의 첫 수확'}
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 24,
              background: 'var(--color-gold)',
              marginLeft: 2,
              verticalAlign: 'text-bottom',
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>
          {locale === 'en' ? 'Title · 24 / 80' : '제목 · 24 / 80'}
        </div>
      </div>

      {/* Body editor */}
      <div style={{ padding: '20px 22px 0' }}>
        <div
          style={{
            fontSize: 16,
            color: 'var(--color-cream)',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}
        >
          {locale === 'en'
            ? 'Taking a plane to Dijon, then another two hours by car to reach Puligny-Montrachet. The vineyard that the granddaughter of Anne-Claude showed us was smaller,'
            : '비행기를 타고 디종, 다시 두 시간을 달려 도착한 퓔리니-몽라셰. 안 클로드의 손녀가 직접 안내해준 빈야드는 생각보다 작았고,'}
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'var(--color-text-muted)',
            marginTop: 14,
            fontStyle: 'italic',
          }}
        >
          {locale === 'en' ? 'Continue here...' : '여기에 이어 쓰세요...'}
        </div>
      </div>

      {/* Inline wine attach card */}
      <div style={{ margin: '20px 16px 0', padding: 14, borderRadius: 12, background: 'var(--color-bg-surface)', border: '1px solid rgba(201,168,76,0.33)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Wine size={20} strokeWidth={1.75} color="var(--color-gold)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--color-cream)', fontWeight: 600 }}>
            {locale === 'en' ? '1 wine attached' : '와인 1개 첨부됨'}
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
            {locale === 'en' ? 'Les Pucelles 2018 · Tap to go to wine detail' : '레 퓌셀 2018 · 탭하면 와인 상세로 이동'}
          </div>
        </div>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={14} strokeWidth={1.75} />
        </button>
      </div>

      {/* Bottom format toolbar */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '10px 12px 30px',
          background: 'var(--color-bg-deep)',
          borderTop: '0.5px solid var(--color-border-default)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          zIndex: 20,
        }}
      >
        {toolbarItems.map(({ Icon, koLabel, enLabel }) => (
          <button
            key={koLabel}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              color: 'var(--color-text-secondary)',
              fontSize: 10,
              fontFamily: 'var(--font-inter)',
              cursor: 'pointer',
            }}
          >
            <Icon size={16} strokeWidth={1.75} />
            {locale === 'en' ? enLabel : koLabel}
          </button>
        ))}
        <div style={{ width: 1, height: 28, background: 'var(--color-border-default)', margin: '0 4px' }} />
        <button style={{ width: 36, height: 36, borderRadius: 8, background: 'transparent', border: 'none', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronDown size={16} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
