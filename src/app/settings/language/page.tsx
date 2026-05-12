'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BackHeader } from '@/components/nav/back-header';
import { RadioList } from '@/components/settings/radio-list';
import { useLocale } from '@/context/locale-context';
import { toast } from '@/hooks/use-toast';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import type { Locale } from '@/types';

export default function LanguageSettingsPage() {
  const router = useRouter();
  const t = useTranslations('settings.languagePage');
  const tSettings = useTranslations('settings.values');
  const { locale, setLocale } = useLocale();

  useRegisterFeatures('/settings/language', [
    { id: 'settings.language.radioList', labelKo: '라디오 리스트', labelEn: 'Radio list', defaultStatus: 'planned' },
  ]);

  return (
    <>
      <BackHeader title={t('title')} />
      <main className="wm-scroll-area" style={{ paddingTop: 12 }}>
        <div data-feature-id="settings.language.radioList">
          <RadioList<Locale>
            options={[
              { value: 'ko', label: tSettings('ko') },
              { value: 'en', label: tSettings('en') },
            ]}
            value={locale}
            onChange={(next) => {
              setLocale(next);
              toast({ message: t('appliedToast') });
              setTimeout(() => router.back(), 250);
            }}
          />
        </div>
      </main>
    </>
  );
}
