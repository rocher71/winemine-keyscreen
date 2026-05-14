'use client';

import { useRouter } from 'next/navigation';
import { BackHeader } from '@/components/nav/back-header';
import { RadioList } from '@/components/settings/radio-list';
import { useTheme, type Theme } from '@/context/theme-context';
import { useLocale } from '@/context/locale-context';
import { toast } from '@/hooks/use-toast';
import { useRegisterFeatures } from '@/context/feature-flag-context';

export default function AppearanceSettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { locale } = useLocale();

  useRegisterFeatures('/settings/appearance', [
    {
      id: 'settings.appearance.radioList',
      labelKo: '테마 라디오',
      labelEn: 'Theme radio',
      defaultStatus: 'planned',
    },
  ]);

  const title = locale === 'en' ? 'Appearance' : '외관';
  const appliedMsg =
    locale === 'en' ? 'Theme applied' : '테마가 적용됐어요';

  return (
    <>
      <BackHeader title={title} />
      <main className="wm-scroll-area" style={{ paddingTop: 12 }}>
        <div data-feature-id="settings.appearance.radioList">
          <RadioList<Theme>
            options={[
              {
                value: 'dark',
                label: locale === 'en' ? 'Dark' : '다크',
                description:
                  locale === 'en'
                    ? 'Original wine bar mood — deep purple background.'
                    : '와인 바 분위기의 짙은 보라 배경.',
              },
              {
                value: 'light',
                label: locale === 'en' ? 'Light' : '라이트',
                description:
                  locale === 'en'
                    ? 'Cream paper background with deep wine accents.'
                    : '크림 종이 배경에 와인 강조색.',
              },
            ]}
            value={theme}
            onChange={(next) => {
              setTheme(next);
              toast({ message: { ko: appliedMsg, en: appliedMsg } });
            }}
          />
        </div>
      </main>
    </>
  );
}
