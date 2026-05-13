'use client';

import { Moon, Wine } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { CommUserAvatar } from '@/components/community/comm-user-avatar';
import { WINES } from '@/lib/mock/wines';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { useLocale } from '@/context/locale-context';
import { useTranslations } from 'next-intl';

const TONIGHT_ENTRIES = [
  { userId: 'jiwon',    wineId: 'bgy-pommard',           place: '청담', placeDetail: '집',          hour: '21:42', vibe: '두 시간 디캔팅 중' },
  { userId: 'mineral',  wineId: 'bgy-puligny-montrachet', place: '한남', placeDetail: '와인바 ZIN',  hour: '21:30', vibe: '단독 시음' },
  { userId: 'duckhu',   wineId: 'cha-krug-grande-cuvee',  place: '판교', placeDetail: '집',          hour: '21:15', vibe: '기념일' },
  { userId: 'haerin',   wineId: 'loi-sancerre',            place: '강남', placeDetail: '리바이스 식당', hour: '20:55', vibe: '식사와 함께' },
  { userId: 'minho',    wineId: 'bdx-pichon-baron',        place: '성수', placeDetail: '집',          hour: '20:40', vibe: '셀러 정리 후' },
] as const;

const MAP_DOTS = [
  { x: 240, y: 90,  label: '청담', n: 4 },
  { x: 178, y: 95,  label: '한남', n: 3 },
  { x: 200, y: 175, label: '판교', n: 3 },
  { x: 280, y: 75,  label: '성수', n: 2 },
  { x: 175, y: 140, label: '강남', n: 2 },
] as const;

export default function TonightPage() {
  const t = useTranslations('community');
  const { locale } = useLocale();

  useRegisterFeatures('/community/tonight', [
    { id: 'tonight.hero', labelKo: '히어로', labelEn: 'Hero', defaultStatus: 'planned' },
    { id: 'tonight.map', labelKo: '서울 도트맵', labelEn: 'Seoul dot map', defaultStatus: 'planned' },
    { id: 'tonight.participateCta', labelKo: '참여 CTA', labelEn: 'Participate CTA', defaultStatus: 'planned' },
    { id: 'tonight.entries', labelKo: '이 순간의 잔들', labelEn: 'Tonight glasses', defaultStatus: 'planned' },
  ]);

  return (
    <div style={{ paddingBottom: 40 }}>
      <BackHeader title={{ ko: '', en: '' }} />

      {/* Hero */}
      <div style={{ padding: '12px 22px 0' }}>
        <div
          style={{
            fontSize: 10,
            color: 'var(--color-gold)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          {locale === 'en' ? 'Tonight · As of 21:47' : '오늘 밤 · 21:47 기준'}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 26,
            color: 'var(--color-cream)',
            marginTop: 6,
            lineHeight: 1.15,
            fontStyle: 'italic',
          }}
        >
          <span style={{ color: 'var(--color-gold)' }}>14</span>
          {locale === 'en' ? (
            <>{' '}people<br />are raising a glass</>
          ) : (
            <>명이<br />한 잔을 들고 있어요</>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>
          {t('tonight.places')}
        </div>
      </div>

      {/* Seoul dot map */}
      <div
        style={{
          margin: '16px 16px 0',
          height: 220,
          borderRadius: 16,
          overflow: 'hidden',
          background: '#2A1A30',
          border: '1px solid var(--color-border-default)',
          position: 'relative',
        }}
      >
        <svg width="100%" height="220" viewBox="0 0 358 220" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="seoulBg">
              <stop offset="0%" stopColor="#2a141c" />
              <stop offset="100%" stopColor="#0a050f" />
            </radialGradient>
            <pattern id="grid2" patternUnits="userSpaceOnUse" width="30" height="30">
              <path d="M 30 0 L 0 0 0 30" stroke="rgba(245,240,232,0.05)" strokeWidth="0.4" fill="none" />
            </pattern>
            <filter id="dotglow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>
          <rect width="358" height="220" fill="url(#seoulBg)" />
          <rect width="358" height="220" fill="url(#grid2)" />
          {/* Han River */}
          <path
            d="M 0 130 Q 80 110 160 130 Q 240 145 358 120"
            stroke="#2D1540"
            strokeWidth="14"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 0 130 Q 80 110 160 130 Q 240 145 358 120"
            stroke="rgba(91,156,230,0.15)"
            strokeWidth="10"
            fill="none"
          />
          <text x="280" y="118" fontFamily="Inter" fontSize="7" fill="#9B8B7A" fontStyle="italic">
            {locale === 'en' ? 'Han River' : '한강'}
          </text>
          {/* Dots */}
          {MAP_DOTS.map((d) => (
            <g key={d.label}>
              <circle cx={d.x} cy={d.y} r={d.n * 2 + 4} fill="#C9A84C" opacity="0.18" filter="url(#dotglow)" />
              <circle cx={d.x} cy={d.y} r={Math.min(8, 3 + d.n)} fill="#C9A84C" />
              <text
                x={d.x}
                y={d.y + 1}
                textAnchor="middle"
                fontFamily="Playfair Display"
                fontSize="9"
                fill="#05020A"
                fontWeight="700"
              >
                {d.n}
              </text>
              <text
                x={d.x}
                y={d.y + d.n * 2 + 16}
                textAnchor="middle"
                fontFamily="Inter"
                fontSize="8"
                fill="#F5F0E8"
              >
                {d.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Participate CTA */}
      <div
        style={{
          margin: '14px 16px 0',
          padding: '12px 14px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(139,26,42,0.4), var(--color-bg-surface))',
          border: '1px solid rgba(201,168,76,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Moon size={18} strokeWidth={1.75} color="var(--color-gold)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--color-cream)', fontWeight: 600 }}>
            {t('tonight.participateCta')}
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
            {locale === 'en' ? 'Your wine · just your neighborhood' : '지금 마시는 와인 · 위치만 살짝'}
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
          {locale === 'en' ? 'Join' : '참여'}
        </button>
      </div>

      {/* Tonight entries */}
      <div style={{ padding: '18px 20px 6px' }}>
        <div
          style={{
            fontSize: 10,
            color: 'var(--color-gold)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {t('tonight.sectionTitle')}
        </div>
      </div>
      <div
        style={{
          padding: '0 16px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {TONIGHT_ENTRIES.map((e) => {
          const wine = WINES.find((w) => w.id === e.wineId);
          const wineName = wine
            ? locale === 'en'
              ? wine.name
              : wine.name
            : '';

          return (
            <div
              key={e.userId}
              style={{
                padding: '10px 12px',
                borderRadius: 12,
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <CommUserAvatar userId={e.userId} size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-cream)', fontWeight: 600 }}>
                    {e.userId}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                    · {e.place} · {e.hour}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: 'var(--color-text-secondary)',
                    marginTop: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Wine size={10} strokeWidth={1.75} color="var(--color-gold)" />
                  {wineName.split(' ').slice(0, 3).join(' ')}
                </div>
                <div
                  style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2, fontStyle: 'italic' }}
                >
                  {e.vibe}
                </div>
              </div>
              <button
                style={{
                  padding: '5px 10px',
                  borderRadius: 999,
                  background: 'transparent',
                  border: '1px solid rgba(201,168,76,0.33)',
                  color: 'var(--color-gold)',
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                {locale === 'en' ? 'Toast' : '잔 들기'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
