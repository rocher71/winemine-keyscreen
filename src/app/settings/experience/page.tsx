'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BackHeader } from '@/components/nav/back-header';
import { RadioList } from '@/components/settings/radio-list';
import { useExperience } from '@/context/experience-context';
import { toast } from '@/hooks/use-toast';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import type { Experience } from '@/types';

export default function ExperienceSettingsPage() {
  const router = useRouter();
  const t = useTranslations('settings.experiencePage');
  const tValues = useTranslations('settings.values');
  const { experience, setExperience } = useExperience();

  useRegisterFeatures('/settings/experience', [
    { id: 'settings.experience.radioList', labelKo: '라디오 리스트', labelEn: 'Radio list', defaultStatus: 'planned' },
  ]);

  return (
    <>
      <BackHeader title={t('title')} />
      <main className="wm-scroll-area" style={{ paddingTop: 12 }}>
        <div data-feature-id="settings.experience.radioList">
          <RadioList<Experience>
            options={[
              { value: 'beginner', label: tValues('beginner'), description: t('beginnerDesc') },
              { value: 'expert', label: tValues('expert'), description: t('expertDesc') },
            ]}
            value={experience}
            onChange={(next) => {
              setExperience(next);
              toast({ message: t('appliedToast') });
              setTimeout(() => router.back(), 280);
            }}
          />
        </div>
      </main>
    </>
  );
}
