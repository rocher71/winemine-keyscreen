'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X, Camera, Library, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRegisterFeatures } from '@/context/feature-flag-context';

export default function CapturePage() {
  const t = useTranslations('capture');
  const router = useRouter();

  useRegisterFeatures('/capture', [
    { id: 'capture.options', labelKo: '3개 옵션 카드', labelEn: 'Three option cards', defaultStatus: 'planned' },
  ]);

  const cards = [
    {
      icon: <Camera size={32} color="var(--color-wine-red)" strokeWidth={1.5} />,
      title: t('scan.title'),
      sub: t('scan.sub'),
      onClick: () => toast({ message: t('scan.toast') }),
    },
    {
      icon: <Library size={32} color="var(--color-gold)" strokeWidth={1.5} />,
      title: t('cellar.title'),
      sub: t('cellar.sub'),
      onClick: () => toast({ message: t('scan.toast') }),
    },
    {
      icon: <BookOpen size={32} color="var(--color-cream)" strokeWidth={1.5} />,
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
          onClick={() => router.back()}
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
        <div data-feature-id="capture.options" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cards.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={c.onClick}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 18,
                height: 120,
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
      </main>
    </>
  );
}
