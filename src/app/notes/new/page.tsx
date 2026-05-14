'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { BackHeader } from '@/components/nav/back-header';
import { BottomSheet } from '@/components/shared/bottom-sheet';
import { LocaleText } from '@/components/shared/locale-text';
import { SourcePicker } from '@/components/tasting-note/source-picker';
import { useMockUser } from '@/hooks/use-mock-user';
import { useLocale } from '@/context/locale-context';
import { useTastingTemplates } from '@/context/tasting-template-context';
import { getCellarByUser } from '@/lib/mock/cellar';
import { getWine } from '@/lib/mock/wines';
import { BUILTIN_BEGINNER_ID, BUILTIN_EXPERT_ID } from '@/lib/mock/tasting-templates';
import { useRegisterFeatures } from '@/context/feature-flag-context';
import type { TastingNoteSource, TastingTemplate } from '@/types';

/**
 * 노트 작성 진입: 두 단계.
 *  1. 양식(template) 선택 — winemine 입문자/전문자 + 저장한 커뮤니티 + 내 커스텀
 *  2. 출처 선택 — 셀러 vs 새 와인
 *
 * 이후 /notes/new/write?templateId=X&from=Y로 라우팅.
 */
export default function NewNoteSourcePage() {
  const t = useTranslations('notes.source');
  const router = useRouter();
  const { user } = useMockUser();
  const { locale } = useLocale();
  const { availableTemplates } = useTastingTemplates();
  const cellar = getCellarByUser(user.id);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [pickOpen, setPickOpen] = useState(false);

  useRegisterFeatures('/notes/new', [
    { id: 'notes.templatePicker', labelKo: '양식 선택', labelEn: 'Template picker', defaultStatus: 'planned' },
    { id: 'notes.sourcePicker', labelKo: '출처 선택', labelEn: 'Source picker', defaultStatus: 'planned' },
  ]);

  const onPickSource = (source: TastingNoteSource) => {
    const tid = selectedTemplateId ?? BUILTIN_BEGINNER_ID;
    if (source === 'newEntry') {
      router.push(`/notes/new/write?from=newEntry&templateId=${encodeURIComponent(tid)}` as Route);
      return;
    }
    setPickOpen(true);
  };

  return (
    <>
      <BackHeader title={t('title')} />
      <main className="wm-scroll-area" style={{ padding: '12px 16px 32px' }}>
        {!selectedTemplateId ? (
          <section data-feature-id="notes.templatePicker">
            <header style={{ marginBottom: 14 }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--color-cream)',
                }}
              >
                {locale === 'en' ? 'Choose a note style' : '어떤 양식으로 적을까요?'}
              </h2>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: 13,
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.5,
                }}
              >
                {locale === 'en'
                  ? 'Pick a tasting note template. You can edit or create your own in Settings.'
                  : '테이스팅 노트 양식을 골라주세요. 설정에서 직접 만들 수도 있어요.'}
              </p>
            </header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {availableTemplates.map((tpl) => (
                <TemplateCard
                  key={tpl.id}
                  template={tpl}
                  locale={locale}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                />
              ))}
            </div>
          </section>
        ) : (
          <section data-feature-id="notes.sourcePicker">
            <button
              type="button"
              onClick={() => setSelectedTemplateId(null)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontSize: 11,
                color: 'var(--color-gold)',
                marginBottom: 12,
                display: 'inline-block',
                fontWeight: 600,
              }}
            >
              ← {locale === 'en' ? 'Change template' : '양식 다시 선택'}
            </button>
            <SourcePicker cellarCount={cellar.length} onPick={onPickSource} />
          </section>
        )}
      </main>

      <BottomSheet open={pickOpen} onClose={() => setPickOpen(false)}>
        <div style={{ padding: '0 4px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 18,
              color: 'var(--color-cream)',
              margin: '4px 8px 12px',
            }}
          >
            {t('cellarListTitle')}
          </h2>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              maxHeight: '50vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {cellar.map((it) => {
              const wine = getWine(it.wineId);
              if (!wine) return null;
              const tid = selectedTemplateId ?? BUILTIN_BEGINNER_ID;
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => {
                      router.push(
                        `/notes/new/write?from=cellar&itemId=${encodeURIComponent(it.id)}&templateId=${encodeURIComponent(tid)}` as Route,
                      );
                    }}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                      padding: 10,
                      width: '100%',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 10,
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        width: 32,
                        height: 44,
                        borderRadius: 4,
                        background: `linear-gradient(160deg, ${wine.bottleColor} 0%, #1a0a1e 70%)`,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: 13,
                          color: 'var(--color-cream)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {wine.name}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: 11,
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {wine.vintage} · <LocaleText value={wine.region} />
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </BottomSheet>
    </>
  );
}

function TemplateCard({
  template,
  locale,
  onClick,
}: {
  template: TastingTemplate;
  locale: 'ko' | 'en';
  onClick: () => void;
}) {
  const subtitle =
    template.kind === 'builtinBeginner' || template.kind === 'builtinExpert'
      ? locale === 'en'
        ? 'by winemine'
        : 'winemine 제공'
      : template.authorName
        ? `${locale === 'en' ? 'by' : 'by'} ${locale === 'ko' ? template.authorName.ko : template.authorName.en}`
        : '';

  const isCustom = template.kind === 'custom';

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        gap: 12,
        padding: '14px 16px',
        background: 'var(--color-surface)',
        border: `1px solid ${isCustom ? 'rgba(201,168,76,0.4)' : 'var(--color-border-default)'}`,
        borderRadius: 14,
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 14,
              color: 'var(--color-cream)',
              fontWeight: 600,
            }}
          >
            <LocaleText value={template.title} />
          </span>
          {isCustom && (
            <span
              style={{
                padding: '2px 7px',
                borderRadius: 999,
                background: 'rgba(201,168,76,0.15)',
                border: '1px solid rgba(201,168,76,0.4)',
                fontSize: 9,
                color: 'var(--color-gold)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {locale === 'en' ? 'Custom' : '커스텀'}
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{subtitle}</div>
        {template.description && (
          <div
            style={{
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              marginTop: 6,
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            <LocaleText value={template.description} />
          </div>
        )}
      </div>
      <ChevronRight size={16} color="var(--color-text-muted)" />
    </button>
  );
}
