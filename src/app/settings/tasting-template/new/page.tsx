'use client';

import { BackHeader } from '@/components/nav/back-header';
import { TemplateBuilder } from '@/components/tasting-template/template-builder';

export default function NewTastingTemplatePage() {
  return (
    <>
      <BackHeader title={{ ko: '새 양식 만들기', en: 'New template' }} />
      <div className="wm-scroll-area" style={{ paddingBottom: 40 }}>
        <TemplateBuilder />
      </div>
    </>
  );
}
