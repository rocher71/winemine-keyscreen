'use client';

import { use } from 'react';
import { BackHeader } from '@/components/nav/back-header';
import { TemplateBuilder } from '@/components/tasting-template/template-builder';
import { useTastingTemplates } from '@/context/tasting-template-context';
import { useLocale } from '@/context/locale-context';

export default function EditTastingTemplatePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);
  const { locale } = useLocale();
  const { myCustomTemplates } = useTastingTemplates();
  const existing = myCustomTemplates.find((t) => t.id === templateId);

  if (!existing) {
    return (
      <>
        <BackHeader title={{ ko: '양식 편집', en: 'Edit template' }} />
        <div className="wm-scroll-area">
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>
            {locale === 'en' ? 'Template not found.' : '양식을 찾을 수 없어요.'}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackHeader title={{ ko: '양식 편집', en: 'Edit template' }} />
      <div className="wm-scroll-area" style={{ paddingBottom: 40 }}>
        <TemplateBuilder existing={existing} />
      </div>
    </>
  );
}
