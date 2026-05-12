'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { GlassWater } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

type Props = {
  cellarItemId: string;
};

/**
 * 셀러 와인 상세 하단 풀폭 CTA. 클릭 시 confirm → /notes/new/write?from=cellar&itemId=...
 */
export function DrinkThisButton({ cellarItemId }: Props) {
  const router = useRouter();
  const t = useTranslations('cellar');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          width: '100%',
          height: 52,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: 'var(--color-wine-red)',
          color: 'var(--color-cream)',
          border: 'none',
          borderRadius: 14,
          fontFamily: 'var(--font-inter)',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {t('drinkThis')}
        <GlassWater size={18} strokeWidth={1.75} />
      </button>

      <ConfirmDialog
        open={open}
        title={t('drinkThisConfirm')}
        confirmLabel={tCommon('yes')}
        cancelLabel={tCommon('no')}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          router.push(
            `/notes/new/write?from=cellar&itemId=${encodeURIComponent(cellarItemId)}` as Route,
          );
        }}
      />
    </>
  );
}
