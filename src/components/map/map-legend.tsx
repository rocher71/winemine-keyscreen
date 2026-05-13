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
        top: 14,
        left: 14,
        width: 110,
        padding: '8px 10px',
        background: 'rgba(45,30,56,0.78)',
        border: '1px solid rgba(245,240,232,0.18)',
        borderRadius: 10,
        cursor: 'pointer',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      aria-label="Legend"
    >
      <div
        style={{
          height: 7,
          width: '100%',
          borderRadius: 4,
          background:
            'linear-gradient(90deg, rgba(139,26,42,0.08) 0%, rgba(139,26,42,0.35) 35%, rgba(139,26,42,0.7) 70%, rgba(139,26,42,1) 100%)',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-inter)',
          fontSize: 9,
          color: 'var(--color-text-secondary)',
          fontWeight: 500,
        }}
      >
        <span>{t('legendOne')}</span>
        <span>{t('legendMany')}</span>
      </div>
    </button>
  );
}
