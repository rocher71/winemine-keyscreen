'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function SuggestedActions() {
  const t = useTranslations('home.firstTime');
  const router = useRouter();

  const actions = [
    {
      label: t('suggestTour'),
      onClick: () =>
        toast({
          message: {
            ko: 'winemine은 와인 라벨을 찍어 지도로 모으는 앱이에요',
            en: 'winemine captures your wine labels into a personal map',
          },
        }),
    },
    {
      label: t('suggestStarter'),
      onClick: () =>
        toast({
          message: {
            ko: '추천 입문 와인 모달은 추후 연결',
            en: 'Starter recommendations modal — TBD',
          },
        }),
    },
    {
      label: t('suggestExperience'),
      onClick: () => router.push('/settings/experience'),
    },
  ];

  return (
    <section
      data-feature-id="home.suggestedActions"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '0 16px',
        marginTop: 16,
      }}
    >
      {actions.map((a, i) => (
        <button
          key={i}
          type="button"
          onClick={a.onClick}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: 12,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <span>{a.label}</span>
          <ChevronRight size={18} strokeWidth={1.75} color="var(--color-text-muted)" />
        </button>
      ))}
    </section>
  );
}
