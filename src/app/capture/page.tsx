'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X, Camera, Image as ImageIcon, Library, BookOpen, Loader2, Sparkles, RotateCcw, Pencil } from 'lucide-react';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import { useLocale } from '@/context/locale-context';
import { useUserData } from '@/context/user-data-context';
import { useMockUser } from '@/hooks/use-mock-user';
import { toast } from '@/hooks/use-toast';
import { getWine } from '@/lib/mock/wines';

/**
 * Capture flow — 라벨 스캔 진입점.
 *
 * 시안 단계라 실제 카메라/파일 업로드는 동작하지 않는다. 카메라 권한 거부 환경에서도
 * UX 흐름을 시연하기 위해 두 가지 진입(카메라 / 갤러리)을 1.5초 mock 분석으로 처리하고
 * 항상 동일한 결과 와인(Terralsole Brunello Riserva 2006)을 인식한 것처럼 노출한다.
 *
 * 결과 카드에서 "노트 작성" 클릭 시 /notes/new/write?from=newEntry&wineId=...로 라우팅한다.
 */

const SAMPLE_WINE_ID = 'tus-brunello-terralsole-riserva';
const SAMPLE_PHOTO_PATH = '/sample-labels/terralsole-brunello-riserva-2006.jpg';

type Stage = 'choose' | 'simulating' | 'recognized';
type Source = 'scan' | 'gallery';

export default function CapturePage() {
  const t = useTranslations('capture');
  const router = useRouter();
  const { locale } = useLocale();
  const { addCellarItem } = useUserData();
  const { user } = useMockUser();
  const [stage, setStage] = useState<Stage>('choose');
  const [source, setSource] = useState<Source>('scan');
  const [photoLoadFailed, setPhotoLoadFailed] = useState(false);
  const wine = getWine(SAMPLE_WINE_ID);

  useRegisterFeatures('/capture', [
    { id: 'capture.options', labelKo: '4개 옵션 카드', labelEn: 'Four option cards', defaultStatus: 'planned' },
    { id: 'capture.simulation', labelKo: 'AI 인식 시뮬', labelEn: 'AI recognition sim', defaultStatus: 'planned' },
  ]);

  function startSimulation(src: Source) {
    setSource(src);
    setStage('simulating');
    setPhotoLoadFailed(false);
    window.setTimeout(() => setStage('recognized'), 1500);
  }

  const cards = [
    {
      id: 'scan',
      icon: <Camera size={32} color="var(--color-wine-red)" strokeWidth={1.5} />,
      title: t('scan.title'),
      sub: t('scan.sub'),
      onClick: () => startSimulation('scan'),
    },
    {
      id: 'gallery',
      icon: <ImageIcon size={32} color="var(--color-gold)" strokeWidth={1.5} />,
      title: t('gallery.title'),
      sub: t('gallery.sub'),
      onClick: () => startSimulation('gallery'),
    },
    {
      id: 'cellar',
      icon: <Library size={32} color="var(--color-cream)" strokeWidth={1.5} />,
      title: t('cellar.title'),
      sub: t('cellar.sub'),
      onClick: () => router.push('/cellar'),
    },
    {
      id: 'note',
      icon: <BookOpen size={32} color="var(--color-text-secondary)" strokeWidth={1.5} />,
      title: t('note.title'),
      sub: t('note.sub'),
      onClick: () => router.push('/notes/new'),
    },
  ];

  return (
    <>
      <header
        style={{
          height: 56,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => (stage === 'choose' ? router.back() : setStage('choose'))}
          aria-label="Close"
          style={{
            all: 'unset',
            cursor: 'pointer',
            width: 36,
            height: 36,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-cream)',
          }}
        >
          <X size={22} strokeWidth={1.75} />
        </button>
        <h1
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 17,
            fontWeight: 600,
            color: 'var(--color-cream)',
            margin: 0,
          }}
        >
          {t('title')}
        </h1>
        <span style={{ width: 36 }} aria-hidden />
      </header>

      <main
        className="wm-scroll-area"
        style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        {stage === 'choose' && (
          <div data-feature-id="capture.options" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cards.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={c.onClick}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 18,
                  height: 104,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 16,
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ flexShrink: 0 }}>{c.icon}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: 18,
                      color: 'var(--color-cream)',
                      marginBottom: 4,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 12,
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.4,
                    }}
                  >
                    {c.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {stage === 'simulating' && (
          <SimulatingView source={source} message={source === 'scan' ? t('simulating.scan') : t('simulating.gallery')} />
        )}

        {stage === 'recognized' && wine && (
          <RecognizedView
            wine={wine}
            locale={locale}
            photoLoadFailed={photoLoadFailed}
            onPhotoError={() => setPhotoLoadFailed(true)}
            onConfirmNote={() => router.push(`/notes/new/write?from=newEntry&wineId=${wine.id}`)}
            onConfirmCellar={() => {
              /* localStorage에 셀러 항목 추가 — 프로필 cellarCount와 /cellar 리스트에 즉시 반영 */
              addCellarItem({
                id: `user-cellar-${Date.now()}`,
                userId: user.id,
                wineId: wine.id,
                acquiredAt: new Date().toISOString().slice(0, 10),
                storage: 'cellar',
                notes: null,
                purchasePriceKrw: wine.averagePriceKrw ?? null,
                notifyAtPeak: false,
                photoUrl: null,
              });
              toast({ message: { ko: '셀러에 추가됨', en: 'Added to cellar' } });
              router.push(`/cellar`);
            }}
            onRetry={() => setStage('choose')}
            onEdit={() => router.push(`/notes/new/write?from=newEntry&wineId=${wine.id}&edit=1`)}
            t={t}
          />
        )}
      </main>
    </>
  );
}

