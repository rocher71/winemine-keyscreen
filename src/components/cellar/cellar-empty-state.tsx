'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { GlassWater } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { PrimaryButton } from '@/components/shared/primary-button';

export function CellarEmptyState() {
  const t = useTranslations('cellar.empty');
  const router = useRouter();
  return (
    <EmptyState
      illustration={<GlassWater size={56} strokeWidth={1.25} />}
      title={t('title')}
      description={t('sub')}
      action={
        <PrimaryButton onClick={() => router.push('/capture')} variant="primary">
          {t('cta')}
        </PrimaryButton>
      }
    />
  );
}
