'use client';

import { useTranslations } from 'next-intl';
import { toast } from '@/hooks/use-toast';

/**
 * 지도 우상단 작은 범례 패널.
 */
export function MapLegend() {
  const t = useTranslations('map');
  return (
    <button
      type="button"
      onClick={() =>
        toast({
          message: { ko: t('legendToast'), en: t('legendToast') },
        })
      }
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        width: 120,
        height: 70,
        padding: 10,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 10,
        cursor: 'pointer',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      aria-label="Legend"
    >
      <div
        style={{
          height: 6,
          width: '100%',
          borderRadius: 3,
          background:
            'linear-gradient(90deg, rgba(139,26,42,0.25) 0%, rgba(139,26,42,1) 100%)',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-inter)',
          fontSize: 10,
          color: 'var(--color-text-muted)',
        }}
      >
        <span>{t('legendOne')}</span>
        <span>{t('legendMany')}</span>
      </div>
    </button>
  );
}