/* ─────────────────────── Simulating View ─────────────────────── */

function SimulatingView({ source, message }: { source: Source; message: string }) {
  return (
    <div
      style={{
        marginTop: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        padding: '40px 20px',
      }}
    >
      {/* 카메라/갤러리 mock 인터페이스 — 검은 사각 + 가이드 또는 그리드 silhouette */}
      <div
        style={{
          width: 240,
          height: 320,
          background: '#000',
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--color-border-default)',
        }}
        aria-hidden
      >
        {source === 'scan' ? (
          <>
            {/* 카메라 가이드 박스 */}
            <div
              style={{
                position: 'absolute',
                inset: 32,
                border: `2px solid var(--color-gold)`,
                borderRadius: 12,
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'wm-pulse 1.5s ease-in-out infinite',
              }}
            >
              <Loader2 size={32} color="var(--color-gold)" />
            </div>
          </>
        ) : (
          <>
            {/* 갤러리 그리드 silhouette */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 2,
                padding: 8,
              }}
            >
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1 / 1',
                    background: `rgba(245, 240, 232, ${0.04 + (i === 4 ? 0.18 : 0)})`,
                    border: i === 4 ? '2px solid var(--color-gold)' : '1px solid rgba(245,240,232,0.06)',
                    borderRadius: 4,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'wm-pulse 1.5s ease-in-out infinite',
              }}
            >
              <Loader2 size={28} color="var(--color-gold)" />
            </div>
          </>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            color: 'var(--color-cream)',
            marginBottom: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Sparkles size={14} color="var(--color-gold)" />
          {message}
        </div>
      </div>

      <style>{`
        @keyframes wm-pulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.95); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────── Recognized View ─────────────────────── */

type Wine = NonNullable<ReturnType<typeof getWine>>;

interface RecognizedViewProps {
  wine: Wine;
  locale: 'ko' | 'en';
  photoLoadFailed: boolean;
  onPhotoError: () => void;
  onConfirmNote: () => void;
  onConfirmCellar: () => void;
  onRetry: () => void;
  onEdit: () => void;
  t: ReturnType<typeof useTranslations>;
}

function RecognizedView({
  wine,
  locale,
  photoLoadFailed,
  onPhotoError,
  onConfirmNote,
  onConfirmCellar,
  onRetry,
  onEdit,
  t,
}: RecognizedViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* AI 인식 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          background: 'rgba(201, 168, 76, 0.08)',
          border: '1px solid var(--color-gold)',
          borderRadius: 12,
        }}
      >
        <Sparkles size={16} color="var(--color-gold)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, fontWeight: 600, color: 'var(--color-cream)' }}>
            {t('recognized.title')}
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'var(--color-text-muted)' }}>
            {t('recognized.subtitle')}
          </div>
        </div>
      </div>

      {/* 와인 카드 */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 16,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* 사진 + 메타 row */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {/* 사진 placeholder */}
          <div
            style={{
              width: 90,
              height: 130,
              flexShrink: 0,
              borderRadius: 8,
              overflow: 'hidden',
              background: `linear-gradient(180deg, ${wine.bottleColor} 0%, #1a0a0e 100%)`,
              border: '1px solid var(--color-border-default)',
              position: 'relative',
            }}
          >
            {!photoLoadFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={SAMPLE_PHOTO_PATH}
                alt={wine.name}
                onError={onPhotoError}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <FallbackLabel wineName={wine.name} producer={wine.producer[locale]} vintage={wine.vintage} />
            )}
          </div>

          {/* 메타 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 17,
                color: 'var(--color-cream)',
                lineHeight: 1.25,
                marginBottom: 4,
              }}
            >
              {wine.name}
            </div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
              {wine.producer[locale]}
            </div>
            <MetaRow label={t('recognized.vintage')} value={String(wine.vintage)} />
            <MetaRow label={t('recognized.region')} value={`${wine.region[locale]}, ${wine.country[locale]}`} />
            <MetaRow label={t('recognized.appellation')} value={wine.appellation[locale]} />
            <MetaRow label={t('recognized.grape')} value={wine.grapes.map((g) => g[locale]).join(', ')} />
            <MetaRow label={t('recognized.drinkWindow')} value={`${wine.drinkWindow.from}–${wine.drinkWindow.to}`} />
          </div>
        </div>

        {photoLoadFailed && (
          <div
            style={{
              padding: 10,
              background: 'rgba(74, 61, 86, 0.2)',
              borderRadius: 8,
              fontFamily: 'var(--font-inter)',
              fontSize: 11,
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: 'var(--color-text-secondary)' }}>{t('fileNotFound.title')}</strong>
            <br />
            {t('fileNotFound.body')}
            <br />
            <span style={{ opacity: 0.7 }}>{t('fileNotFound.hint')}</span>
          </div>
        )}
      </div>

      {/* 액션 — 노트 작성 / 셀러 보관 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="button"
          onClick={onConfirmNote}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '14px 20px',
            background: 'var(--color-wine-red)',
            color: 'var(--color-cream)',
            borderRadius: 12,
            textAlign: 'center',
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {t('recognized.confirmNote')}
        </button>
        <button
          type="button"
          onClick={onConfirmCellar}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '14px 20px',
            background: 'transparent',
            color: 'var(--color-gold)',
            border: '1px solid var(--color-gold)',
            borderRadius: 12,
            textAlign: 'center',
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {t('recognized.confirmCellar')}
        </button>
      </div>

      {/* 보조 액션 — 다시 / 직접 수정 */}
      <div style={{ display: 'flex', gap: 10 }}>
        <SecondaryButton onClick={onRetry} icon={<RotateCcw size={14} />}>
          {t('recognized.retry')}
        </SecondaryButton>
        <SecondaryButton onClick={onEdit} icon={<Pencil size={14} />}>
          {t('recognized.edit')}
        </SecondaryButton>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: 11, marginBottom: 3 }}>
      <span style={{ fontFamily: 'var(--font-inter)', color: 'var(--color-text-muted)', minWidth: 48, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-inter)', color: 'var(--color-cream)', lineHeight: 1.4 }}>{value}</span>
    </div>
  );
}

