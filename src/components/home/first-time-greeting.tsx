'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Camera } from 'lucide-react';
import { PrimaryButton } from '@/components/shared/primary-button';
import { useLocalizedText } from '@/components/shared/locale-text';
import type { User } from '@/types';

export function FirstTimeGreeting({ user }: { user: User }) {
  const t = useTranslations('home.firstTime');
  const router = useRouter();
  const name = useLocalizedText(user.displayName);

  return (
    <div
      data-feature-id="home.firstTimeGreeting"
      style={{
        margin: '8px 16px 0',
        borderRadius: 20,
        padding: 24,
        background:
          'linear-gradient(135deg, var(--color-surface) 0%, rgba(139,26,42,0.18) 100%)',
        border: '1px solid var(--color-border-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minHeight: 220,
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
        }}
      >
        {useTranslations('home')('greetingNew', { name })}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 28,
          lineHeight: 1.2,
          color: 'var(--color-cream)',
        }}
      >
        {t('greeting')}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 14,
          color: 'var(--color-text-muted)',
        }}
      >
        {t('sub')}
      </div>
      <PrimaryButton
        variant="primary"
        size="lg"
        block
        leadingIcon={<Camera size={18} strokeWidth={1.75} />}
        onClick={() => router.push('/capture')}
        style={{ marginTop: 8 }}
      >
        {t('scanCta')}
      </PrimaryButton>
    </div>
  );
}
