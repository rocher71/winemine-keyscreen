'use client';

import { BackHeader } from '@/components/nav/back-header';
import { CommUserAvatar } from '@/components/community/comm-user-avatar';
import { getCommunityUser } from '@/lib/mock/community-posts';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { useLocale } from '@/context/locale-context';
import { useTranslations } from 'next-intl';

const DISCOVER_ROWS = [
  {
    userId: 'jiwon',
    pct: 84,
    subKo: '부르고뉴 · 보르도 중심',
    subEn: 'Burgundy & Bordeaux focused',
  },
  {
    userId: 'mineral',
    pct: 76,
    subKo: '미네랄 화이트 전문',
    subEn: 'Mineral white specialist',
  },
  {
    userId: 'sommelier',
    pct: 72,
    subKo: '함소믈리에 · 마스터',
    subEn: 'Sommelier Ham · Master',
  },
  {
    userId: 'duckhu',
    pct: 68,
    subKo: '샹파뉴 컬렉터',
    subEn: 'Champagne collector',
  },
  {
    userId: 'minho',
    pct: 58,
    subKo: '이탈리아 레드',
    subEn: 'Italian reds',
  },
];

export default function DiscoverPage() {
  const t = useTranslations('community');
  const { locale } = useLocale();

  useRegisterFeatures('/community/discover', [
    { id: 'discover.header', labelKo: '헤더', labelEn: 'Header', defaultStatus: 'planned' },
    { id: 'discover.userCards', labelKo: '유저 카드', labelEn: 'User cards', defaultStatus: 'planned' },
  ]);

  return (
    <div style={{ paddingBottom: 40 }}>
      <BackHeader title={{ ko: '팔로우 추천', en: 'Follow Suggestions' }} />

      <div style={{ padding: '14px 22px 0' }}>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 22,
            color: 'var(--color-cream)',
            lineHeight: 1.2,
          }}
        >
          {locale === 'en' ? (
            <>
              People close to<br />
              <span style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>your taste</span>
            </>
          ) : (
            <>
              {t('discover.title')}
              <br />
              <span style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>
                {t('discover.titleAccent')}
              </span>
            </>
          )}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--color-text-muted)',
            marginTop: 8,
          }}
        >
          {t('discover.sub')}
        </div>
      </div>

      <div
        style={{
          padding: '20px 16px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {DISCOVER_ROWS.map((row, i) => {
          const user = getCommunityUser(row.userId);
          if (!user) return null;

          const isFollowing = i === 0;
          const sub = locale === 'en' ? row.subEn : row.subKo;

          return (
            <div
              key={row.userId}
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <CommUserAvatar userId={row.userId} size={48} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: 14,
                      color: 'var(--color-cream)',
                    }}
                  >
                    {user.name}
                  </span>
                  {/* Level pill */}
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
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 3 }}>
                  {sub}
                </div>
                {/* Compatibility bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginTop: 6,
                  }}
                >
                  <div
                    style={{
                      height: 4,
                      width: 56,
                      borderRadius: 999,
                      background: 'var(--color-bg-deep)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${row.pct}%`,
                        height: '100%',
                        background: 'var(--color-gold)',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: 'var(--color-gold)',
                      fontWeight: 600,
                    }}
                  >
                    {locale === 'en'
                      ? `${row.pct}% match`
                      : t('compatibility', { pct: row.pct })}
                  </span>
                </div>
              </div>

              <button
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: isFollowing ? 'var(--color-wine-red)' : 'transparent',
                  border: `1px solid ${isFollowing ? 'var(--color-wine-red)' : 'var(--color-gold)'}`,
                  color: isFollowing ? 'var(--color-cream)' : 'var(--color-gold)',
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: 'var(--font-inter)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {isFollowing
                  ? locale === 'en' ? 'Following' : '팔로잉'
                  : locale === 'en' ? 'Follow' : '팔로우'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