function SecondaryButton({ onClick, icon, children }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        flex: 1,
        padding: '10px 14px',
        background: 'transparent',
        color: 'var(--color-text-secondary)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 10,
        textAlign: 'center',
        fontFamily: 'var(--font-inter)',
        fontSize: 12,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

/* 이미지 파일 없을 때 SVG fallback — 와인병 모양 + 라벨 텍스트 */
function FallbackLabel({ wineName, producer, vintage }: { wineName: string; producer: string; vintage: number }) {
  return (
    <svg viewBox="0 0 90 130" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden>
      {/* 병 실루엣 */}
      <rect x="22" y="0" width="46" height="20" rx="2" fill="#1a0a0e" />
      <rect x="18" y="18" width="54" height="6" fill="#0e0608" />
      <path d="M 16 24 Q 16 30 14 36 L 14 130 L 76 130 L 76 36 Q 74 30 74 24 Z" fill="#2a0e14" />
      {/* 라벨 */}
      <rect x="20" y="56" width="50" height="56" fill="#f5f0e8" stroke="#c9a84c" strokeWidth="0.5" />
      <text x="45" y="68" textAnchor="middle" fontFamily="serif" fontSize="6" fill="#3a1418" fontWeight="700">
        {producer.split(' ').slice(0, 1).join('')}
      </text>
      <text x="45" y="84" textAnchor="middle" fontFamily="serif" fontSize="4.5" fill="#3a1418">
        {wineName.split(' ').slice(0, 2).join(' ')}
      </text>
      <text x="45" y="92" textAnchor="middle" fontFamily="serif" fontSize="4" fill="#666">
        {wineName.split(' ').slice(2).join(' ')}
      </text>
      <text x="45" y="106" textAnchor="middle" fontFamily="serif" fontSize="5" fill="#c9a84c" fontWeight="700">
        {vintage}
      </text>
    </svg>
  );
}
