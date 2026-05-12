'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { SectionDivider } from '@/components/settings/section-divider';
import { useLocale } from '@/context/locale-context';
import { useExperience } from '@/context/experience-context';
import { toast } from '@/hooks/use-toast';
import { useRegisterFeatures } from '@/context/feature-flag-context';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const { locale } = useLocale();
  const { experience } = useExperience();

  useRegisterFeatures('/settings', [
    { id: 'settings.appSection', labelKo: '앱 섹션', labelEn: 'App section', defaultStatus: 'planned' },
    { id: 'settings.notifSection', labelKo: '알림 섹션', labelEn: 'Notif section', defaultStatus: 'planned' },
    { id: 'settings.accountSection', labelKo: '계정 섹션', labelEn: 'Account section', defaultStatus: 'planned' },
    { id: 'settings.aboutSection', labelKo: '정보 섹션', labelEn: 'About section', defaultStatus: 'planned' },
  ]);

  const localeLabel = locale === 'en' ? t('values.en') : t('values.ko');
  const expLabel = experience === 'expert' ? t('values.expert') : t('values.beginner');

  return (
    <>
      <BackHeader title={t('title')} />
      <main className="wm-scroll-area">
        <SectionDivider title={t('sections.app')} />
        <div data-feature-id="settings.appSection">
          <SettingRow
            href={'/settings/language' as Route}
            label={t('items.language')}
            value={localeLabel}
          />
          <SettingRow
            href={'/settings/experience' as Route}
            label={t('items.experience')}
            value={expLabel}
          />
        </div>

        <SectionDivider title={t('sections.notifications')} />
        <div data-feature-id="settings.notifSection">
          <SettingRow
            href={'/settings/notifications' as Route}
            label={t('items.notifSettings')}
          />
        </div>

        <SectionDivider title={t('sections.account')} />
        <div data-feature-id="settings.accountSection">
          <SettingRow
            label={t('items.changeNickname')}
            onClick={() => toast({ message: t('nicknameToast') })}
          />
          <SettingRow
            label={t('items.signOut')}
            onClick={() => toast({ message: t('nicknameToast') })}
          />
        </div>

        <SectionDivider title={t('sections.about')} />
        <div data-feature-id="settings.aboutSection">
          <SettingRow label={t('items.version')} value="1.0.0" />
          <SettingRow
            label={t('items.terms')}
            onClick={() => toast({ message: t('termsToast') })}
          />
          <SettingRow
            label={t('items.privacy')}
            onClick={() => toast({ message: t('privacyToast') })}
          />
        </div>
        <div style={{ height: 32 }} />
      </main>
    </>
  );
}

const SETTING_ROW_STYLE = {
  display: 'flex' as const,
  alignItems: 'center' as const,
  padding: '14px 20px',
  margin: '4px 16px',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 12,
  color: 'var(--color-cream)',
  fontFamily: 'var(--font-inter)',
  fontSize: 14,
  fontWeight: 500,
  textDecoration: 'none' as const,
};

function SettingRow({
  href,
  onClick,
  label,
  value,
}: {
  href?: Route;
  onClick?: () => void;
  label: string;
  value?: string;
}) {
  const inner = (
    <>
      <span style={{ flex: 1 }}>{label}</span>
      {value && (
        <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{value}</span>
      )}
      {(href || onClick) && (
        <ChevronRight size={16} color="var(--color-text-muted)" style={{ marginLeft: 6 }} />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} style={{ ...SETTING_ROW_STYLE, cursor: 'pointer' }}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          ...SETTING_ROW_STYLE,
          width: 'auto',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {inner}
      </button>
    );
  }
  return <div style={SETTING_ROW_STYLE}>{inner}</div>;
}
