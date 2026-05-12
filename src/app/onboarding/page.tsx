'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2, GlassWater, Award, Camera, ArrowRight } from 'lucide-react';
import { useAppMode } from '@/context/app-mode-context';
import { useExperience } from '@/context/experience-context';
import { useLocale } from '@/context/locale-context';
import { PrimaryButton } from '@/components/shared/primary-button';
import type { Experience, Locale } from '@/types';

type Step = 'welcome' | 'language' | 'experience' | 'done';

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const router = useRouter();
  const { demoMode } = useAppMode();
  const { setLocale } = useLocale();
  const { setExperience } = useExperience();

  const [step, setStep] = useState<Step>('welcome');
  const [pickedLocale, setPickedLocale] = useState<Locale | null>(null);
  const [pickedExp, setPickedExp] = useState<Experience | null>(null);

  // 가드 — heavy 모드 또는 이미 완료한 사용자는 / 로 리다이렉트
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (demoMode !== 'first-time') {
      router.replace('/');
      return;
    }
    const done = window.localStorage.getItem('winemine.onboardingComplete');
    if (done === 'true') {
      router.replace('/');
    }
  }, [demoMode, router]);

  const finish = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('winemine.onboardingComplete', 'true');
    }
    router.replace('/');
  };

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px 40px',
        gap: 24,
        background: 'var(--color-bg-deepest)',
      }}
    >
      {step === 'welcome' && <StepWelcome onNext={() => setStep('language')} t={t} />}
      {step === 'language' && (
        <StepLanguage
          picked={pickedLocale}
          onPick={(v) => {
            setPickedLocale(v);
            setLocale(v);
          }}
          onNext={() => setStep('experience')}
          t={t}
        />
      )}
      {step === 'experience' && (
        <StepExperience
          picked={pickedExp}
          onPick={(v) => {
            setPickedExp(v);
            setExperience(v);
          }}
          onNext={() => setStep('done')}
          t={t}
        />
      )}
      {step === 'done' && (
        <StepDone
          onScan={() => {
            finish();
            router.push('/capture');
          }}
          onTour={finish}
          t={t}
        />
      )}
    </main>
  );
}

/* ──────────────────────────── Steps ──────────────────────────── */

function StepWelcome({ onNext, t }: { onNext: () => void; t: ReturnType<typeof useTranslations> }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 56,
          color: 'var(--color-cream)',
          letterSpacing: '-0.02em',
          margin: 0,
          lineHeight: 1,
        }}
      >
        winemine
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-playfair)',
          fontStyle: 'italic',
          fontSize: 18,
          color: 'var(--color-gold)',
          margin: 0,
        }}
      >
        {t('tagline')}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          background:
            'radial-gradient(circle at 50% 35%, rgba(245,240,232,0.18) 0%, rgba(139,26,42,0.18) 60%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 12,
        }}
      >
        <GlassWater size={56} strokeWidth={1.25} color="var(--color-gold)" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        style={{ marginTop: 'auto', width: '100%' }}
      >
        <PrimaryButton variant="primary" size="lg" block onClick={onNext}>
          {t('getStarted')}
        </PrimaryButton>
      </motion.div>
    </div>
  );
}

function StepLanguage({
  picked,
  onPick,
  onNext,
  t,
}: {
  picked: Locale | null;
  onPick: (v: Locale) => void;
  onNext: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 28,
          color: 'var(--color-cream)',
          margin: 0,
        }}
      >
        {t('language.title')}
      </h2>
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
        {t('language.subtitle')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        <ChoiceCard
          active={picked === 'ko'}
          title={t('language.ko')}
          icon="KR"
          onClick={() => onPick('ko')}
        />
        <ChoiceCard
          active={picked === 'en'}
          title={t('language.en')}
          icon="EN"
          onClick={() => onPick('en')}
        />
      </div>
      <div style={{ marginTop: 'auto' }}>
        <PrimaryButton variant="primary" size="lg" block disabled={!picked} onClick={onNext}>
          {useTranslations('common')('next')}
        </PrimaryButton>
      </div>
    </div>
  );
}

function StepExperience({
  picked,
  onPick,
  onNext,
  t,
}: {
  picked: Experience | null;
  onPick: (v: Experience) => void;
  onNext: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 26,
          color: 'var(--color-cream)',
          margin: 0,
        }}
      >
        {t('experience.title')}
      </h2>
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
        {t('experience.subtitle')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        <ExperienceCard
          active={picked === 'beginner'}
          title={t('experience.beginnerLabel')}
          sub={t('experience.beginnerSub')}
          icon={<GlassWater size={24} strokeWidth={1.5} color="var(--color-gold)" />}
          onClick={() => onPick('beginner')}
        />
        <ExperienceCard
          active={picked === 'expert'}
          title={t('experience.expertLabel')}
          sub={t('experience.expertSub')}
          icon={<Award size={24} strokeWidth={1.5} color="var(--color-gold)" />}
          onClick={() => onPick('expert')}
        />
      </div>
      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 12,
          color: 'var(--color-text-muted)',
          margin: 0,
        }}
      >
        {t('experience.footer')}
      </p>
      <div style={{ marginTop: 'auto' }}>
        <PrimaryButton variant="primary" size="lg" block disabled={!picked} onClick={onNext}>
          {useTranslations('common')('next')}
        </PrimaryButton>
      </div>
    </div>
  );
}

function StepDone({
  onScan,
  onTour,
  t,
}: {
  onScan: () => void;
  onTour: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
      >
        <CheckCircle2 size={80} strokeWidth={1.5} color="var(--color-gold)" />
      </motion.div>
      <h2
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 26,
          color: 'var(--color-cream)',
          margin: 0,
        }}
      >
        {t('done.title')}
      </h2>
      <p style={{ fontFamily: 'var(--font-inter)', fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
        {t('done.subtitle')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 'auto' }}>
        <PrimaryButton variant="primary" size="lg" block leadingIcon={<Camera size={18} />} onClick={onScan}>
          {t('done.scanCta')}
        </PrimaryButton>
        <PrimaryButton variant="secondary" size="lg" block trailingIcon={<ArrowRight size={18} />} onClick={onTour}>
          {t('done.tourCta')}
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ──────────────────────────── Cards ──────────────────────────── */

function ChoiceCard({
  active,
  title,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        height: 96,
        padding: '0 18px',
        borderRadius: 16,
        background: 'var(--color-surface)',
        border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border-default)'}`,
        boxShadow: active ? '0 0 0 1px rgba(139,26,42,0.4)' : 'none',
        opacity: active ? 1 : 0.85,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          background: 'rgba(201,168,76,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-playfair)',
          fontSize: 16,
          color: 'var(--color-gold)',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--color-cream)',
        }}
      >
        {title}
      </span>
    </button>
  );
}

function ExperienceCard({
  active,
  title,
  sub,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  sub: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: 18,
        borderRadius: 16,
        background: 'var(--color-surface)',
        border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border-default)'}`,
        boxShadow: active ? '0 0 0 1px rgba(139,26,42,0.4)' : 'none',
        opacity: active ? 1 : 0.85,
      }}
    >
      <div style={{ paddingTop: 2 }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--color-cream)',
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            color: 'var(--color-text-muted)',
            lineHeight: 1.4,
          }}
        >
          {sub}
        </span>
      </div>
    </button>
  );
}
