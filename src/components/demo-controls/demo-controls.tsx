'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppMode } from '@/context/app-mode-context';
import { useExperience } from '@/context/experience-context';
import { useLocale } from '@/context/locale-context';
import { toast } from '@/hooks/use-toast';
import { PrimaryButton } from '@/components/shared/primary-button';
import { Copy } from 'lucide-react';
import type { DemoMode, Experience, Locale } from '@/types';

/**
 * 데스크톱 좌측 사이드 패널 (≥1024px). 모바일/태블릿에서는 숨김.
 *
 * 세 가지 모드 라디오 (demo, experience, language) + 부가 액션 4종 (온보딩 다시 보기,
 * 푸시 시뮬, +50 XP, 셀러 항목 추가) + 현재 URL 미리보기/복사.
 *
 * 각 모드 변경은 LocaleContext/AppMode/Experience를 통해 URL + localStorage 동기화.
 */
export function DemoControls() {
  const t = useTranslations('demoControls');
  const { demoMode, setDemoMode } = useAppMode();
  const { experience, setExperience } = useExperience();
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    setCurrentUrl(`${url.pathname}${url.search}`);
  }, [pathname, search]);

  const onShowOnboarding = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('winemine.onboardingComplete');
    }
    setDemoMode('first-time');
    router.push('/onboarding');
  };

  const onSimulatePush = () => {
    toast({
      variant: 'default',
      message: { ko: t('pushSimulated'), en: t('pushSimulated') },
    });
  };

  const onPlusXp = () => {
    toast({
      variant: 'xp',
      xp: 50,
      message: { ko: t('xpAdded'), en: t('xpAdded') },
    });
  };

  const onAddCellar = () => {
    toast({ message: { ko: t('cellarAdded'), en: t('cellarAdded') } });
  };

  const onCopy = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        message:
          locale === 'en'
            ? { ko: 'Copied', en: 'Copied' }
            : { ko: '복사됐어요', en: 'Copied' },
      });
    } catch {
      /* ignore */
    }
  };

  return (
    <aside className="wm-side-panel-left" aria-label={t('title')}>
      <h2
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 18,
          color: 'var(--color-cream)',
          margin: '0 0 12px',
        }}
      >
        {t('title')}
      </h2>

      <RadioGroup
        label={t('demoMode')}
        value={demoMode}
        onChange={(v) => setDemoMode(v as DemoMode)}
        options={[
          { value: 'first-time', label: t('firstTime') },
          { value: 'heavy', label: t('heavy') },
        ]}
      />

      <RadioGroup
        label={t('experience')}
        value={experience}
        onChange={(v) => setExperience(v as Experience)}
        options={[
          { value: 'beginner', label: t('beginner') },
          { value: 'expert', label: t('expert') },
        ]}
      />

      <RadioGroup
        label={t('language')}
        value={locale}
        onChange={(v) => setLocale(v as Locale)}
        options={[
          { value: 'ko', label: t('ko') },
          { value: 'en', label: t('en') },
        ]}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
        <PrimaryButton variant="secondary" size="sm" block onClick={onShowOnboarding}>
          {t('showOnboarding')}
        </PrimaryButton>
        <PrimaryButton variant="secondary" size="sm" block onClick={onSimulatePush}>
          {t('simulatePush')}
        </PrimaryButton>
        <PrimaryButton variant="secondary" size="sm" block onClick={onPlusXp}>
          {t('plusXp')}
        </PrimaryButton>
        <PrimaryButton variant="secondary" size="sm" block onClick={onAddCellar}>
          {t('addCellar')}
        </PrimaryButton>
      </div>

      <div style={{ marginTop: 16 }}>
        <div
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 6,
          }}
        >
          {t('urlPreview')}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--color-bg-deepest)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 8,
            padding: '8px 10px',
          }}
        >
          <code
            style={{
              flex: 1,
              fontFamily: 'monospace',
              fontSize: 11,
              color: 'var(--color-text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {currentUrl}
          </code>
          <button
            type="button"
            onClick={onCopy}
            aria-label={t('copy')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-gold)',
              cursor: 'pointer',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Copy size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <fieldset
      style={{
        border: 'none',
        padding: 0,
        margin: '0 0 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <legend
        style={{
          padding: 0,
          fontFamily: 'var(--font-inter)',
          fontSize: 11,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: 4,
        }}
      >
        {label}
      </legend>
      <div
        role="radiogroup"
        style={{ display: 'flex', gap: 6 }}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              type="button"
              key={opt.value}
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: 8,
                background: active ? 'var(--color-wine-red)' : 'transparent',
                border: `1px solid ${active ? 'var(--color-wine-red)' : 'var(--color-border-default)'}`,
                color: active ? 'var(--color-cream)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-inter)',
                fontWeight: 500,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
